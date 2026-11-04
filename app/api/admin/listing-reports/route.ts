import {isAdmin} from '../../../../lib/admin';
import {requestDb,sameOrigin} from '../../../../lib/requests';
import {prepareListingReports,purgeListingReports,readSmallJSON,listingReportRows,type ListingReport} from '../../../../lib/listing-reports';

const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
export async function GET() {
  if(!await isAdmin())return reply({error:'Forbidden'},403);
  try {
    const db=requestDb();await prepareListingReports(db);await purgeListingReports(db);
    const result=await db.prepare("SELECT id,provider_id,issue,status,created_at,resolved_at FROM listing_reports ORDER BY (status='pending') DESC,created_at DESC LIMIT 1000").all<ListingReport>();
    return reply(listingReportRows(result.results));
  }catch{return reply({error:'Reports unavailable'},503);}
}
export async function PATCH(request:Request) {
  if(!await isAdmin()||!sameOrigin(request))return reply({error:'Forbidden'},403);
  let id:string;
  try {
    const value=await readSmallJSON(request,256);
    if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(key=>key!=='id')||typeof value.id!=='string'||! /^[0-9a-f-]{36}$/i.test(value.id))throw new Error();
    id=value.id;
  }catch(error){return reply({error:'Invalid report'},error instanceof RangeError?413:400);}
  try {
    const db=requestDb();await prepareListingReports(db);await purgeListingReports(db);
    const existing=await db.prepare('SELECT id FROM listing_reports WHERE id=?').bind(id).first();
    if(!existing)return reply({error:'Report not found'},404);
    await db.prepare("UPDATE listing_reports SET status='resolved',resolved_at=? WHERE id=? AND status='pending'").bind(new Date().toISOString(),id).run();
    return reply({status:'resolved'});
  }catch{return reply({error:'Report update unavailable'},503);}
}
