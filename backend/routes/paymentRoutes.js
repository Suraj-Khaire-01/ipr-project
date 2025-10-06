const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();

// COMPREHENSIVE DEBUG
console.log('\n=== RAZORPAY ENVIRONMENT CHECK ===');
console.log('process.env.RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('process.env.RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_SECRET);
console.log('Type of KEY_ID:', typeof process.env.RAZORPAY_KEY_ID);
console.log('Type of KEY_SECRET:', typeof process.env.RAZORPAY_SECRET);
console.log('KEY_ID length:', process.env.RAZORPAY_KEY_ID?.length);
console.log('KEY_SECRET length:', process.env.RAZORPAY_SECRET?.length);
console.log('===================================\n');

// Check if variables are actually set
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
  console.error('❌ CRITICAL: Razorpay credentials are missing!');
  console.error('Make sure .env file exists and contains:');
  console.error('RAZORPAY_KEY_ID=your_key');
  console.error('RAZORPAY_KEY_SECRET=your_secret');
}

// Initialize Razorpay with explicit values
const razorpayConfig = {
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_SECRET || ''
};

console.log('Initializing Razorpay with config:', {
  key_id: razorpayConfig.key_id ? razorpayConfig.key_id.substring(0, 10) + '...' : 'EMPTY',
  key_secret: razorpayConfig.key_secret ? '***' + razorpayConfig.key_secret.slice(-4) : 'EMPTY'
});

let razorpay;
try {
  razorpay = new Razorpay(razorpayConfig);
  console.log('✅ Razorpay instance created');
} catch (error) {
  console.error('❌ Failed to create Razorpay instance:', error.message);
}

// Create order
router.post("/order", async (req, res) => {
  try {
    console.log('\n📦 Payment order request received');
    
    // Double-check credentials at runtime
    console.log('Runtime check - KEY_ID:', process.env.RAZORPAY_KEY_ID?.substring(0, 10) || 'MISSING');
    console.log('Runtime check - KEY_SECRET:', process.env.RAZORPAY_SECRET ? 'EXISTS' : 'MISSING');
    
    if (!razorpay) {
      return res.status(500).json({ 
        success: false, 
        message: "Razorpay not initialized" 
      });
    }

    const { amount } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid amount" 
      });
    }

    const amountInPaise = Math.round(amount * 100);
    
    const options = { 
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };
    
    console.log('Creating order with options:', options);
    
    const order = await razorpay.orders.create(options);
    
    console.log('✅ Order created:', order.id);
    
    res.json({ 
      success: true, 
      order: order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
    
  } catch (error) {
    console.error('❌ Order creation error:', error);
    
    res.status(500).json({ 
      success: false, 
      message: error.error?.description || error.message,
      debug: {
        hasKeyId: !!process.env.RAZORPAY_KEY_ID,
        hasKeySecret: !!process.env.RAZORPAY_SECRET
      }
    });
  }
});

// Verify payment
router.post("/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required parameters" 
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.json({ 
        success: true, 
        message: "Payment verified successfully",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error verifying payment",
      error: error.message 
    });
  }
});

module.exports = router;