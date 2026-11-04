import {requestDb,purgeExpired,validateRequest,sameOrigin} from '../../../lib/requests';
import {prepareRequestTargets} from '../../../lib/provider-request-targets';

export async function POST(request:Request) {
  if (!sameOrigin(request)) return Response.json({error:'Origin rejected'},{status:403});
  if (Number(request.headers.get('content-length') || 0) > 5000) return Response.json({error:'Too large'},{status:413});
  let data;
  try {
    const body=await request.text();
    if (body.length>5000) return Response.json({error:'Too large'},{status:413});
    data=validateRequest(JSON.parse(body));
  } catch {return Response.json({error:'Invalid business request'},{status:400});}
  try {
    const db=requestDb();
    await purgeExpired();
    const id=crypto.randomUUID();
    const cutoff=new Date(Date.now()-3600000).toISOString();
    const statements=[db.prepare(`INSERT INTO provider_requests (id,organization,email,evidence,kind,status,created_at)
      SELECT ?,?,?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM provider_requests WHERE email=? AND created_at>?)`)
      .bind(id,data.organization,data.email,data.evidence,data.kind,'pending',new Date().toISOString(),data.email,cutoff)];
    if (data.target) {
      await prepareRequestTargets(db);
      statements.push(db.prepare(`INSERT INTO provider_request_targets (request_id,provider_id,provider_name)
        SELECT id,?,? FROM provider_requests WHERE id=?`).bind(data.target.id,data.target.name,id));
    }
    const [saved]=await db.batch(statements);
    if (!saved.meta.changes) return Response.json({error:'Please wait before submitting again'},{status:429});
    return Response.json({id,status:'pending'},{status:201,headers:{'Cache-Control':'no-store'}});
  } catch {
    console.error('Provider request storage unavailable');
    return Response.json({error:'Storage unavailable'},{status:503});
  }
}
