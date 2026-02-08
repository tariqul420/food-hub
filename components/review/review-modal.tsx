"use client";

import SelectField from "@/components/fields/select-field";
import TextareaField from "@/components/fields/textarea-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useSession } from "@/lib/auth/auth-client";
import { api } from "@/lib/fetcher";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ReviewModalProps {
  mealId: string;
  mealTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type FormValues = {
  rating: number;
  comment: string;
};

export default function ReviewModal({
  mealId,
  mealTitle,
  open,
  onOpenChange,
  onSuccess,
}: ReviewModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  const form = useForm<FormValues>({
    defaultValues: { rating: 5, comment: "" },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!mealId) return toast.error("Invalid meal");
    setSubmitting(true);
    try {
      await api.post("/v1/reviews", {
        mealId,
        rating: values.rating,
        comment: values.comment,
        customerId: session?.user?.id,
      });
      toast.success("Review submitted");
      onOpenChange(false);
      form.reset();
      onSuccess?.();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a review for {mealTitle ?? "meal"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-4">
                <SelectField
                  name="rating"
                  label="Rating"
                  valueAsNumber
                  options={[
                    { label: "5 - Excellent", value: 5 },
                    { label: "4 - Good", value: 4 },
                    { label: "3 - Okay", value: 3 },
                    { label: "2 - Poor", value: 2 },
                    { label: "1 - Terrible", value: 1 },
                  ]}
                />

                <TextareaField
                  name="comment"
                  label="Comment"
                  placeholder="Share your experience (optional)"
                />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Sending..." : "Submit Review"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
