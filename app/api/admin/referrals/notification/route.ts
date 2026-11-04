import {isAdmin} from '../../../../../lib/admin';
import {requestDb,sameOrigin} from '../../../../../lib/requests';
import {referralHeaders} from '../../../../../lib/referral-store';
import {notifyReferral} from '../../../../../lib/referral-notifications';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:referralHeaders});

export async function POST(request:Request) {
  if(!await isAdmin()||!sameOrigin(request))return reply({error:'Forbidden'},403);
  let id:string;
  try {
    const text=await request.text();if(text.length>150)throw new Error();
    const d=JSON.parse(text);
    if(typeof d.id!=='string'||!/^[a-f0-9-]{36}$/i.test(d.id))throw new Error();
    id=d.id;
  }catch{return reply({error:'Invalid request'},400);}
  try {
    const status=await notifyReferral(requestDb(),id,true);
    return reply({status},status==='not_requested'?404:status==='accepted'?200:status==='sending'?409:502);
  }catch{return reply({error:'Notification unavailable'},503);}
}
