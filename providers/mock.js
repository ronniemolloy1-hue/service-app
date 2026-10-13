// TEST MODE provider: no money moves. Card 4000 0000 0000 0002 simulates a decline.
const crypto=require('crypto');const store=new Map();
const fakeQr=seed=>{const h=crypto.createHash('sha256').update(seed).digest();let r='';const n=21,c=8;for(let y=0;y<n;y++)for(let x=0;x<n;x++){const f=(x<7&&y<7)||(x>=n-7&&y<7)||(x<7&&y>=n-7);const on=f?((x%(n-7))%6==0||(y%(n-7))%6==0||((x%(n-7))>=2&&(x%(n-7))<=4&&(y%(n-7))>=2&&(y%(n-7))<=4)):(h[(x*n+y)%32]>>((x+y)%8)&1);if(on)r+=`<rect x="${x*c}" y="${y*c}" width="${c}" height="${c}"/>`}
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 ${n*c+16} ${n*c+16}" width="200" height="200"><rect x="-8" y="-8" width="${n*c+16}" height="${n*c+16}" fill="#fff"/><g fill="#111">${r}</g></svg>`};
module.exports={name:'mock',testMode:true,
 async createPayment({amount,currency,method,card}){const id='mock_chrg_'+crypto.randomBytes(6).toString('hex');
  if(method=='card'){const num=String(card||'').replace(/\D/g,'');if(num.length<12)return{id,status:'failed',error:'Enter a test card number'};if(num=='4000000000000002')return{id,status:'failed',error:'Card declined (test decline card)'};store.set(id,'paid');return{id,status:'paid',last4:num.slice(-4)}}
  if(method=='promptpay'){store.set(id,'pending');return{id,status:'pending',qr:{svg:fakeQr(id)}}}
  return{id,status:'failed',error:'Unsupported method'}},
 async getPayment(id){return{id,status:store.get(id)||'failed'}},
 async simulatePaid(id){if(!store.has(id))return{id,status:'failed'};store.set(id,'paid');return{id,status:'paid'}}};
