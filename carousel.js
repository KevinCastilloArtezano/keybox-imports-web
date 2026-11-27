/*
 * KEYBOX IMPORTS — carrusel 3D de productos destacados
 * ---------------------------------------------------------
 * Adaptación en JavaScript plano (sin React/WebGL/Next.js) del estilo
 * visual "Warp Carousel" (Louis Studios): un anillo de tarjetas con
 * perspectiva, animación de giro y arrastre, renderizado en Canvas 2D.
 *
 * Las tarjetas muestran productos reales (nombre, precio, specs,
 * estado y disponibilidad) en vez de estadísticas genéricas.
 */

(function () {
  "use strict";

  /* ---------------- geometría del anillo (idéntica al original) ---------------- */

  const CW = 256;
  const CH = 320;
  const CR = 10;
  const FOCAL = 734.103;
  const G = {
    qA: 0.46401, XLA: 165.774, zA: 35.354, psiA: 1.44638, a1: 1.31454, a2: 1.10948,
    qB: 0.74999, XB: 204.525, ZB: 355.405, bB: 0.69311, bE: 0.04614,
    vC: 203.134, aC: 229.26, kB: 0.01087,
    bP: 0.99129, qPR: 1.01828, bPL: 1.0092, qPL: 1.07139,
  };

  function poseAt(q0) {
    let q = q0;
    if (Math.abs(q) < 1) q -= G.kB * Math.sin(Math.PI * q) ** 2;
    const s = q < 0 ? -1 : 1;
    const a = Math.abs(q);
    const half = CW / 2;
    if (a <= G.qA) {
      const t = a / G.qA;
      const xl = -half + (G.XLA + half) * Math.pow(t, G.a1);
      const zl = G.zA * t ** 4;
      const psi = G.psiA * Math.pow(t, G.a2);
      return [s * (xl + half * Math.cos(psi)), zl + half * Math.sin(psi), s * psi];
    }
    const dXL = ((G.XLA + half) * G.a1) / G.qA;
    const dZL = (G.zA * 4) / G.qA;
    const dps = (G.psiA * G.a2) / G.qA;
    let Hx, Hz;
    if (a <= G.qB) {
      const L = G.qB - G.qA;
      const t = (a - G.qA) / L;
      const hx = G.XLA + CW * Math.cos(G.psiA);
      const hz = G.zA + CW * Math.sin(G.psiA);
      const dhx = dXL - CW * Math.sin(G.psiA) * dps;
      const dhz = dZL + CW * Math.cos(G.psiA) * dps;
      const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
      const h10 = t ** 3 - 2 * t ** 2 + t;
      const h01 = -2 * t ** 3 + 3 * t ** 2;
      const h11 = t ** 3 - t ** 2;
      Hx = h00 * hx + h10 * L * dhx * G.bB + h01 * G.XB + h11 * L * G.vC * G.bE;
      Hz = h00 * hz + h10 * L * dhz * G.bB + h01 * G.ZB;
    } else {
      const d = a - G.qB;
      Hx = G.XB + G.vC * d + G.aC * d * d;
      Hz = G.ZB;
    }
    const qP = s < 0 ? G.qPL : G.qPR;
    const bP = s < 0 ? G.bPL : G.bP;
    const LP = qP - G.qA;
    const tp = Math.min(1, (a - G.qA) / LP);
    const psi =
      (2 * tp ** 3 - 3 * tp ** 2 + 1) * G.psiA +
      (tp ** 3 - 2 * tp ** 2 + tp) * LP * dps * bP +
      (-2 * tp ** 3 + 3 * tp ** 2) * Math.PI;
    return [s * (Hx - half * Math.cos(psi)), Hz - half * Math.sin(psi), s * psi];
  }

  /* ---------------- curva de giro (idéntica al original) ---------------- */

  const TK = [0, 3, 6, 8, 10, 11, 12, 13, 14, 16, 18, 21, 25, 30, 36, 45, 55, 70, 88, 110];
  const TB = [0, 0.02175, 0.12069, 0.22549, 0.35493, 0.43254, 0.51436, 0.5952, 0.6751, 0.83199, 0.9709, 1.12669, 1.27958, 1.40975, 1.53561, 1.68385, 1.79183, 1.89191, 1.95233, 2];
  const DRIFT = 0.06511;
  const REST_PHASE = 81.828;
  const STEP_FRAMES = 110;

  const SLOPES = (() => {
    const n = TK.length;
    const h = TK.slice(1).map((x, i) => x - TK[i]);
    const dl = h.map((hi, i) => (TB[i + 1] - TB[i]) / hi);
    const d = new Array(n).fill(0);
    for (let k = 1; k < n - 1; k++) {
      if (dl[k - 1] * dl[k] <= 0) d[k] = 0;
      else {
        const w1 = 2 * h[k] + h[k - 1];
        const w2 = h[k] + 2 * h[k - 1];
        d[k] = (w1 + w2) / (w1 / dl[k - 1] + w2 / dl[k]);
      }
    }
    const v = (dl[0] + dl[n - 2]) / 2;
    d[0] = v;
    d[n - 1] = v;
    return d;
  })();

  function spin(frames) {
    if (frames <= 0) return 0;
    if (frames >= STEP_FRAMES) return 1;
    let i = 0;
    while (i < TK.length - 2 && frames > TK[i + 1]) i++;
    const h = TK[i + 1] - TK[i];
    const t = (frames - TK[i]) / h;
    const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
    const h10 = t ** 3 - 2 * t ** 2 + t;
    const h01 = -2 * t ** 3 + 3 * t ** 2;
    const h11 = t ** 3 - t ** 2;
    return (h00 * TB[i] + h10 * h * SLOPES[i] + h01 * TB[i + 1] + h11 * h * SLOPES[i + 1]) / 2;
  }

  function spinN(frames, n) {
    if (n <= STEP_FRAMES + 0.5) return spin((frames * STEP_FRAMES) / Math.max(1, n));
    const knee = 80;
    if (frames <= knee) return spin(frames);
    return spin(knee + ((frames - knee) * (STEP_FRAMES - knee)) / (n - knee));
  }

  const LEAD = (STEP_FRAMES - REST_PHASE) / 30;

  /* ---------------- color helpers ---------------- */

  function parseColor(c, fallback) {
    fallback = fallback || [0, 0, 0];
    const s = (c || "").trim();
    let m = /^#([0-9a-f]{3,8})$/i.exec(s);
    if (m) {
      let h = m[1];
      if (h.length <= 4) h = h.split("").map((x) => x + x).join("");
      const n = parseInt(h.slice(0, 6), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    return fallback;
  }
  function rgba(c, a) {
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
  }

  /* ---------------- malla de fondo (mesh gradient) ---------------- */

  function bspline(t, out) {
    const it = 1 - t;
    out[0] = (it * it * it) / 6;
    out[1] = (3 * t * t * t - 6 * t * t + 4) / 6;
    out[2] = (-3 * t * t * t + 3 * t * t + 3 * t + 1) / 6;
    out[3] = (t * t * t) / 6;
  }

  function meshGrid(mesh) {
    const cols = mesh.map((c) => parseColor(c));
    const out = [];
    for (let j = 0; j < 7; j++)
      for (let i = 0; i < 6; i++) out.push(cols[j * 6 + i]);
    return out;
  }

  function paintMesh(ctx, w, h, mesh) {
    const grid = meshGrid(mesh);
    const img = ctx.createImageData(w, h);
    const d = img.data;
    const wx = new Float32Array(w * 4);
    const ix = new Int32Array(w * 4);
    const tmp = [0, 0, 0, 0];
    for (let x = 0; x < w; x++) {
      const u = ((x + 0.5) / w) * 5;
      const i = Math.floor(u);
      bspline(u - i, tmp);
      for (let k = 0; k < 4; k++) {
        wx[x * 4 + k] = tmp[k];
        ix[x * 4 + k] = Math.min(5, Math.max(0, i - 1 + k));
      }
    }
    const row = new Float32Array(6 * 3);
    let seed = 1234567;
    for (let y = 0; y < h; y++) {
      const v = ((y + 0.5) / h) * 6;
      const j = Math.floor(v);
      bspline(v - j, tmp);
      row.fill(0);
      for (let k = 0; k < 4; k++) {
        const jj = Math.min(6, Math.max(0, j - 1 + k));
        const wy = tmp[k];
        for (let i = 0; i < 6; i++) {
          const c = grid[jj * 6 + i];
          row[i * 3] += c[0] * wy;
          row[i * 3 + 1] += c[1] * wy;
          row[i * 3 + 2] += c[2] * wy;
        }
      }
      for (let x = 0; x < w; x++) {
        let r = 0, g = 0, b = 0;
        for (let k = 0; k < 4; k++) {
          const wgt = wx[x * 4 + k];
          const i3 = ix[x * 4 + k] * 3;
          r += row[i3] * wgt;
          g += row[i3 + 1] * wgt;
          b += row[i3 + 2] * wgt;
        }
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const n = (seed / 0x7fffffff - 0.5) * 1.6;
        const o = (y * w + x) * 4;
        d[o] = r + n;
        d[o + 1] = g + n;
        d[o + 2] = b + n;
        d[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  /* ---------------- paletas por categoría (del "Warp Carousel" original) ---------------- */

  const PALETTES = {
    macbooks: {
      mesh: ["#022852", "#031e3f", "#031934", "#021831", "#021b36", "#022246", "#022345", "#020e1e", "#01040f", "#000416", "#020b31", "#021c57", "#01172f", "#01010c", "#03001d", "#0a0f4c", "#112383", "#0b36af", "#021142", "#050b47", "#0c2e8f", "#165bd4", "#1675fd", "#167bff", "#03288e", "#0438af", "#0d66e7", "#107eec", "#30afff", "#71dcff", "#0356e8", "#0259ec", "#0945b0", "#001a49", "#3f7c9d", "#d4ffff", "#0365ff", "#0256ea", "#052a87", "#00001f", "#1f4c7b", "#9ee7ff"],
      numeral: ["#3ad2ff", "#8cf6ff"], accent: "#7fe8ff", glow: "#12b0e8",
    },
    fundas: {
      mesh: ["#4c2d5f", "#3b2245", "#3e285b", "#33204f", "#381844", "#572571", "#644096", "#4f3688", "#8358f6", "#8d54f3", "#5e20ac", "#6e24b7", "#482e6d", "#261b48", "#825bf6", "#d48cff", "#d07bff", "#b359ff", "#2d1837", "#140a1b", "#2c1d66", "#3a2383", "#693bca", "#8b42ef", "#411c5b", "#300753", "#3b006e", "#500f79", "#7e31c1", "#9541f3", "#44245a", "#3f0c69", "#6f15b9", "#d17cff", "#e2a3ff", "#a668ff", "#4b2f60", "#4d2172", "#6819aa", "#9b48dc", "#965dc9", "#7745c4"],
      numeral: ["#e2a6ff", "#fff6ff"], accent: "#d9a8ff", glow: "#62bce8",
    },
    cargadores: {
      mesh: ["#ff623e", "#f57337", "#e49435", "#fba03f", "#ef6b36", "#f14c36", "#f29a3e", "#a0a92e", "#a2ba36", "#fffe65", "#ffd852", "#f2863b", "#a5b12e", "#46821d", "#6a6127", "#b88b44", "#b6bd41", "#c4b838", "#7e9f27", "#3b5a19", "#412c10", "#0d1700", "#255b0c", "#98ad28", "#a5b232", "#3e7c1e", "#002800", "#00300f", "#5b9745", "#c1b833", "#f3983b", "#b3b431", "#6fa31f", "#9bc976", "#edd896", "#fd8c3d", "#ff5f3b", "#ff7d47", "#ffa880", "#ffc1d8", "#ff8d99", "#ff5438"],
      numeral: ["#f4eeb6", "#c4c688"], accent: "#f6efc0", glow: "#dacbe9",
    },
    otros: {
      mesh: ["#48001c", "#400119", "#41011d", "#4b021e", "#47021a", "#480019", "#7e0036", "#8c0033", "#4b0120", "#10000c", "#1f010b", "#390116", "#e84396", "#ff568c", "#dc433c", "#0e0705", "#090004", "#2f0213", "#ff9fd9", "#ff6f90", "#a53625", "#190d05", "#050002", "#2f0110", "#ff67b5", "#b11348", "#000000", "#11000c", "#3e021b", "#8a0c31", "#e31771", "#5d0027", "#3a0021", "#620030", "#640627", "#dc184a", "#c10b5f", "#920245", "#ab054f", "#910041", "#650226", "#c01240"],
      numeral: ["#fffdf8", "#e8603f"], accent: "#ff6a3d", glow: "#6cc0ea",
    },
  };

  const CONDITION_COLOR = { Nuevo: [28, 122, 77], Usado: [10, 61, 98] };
  const AVAIL_COLOR = {
    disponible: [28, 122, 77],
    pocas: [181, 121, 43],
    consultar: [120, 126, 133],
  };

  /* ---------------- pintar una tarjeta de producto ---------------- */

  const FONT = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  function fontStr(weight, px) {
    return `${weight} ${px}px ${FONT}`;
  }

  function wrapTwoLines(ctx, text, maxWidth) {
    const words = text.split(" ");
    let line1 = "";
    let i = 0;
    for (; i < words.length; i++) {
      const test = line1 ? line1 + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line1) break;
      line1 = test;
    }
    let line2 = words.slice(i).join(" ");
    if (ctx.measureText(line2).width > maxWidth) {
      while (line2.length && ctx.measureText(line2 + "…").width > maxWidth) {
        line2 = line2.slice(0, -1);
      }
      line2 += line2 ? "…" : "";
    }
    return [line1, line2];
  }

  function ellipsize(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let t = text;
    while (t.length && ctx.measureText(t + "…").width > maxWidth) t = t.slice(0, -1);
    return t + "…";
  }

  const IMAGE_CACHE = new Map();
  function getProductImage(src, onLoad) {
    let img = IMAGE_CACHE.get(src);
    if (!img) {
      img = new Image();
      img.src = src;
      IMAGE_CACHE.set(src, img);
    }
    if (!img.complete && onLoad) img.addEventListener("load", onLoad, { once: true });
    return img;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function paintCard(cv, product, notifyReady) {
    const w = cv.width;
    const h = cv.height;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const k = w / CW;
    const pal = PALETTES[product.category] || PALETTES.otros;
    const photoSrc = Array.isArray(product.photos) && product.photos.length ? product.photos[0] : null;
    const img = photoSrc ? getProductImage(photoSrc, notifyReady) : null;
    const hasImg = !!(img && img.complete && img.naturalWidth);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    paintMesh(ctx, w, h, pal.mesh);
    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.textBaseline = "alphabetic";
    const white = [255, 255, 255];

    // condition badge (top-left)
    const condColor = CONDITION_COLOR[product.condition] || CONDITION_COLOR.Usado;
    ctx.font = fontStr(700, 8);
    const condW = ctx.measureText(product.condition).width + 16;
    ctx.fillStyle = rgba(condColor, 0.95);
    roundRect(ctx, 14, 14, condW, 18, 9);
    ctx.fill();
    ctx.fillStyle = rgba(white, 0.95);
    ctx.fillText(product.condition, 22, 26.5);

    // availability pill (top-right)
    const availCol = AVAIL_COLOR[product.availability] || AVAIL_COLOR.consultar;
    const label = { disponible: "Disponible", pocas: "Pocas unidades", consultar: "Consultar" }[product.availability] || "Consultar";
    ctx.font = fontStr(700, 8);
    const pillW = ctx.measureText(label).width + 16;
    ctx.fillStyle = rgba(availCol, 0.95);
    roundRect(ctx, CW - 14 - pillW, 14, pillW, 18, 9);
    ctx.fill();
    ctx.fillStyle = rgba(white, 0.95);
    ctx.fillText(label, CW - 14 - pillW + 8, 26.5);

    // photo window: fixed size/position for every card, photo never cropped,
    // always centered inside it (fixes products looking "too high/low").
    const PX = 16, PY = 42, PW = CW - PX * 2, PH = 148;
    ctx.save();
    roundRect(ctx, PX, PY, PW, PH, 14);
    ctx.clip();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(PX, PY, PW, PH);
    if (hasImg) {
      const pad = 10;
      const bx = PX + pad, by = PY + pad, bw = PW - pad * 2, bh = PH - pad * 2;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      const scale = Math.min(bw / iw, bh / ih);
      const dw = iw * scale, dh = ih * scale;
      ctx.drawImage(img, bx + (bw - dw) / 2, by + (bh - dh) / 2, dw, dh);
    }
    ctx.restore();
    ctx.strokeStyle = rgba(white, 0.1);
    ctx.lineWidth = 1;
    roundRect(ctx, PX, PY, PW, PH, 14);
    ctx.stroke();

    // title (one line, ellipsized) below the photo window
    const titleY = PY + PH + 26;
    ctx.font = fontStr(600, 15);
    ctx.fillStyle = rgba(white, 0.95);
    ctx.fillText(ellipsize(ctx, product.name, CW - 34), 17, titleY);

    // price
    const n0 = parseColor(pal.numeral[0]);
    const n1 = parseColor(pal.numeral[1]);
    const hasPrice = typeof product.price === "number";
    const valueStr = hasPrice ? `S/ ${product.price.toLocaleString("es-PE")}` : "Consultar";
    const priceY = titleY + 30;
    if (hasPrice) {
      ctx.font = fontStr(300, 28);
      const vw = ctx.measureText(valueStr).width;
      const grad = ctx.createLinearGradient(17, 0, 17 + vw, 0);
      grad.addColorStop(0, rgba(n0, 1));
      grad.addColorStop(1, rgba(n1, 1));
      ctx.fillStyle = grad;
      ctx.fillText(valueStr, 17, priceY);
      if (typeof product.originalPrice === "number") {
        ctx.font = fontStr(400, 12);
        const origStr = `S/ ${product.originalPrice.toLocaleString("es-PE")}`;
        ctx.fillStyle = rgba(white, 0.5);
        ctx.fillText(origStr, 17 + vw + 10, priceY);
      }
    } else {
      ctx.font = fontStr(500, 16);
      ctx.fillStyle = rgba(white, 0.75);
      ctx.fillText(valueStr, 17, priceY);
    }

    // specs (footer, one line)
    ctx.font = fontStr(400, 11);
    ctx.fillStyle = rgba(white, 0.7);
    ctx.fillText(ellipsize(ctx, product.specs, CW - 34), 17, CH - 20);
  }

  /** Cara trasera: simétrica (sin texto), para cuando la tarjeta gira de canto y el
   *  texto frontal se vería reflejado. Mantiene el look del anillo sin volverse ilegible. */
  function paintCardBack(cv, product) {
    const w = cv.width;
    const h = cv.height;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const k = w / CW;
    const pal = PALETTES[product.category] || PALETTES.otros;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    paintMesh(ctx, w, h, pal.mesh);
    ctx.fillStyle = "rgba(10, 12, 16, 0.55)";
    ctx.fillRect(0, 0, w, h);
    ctx.setTransform(k, 0, 0, k, 0, 0);
    const accent = parseColor(pal.accent);
    const cx = CW / 2, cy = CH / 2;
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      ctx.strokeStyle = rgba(accent, 0.3);
      ctx.lineWidth = 1;
      const r1 = 38;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      ctx.lineTo(cx + Math.cos(a) * (r1 + 6), cy + Math.sin(a) * (r1 + 6));
      ctx.stroke();
    }
    ctx.fillStyle = rgba(accent, 0.85);
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = rgba([255, 255, 255], 0.9);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, 11, 0, Math.PI * 2);
    ctx.stroke();
  }

  /* ---------------- brillo (glow) superior/inferior ---------------- */

  function glowShape(pose) {
    const [px, pz, ps] = pose;
    const c = Math.cos(ps);
    const sn = Math.sin(ps);
    if (c <= 0.02) return [0, 1, 0];
    const A = px;
    const B = FOCAL + pz;
    const tNear = B - 0.5 * CW * Math.abs(sn);
    let m = 0, mx = 0, mxx = 0;
    for (let u = -360; u <= 360; u += 6) {
      const hh = Math.exp(-((Math.abs(u - 9) / 138) ** 4));
      if (hh < 0.003) continue;
      const k = u / 1.8 / FOCAL;
      const den = sn * k - c;
      if (Math.abs(den) < 1e-4) continue;
      const s = (A - B * k) / den;
      const t = B + s * sn;
      if (t < 4) continue;
      if ((u / 1.8 / FOCAL) * t * sn - t * c >= 0) continue;
      const dsdk = (B * c - A * sn) / (den * den);
      const soft = Math.min(Math.abs(dsdk / FOCAL) * 2.2, 40) + 0.5;
      const cov = Math.max(0, Math.min(1, (CW * 0.5 - Math.abs(s)) / soft + 0.5));
      if (cov <= 0) continue;
      const near = Math.min(1, FOCAL / t);
      const rel = Math.exp(-((Math.max(t - tNear, 0) / 36) ** 1.5));
      const wgt = cov * near * near * rel * c * hh;
      m += wgt;
      mx += wgt * u;
      mxx += wgt * u * u;
    }
    if (m < 0.5) return [0, 1, 0];
    const mu = mx / m;
    const sd = Math.sqrt(Math.max(1, mxx / m - mu * mu));
    const r = Math.max(6, sd / 0.581);
    return [mu, r, (m * 3) / (1.813 * r)];
  }

  /* ---------------- composición de la escena en Canvas 2D ---------------- */

  function drawScene(ctx, w, h, unit, poses, canvases, backCanvases, bgCss, glowCols) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = bgCss;
    ctx.fillRect(0, 0, w, h);

    const gH = Math.min(h / 2 / unit, 288);
    for (const p of poses) {
      if (p.layer < 0) continue;
      const [mu, r, amp] = glowShape(p.pose);
      const a = Math.min(1, amp) * 0.9;
      if (a < 0.01) continue;
      const rx = r * 1.35 * unit;
      const col = glowCols[p.layer] || [127, 208, 240];
      const rgb = `${col[0]}, ${col[1]}, ${col[2]}`;
      for (const yy of [h / 2 - (gH - 11) * unit, h / 2 + (gH - 12) * unit]) {
        ctx.save();
        ctx.translate(w / 2 + mu * unit, yy);
        ctx.scale(1, (20 * unit) / rx);
        const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        rg.addColorStop(0, `rgba(${rgb}, ${a})`);
        rg.addColorStop(0.55, `rgba(${rgb}, ${a * 0.55})`);
        rg.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = rg;
        ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
        ctx.restore();
      }
    }

    const proj = (X, Zb, Y) => {
      const D = FOCAL + Zb;
      return [w / 2 + ((X * FOCAL) / D) * unit, h / 2 - ((Y * FOCAL) / D) * unit];
    };
    const items = poses
      .filter((p) => p.layer >= 0)
      .map((p) => ({ ...p, depth: p.pose[1] }))
      .sort((a, b) => b.depth - a.depth);
    const strips = 24;
    const eps = 1.5 / Math.max(unit, 0.25);
    const half = CW / 2;
    const edgeY = (sv) => {
      const dx = Math.abs(sv) - (half - CR);
      if (dx <= 0) return CH / 2;
      return CH / 2 - CR + Math.sqrt(Math.max(0, CR * CR - Math.min(dx, CR) ** 2));
    };
    for (const it of items) {
      const [cx, zb, psi] = it.pose;
      const cs = Math.cos(psi);
      const sn = Math.sin(psi);
      // más allá de ~90° se vería el reverso de la tarjeta (texto reflejado):
      // usamos la cara trasera simétrica en su lugar.
      const cv = cs >= 0 ? canvases[it.layer] : backCanvases[it.layer];
      if (!cv) continue;
      const tpu = cv.width / CW;
      const at = (sv, y) => proj(cx + sv * cs, zb + sv * sn, y);
      for (let i = 0; i < strips; i++) {
        const s0 = -half + (CW * i) / strips - (i > 0 ? eps : 0);
        const s1 = -half + (CW * (i + 1)) / strips + (i < strips - 1 ? eps : 0);
        if (FOCAL + zb + s0 * sn < 10 || FOCAL + zb + s1 * sn < 10) continue;
        const n = Math.abs(s0) > half - CR - 1 || Math.abs(s1) > half - CR - 1 ? 6 : 1;
        ctx.save();
        ctx.beginPath();
        for (let kk = 0; kk <= n; kk++) {
          const sv = Math.max(-half, Math.min(half, s0 + ((s1 - s0) * kk) / n));
          const pt = at(sv, edgeY(sv));
          if (kk === 0) ctx.moveTo(pt[0], pt[1]);
          else ctx.lineTo(pt[0], pt[1]);
        }
        for (let kk = n; kk >= 0; kk--) {
          const sv = Math.max(-half, Math.min(half, s0 + ((s1 - s0) * kk) / n));
          const pt = at(sv, -edgeY(sv));
          ctx.lineTo(pt[0], pt[1]);
        }
        ctx.closePath();
        ctx.clip();
        const sm = (s0 + s1) / 2;
        const tl = at(s0, CH / 2);
        const tr = at(s1, CH / 2);
        const mt = at(sm, CH / 2);
        const mb = at(sm, -CH / 2);
        const sx0 = (s0 + half) * tpu;
        const sw = (s1 - s0) * tpu;
        const ov = 1.025;
        const a = (tr[0] - tl[0]) / sw;
        const b = (tr[1] - tl[1]) / sw;
        const c = ((mb[0] - mt[0]) / cv.height) * ov;
        const d = ((mb[1] - mt[1]) / cv.height) * ov;
        const smx = (sm + half) * tpu;
        const ox = (mt[0] + mb[0]) / 2 - a * smx - c * (cv.height / 2);
        const oy = (mt[1] + mb[1]) / 2 - b * smx - d * (cv.height / 2);
        ctx.setTransform(a, b, c, d, ox, oy);
        const x0 = Math.max(0, sx0 - 1);
        const x1 = Math.min(cv.width, sx0 + sw + 1);
        ctx.drawImage(cv, x0, 0, x1 - x0, cv.height, x0, 0, x1 - x0, cv.height);
        ctx.restore();
      }
    }
  }

  /* ---------------- utilidades ---------------- */

  const mod = (a, n) => ((a % n) + n) % n;

  function usePrefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  /* ---------------- clase principal ---------------- */

  class ProductWarpCarousel {
    constructor(container, opts) {
      this.container = container;
      this.opts = Object.assign({ background: "#121826", interval: 3.4, step: 2, autoplay: true, onFront: null }, opts);
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("aria-hidden", "true");
      this.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;cursor:grab;";
      container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");
      this.reduced = usePrefersReducedMotion();
      this.cards = [];
      this.list = [];
      this.cardCanvases = [];
      this.N = 0;
      this.unit = 1;
      this.W = 0;
      this.H = 0;
      this.texW = 0;
      this.disposed = false;
      this.visible = true;
      this.raf = 0;

      this.L = {
        P: 0, from: 0, to: 0, t0: 0, n: STEP_FRAMES, v: 0, mode: "rest",
        nextAuto: Infinity, autoPending: false,
        dragX: 0, dragP: 0, downX: 0, moved: false, lastT: 0, hiddenAt: 0,
      };
      this.lastIndex = 0;

      this._bindEvents();
      this._observe();
    }

    setCards(cards) {
      this.cards = cards.length ? cards : [];
      const list = [];
      while (this.cards.length && list.length < 4) list.push(...this.cards);
      this.list = list;
      this.realCount = this.cards.length;
      this.N = list.length;
      this.lastIndex = 0;
      this.L.P = 0;
      this.L.from = 0;
      this.L.to = 0;
      this.L.mode = "rest";
      this.L.nextAuto = performance.now() / 1000 + this.opts.interval;
      this.texW = 0;
      this._resize(true);
      this._notifyFront();
      this._kick();
    }

    goTo(delta) {
      const prev = this.lastIndex;
      this.lastIndex = prev + delta;
      this._advance(prev, this.lastIndex, false);
      this._notifyFront();
    }

    _advance(prev, current, fromAuto) {
      const L = this.L;
      let delta = current - prev;
      const now = performance.now() / 1000;
      L.autoPending = false;
      if (this.reduced) {
        L.P = Math.round(L.P) + delta;
        L.mode = "rest";
      } else if (L.mode !== "spring") {
        const base = Math.round(L.P - DRIFT) + delta;
        L.from = L.P;
        L.to = base + DRIFT;
        L.t0 = now;
        L.n = fromAuto ? this.opts.interval * 30 : STEP_FRAMES;
        L.mode = "spin";
      }
      if (!fromAuto) L.nextAuto = now + this.opts.interval;
      this._kick();
    }

    _notifyFront() {
      if (!this.realCount) return;
      const idx = mod(Math.round(this.L.P), this.realCount);
      if (this.opts.onFront) this.opts.onFront(this.cards[idx], idx);
    }

    _paintAll(w) {
      this.cardCanvases = this.list.map((card) => {
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = Math.round((w * CH) / CW);
        paintCard(cv, card, () => {
          paintCard(cv, card);
          this._draw(performance.now() / 1000);
        });
        return cv;
      });
      this.cardBackCanvases = this.list.map((card) => {
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = Math.round((w * CH) / CW);
        paintCardBack(cv, card);
        return cv;
      });
      this.texW = w;
    }

    _resize(force) {
      const r = this.container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.max(2, Math.round(r.width * dpr));
      const H = Math.max(2, Math.round(r.height * dpr));
      if (this.canvas.width !== W) this.canvas.width = W;
      if (this.canvas.height !== H) this.canvas.height = H;
      this.W = W;
      this.H = H;
      this.unit = Math.min(W / 720, H / 440);
      const want = Math.min(900, Math.max(256, Math.round(CW * this.unit * 1.25)));
      if (want !== this.texW || force) this._paintAll(want);
    }

    _poseSet(P) {
      const N = this.N;
      if (!N) return [];
      const ids = Array.from({ length: N }, (_, c) => ({ c, q: mod(c - P + N / 2, N) - N / 2 }))
        .sort((a, b) => Math.abs(a.q) - Math.abs(b.q))
        .slice(0, 4);
      return ids.map(({ c, q }) => (Math.abs(q) > 2.05 ? { pose: [0, 0, 0], layer: -1 } : { pose: poseAt(q), layer: c }));
    }

    _progressAt(now) {
      const L = this.L;
      if (L.mode === "spin") {
        const f = (now - L.t0) * 30;
        L.P = L.from + (L.to - L.from) * spinN(f, L.n);
        if (f >= L.n) L.mode = "rest";
      } else if (L.mode === "spring") {
        const dt = Math.min(0.034, Math.max(0, now - L.lastT));
        L.lastT = now;
        const sub = 4;
        for (let i = 0; i < sub; i++) {
          const acc = -60 * (L.P - L.to) - 13 * L.v;
          L.v += (acc * dt) / sub;
          L.P += (L.v * dt) / sub;
        }
        if (Math.abs(L.P - L.to) < 4e-4 && Math.abs(L.v) < 3e-3) {
          L.P = L.to;
          L.v = 0;
          L.mode = "rest";
        }
      }
      return L.P;
    }

    _draw(now) {
      if (this.disposed || !this.N) return;
      const P = this._progressAt(now);
      const setA = this._poseSet(P);
      const glowCols = this.list.map((c) => parseColor((PALETTES[c.category] || PALETTES.otros).glow));
      drawScene(this.ctx, this.W, this.H, this.unit, setA, this.cardCanvases, this.cardBackCanvases, this.opts.background, glowCols);
    }

    _loop() {
      this.raf = 0;
      if (this.disposed || !this.visible) return;
      const now = performance.now() / 1000;
      const L = this.L;
      if (this.opts.autoplay && this.realCount > 1 && L.mode !== "drag" && L.mode !== "spring" && now >= L.nextAuto) {
        L.nextAuto = Math.max(L.nextAuto + this.opts.interval, now + this.opts.interval * 0.5);
        L.autoPending = true;
        const prev = this.lastIndex;
        this.lastIndex = prev + this.opts.step;
        this._advance(prev, this.lastIndex, true);
        this._notifyFront();
      }
      this._draw(now);
      const busy = L.mode !== "rest" || (this.opts.autoplay && this.realCount > 1);
      if (busy) this.raf = requestAnimationFrame(() => this._loop());
    }

    _kick() {
      if (!this.raf && !this.disposed && this.visible) this.raf = requestAnimationFrame(() => this._loop());
    }

    _bindEvents() {
      const c = this.canvas;
      c.addEventListener("pointerdown", (e) => {
        if (e.button > 0 || !this.N) return;
        const L = this.L;
        c.setPointerCapture?.(e.pointerId);
        L.mode = "drag";
        L.dragX = e.clientX;
        L.downX = e.clientX;
        L.dragP = L.P;
        L.v = 0;
        L.moved = false;
        L.lastT = performance.now() / 1000;
        c.style.cursor = "grabbing";
        this._kick();
      });
      c.addEventListener("pointermove", (e) => {
        const L = this.L;
        if (L.mode !== "drag") return;
        const r = this.container.getBoundingClientRect();
        const unitCss = Math.min(r.width / 720, r.height / 440);
        const now = performance.now() / 1000;
        const P = L.dragP - (e.clientX - L.dragX) / (unitCss * 300 || 1);
        const dt = Math.max(1 / 240, now - L.lastT);
        L.v = 0.6 * L.v + 0.4 * ((P - L.P) / dt);
        L.P = P;
        L.lastT = now;
        if (Math.abs(e.clientX - L.downX) > 5) L.moved = true;
        this._draw(now);
      });
      const onUp = (e) => {
        const L = this.L;
        if (L.mode !== "drag") return;
        c.style.cursor = "grab";
        const now = performance.now() / 1000;
        L.nextAuto = now + this.opts.interval;
        if (!L.moved) {
          L.mode = "rest";
          const r = this.container.getBoundingClientRect();
          const u = (e.clientX - r.left - r.width / 2) / Math.min(r.width / 720, r.height / 440 || 1);
          if (u > 90) {
            this.goTo(1);
            return;
          }
          if (u < -90) {
            this.goTo(-1);
            return;
          }
          if (this.realCount && this.opts.onFrontClick) {
            const idx = mod(Math.round(this.L.P), this.realCount);
            this.opts.onFrontClick(this.cards[idx]);
          }
          return;
        }
        if (now - L.lastT > 0.08) L.v = 0;
        const target = Math.round(L.P + L.v * 0.16);
        const from = Math.round(L.dragP - DRIFT);
        L.to = target;
        L.mode = "spring";
        L.lastT = now;
        const next = this.lastIndex + (target - from);
        if (next !== this.lastIndex) {
          this.lastIndex = next;
          this._notifyFront();
        }
        this._kick();
      };
      c.addEventListener("pointerup", onUp);
      c.addEventListener("pointercancel", onUp);

      this.container.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          this.goTo(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          this.goTo(-1);
        }
      });
    }

    _observe() {
      this.ro = new ResizeObserver(() => {
        this._resize(false);
        this._draw(performance.now() / 1000);
      });
      this.ro.observe(this.container);

      let inView = true;
      this.io = new IntersectionObserver((ents) => {
        inView = ents.some((e) => e.isIntersecting);
        this._setVisible(inView && document.visibilityState === "visible");
      });
      this.io.observe(this.container);
      this._onVis = () => this._setVisible(inView && document.visibilityState === "visible");
      document.addEventListener("visibilitychange", this._onVis);
      this._resize(true);
    }

    _setVisible(vis) {
      const now = performance.now() / 1000;
      if (vis === this.visible) return;
      if (!vis) this.L.hiddenAt = now;
      else {
        const dt = now - this.L.hiddenAt;
        this.L.t0 += dt;
        this.L.nextAuto += dt;
        this.L.lastT = now;
      }
      this.visible = vis;
      if (vis) this._kick();
    }

    destroy() {
      this.disposed = true;
      if (this.raf) cancelAnimationFrame(this.raf);
      this.ro?.disconnect();
      this.io?.disconnect();
      document.removeEventListener("visibilitychange", this._onVis);
    }
  }

  window.ProductWarpCarousel = ProductWarpCarousel;
})();
