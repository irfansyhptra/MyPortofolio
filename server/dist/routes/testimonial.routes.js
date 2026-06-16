"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testimonial_controller_1 = require("../controllers/testimonial.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const controller = new testimonial_controller_1.TestimonialController();
// Public routes
router.post("/testimonials", controller.create);
router.get("/testimonials", controller.getApproved);
// Admin routes (Protected by authMiddleware)
router.get("/admin/testimonials", auth_middleware_1.authMiddleware, controller.getAll);
router.patch("/admin/testimonials/:id", auth_middleware_1.authMiddleware, controller.updateStatus);
router.delete("/admin/testimonials/:id", auth_middleware_1.authMiddleware, controller.delete);
exports.default = router;
