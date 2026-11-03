const lang = document.body.dataset.lang;
const messages = lang === 'fr' ? { empty: 'Aucune fiche de fournisseur n’a encore été récupérée. Cela ne signifie pas que des soins sont indisponibles dans votre région.', none: 'Aucun résultat. Essayez une autre ville, province ou un autre territoire.', failed: 'Le répertoire n’a pas pu être chargé. Réessayez plus tard.', count: 'Résultats', website: 'Consulter le site', call: 'Appeler la clinique', reviewed: 'Renseignements révisés', source: 'Source' } : { empty: 'No provider records have been recovered yet. This does not mean care is unavailable in your area.', none: 'No matching records. Try another city, province or territory.', failed: 'The directory could not be loaded. Please try again later.', count: 'Results', website: 'View website', call: 'Call clinic', reviewed: 'Information reviewed', source: 'Source' };
document.querySelector('#quick-exit')?.addEventListener('click', event => { event.preventDefault(); window.location.replace('https://www.google.com'); });
const form = document.querySelector('#directory-search');
const results = document.querySelector('#results');
const status = document.querySelector('#directory-status');
const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
if (results && form) {
  let records = [];
  const render = () => {
    const query = normalize(form.elements.location.value);
    const matches = records.filter(r => [r.city, r.province, r.territory].filter(Boolean).some(x => normalize(x).includes(query)));
    results.replaceChildren();
    status.textContent = !records.length ? messages.empty : !matches.length ? messages.none : `${messages.count}: ${matches.length}`;
    for (const record of matches) {
      const card = document.createElement('article'); card.className = 'provider';
      const heading = document.createElement('h2'); heading.textContent = record.name[lang]; card.append(heading);
      const address = document.createElement('p'); address.textContent = record.address[lang]; card.append(address);
      for (const [text, href] of [[messages.website, record.website], [messages.source, record.source]]) {
        if (new URL(href).protocol !== 'https:') continue;
        const link = document.createElement('a'); link.textContent = text; link.href = href; link.rel = 'noreferrer'; card.append(link);
      }
      if (record.phone && /^\+?[\d ()-]+$/.test(record.phone)) { const link = document.createElement('a'); link.textContent = `${messages.call}: ${record.phone}`; link.href = `tel:${record.phone.replace(/[^+\d]/g, '')}`; card.append(link); }
      const reviewed = document.createElement('p'); reviewed.textContent = `${messages.reviewed}: ${record.reviewed}`; card.append(reviewed);
      results.append(card);
    }
  };
  // Queries stay in memory; no URL parameters, storage or analytics.
  form.addEventListener('submit', event => { event.preventDefault(); render(); });
  fetch('/providers.json').then(response => { if (!response.ok) throw new Error('Directory unavailable'); return response.json(); }).then(data => { records = data; render(); }).catch(() => { status.textContent = messages.failed; });
} else if (form) {
  form.addEventListener('submit', event => {
    // Keep search terms out of server logs and browser history.
    event.preventDefault(); window.location.assign(`/${lang}/clinics/`);
  });
}
