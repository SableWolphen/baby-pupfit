const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=['index.html','machine-plan.html','meals.html','progress.html'];
for(const f of files)for(const [,js]of fs.readFileSync(f,'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(js,{filename:f});
new vm.Script(fs.readFileSync('plan.js','utf8')); console.log('All JavaScript parses.');
function run(date,seed={}){
 const elements=new Map(),el=id=>{if(!elements.has(id))elements.set(id,{id,style:{},dataset:{},classList:{toggle(){}},querySelectorAll:()=>[],value:'',innerHTML:''});return elements.get(id)};
 const storage=new Map(Object.entries(seed).map(([k,v])=>[k,JSON.stringify(v)]));const RealDate=Date;
 class FakeDate extends RealDate{constructor(...a){super(...(a.length?a:[date+'T12:00:00']))}static now(){return +new FakeDate()}}
 const ctx={window:{},document:{getElementById:el,querySelectorAll:()=>[]},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},Date:FakeDate,alert(){},prompt(){return ''}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('plan.js','utf8'),ctx);
 let js=[...fs.readFileSync('index.html','utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].at(-1)[1];js=js.replace('markPastMissed();if(todayPlan())',"window.test={hist,nextWeight,ensure,renderWorkout,renderPlan,recoveryState,orderedExercises,progressStats,loadAdvice};markPastMissed();if(todayPlan())");vm.runInContext(js,ctx);return {ctx,el,storage,t:ctx.window.test};
}
for(const date of ['2026-09-27','2026-09-28','2026-09-29','2026-09-30','2026-10-01','2026-10-02','2026-10-03']){let r=run(date);r.t.renderWorkout();r.t.renderPlan();if(date==='2026-10-03'){assert.match(r.el('todayWorkout').innerHTML,/Rest/);assert.equal(r.t.ensure(),null);}if(date==='2026-09-27')assert.match(r.el('todayWorkout').innerHTML,/3–5 mile/);}
const old={id:'2026-09-28|1',date:'2026-09-28',dow:1,name:'Old workout',status:'partial',exercises:[{name:'Leg Extension',setsTarget:4,setData:[{weight:45,reps:12,done:true},{weight:45,reps:10,done:true},{weight:45,reps:9,done:false}],effort:2}]};
let r=run('2026-09-28',{pupfit_workout_sessions_v2:{[old.id]:old}});assert.deepEqual(JSON.parse(r.storage.get('pupfit_workout_sessions_v2'))[old.id],old);assert.equal(r.t.hist('EGYM Leg Extension').name,'Leg Extension');assert.equal(r.t.nextWeight('EGYM Leg Extension',10,15,'small'),'');assert.equal(r.t.nextWeight('EGYM Squat',8,12,'big'),'');assert.equal(r.t.nextWeight('Lat Pulldown',8,12,'big'),'');
const sorted=r.t.orderedExercises({dow:1,exercises:[{name:'EGYM Chest Press'},{name:'Lat Pulldown'},{name:'Lateral Raise Machine'}]});assert.equal(sorted[0].name,'Lat Pulldown');
assert.equal(r.ctx.window.PUPFIT_PLANS[2].ex[3][0],'Leg Extension');
assert.equal(r.ctx.window.PUPFIT_PLANS[5].ex[3][0],'Leg Extension');
const lift={name:'Lat Pulldown',setsTarget:3,setData:Array.from({length:3},()=>({weight:50,reps:12,done:true})),effort:2};r=run('2026-09-29',{pupfit_workout_sessions_v2:{x:{date:'2026-09-28',status:'complete',exercises:[lift]}}});assert.equal(r.t.nextWeight('Lat Pulldown',8,12,'big'),50);assert.match(r.t.loadAdvice({name:'Lat Pulldown',setsTarget:3,min:8,max:12}),/smallest available increase/);
r=run('2026-09-29',{pupfit_progress_v1:{'2026-09-29':{sleep:5}}});assert.equal(r.t.recoveryState().level,'high');assert.match(r.t.loadAdvice({name:'EGYM Squat'}),/calibration/);
for(const status of ['complete','partial','in_progress']){const snapshot={...old,status};r=run('2026-09-28',{pupfit_workout_sessions_v2:{[old.id]:snapshot}});r.t.ensure();assert.deepEqual(JSON.parse(r.storage.get('pupfit_workout_sessions_v2'))[old.id],snapshot);}
console.log('PASS: all seven days render; Saturday rest/Sunday run; history snapshots; aliases; EGYM calibration; conventional progression; priority order; recovery.');
