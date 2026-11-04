import {Artwork,artworkForRoute} from '../lib/imagery';

type Props={route?:string;art?:Artwork;fr:boolean;priority?:boolean;className?:string;decorative?:boolean};
export default function EditorialImage({route='',art,fr,priority=false,className='',decorative=false}:Props){
  const image=art||artworkForRoute(route);
  if(!image)return null;
  return <figure className={`editorial-image editorial-image--${image.frame||'rounded'}${image.healthcare?' editorial-image--healthcare':''} ${className}`} aria-hidden={decorative||undefined}>
    <img src={`/images/${image.file}-1280.webp`} srcSet={`/images/${image.file}-640.webp 640w, /images/${image.file}-1280.webp 1280w`} sizes={className.includes('pathway')?'(max-width: 700px) 90vw, 30vw':'(max-width: 700px) 90vw, 38vw'} width={1280} height={853} alt={decorative?'':image.alt[fr?1:0]} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':undefined} decoding="async" style={image.position?{objectPosition:image.position}:undefined}/>
  </figure>;
}
