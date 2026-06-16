import { z } from "zod";

export const CreateTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  position: z.string().min(1, "Position is required").max(255, "Position must be less than 255 characters"),
  company: z.string().max(255, "Company name must be less than 255 characters").optional().nullable(),
  avatar: z.string().refine((val) => {
    if (!val) return true;
    return val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image/");
  }, {
    message: "Avatar must be a valid URL or base64 image data",
  }).or(z.string().length(0)).or(z.null()).optional(),
  message: z.string().min(1, "Message is required"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
});

export const UpdateTestimonialStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"], {
    errorMap: () => ({ message: "Status must be 'pending', 'approved', or 'rejected'" }),
  }),
});

export type CreateTestimonialInput = z.infer<typeof CreateTestimonialSchema>;
export type UpdateTestimonialStatusInput = z.infer<typeof UpdateTestimonialStatusSchema>;
