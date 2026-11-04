import {isAdmin} from '../../../../lib/admin';
import {requestDb,sameOrigin} from '../../../../lib/requests';
import {prepareSourceChecks, sourceReviewCatalogue, reviewRows, checkPublishedSource, type CheckedSource} from '../../../../lib/source-review';

const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});

export async function GET() {
  if (!await isAdmin()) return reply({error:'Forbidden'},403);
  try {
    const db=requestDb();
    await prepareSourceChecks(db);
    const result=await db.prepare('SELECT url,outcome,http_status,checked_at FROM source_link_checks').all<CheckedSource>();
    return reply(reviewRows(result.results));
  } catch {return reply({error:'Review queue unavailable'},503);}
}

export async function POST(request:Request) {
  if (!await isAdmin()||!sameOrigin(request)) return reply({error:'Forbidden'},403);
  let id:string;
  try {
    if (Number(request.headers.get('content-length')||0)>256) return reply({error:'Too large'},413);
    const body=await request.text();
    if (body.length>256) return reply({error:'Too large'},413);
    const data=JSON.parse(body);
    if (typeof data.id!=='string') throw new Error();
    id=data.id;
  } catch {return reply({error:'Invalid content item'},400);}
  const entry=sourceReviewCatalogue().find(item=>item.id===id);
  if (!entry) return reply({error:'Unknown content item'},404);
  try {
    const db=requestDb();
    await prepareSourceChecks(db);
    const urls=entry.urls;
    const checked=[];
    for (let index=0;index<urls.length;index+=4) {
      checked.push(...await Promise.all(urls.slice(index,index+4).map(url=>checkPublishedSource(url))));
    }
    const upsert=`INSERT INTO source_link_checks(url,outcome,http_status,checked_at) VALUES(?,?,?,?)
      ON CONFLICT(url) DO UPDATE SET outcome=excluded.outcome,http_status=excluded.http_status,checked_at=excluded.checked_at
      WHERE excluded.checked_at>=source_link_checks.checked_at`;
    await db.batch(checked.map(row=>db.prepare(upsert).bind(row.url,row.outcome,row.http_status,row.checked_at)));
    return reply({checked:checked.length});
  } catch {return reply({error:'Link check unavailable'},503);}
}
