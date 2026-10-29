// One-off asset prep: keys the wave crest off its flat backdrop and cuts the
// island out of the isometric paintings. Run from the app root with node.
import sharp from "sharp";
import os from "node:os";

const ASSETS = `${os.homedir()}/.cursor/projects/Users-godspowerufot-Desktop-2026-project-4month-elysuim-pages/assets/`;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

async function raw(src, w, h) {
  let img = sharp(src).removeAlpha();
  if (w) img = img.resize(w, h, { fit: "cover" });
  return img.raw().toBuffer({ resolveWithObject: true });
}

/** Box-blur a float mask (separable, repeated ~ gaussian). */
function blur(mask, w, h, r, passes = 2) {
  let a = mask, b = new Float32Array(mask.length);
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < h; y++) {
      let s = 0;
      for (let x = -r; x <= r; x++) s += a[y * w + clamp(x, 0, w - 1)];
      for (let x = 0; x < w; x++) {
        b[y * w + x] = s / (2 * r + 1);
        s += a[y * w + clamp(x + r + 1, 0, w - 1)] - a[y * w + clamp(x - r, 0, w - 1)];
      }
    }
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let y = -r; y <= r; y++) s += b[clamp(y, 0, h - 1) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = s / (2 * r + 1);
        s += b[clamp(y + r + 1, 0, h - 1) * w + x] - b[clamp(y - r, 0, h - 1) * w + x];
      }
    }
  }
  return a;
}

async function writeRGBA(rgb, alpha, w, h, out) {
  const buf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    buf[i * 4] = rgb[i * 3];
    buf[i * 4 + 1] = rgb[i * 3 + 1];
    buf[i * 4 + 2] = rgb[i * 3 + 2];
    buf[i * 4 + 3] = Math.round(clamp(alpha[i]) * 255);
  }
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 92 })
    .toFile(out);
}

async function waveCrest() {
  const { data, info } = await raw(ASSETS + "wave-crest-magenta.jpg");
  const { width: w, height: h } = info;
  // Backdrop colour: median of the top rows.
  const top = [];
  for (let x = 0; x < w; x += 4) for (let y = 2; y < 12; y++) top.push(y * w + x);
  const med = (k) => top.map((i) => data[i * 3 + k]).sort((a, b) => a - b)[top.length >> 1];
  const bg = [med(0), med(1), med(2)];
  const bgKey = bg[0] - bg[1];
  const alpha = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3], g = data[i * 3 + 1];
    alpha[i] = 1 - clamp((r - g - 35) / (bgKey - 70));
  }
  const soft = blur(Float32Array.from(alpha), w, h, 1, 1);
  const rgb = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    const a = Math.max(soft[i], 0.02);
    for (let k = 0; k < 3; k++) {
      rgb[i * 3 + k] = clamp((data[i * 3 + k] - (1 - a) * bg[k]) / a, 0, 255);
    }
    // Residual pink spill on the foam: strip any magenta cast (red and blue
    // both above green), then never let red exceed green by much.
    const cast = Math.min(rgb[i * 3], rgb[i * 3 + 2]) - rgb[i * 3 + 1];
    if (cast > 0) {
      rgb[i * 3] -= cast;
      rgb[i * 3 + 2] -= cast;
    }
    rgb[i * 3] = Math.min(rgb[i * 3], rgb[i * 3 + 1] + 24);
  }
  // Choke the edge slightly so no keyed fringe survives at partial alpha.
  for (let i = 0; i < w * h; i++) soft[i] = clamp((soft[i] - 0.12) / 0.88);
  await writeRGBA(rgb, soft, w, h, "public/images/ocean/wave-crest.webp");
  console.log("wave", w, h, "bg", bg);
}

async function island(src, out, w, h) {
  const { data } = await raw(src, w, h);
  let m = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const sea = (b - r - 30) / 20 > 0 && b - g > 14 ? 1 : 0;
    const dark = r + g + b < 90 ? 1 : 0;
    m[i] = sea || dark ? 0 : 1;
  }
  // Open: drop sea sparkles; then close small holes; then feather.
  m = blur(m, w, h, 3);
  for (let i = 0; i < m.length; i++) m[i] = m[i] > 0.6 ? 1 : 0;
  m = blur(m, w, h, 4);
  for (let i = 0; i < m.length; i++) m[i] = m[i] > 0.35 ? 1 : 0;
  // Fill holes: only sea connected to the frame edge stays sea.
  const open = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop();
    if (open[i] || m[i]) continue;
    open[i] = 1;
    const x = i % w, y = (i / w) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - w);
    if (y < h - 1) stack.push(i + w);
  }
  for (let i = 0; i < m.length; i++) m[i] = open[i] ? 0 : 1;
  // Drop detached cloud puffs (bright, grey pieces apart from the main
  // island); detached rocks and islets are dark and stay.
  const comp = new Int32Array(w * h).fill(-1);
  const parts = [];
  for (let s = 0; s < m.length; s++) {
    if (!m[s] || comp[s] >= 0) continue;
    const id = parts.length, px = [];
    comp[s] = id;
    stack.push(s);
    while (stack.length) {
      const i = stack.pop();
      px.push(i);
      const x = i % w, y = (i / w) | 0;
      for (const n of [x > 0 && i - 1, x < w - 1 && i + 1, y > 0 && i - w, y < h - 1 && i + w]) {
        if (n !== false && m[n] && comp[n] < 0) {
          comp[n] = id;
          stack.push(n);
        }
      }
    }
    let lum = 0, chroma = 0;
    for (const i of px) {
      const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
      lum += (r + g + b) / 3;
      chroma += Math.max(r, g, b) - Math.min(r, g, b);
    }
    parts.push({ px, lum: lum / px.length, chroma: chroma / px.length });
  }
  const main = parts.reduce((a, p) => (p.px.length > a.px.length ? p : a), parts[0]);
  let dropped = 0;
  for (const p of parts) {
    if (p !== main && p.lum > 150 && p.chroma < 60) {
      for (const i of p.px) m[i] = 0;
      dropped++;
    }
  }
  m = blur(m, w, h, 2);
  console.log("island parts", parts.length, "cloud puffs dropped", dropped);
  const rgb = Buffer.from(data);
  await writeRGBA(rgb, m, w, h, out);
  console.log("island", out);
}

await waveCrest();
await island("public/images/island/island-isometric.jpg", "public/images/island/iso-island.webp", 1280, 720);
await island("public/images/island/island-isometric-portrait.jpg", "public/images/island/iso-island-portrait.webp", 720, 1280);
for (const [s, o, w, h] of [
  ["iso-sea.jpg", "public/images/island/iso-sea.jpg", 1280, 720],
  ["iso-sea-portrait.jpg", "public/images/island/iso-sea-portrait.jpg", 720, 1280],
]) {
  await sharp(ASSETS + s).resize(w, h, { fit: "cover" }).jpeg({ quality: 86, mozjpeg: true }).toFile(o);
}
console.log("done");
