// PLACEHOLDER — Omise (Thailand). To go live:
//  1. npm i omise ; set env OMISE_PUBLIC_KEY, OMISE_SECRET_KEY, PAYMENT_PROVIDER=omise
//  2. Card: tokenize in browser with Omise.js (public key) -> send token; here: omise.charges.create({amount:amount*100,currency:'thb',card:token})
//  3. PromptPay: omise.sources.create({type:'promptpay',amount:amount*100,currency:'thb'}) then charges.create({source}); show charge.source.scannable_code.image.download_uri
//  4. Add a webhook route (charge.complete) to mark payments paid; getPayment -> omise.charges.retrieve(id)
module.exports={name:'omise',testMode:false,async createPayment(){throw new Error('Omise not configured: set OMISE_SECRET_KEY and implement providers/omise.js')},async getPayment(){throw new Error('Omise not configured')}};
