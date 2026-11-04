import {providers} from './providers';

export const listingIssueLabels = {
  phone: ['Phone number may be incorrect', 'Le numéro de téléphone semble incorrect'],
  link: ['Website link is broken', 'Le lien du site Web ne fonctionne pas'],
  closed: ['Service may have closed', 'Le service semble avoir fermé'],
  location: ['Location may be incorrect', 'Le lieu indiqué semble incorrect'],
  services: ['Listed services may have changed', 'Les services indiqués semblent avoir changé'],
} satisfies Record<string, [string,string]>;
export type ListingIssue = keyof typeof listingIssueLabels;
export type ListingReport = {id:string;provider_id:string;issue:ListingIssue;status:'pending'|'resolved';created_at:string;resolved_at:string|null};
export type ListingReportRow = ListingReport & {provider_name:string;city:string;province:string};

export function validateListingReport(value:unknown) {
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid report');
  const data=value as Record<string,unknown>;
  if(Object.keys(data).some(key=>!['listing','issue','website'].includes(key)))throw new Error('Unexpected report field');
  if(typeof data.listing!=='string'||!providers.some(provider=>provider.id===data.listing))throw new Error('Unknown listing');
  if(typeof data.issue!=='string'||!Object.hasOwn(listingIssueLabels,data.issue))throw new Error('Unknown issue');
  if(data.website!==undefined&&data.website!=='')throw new Error('Invalid report');
  return {providerId:data.listing,issue:data.issue as ListingIssue};
}

export async function readSmallJSON(request:Request,maxBytes=1024) {
  if(Number(request.headers.get('content-length')||0)>maxBytes)throw new RangeError('Too large');
  const reader=request.body?.getReader();
  if(!reader)throw new Error('Missing body');
  const decoder=new TextDecoder();let length=0;let body='';
  try {
    for(;;){const part=await reader.read();if(part.done)break;length+=part.value.byteLength;if(length>maxBytes){await reader.cancel();throw new RangeError('Too large');}body+=decoder.decode(part.value,{stream:true});}
    body+=decoder.decode();return JSON.parse(body);
  } finally {reader.releaseLock();}
}

export async function prepareListingReports(db:D1Database) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS listing_reports (
    id TEXT PRIMARY KEY NOT NULL, provider_id TEXT NOT NULL,
    issue TEXT NOT NULL CHECK(issue IN ('phone','link','closed','location','services')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','resolved')),
    created_at TEXT NOT NULL, resolved_at TEXT
  )`).run();
  await db.prepare(`CREATE UNIQUE INDEX IF NOT EXISTS listing_reports_pending_issue
    ON listing_reports(provider_id,issue) WHERE status='pending'`).run();
  await db.prepare('CREATE INDEX IF NOT EXISTS listing_reports_created_at ON listing_reports(created_at)').run();
}

export async function purgeListingReports(db:D1Database,now=Date.now()) {
  await db.prepare('DELETE FROM listing_reports WHERE created_at < ?').bind(new Date(now-90*86400000).toISOString()).run();
}

// The database stores only an issue category and a public listing identifier.
// A repeated pending issue is combined without recording a visitor identifier.
export async function saveListingReport(db:D1Database,report:ReturnType<typeof validateListingReport>,now=Date.now()) {
  const createdAt=new Date(now).toISOString();
  const hourAgo=new Date(now-3600000).toISOString();
  const result=await db.prepare(`INSERT INTO listing_reports (id,provider_id,issue,status,created_at)
    SELECT ?,?,?,'pending',?
    WHERE NOT EXISTS (SELECT 1 FROM listing_reports WHERE provider_id=? AND issue=? AND status='pending')
      AND (SELECT COUNT(*) FROM listing_reports WHERE created_at>?) < 60
    ON CONFLICT DO NOTHING`).bind(crypto.randomUUID(),report.providerId,report.issue,createdAt,report.providerId,report.issue,hourAgo).run();
  if(result.meta.changes)return true;
  const existing=await db.prepare("SELECT id FROM listing_reports WHERE provider_id=? AND issue=? AND status='pending'").bind(report.providerId,report.issue).first();
  return !!existing;
}

export function listingReportRows(reports:ListingReport[]):ListingReportRow[] {
  return reports.map(report=>{const provider=providers.find(provider=>provider.id===report.provider_id);return {...report,provider_name:provider?.name||report.provider_id,city:provider?.city||'',province:provider?.province||''};});
}
