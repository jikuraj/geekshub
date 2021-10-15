const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    totalAmount: {
      type: Number,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        payablePrice: {
          type: Number,
        },
        quantity: {
          type: Number,
          default:1
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
    },
    paymentType: {
      type: String,
      enum: ["cod", "card"],
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "packed", "shipped", "delivered"],
          default: "ordered",
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    orderid:{
      type:String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);















// this is orders