const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');

router.post('/create-checkout-session', requireAuth, async (req, res) => {
  try {
    // Demo Mode for College Project: Skip actual Stripe call and upgrade user immediately
    if (process.env.DEMO_MODE === 'true') {
      await User.findByIdAndUpdate(req.dbUser._id, { plan: 'pro' });
      return res.json({ 
        url: `${process.env.CLIENT_URL}/dashboard?status=success&demo=true`,
        message: 'Demo Mode: Plan upgraded to Pro successfully!' 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'StackPilot Pro Plan',
              description: 'Unlimited dependency recommendations and setup guides.',
            },
            unit_amount: 1900, // $19.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard?status=success`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?status=cancel`,
      customer_email: req.dbUser.email,
      client_reference_id: req.dbUser._id.toString(),
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    await User.findByIdAndUpdate(userId, { plan: 'pro' });
  }

  res.json({ received: true });
});

module.exports = router;
