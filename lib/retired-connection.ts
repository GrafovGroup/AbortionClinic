// Keep bookmarked connection forms out of the public directory and its search index.
export function retiredConnectionDestination(path: string) {
  switch (path.replace(/^\/|\/$/g, '')) {
    case 'request-connection':
      return '/find-care/';
    case 'fr/request-connection':
    case 'fr/demander-une-mise-en-relation':
      return '/fr/trouver-des-soins/';
    default:
      return undefined;
  }
}
