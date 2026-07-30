import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Five figures — one per product — living in a single scene. The act
// progress (0..4) crossfades and spins them so scrolling feels like one
// continuous machine. Each figure is literal: Store is a link-in-bio,
// Stories is a wall of real channel thumbnails, Studio is a timeline
// that edits itself.

// Stan's own channel (@stanforcreators) — thumbnails feature real videos.
const STORY_VIDEOS = [
  '-TEgzZ1A_dE',
  '2_CSXI4Zsts',
  '58T8V2mleS0',
  '6euOhcSlRbo',
  'DyyCXeG4pTk',
  'FVreqZtcY80',
];

function wire(color, opacity = 0.9) {
  return new THREE.LineBasicMaterial({ color, transparent: true, opacity });
}

function roundedShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function roundedOutline(w, h, r, color, opacity = 0.9) {
  const pts = roundedShape(w, h, r).getPoints(40);
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  return new THREE.LineLoop(geo, wire(color, opacity));
}

function solidRounded(w, h, r, color, opacity = 1) {
  const geo = new THREE.ShapeGeometry(roundedShape(w, h, r));
  return new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
  );
}

// ---- act 1 · Stan: coin heart ----
function buildStan() {
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

// ---- act 2 · Stanley: listening swarm ----
function buildStanley() {
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

// ---- act 3 · Store: link-in-bio phone ----
function buildStore() {
  const g = new THREE.Group();

  const phone = roundedOutline(2.3, 4.1, 0.34, '#ffffff', 0.95);
  g.add(phone);

  // avatar + handle
  const avatarPts = new THREE.EllipseCurve(0, 0, 0.34, 0.34).getPoints(48);
  const avatar = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(avatarPts),
    wire('#ffffff', 0.9)
  );
  avatar.position.set(0, 1.42, 0.01);
  const avatarDot = new THREE.Mesh(
    new THREE.CircleGeometry(0.13, 24),
    new THREE.MeshBasicMaterial({ color: '#ffffff' })
  );
  avatarDot.position.copy(avatar.position);
  const handle = solidRounded(0.9, 0.12, 0.06, '#d2ceff', 0.75);
  handle.position.set(0, 0.98, 0.01);
  g.add(avatar, avatarDot, handle);

  // stacked link buttons
  const links = [];
  for (let i = 0; i < 4; i += 1) {
    const y = 0.52 - i * 0.62;
    const outline = roundedOutline(1.78, 0.46, 0.23, '#ffffff', 0.8);
    outline.position.set(0, y, 0.01);
    const label = solidRounded(0.9, 0.09, 0.045, '#ffffff', 0.5);
    label.position.set(-0.18, y, 0.02);
    g.add(outline, label);
    links.push({ y });
  }

  // the hovering "tap" highlight walking down the links
  const hover = solidRounded(1.78, 0.46, 0.23, '#d2ceff', 0.32);
  hover.position.set(0, links[0].y, 0.005);
  const cursor = new THREE.Mesh(
    new THREE.CircleGeometry(0.06, 16),
    new THREE.MeshBasicMaterial({ color: '#ffffff' })
  );
  cursor.position.set(0.72, links[0].y - 0.12, 0.03);
  g.add(hover, cursor);

  g.userData.tick = (t) => {
    const idx = Math.floor(t * 0.8) % 4;
    const target = links[idx].y;
    hover.position.y += (target - hover.position.y) * 0.14;
    cursor.position.y += (target - 0.12 - cursor.position.y) * 0.14;
    const press = Math.max(0, Math.sin((t * 0.8 % 1) * Math.PI));
    hover.material.opacity = 0.16 + press * 0.26;
    g.rotation.y = Math.sin(t * 0.3) * 0.24;
  };
  return g;
}

// ---- act 4 · Stories: wall of real channel thumbnails ----
function buildStories() {
  const g = new THREE.Group();
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');

  const W = 1.62;
  const H = 0.91;
  const cards = [];

  STORY_VIDEOS.forEach((id, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const holder = new THREE.Group();
    holder.position.set((col - 1) * (W + 0.22), (0.5 - row) * (H + 0.26), 0);

    const mat = new THREE.MeshBasicMaterial({ color: '#8b7ef7', transparent: true, opacity: 1 });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
    loader.load(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      mat.color.set('#ffffff');
      mat.map = tex;
      mat.needsUpdate = true;
    });
    const frame = roundedOutline(W + 0.06, H + 0.06, 0.08, '#ffffff', 0.55);

    // play badge
    const badge = new THREE.Group();
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(0.16, 28),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.92 })
    );
    const tri = new THREE.Mesh(
      new THREE.ShapeGeometry(
        (() => {
          const s = new THREE.Shape();
          s.moveTo(-0.045, 0.07);
          s.lineTo(0.075, 0);
          s.lineTo(-0.045, -0.07);
          return s;
        })()
      ),
      new THREE.MeshBasicMaterial({ color: '#6355ff' })
    );
    tri.position.z = 0.001;
    badge.add(disc, tri);
    badge.position.z = 0.02;

    holder.add(plane, frame, badge);
    g.add(holder);
    cards.push({ holder, badge, phase: i * 0.9 });
  });

  g.userData.tick = (t) => {
    const focus = Math.floor(t * 0.55) % cards.length;
    cards.forEach((c, i) => {
      const on = i === focus;
      const s = on ? 1.16 : 1;
      c.holder.scale.x += (s - c.holder.scale.x) * 0.12;
      c.holder.scale.y = c.holder.scale.x;
      c.holder.position.z += ((on ? 0.42 : 0) - c.holder.position.z) * 0.12;
      c.holder.rotation.x = Math.sin(t * 0.8 + c.phase) * 0.03;
      c.badge.scale.setScalar(on ? 1 + Math.sin(t * 3) * 0.08 : 0.72);
      c.badge.children[0].material.opacity = on ? 0.95 : 0.5;
    });
    g.rotation.y = Math.sin(t * 0.22) * 0.18;
  };
  return g;
}

