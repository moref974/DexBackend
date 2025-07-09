import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import recentSwap from "../swapRouter.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;
async function connectToMongo() {
  if (isConnected) return;
  await mongoose.connect(process.env.MongoUri);
  isConnected = true;
  console.log("🛡️ MongoDB Connected");
}

app.get("/", (req, res) => {
  res.send("Hello From Backend");
});

app.post("/api/swap", async (req, res) => {
  await connectToMongo();
  const { from, to, amount, received, tokenIn, tokenOut, signer } = req.body;
  try {
    const newSwap = new recentSwap({
      from,
      to,
      amount,
      received,
      tokenIn,
      tokenOut,
      signer,
    });
    await newSwap.save();
    res.status(200).json({ message: "Swap history created" });
  } catch (error) {
    console.log("Failed to create swap history");
    res.status(401).json({ message: "Failed to create swap history" });
  }
});

app.get("/api/swaps", async (req, res) => {
  await connectToMongo();
  const swaps = await recentSwap.find().sort({ timestamp: -1 }).limit(10);
  res.json(swaps);
});

export default function handler(req, res) {
  return app(req, res);
}
