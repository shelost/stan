import { useEffect, useState } from 'react';
import BookStack from './BookStack';
import DetailPanel from './DetailPanel';
import Drawer from './Drawer';
import { editions } from '../../data/editions';
import VersionSwitcher from '../../shared/VersionSwitcher';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selected = editions.find((e) => e.id === selectedId);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false);
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="press">
      <header className="press__brand">
        <span className="press__coin">$</span>
        <div className="press__lockup">
          <strong>The Standard</strong>
          <em>Everything new, every quarter</em>
        </div>
      </header>

      <VersionSwitcher current="books" />

      <BookStack
        editions={editions}
        selectedId={selectedId}
        onPick={(id) => setSelectedId(id)}
        onOverscroll={() => setDrawerOpen(true)}
      />

      {selected && <DetailPanel edition={selected} onClose={() => setSelectedId(null)} />}

      {!drawerOpen && (
        <p className="press__hint" aria-hidden="true">
          Scroll for every edition ↓
        </p>
      )}

      {drawerOpen && <Drawer editions={editions} onClose={() => setDrawerOpen(false)} />}
    </div>
  );
}
