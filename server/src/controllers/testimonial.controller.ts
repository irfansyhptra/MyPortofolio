import { Request, Response } from "express";
import { TestimonialService } from "../services/testimonial.service";
import { ZodError } from "zod";

export class TestimonialController {
  private service: TestimonialService;

  constructor() {
    this.service = new TestimonialService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const data = await this.service.create(req.body);
      return res.status(201).json({
        success: true,
        message: "Testimonial submitted successfully, pending approval.",
        data,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      const message = error instanceof Error ? error.message : "Internal server error";
      return res.status(500).json({ success: false, error: message });
    }
  };

  getApproved = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;
      const data = await this.service.getApproved(page, limit);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Internal server error";
      return res.status(500).json({ success: false, error: message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const status = (req.query.status as string) || "all";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.service.getAll(status, page, limit);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Internal server error";
      return res.status(500).json({ success: false, error: message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, error: "Status is required" });
      }

      const data = await this.service.updateStatus(id, status);
      return res.status(200).json({
        success: true,
        message: `Testimonial status updated to ${status}.`,
        data,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Internal server error";
      return res.status(500).json({ success: false, error: message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(200).json({
        success: true,
        message: "Testimonial deleted successfully.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Internal server error";
      return res.status(500).json({ success: false, error: message });
    }
  };
}
