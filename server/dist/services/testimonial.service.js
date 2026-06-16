"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialService = void 0;
const testimonial_repository_1 = require("../repositories/testimonial.repository");
const testimonial_validator_1 = require("../validators/testimonial.validator");
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class TestimonialService {
    repository;
    constructor() {
        this.repository = new testimonial_repository_1.TestimonialRepository();
    }
    async create(data) {
        const validatedData = testimonial_validator_1.CreateTestimonialSchema.parse(data);
        // If avatar is base64 image data, upload it to Cloudinary
        if (validatedData.avatar && validatedData.avatar.startsWith("data:image/")) {
            try {
                const uploadResult = await cloudinary_1.v2.uploader.upload(validatedData.avatar, {
                    folder: "portfolio/testimonials",
                });
                validatedData.avatar = uploadResult.secure_url;
            }
            catch (uploadErr) {
                console.error("Cloudinary upload error inside TestimonialService:", uploadErr);
                validatedData.avatar = null;
            }
        }
        return await this.repository.create(validatedData);
    }
    async getApproved(page = 1, limit = 100) {
        const offset = Math.max(0, (page - 1) * limit);
        return await this.repository.findApproved(limit, offset);
    }
    async getAll(statusFilter, page = 1, limit = 10) {
        const safePage = Math.max(1, page);
        const safeLimit = Math.max(1, limit);
        const offset = (safePage - 1) * safeLimit;
        // Normalize empty status or "all" to null
        const filter = statusFilter === "all" || !statusFilter ? null : statusFilter;
        const [data, total] = await Promise.all([
            this.repository.findAll(filter, safeLimit, offset),
            this.repository.countAll(filter),
        ]);
        const totalPages = Math.ceil(total / safeLimit);
        return {
            data,
            pagination: {
                total,
                page: safePage,
                limit: safeLimit,
                totalPages,
            },
        };
    }
    async updateStatus(id, status) {
        if (!["pending", "approved", "rejected"].includes(status)) {
            throw new Error("Invalid status. Must be pending, approved, or rejected.");
        }
        const updated = await this.repository.updateStatus(id, status);
        if (!updated) {
            throw new Error(`Testimonial with ID ${id} not found.`);
        }
        return updated;
    }
    async delete(id) {
        const success = await this.repository.delete(id);
        if (!success) {
            throw new Error(`Testimonial with ID ${id} not found.`);
        }
    }
}
exports.TestimonialService = TestimonialService;
