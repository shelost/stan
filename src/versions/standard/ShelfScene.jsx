import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import EditionCard from '../editions/EditionCard';
import ShelfProp from './ShelfProp';
import { editions, isSpotlit } from '../../data/editions';
import { toneOf } from '../../data/tones';
import { resolveShelves } from './shelfLayout';
import { prefersReducedMotion, useMediaQuery } from './helpers';

// The lamp's resting throw: down and a little to the left, across the
// shelves that hang below it. The beam hangs from its top edge, so a
// positive rotation swings the pool of light leftward.
const BASE_AIM = 10;

// Below this the room reflows onto four shorter shelves. Matches the
// `--unit` divisor in _shelfscene.scss, which assumes the compact spans.
const COMPACT_AT = '(max-width: 720px)';

export default function ShelfScene({ active, onSelect }) {
  const compact = useMediaQuery(COMPACT_AT);
  const shelves = useMemo(() => resolveShelves(editions, compact), [compact]);
  const sceneRef = useRef(null);
  const beamRef = useRef(null);

  // The beam is anchored to wherever the lamp actually landed, rather than
  // to a hardcoded percentage, so the light stays attached to the fixture
  // through every breakpoint and every layout edit.
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const beam = beamRef.current;
    if (!scene || !beam) return;

    gsap.set(beam, { xPercent: -50, rotation: BASE_AIM, transformOrigin: '50% 0%' });

    const place = () => {
      const lamp = scene.querySelector('.sprop--lamp');
      if (!lamp) return;
      const bounds = scene.getBoundingClientRect();
      const shade = lamp.getBoundingClientRect();
      const top = shade.top + shade.height * 0.26 - bounds.top;
      beam.style.left = `${shade.left + shade.width * 0.66 - bounds.left}px`;
      beam.style.top = `${top}px`;
      // Stopping the cone at the bottom shelf keeps a purely decorative layer
      // from extending the scrollable area of the stage below it.
      beam.style.height = `${Math.max(bounds.height - top, 0)}px`;
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(scene);

    return () => observer.disconnect();
  }, [compact]);

  // Selecting an edition re-aims the lamp at it. The swing is clamped so the
  // light always still reads as falling from the fixture.
  useEffect(() => {
    const scene = sceneRef.current;
    const beam = beamRef.current;
    if (!scene || !beam) return;

    const lamp = scene.querySelector('.sprop--lamp');
    const target = scene.querySelector('.sitem--active');
    if (!lamp || !target) return;

    const shade = lamp.getBoundingClientRect();
    const seat = target.getBoundingClientRect();
    const originX = shade.left + shade.width * 0.66;
    const originY = shade.top + shade.height * 0.26;
    const dx = seat.left + seat.width / 2 - originX;
    const drop = seat.top + seat.height * 0.45 - originY;
    const reach = beam.offsetHeight || 1;

    // A card on the lamp's own shelf sits level with or above the shade, so
    // there is no sane angle to point at — swinging at it would throw the
    // cone sideways across empty wall. The fixture just rests instead.
    const aim =
      drop < reach * 0.2
        ? BASE_AIM
        : gsap.utils.clamp(-26, 30, (-Math.atan2(dx, drop) * 180) / Math.PI);

    if (prefersReducedMotion()) {
      gsap.set(beam, { rotation: aim });
      return;
    }

    const tween = gsap.to(beam, { rotation: aim, duration: 1, ease: 'power3.out' });
    return () => tween.kill();
  }, [active, compact]);

  return (
    <div className={`sscene${compact ? ' sscene--compact' : ''}`} ref={sceneRef}>
      <span className="sscene__beam" ref={beamRef} aria-hidden="true" />

      {shelves.map((shelf) => (
        <section
          className="sshelf"
          key={shelf.id}
          style={{ '--shift': shelf.shift, '--gap': shelf.gap }}
        >
          <div className="sshelf__items">
            {shelf.items.map((item, position) => {
              const style = { '--nudge': item.nudge ?? 0 };
              if (item.scale) style['--scale'] = item.scale;

              if (item.kind === 'prop') {
                return (
                  <div
                    className={`sitem sitem--${item.depth}`}
                    key={`${shelf.id}-${item.variant}-${position}`}
                    style={style}
                  >
                    <ShelfProp variant={item.variant} />
                  </div>
                );
              }

              // `isNew` is the one edition partnerships wants seen first, so it
              // outranks the other spotlit tiles rather than matching them.
              const hero = Boolean(item.edition.isNew);
              const lit = isSpotlit(item.edition);
              const selected = active === item.index;
              const gear = item.edition.prop ? <ShelfProp variant={item.edition.prop} /> : null;
              const tone = toneOf(item.edition);

              // The hue rides on the item, not just the card, so the pool of
              // lamplight underneath can warm towards the edition's own colour.
              const seatStyle = {
                ...style,
                '--tone': tone.base,
                '--soft': tone.soft,
              };

              return (
                <div
                  className={`sitem sitem--${item.depth}${lit ? ' sitem--lit' : ''}${
                    hero ? ' sitem--hero' : ''
                  }${selected ? ' sitem--active' : ''}`}
                  key={item.edition.id}
                  style={seatStyle}
                >
                  {item.prop === 'left' && gear}

                  <span className="sitem__seat">
                    <span className="sitem__cast" aria-hidden="true" />
                    <span className="sitem__pool" aria-hidden="true" />
                    <EditionCard
                      edition={item.edition}
                      index={item.index}
                      tilt={item.lean}
                      active={selected}
                      onOpen={onSelect}
                    />
                  </span>

                  {item.prop === 'right' && gear}
                </div>
              );
            })}
          </div>

          <div className="sshelf__board">
            <div className="sshelf__top" />
            <div className="sshelf__front" />
            <span className="sshelf__bracket sshelf__bracket--l" aria-hidden="true" />
            <span className="sshelf__bracket sshelf__bracket--r" aria-hidden="true" />
          </div>
        </section>
      ))}
    </div>
  );
}
