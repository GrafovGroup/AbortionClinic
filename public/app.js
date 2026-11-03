import { ui } from './ui.mjs';
import { pathFor, providerPath } from './routes.mjs';
import { filterProviders, validateProviders } from './directory.mjs';
const lang=document.body.dataset.lang,u=ui[lang];
document.querySelector('#quick-exit')?.addEventListener('click',event=>{event.preventDefault();window.location.replace('https://www.google.com');});
const form=document.querySelector('#directory-search')||document.querySelector('#home-search');
const results=document.querySelector('#results'),status=document.querySelector('#directory-status');
const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;};
const link=(text,href,cls)=>{const a=el('a',text,cls);a.href=href;a.rel='noreferrer';return a;};
if(form&&results){
 let records=[],failed=false,loaded=false;
 const isHome=form.id==='home-search',input=form.elements.location,region=form.elements.region;
 for(const field of form.elements)field.disabled=false;
 const fragment=window.location.hash.slice(1),params=new URLSearchParams(fragment);
 const initialRegion=document.querySelector('[data-region]')?.dataset.region||fragment.toUpperCase();
 if(region&&[...region.options].some(o=>o.value===initialRegion))region.value=initialRegion;
 if(params.has('q'))input.value=params.get('q').slice(0,100);
 if(window.location.hash)history.replaceState(null,'',window.location.pathname);
 const empty=(title,text,error=false)=>{
  const box=el('div',null,error?'error-state':'empty-state');
  box.append(el('h2',title),el('p',text));
  if(error){const retry=el('button',u.retry,'button');retry.type='button';retry.addEventListener('click',load);box.append(retry);}
  else box.append(link(u.emptyAction,pathFor(lang,'information'),'button-secondary'));
  return box;
 };
 const render=()=>{
  results.replaceChildren();
  if(failed){status.textContent=u.errorTitle;results.append(empty(u.errorTitle,u.errorText,true));return;}
  const matches=filterProviders(records,input.value,region?.value||'');
  status.textContent=records.length?`${matches.length} ${u.count}`:u.statusEmpty;
  if(!matches.length){results.append(empty(records.length?u.noMatchTitle:u.emptyTitle,records.length?u.noMatchText:u.emptyText));return;}
  for(const p of matches){
   const card=el('article',null,'provider-card');
   card.append(el('p',`${p.city} · ${p.province}`,'eyebrow'),el('h3',p.name[lang]),el('p',p.address[lang]||`${p.city}, ${p.regionName?.[lang]||p.province}`));
   const reviewLabel=p.provenance?(lang==='en'?'Review date reported by original listing':'Date de révision indiquée dans la fiche originale'):u.reviewed;
   card.append(el('p',`${reviewLabel}: ${p.reviewed}`));
   card.append(link(u.details,providerPath(lang,p.id)),link(u.website,p.website));
   if(p.phone)card.append(link(`${u.phone}: ${p.phoneDisplay||p.phone}`,`tel:${p.phone}`));
   results.append(card);
  }
 };
 async function load(){
  results.setAttribute('aria-busy','true');
  try{const response=await fetch('/providers.json',{credentials:'omit',cache:'no-store'});if(!response.ok)throw new Error('Directory unavailable');records=validateProviders(await response.json());failed=false;loaded=true;}
  catch{failed=true;}
  finally{results.removeAttribute('aria-busy');render();}
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(isHome)document.querySelector('#home-results-section').hidden=false;
  if(loaded)render();else await load();
  if(isHome)document.querySelector('#home-results-section').scrollIntoView({block:'start'});
 });
 form.addEventListener('reset',event=>{event.preventDefault();input.value='';if(region)region.value='';render();});
 region?.addEventListener('change',render);
 if(!isHome)await load();
}
