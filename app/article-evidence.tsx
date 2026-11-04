import type {Article} from '../lib/content';
import {pathFor} from '../lib/content';
import {formatDate,localizedResource} from '../lib/localization';
import {sourceLabel} from '../lib/source-labels';
import './article-evidence.css';

export function ArticleReviewDate({article,fr}:{article:Article;fr:boolean}) {
  const date=article.reviewed||article.updated;
  if(!date)return null;
  return <p className="article-review-date">{article.reviewed?(fr?'Sources consultées le ':'Sources checked '):(fr?'Page mise à jour le ':'Page updated ')}<time dateTime={date}>{formatDate(date,fr)}</time><span> · {fr?'Heure de Toronto':'Toronto time'}</span></p>;
}

export default function ArticleEvidence({article,fr}:{article:Article;fr:boolean}) {
  if(!article.sources?.length)return null;
  return <section className="sources article-evidence" aria-label={fr?'Sources et vérification':'Sources and review'}>
    <h2>{fr?'Sources et vérification':'Sources and review'}</h2>
    <ArticleReviewDate article={article} fr={fr}/>
    <p>{fr?'Cette page présente des renseignements publics sur l’accès aux soins. La consultation des sources ne constitue pas une révision clinique indépendante. Confirmez les modalités auprès du service concerné.':'This page explains public information about accessing care. Source checking is separate from independent clinical review. Confirm arrangements with the relevant service.'}</p>
    <ol>{article.sources.map(url=>{
      const note=article.sourceNotes?.find(source=>source.url===url);
      return <li key={url}><a href={localizedResource(url,fr)} rel="noreferrer">{note?.title[fr?1:0]||sourceLabel(url,fr)} ↗</a>{note&&<p>{note.supports[fr?1:0]}</p>}</li>;
    })}</ol>
    <a href={pathFor('editorial-policy',fr)}>{fr?'Lire la politique éditoriale':'Read the editorial policy'}</a>
  </section>;
}
