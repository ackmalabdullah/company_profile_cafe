const WA = '6283854417991';
const $ = (s) => document.querySelector(s);

/* Navigasi Mobile */
$('#bg').onclick = () => $('#nv').classList.toggle('on');
$('#nv').onclick = (e) => {
  if (e.target.tagName === 'A') $('#nv').classList.remove('on');
};

/* Slider Tumpukan Polaroid di Cerita Kami */
const polView = $('#polView');
if (polView) {
  const POL_PHOTOS = [
    { code: 'Arsip #01', title: 'barista', label: 'Foto Pemilik / Barista', img: 'images/cerita/barista.jpg' },
    { code: 'Arsip #02', title: 'Gerobak awal', label: 'Foto Gerobak Awal', img: 'images/cerita/gerobak.jpg' },
    { code: 'Arsip #03', title: 'Area outdoor', label: 'Foto Area Outdoor', img: 'images/cerita/outdoor.jpg' },
    { code: 'Arsip #04', title: 'Suasana malam akustik', label: 'Foto Live Akustik', img: 'images/cerita/akustik.jpg' },
  ];

  let pIdx = 0;
  const polCode = $('#polCode');
  const polTitle = $('#polTitle');
  const polCount = $('#polCount');
  const polDots = $('#polDots');
  const camIcon = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;

  polDots.innerHTML = POL_PHOTOS.map(
    (_, i) => `<button type="button" aria-label="Lihat foto ${i + 1}" data-i="${i}"></button>`
  ).join('');

  const renderPol = (nextIdx) => {
    pIdx = (nextIdx + POL_PHOTOS.length) % POL_PHOTOS.length;
    const item = POL_PHOTOS[pIdx];
    const fallbackHtml = `${camIcon}<span>${item.label}</span><small>Klik untuk foto berikutnya</small>`;

    polView.classList.remove('is-switching');
    void polView.offsetWidth;
    polView.classList.add('is-switching');

    if (item.img) {
      polView.innerHTML = `<img src="${item.img}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover;display:block;">`;
      polView.querySelector('img').onerror = () => {
        polView.innerHTML = fallbackHtml;
      };
    } else {
      polView.innerHTML = fallbackHtml;
    }

    polCode.textContent = item.code;
    polTitle.textContent = item.title;
    polCount.textContent = `${pIdx + 1}/${POL_PHOTOS.length}`;
    [...polDots.children].forEach((d, i) => d.classList.toggle('a', i === pIdx));
  };

  $('#polPrev').onclick = () => renderPol(pIdx - 1);
  $('#polNext').onclick = () => renderPol(pIdx + 1);
  polView.onclick = () => renderPol(pIdx + 1);
  polDots.onclick = (e) => {
    if (e.target.dataset.i) renderPol(Number(e.target.dataset.i));
  };

  renderPol(0);
}

/* Interaksi & Progres Horizontal Perjalanan 2019–2025 */
const tl = $('#tl');
const tf = $('#tf');
if (tl) {
  const folios = [...tl.querySelectorAll('.folio')];
  const setStep = (idx) => {
    folios.forEach((el, i) => el.classList.toggle('is-active', i === idx));
    if (tf) tf.style.width = `${(idx / (folios.length - 1)) * 100}%`;
  };

  if ('IntersectionObserver' in window) {
    tl.classList.add('anim');
    const ioStory = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          tl.classList.add('in');
          setStep(0);
          ioStory.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    ioStory.observe(tl);
  }

  folios.forEach((item, idx) => {
    item.addEventListener('mouseenter', () => setStep(idx));
    item.addEventListener('click', () => setStep(idx));
  });
}

/* Animasi & Interaksi Artefak Promo & Event */
const pm = $('#pm');
if (pm && 'IntersectionObserver' in window) {
  pm.classList.add('anim');
  const ioPromo = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        pm.classList.add('in');
        ioPromo.disconnect();
      }
    },
    { threshold: 0.15 }
  );
  ioPromo.observe(pm);
}

/* Efek 3D Tilt & Foil Glare pada Kartu Member */
const loyalCard = $('#loyalCard');
if (loyalCard) {
  loyalCard.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = loyalCard.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    loyalCard.style.setProperty('--rx', `${(0.5 - py) * 7}deg`);
    loyalCard.style.setProperty('--ry', `${(px - 0.5) * 9}deg`);
    loyalCard.style.setProperty('--gx', `${e.clientX - r.left}px`);
    loyalCard.style.setProperty('--gy', `${e.clientY - r.top}px`);
  });

  loyalCard.addEventListener('pointerleave', () => {
    loyalCard.style.setProperty('--rx', '0deg');
    loyalCard.style.setProperty('--ry', '0deg');
  });
}

/* Simulasi Klaim Stamp & Salin Kode Promo */
const freeCup = $('#freeCup');
const stampStatus = $('#stampStatus');
const promoCodeBtn = $('#promoCodeBtn');
if (freeCup && stampStatus) {
  freeCup.onclick = () => {
    const claimed = freeCup.classList.toggle('claimed');
    freeCup.textContent = claimed ? '✓ GRATIS' : 'KLAIM';
    stampStatus.textContent = claimed ? '1 Cup Terbuka!' : '5 / 5 Cap';
    if (promoCodeBtn) promoCodeBtn.hidden = !claimed;
  };
}

if (promoCodeBtn) {
  promoCodeBtn.onclick = () => {
    navigator.clipboard?.writeText('TEDUHGRATIS');
    const tag = promoCodeBtn.querySelector('span');
    if (tag) {
      tag.textContent = 'Tersalin ✓';
      setTimeout(() => (tag.textContent = 'Salin'), 1800);
    }
  };
}