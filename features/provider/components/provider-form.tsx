"use client";

import { InputField } from "@/components/fields/input-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const providerSchema = z.object({
  name: z.string().trim(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().optional(),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

export default function ProviderForm({
  provider,
}: {
  provider?: {
    id: string;
    name: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    country?: string;
    logo?: string;
    isActive?: boolean;
  } | null;
}) {
  const router = useRouter();

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: provider?.name ?? "",
      description: provider?.description ?? "",
      phone: provider?.phone ?? "",
      email: provider?.email ?? "",
      address: provider?.address ?? "",
      city: provider?.city ?? "",
      country: provider?.country ?? "",
      logo: provider?.logo ?? "",
      isActive: provider?.isActive ?? true,
    },
  });

  function onSubmit(values: ProviderFormValues) {
    const transformedValues = { ...values };

    if (provider) {
      toast.promise(api.put(`/providers/${provider.id}`, transformedValues), {
        loading: "Updating provider...",
        success: (updated: unknown) => {
          const u = updated as { id: string };
          router.push(`/dashboard/provider/profile/${u.id}`);
          router.refresh();
          return "Provider updated!";
        },
        error: (error) => {
          console.error("Error updating provider:", error);
          return "Failed to update provider.";
        },
      });
    } else {
      toast.promise(api.post("/providers", transformedValues), {
        loading: "Creating provider...",
        success: (created: unknown) => {
          const c = created as { id: string };
          router.refresh();
          form.reset();
          router.push(`/dashboard/provider/profile/${c.id}`);
          return "Provider created successfully!";
        },
        error: (error) => {
          console.error("Error creating provider:", error);
          return "Failed to create provider.";
        },
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border p-6 shadow-md"
      >
        <InputField name="name" label="Name" placeholder="Provider name" />

        <InputField
          name="description"
          label="Description"
          placeholder="Short description"
        />

        <InputField name="phone" label="Phone" placeholder="Phone" />

        <InputField name="email" label="Email" placeholder="Email" />

        <InputField name="address" label="Address" placeholder="Address" />

        <InputField name="city" label="City" placeholder="City" />

        <InputField name="country" label="Country" placeholder="Country" />

        <InputField name="logo" label="Logo URL" placeholder="Logo URL" />

        <InputField name="isActive" label="Active" type="checkbox" />

        <Button
          type="submit"
          className="col-span-1 cursor-pointer sm:col-span-2"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {provider ? "Update Provider" : "Create Provider"}
        </Button>
      </form>
    </Form>
  );
}
