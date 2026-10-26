/* Shared running schedule for Baby PupFit. Read-only: never rewrites workout logs. */
(function(root){
'use strict';
const START='2026-10-26';
const long=[3,3,3.5,3,4,4.5,3.5,5,5.5,4.5,6,6.5,5,7,8,6,9,10,7,13.1];
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function saved(){try{return JSON.parse(localStorage.getItem('pupfit_running_v1')||'{}')||{}}catch(e){return{}}}
function weekFor(date){const d=new Date(date+'T12:00:00'),start=new Date(START+'T12:00:00');return Math.max(0,Math.min(19,Math.floor((d-start)/(86400000*7))))}
function forDate(date){const d=new Date(date+'T12:00:00');if(!Number.isFinite(d.getTime()))return null;const day=d.getDay(),w=weekFor(date),base=Number(saved().base ?? 3);
if(day===0)return{title:'Sunday long run',description:'Easy conversational effort; run/walk is okay. Only attempt 13.1 miles if your training and recovery support it.',miles:base>=3?long[w]:null,week:w+1};
if(day===3)return{title:'Wednesday easy run',description:'20–40 minutes relaxed. Optional lifting accessories can be skipped.',minutes:'20–40',week:w+1};
if(day===5)return{title:'Friday easy run',description:'20–35 minutes, after upper-body machines or in a separate session.',minutes:'20–35',week:w+1};
return null;
}
root.PUPFIT_RUNNING={forDate,weekFor,start:START};
})(window);
