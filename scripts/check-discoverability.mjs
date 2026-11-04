import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createServer} from 'vite';

// Check the entire supported route space, not a sample of city names.
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,ws:false,watch:null},logLevel:'error'});
try {
  const {allPaths,resolveRoute}=await server.ssrLoadModule('/lib/routes.ts');
  const {locations,provincePath,locationPath,locationCarePath,coverageGuideForLocation,localProviders}=await server.ssrLoadModule('/lib/locations.ts');
  const {metadataForRoute,breadcrumbsForRoute,structuredDataForRoute,lastModifiedForRoute}=await server.ssrLoadModule('/lib/seo.ts');
  const {providers}=await server.ssrLoadModule('/lib/providers.ts');
  const {GET:sitemap}=await server.ssrLoadModule('/app/sitemap.xml/route.ts');
  const {cityGuides,cityGuideForLocation,cityGuidePath}=await server.ssrLoadModule('/lib/city-guides.ts');
  const active=allPaths();
  const activeSet=new Set(active);
  const legacy=allPaths(true).filter(path=>!activeSet.has(path));
  const indexable=active.filter(path=>resolveRoute(path).indexable);
  assert.equal(new Set(active).size,active.length);
  for(const path of active){
    const r=resolveRoute(path);
    assert(r.valid,`Invalid active route ${path}`);
    assert(!r.redirectTo,`Legacy route still generated: ${path}`);
    assert(!r.location||r.cityGuide,`Uncurated city landing page generated: ${path}`);
    const alternate=r.equivalent.replace(/^\/|\/$/g,'');
    assert(activeSet.has(alternate),`Missing alternate ${path}`);
    assert.equal(resolveRoute(alternate).equivalent.replace(/^\/|\/$/g,''),path);
    for(const crumb of breadcrumbsForRoute(path))assert(!resolveRoute(crumb.path).redirectTo,`Legacy breadcrumb on ${path}`);
    for(const node of structuredDataForRoute(path)['@graph']){
      for(const item of node.mainEntity?.itemListElement||[]){
        assert(!resolveRoute(new URL(item.url).pathname).redirectTo,`Legacy structured-data link on ${path}`);
      }
    }
    const meta=metadataForRoute(path);
    assert.equal(meta.robots.index,r.indexable);
    if(r.key==='find-care')assert(r.indexable,`Directory cannot be indexed: ${path}`);
    if(r.isLocationDirectory&&!r.province)assert(r.indexable,`National city hub cannot be indexed: ${path}`);
    if(['for-providers','report-listing'].includes(r.key))assert(!r.indexable,`Utility route indexed: ${path}`);
    const graph=structuredDataForRoute(path)['@graph'];
    const publisher=graph.find(node=>node['@id']==='https://abortionclinic.ca/#publisher');
    assert.equal(publisher?.['@type'],'Organization');
    assert.equal(publisher.name,'AbortionClinic.ca');
    assert(!publisher.legalName&&!publisher.address&&!publisher.medicalSpecialty,`Unsupported publisher identity claims: ${path}`);
    assert.equal(graph.find(node=>node['@type']==='WebSite').publisher['@id'],publisher['@id']);
    for(const article of graph.filter(node=>node['@type']==='Article')){
      assert(r.article,`Article metadata on non-article route: ${path}`);
      assert.equal(article.headline,r.article.title[r.fr?1:0]);
      assert.equal(article.dateModified,lastModifiedForRoute(path));
      assert(!article.author&&!article.reviewedBy&&!article.datePublished,`Unverified authorship, reviewer or publication date: ${path}`);
    }
  }
  for(const [path,target] of [['request-connection','/find-care/'],['fr/demander-une-mise-en-relation','/fr/trouver-des-soins/'],['fr/request-connection','/fr/trouver-des-soins/']]){
    const r=resolveRoute(path);
    assert.equal(r.redirectTo,target);
    assert(!activeSet.has(path)&&!r.indexable);
    assert(resolveRoute(target).indexable);
  }
  for(const path of legacy){
    const r=resolveRoute(path);
    assert(r.valid,`Lost legacy route ${path}`);
    const guide=r.location&&cityGuideForLocation(r.location);
    assert.equal(r.redirectTo,guide?cityGuidePath(guide.slug,r.fr):provincePath(r.province[0],r.fr),`Wrong consolidation target for ${path}`);
    assert(!r.indexable,`Legacy route indexed ${path}`);
    assert(!resolveRoute(r.redirectTo).redirectTo,`Redirect chain ${path}`);
  }
  for(const location of locations)for(const fr of [false,true]){
    const guide=cityGuideForLocation(location);
    const target=guide?cityGuidePath(guide.slug,fr):provincePath(location.province,fr);
    assert.equal(resolveRoute(locationPath(location,fr)).redirectTo,target);
    const destination=new URL(locationCarePath(location,fr),'https://abortionclinic.ca');
    const coverage=coverageGuideForLocation(location);
    const careTarget=guide?cityGuidePath(guide.slug,fr):localProviders(location).length?provincePath(location.province,fr):coverage?cityGuidePath(coverage.slug,fr):provincePath(location.province,fr);
    assert.equal(destination.pathname,careTarget);
    if(!guide&&!localProviders(location).length&&coverage)assert.equal(destination.hash,'#surrounding-communities');
  }
  for(const guide of cityGuides)for(const fr of [false,true]){
    const route=cityGuidePath(guide.slug,fr);
    const resolved=resolveRoute(route);
    const meta=metadataForRoute(route);
    assert(resolved.valid&&resolved.indexable&&!resolved.redirectTo,route);
    assert.equal(resolved.location.slug,guide.slug,`Guide resolved to wrong municipality: ${route}`);
    assert.equal(resolved.location.province,guide.province,`Guide resolved to wrong province: ${route}`);
    assert.equal(meta.alternates.canonical,'https://abortionclinic.ca'+route);
    assert.equal(meta.alternates.languages[fr?'en-CA':'fr-CA'],'https://abortionclinic.ca'+cityGuidePath(guide.slug,!fr));
    assert(breadcrumbsForRoute(route).length===3);
  }
  for(const provider of providers){
    assert(provider.description.every(text=>text.trim().length>40),`Missing bilingual service details: ${provider.id}`);
    assert(provider.phone&&provider.url&&provider.sources.length,`Incomplete public contacts: ${provider.id}`);
  }
  for(const invalid of ['ontario/made-up-community/','ontario/locations/999999/','fr/quebec/localites/0/'])assert(!resolveRoute(invalid).valid,`Invalid route accepted: ${invalid}`);
  const sitemapXml=await sitemap().text();
  assert.equal((sitemapXml.match(/<lastmod>/g)||[]).length,indexable.filter(path=>lastModifiedForRoute(path)).length);
  assert.equal((sitemapXml.match(/<url>/g)||[]).length,indexable.length);
  for(const path of active){
    const r=resolveRoute(path);
    const url='https://abortionclinic.ca/'+(path?path+'/':'');
    assert.equal(sitemapXml.includes('<loc>'+url+'</loc>'),r.indexable,`Wrong sitemap inclusion: ${path}`);
    const modified=lastModifiedForRoute(path);
    if(modified)assert(sitemapXml.includes('<loc>'+url+'</loc><lastmod>'+modified+'</lastmod>'),`Missing tracked revision: ${path}`);
    if(r.provider)assert.equal(modified,r.provider.reviewed);
    if(r.article)assert.equal(modified,r.article.updated||r.article.reviewed);
  }
  for(const path of ['locations','fr/localites']){
    const graph=structuredDataForRoute(path)['@graph'];
    const page=graph.find(node=>node['@id']==='https://abortionclinic.ca/'+path+'/#webpage');
    assert.equal(page.mainEntity.numberOfItems,cityGuides.length);
  }
  for(const path of ['about','editorial-policy','provider-review-policy','privacy','terms','contact','report-listing','fr/signaler-une-fiche']){
    assert(!structuredDataForRoute(path)['@graph'].some(node=>node['@type']==='Article'),`Policy/utility page misclassified as medical article: ${path}`);
  }
  for(const guide of cityGuides)for(const fr of [false,true]){
    assert(sitemapXml.includes('<loc>https://abortionclinic.ca'+cityGuidePath(guide.slug,fr)+'</loc><lastmod>'+guide.updated+'</lastmod>'));
  }
  const report={activeRoutes:active.length,indexableRoutes:indexable.length,legacyRedirects:legacy.length,municipalities:locations.length,providerProfiles:providers.length*2};
  console.log(JSON.stringify(report,null,2));
  if(process.argv.includes('--write-manifest')){
    fs.mkdirSync('work',{recursive:true});
    fs.writeFileSync('work/discoverability-routes.json',JSON.stringify({report,active,indexable,legacy:legacy.map(path=>({path,target:resolveRoute(path).redirectTo}))},null,2));
  }
} finally {await server.close();}
