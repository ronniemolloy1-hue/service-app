// PLACEHOLDER — Stripe. To go live:
//  1. npm i stripe ; set env STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, PAYMENT_PROVIDER=stripe
//  2. createPayment -> stripe.paymentIntents.create({amount:amount*100,currency:'thb',payment_method_types:['card','promptpay']})
//     return client_secret; confirm in browser with Stripe.js (card or PromptPay QR)
//  3. Webhook payment_intent.succeeded marks the payment paid; getPayment -> paymentIntents.retrieve(id)
module.exports={name:'stripe',testMode:false,async createPayment(){throw new Error('Stripe not configured: set STRIPE_SECRET_KEY and implement providers/stripe.js')},async getPayment(){throw new Error('Stripe not configured')}};
