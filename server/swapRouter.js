import mongoose from "mongoose";

const swapSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: String,
  received: String,
  tokenIn: String,
  tokenOut: String,
  signer: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const recentSwap = mongoose.models.recentSwap || mongoose.model("recentSwap", swapSchema);
export default recentSwap;
