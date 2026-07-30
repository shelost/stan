import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Rasterise a product icon onto a purple coin face. The SVGs are white
// app tiles, so they sit on a purple disc with a lavender rim ring.
function faceTexture(img) {
  const S = 512;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');

  ctx.fillStyle = '#5d4ff2';
  ctx.fillRect(0, 0, S, S);

  const g = ctx.createRadialGradient(S * 0.38, S * 0.34, S * 0.1, S * 0.5, S * 0.5, S * 0.62);
  g.addColorStop(0, '#7466ff');
  g.addColorStop(1, '#5546e8');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(210,206,255,0.85)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2 - 26, 0, Math.PI * 2);
  ctx.stroke();

  if (img) {
    const iw = S * 0.46;
    ctx.save();
    // round the white tile like the app icons
    const x = (S - iw) / 2;
    const r = iw * 0.18;
    ctx.beginPath();
    ctx.moveTo(x + r, x);
    ctx.arcTo(x + iw, x, x + iw, x + iw, r);
    ctx.arcTo(x + iw, x + iw, x, x + iw, r);
    ctx.arcTo(x, x + iw, x, x, r);
    ctx.arcTo(x, x, x + iw, x, r);
    ctx.clip();
    ctx.drawImage(img, x, x, iw, iw);
    ctx.restore();
  }

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// A chunky coin that makes one half-turn per product chapter. The hidden
// face is retextured with the next chapter's icon while it's edge-on, so
// each flip reveals the next product.
export default function CoinScene({ icons, progressRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#ffffff', 1.6));
    const key = new THREE.DirectionalLight('#ffffff', 2.2);
    key.position.set(3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight('#d2ceff', 1.1);
    rim.position.set(-5, -2, 3);
    scene.add(rim);

    const N = icons.length;
    const side = new THREE.MeshStandardMaterial({
      color: '#4a3dd4',
      roughness: 0.38,
      metalness: 0.25,
    });
    const faceA = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.12 });
    const faceB = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.12 });

    // cylinder axis → z, so the flat faces look at the camera
    const geo = new THREE.CylinderGeometry(1.75, 1.75, 0.3, 96);
    geo.rotateX(Math.PI / 2);
    const coin = new THREE.Mesh(geo, [side, faceA, faceB]);
    const rig = new THREE.Group();
    rig.add(coin);
    scene.add(rig);

    let textures = [];
    let ready = false;
    Promise.all(icons.map(loadImage)).then((imgs) => {
      textures = imgs.map((img) => faceTexture(img));
      faceA.map = textures[0];
      faceB.map = textures[Math.min(1, N - 1)];
      faceA.needsUpdate = true;
      faceB.needsUpdate = true;
      ready = true;
    });

    const fit = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      const a = w / h;
      if (!Number.isFinite(a) || a <= 0) return;
      camera.aspect = a;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(mount);

    const ptr = { x: 0, y: 0 };
    const onMove = (e) => {
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    let lastQ = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const f = 1 - Math.exp(-6 * dt);
      const t = clock.elapsedTime;
      const p = progressRef.current || 0;

      // one half-turn per chapter
      const rot = p * (N - 1) * Math.PI;
      coin.rotation.y = rot;

      if (ready) {
        const q = Math.max(0, Math.min(N - 1, Math.round(rot / Math.PI)));
        if (q !== lastQ) {
          const next = Math.max(0, Math.min(N - 1, q + (rot / Math.PI > q ? 1 : -1)));
          // q even → faceA is toward camera; retexture the hidden face
          if (q % 2 === 0) {
            faceA.map = textures[q];
            faceB.map = textures[next];
          } else {
            faceB.map = textures[q];
            faceA.map = textures[next];
          }
          faceA.needsUpdate = true;
          faceB.needsUpdate = true;
          lastQ = q;
        }
      }

      // idle float + pointer-follow, damped
      rig.rotation.x += (ptr.y * 0.34 + Math.sin(t * 0.7) * 0.05 - rig.rotation.x) * f;
      rig.rotation.z += (ptr.x * -0.16 - rig.rotation.z) * f;
      rig.position.y += (Math.sin(t * 1.1) * 0.1 - rig.position.y) * f;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      geo.dispose();
      [side, faceA, faceB].forEach((m) => m.dispose());
      textures.forEach((tx) => tx.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [icons, progressRef]);

  return <div className="coin" ref={mountRef} aria-hidden="true" />;
}
