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

const categorySchema = z.object({
  name: z.string().trim(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoryForm({
  category,
}: {
  category?: { id: string; name: string } | null;
}) {
  const router = useRouter();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });

  function onSubmit(values: CategoryFormValues) {
    const transformedValues = {
      ...values,
    };

    if (category) {
      toast.promise(api.put(`/v1/categories/${category.id}`, transformedValues), {
        loading: "Updating category...",
        success: (updatedCategory: unknown) => {
          const uc = updatedCategory as { id: string };
          const newPath = `/dashboard/admin/categories/${uc.id}`;
          router.push(newPath);
          router.refresh();
          return "Category updated!";
        },
        error: (error) => {
          console.error("Error updating category:", error);
          return "Failed to update category.";
        },
      });
    } else {
      toast.promise(api.post("/v1/categories", transformedValues), {
        loading: "Creating category...",
        success: () => {
          router.refresh();
          form.reset();
          router.push("/dashboard/admin/categories");
          return "Category created successfully!";
        },
        error: (error) => {
          console.error("Error creating category:", error);
          return "Failed to create category.";
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
        {/* Name Field */}
        <InputField
          name="name"
          label="Name"
          placeholder="Enter category name"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="col-span-1 cursor-pointer sm:col-span-2"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {category ? "Update Category" : "Create Category"}
        </Button>
      </form>
    </Form>
  );
}
