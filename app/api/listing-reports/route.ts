import {requestDb,sameOrigin} from '../../../lib/requests';
import {prepareListingReports,purgeListingReports,readSmallJSON,saveListingReport,validateListingReport} from '../../../lib/listing-reports';

const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow'}});
export async function POST(request:Request) {
  if(!sameOrigin(request))return reply({error:'Origin rejected'},403);
  if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return reply({error:'JSON required'},415);
  let report;
  try {report=validateListingReport(await readSmallJSON(request));}
  catch(error){return reply({error:error instanceof RangeError?'Too large':'Invalid listing report'},error instanceof RangeError?413:400);}
  try {
    const db=requestDb();await prepareListingReports(db);await purgeListingReports(db);
    if(!await saveListingReport(db,report))return reply({error:'Report limit reached. Please try again later.'},429);
    // Identical responses for first and repeated reports reveal no queue details.
    return reply({status:'received'},202);
  }catch{return reply({error:'Report storage unavailable'},503);}
}
