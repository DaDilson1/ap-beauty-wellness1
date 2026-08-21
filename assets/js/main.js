const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

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
  products: 'Seleção AP',
  naturals: 'AP Natural & Wellness',
};

const openProductModal = (card) => {
  const collection = card.dataset.collection;
  const product = window.apCatalog?.[collection]?.[Number(card.dataset.index)];
  if (!product || !modal) return;

  const details = collection === 'kits'
    ? product.items
    : [product.type || product.kind, product.description].filter(Boolean);

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
