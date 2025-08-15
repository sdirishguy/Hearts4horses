import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Log webhook event
  await prisma.webhookEvent.create({
    data: {
      provider: 'stripe',
      eventId: event.id,
      type: event.type,
      payloadJson: JSON.parse(JSON.stringify(event.data.object)),
    }
  });

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Mark webhook as processed
    await prisma.webhookEvent.updateMany({
      where: { eventId: event.id },
      data: { 
        status: 'processed',
        processedAt: new Date()
      }
    });

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Mark webhook as failed
    await prisma.webhookEvent.updateMany({
      where: { eventId: event.id },
      data: { 
        status: 'failed',
        retries: { increment: 1 }
      }
    });

    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { metadata } = session;
  
  if (metadata?.type === 'package') {
    // Handle lesson package purchase
    const { lessonTypeId, studentId } = metadata;
    
    if (!lessonTypeId || !studentId) {
      throw new Error('Missing lessonTypeId or studentId in metadata');
    }

    // Get lesson type to determine package size
    const lessonType = await prisma.lessonType.findUnique({
      where: { id: lessonTypeId }
    });

    if (!lessonType) {
      throw new Error('Lesson type not found');
    }

    // Create student package (default to 5 lessons)
    await prisma.studentPackage.create({
      data: {
        studentId,
        lessonTypeId,
        lessonsIncluded: 5, // This could be configurable
        remainingLessons: 5,
        stripePaymentId: session.payment_intent as string,
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      }
    });
  } else if (metadata?.type === 'products') {
    // Handle product purchase
    const { userId } = metadata;
    
    if (!userId) {
      throw new Error('Missing userId in metadata');
    }

    // Create order record
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'paid',
        subtotalCents: session.amount_subtotal || 0,
        taxCents: session.total_details?.amount_tax || 0,
        shippingCents: 0, // Could be calculated
        totalCents: session.amount_total || 0,
        stripeCheckoutId: session.id,
      }
    });

    // Create order items (you'd need to store cart data or get from session)
    // This is a simplified version - in practice you'd need to store cart data
    console.log('Product order created:', order.id);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Handle successful payment intent
  console.log('Payment intent succeeded:', paymentIntent.id);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  // Handle refunds
  console.log('Charge refunded:', charge.id);
  
  // You could update order status or refund student packages here
}

export default router;
