import Site from './site';
import {metadataForRoute} from '../lib/seo';
export const metadata=metadataForRoute('');
export default function Home(){return <Site route=""/>}
