const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/Order');

let environment;
if (process.env.PAYPAL_ENVIRONMENT === 'live') {
  environment = new paypal.core.LiveEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
} else {
  environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

const client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal order
const createPayPalOrder = async (req, res, next) => {
  const { orderId } = req.body;

  try {
    console.log('Creating PayPal order for orderId:', orderId);
    const order = await Order.findById(orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: order.orderNumber,
          amount: {
            currency_code: 'USD',
            value: order.totalAmount.toFixed(2),
          },
        },
      ],
    });

    const response = await client.execute(request);
    console.log('PayPal order created:', response.result.id);
    order.paypalOrderId = response.result.id;
    await order.save();

    res.status(201).json({ success: true, data: response.result });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    next(error);
  }
};

// Capture PayPal order
const capturePayPalOrder = async (req, res, next) => {
  const { paypalOrderId } = req.body;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});

    const response = await client.execute(request);

    // Update order status based on capture
    const order = await Order.findOne({ paypalOrderId });
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (response.result.status === 'COMPLETED') {
      order.status = 'paid';
      order.paypalTransactionId = response.result.purchase_units[0].payments.captures[0].id;
      await order.save();
    }

    res.json({ success: true, data: response.result });
  } catch (error) {
    next(error);
  }
};

// PayPal webhook handler
const paypalWebhook = async (req, res, next) => {
  // For simplicity, just acknowledge webhook receipt
  // In production, verify webhook signature and update order status accordingly
  res.status(200).send('Webhook received');
};

module.exports = {
  createPayPalOrder,
  capturePayPalOrder,
  paypalWebhook,
};
