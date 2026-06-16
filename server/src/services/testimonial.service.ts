import { TestimonialRepository, TestimonialRow } from "../repositories/testimonial.repository";
import { CreateTestimonialInput, CreateTestimonialSchema } from "../validators/testimonial.validator";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class TestimonialService {
  private repository: TestimonialRepository;

  constructor() {
    this.repository = new TestimonialRepository();
  }

  async create(data: CreateTestimonialInput): Promise<TestimonialRow> {
    const validatedData = CreateTestimonialSchema.parse(data);

    // If avatar is base64 image data, upload it to Cloudinary
    if (validatedData.avatar && validatedData.avatar.startsWith("data:image/")) {
      try {
        const uploadResult = await cloudinary.uploader.upload(validatedData.avatar, {
          folder: "portfolio/testimonials",
        });
        validatedData.avatar = uploadResult.secure_url;
      } catch (uploadErr) {
        console.error("Cloudinary upload error inside TestimonialService:", uploadErr);
        validatedData.avatar = null;
      }
    }

    return await this.repository.create(validatedData);
  }

  async getApproved(page: number = 1, limit: number = 100): Promise<TestimonialRow[]> {
    const offset = Math.max(0, (page - 1) * limit);
    return await this.repository.findApproved(limit, offset);
  }

  async getAll(
    statusFilter: string | null,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: TestimonialRow[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
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

  async updateStatus(
    id: string,
    status: "pending" | "approved" | "rejected"
  ): Promise<TestimonialRow> {
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new Error("Invalid status. Must be pending, approved, or rejected.");
    }

    const updated = await this.repository.updateStatus(id, status);
    if (!updated) {
      throw new Error(`Testimonial with ID ${id} not found.`);
    }

    return updated;
  }

  async delete(id: string): Promise<void> {
    const success = await this.repository.delete(id);
    if (!success) {
      throw new Error(`Testimonial with ID ${id} not found.`);
    }
  }
}
