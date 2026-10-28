import Razorpay from "razorpay";
import crypto from "crypto";

const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export const getRazorpayInstance = () => {
  if (!keyId || !keySecret) {
    console.warn("Razorpay environment variables are missing.");
    return null;
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}; 

interface CreateOrderParams {
  amount: number; // in paise
  receipt: string;
}

export async function createRazorpayOrder({ amount, receipt }: CreateOrderParams) {
  const instance = getRazorpayInstance();
  if (!instance) {
    throw new Error("Razorpay instance could not be initialized due to missing credentials.");
  }

  try {
    const order = await instance.orders.create({
      amount,
      currency: "INR",
      receipt,
    });
    return order;
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    throw error;
  }
}

interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export function verifyRazorpaySignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: VerifyPaymentParams): boolean {
  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured.");
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  return generatedSignature === razorpaySignature;
}

export async function fetchRazorpayPayment(paymentId: string) {
  const instance = getRazorpayInstance();
  if (!instance) return null;
  try {
    const payment = await instance.payments.fetch(paymentId);
    return payment;
  } catch (err) {
    console.warn("Could not fetch payment from Razorpay API:", err);
    return null;
  }
}

