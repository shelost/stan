import { useEffect } from 'react';
import gsap from 'gsap';

// Pointer parallax shared by every phone on the page: the body tilts in 3D
// while the artwork figure and the gloss highlight lag behind it, which is
// what sells the depth. `inner` selects the element that actually rotates;
// the host element only provides the perspective and the pointer bounds.
export default function usePointerTilt(
  ref,
  { inner, tiltX = 12, tiltY = 14, shiftX = 8, shiftY = 6 } = {},
  deps = [],
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const body = inner ? el.querySelector(inner) : el;
    const art = el.querySelector('.art');
    const figure = el.querySelector('.art__figure');
    if (!body || !art || !figure) return;

    const rotateX = gsap.quickTo(body, 'rotationX', { duration: 0.55, ease: 'power3.out' });
    const rotateY = gsap.quickTo(body, 'rotationY', { duration: 0.55, ease: 'power3.out' });
    const driftX = gsap.quickTo(figure, 'x', { duration: 0.7, ease: 'power3.out' });
    const driftY = gsap.quickTo(figure, 'y', { duration: 0.7, ease: 'power3.out' });

    const move = (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      rotateX(-py * tiltX);
      rotateY(px * tiltY);
      driftX(px * shiftX);
      driftY(py * shiftY);
      art.style.setProperty('--mx', `${(px + 0.5) * 100}%`);
      art.style.setProperty('--my', `${(py + 0.5) * 100}%`);
    };

    const reset = () => {
      rotateX(0);
      rotateY(0);
      driftX(0);
      driftY(0);
      art.style.setProperty('--mx', '50%');
      art.style.setProperty('--my', '0%');
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);

    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', reset);
      gsap.killTweensOf([body, figure]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
