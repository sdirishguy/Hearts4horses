import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { OrderStatus, ProductType } from '@prisma/client';

class StripeService {
  private stripe: Stripe;
  
  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is required');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  // Single responsibility: Create checkout session
  async createCheckoutSession(params: {
    userId: string;
    productId: string;
    quantity: number;
    successUrl: string;
    cancelUrl: string;
  }) {
    const product = await prisma.product.findUnique({
      where: { id: params.productId }
    });

    if (!product) throw new Error('Product not found');

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceCents,
        },
        quantity: params.quantity,
      }],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        userId: params.userId,
        productId: params.productId,
      },
      invoice_creation: { enabled: true },
    });

    // Store payment intent
    await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        userId: params.userId,
        status: OrderStatus.pending,
        stripeCheckoutId: session.id,
        subtotalCents: product.priceCents * params.quantity,
        taxCents: Math.round(product.priceCents * params.quantity * 0.08), // 8% tax
        totalCents: Math.round(product.priceCents * params.quantity * 1.08),
        orderItems: {
          create: {
            productId: product.id,
            productName: product.name,
            quantity: params.quantity,
            unitPriceCents: product.priceCents,
            totalCents: product.priceCents * params.quantity,
          }
        } as any
      } as any
    });

    return session;
  }

  // Process webhook events
  async handleWebhook(signature: string, rawBody: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET is required');

    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    // Store webhook event for auditing
    await prisma.webhookEvent.create({
      data: {
        provider: 'stripe',
        eventId: event.id,
        type: event.type,
        payloadJson: event as any,
        status: 'pending'
      }
    });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'invoice.payment_succeeded':
        await this.handleInvoicePayment(event.data.object as Stripe.Invoice);
        break;
    }

    // Mark webhook as processed
    await prisma.webhookEvent.update({
      where: { 
        provider_eventId: { provider: 'stripe', eventId: event.id } 
      } as any,
      data: { status: 'processed', processedAt: new Date() }
    });
  }

  private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const order = await prisma.order.findFirst({
      where: { stripeCheckoutId: session.id }
    });

    if (!order) return;

    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.paid,
          stripePaymentIntentId: session.payment_intent as string,
          paidAt: new Date()
        } as any
      });

      // Create package if it's a lesson package
      const orderItem = await tx.orderItem.findFirst({
        where: { orderId: order.id },
        include: { product: true }
      });

      if (orderItem && (orderItem.product.type as any) === 'lesson_package') {
        const packageDetails = (orderItem.product as any).metaJson;
        await tx.studentPackage.create({
          data: {
            studentId: session.metadata?.studentId || order.userId,
            lessonTypeId: packageDetails.lessonTypeId,
            packageName: orderItem.product.name,
            lessonsIncluded: packageDetails.lessonCount,
            remainingLessons: packageDetails.lessonCount,
            pricePaidCents: order.totalCents,
            stripePaymentId: session.payment_intent as string,
            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
            status: 'active'
          } as any
        });
      }
    });
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    await prisma.order.update({
      where: { stripePaymentIntentId: paymentIntent.id } as any,
      data: { status: OrderStatus.cancelled, cancelledAt: new Date() } as any
    });
  }

  private async handleInvoicePayment(invoice: Stripe.Invoice) {
    // Store invoice URL for user access
    if (invoice.hosted_invoice_url) {
      await prisma.order.update({
        where: { stripePaymentIntentId: invoice.payment_intent as string } as any,
        data: { invoiceUrl: invoice.hosted_invoice_url } as any
      });
    }
  }

  // Process refunds
  async processRefund(orderId: string, reason?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!(order as any)?.stripePaymentIntentId) {
      throw new Error('Cannot refund - no payment found');
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: (order as any).stripePaymentIntentId as string,
      reason: 'requested_by_customer',
      metadata: { orderId, reason: reason || '' }
    });

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'refunded' as any,
        refundedAt: new Date(),
        notes: reason
      } as any
    });

    return refund;
  }
}

export const stripeService = new StripeService();