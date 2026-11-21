/* Scroll reveal & efek spotlight kursor pada Bento Fasilitas */
const ft = $('#ft');
if (ft) {
  if ('IntersectionObserver' in window) {
    ft.classList.add('anim');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          ft.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(ft);
  }

  ft.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.fc');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}

/* Data & interaksi menu */
const CAT_NOTE = {
  Kopi: 'Racikan espresso biji lokal Malang dan seduhan manual pilihan setiap hari.',
  'Non-kopi': 'Pilihan teh aromatik, cokelat pekat, dan minuman segar tanpa kafein kopi.',
  Makanan: 'Menu hangat pengganjal lapar, cocok untuk makan siang maupun teman lembur.',
  Camilan: 'Teman ngopi ringan yang dipanggang dan digoreng segar saat dipesan.',
};

/* Format array: [Nama, Deskripsi, Harga, BestSeller (1/0), NamaFileOpsional] */
const M = {
  Kopi: [
    ['Es Kopi Teduh', 'Espresso biji lokal, susu segar, gula aren organik', 22, 1],
    ['Americano', 'Tersedia panas atau dingin, karakter clean', 18],
    ['Cappuccino', 'Espresso dengan microfoam susu tebal', 24],
  ],
  'Non-kopi': [
    ['Matcha Latte', 'Matcha Jepang ceremonial grade dengan susu oat', 27, 1],
    ['Cokelat Panas', 'Cokelat batang pekat 60% single origin', 24],
    ['Teh Tarik', 'Teh hitam pekat berpadu susu creamy', 18],
  ],
  Makanan: [
    ['Nasi Ayam bakar', 'Ayam paha, timun segar, sambal pedas', 32, 1],
    ['Mie Goreng Jawa', 'Telur orak-arik, sayuran segar, acar timun', 28],
  ],
  Camilan: [
    ['Kentang Goreng', 'Taburan bumbu gurih & saus sambal spesial', 18],
  ],
};

let cat = 'Kopi';
const rp = (n) => 'Rp ' + n.toFixed(0) + '.000';
const wa = (n) => `https://wa.me/${WA}?text=${encodeURIComponent('Halo Paku Kopi, saya mau pesan ' + n)}`;

const menuImg = (m) => {
  const file =
    m[4] ||
    m[0]
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '.jpg';
  return `images/menu/${file}`;
};

const cupIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`;

function rm() {
  const qEl = $('#q');
  const qcEl = $('#qc');
  const cnEl = $('#cn');
  const q = qEl.value.trim().toLowerCase();
  qcEl.hidden = !q;

  if (cnEl) {
    cnEl.textContent = q
      ? `Menampilkan hasil pencarian untuk "${qEl.value.trim()}" di semua kategori.`
      : CAT_NOTE[cat] || '';
  }

  const rawList = q
    ? Object.values(M)
        .flat()
        .filter((m) => m[0].toLowerCase().includes(q) || m[1].toLowerCase().includes(q))
    : M[cat];

  const list = [...rawList].sort((a, b) => (b[3] || 0) - (a[3] || 0));

  $('#ml').innerHTML = list.length
    ? list
        .map((m, idx) => {
          const isBest = Boolean(m[3]);
          const mediaHtml = `
            <div class="mi-media">
              <div class="ph-wrap">${cupIcon}<span>Foto Menu</span></div>
              <img src="${menuImg(m)}" alt="${m[0]}" loading="lazy" onload="this.parentElement.classList.add('has-img')" onerror="this.remove()">
            </div>`;

          if (isBest) {
            return `
              <article class="mi is-best" style="--i:${idx}">
                ${mediaHtml}
                <div class="mi-best-content">
                  <div>
                    <span class="bs-tag">★ Signature Kedai</span>
                    <div class="mi-title">${m[0]}</div>
                    <p class="mi-desc">${m[1]}</p>
                  </div>
                  <div class="mi-foot">
                    <span class="mi-price">${rp(m[2])}</span>
                    <a class="mi-btn" href="${wa(m[0])}" target="_blank" rel="noopener" aria-label="Pesan ${m[0]} lewat WhatsApp">+ Pesan via WA</a>
                  </div>
                </div>
              </article>`;
          }

          return `
            <article class="mi" style="--i:${idx}">
              <div class="mi-main">
                ${mediaHtml}
                <div class="mi-info">
                  <div class="mi-title">${m[0]}</div>
                  <p class="mi-desc">${m[1]}</p>
                </div>
              </div>
              <div class="mi-foot">
                <span class="mi-price">${rp(m[2])}</span>
                <a class="mi-btn" href="${wa(m[0])}" target="_blank" rel="noopener" aria-label="Pesan ${m[0]} lewat WhatsApp">+ Pesan</a>
              </div>
            </article>`;
        })
        .join('')
    : '<p class="empty">Menu tidak ditemukan. Coba cari dengan kata kunci lain.</p>';

  [...$('#tb').children].forEach((b) => b.classList.toggle('a', !q && b.dataset.cat === cat));
}

$('#tb').innerHTML = Object.keys(M)
  .map((k) => `<button type="button" data-cat="${k}"><span>${k}</span><span class="cnt">${M[k].length}</span></button>`)
  .join('');

$('#tb').onclick = (e) => {
  const btn = e.target.closest('button');
  if (btn) {
    cat = btn.dataset.cat;
    $('#q').value = '';
    rm();
  }
};

$('#q').oninput = rm;
$('#qc').onclick = () => {
  $('#q').value = '';
  $('#q').focus();
  rm();
};

rm();