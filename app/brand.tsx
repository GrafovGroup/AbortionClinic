export default function Brand({href='/',className=''}:{href?:string;className?:string}){
  return <a className={`brand brand-logo ${className}`.trim()} href={href}>
    <img src="/brand/abortionclinic-logo.webp" width="1478" height="264" alt="AbortionClinic.ca" decoding="async"/>
  </a>;
}
