/* Open Editorial Testimonial Spread + Vertical Progress Track */
const REVIEWS = [
  {
    name: 'Nadia Putri',
    role: 'Mahasiswi Akhir · Malang',
    order: 'Es Kopi Teduh',
    quote: '“Tempat paling nyaman buat ngerjain bab akhir skripsi. WiFi-nya kencang buat Zoom, colokan ada di setiap meja, dan baristanya ramah meski duduk berjam-jam.”',
    init: 'NP',
  },
  {
    name: 'Dimas Prakoso',
    role: 'UI/UX Designer Freelance',
    order: 'V60 Single Origin Dampit',
    quote: '“Kalau butuh suasana tenang tapi nggak kaku kayak kantor, area outdoor di bawah pohon trembesinya juara. Seduhan V60 biji Dampit-nya bersih dan aromatik.”',
    init: 'DP',
  },
  {
    name: 'Alya Rahmadani',
    role: 'Penikmat Kopi & Musik',
    order: 'Matcha Latte & Croissant',
    quote: '“Sering mampir Sabtu malam bareng teman-teman buat nonton live akustiknya. Suasananya hangat, nggak berisik berlebihan, dan croissant menteganya selalu renyah.”',
    init: 'AR',
  },
  {
    name: 'Rizky Maulana',
    role: 'Karyawan Remote',
    order: 'Paket Nugas Hemat',
    quote: '“Paket Nugas sebelum jam 3 sore bikin hemat banget buat WFC harian. Kopi susunya pas nggak terlalu manis, roti bakarnya juga tebal dan hangat.”',
    init: 'RM',
  },
  {
    name: 'Sinta Maharani',
    role: 'Warga Jl. Kawi',
    order: 'Cappuccino & Brownies',
    quote: '“Parkirnya gampang dan teduh, enak kalau mampir sore bareng keluarga. Dari zaman masih gerobak sampai sekarang, rasanya tetap konsisten.”',
    init: 'SM',
  },
];

const trEl = $('#tr');
const tcEl = $('#tc');
const tBar = $('#tBar');
const tAvatars = $('#tAvatars');
const tsWrap = $('#tsWrap');

if (trEl) {
  let tIdx = 0;
  let timer = null;
  const DURATION = 5500;
  const isMobile = () => window.matchMedia('(max-width: 860px)').matches;

  /* Render daftar buku tamu di sisi kiri */
  if (tAvatars) {
    tAvatars.innerHTML = REVIEWS.map(
      (r, i) => `
      <button type="button" class="guest-item" data-i="${i}" role="tab">
        <div class="guest-left">
          <span class="g-num">0${i + 1}</span>
          <div>
            <span class="g-name">${r.name}</span>
            <span class="g-role">${r.role}</span>
          </div>
        </div>
        <span class="g-arrow" aria-hidden="true">→</span>
      </button>`
    ).join('');
  }

  function animateProgress() {
    if (!tBar) return;
    const prop = isMobile() ? 'scaleX' : 'scaleY';
    tBar.style.transition = 'none';
    tBar.style.transform = `${prop}(0)`;
    void tBar.offsetWidth;
    tBar.style.transition = `transform ${DURATION}ms linear`;
    tBar.style.transform = `${prop}(1)`;
  }

  function renderReview(nextIdx) {
    tIdx = (nextIdx + REVIEWS.length) % REVIEWS.length;
    const r = REVIEWS[tIdx];

    trEl.innerHTML = `
      <article class="q-entry">
        <div class="q-dish">Menu favorit: ${r.order}</div>
        <blockquote class="q-text">${r.quote}</blockquote>
        <div class="q-author">
          <div class="q-init" aria-hidden="true">${r.init}</div>
          <div>
            <b>${r.name}</b>
            <span>${r.role}</span>
          </div>
        </div>
      </article>
    `;

    if (tAvatars) {
      [...tAvatars.children].forEach((btn, i) => {
        const active = i === tIdx;
        btn.classList.toggle('a', active);
        btn.setAttribute('aria-selected', active);
      });
    }

    if (tcEl) {
      tcEl.textContent = `${String(tIdx + 1).padStart(2, '0')} / ${String(REVIEWS.length).padStart(2, '0')}`;
    }

    animateProgress();
  }

  const startAuto = () => {
    clearInterval(timer);
    animateProgress();
    timer = setInterval(() => renderReview(tIdx + 1), DURATION);
  };

  const stopAuto = () => {
    clearInterval(timer);
    if (tBar) {
      const currentTransform = getComputedStyle(tBar).transform;
      tBar.style.transition = 'none';
      tBar.style.transform = currentTransform;
    }
  };

  if ($('#tp')) {
    $('#tp').onclick = () => {
      renderReview(tIdx - 1);
      startAuto();
    };
  }

  if ($('#tn')) {
    $('#tn').onclick = () => {
      renderReview(tIdx + 1);
      startAuto();
    };
  }

  if (tAvatars) {
    tAvatars.onclick = (e) => {
      const btn = e.target.closest('.guest-item');
      if (btn) {
        renderReview(Number(btn.dataset.i));
        startAuto();
      }
    };
  }

  if (tsWrap) {
    tsWrap.addEventListener('mouseenter', stopAuto);
    tsWrap.addEventListener('mouseleave', startAuto);
  }

  renderReview(0);
  startAuto();
}