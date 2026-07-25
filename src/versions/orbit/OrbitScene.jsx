import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { toneOf } from '../../data/tones';

function labelSprite(text, dim = false) {
  const w = 320;
  const h = 74;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.font = '500 27px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = dim ? 'rgba(29,27,46,0.4)' : 'rgba(29,27,46,0.92)';
  ctx.fillText(text, w / 2, h / 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export default function OrbitScene({ editions, selected, onSelect }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  stateRef.current.selected = selected;
  stateRef.current.onSelect = onSelect;

  useEffect(() => {
    const mount = mountRef.current;
    const state = stateRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f6f5ff');
    scene.fog = new THREE.Fog('#f6f5ff', 30, 62);

    const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 120);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth || window.innerWidth, mount.clientHeight || window.innerHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight('#ffffff', 2.1));
    const key = new THREE.DirectionalLight('#ffffff', 1.1);
    key.position.set(6, 12, 8);
    scene.add(key);

    const system = new THREE.Group();
    scene.add(system);

    // centre mark
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.44, 32, 32),
      new THREE.MeshStandardMaterial({
        color: '#6355ff',
        roughness: 0.45,
      })
    );
    system.add(core);
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.6, 1.5, 48),
      new THREE.MeshBasicMaterial({
        color: '#6355ff',
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    halo.rotation.x = -Math.PI / 2;
    system.add(halo);

    const planets = [];
    editions.forEach((e, i) => {
      const radius = 2.3 + i * 0.92;
      const tone = toneOf(e);

      // orbit path
      const pts = [];
      for (let a = 0; a <= 64; a += 1) {
        const th = (a / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(th) * radius, 0, Math.sin(th) * radius));
      }
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({
          color: '#1d1b2e',
          transparent: true,
          opacity: 0.12,
        })
      );
      system.add(ring);

      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.3 + (i === 0 ? 0.1 : 0), 28, 28),
        new THREE.MeshStandardMaterial({ color: tone.base, roughness: 0.55, metalness: 0.1 })
      );
      body.userData = { index: i };

      const label = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: labelSprite(e.name, true), depthWrite: false })
      );
      label.scale.set(2.9, 0.67, 1);
      label.position.y = 0.72;

      const holder = new THREE.Group();
      holder.add(body);
      holder.add(label);
      system.add(holder);

      planets.push({
        holder,
        body,
        label,
        ring,
        radius,
        // outer quarters travel slower, like a real orrery
        speed: 0.16 / (0.55 + i * 0.2),
        phase: i * 0.83,
        index: i,
      });
    });

    const camBase = new THREE.Vector3(0, 9.4, 12.6);
    const lookAt = new THREE.Vector3(0, 0, 0);

    const fit = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      const a = w / h;
      if (!Number.isFinite(a) || a <= 0) return;
      camera.aspect = a;
      camera.updateProjectionMatrix();
      // pull back on narrow viewports so the outer ring stays in frame
      const need = 13.4 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / Math.min(a, 1.7);
      camBase.set(0, need * 0.62, need * 0.84);
      renderer.setSize(w, h);
    };
    fit();
    camera.position.copy(camBase);
    camera.lookAt(lookAt);

    const ro = new ResizeObserver(fit);
    ro.observe(mount);
    window.addEventListener('resize', fit);

    const ray = new THREE.Raycaster();
    const ptr = new THREE.Vector2(-5, -5);
    let hover = -1;

    const onMove = (e) => {
      const r = mount.getBoundingClientRect();
      ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    const onClick = () => {
      if (hover >= 0) state.onSelect?.(hover);
    };
    mount.addEventListener('pointermove', onMove);
    mount.addEventListener('click', onClick);

    document.fonts.ready.then(() => {
      planets.forEach((p, i) => {
        p.label.material.map.dispose();
        p.label.material.map = labelSprite(editions[i].name, state.selected !== i);
        p.label.material.needsUpdate = true;
      });
    });

    let raf;
    const clock = new THREE.Clock();
    let lastLabel = -2;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const t = clock.elapsedTime;
      const f = 1 - Math.exp(-4 * dt);
      const sel = state.selected;

      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(planets.map((p) => p.body), false)[0];
      hover = hit ? hit.object.userData.index : -1;
      mount.style.cursor = hover >= 0 ? 'pointer' : 'default';

      planets.forEach((p) => {
        const a = t * p.speed + p.phase;
        p.holder.position.set(Math.cos(a) * p.radius, 0, Math.sin(a) * p.radius);

        const on = sel === p.index;
        const lift = on ? 1 : hover === p.index ? 0.55 : 0;
        p.body.scale.setScalar(
          THREE.MathUtils.lerp(p.body.scale.x, 1 + lift * 0.55, f)
        );
        p.ring.material.opacity = THREE.MathUtils.lerp(
          p.ring.material.opacity,
          on ? 0.42 : 0.12,
          f
        );
        p.label.material.opacity = THREE.MathUtils.lerp(
          p.label.material.opacity,
          on || hover === p.index ? 1 : 0.55,
          f
        );
      });

      // redraw the selected label brighter only when the selection changes
      if (sel !== lastLabel) {
        planets.forEach((p, i) => {
          p.label.material.map.dispose();
          p.label.material.map = labelSprite(editions[i].name, sel !== i);
          p.label.material.needsUpdate = true;
        });
        lastLabel = sel;
      }

      core.rotation.y += dt * 0.1;
      system.rotation.y += dt * 0.006;

      camera.position.x += (camBase.x + ptr.x * 0.5 - camera.position.x) * f;
      camera.position.y += (camBase.y - ptr.y * 0.3 - camera.position.y) * f;
      camera.position.z += (camBase.z - camera.position.z) * f;
      camera.lookAt(lookAt);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', fit);
      mount.removeEventListener('pointermove', onMove);
      mount.removeEventListener('click', onClick);
      planets.forEach((p) => {
        p.body.geometry.dispose();
        p.body.material.dispose();
        p.label.material.map?.dispose();
        p.label.material.dispose();
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editions]);

  return <div className="orb__stage" ref={mountRef} />;
}
