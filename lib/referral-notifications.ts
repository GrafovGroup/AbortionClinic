import {referralReference} from './referral-content';
import type {NotificationStatus} from './referrals';

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkjnebre';
const PRIVATE_INBOX = 'https://abortionclinic-ca.dimagrafov.chatgpt.site/admin/';

// Explicit allowlist: never send visitor fields, tokens, IPs or source pages.
export function notificationPayload(id:string) {
  return {
    subject: 'New website request',
    reference: referralReference(id),
    message: 'A new request is saved in your private inbox. Sign in to review contact preferences and follow up. This alert contains no visitor contact details.',
    inbox: PRIVATE_INBOX,
  };
}

/** Accepting an alert is separate from saving a lead or delivering an email. */
export async function notifyReferral(db:D1Database,id:string,retry=false,send:typeof fetch=fetch):Promise<NotificationStatus> {
  const now=new Date().toISOString(),stale=new Date(Date.now()-60000).toISOString();
  // A single atomic claim prevents concurrent visitor retries from sending twice.
  // Only an administrator can retry a rejected or uncertain delivery.
  const claimed=await db.prepare(`UPDATE referral_requests SET notification_status = 'sending',notification_attempted_at = ?
    WHERE id = ? AND (notification_status = 'pending' OR (? = 1 AND
      (notification_status IN ('failed','unknown') OR (notification_status = 'sending' AND notification_attempted_at < ?))))`)
    .bind(now,id,retry?1:0,stale).run();
  if(!claimed.meta.changes) {
    const row=await db.prepare('SELECT notification_status FROM referral_requests WHERE id = ?').bind(id).first<{notification_status:NotificationStatus}>();
    return row?.notification_status||'not_requested';
  }
  let status:NotificationStatus='unknown';
  let failureReason='request_error';
  let httpStatus:number|undefined;
  try {
    const response=await send(FORMSPREE_ENDPOINT,{
      method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
      // workerd rejects redirect:'error' before sending. Manual mode preserves
      // the no-redirect rule and lets us inspect a challenge/redirect response.
      body:JSON.stringify(notificationPayload(id)),redirect:'manual',signal:AbortSignal.timeout(8000),
    });
    httpStatus=response.status;
    if(!response.ok) {
      status='failed';
      failureReason=response.status>=300&&response.status<400?'redirect':'http_error';
    }
    else {
      failureReason='invalid_response';
      const body=await response.json() as {ok?:boolean;next?:string;error?:unknown;errors?:unknown};
      // Formspree's official client recognizes a `next` string as success.
      // Do not follow that URL or count validation/challenge responses as accepted.
      const hasErrors=body?.error||(Array.isArray(body?.errors)?body.errors.length:body?.errors);
      status=!hasErrors&&body?.ok!==false&&(body?.ok===true||typeof body?.next==='string')?'accepted':'failed';
      failureReason='service_rejection';
    }
  }catch(error) {
    // A timeout or lost response does not prove Formspree rejected the alert.
    status='unknown';
    if(error instanceof Error&&(error.name==='TimeoutError'||error.name==='AbortError'))failureReason='timeout';
  }
  if(status!=='accepted') {
    // Fixed categories only: never log the response body, headers, error
    // message, request reference, or any visitor information.
    console.warn('Connection alert not confirmed',{reason:failureReason,...(httpStatus===undefined?{}:{httpStatus})});
  }
  await db.prepare("UPDATE referral_requests SET notification_status = ? WHERE id = ? AND notification_status = 'sending' AND notification_attempted_at = ?")
    .bind(status,id,now).run();
  return status;
}
