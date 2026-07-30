import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Five wireframe figures — one per product — living in a single scene.
// The act progress (0..4) crossfades, scales and spins them so scrolling
// feels like turning one continuous machine, not swapping slides.

function wire(color, opacity = 0.9) {
  return new THREE.LineBasicMaterial({ color, transparent: true, opacity });
}

function buildStan() {
  // coin heart: icosahedron shell around a solid core
  const g = new THREE.Group();
  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.7, 1)),
    wire('#ffffff', 0.85)
  );
  const inner = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 0)),
    wire('#d2ceff', 0.65)
  );
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 24, 24),
    new THREE.MeshBasicMaterial({ color: '#ffffff' })
  );
  g.add(shell, inner, core);
  g.userData.tick = (t) => {
    shell.rotation.y = t * 0.25;
    shell.rotation.x = Math.sin(t * 0.4) * 0.2;
    inner.rotation.y = -t * 0.4;
    core.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);
  };
  return g;
}

function buildStanley() {
  // a listening swarm: particles on a breathing sphere
  const g = new THREE.Group();
  const N = 1400;
  const pos = new Float32Array(N * 3);
  const base = new Float32Array(N * 3);
  for (let i = 0; i < N; i += 1) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.acos(2 * Math.random() - 1);
    const r = 1.55;
    const x = r * Math.sin(v) * Math.cos(u);
    const y = r * Math.cos(v);
    const z = r * Math.sin(v) * Math.sin(u);
    base.set([x, y, z], i * 3);
    pos.set([x, y, z], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: '#ffffff', size: 0.028, transparent: true, opacity: 0.95 })
  );
  const ring = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.CircleGeometry(2.05, 64)),
    wire('#d2ceff', 0.5)
  );
  g.add(pts, ring);
  g.userData.tick = (t) => {
    const p = geo.attributes.position.array;
    for (let i = 0; i < N; i += 1) {
      const k = 1 + Math.sin(t * 1.6 + base[i * 3 + 1] * 2.4) * 0.07;
      p[i * 3] = base[i * 3] * k;
      p[i * 3 + 1] = base[i * 3 + 1] * k;
      p[i * 3 + 2] = base[i * 3 + 2] * k;
    }
    geo.attributes.position.needsUpdate = true;
    pts.rotation.y = t * 0.18;
    ring.rotation.z = t * 0.1;
  };
  return g;
}

function buildStore() {
  // shelf of cells, one lit
  const g = new THREE.Group();
  const cells = [];
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      const cell = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.92, 0.92, 0.92)),
        wire('#ffffff', 0.8)
      );
      cell.position.set((c - 1) * 1.15, (r - 1) * 1.15, 0);
      g.add(cell);
      cells.push(cell);
    }
  }
  const lit = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.55, 0.55),
    new THREE.MeshBasicMaterial({ color: '#ffffff' })
  );
  g.add(lit);
  g.userData.tick = (t) => {
    const idx = Math.floor(t * 0.7) % 9;
    const target = cells[idx];
    lit.position.lerp(target.position, 0.12);
    lit.rotation.y = t * 0.9;
    g.rotation.y = Math.sin(t * 0.3) * 0.3;
  };
  return g;
}

function buildStories() {
  // a waveform you can walk around
  const g = new THREE.Group();
  const bars = [];
  const N = 13;
  for (let i = 0; i < N; i += 1) {
    const bar = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.34, 1, 0.34)),
      wire(i % 3 === 1 ? '#d2ceff' : '#ffffff', 0.85)
    );
    bar.position.x = (i - (N - 1) / 2) * 0.52;
    g.add(bar);
    bars.push(bar);
  }
  g.userData.tick = (t) => {
    bars.forEach((b, i) => {
      const h = 0.5 + Math.abs(Math.sin(t * 1.5 + i * 0.62)) * 2.1;
      b.scale.y = h;
    });
    g.rotation.y = Math.sin(t * 0.24) * 0.5;
  };
  return g;
}

function buildStudio() {
  // the cut: a knotted ribbon
  const g = new THREE.Group();
  const knot = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.TorusKnotGeometry(1.15, 0.34, 96, 12)),
    wire('#ffffff', 0.7)
  );
  const spark = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#d2ceff' })
  );
  g.add(knot, spark);
  const curve = new THREE.TorusKnotGeometry(1.15, 0.34, 200, 8);
  g.userData.tick = (t) => {
    knot.rotation.y = t * 0.3;
    knot.rotation.x = Math.sin(t * 0.35) * 0.35;
    const u = (t * 0.12) % 1;
    const a = u * Math.PI * 2;
    spark.position.set(Math.cos(a * 2) * 1.5, Math.sin(a * 3) * 0.6, Math.sin(a * 2) * 1.5);
  };
  curve.dispose();
  return g;
}

export default function FamilyScene({ progressRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const figures = [buildStan(), buildStanley(), buildStore(), buildStories(), buildStudio()];
    figures.forEach((f) => {
      f.visible = false;
      scene.add(f);
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

    const setOpacity = (fig, k) => {
      fig.traverse((o) => {
        if (o.material) {
          o.material.opacity = (o.userData.baseOpacity ?? (o.userData.baseOpacity = o.material.opacity)) * k;
          o.material.transparent = true;
        }
      });
    };

    let raf = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const f = 1 - Math.exp(-5 * dt);
      const t = clock.elapsedTime;
      // act progress 0..N-1, continuous
      const p = Math.max(0, Math.min(figures.length - 1, progressRef.current || 0));

      figures.forEach((fig, i) => {
        const d = Math.abs(p - i);
        const k = Math.max(0, 1 - d * 1.6); // fade band around each act
        fig.visible = k > 0.02;
        if (!fig.visible) return;
        setOpacity(fig, k);
        const s = 0.72 + k * 0.34;
        fig.scale.setScalar(s);
        // figures hand off with a quarter-turn as they trade places
        fig.rotation.y = (p - i) * 0.9;
        fig.userData.tick?.(t);
      });

      scene.rotation.x += (ptr.y * 0.22 - scene.rotation.x) * f;
      scene.rotation.y += (ptr.x * 0.28 - scene.rotation.y) * f * 0.4;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      figures.forEach((fig) =>
        fig.traverse((o) => {
          o.geometry?.dispose();
          o.material?.dispose();
        })
      );
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [progressRef]);

  return <div className="fam3d" ref={mountRef} aria-hidden="true" />;
}
