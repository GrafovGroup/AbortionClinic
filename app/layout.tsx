import type {Metadata} from 'next';
import {headers} from 'next/headers';
import './globals.css';
import './editorial-refresh.css';
import './home-care.css';
export const metadata:Metadata={title:'Abortion in Canada – Clinics and information | AbortionClinic.ca',description:'Independent Canadian abortion information, clinic phone numbers and official websites in English and French.',referrer:'no-referrer',verification:{google:'3Xvvi6TRF95i5XunAf38kAXH1OrO_3q26FKiWRJWuCw',other:{'msvalidate.01':'8540AF3FE8C8197267E84BBE602115F7'}},alternates:{canonical:'https://abortionclinic.ca/',languages:{'en-CA':'https://abortionclinic.ca/','fr-CA':'https://abortionclinic.ca/fr/'}}};
export default async function RootLayout({children}:{children:React.ReactNode}){
  const h=await headers();
  return <html lang={h.get('x-site-language')==='fr'?'fr-CA':'en-CA'}>
    <head>
      {/* Keep icons in the initial head, independent of streamed route metadata. */}
      <link rel="icon" href="/favicon.ico?v=ac1" type="image/x-icon" sizes="16x16 32x32 48x48"/>
      <link rel="icon" href="/favicon-32.png?v=ac1" type="image/png" sizes="32x32"/>
      <link rel="icon" href="/favicon-96.png?v=ac1" type="image/png" sizes="96x96"/>
      <link rel="icon" href="/favicon.svg?v=ac1" type="image/svg+xml" sizes="any"/>
      <link rel="shortcut icon" href="/favicon.ico?v=ac1"/>
      <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=ac1" type="image/png" sizes="180x180"/>
    </head>
    <body>{children}</body>
  </html>;
}
