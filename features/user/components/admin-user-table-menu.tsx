import { useSession } from "@/lib/auth/auth-client";
import api from "@/lib/fetcher";
import { IconDotsVertical } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUserRecord } from "@/types/table-columns";
import { zodResolver } from "@hookform/resolvers/zod";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  role: z.enum(["CUSTOMER", "PROVIDER", "ADMIN"]),
});

export default function AdminUserTableMenu({
  row,
}: {
  row: Row<AdminUserRecord>;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const isSelf = Boolean(
    session?.user?.id && session.user.id === row.original.id,
  );

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role:
        (row.original.role as "CUSTOMER" | "PROVIDER" | "ADMIN") || "CUSTOMER",
    },
  });

  const handleUpdateRole = async (data: z.infer<typeof formSchema>) => {
    try {
      if (!row.original.id) throw new Error("User ID is required");
      if (isSelf) return toast.error("You cannot change your own role");

      await toast.promise(
        api.patch(`/v1/users/admin/${row.original.id}`, { role: data.role }),
        {
          loading: "Saving user role...",
          success: () => {
            setIsEditDialogOpen(false);
            router.refresh();
            return "User role updated successfully!";
          },
          error: (err: unknown) => {
            const msg = (err as { message?: unknown })?.message;
            return typeof msg === "string"
              ? msg
              : "Error updating user. Please try again.";
          },
        },
      );
    } catch (error) {
      throw error;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          disabled={isSelf}
          onSelect={(e) => {
            e.preventDefault();
            if (isSelf) return;
            setIsEditDialogOpen(true);
          }}
        >
          {isSelf ? "Cannot edit own role" : "Edit Role"}
        </DropdownMenuItem>
      </DropdownMenuContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-center"}>Edit User Role</DialogTitle>
            <DialogDescription className={"text-center"}>
              Assign a new role to the user. Changes can be saved or canceled.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateRole)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CUSTOMER">Customer</SelectItem>
                          <SelectItem value="PROVIDER">Provider</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
