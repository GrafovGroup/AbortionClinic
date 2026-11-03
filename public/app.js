import { ui, routes } from './ui.mjs';
import { filterProviders, validateProviders } from './directory.mjs';
const lang=document.body.dataset.lang;
const u=ui[lang];
const path=page=>`/${lang}/${routes[lang][page]}/`;
const menu=document.querySelector('#menu-toggle');
const nav=document.querySelector('#main-nav');
document.body.classList.add('js');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.focus();}});
nav?.addEventListener('click',event=>{if(event.target.closest('a')){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}});
document.querySelector('#quick-exit')?.addEventListener('click',event=>{event.preventDefault();window.location.replace('https://www.google.com');});
const form=document.querySelector('#directory-search');
const results=document.querySelector('#results');
const status=document.querySelector('#directory-status');
const el=(tag,text,cls)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;};
const link=(text,href,cls)=>{const a=el('a',text,cls);a.href=href;a.rel='noreferrer';return a;};
if(form&&results){
 let records=[],failed=false;
 const input=form.elements.location, region=form.elements.region;
 for(const field of form.elements)field.disabled=false;
 const initialRegion=window.location.hash.slice(1).toUpperCase();
 if([...region.options].some(o=>o.value===initialRegion))region.value=initialRegion;
 if(window.location.hash)history.replaceState(null,'',window.location.pathname);
 const empty=(title,text,error=false)=>{
  const box=el('div',null,error?'error-state':'empty-state');
  box.append(el('div',error?'↻':'⌖','empty-icon'),el('h2',title),el('p',text));
  if(error){const retry=el('button',u.retry,'button');retry.type='button';retry.addEventListener('click',load);box.append(retry);}
  else box.append(link(u.emptyAction,path('information'),'button-secondary'));
  return box;
 };
 const render=()=>{
  results.replaceChildren();
  if(failed){status.textContent=u.errorTitle;results.append(empty(u.errorTitle,u.errorText,true));return;}
  const matches=filterProviders(records,input.value,region.value);
  status.textContent=records.length?`${matches.length} ${u.count}`:u.statusEmpty;
  if(!matches.length){results.append(empty(records.length?u.noMatchTitle:u.emptyTitle,records.length?u.noMatchText:u.emptyText));return;}
  for(const p of matches){
   const card=el('article',null,'provider-card');
   card.append(el('span',`${p.city} · ${p.province}`,'eyebrow'),el('h3',p.name[lang]),el('p',p.address[lang]));
   card.append(el('p',`${u.reviewed}: ${p.reviewed}`));
   card.append(link(u.details,`${path('clinics')}${p.id}/`),link(u.website,p.website));
   if(p.phone)card.append(link(`${u.phone}: ${p.phone}`,`tel:${p.phone.replace(/[^+\d]/g,'')}`));
   results.append(card);
  }
 };
 async function load(){
  results.setAttribute('aria-busy','true');
  try{const response=await fetch('/providers.json',{credentials:'omit',cache:'no-store'});if(!response.ok)throw new Error('Directory unavailable');records=validateProviders(await response.json());failed=false;}
  catch{failed=true;}
  finally{results.removeAttribute('aria-busy');render();}
 }
 form.addEventListener('submit',event=>{event.preventDefault();render();});
 form.addEventListener('reset',event=>{event.preventDefault();input.value='';region.value='';render();});
 region.addEventListener('change',render);
 await load();
}