// ---- act 5 · Studio: a timeline that edits itself ----
function buildStudio() {
  const g = new THREE.Group();

  const panel = roundedOutline(4.3, 2.5, 0.2, '#ffffff', 0.9);
  g.add(panel);

  // preview strip along the top
  const preview = solidRounded(3.9, 0.5, 0.08, '#ffffff', 0.14);
  preview.position.set(0, 0.85, 0.01);
  const previewBar = solidRounded(1.1, 0.3, 0.06, '#d2ceff', 0.7);
  previewBar.position.set(-1.3, 0.85, 0.02);
  g.add(preview, previewBar);

  // three tracks
  [-0.05, -0.55, -1.0].forEach((y) => {
    const lane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.9, 0.012),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3 })
    );
    lane.position.set(0, y, 0.005);
    g.add(lane);
  });

  // clips: [track y, xA, wA, xB, wB, tone] — the timeline tightens itself
  const defs = [
    [-0.05, -1.5, 0.9, -1.62, 0.66, '#ffffff'],
    [-0.05, -0.3, 1.2, -1.05, 0.72, '#d2ceff'],
    [-0.05, 1.15, 1.0, -0.28, 0.8, '#ffffff'],
    [-0.55, -1.2, 1.5, -1.32, 1.26, '#d2ceff'],
    [-0.55, 0.7, 1.4, 0.16, 1.7, '#ffffff'],
    [-1.0, -0.7, 0.8, -1.44, 1.02, '#ffffff'],
    [-1.0, 0.9, 1.1, 0.02, 1.86, '#d2ceff'],
  ];
  const clips = defs.map(([y, xA, wA, xB, wB, tone]) => {
    const m = solidRounded(1, 0.34, 0.07, tone, tone === '#ffffff' ? 0.55 : 0.75);
    m.position.set(xA, y, 0.01);
    m.scale.x = wA;
    g.add(m);
    return { m, y, xA, wA, xB, wB };
  });

  // playhead
  const head = new THREE.Mesh(
    new THREE.PlaneGeometry(0.02, 1.5),
    new THREE.MeshBasicMaterial({ color: '#ffffff' })
  );
  head.position.set(-1.9, -0.5, 0.03);
  const cap = new THREE.Mesh(
    new THREE.CircleGeometry(0.06, 4),
    new THREE.MeshBasicMaterial({ color: '#ffffff' })
  );
  cap.rotation.z = Math.PI / 4;
  cap.position.set(-1.9, 0.32, 0.03);
  const flash = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 1.5),
    new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0 })
  );
  flash.position.set(0, -0.5, 0.02);
  g.add(head, cap, flash);

  const smooth = (x) => x * x * (3 - 2 * x);

  g.userData.tick = (t) => {
    const cycle = (t * 0.22) % 1; // one edit pass
    const x = -1.9 + cycle * 3.8;
    head.position.x = x;
    cap.position.x = x;

    // clips tighten from arrangement A to B as the head sweeps past them
    clips.forEach((c) => {
      const local = smooth(Math.max(0, Math.min(1, (x - c.xA) * 2 + 0.5)));
      const k = cycle > 0.96 ? 0 : local; // reset for the next pass
      c.m.position.x = c.xA + (c.xB - c.xA) * k;
      c.m.scale.x = c.wA + (c.wB - c.wA) * k;
    });

    // cut flash as the head crosses centre
    flash.position.x = x;
    flash.material.opacity = Math.max(0, 0.16 - Math.abs(cycle - 0.5) * 1.4);
    previewBar.position.x = -1.3 + cycle * 2.6;
    g.rotation.y = Math.sin(t * 0.26) * 0.2;
  };
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

    // vertical-FOV camera: on portrait screens the wide figures (studio
    // timeline, thumbnail wall) would clip, so scale everything to the
    // visible width instead
    let aspectScale = 1;
    const fit = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      const a = w / h;
      if (!Number.isFinite(a) || a <= 0) return;
      camera.aspect = a;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      aspectScale = Math.min(1, a / 1.15);
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
          o.material.opacity =
            (o.userData.baseOpacity ?? (o.userData.baseOpacity = o.material.opacity)) * k;
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
      const p = Math.max(0, Math.min(figures.length - 1, progressRef.current || 0));

      figures.forEach((fig, i) => {
        const d = Math.abs(p - i);
        const k = Math.max(0, 1 - d * 1.6);
        fig.visible = k > 0.02;
        if (!fig.visible) return;
        setOpacity(fig, k);
        const s = (0.72 + k * 0.34) * aspectScale;
        fig.scale.setScalar(s);
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
          if (o.material) {
            o.material.map?.dispose();
            o.material.dispose();
          }
        })
      );
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [progressRef]);

  return <div className="fam3d" ref={mountRef} aria-hidden="true" />;
}
