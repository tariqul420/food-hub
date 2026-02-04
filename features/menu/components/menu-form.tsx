"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import ImageUploaderField from "@/components/fields/image-uploader-field";
import { InputField } from "@/components/fields/input-field";
// TextareaField unused on purpose; description uses TiptapEditorField
import TiptapEditorField from "@/components/fields/tiptap-editor-field";
import { Button } from "@/components/ui/button";
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
import { useSession } from "@/lib/auth/auth-client";
import api from "@/lib/fetcher";

interface Category {
  id: string;
  name: string;
}

interface RawCategory {
  id?: string;
  name: string;
}

interface IMenu {
  id: string;
  title: string;
  description?: string | null;
  categoryId?: string;
  image?: string | null;
  price?: number;
  currency?: string;
  isAvailable?: boolean;
}

// Zod schema aligned with backend Meal model
const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters." })
    .max(100),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  image: z.string().optional(),
  price: z.number().min(0.01, { message: "Price must be at least 0.01." }),
  currency: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

interface MenuFormProps {
  menu?: IMenu;
}

type FormValues = z.infer<typeof formSchema>;

export default function MenuForm({ menu }: MenuFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  // Define the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: menu?.title ?? "",
      description: menu?.description ?? "",
      categoryId: menu?.categoryId ?? "",
      image: menu?.image ?? "",
      price: menu?.price ?? 0,
      currency: menu?.currency ?? "USD",
      isAvailable: menu?.isAvailable ?? true,
    },
  });

  // Submit handler
  function onSubmit(values: FormValues) {
    // Map form values to backend Meal payload
    type MealPayload = {
      title: string;
      description?: string | null;
      price: number;
      currency?: string;
      image?: string | null;
      isAvailable?: boolean;
      categoryId?: string | null;
      providerProfileId?: string | null;
      userId?: string | null;
    };

    const categoryId = values.categoryId ?? undefined;

    const payload: MealPayload = {
      title: values.title,
      description: values.description ?? null,
      price: values.price,
      currency: values.currency ?? "USD",
      image: values.image,
      isAvailable: values.isAvailable ?? true,
      categoryId,
      userId: user?.id ?? null,
    };

    if (menu) {
      toast.promise(api.put(`/meals/${menu.id}`, payload), {
        loading: "Updating menu item...",
        success: () => {
          router.refresh();
          return "Menu item updated!";
        },
        error: () => "Failed to update menu item.",
      });
    } else {
      toast.promise(api.post("/meals", payload), {
        loading: "Creating menu item...",
        success: () => {
          router.refresh();
          form.reset();
          router.push("/dashboard/provider/menu", { scroll: false });
          return "Menu item created successfully!";
        },
        error: () => "Failed to create menu item.",
      });
    }
  }

  // Fetch categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get<{ data?: Category[] } | Category[]>(
          "/categories",
        );
        const cats = (res as { data?: Category[] }).data ?? (res as Category[]);
        if (!cats || !Array.isArray(cats)) return;
        const normalized = (cats as RawCategory[]).map((c) => ({
          id: c.id ?? "",
          name: c.name,
        }));
        setCategories(normalized);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories");
      }
    };

    fetchCategory();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
      >
        {/* Title */}
        <InputField
          name="title"
          label="Menu Title"
          placeholder="Enter menu title"
        />

        {/* Category (single) */}
        <FormItem className="space-y-2">
          <FormLabel>Category</FormLabel>
          <FormControl>
            <FormField
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Price */}
        <InputField
          type="number"
          name="price"
          label="Price"
          placeholder="Enter price"
        />

        {/* Currency */}
        <FormItem className="space-y-2">
          <FormLabel>Currency</FormLabel>
          <FormControl>
            <FormField
              name="currency"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="BDT">BDT - Bangladeshi Taka</SelectItem>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Image */}
        <ImageUploaderField name="image" label="Food Image" multiple={false} />

        {/* Description */}
        <TiptapEditorField
          name="description"
          label="Description"
          className="col-span-1 sm:col-span-2"
        />

        {/* Available */}
        <InputField name="isAvailable" label="Available" type="checkbox" />

        {/* Submit Button */}
        <Button
          type="submit"
          className="col-span-1 cursor-pointer sm:col-span-2"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {menu ? "Update Menu Item" : "Create Menu Item"}
        </Button>
      </form>
    </Form>
  );
}
