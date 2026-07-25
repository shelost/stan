import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TONES as PALETTE } from '../../data/tones';

const TONES = Object.fromEntries(
  Object.entries(PALETTE).map(([k, v]) => [k, [v.soft, v.base]])
);

const FONT = 'Inter, system-ui, sans-serif';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function texFrom(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// the full app screen shown on the device
function screenTexture(edition) {
  const w = 620;
  const h = 1340;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  const [c1, c2] = TONES[edition.tone];

  ctx.fillStyle = '#f7f7f4';
  ctx.fillRect(0, 0, w, h);

  // tinted header
  const head = ctx.createLinearGradient(0, 0, w, 430);
  head.addColorStop(0, c1);
  head.addColorStop(1, c2);
  ctx.fillStyle = head;
  ctx.fillRect(0, 0, w, 430);

  // status bar
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.font = `450 23px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('9:41', 42, 54);
  ctx.textAlign = 'right';
  ctx.fillText('▮▮▮', w - 42, 54);

  // masthead + avatar
  ctx.textAlign = 'center';
  ctx.font = `500 21px ${FONT}`;
  ctx.globalAlpha = 0.82;
  ctx.fillText('THE STANDARD', w / 2, 116);
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.arc(w / 2, 216, 58, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.24)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.stroke();
  ctx.font = `300 46px ${FONT}`;
  ctx.fillStyle = '#fff';
  ctx.fillText(edition.name.charAt(0).toUpperCase(), w / 2, 224);

  ctx.font = `450 44px ${FONT}`;
  ctx.fillText(edition.name, w / 2, 316);
  ctx.font = `450 24px ${FONT}`;
  ctx.globalAlpha = 0.85;
  ctx.fillText(`${edition.quarter} ${edition.year} · Edition`, w / 2, 362);
  ctx.globalAlpha = 1;

  // blurb card
  let y = 476;
  ctx.fillStyle = '#fff';
  roundRect(ctx, 34, y, w - 68, 168, 26);
  ctx.fill();
  ctx.fillStyle = '#26251e';
  ctx.font = `450 26px ${FONT}`;
  ctx.textAlign = 'left';
  const words = edition.blurb.split(' ');
  let line = '';
  let ly = y + 52;
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > w - 130) {
      ctx.fillText(line, 64, ly);
      ly += 38;
      line = word;
    } else {
      line = test;
    }
  });
  ctx.fillText(line, 64, ly);

  // highlight rows
  y += 202;
  edition.highlights.forEach((hl) => {
    ctx.fillStyle = '#fff';
    roundRect(ctx, 34, y, w - 68, 122, 24);
    ctx.fill();

    const g = ctx.createLinearGradient(62, y + 26, 132, y + 96);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    roundRect(ctx, 62, y + 26, 70, 70, 20);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `500 32px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('✓', 97, y + 63);

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(38,37,30,0.78)';
    ctx.font = `400 22px ${FONT}`;
    const parts = hl.split(' ');
    let l2 = '';
    let y2 = y + 52;
    parts.forEach((word) => {
      const test = l2 ? `${l2} ${word}` : word;
      if (ctx.measureText(test).width > w - 230) {
        ctx.fillText(l2, 154, y2);
        y2 += 32;
        l2 = word;
      } else {
        l2 = test;
      }
    });
    ctx.fillText(l2, 154, y2);
    y += 142;
  });

  // CTA
  ctx.fillStyle = '#26251e';
  roundRect(ctx, 34, h - 168, w - 68, 96, 48);
  ctx.fill();
  ctx.fillStyle = '#f7f7f4';
  ctx.font = `500 29px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('Open in Stan', w / 2, h - 118);

  // home indicator
  ctx.fillStyle = 'rgba(38,37,30,0.28)';
  roundRect(ctx, w / 2 - 70, h - 38, 140, 9, 5);
  ctx.fill();

  return texFrom(c);
}

// compact card that orbits the device
function cardTexture(edition) {
  const w = 512;
  const h = 800;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  const [c1, c2] = TONES[edition.tone];

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  for (let i = 0; i < 3; i += 1) {
    roundRect(ctx, 46, 300 + i * 118, w - 92, 92, 22);
    ctx.fill();
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `300 116px ${FONT}`;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillText(edition.name.charAt(0).toUpperCase(), w / 2, 172);

  ctx.font = `450 52px ${FONT}`;
  ctx.fillText(edition.name, w / 2, 686);
  ctx.font = `400 27px ${FONT}`;
  ctx.globalAlpha = 0.85;
  ctx.fillText(`${edition.quarter} ${edition.year}`, w / 2, 736);

  return texFrom(c);
}

function roundedShape(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

export default function PhoneScene({ editions, activeIndex, onActive, spinRef }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  stateRef.current.onActive = onActive;
  stateRef.current.wanted = activeIndex;

  useEffect(() => {
    const mount = mountRef.current;
    const state = stateRef.current;
    const N = editions.length;
    const STEP = (Math.PI * 2) / N;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#16161a');
    scene.fog = new THREE.Fog('#16161a', 15, 33);

    const camera = new THREE.PerspectiveCamera(36, 16 / 9, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth || window.innerWidth, mount.clientHeight || window.innerHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#ffffff', 1.45));
    const key = new THREE.DirectionalLight('#ffffff', 2.2);
    key.position.set(3, 8, 9);
    scene.add(key);
    const fill = new THREE.DirectionalLight('#9a9a92', 1.1);
    fill.position.set(-7, 2, 4);
    scene.add(fill);

    // ---- device ----
    const phone = new THREE.Group();
    const PW = 2.55;
    const PH = 5.2;

    const bodyGeo = new THREE.ExtrudeGeometry(roundedShape(PW, PH, 0.42), {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.07,
      bevelSegments: 4,
      curveSegments: 24,
    });
    bodyGeo.center();
    const body = new THREE.Mesh(
      bodyGeo,
      new THREE.MeshStandardMaterial({ color: '#2a2a2e', roughness: 0.34, metalness: 0.85 })
    );
    phone.add(body);

    const glass = new THREE.Mesh(
      new THREE.ExtrudeGeometry(roundedShape(PW - 0.14, PH - 0.14, 0.36), {
        depth: 0.02,
        bevelEnabled: false,
        curveSegments: 24,
      }),
      new THREE.MeshStandardMaterial({ color: '#0b0b0d', roughness: 0.18, metalness: 0.4 })
    );
    glass.position.z = 0.2;
    phone.add(glass);

    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture(editions[0]) });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(PW - 0.28, PH - 0.3), screenMat);
    screen.position.z = 0.225;
    phone.add(screen);

    // dynamic island
    const island = new THREE.Mesh(
      new THREE.ExtrudeGeometry(roundedShape(0.62, 0.17, 0.085), {
        depth: 0.01,
        bevelEnabled: false,
        curveSegments: 12,
      }),
      new THREE.MeshBasicMaterial({ color: '#000000' })
    );
    island.position.set(0, PH / 2 - 0.42, 0.235);
    phone.add(island);

    // side buttons
    const btnMat = new THREE.MeshStandardMaterial({
      color: '#3a3a3e',
      roughness: 0.3,
      metalness: 0.9,
    });
    [
      [-PW / 2 - 0.02, 1.15, 0.5],
      [PW / 2 + 0.02, 1.35, 0.75],
    ].forEach(([x, y, len]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, len, 0.16), btnMat);
      b.position.set(x, y, 0.05);
      phone.add(b);
    });

    phone.position.y = 1.15;
    scene.add(phone);

    // glow puck under the device
    const puck = new THREE.Mesh(
      new THREE.CircleGeometry(4.9, 48),
      new THREE.MeshBasicMaterial({ color: '#8a8a80', transparent: true, opacity: 0.1 })
    );
    puck.rotation.x = -Math.PI / 2;
    puck.position.y = -3.9;
    scene.add(puck);

    // ---- carousel ring ----
    // sits low, like a turntable around the device's base, so the
    // front-most card never covers the screen
    const ring = new THREE.Group();
    ring.position.set(0, -3.05, -0.6);
    scene.add(ring);

    const RADIUS = 4.1;
    const cards = [];
    editions.forEach((edition, i) => {
      const holder = new THREE.Group();
      const a = i * STEP;
      holder.position.set(Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS);
      holder.rotation.y = a;

      const cw = 1.18;
      const ch = 1.78;
      const plate = new THREE.Mesh(
        new THREE.ExtrudeGeometry(roundedShape(cw, ch, 0.18), {
          depth: 0.09,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelSegments: 2,
          curveSegments: 16,
        }),
        new THREE.MeshStandardMaterial({ color: '#232327', roughness: 0.5 })
      );
      plate.geometry.center();
      holder.add(plate);

      const face = new THREE.Mesh(
        new THREE.PlaneGeometry(cw - 0.1, ch - 0.1),
        new THREE.MeshBasicMaterial({ map: cardTexture(edition), transparent: true })
      );
      face.position.z = 0.075;
      holder.add(face);

      holder.rotation.x = -0.26;
      holder.userData = { index: i, plate, face };
      ring.add(holder);
      cards.push(holder);
    });

    // framed a little low so the bottom controls clear the front card
    const camBase = { y: 0.1, z: 13.6 };
    const lookAt = new THREE.Vector3(0, -0.75, 0);

    const fit = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      const aspect = w / h;
      if (!Number.isFinite(aspect) || aspect <= 0) return;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      const halfTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      // keep the device and the ring's full width inside the frame
      camBase.z = Math.max(4.5 / halfTan, 5.6 / (halfTan * aspect), 11.5);
      renderer.setSize(w, h);
    };
    fit();
    camera.position.set(0, camBase.y, camBase.z);
    camera.lookAt(lookAt);

    const ro = new ResizeObserver(fit);
    ro.observe(mount);
    window.addEventListener('resize', fit);

    // ---- interaction ----
    let angle = 0;
    let target = 0;
    let auto = true;
    let idle = 0;
    let current = 0;

    const setIndex = (i) => {
      const n = ((i % N) + N) % N;
      // travel the short way around the ring
      const delta = ((n * -STEP - target) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      target += delta;
      auto = false;
      idle = 0;
    };
    state.setIndex = setIndex;
    if (spinRef) spinRef.current = { step: (dir) => setIndex(current + dir) };

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-5, -5);
    let dragging = false;
    let lastX = 0;
    let moved = 0;

    const onDown = (e) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      auto = false;
      idle = 0;
    };
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      target -= dx * 0.006;
      idle = 0;
    };
    const onUp = () => {
      if (dragging) {
        dragging = false;
        target = Math.round(target / STEP) * STEP;
      }
    };
    const onClick = () => {
      if (moved > 6) return;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(cards, true)[0];
      if (hit) {
        let o = hit.object;
        while (o && o.userData?.index === undefined) o = o.parent;
        if (o) setIndex(o.userData.index);
      }
    };
    const onWheel = (e) => {
      target += e.deltaY * 0.0022;
      auto = false;
      idle = 0;
    };

    mount.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    mount.addEventListener('click', onClick);
    mount.addEventListener('wheel', onWheel, { passive: true });

    // prebuild the screen art so switching is instant
    const screens = editions.map((e) => screenTexture(e));
    document.fonts.ready.then(() => {
      screens.forEach((t, i) => {
        t.dispose();
        screens[i] = screenTexture(editions[i]);
      });
      cards.forEach((c, i) => {
        c.userData.face.material.map.dispose();
        c.userData.face.material.map = cardTexture(editions[i]);
      });
      screenMat.map = screens[current];
      screenMat.needsUpdate = true;
    });

    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const f = 1 - Math.exp(-6 * dt);

      // React asked for a different card (index buttons / keyboard)
      if (state.wanted !== undefined && state.wanted !== current && !dragging) {
        setIndex(state.wanted);
        state.wanted = undefined;
      }

      idle += dt;
      if (idle > 6) auto = true;
      if (auto && !dragging) target += dt * 0.16;

      if (!dragging) angle += (target - angle) * f;
      else angle = target;
      ring.rotation.y = angle;

      const idx = ((Math.round(-angle / STEP) % N) + N) % N;
      if (idx !== current) {
        current = idx;
        screenMat.map = screens[idx];
        screenMat.needsUpdate = true;
        state.onActive?.(idx);
      }

      // front-most card leans up and brightens
      cards.forEach((c) => {
        const world = Math.cos(c.rotation.y + angle);
        const front = (world + 1) / 2;
        const k = Math.pow(front, 6);
        c.scale.setScalar(0.88 + k * 0.26);
        c.position.y = k * 0.3;
        c.userData.face.material.opacity = 0.42 + front * 0.58;
        c.userData.plate.material.opacity = 0.42 + front * 0.58;
        c.userData.plate.material.transparent = true;
      });

      phone.rotation.y = Math.sin(clock.elapsedTime * 0.36) * 0.14;
      phone.position.y = 0.55 + Math.sin(clock.elapsedTime * 0.8) * 0.055;

      camera.position.z += (camBase.z - camera.position.z) * f;
      camera.lookAt(lookAt);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', fit);
      mount.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      mount.removeEventListener('click', onClick);
      mount.removeEventListener('wheel', onWheel);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editions]);

  return <div className="pstage" ref={mountRef} />;
}
