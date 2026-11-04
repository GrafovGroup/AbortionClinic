import {isAdmin} from '../../../../lib/admin';
import {requestDb,sameOrigin} from '../../../../lib/requests';
import {validateReferralUpdate,type ReferralRow,type ReferralEvent} from '../../../../lib/referrals';
import {referralStatuses} from '../../../../lib/referral-content';
import {purgeExpiredReferrals,referralHeaders} from '../../../../lib/referral-store';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:referralHeaders});
export async function GET(request:Request) {
  if(!await isAdmin())return reply({error:'Forbidden'},403);
  const params=new URL(request.url).searchParams,status=params.get('status')||'all',page=Number(params.get('page')||'1');
  if(status!=='all'&&!referralStatuses.includes(status as any)||!Number.isInteger(page)||page<1||page>100000)return reply({error:'Invalid filter'},400);
  try {
    await purgeExpiredReferrals();const db=requestDb();
    const results=await db.batch([
      db.prepare('SELECT id,name,contact,method,language,provider_id,assigned_provider_id,connection_method,source_path,locale,voicemail,share_consent,consent_version,consented_at,status,created_at,updated_at,version,notification_status,notification_attempted_at FROM referral_requests WHERE (? = ? OR status = ?) ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET ?').bind(status,'all',status,(page-1)*25),
      db.prepare('SELECT status,COUNT(*) AS count FROM referral_requests GROUP BY status'),
      db.prepare('SELECT source_path,COUNT(*) AS count FROM referral_requests GROUP BY source_path ORDER BY count DESC LIMIT 10'),
    ]);
    const rows=results[0].results as ReferralRow[];
    const events=rows.length?(await db.prepare(`SELECT id,referral_id,status,provider_id,connection_method,created_at,actor FROM referral_events WHERE referral_id IN (${rows.map(()=>'?').join(',')}) ORDER BY created_at ASC,id ASC`).bind(...rows.map(r=>r.id)).all<ReferralEvent>()).results:[];
    return reply({rows,events,counts:results[1].results,sources:results[2].results,page,pageSize:25});
  }catch{console.error('Connection inbox storage unavailable');return reply({error:'Storage unavailable'},503);}
}
export async function PATCH(request:Request) {
  const user=await isAdmin();if(!user||!sameOrigin(request))return reply({error:'Forbidden'},403);
  let d;try {const body=await request.text();if(body.length>1000)return reply({error:'Too large'},413);d=validateReferralUpdate(JSON.parse(body));}catch{return reply({error:'Invalid update'},400);}
  try {
    const db=requestDb(),now=new Date().toISOString(),eventId=crypto.randomUUID();
    const current=await db.prepare('SELECT provider_id,share_consent FROM referral_requests WHERE id = ?').bind(d.id).first<{provider_id:string|null;share_consent:number}>();
    if(d.connectionMethod==='shared_with_clinic'&&(!current?.share_consent||current.provider_id!==d.assignedProviderId))return reply({error:'No recorded permission to share with this clinic'},400);
    // The version check and matching event are one atomic D1 batch; another editor cannot silently overwrite a change.
    const results=await db.batch([
      db.prepare('INSERT INTO referral_events (id,referral_id,status,provider_id,connection_method,created_at,actor) SELECT ?,id,?,?,?,?,? FROM referral_requests WHERE id = ? AND version = ?').bind(eventId,d.status,d.assignedProviderId,d.connectionMethod,now,user.userId,d.id,d.version),
      db.prepare('UPDATE referral_requests SET status = ?,assigned_provider_id = ?,connection_method = ?,updated_at = ?,version = version + 1 WHERE id = ? AND version = ? AND EXISTS (SELECT 1 FROM referral_events WHERE id = ?)').bind(d.status,d.assignedProviderId,d.connectionMethod,now,d.id,d.version,eventId),
    ]);
    if(!results[1].meta.changes)return reply({error:'Request changed or no longer exists; refresh'},409);
    return reply({ok:true});
  }catch{return reply({error:'Storage unavailable'},503);}
}
export async function DELETE(request:Request) {
  if(!await isAdmin()||!sameOrigin(request))return reply({error:'Forbidden'},403);
  let id:string;try {const text=await request.text();if(text.length>150)throw new Error();const d=JSON.parse(text);if(typeof d.id!=='string'||!/^[a-f0-9-]{36}$/i.test(d.id))throw new Error();id=d.id;}catch{return reply({error:'Invalid request'},400);}
  try {const db=requestDb();const results=await db.batch([db.prepare('DELETE FROM referral_events WHERE referral_id = ?').bind(id),db.prepare('DELETE FROM referral_requests WHERE id = ?').bind(id)]);return results[1].meta.changes?reply({ok:true}):reply({error:'Not found'},404);}catch{return reply({error:'Storage unavailable'},503);}
}
