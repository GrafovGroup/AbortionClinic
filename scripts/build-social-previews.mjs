import {mkdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

// Deterministic social UI cards with the approved logo, photo and exact text.
// ImageMagick and fontconfig are build-time tools; only static JPEGs are served.
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const logo=join(root,'public/brand/abortionclinic-logo.webp');
const photo=join(root,'public/images/care-consultation-v2-1280.webp');
const out=join(root,'public/social');
await mkdir(out,{recursive:true});
const font=name=>{
  const result=spawnSync('fc-match',['-f','%{file}',name],{encoding:'utf8'});
  if(result.status!==0||!result.stdout)throw new Error('Missing build font: '+name);
  return result.stdout;
};
const sans=font('Arial'),serif=font('Georgia');
const copy={
  en:{heading:['Abortion clinics','in Canada.'],body:['Clinic contacts and','information about care.'],label:'INDEPENDENT CANADIAN DIRECTORY'},
  fr:{heading:['Cliniques','d’avortement','au Canada.'],body:['Coordonnées des cliniques','et information sur les soins.'],label:'RÉPERTOIRE CANADIEN INDÉPENDANT'},
};
for(const [lang,text] of Object.entries(copy)){
  const titleY=lang==='fr'?166:202;
  const bodyY=lang==='fr'?416:394;
  const destination=join(out,'abortionclinic-'+lang+'.jpg');
  const args=['-size','1200x630','xc:#293f5c',
    '-fill','#ffffff','-draw','rectangle 0,0 1200,112',
    '(',logo,'-resize','330x59',')','-gravity','NorthWest','-geometry','+56+28','-composite',
    '(',photo,'-resize','680x518^','-gravity','North','-extent','680x518',')','-gravity','NorthWest','-geometry','+520+112','-composite',
    '-fill','#365d7d','-font',sans,'-pointsize','20','-gravity','NorthEast','-annotate','+56+42','English / Français',
    '-gravity','NorthWest','-fill','#ffffff','-font',serif,'-pointsize','48',
    ...text.heading.flatMap((line,i)=>['-annotate',`+56+${titleY+i*64}`,line]),
    '-fill','#e0e8f1','-font',sans,'-pointsize','24',
    ...text.body.flatMap((line,i)=>['-annotate',`+56+${bodyY+i*34}`,line]),
    '-fill','#c3d3e4','-pointsize','13','-kerning','1.2','-annotate','+56+568',text.label,
    '-strip','-sampling-factor','4:4:4','-quality','90',destination];
  const result=spawnSync('convert',args,{encoding:'utf8'});
  if(result.status!==0)throw new Error(result.stderr||'Unable to render social preview');
  console.log(destination);
}
