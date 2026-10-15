/* Pure recommendation engine. No changes to logged targets or food intake. */
(function(root){
'use strict';
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function shift(day,n){let d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);return iso(d)}
function avg(xs){return xs.reduce((a,b)=>a+b,0)/xs.length}
function evaluate(records,day){
 const to=day||iso(new Date()),prevStart=shift(to,-13),prevEnd=shift(to,-7),curStart=shift(to,-6);
 const vals=Object.entries(records||{}).filter(([d,v])=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&d<=to&&v&&typeof v==='object');
 const data=(start,end,field,min,max)=>vals.filter(([d,v])=>d>=start&&d<=end&&v[field]!==''&&v[field]!=null&&Number.isFinite(Number(v[field]))&&Number(v[field])>=min&&Number(v[field])<=max).map(([d,v])=>Number(v[field]));
 const oldW=data(prevStart,prevEnd,'weight',60,600),newW=data(curStart,to,'weight',60,600);
 const oldAvg=oldW.length?avg(oldW):null,newAvg=newW.length?avg(newW):null;
 const calories=data(curStart,to,'calories',900,8000),protein=data(curStart,to,'protein',1,500),steps=data(curStart,to,'steps',0,100000);
 const waistRows=vals.filter(([d,v])=>v.waist!==''&&v.waist!=null&&Number(v.waist)>=15&&Number(v.waist)<=80).sort((a,b)=>a[0].localeCompare(b[0]));
 const qualified=oldW.length>=3&&newW.length>=3&&calories.length>=4;
 const rate=oldAvg!==null&&newAvg!==null?oldAvg-newAvg:null;
 let status='Gathering your baseline',message='Log weight at least 3 days in each of two consecutive 7-day windows, plus calories on at least 4 days this week. Then I can compare trends responsibly.';
 if(qualified){
  if(rate>1.25){status='Check recovery and fueling';message='Your average weight is dropping faster than the planned 0.5–1 lb/week. Avoid cutting calories further. Consider eating a little more if this persists, especially if strength or recovery is suffering.'}
  else if(rate>=0.4){status='Keep your current approach';message='Your weekly average weight is trending downward at a moderate pace. Keep your food and training consistent; no calorie cut suggested.'}
  else if(rate<-0.4){status='Review your trend';message='Your average weight rose this week. Check portions, logging, sodium and consistency; a single week can reflect water changes. Wait for another week before considering a small adjustment.'}
  else {status='Stay consistent and review';message='Your average weight is nearly flat. If your waist or strength is improving, that can still be progress. Observe another week before considering a small calorie or activity adjustment.'}
 }
 return {status,message,qualified,rate,oldCount:oldW.length,newCount:newW.length,calorieCount:calories.length,
  calorieAvg:calories.length?avg(calories):null,proteinAvg:protein.length?avg(protein):null,
  stepAvg:steps.length?avg(steps):null,waist:waistRows.length?Number(waistRows[waistRows.length-1][1].waist):null};
}
root.PUPFIT_WEEKLY_COACH={evaluate};
})(typeof window!=='undefined'?window:globalThis);
