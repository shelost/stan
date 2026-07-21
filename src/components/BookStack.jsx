import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TONES = {
  purple: ['#8a7bff', '#6355f1', '#ffffff'],
  navy: ['#3d4fae', '#131f60', '#ffffff'],
  lilac: ['#d3b3f6', '#a97ee4', '#ffffff'],
  peach: ['#ffcb8a', '#ff7e5c', '#ffffff'],
  mint: ['#7dffd0', '#30dfa0', '#103a2c'],
  blue: ['#8ab8ff', '#3d6bff', '#ffffff'],
  green: ['#8ce9ae', '#2fae6b', '#ffffff'],
  pink: ['#ffb3dc', '#ff5ca8', '#ffffff'],
  sunrise: ['#ffd28a', '#ff5ca8', '#ffffff'],
};

const FONT = '"Plus Jakarta Sans", sans-serif';

function spineTexture(edition) {
  const [c1, c2, text] = TONES[edition.tone];
  const w = 2048;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // subtle top highlight like a lit book edge
  const sheen = ctx.createLinearGradient(0, 0, 0, h);
  sheen.addColorStop(0, 'rgba(255,255,255,0.22)');
  sheen.addColorStop(0.25, 'rgba(255,255,255,0)');
  sheen.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = text;
  ctx.textBaseline = 'middle';

  ctx.font = `500 52px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.globalAlpha = 0.85;
  ctx.fillText(`${edition.quarter} ${edition.year}`, 110, h / 2 + 4);

  ctx.globalAlpha = 1;
  ctx.font = `800 74px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(edition.name, w / 2, h / 2 + 4);

  // $ coin on the right, like a publisher mark
  const cx = w - 150;
  const cy = h / 2;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(cx, cy, 52, 0, Math.PI * 2);
  ctx.strokeStyle = text;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.font = `800 58px ${FONT}`;
  ctx.fillText('$', cx, cy + 4);
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function coverTexture(edition) {
  const [c1, c2, text] = TONES[edition.tone];
  const w = 1024;
  const h = 704;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = `700 34px ${FONT}`;
  ctx.globalAlpha = 0.8;
  ctx.fillText('STAN EDITIONS', w / 2, 84);

  ctx.globalAlpha = 1;
  ctx.font = `400 190px ${FONT}`;
  ctx.fillText(edition.emoji, w / 2, h / 2 - 60);

  ctx.font = `800 92px ${FONT}`;
  ctx.fillText(edition.name, w / 2, h / 2 + 130);

  ctx.font = `600 36px ${FONT}`;
  ctx.globalAlpha = 0.8;
  ctx.fillText(`${edition.quarter} ${edition.year} · Edition`, w / 2, h - 84);
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  // the box's +Y face maps texture-top toward -Z; spin it so the cover
  // reads upright from the camera in the stack view
  tex.center.set(0.5, 0.5);
  tex.rotation = Math.PI;
  return tex;
}

export default function BookStack({ editions, selectedId, onPick }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ selectedId: null });

  stateRef.current.selectedId = selectedId;

  useEffect(() => {
    const mount = mountRef.current;
    const state = stateRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#161040');
    scene.fog = new THREE.Fog('#161040', 26, 44);

    const camera = new THREE.PerspectiveCamera(34, mount.clientWidth / mount.clientHeight, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#b9b3ff', 1.35));
    const key = new THREE.DirectionalLight('#ffffff', 2.1);
    key.position.set(4, 10, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight('#8a7bff', 0.9);
    rim.position.set(-6, -4, 6);
    scene.add(rim);

    // build the stack, newest on top
    const books = [];
    const gap = 0.06;
    const heights = editions.map((_, i) => 0.46 - (i % 3) * 0.045);
    const totalH = heights.reduce((a, b) => a + b + gap, -gap);
    let y = totalH / 2;

    const rand = (seed) => {
      const x = Math.sin(seed * 999) * 10000;
      return x - Math.floor(x);
    };

    editions.forEach((edition, i) => {
      const h = heights[i];
      const w = 3.5 - rand(i + 1) * 0.5;
      const d = 2.3;
      y -= h / 2;

      const [c1, c2] = TONES[edition.tone];
      const side = new THREE.MeshStandardMaterial({ color: c2, roughness: 0.62 });
      const pages = new THREE.MeshStandardMaterial({ color: '#efe9dc', roughness: 0.9 });
      const spine = new THREE.MeshStandardMaterial({ map: spineTexture(edition), roughness: 0.55 });
      const cover = new THREE.MeshStandardMaterial({ map: coverTexture(edition), roughness: 0.55 });
      const bottom = new THREE.MeshStandardMaterial({ color: c1, roughness: 0.7 });

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [
        pages, // +X page block
        side, // -X
        cover, // +Y top = front cover
        bottom, // -Y
        spine, // +Z spine facing the viewer
        side, // -Z
      ]);

      const group = new THREE.Group();
      group.add(mesh);
      const baseX = (rand(i + 7) - 0.5) * 0.34;
      const baseRotY = (rand(i + 13) - 0.5) * 0.05;
      group.position.set(baseX, y, 0);
      group.rotation.y = baseRotY;

      group.userData = {
        id: edition.id,
        base: { x: baseX, y, z: 0, rotX: 0, rotY: baseRotY, rotZ: 0 },
        materials: [pages, side, cover, bottom, spine],
      };
      scene.add(group);
      books.push(group);
      y -= h / 2 + gap;
    });

    // camera slightly above the stack looking down, Stripe Press style;
    // distance is fitted to the viewport so the stack stays centered
    // with margins on any aspect ratio
    const camBase = { x: 0, y: totalH * 0.55, z: 12.8 };
    const lookAt = new THREE.Vector3(0, -totalH * 0.06, 0);

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
      const distW = 2.3 / (halfTan * aspect);
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
      books.forEach((g, i) => {
        const mesh = g.children[0];
        mesh.material[4].map = spineTexture(editions[i]);
        mesh.material[2].map = coverTexture(editions[i]);
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
