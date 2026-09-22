// contact-sheet.js
// Jalankan dari root proyek (server dev hidup):  node contact-sheet.js
// Hasil: contact.jpg (semua halaman dalam satu gambar), siap diunggah.
const { chromium } = require('playwright-core');

(async () => {
  const b = await chromium.launch({ channel: 'msedge' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', (e) => console.log('PAGEERROR', String(e.message).slice(0, 200)));
  await p.goto('http://localhost:3000', { waitUntil: 'load' });
  await p.waitForTimeout(2500);

  const shots = [];
  const snap = async (name) => { shots.push({ name, buf: await p.screenshot() }); };
  const hold = async (sel, ms) => {
    const r = await p.locator(sel).first().boundingBox();
    await p.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
    await p.mouse.down(); await p.waitForTimeout(ms); await p.mouse.up();
  };

  try {
    await snap('0 sampul');
    await hold('.lux-seal', 1100); await p.waitForTimeout(1500); await snap('0b segel pecah');
    await p.getByRole('button', { name: 'Buka buku' }).click(); await p.waitForTimeout(2200);
    await snap('1 lilin');
    await hold('.lux-candle-btn', 1800); await p.waitForTimeout(4500); await snap('1b lilin padam');
  } catch (e) { console.log('STEP GAGAL', e.message.slice(0, 200)); }

  for (let i = 2; i <= 9; i++) {
    try {
      await p.locator('[aria-label="Halaman berikutnya"]').click();
      await p.waitForTimeout(2600);
      await snap('halaman ' + i);
    } catch (e) { console.log('HALAMAN ' + i + ' GAGAL', e.message.slice(0, 120)); break; }
  }

  const html = '<body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(5,300px);gap:8px;padding:8px;font:14px sans-serif;color:#fff">' +
    shots.map((s) => '<figure style="margin:0"><figcaption>' + s.name + '</figcaption><img width="300" src="data:image/png;base64,' + s.buf.toString('base64') + '"></figure>').join('') + '</body>';
  const c = await b.newPage({ viewport: { width: 1560, height: 1000 } });
  await c.setContent(html);
  await c.waitForTimeout(800);
  await c.screenshot({ path: 'contact.jpg', type: 'jpeg', quality: 82, fullPage: true });
  console.log('OK', shots.length, 'gambar -> contact.jpg');
  await b.close();
})().catch((e) => { console.log('FAIL', e.message.slice(0, 300)); process.exit(1); });
