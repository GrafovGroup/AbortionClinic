import Site from '../site';
import {resolveRoute} from '../../lib/routes';
import {notFound,permanentRedirect} from 'next/navigation';
import {metadataForRoute} from '../../lib/seo';
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;return metadataForRoute(slug.join('/'));}
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const route=slug.join('/');const result=resolveRoute(route);if(result.translatedAlias)permanentRedirect(result.translatedAlias);if(!result.valid)notFound();if(result.redirectTo)permanentRedirect(result.redirectTo+(result.retiredDestination?'#main':''));return <Site route={route}/>}
