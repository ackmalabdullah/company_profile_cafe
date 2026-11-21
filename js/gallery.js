/* Galeri Gelap Organik & Lightbox Interaktif */
(() => {
const G = [
  { title: 'Bar kopi', sub: 'Meja seduh utama & mesin espresso', cat: 'Seduhan', span: 'g-hero', img: 'images/gallery/gallery-1.jpg' },
  { title: 'Meja kerja', sub: 'Nyaman untuk bekerja atau belajar', cat: 'Ruang', span: '', img: 'images/gallery/gallery-2.jpg' },
  { title: 'Latte art', sub: 'Tuangan microfoam susu segar', cat: 'Seduhan', span: 'g-tall', img: 'images/gallery/gallery-3.jpg' },
  { title: 'Area outdoor', sub: 'teduh nyaman untuk bersantai', cat: 'Ruang', span: '', img: 'images/gallery/gallery-4.jpg' },
  { title: 'biji kopi pilihan', sub: 'Koleksi single origin Dampit & Gayo', cat: 'Seduhan', span: 'g-tall', img: 'images/gallery/gallery-5.jpg' },
  { title: 'Roti bakar', sub: 'Sajian hangat pendamping kopi sore', cat: 'Seduhan', span: 'g-wide', img: 'images/gallery/gallery-6.jpg' },
  { title: 'Sudut baca', sub: 'kursi santai sore hari', cat: 'Ruang', span: 'g-tall', img: 'images/gallery/gallery-7.jpg' },
  { title: 'Live akustik', sub: 'Panggung musik tiap Sabtu malam', cat: 'Suasana', span: 'g-wide', img: 'images/gallery/gallery-8.jpg' },
];

const glEl = document.querySelector('#gl');
  const gfEl = document.querySelector('#gf');
  if (!glEl) return;

  const camSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
  const zoomSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

  let activeCat = 'Semua';
  let currentList = G;
  let lbIdx = 0;
  let isZoomed = false;
  let dragStartX = 0;
  let isDragging = false;

  /* Ambil #lb dari HTML atau buat otomatis */
  let lb = document.querySelector('#lb');
  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'lb';
    lb.id = 'lb';
    document.body.appendChild(lb);
  }

  lb.innerHTML = `
    <div class="lb-hud">
      <div class="lb-hud-left">
        <span class="lb-badge-cat" id="lbCat">Seduhan</span>
        <span class="lb-cnt" id="lbCnt">01 / 08</span>
        <span class="lb-hint">Klik foto untuk zoom • Geser atau tekan ← →</span>
      </div>
      <div class="lb-hud-actions">
        <button type="button" class="lb-pill-btn" id="lbZoomBtn" aria-label="Perbesar detail foto">
          ${zoomSvg}
          <span id="lbZoomTxt">Zoom</span>
        </button>
        <button type="button" class="lb-pill-btn lb-close-btn" id="lbClose" aria-label="Tutup galeri">×</button>
      </div>
    </div>

    <div class="lb-center">
      <button type="button" class="lb-side-nav prev" id="lbPrev" aria-label="Foto sebelumnya">←</button>

      <div class="lb-stage" id="lbStage">
        <div class="lb-media-wrap" id="lbMedia"></div>
      </div>

      <button type="button" class="lb-side-nav next" id="lbNext" aria-label="Foto berikutnya">→</button>
    </div>

    <div class="lb-dock">
      <div class="lb-caption-pill">
        <b id="lbTitle"></b>
        <small id="lbSub"></small>
      </div>
      <div class="lb-thumbs" id="lbThumbs" role="tablist" aria-label="Pilih foto galeri"></div>
    </div>
  `;

  const lbStage = lb.querySelector('#lbStage');
  const lbMedia = lb.querySelector('#lbMedia');
  const lbZoomBtn = lb.querySelector('#lbZoomBtn');
  const lbZoomTxt = lb.querySelector('#lbZoomTxt');
  const lbThumbs = lb.querySelector('#lbThumbs');

  function setZoom(state) {
    isZoomed = state;
    lbStage.classList.toggle('is-zoomed', isZoomed);
    lbZoomBtn.classList.toggle('is-active', isZoomed);
    lbZoomTxt.textContent = isZoomed ? '175%' : 'Zoom';
    if (!isZoomed) {
      lbStage.style.setProperty('--zx', '50%');
      lbStage.style.setProperty('--zy', '50%');
    }
  }

  function closeLightbox() {
    lb.classList.remove('on');
    setZoom(false);
    document.body.style.overflow = '';
  }

  function renderThumbnails() {
    lbThumbs.innerHTML = currentList
      .map((item, i) => {
        const num = String(i + 1).padStart(2, '0');
        return `
          <button type="button" class="lb-thumb ${i === lbIdx ? 'a' : ''}" data-i="${i}" title="${item.title}">
            <span>${num}</span>
            <img src="${item.img}" alt="" loading="lazy" onerror="this.remove()">
          </button>`;
      })
      .join('');
  }

  function openLightbox(idx, dir = 'next') {
    lbIdx = (idx + currentList.length) % currentList.length;
    const item = currentList[lbIdx];
    const figNum = String(G.indexOf(item) + 1).padStart(2, '0');

    setZoom(false);

    /* Animasi arah geser */
    lbMedia.classList.remove('slide-next', 'slide-prev');
    void lbMedia.offsetWidth;
    lbMedia.classList.add(dir === 'prev' ? 'slide-prev' : 'slide-next');

    lbMedia.innerHTML = `
      <div class="lb-placeholder-card">
        <span class="lb-ph-code">ARSIP VISUAL • FIG. ${figNum}</span>
        <div class="gi-ph-ring">${camSvg}</div>
        <strong>${item.title}</strong>
        <span>${item.sub} — masukkan file <code>${item.img}</code> untuk menampilkan foto asli</span>
      </div>
      <img src="${item.img}" alt="${item.title}" onload="this.previousElementSibling?.remove()" onerror="this.remove()">
    `;

    lb.querySelector('#lbCat').textContent = item.cat;
    lb.querySelector('#lbCnt').textContent = `${String(lbIdx + 1).padStart(2, '0')} / ${String(currentList.length).padStart(2, '0')}`;
    lb.querySelector('#lbTitle').textContent = item.title;
    lb.querySelector('#lbSub').textContent = item.sub;

    /* Perbarui active state pada filmstrip thumbnail */
    const thumbs = [...lbThumbs.children];
    thumbs.forEach((t, i) => t.classList.toggle('a', i === lbIdx));
    thumbs[lbIdx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

    if (!lb.classList.contains('on')) {
      lb.classList.add('on');
      document.body.style.overflow = 'hidden';
    }
  }

  function renderGallery() {
    const isFiltered = activeCat !== 'Semua';
    glEl.classList.toggle('is-filtered', isFiltered);
    currentList = isFiltered ? G.filter((item) => item.cat === activeCat) : G;

    glEl.innerHTML = currentList
      .map(
        (item, i) => `
        <figure class="gi ${!isFiltered ? item.span : ''}" style="--i:${i}" tabindex="0" role="button" data-idx="${i}" aria-label="Perbesar foto ${item.title}">
          <div class="gi-media">
            <div class="gi-ph-ring">${camSvg}</div>
            <span class="gi-ph-txt">Foto ${item.title}</span>
            <img src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.remove()">
          </div>
          <div class="gi-top">
            <span class="gi-cat">${item.cat}</span>
            <span class="gi-expand">Lihat ↗</span>
          </div>
          <figcaption class="gi-cap">
            <b>${item.title}</b>
            <small>${item.sub}</small>
          </figcaption>
        </figure>`
      )
      .join('');

    if (gfEl) {
      [...gfEl.children].forEach((b) => b.classList.toggle('a', b.dataset.cat === activeCat));
    }

    renderThumbnails();
  }

  /* Render filter kategori */
  if (gfEl) {
    const cats = ['Semua', ...new Set(G.map((g) => g.cat))];
    gfEl.innerHTML = cats
      .map((c) => {
        const count = c === 'Semua' ? G.length : G.filter((g) => g.cat === c).length;
        return `<button type="button" data-cat="${c}">${c} · ${count}</button>`;
      })
      .join('');

    gfEl.onclick = (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        activeCat = btn.dataset.cat;
        renderGallery();
      }
    };
  }

  /* Efek kilau halus mengikuti kursor di grid */
  glEl.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.gi');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  /* Klik kartu untuk membuka Lightbox */
  glEl.addEventListener('click', (e) => {
    const card = e.target.closest('.gi');
    if (card) openLightbox(Number(card.dataset.idx), 'next');
  });

  glEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.gi');
      if (card) {
        e.preventDefault();
        openLightbox(Number(card.dataset.idx), 'next');
      }
    }
  });

  /* Interaksi di dalam Lightbox: Pan saat zoomed, Swipe/Drag untuk geser, Klik untuk zoom */
  lbStage.addEventListener('pointermove', (e) => {
    if (!isZoomed) return;
    const r = lbStage.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
    lbStage.style.setProperty('--zx', `${x}%`);
    lbStage.style.setProperty('--zy', `${y}%`);
  });

  lbStage.addEventListener('pointerdown', (e) => {
    dragStartX = e.clientX;
    isDragging = false;
  });

  lbStage.addEventListener('pointerup', (e) => {
    const dx = e.clientX - dragStartX;
    if (!isZoomed && Math.abs(dx) > 48) {
      isDragging = true;
      openLightbox(dx < 0 ? lbIdx + 1 : lbIdx - 1, dx < 0 ? 'next' : 'prev');
      return;
    }
    if (!isDragging) {
      const nextZoom = !isZoomed;
      setZoom(nextZoom);
      if (nextZoom) {
        const r = lbStage.getBoundingClientRect();
        lbStage.style.setProperty('--zx', `${((e.clientX - r.left) / r.width) * 100}%`);
        lbStage.style.setProperty('--zy', `${((e.clientY - r.top) / r.height) * 100}%`);
      }
    }
  });

  /* Tombol navigasi, zoom, thumbnail, dan klik area kosong untuk menutup */
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.closest('#lbClose')) closeLightbox();
    if (e.target.closest('#lbPrev')) openLightbox(lbIdx - 1, 'prev');
    if (e.target.closest('#lbNext')) openLightbox(lbIdx + 1, 'next');
    if (e.target.closest('#lbZoomBtn')) setZoom(!isZoomed);

    const thumb = e.target.closest('.lb-thumb');
    if (thumb) {
      const nextIdx = Number(thumb.dataset.i);
      openLightbox(nextIdx, nextIdx >= lbIdx ? 'next' : 'prev');
    }
  });

  /* Shortcut Keyboard */
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(lbIdx - 1, 'prev');
    if (e.key === 'ArrowRight') openLightbox(lbIdx + 1, 'next');
    if (e.key === 'z' || e.key === 'Z' || e.key === '+') setZoom(!isZoomed);
  });

  renderGallery();
})();