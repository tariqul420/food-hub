/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/fetcher";
import getStatusIcon, {
  getStatusColorClass,
  getStatusLabel,
} from "@/lib/utils/status";
import { ProviderOrderRecord } from "@/types/table-columns";
import {
  IconCalendar,
  IconEye,
  IconMapPin,
  IconPackage,
  IconPhone,
  IconUser,
} from "@tabler/icons-react";
import type { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import StatusChangeSelect from "./status-change-select";

interface AdminOrderTableMenuProps {
  row: Row<ProviderOrderRecord>;
}

const fmt = (v: number | string) => {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n.toLocaleString("en-BD") : String(v ?? "");
};

export default function OrderTableMenu({ row }: AdminOrderTableMenuProps) {
  const ord = row.original as any;
  const currency = typeof ord.currency === "string" ? ord.currency : "";

  const computedSubtotal: number = (ord.items ?? []).reduce(
    (acc: number, it: any) => {
      const qty = Number(it.quantity ?? it.qty ?? 1) || 0;
      const unit = Number(it.unitPrice ?? 0) || 0;
      const line = Number(it.subtotal ?? unit * qty) || unit * qty;
      return acc + (Number.isFinite(line) ? line : 0);
    },
    0,
  );

  const deliveryFee = 2.0;
  const taxRate = 0.1; // 10%
  const tax = computedSubtotal * taxRate;

  const displayedTotal: number =
    typeof ord.total === "number"
      ? ord.total
      : computedSubtotal + deliveryFee + tax;
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = async () => {
    if (!ord.id) return toast.error("Order ID is missing");

    toast.promise(api.del(`/orders/${ord.id}`), {
      loading: "Deleting order...",
      success: () => {
        return "Order deleted successfully";
      },
      error: "Failed to delete order",
    });
    setIsDeleteOpen(false);
  };

  const handleCopy = () => {
    type OrderItemLocal = {
      id?: string;
      meal?: { title?: string } | null;
      title?: string;
      quantity?: number;
      qty?: number;
      unitPrice?: number;
      subtotal?: number;
      total?: number;
      image?: { url?: string } | null;
      product?: { images?: Array<{ url?: string }> } | null;
    };

    const itemsArr = (ord.items ?? []) as OrderItemLocal[];
    const itemsLines = itemsArr.length
      ? itemsArr
          .map((it, i) => {
            const title = it.meal?.title ?? it.title ?? "Item";
            const qty = it.quantity ?? it.qty ?? 1;
            const unit = it.unitPrice ?? 0;
            const lineTotal = it.subtotal ?? unit * qty;
            return `${i + 1}. ${title} — ${qty} × ${fmt(unit)} = ${fmt(lineTotal)}`;
          })
          .join("\n")
      : "No items";

    const text = `Order ID: ${ord.id}
Customer: ${ord.customer?.name ?? ord.customerName ?? "-"}
Phone: ${ord.customer?.phone ?? ord.customerPhone ?? "-"}
Address: ${ord.deliveryAddress ?? ord.shippingAddress ?? "-"}
${ord.orderNote ? `Note: ${ord.orderNote}\n` : ""}Payment: ${ord.paymentMethod ?? "-"}
Source: ${ord.source ?? "-"}
Currency: ${ord.currency ?? ""}

Items:
${itemsLines}

Subtotal: ${fmt(computedSubtotal)}${currency}
Delivery Fee: ${fmt(deliveryFee)}${currency}
Tax (10%): ${fmt(tax)}${currency}
Total: ${fmt(displayedTotal)}${currency}`;

    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied invoice to clipboard."))
      .catch(() => toast.error("Copy failed"));
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsViewOpen(true)}
        className="h-8 w-8 p-0"
        title="View order details"
      >
        <IconEye className="h-4 w-4" />
      </Button>

      {/* View Order Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-h-[90vh] w-[min(98vw,1100px)] max-w-2xl md:min-w-3xl overflow-auto p-0">
          {/* Header */}
          <DialogHeader className="bg-background sticky top-0 z-10 border-b px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-xl font-semibold">
                  Order Details
                </DialogTitle>
                <DialogDescription>Order ID: {ord.id}</DialogDescription>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={`gap-1 px-2 capitalize ${getStatusColorClass(ord.status)}`}
                    title={getStatusLabel(ord.status)}
                  >
                    {getStatusIcon(ord.status)}
                    {getStatusLabel(ord.status)}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Invoice
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="px-6 py-5 space-y-6">
            {/* Customer */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <IconUser className="text-muted-foreground h-5 w-5" />
                <h3 className="text-lg font-medium">Customer</h3>
              </div>
              <div className="grid gap-3 rounded-xl border p-4">
                <div className="flex items-center gap-2">
                  <IconUser className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    {ord.customer?.name ?? ord.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    {ord.customer?.email ?? ord.customerPhone ?? "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMapPin className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    {ord.deliveryAddress ?? ord.shippingAddress ?? "-"}
                  </span>
                </div>
              </div>
            </section>

            {/* Items (full width) */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <IconPackage className="text-muted-foreground h-5 w-5" />
                <h3 className="text-lg font-medium">Items</h3>
              </div>

              <div className="rounded-xl border">
                {/* desktop header */}
                <div className="hidden grid-cols-12 gap-3 border-b px-4 py-2 text-xs text-muted-foreground sm:grid">
                  <div className="col-span-7">Product</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-1 text-right">Price</div>
                  <div className="col-span-2 text-right">Line Total</div>
                </div>

                {ord.items?.length ? (
                  ord.items.map(
                    (it: (typeof ord.items)[number], idx: number) => {
                      const thumb = it.image?.url ?? null;

                      return (
                        <div
                          key={it.id ?? idx}
                          className="border-b last:border-b-0 px-4 py-3"
                        >
                          {/* mobile layout */}
                          <div className="flex items-center gap-3 sm:hidden">
                            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                              {thumb ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={thumb}
                                  alt={it.meal?.title ?? it.title ?? "Item"}
                                  className="w-full h-full rounded object-cover ring-1 ring-border"
                                />
                              ) : (
                                <div className="h-full w-full" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium">
                                {it.meal?.title ?? it.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {it.quantity ?? it.qty} ×{" "}
                                {fmt(it.unitPrice ?? 0)}
                                {currency} • {fmt(it.subtotal ?? it.total ?? 0)}
                                {currency}
                              </div>
                            </div>
                          </div>

                          {/* desktop layout */}
                          <div className="hidden grid-cols-12 items-center gap-3 sm:grid">
                            <div className="col-span-7 flex items-center gap-3">
                              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                                {thumb ? (
                                  <Image
                                    src={thumb}
                                    alt={it.meal?.title ?? it.title ?? "Item"}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">
                                  {it.meal?.title ?? it.title}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 text-right text-sm">
                              {it.quantity ?? it.qty}
                            </div>
                            <div className="col-span-1 text-right text-sm">
                              {fmt(it.unitPrice ?? 0)}
                              {currency}
                            </div>
                            <div className="col-span-2 text-right text-sm font-medium">
                              {fmt(it.subtotal ?? it.total ?? 0)}
                              {currency}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No items
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="ml-auto w-full space-y-2 rounded-xl border p-4">
                {computedSubtotal > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {fmt(computedSubtotal)}
                      {currency}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>
                    {fmt(deliveryFee)}
                    {currency}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>
                    {fmt(tax)}
                    {currency}
                  </span>
                </div>

                <Separator />
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>
                    {fmt(displayedTotal)}
                    {currency}
                  </span>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <IconCalendar className="text-muted-foreground h-5 w-5" />
                <h3 className="text-lg font-medium">Timeline</h3>
              </div>
              <div className="space-y-2 rounded-xl border p-4">
                <dl className="grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Order Date</dt>
                    <dd>
                      {ord.placedAt
                        ? format(new Date(String(ord.placedAt)), "PP")
                        : "-"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Last Updated</dt>
                    <dd>
                      {ord.updatedAt
                        ? format(new Date(String(ord.updatedAt)), "PP")
                        : "-"}
                    </dd>
                  </div>
                  {ord.statusUpdatedAt && (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">Status Updated</dt>
                      <dd>
                        {format(new Date(String(ord.statusUpdatedAt)), "PP")}
                      </dd>
                    </div>
                  )}
                  {ord.statusUpdatedBy?.name && (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted-foreground">By</dt>
                      <dd className="truncate">{ord.statusUpdatedBy.name}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="bg-background sticky bottom-0 border-t px-6 py-4">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  Delete Order
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {ord.id && (
                  <StatusChangeSelect
                    orderId={ord.id}
                    currentStatus={ord.status}
                    className="w-32"
                  />
                )}
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete order {ord.id}? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
