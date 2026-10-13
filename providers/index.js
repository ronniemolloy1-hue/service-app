// Payment provider abstraction. Select with PAYMENT_PROVIDER=mock|omise|stripe (default: mock).
// Every provider implements:
//   createPayment({amount, currency, method:'card'|'promptpay', card?, description, metadata}) ->
//     {id, status:'paid'|'pending'|'failed', qr?:{svg|imageUrl}, error?}
//   getPayment(id) -> {id, status}
//   simulatePaid(id) (mock only, for PromptPay test flow)
// Amounts are in major units (e.g. 300 = 300 THB); providers convert (Omise/Stripe use satang = x100).
const name=(process.env.PAYMENT_PROVIDER||'mock').toLowerCase();
const provider=require('./'+({mock:'mock',omise:'omise',stripe:'stripe'}[name]||'mock'));
module.exports=provider;
