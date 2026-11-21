/* Reservasi WhatsApp, Quick-Pick Suasana & Salin Alamat */
const rf = document.forms.rf;

if (rf) {
  const sl = rf.jam;
  for (let h = 8; h <= 21; h++) sl.add(new Option(h + '.00'));
  rf.tgl.min = new Date().toISOString().slice(0, 10);

  /* Tombol pilih cepat kebutuhan meja */
  const prefChips = $('#prefChips');
  if (prefChips) {
    prefChips.onclick = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      btn.classList.toggle('a');

      const activeNotes = [...prefChips.querySelectorAll('button.a')].map((b) => b.dataset.val);
      rf.cat.value = activeNotes.join(', ');
    };
  }

  /* Kirim format reservasi terstruktur ke WhatsApp */
  rf.onsubmit = (e) => {
    e.preventDefault();
    const v = (n) => rf[n].value.trim();
    const tgl = new Date(v('tgl') + 'T00:00:00').toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const msg =
      `Halo Kopi PAKU, saya ingin reservasi meja.\n` +
      `• Nama: ${v('nama')}\n` +
      `• Tanggal: ${tgl}\n` +
      `• Jam: ${v('jam')} WIB\n` +
      `• Jumlah: ${v('org')} orang` +
      (v('cat') ? `\n• Catatan: ${v('cat')}` : '');

    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };
}

/* Tombol salin alamat cepat */
const copyAddr = $('#copyAddr');
if (copyAddr) {
  copyAddr.onclick = () => {
    navigator.clipboard?.writeText(copyAddr.dataset.copy || '');
    copyAddr.textContent = 'Tersalin ✓';
    setTimeout(() => (copyAddr.textContent = 'Salin'), 1800);
  };
}