import { parseFragment, serialize } from 'parse5';
import { pathFor } from '../public/routes.mjs';
// Published markup is reference data, not application code. Rebuild only its
// static content; discard scripts, intake controls and backend integrations.
const removed=new Set(['script','style','iframe','object','embed','form','input','textarea','select','button','link','meta']);
export function cleanMetadata(value,lang){
 return String(value||'').replace(/(?:Request|Demandez)[^.]*AbortionClinic\.ca\.?/gi,'').replace(/,?\s*and request a clinic connection\.?/gi,'.').replace(/Get connected/gi,'Clinics').replace(/Mise en relation/gi,'Répertoire des cliniques').replace(/\s+/g,' ').trim();
}
const wording = [
 ['No. AbortionClinic.ca is an independent information and provider-navigation platform. We help visitors contact clinics, but do not provide treatment, book appointments or accept medical records.','No. AbortionClinic.ca is an independent information resource and public provider directory. Visitors contact providers independently. We do not provide treatment, referrals, appointment booking or patient coordination.'],
 ['Non. AbortionClinic.ca est une plateforme indépendante d’information et d’orientation. Nous aidons les visiteurs à joindre des cliniques, mais ne fournissons pas de traitements, ne réservons pas de rendez-vous et n’acceptons pas de dossiers médicaux.','Non. AbortionClinic.ca est une ressource d’information indépendante et un répertoire public. Les visiteurs contactent les fournisseurs directement. Nous n’offrons ni traitement, ni orientation, ni prise de rendez-vous, ni coordination des soins.'],
 ['You can ask our team for help connecting with a clinic.','You can contact a provider directly using its official website or public telephone number.'],
 ['Vous pouvez demander à notre équipe de vous aider à joindre une clinique.','Vous pouvez contacter un fournisseur directement par son site officiel ou son numéro public.'],
 [' The virtual-care filter only includes services publicly describing virtual abortion appointments.',''],
 [' Le filtre des soins virtuels comprend uniquement les services qui décrivent publiquement des rendez-vous d’avortement à distance.','']
];
export function recoveredContent(html,lang){
 const root=parseFragment(html||'');
 const attr=(node,name)=>node.attrs?.find(a=>a.name===name);
 function visit(node){
  node.childNodes=(node.childNodes||[]).filter(n=>!removed.has(n.tagName));
  for(const child of node.childNodes){
   if(child.nodeName==='#text')for(const [from,to] of wording)child.value=child.value.replaceAll(from,to);
   if(child.attrs){
    child.attrs=child.attrs.filter(a=>!/^on/i.test(a.name)&&!['style','srcdoc','action','method','formaction','autofocus'].includes(a.name));
    for(const a of child.attrs){
     if(a.name==='href'){
      if(/^(javascript|data):/i.test(a.value))a.value=pathFor(lang,'clinics');
      if(a.value.startsWith('https://abortionclinic.ca/'))a.value=a.value.replace('https://abortionclinic.ca','');
      if(/request-connection|demander-une-mise-en-relation/.test(a.value)){
       a.value=pathFor(lang,'clinics');
       child.childNodes=[{nodeName:'#text',value:lang==='en'?'Browse clinics':'Consulter les cliniques',parentNode:child}];
      }
     }
    }
    if(child.tagName==='a'&&/^https?:/.test(attr(child,'href')?.value||''))child.attrs.push({name:'rel',value:'noreferrer'});
   }
   visit(child);
  }
 }
 visit(root);
 // Return inner main; the shared shell owns the single main landmark.
 const main=root.childNodes.find(n=>n.tagName==='main');
 return serialize(main||root);
}
