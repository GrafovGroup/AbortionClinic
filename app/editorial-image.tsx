import {Artwork,artworkForRoute} from '../lib/imagery';

type Props={route?:string;art?:Artwork;fr:boolean;priority?:boolean;className?:string;decorative?:boolean;sizes?:string};
export default function EditorialImage({route='',art,fr,priority=false,className='',decorative=false,sizes}:Props){
  const image=art||artworkForRoute(route);
  if(!image)return null;
  return <figure className={`editorial-image ${className}`} aria-hidden={decorative||undefined}>
    <img src={`/images/${image.file}-1280.webp`} srcSet={`/images/${image.file}-640.webp 640w, /images/${image.file}-1280.webp 1280w`} sizes={sizes||(className.includes('pathway')?'(max-width: 700px) 90vw, 30vw':'(max-width: 780px) 90vw, 42vw')} width={image.width} height={image.height} alt={decorative?'':image.alt[fr?1:0]} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':undefined} decoding="async"/>
  </figure>;
}
