const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
const cardAttributes = (collection, index, name) => `data-collection="${collection}" data-index="${index}" tabindex="0" role="button" aria-label="Ver detalhes de ${escapeHtml(name)}"`;

document.querySelectorAll('[data-render]').forEach((grid) => {
  const collection = grid.dataset.render;
  const items = window.apCatalog?.[collection] || [];
  grid.innerHTML = items.map((item, index) => {
    if (collection === 'kits') return `<article class="kit-card kit-card--${item.tone} js-open-product-modal" ${cardAttributes(collection, index, item.name)}><div class="kit-card__visual"><img src="assets/images/collections/k-beauty/${item.image}" alt="Produtos incluídos no ${escapeHtml(item.name)}"></div><p class="kit-card__number">0${index + 1}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.subtitle)}</p><ul>${item.items.map((detail) => `<li>${escapeHtml(detail)}</li>`).join('')}</ul><div class="kit-card__bottom"><strong>${item.price}</strong><span class="text-button">Ver detalhes <span>→</span></span></div></article>`;
    if (collection === 'regeneratives') return `<article class="regenerative-card${index >= 4 ? ' regenerative-card--extra' : ''} js-open-product-modal" ${cardAttributes(collection, index, item.name)}><div class="regenerative-card__visual"><img src="assets/images/products/regenerativos/${item.image}" alt="${escapeHtml(item.name)}"></div><p class="regenerative-card__kind">${escapeHtml(item.kind)}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><span>Saber mais →</span></article>`;
    if (collection === 'topNaturals') return `<article class="product-card${index >= 4 ? ' product-card--extra' : ''} js-open-product-modal" ${cardAttributes(collection, index, item.name)}><div class="product-card__visual"><img src="assets/images/products/top-naturals/${item.image}" alt="${escapeHtml(item.name)}" loading="lazy"></div><p class="product-card__type">${escapeHtml(item.type)}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><span>Conhecer o produto →</span></article>`;
    if (collection === 'products') return `<article class="product-card${index >= 4 ? ' product-card--extra' : ''} js-open-product-modal" ${cardAttributes(collection, index, item.name)}><div class="product-card__visual"><img src="assets/images/products/ap-selection/${item.image}" alt="${escapeHtml(item.name)}" loading="lazy"></div><p class="product-card__type">${escapeHtml(item.type)}</p><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><span>Conhecer o produto →</span></article>`;
    return `<article class="nature-card js-open-product-modal" ${cardAttributes(collection, index, item.name)}><span class="nature-card__number">${item.icon}</span><div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.description)}</p><span>Saber mais →</span></div></article>`;
  }).join('');
});

menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const modal = document.querySelector('#product-modal');
const modalCollection = document.querySelector('#modal-collection');
const modalTitle = document.querySelector('#modal-title');
const modalSubtitle = document.querySelector('#modal-subtitle');
const modalItems = document.querySelector('#modal-items');
const modalNote = document.querySelector('#modal-note');

const collectionLabels = {
  kits: 'Coleção K-Beauty',
  regeneratives: 'Coleção regenerativa',
  topNaturals: 'Top 5 naturais',
  products: 'Seleção AP',
  naturals: 'AP Natural & Wellness',
};

const openProductModal = (card) => {
  const collection = card.dataset.collection;
  const product = window.apCatalog?.[collection]?.[Number(card.dataset.index)];
  if (!product || !modal) return;

  const details = collection === 'kits'
    ? product.items
    : [product.type || product.kind, product.description, ...(product.benefits || []), product.ingredient ? `Ingrediente principal: ${product.ingredient}` : '', product.price ? `Preço AP: ${product.price}` : ''].filter(Boolean);

  modalCollection.textContent = collectionLabels[collection] || 'AP Beauty & Wellness';
  modalTitle.textContent = product.name;
  modalSubtitle.textContent = collection === 'kits' ? product.subtitle : (product.kind || product.type || 'Detalhes do produto');
  modalItems.replaceChildren(...details.map((detail) => {
    const element = document.createElement('li');
    element.textContent = detail;
    return element;
  }));
  modalNote.textContent = collection === 'regeneratives'
    ? 'Produto de uso especializado. Fale connosco para obter informação adequada ao seu caso.'
    : 'Nesta fase, a página funciona como montra. Contacte-nos para disponibilidade e mais informações.';
  modal.showModal();
};

document.querySelectorAll('.js-open-product-modal').forEach((card) => {
  card.addEventListener('click', (event) => {
    event.preventDefault();
    openProductModal(card);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openProductModal(card);
  });
});

document.querySelector('.js-close-modal')?.addEventListener('click', () => modal?.close());

const productsToggle = document.querySelector('[data-products-toggle]');
const productsGrid = document.querySelector('#ap-products-grid');

productsToggle?.addEventListener('click', () => {
  const expanded = productsGrid?.classList.toggle('is-expanded');
  productsToggle.setAttribute('aria-expanded', String(expanded));
  productsToggle.innerHTML = expanded
    ? 'Ver menos <span aria-hidden="true">↓</span>'
    : 'Ver mais <span aria-hidden="true">↓</span>';
});

const regenerativesToggle = document.querySelector('[data-regeneratives-toggle]');
const regenerativesGrid = document.querySelector('#regeneratives-grid');

regenerativesToggle?.addEventListener('click', () => {
  const expanded = regenerativesGrid?.classList.toggle('is-expanded');
  regenerativesToggle.setAttribute('aria-expanded', String(expanded));
  regenerativesToggle.innerHTML = expanded
    ? 'Ver menos <span aria-hidden="true">↑</span>'
    : 'Ver mais <span aria-hidden="true">↓</span>';
});

const topnaturalsToggle = document.querySelector('[data-topnaturals-toggle]');
const topnaturalsGrid = document.querySelector('#top-naturals-grid');

topnaturalsToggle?.addEventListener('click', () => {
  const expanded = topnaturalsGrid?.classList.toggle('is-expanded');
  topnaturalsToggle.setAttribute('aria-expanded', String(expanded));
  topnaturalsToggle.innerHTML = expanded
    ? 'Ver menos <span aria-hidden="true">↑</span>'
    : 'Ver mais <span aria-hidden="true">↓</span>';
});

const ambientAudio = document.getElementById('ambient-audio');
const musicToggle = document.getElementById('music-toggle');

if (ambientAudio && musicToggle) {
  ambientAudio.volume = 0.18;
  ambientAudio.loop = true;

  const toggleMusic = async (shouldPlay) => {
    musicToggle.classList.toggle('is-playing', shouldPlay);
    musicToggle.setAttribute('aria-pressed', String(shouldPlay));
    musicToggle.setAttribute('aria-label', shouldPlay ? 'Desativar música de fundo' : 'Ativar música de fundo');
    musicToggle.title = shouldPlay ? 'Desativar música de fundo' : 'Ativar música de fundo';

    if (shouldPlay) {
      try {
        await ambientAudio.play();
      } catch (error) {
        console.warn('Música de fundo não pode iniciar automaticamente.', error);
      }
      return;
    }

    ambientAudio.pause();
    ambientAudio.currentTime = 0;
  };

  musicToggle.addEventListener('click', () => {
    const currentlyPlaying = musicToggle.classList.contains('is-playing');
    toggleMusic(!currentlyPlaying);
  });
}
