import {requestDb} from './requests';
export const referralHeaders={'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'};
export async function purgeExpiredReferrals() {
  const cutoff=new Date(Date.now()-90*86400000).toISOString();const db=requestDb();
  await db.batch([
    db.prepare('DELETE FROM referral_events WHERE referral_id IN (SELECT id FROM referral_requests WHERE created_at < ?)').bind(cutoff),
    db.prepare('DELETE FROM referral_requests WHERE created_at < ?').bind(cutoff),
  ]);
}
export async function tokenHash(token:string) {
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
}
