import express from "express";
import {
  getById,
  updateOrder,
  getAllOrder,
} from "../controllers/order.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();
router.route("/").get(authenticateToken, isAdmin, async (req, res) => {
  const order = await getAllOrder();
  res.status(200).json({ order });
});

router
  .route("/:id")
  .get(authenticateToken, async (req, res, next) => {
    try {
      const order = await getById(req.params.id);
      if (order.length == 0) {
        res.status(400).json({ error: "not valid ID" });
      } else {
        res.status(200).json({
          message: "Success",
          order,
        });
      }
    } catch (error) {
      next(error);
    }
  })
  .patch(authenticateToken, isAdmin, async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedOrder = await updateOrder(req.body, id);
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  });

export default router;
