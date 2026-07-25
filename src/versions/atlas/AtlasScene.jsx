import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TONES as PALETTE } from '../../data/tones';

const TONES = Object.fromEntries(
  Object.entries(PALETTE).map(([k, v]) => [k, [v.soft, v.base]])
);

const FONT = 'Inter, system-ui, sans-serif';

// helix geometry: cards ride a fixed spiral rail and settle at the origin
const RAD = 5.6;
const ANG = 1.02;
const DZ = 4;
const SQUASH = 0.6;
const CAM_Z = 7.8;

function pointAt(t, out = new THREE.Vector3()) {
  // reaches full radius within one step so neighbours clear the
  // focused panel instead of crowding it
  const grip = Math.min(1, Math.abs(t));
  const ease = grip * grip * (3 - 2 * grip); // smoothstep → 0 at focus
  const r = RAD * ease;
  const a = t * ANG - Math.PI / 2;
  return out.set(Math.cos(a) * r, Math.sin(a) * r * SQUASH, -t * DZ);
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

function wrap(ctx, text, x, y, maxW, lh) {
  const words = text.split(' ');
  let line = '';
  let ly = y;
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, x, ly);
      ly += lh;
      line = word;
    } else {
      line = test;
    }
  });
  ctx.fillText(line, x, ly);
  return ly;
}

