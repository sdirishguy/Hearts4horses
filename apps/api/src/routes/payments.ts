import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { stripeService } from '../services/stripe.service';
import { z } from 'zod';

const router = express.Router();

// Checkout schema validation
const checkoutSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().min(1).default(1),
});

// Create checkout session
router.post('/checkout', authenticateToken, async (req, res) => {
  try {
    const data = checkoutSchema.parse(req.body);
    const userId = (req as any).user.userId;

    const session = await stripeService.createCheckoutSession({
      userId,
      productId: data.productId,
      quantity: data.quantity,
      successUrl: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment/cancelled`,
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

// Webhook endpoint (no auth)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    await stripeService.handleWebhook(signature, req.body);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

// Process refund
router.post('/refund/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const refund = await stripeService.processRefund(orderId, reason);
    res.json({ success: true, refundId: refund.id });
  } catch (error) {
    console.error('Refund error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    res.status(400).json({ error: message });
  }
});

export default router;