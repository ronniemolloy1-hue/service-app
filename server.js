const express=require('express'),fs=require('fs'),path=require('path');
const DB=path.join(__dirname,'data','db.json');const app=express();app.use(express.json());const PF=path.join(__dirname,'.admin-password');const PASS=(process.env.ADMIN_PASSWORD||(fs.existsSync(PF)?fs.readFileSync(PF,'utf8'):'')).trim();if(!PASS)console.warn('WARNING: no ADMIN_PASSWORD set; admin is locked');const isAdmin=q=>!!PASS&&q.get('x-admin-pass')===PASS;const adm=(q,r,n)=>isAdmin(q)?n():r.status(401).json({error:'Admin password required'});
app.post('/api/admin/login',(q,r)=>isAdmin(q)?r.json({ok:1}):r.status(401).json({error:'Wrong password'}));
app.use(express.static(path.join(__dirname,'public')));
const seed=()=>{let i=1;const s=(c,n,d,p,desc)=>({id:'s'+i++,category:c,name:n,duration:d,price:p,description:desc,active:true});return{services:[
s('Massage','Swedish Massage',60,129,'Relaxing full-body massage with long, flowing strokes.'),s('Massage','Deep Tissue Massage',60,149,'Targets chronic tension in deeper muscle layers.'),s('Massage','Couples Massage',90,299,'Two therapists, side by side, in your home.'),s('Massage','Prenatal Massage',60,139,'Gentle, supportive massage for expecting mothers.'),s('Massage','Sports Massage',60,149,'Recovery-focused work for active bodies.'),
s('Beauty','Manicure & Pedicure',75,95,'Classic mani-pedi with polish of your choice.'),s('Beauty','Makeup Application',60,120,'Event-ready makeup by a pro artist.'),s('Beauty','Hair Styling',60,110,'Blowouts, curls, and updos.'),s('Beauty','Lash Extensions',90,160,'Classic full set of lash extensions.'),
s('Wellness','Assisted Stretching',45,89,'One-on-one guided stretching for mobility.'),s('Wellness','Facial',60,135,'Customized facial for your skin type.'),s('Wellness','IV Hydration',45,199,'Hydration drip administered by a licensed nurse.'),s('Wellness','Private Yoga',60,99,'Personal yoga session at home.')],
pros:[{id:'p1',name:'Maya Lopez',gender:'female',skills:['Massage','Wellness'],active:true},{id:'p2',name:'James Carter',gender:'male',skills:['Massage'],active:true},{id:'p3',name:'Aisha Khan',gender:'female',skills:['Beauty'],active:true},{id:'p4',name:'Daniel Kim',gender:'male',skills:['Wellness','Massage'],active:true}],bookings:[]}};
const load=()=>{if(!fs.existsSync(path.dirname(DB)))fs.mkdirSync(path.dirname(DB),{recursive:true});if(!fs.existsSync(DB))fs.writeFileSync(DB,JSON.stringify(seed(),null,2));return JSON.parse(fs.readFileSync(DB))};const save=d=>fs.writeFileSync(DB,JSON.stringify(d,null,2));
const id=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
app.get('/api/services',(q,r)=>r.json(load().services));
app.post('/api/services',adm,(q,r)=>{const d=load(),s={id:id('s'),active:true,...q.body,price:+q.body.price,duration:+q.body.duration};d.services.push(s);save(d);r.json(s)});
app.put('/api/services/:id',adm,(q,r)=>{const d=load(),s=d.services.find(x=>x.id==q.params.id);if(!s)return r.sendStatus(404);Object.assign(s,q.body);if(s.price)s.price=+s.price;if(s.duration)s.duration=+s.duration;save(d);r.json(s)});
app.delete('/api/services/:id',adm,(q,r)=>{const d=load();d.services=d.services.filter(x=>x.id!=q.params.id);save(d);r.json({ok:1})});
app.get('/api/pros',(q,r)=>r.json(load().pros));
app.post('/api/pros',adm,(q,r)=>{const d=load(),p={id:id('p'),active:true,skills:[],...q.body};d.pros.push(p);save(d);r.json(p)});
app.put('/api/pros/:id',adm,(q,r)=>{const d=load(),p=d.pros.find(x=>x.id==q.params.id);if(!p)return r.sendStatus(404);Object.assign(p,q.body);save(d);r.json(p)});
app.delete('/api/pros/:id',adm,(q,r)=>{const d=load();d.pros=d.pros.filter(x=>x.id!=q.params.id);save(d);r.json({ok:1})});
app.get('/api/bookings',(q,r)=>{let b=load().bookings;if(!q.query.email&&!isAdmin(q))return r.status(401).json({error:'Admin password required'});if(q.query.email)b=b.filter(x=>x.email.toLowerCase()==q.query.email.toLowerCase());r.json(b.slice().reverse())});
app.get('/api/bookings/:id',(q,r)=>{const b=load().bookings.find(x=>x.id==q.params.id);b?r.json(b):r.sendStatus(404)});
app.post('/api/bookings',(q,r)=>{const d=load(),b=q.body,s=d.services.find(x=>x.id==b.serviceId);
 for(const k of['serviceId','name','email','phone','address','date','time'])if(!b[k])return r.status(400).json({error:'Missing '+k});
 if(!s)return r.status(400).json({error:'Unknown service'});const fee=Math.round(s.price*0.2*100)/100,tip=+b.tip||0;
 const bk={id:'BK-'+Math.random().toString(36).slice(2,8).toUpperCase(),serviceId:s.id,serviceName:s.name,category:s.category,duration:s.duration,price:s.price,fee,tip,total:+(s.price+fee+tip).toFixed(2),gender:b.gender||'any',name:b.name,email:b.email,phone:b.phone,address:b.address,notes:b.notes||'',date:b.date,time:b.time,status:'Pending',proId:null,proName:null,payment:'Mock card •••• '+String(b.card||'4242').slice(-4),createdAt:new Date().toISOString()};
 d.bookings.push(bk);save(d);r.json(bk)});
app.put('/api/bookings/:id',(q,r)=>{const d=load(),b=d.bookings.find(x=>x.id==q.params.id);if(!b)return r.sendStatus(404);
 if(!isAdmin(q)&&!(q.body.status==='Cancelled'&&Object.keys(q.body).length===1&&(q.body.email||'').toLowerCase()===b.email.toLowerCase()||(q.body.status==='Cancelled'&&Object.keys(q.body).length===1)))return r.status(401).json({error:'Admin password required'});
 if(q.body.status)b.status=q.body.status;if('proId' in q.body){const p=d.pros.find(x=>x.id==q.body.proId);b.proId=p?p.id:null;b.proName=p?p.name:null;if(p&&b.status=='Pending')b.status='Confirmed'}save(d);r.json(b)});
app.get('*',(q,r)=>r.sendFile(path.join(__dirname,'public','index.html')));
const PORT=process.env.PORT||4300;app.listen(PORT,()=>console.log('Service app on http://localhost:'+PORT));
