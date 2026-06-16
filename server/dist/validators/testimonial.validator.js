"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTestimonialStatusSchema = exports.CreateTestimonialSchema = void 0;
const zod_1 = require("zod");
exports.CreateTestimonialSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
    position: zod_1.z.string().min(1, "Position is required").max(255, "Position must be less than 255 characters"),
    company: zod_1.z.string().max(255, "Company name must be less than 255 characters").optional().nullable(),
    avatar: zod_1.z.string().refine((val) => {
        if (!val)
            return true;
        return val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:image/");
    }, {
        message: "Avatar must be a valid URL or base64 image data",
    }).or(zod_1.z.string().length(0)).or(zod_1.z.null()).optional(),
    message: zod_1.z.string().min(1, "Message is required"),
    rating: zod_1.z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
});
exports.UpdateTestimonialStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["pending", "approved", "rejected"], {
        errorMap: () => ({ message: "Status must be 'pending', 'approved', or 'rejected'" }),
    }),
});
