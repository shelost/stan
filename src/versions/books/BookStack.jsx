import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TONES as PALETTE } from '../../data/tones';

const TONES = Object.fromEntries(
  Object.entries(PALETTE).map(([k, v]) => [k, [v.soft, v.base, '#f4f2ec']])
);

const FONT = 'Inter, system-ui, sans-serif';
const MASTHEAD = 'THE STANDARD';

// ---------- shared fabric / paper helpers (built once) ----------

let fabricCache = null;

function getFabric() {
  if (fabricCache) return fabricCache;

  // speckled paper grain tile
  const grain = document.createElement('canvas');
  grain.width = grain.height = 256;
  const gctx = grain.getContext('2d');
  const img = gctx.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 118 + Math.random() * 20 + (Math.random() < 0.02 ? -40 : 0);
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  gctx.putImageData(img, 0, 0);

  // linen cloth weave tile
  const linen = document.createElement('canvas');
  linen.width = linen.height = 64;
  const lctx = linen.getContext('2d');
  lctx.fillStyle = '#808080';
  lctx.fillRect(0, 0, 64, 64);
  lctx.strokeStyle = 'rgba(255,255,255,0.45)';
  lctx.lineWidth = 1;
  for (let i = 0; i < 64; i += 4) {
    lctx.beginPath();
    lctx.moveTo(0, i + 0.5);
    lctx.lineTo(64, i + 0.5);
    lctx.stroke();
  }
  lctx.strokeStyle = 'rgba(0,0,0,0.3)';
  for (let i = 2; i < 64; i += 4) {
    lctx.beginPath();
    lctx.moveTo(i + 0.5, 0);
    lctx.lineTo(i + 0.5, 64);
    lctx.stroke();
  }

  // combined bump tile for cloth surfaces
  const bump = document.createElement('canvas');
  bump.width = bump.height = 256;
  const bctx = bump.getContext('2d');
  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, 256, 256);
  bctx.globalAlpha = 0.55;
  bctx.fillStyle = bctx.createPattern(linen, 'repeat');
  bctx.fillRect(0, 0, 256, 256);
  bctx.globalAlpha = 0.4;
  bctx.fillStyle = bctx.createPattern(grain, 'repeat');
  bctx.fillRect(0, 0, 256, 256);
  bctx.globalAlpha = 1;

  const bumpTex = new THREE.CanvasTexture(bump);
  bumpTex.wrapS = bumpTex.wrapT = THREE.RepeatWrapping;
  bumpTex.repeat.set(3, 3);

  fabricCache = { grain, linen, bumpTex };
  return fabricCache;
}

