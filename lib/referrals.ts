import {providers} from './providers';
import {resolveRoute} from './routes';
import {consentVersion,referralStatuses,type ReferralStatus} from './referral-content';

export type ReferralRow = {
  id:string;name:string;contact:string;method:'email'|'phone';language:'en'|'fr';provider_id:string|null;
  assigned_provider_id:string|null;connection_method:'details_to_visitor'|'shared_with_clinic'|null;
  source_path:string;locale:'en'|'fr';voicemail:number;share_consent:number;consent_version:string;
  consented_at:string;status:ReferralStatus;created_at:string;updated_at:string;version:number;
  notification_status:NotificationStatus;notification_attempted_at:string|null;
};
export type NotificationStatus = 'not_requested'|'pending'|'sending'|'accepted'|'failed'|'unknown';
export type ReferralEvent = {id:string;referral_id:string;status:ReferralStatus;provider_id:string|null;connection_method:string|null;created_at:string;actor:string};
export function validateReferral(input:unknown) {
  if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Invalid request');
  const d=input as Record<string,unknown>;
  const clean=(key:string,max:number)=>{const v=d[key];if(typeof v!=='string'||v.length>max||/[\x00-\x1f\x7f]/.test(v))throw new Error('Invalid field');return v.trim();};
  const name=clean('name',80),rawContact=clean('contact',254),providerId=clean('providerId',100);
  const requestToken=clean('requestToken',36);
  if(!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestToken))throw new Error('Invalid token');
  if(!['email','phone'].includes(d.method as string)||!['en','fr'].includes(d.language as string)||!['en','fr'].includes(d.locale as string))throw new Error('Invalid preference');
  if(d.consent!==true||d.consentVersion!==consentVersion||typeof d.shareConsent!=='boolean'||typeof d.voicemail!=='boolean'||d.website)throw new Error('Invalid consent');
  if(providerId&&!providers.some(p=>p.id===providerId)||d.shareConsent&&!providerId||d.voicemail&&d.method!=='phone')throw new Error('Invalid preference');
  let contact=rawContact.toLowerCase();
  if(d.method==='email') {if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact))throw new Error('Invalid email');}
  else {const digits=rawContact.replace(/\D/g,'');if(!/^\+?[\d\s().-]+$/.test(rawContact)||digits.length<10||digits.length>15)throw new Error('Invalid telephone');contact=digits.length===10?'+1'+digits:'+'+digits;}
  const rawSource=clean('sourcePath',250);
  // Only an existing internal page is retained; query strings and external referrers are never stored.
  const sourcePath=rawSource.startsWith('/')&&!rawSource.startsWith('//')&&!/[?#\\]/.test(rawSource)&&resolveRoute(rawSource).valid?'/'+rawSource.split('/').filter(Boolean).join('/')+(rawSource==='/'?'':'/'):(d.locale==='fr'?'/fr/demander-une-mise-en-relation/':'/request-connection/');
  return {name,contact,providerId:providerId||null,requestToken,method:d.method as 'email'|'phone',language:d.language as 'en'|'fr',locale:d.locale as 'en'|'fr',voicemail:d.voicemail?1:0,shareConsent:d.shareConsent?1:0,sourcePath};
}
export function validateReferralUpdate(input:unknown) {
  const d=input as Record<string,unknown>;
  if(!d||typeof d.id!=='string'||!/^[a-f0-9-]{36}$/i.test(d.id)||!Number.isInteger(d.version)||Number(d.version)<0||!referralStatuses.includes(d.status as ReferralStatus))throw new Error('Invalid update');
  if(typeof d.assignedProviderId!=='string'||d.assignedProviderId&&!providers.some(p=>p.id===d.assignedProviderId)||!['','details_to_visitor','shared_with_clinic'].includes(d.connectionMethod as string))throw new Error('Invalid connection');
  if(d.status==='connected'&&(!d.assignedProviderId||!d.connectionMethod||d.confirmConnected!==true))throw new Error('Confirm the completed connection');
  return {id:d.id,version:Number(d.version),status:d.status as ReferralStatus,assignedProviderId:d.assignedProviderId||null,connectionMethod:d.status==='connected'?d.connectionMethod as string:null};
}
