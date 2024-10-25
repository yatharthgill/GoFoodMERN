const express = require("express");
const router = express.Router();
const { Order } = require("../models/Orders");

router.post("/orderData", async (req, res) => {
  try {
    const existingOrder = await Order.findOne({ email: req.body.email });

    if (existingOrder) {
      // Append to the existing order
      existingOrder.order_data.push(...req.body.order_data);
      existingOrder.order_date = req.body.order_date || new Date();

      const updatedOrder = await existingOrder.save();
      res.json({ success: true, message: 'Order updated successfully', orderId: updatedOrder._id });
    } else {
      // Create a new order
      const { email, order_data, order_date } = req.body;

      const newOrder = new Order({
        email,
        order_data,
        order_date: order_date || new Date()
      });

      const savedOrder = await newOrder.save();
      res.json({ success: true, message: 'Order placed successfully', orderId: savedOrder._id });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to save order', details: error.message });
  }
});

router.post("/myOrderData", async (req, res) => {
  let myData = await Order.findOne({ email: req.body.email });
  res.json({orderData:myData});
});

module.exports = router;