function applyFabric(ctx, w, h, strength = 1) {
  const { grain, linen } = getFabric();
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = 0.28 * strength;
  ctx.fillStyle = ctx.createPattern(linen, 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.16 * strength;
  ctx.fillStyle = ctx.createPattern(grain, 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function vignette(ctx, w, h, amount = 0.3) {
  const g = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) * 0.35,
    w / 2, h / 2, Math.max(w, h) * 0.74
  );
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(0,0,0,${amount})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

// stamped / debossed type: dark press-shadow above, light catch below
function embossText(ctx, text, x, y, color, depth = 2) {
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillText(text, x, y - depth);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText(text, x, y + depth);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function embossLine(ctx, x1, y1, x2, y2, width = 2, light = 0.22, dark = 0.32) {
  ctx.lineWidth = width;
  ctx.strokeStyle = `rgba(0,0,0,${dark})`;
  ctx.beginPath();
  ctx.moveTo(x1, y1 - width);
  ctx.lineTo(x2, y2 - width);
  ctx.stroke();
  ctx.strokeStyle = `rgba(255,255,255,${light})`;
  ctx.beginPath();
  ctx.moveTo(x1, y1 + width);
  ctx.lineTo(x2, y2 + width);
  ctx.stroke();
}

function makeTexture(canvas, rotate = false) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (rotate) {
    tex.center.set(0.5, 0.5);
    tex.rotation = Math.PI;
  }
  return tex;
}

// ---------- face textures ----------

function spineTexture(edition) {
  const [c1, c2, text] = TONES[edition.tone];
  const w = 2048;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, w * 0.25, h * 2.5);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  applyFabric(ctx, w, h, 1);

  // rounded shoulder of the binding: bright top edge, tucked dark base
  const sheen = ctx.createLinearGradient(0, 0, 0, h);
  sheen.addColorStop(0, 'rgba(255,255,255,0.38)');
  sheen.addColorStop(0.12, 'rgba(255,255,255,0.1)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.88, 'rgba(0,0,0,0.12)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // binding stitches near both ends
  ctx.save();
  ctx.setLineDash([7, 9]);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(0,0,0,0.28)';
  [46, w - 46].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 22);
    ctx.lineTo(x, h - 22);
    ctx.stroke();
  });
  ctx.restore();

  vignette(ctx, w, h, 0.22);

  ctx.textBaseline = 'middle';

  // quarter label in a stamped ticket box
  ctx.textAlign = 'left';
  ctx.font = `450 44px ${FONT}`;
  const label = `${edition.quarter} ${edition.year}`;
  const lw = ctx.measureText(label).width;
  embossLine(ctx, 96, h / 2 - 44, 96 + lw + 44, h / 2 - 44, 1.5);
  embossLine(ctx, 96, h / 2 + 44, 96 + lw + 44, h / 2 + 44, 1.5);
  ctx.globalAlpha = 0.9;
  embossText(ctx, label, 118, h / 2 + 2, text, 1.5);
  ctx.globalAlpha = 1;

  // stamped title
  ctx.textAlign = 'center';
  ctx.font = `500 74px ${FONT}`;
  embossText(ctx, edition.name, w / 2, h / 2 + 2, text, 2.5);

  // colophon: $ in a double ring
  const cx = w - 150;
  const cy = h / 2;
  ctx.globalAlpha = 0.92;
  [52, 42].forEach((r, i) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = i ? text : 'rgba(0,0,0,0.35)';
    ctx.lineWidth = i ? 4 : 5;
    ctx.stroke();
  });
  ctx.font = `500 50px ${FONT}`;
  embossText(ctx, '$', cx, cy + 3, text, 1.5);
  ctx.globalAlpha = 1;

  return makeTexture(canvas);
}