function panelTexture(edition, index, total) {
  const w = 880;
  const h = 1180;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  const [c1, c2] = TONES[edition.tone];

  // frosted glass slab
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, 'rgba(34,34,38,0.96)');
  g.addColorStop(1, 'rgba(21,21,24,0.96)');
  ctx.fillStyle = g;
  roundRect(ctx, 8, 8, w - 16, h - 16, 46);
  ctx.fill();

  // accent wash from the edition's tone
  const wash = ctx.createRadialGradient(w * 0.5, 250, 40, w * 0.5, 250, 620);
  wash.addColorStop(0, `${c1}55`);
  wash.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = wash;
  ctx.fill();

  // hairline border
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  roundRect(ctx, 8, 8, w - 16, h - 16, 46);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // index + quarter row
  ctx.font = `450 25px ${FONT}`;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillText(String(index + 1).padStart(2, '0'), 66, 92);
  ctx.textAlign = 'right';
  ctx.fillText(`${edition.quarter} ${edition.year}`, w - 66, 92);
  ctx.textAlign = 'left';

  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(66, 126);
  ctx.lineTo(w - 66, 126);
  ctx.stroke();

  // emblem in a tone-lit disc
  const disc = ctx.createLinearGradient(w / 2 - 96, 214, w / 2 + 96, 406);
  disc.addColorStop(0, c1);
  disc.addColorStop(1, c2);
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(w / 2, 310, 96, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `300 84px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  ctx.fillText(edition.name.charAt(0).toUpperCase(), w / 2, 322);

  // name
  ctx.font = `450 78px ${FONT}`;
  ctx.fillStyle = '#fff';
  ctx.fillText(edition.name, w / 2, 486);

  if (edition.isNew) {
    ctx.font = `500 22px ${FONT}`;
    const label = 'NEW THIS QUARTER';
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = '#e8e6dd';
    roundRect(ctx, w / 2 - tw / 2 - 24, 534, tw + 48, 46, 23);
    ctx.fill();
    ctx.fillStyle = '#26251e';
    ctx.fillText(label, w / 2, 558);
  }

  // blurb
  ctx.textAlign = 'left';
  ctx.font = `400 32px ${FONT}`;
  ctx.fillStyle = 'rgba(255,255,255,0.86)';
  let y = wrap(ctx, edition.blurb, 66, edition.isNew ? 654 : 622, w - 132, 46) + 84;

  // highlights
  edition.highlights.forEach((hl) => {
    ctx.fillStyle = `${c1}2e`;
    roundRect(ctx, 60, y - 40, w - 120, 96, 22);
    ctx.fill();

    ctx.fillStyle = c1;
    ctx.beginPath();
    ctx.arc(108, y + 8, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1d';
    ctx.font = `500 18px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('✓', 108, y + 9);

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.76)';
    ctx.font = `400 25px ${FONT}`;
    wrap(ctx, hl, 146, y - 2, w - 230, 32);
    y += 118;
  });

  // footer rule
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(66, h - 108);
  ctx.lineTo(w - 66, h - 108);
  ctx.stroke();
  ctx.font = `450 23px ${FONT}`;
  ctx.fillStyle = 'rgba(255,255,255,0.42)';
  ctx.fillText('THE STANDARD', 66, h - 68);
  ctx.textAlign = 'right';
  ctx.fillText(`${index + 1} / ${total}`, w - 66, h - 68);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export default function AtlasScene({ editions, wantIndex, onActive, onProgress }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  stateRef.current.onActive = onActive;
  stateRef.current.onProgress = onProgress;
  stateRef.current.want = wantIndex;

  useEffect(() => {
    const mount = mountRef.current;
    const state = stateRef.current;
    const N = editions.length;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#131316');
    scene.fog = new THREE.FogExp2('#131316', 0.034);

    const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 200);
    camera.position.set(0, 0, CAM_Z);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth || window.innerWidth, mount.clientHeight || window.innerHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#ffffff', 2.4));

    // ---- starfield ----
    const starCount = 1400;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      starPos[i * 3] = (Math.random() - 0.5) * 90;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      starPos[i * 3 + 2] = -Math.random() * 120 + 10;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: '#cfcfc7',
        size: 0.09,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(stars);

    // ---- the rail the cards ride ----
    // starts just ahead of the focus point — carried further forward the
    // tube swings past the lens and reads as a stray band
    const railPts = [];
    for (let t = -0.4; t <= N + 1.5; t += 0.05) railPts.push(pointAt(t));
    const railCurve = new THREE.CatmullRomCurve3(railPts);
    const rail = new THREE.Mesh(
      new THREE.TubeGeometry(railCurve, 420, 0.035, 8, false),
      new THREE.MeshBasicMaterial({
        color: '#8f8f86',
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(rail);

    const halo = new THREE.Mesh(
      new THREE.TubeGeometry(railCurve, 220, 0.13, 6, false),
      new THREE.MeshBasicMaterial({
        color: '#6f6f68',
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(halo);

    // focus ring behind the settled card
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.45, 0.01, 8, 96),
      new THREE.MeshBasicMaterial({
        color: '#c9c7bd',
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    ring.position.z = -0.75;
    scene.add(ring);

    // ---- cards ----
    const CW = 2.62;
    const CH = 3.52;
    const cards = editions.map((edition, i) => {
      const mat = new THREE.MeshBasicMaterial({
        map: panelTexture(edition, i, N),
        transparent: true,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), mat);
      mesh.userData = { index: i, edition };
      mesh.renderOrder = 2;
      scene.add(mesh);
      return mesh;
    });

    document.fonts.ready.then(() => {
      cards.forEach((m, i) => {
        m.material.map.dispose();
        m.material.map = panelTexture(editions[i], i, N);
        m.material.needsUpdate = true;
      });
    });

    const fit = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      const aspect = w / h;
      if (!Number.isFinite(aspect) || aspect <= 0) return;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(mount);
    window.addEventListener('resize', fit);

    // ---- input ----
    let progress = 0;
    let target = 0;
    let current = 0;
    const clampP = (v) => THREE.MathUtils.clamp(v, 0, N - 1);

    state.goTo = (i) => {
      target = clampP(i);
    };

    const onWheel = (e) => {
      target = clampP(target + e.deltaY * 0.0022);
    };
    let dragging = false;
    let lastY = 0;
    let moved = 0;
    const pointer = new THREE.Vector2(-5, -5);
    const raycaster = new THREE.Raycaster();

    const onDown = (e) => {
      dragging = true;
      lastY = e.clientY;
      moved = 0;
    };
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (!dragging) return;
      const dy = e.clientY - lastY;
      lastY = e.clientY;
      moved += Math.abs(dy);
      target = clampP(target - dy * 0.011);
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      target = clampP(Math.round(target));
    };
    const onClick = () => {
      if (moved > 6) return;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(cards, false)[0];
      if (hit) target = clampP(hit.object.userData.index);
    };

    mount.addEventListener('wheel', onWheel, { passive: true });
    mount.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    mount.addEventListener('click', onClick);

    let raf;
    const clock = new THREE.Clock();
    const pos = new THREE.Vector3();
    const camTarget = new THREE.Vector3(0, 0, CAM_Z);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const f = 1 - Math.exp(-5.5 * dt);
      const time = clock.elapsedTime;

      if (state.want !== undefined && state.want !== null) {
        target = clampP(state.want);
        state.want = undefined;
      }

      // settle to the nearest card when the user lets go
      if (!dragging) {
        const snapped = Math.round(target);
        if (Math.abs(target - snapped) < 0.12) target += (snapped - target) * 0.25;
      }
      progress += (target - progress) * f;
      state.onProgress?.(progress);

      cards.forEach((m, i) => {
        const d = i - progress;
        pointAt(d, pos);
        m.position.copy(pos);
        m.lookAt(camTarget);
        m.rotation.z += d * 0.05;

        const focus = Math.max(0, 1 - Math.abs(d));
        m.scale.setScalar(0.78 + focus * 0.32);

        // fade in from the far end, fade out as it sweeps past the camera
        let a = 1;
        if (d < 0) a = Math.max(0, 1 + d * 1.55);
        else if (d > 3.2) a = Math.max(0, 1 - (d - 3.2) / 1.6);
        // trailing panels recede so the settled one carries the eye
        m.material.opacity = a * Math.max(0.2, 1 - Math.abs(d) * 0.42);
        m.visible = a > 0.01;
        m.renderOrder = 2 + (10 - Math.abs(d));
      });

      const idx = THREE.MathUtils.clamp(Math.round(progress), 0, N - 1);
      if (idx !== current) {
        current = idx;
        state.onActive?.(idx);
      }

      const settle = 1 - Math.min(1, Math.abs(progress - Math.round(progress)) * 3);
      ring.material.opacity = 0.16 + settle * 0.4;
      ring.scale.setScalar(1 + (1 - settle) * 0.06 + Math.sin(time * 1.6) * 0.006);
      ring.rotation.z = time * 0.12;

      stars.rotation.z = time * 0.006;
      stars.position.z = (progress * DZ * 0.35) % 40;

      // gentle parallax from the cursor
      camera.position.x += (pointer.x * 0.45 - camera.position.x) * f;
      camera.position.y += (pointer.y * 0.3 - camera.position.y) * f;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', fit);
      mount.removeEventListener('wheel', onWheel);
      mount.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      mount.removeEventListener('click', onClick);
      cards.forEach((m) => {
        m.geometry.dispose();
        m.material.map?.dispose();
        m.material.dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editions]);

  return <div className="astage" ref={mountRef} />;
}
