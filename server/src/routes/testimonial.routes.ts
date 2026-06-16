import { Router } from "express";
import { TestimonialController } from "../controllers/testimonial.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new TestimonialController();

// Public routes
router.post("/testimonials", controller.create);
router.get("/testimonials", controller.getApproved);

// Admin routes (Protected by authMiddleware)
router.get("/admin/testimonials", authMiddleware, controller.getAll);
router.patch("/admin/testimonials/:id", authMiddleware, controller.updateStatus);
router.delete("/admin/testimonials/:id", authMiddleware, controller.delete);

export default router;