function coverTexture(edition) {
  const [c1, c2, text] = TONES[edition.tone];
  const w = 1280;
  const h = 880;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  applyFabric(ctx, w, h, 1.15);
  vignette(ctx, w, h, 0.34);

  // debossed double frame
  const frame = (m, lw, dark, light) => {
    ctx.lineWidth = lw;
    ctx.strokeStyle = `rgba(0,0,0,${dark})`;
    ctx.strokeRect(m - 1.5, m - 1.5, w - m * 2, h - m * 2);
    ctx.strokeStyle = `rgba(255,255,255,${light})`;
    ctx.strokeRect(m + 1.5, m + 1.5, w - m * 2, h - m * 2);
  };
  frame(46, 3, 0.35, 0.2);
  frame(64, 1.5, 0.28, 0.16);

  // corner ticks
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  const t = 26;
  [[86, 86, 1, 1], [w - 86, 86, -1, 1], [86, h - 86, 1, -1], [w - 86, h - 86, -1, -1]].forEach(
    ([x, y, sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(x + t * sx, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + t * sy);
      ctx.stroke();
    }
  );

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // masthead
  ctx.save();
  ctx.letterSpacing = '10px';
  ctx.font = `500 32px ${FONT}`;
  ctx.globalAlpha = 0.85;
  embossText(ctx, MASTHEAD, w / 2, 128, text, 1.5);
  ctx.restore();
  embossLine(ctx, w / 2 - 120, 168, w / 2 + 120, 168, 1.5);

  // center medallion behind the emblem
  const my = h / 2 - 56;
  const disc = ctx.createRadialGradient(w / 2 - 30, my - 36, 20, w / 2, my, 155);
  disc.addColorStop(0, 'rgba(255,255,255,0.34)');
  disc.addColorStop(0.7, 'rgba(255,255,255,0.08)');
  disc.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.beginPath();
  ctx.arc(w / 2, my, 150, 0, Math.PI * 2);
  ctx.fillStyle = disc;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(w / 2, my, 138, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.stroke();

  // monogram in place of a pictogram — quieter, and it sets in Inter
  ctx.save();
  ctx.font = `300 132px ${FONT}`;
  ctx.globalAlpha = 0.92;
  embossText(ctx, edition.name.charAt(0).toUpperCase(), w / 2, my + 10, text, 2);
  ctx.restore();

  // stamped title with a rule-and-diamond underline
  ctx.font = `500 86px ${FONT}`;
  embossText(ctx, edition.name, w / 2, h / 2 + 168, text, 3);
  const ry = h / 2 + 236;
  embossLine(ctx, w / 2 - 110, ry, w / 2 - 18, ry, 1.5);
  embossLine(ctx, w / 2 + 18, ry, w / 2 + 110, ry, 1.5);
  ctx.save();
  ctx.translate(w / 2, ry);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = text;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(-6, -6, 12, 12);
  ctx.restore();

  ctx.font = `450 31px ${FONT}`;
  ctx.globalAlpha = 0.82;
  embossText(ctx, `${edition.quarter} ${edition.year} · Edition`, w / 2, h - 118, text, 1.5);
  ctx.globalAlpha = 1;

  return makeTexture(canvas, true);
}

// page-block edges: fine horizontal leaves with slight waviness
function pagesTexture() {
  const w = 512;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, '#f4eddc');
  base.addColorStop(0.5, '#eee5d0');
  base.addColorStop(1, '#e3d8bf');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  for (let y = 2; y < h; y += 3) {
    const a = 0.06 + Math.random() * 0.16;
    ctx.strokeStyle = `rgba(140,120,90,${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const wob = Math.random() * 1.4;
    ctx.moveTo(0, y + wob);
    ctx.bezierCurveTo(w * 0.3, y - wob, w * 0.7, y + wob, w, y - wob * 0.5);
    ctx.stroke();
  }

  // compression shadows near the covers
  const press = ctx.createLinearGradient(0, 0, 0, h);
  press.addColorStop(0, 'rgba(60,45,25,0.35)');
  press.addColorStop(0.06, 'rgba(60,45,25,0)');
  press.addColorStop(0.94, 'rgba(60,45,25,0)');
  press.addColorStop(1, 'rgba(60,45,25,0.4)');
  ctx.fillStyle = press;
  ctx.fillRect(0, 0, w, h);

  return makeTexture(canvas);
}

// cloth back cover / underside
function clothTexture(edition) {
  const [c1, c2] = TONES[edition.tone];
  const w = 512;
  const h = 512;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, c2);
  grad.addColorStop(1, c1);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  applyFabric(ctx, w, h, 1.2);
  vignette(ctx, w, h, 0.4);

  return makeTexture(canvas);
}

export default function BookStack({ editions, selectedId, onPick, onOverscroll }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ selectedId: null, onOverscroll: null });

  stateRef.current.selectedId = selectedId;
  stateRef.current.onOverscroll = onOverscroll;

  useEffect(() => {
    const mount = mountRef.current;
    const state = stateRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#16161a');
    scene.fog = new THREE.Fog('#16161a', 26, 44);

    const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth || window.innerWidth, mount.clientHeight || window.innerHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#ffffff', 1.15));
    const key = new THREE.DirectionalLight('#ffffff', 2.3);
    key.position.set(4, 10, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight('#9a9a92', 0.85);
    rim.position.set(-6, -4, 6);
    scene.add(rim);

    const { bumpTex } = getFabric();
    const sharedPages = pagesTexture();

    // the latest edition sits face-out on a display shelf beside the pile
    const STACK_X = -1.85;
    const FEAT_X = 2.35;
    const FEAT_Y = 0.15;
    const featured = editions[0];
    const stackEditions = editions.slice(1);

    const books = [];
    const gap = 0.06;
    const heights = stackEditions.map((_, i) => 0.46 - (i % 3) * 0.045);
    const totalH = heights.reduce((a, b) => a + b + gap, -gap);
    let y = totalH / 2;

    const rand = (seed) => {
      const x = Math.sin(seed * 999) * 10000;
      return x - Math.floor(x);
    };

    const buildBook = (edition, w, h, d) => {
      const cloth = (map) =>
        new THREE.MeshStandardMaterial({
          map,
          roughness: 0.58,
          bumpMap: bumpTex,
          bumpScale: 0.6,
        });

      const pages = new THREE.MeshStandardMaterial({
        map: sharedPages,
        roughness: 0.88,
        bumpMap: sharedPages,
        bumpScale: 0.35,
      });

      const spine = cloth(spineTexture(edition));
      const cover = cloth(coverTexture(edition));
      const back = cloth(clothTexture(edition));

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [
        pages, // +X page edges
        pages, // -X page edges
        cover, // +Y top = front cover
        back, // -Y back cover
        spine, // +Z spine facing the viewer
        pages, // -Z fore-edge
      ]);
      return { mesh, materials: [pages, cover, back, spine] };
    };

    stackEditions.forEach((edition, i) => {
      const h = heights[i];
      const w = 3.5 - rand(i + 1) * 0.5;
      const d = 2.3;
      y -= h / 2;

      const { mesh, materials } = buildBook(edition, w, h, d);
      const group = new THREE.Group();
      group.add(mesh);
      const baseX = STACK_X + (rand(i + 7) - 0.5) * 0.34;
      const baseRotY = (rand(i + 13) - 0.5) * 0.05;
      group.position.set(baseX, y, 0);
      group.rotation.y = baseRotY;

      group.userData = {
        id: edition.id,
        edition,
        base: { x: baseX, y, z: 0, rotX: 0, rotY: baseRotY, rotZ: 0 },
        materials,
      };
      scene.add(group);
      books.push(group);
      y -= h / 2 + gap;
    });

    // featured book: standing upright, cover to the camera, on a plank
    {
      const d = 2.3;
      const { mesh, materials } = buildBook(featured, 3.4, 0.5, d);
      const group = new THREE.Group();
      group.add(mesh);
      const base = {
        x: FEAT_X,
        y: FEAT_Y,
        z: 0.15,
        rotX: -Math.PI / 2 + 0.08,
        rotY: 0,
        rotZ: Math.PI,
      };
      group.position.set(base.x, base.y, base.z);
      group.rotation.set(base.rotX, base.rotY, base.rotZ);
      group.userData = { id: featured.id, edition: featured, base, materials };
      scene.add(group);
      books.push(group);

      const plank = new THREE.Mesh(
        new THREE.BoxGeometry(4.15, 0.14, 1.5),
        new THREE.MeshStandardMaterial({ color: '#d9d8d1', roughness: 0.6 })
      );
      plank.position.set(FEAT_X, FEAT_Y - d / 2 - 0.07, 0);
      scene.add(plank);
    }

    // camera slightly above the stack looking down, Stripe Press style;
    // distance is fitted to the viewport so the stack stays centered
    // with margins on any aspect ratio
    const camBase = { x: 0, y: totalH * 0.55, z: 12.8 };
    const lookAt = new THREE.Vector3(0.2, -totalH * 0.06, 0);

    const fitCamera = () => {
      // the mount can measure 0x0 during the first layout pass; fall back
      // to the window so the camera math never produces NaN
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      const aspect = w / h;
      if (!Number.isFinite(aspect) || aspect <= 0) return;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const distH = (totalH / 2 + 1.1) / halfTan;
      const distW = 4.4 / (halfTan * aspect);
      camBase.z = Math.max(distH, distW, 9);
    };
    fitCamera();
    camera.position.set(camBase.x, camBase.y, camBase.z);
    camera.lookAt(lookAt);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-2, -2);
    let hoveredId = null;
    let mouseX = 0;
    let scroll = 0;
    let downAcc = 0;

    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseX = pointer.x;
    };

    const onClick = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(books, true);
      scroll = 0;
      onPick(hits.length ? hits[0].object.parent.userData.id : null);
    };

    const onWheel = (e) => {
      scroll = THREE.MathUtils.clamp(scroll + e.deltaY * 0.004, -2.2, 2.2);
      // keep scrolling down past the stack to open the all-editions drawer
      if (e.deltaY > 0) {
        downAcc += e.deltaY;
        if (downAcc > 700) {
          downAcc = 0;
          state.onOverscroll?.();
        }
      } else {
        downAcc = 0;
      }
    };

    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('click', onClick);
    mount.addEventListener('wheel', onWheel, { passive: true });

    // ResizeObserver also catches the first real layout pass, not just
    // window resizes
    const onResize = () => {
      fitCamera();
      renderer.setSize(
        mount.clientWidth || window.innerWidth,
        mount.clientHeight || window.innerHeight
      );
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);
    window.addEventListener('resize', onResize);

    // redraw label textures once the webfont is ready
    document.fonts.ready.then(() => {
      books.forEach((g) => {
        const mesh = g.children[0];
        mesh.material[4].map = spineTexture(g.userData.edition);
        mesh.material[2].map = coverTexture(g.userData.edition);
      });
    });

    let raf;
    const clock = new THREE.Clock();
    const vCam = new THREE.Vector3();
    const vDir = new THREE.Vector3();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const selected = state.selectedId;
      // a NaN can never lerp back to health — snap to base if it happens
      if (!Number.isFinite(camera.position.z)) {
        camera.position.set(camBase.x, camBase.y, camBase.z);
      }
      // time-based damping so the motion settles at the same wall-clock
      // speed regardless of the display's frame rate
      const dt = Math.min(clock.getDelta(), 0.12);
      const f = 1 - Math.exp(-8 * dt);
      const fCam = 1 - Math.exp(-4.5 * dt);

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(books, true);
      hoveredId = hits.length ? hits[0].object.parent.userData.id : null;
      mount.style.cursor = hoveredId ? 'pointer' : 'default';

      books.forEach((g) => {
        const { base, id, materials } = g.userData;
        let tx = base.x;
        let ty = base.y;
        let tz = base.z;
        let trx = base.rotX;
        let trY = base.rotY;
        let trz = base.rotZ;
        let dim = 1;

        if (selected === id) {
          // pull the book out and flip its cover to the camera; the extra
          // half-turn about Z keeps the cover text upright after the flip.
          // Anchor the spot on the camera's view line at a distance where
          // the book covers at most ~60% of the view height and ~50% of
          // the width, so it stays framed on any viewport size.
          const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
          const dist = Math.max(
            1.45 / (0.62 * halfTan),
            1.9 / (0.5 * halfTan * camera.aspect)
          );
          vCam.set(camBase.x, camBase.y, camBase.z);
          vDir.subVectors(lookAt, vCam).normalize();
          vCam.addScaledVector(vDir, Math.min(dist, camBase.z * 0.75));
          tx = vCam.x + (camera.aspect > 1.05 ? -1.35 : 0);
          ty = vCam.y;
          tz = vCam.z;
          trx = -Math.PI / 2 + 0.08;
          trY = 0;
          trz = Math.PI;
        } else if (selected) {
          dim = 0.35;
        } else if (hoveredId === id) {
          tz = base.z + 0.75;
        }

        g.position.x += (tx - g.position.x) * f;
        g.position.y += (ty - g.position.y) * f;
        g.position.z += (tz - g.position.z) * f;
        g.rotation.x += (trx - g.rotation.x) * f;
        g.rotation.y += (trY - g.rotation.y) * f;
        g.rotation.z += (trz - g.rotation.z) * f;

        materials.forEach((m) => {
          m.opacity = m.opacity === undefined ? 1 : m.opacity + (dim - m.opacity) * f;
          m.transparent = true;
        });
      });

      // wheel scroll peeks up/down the stack, then springs back to center
      scroll *= Math.exp(-1.4 * dt);
      const camY = camBase.y - scroll;
      camera.position.x += (camBase.x + mouseX * 0.7 - camera.position.x) * fCam;
      camera.position.y += (camY - camera.position.y) * fCam;
      camera.position.z += (camBase.z - camera.position.z) * fCam;
      camera.lookAt(lookAt);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('click', onClick);
      mount.removeEventListener('wheel', onWheel);
      books.forEach((g) => {
        const mesh = g.children[0];
        mesh.geometry.dispose();
        mesh.material.forEach((m) => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editions]);

  return <div className="stack" ref={mountRef} />;
}
