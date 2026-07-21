import { useState } from 'react';
import BookStack from './components/BookStack';
import DetailPanel from './components/DetailPanel';
import StanleyChip from './components/StanleyChip';
import { editions } from './data/editions';

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = editions.find((e) => e.id === selectedId);

  return (
    <div className="press">
      <header className="press__brand">
        <span className="press__coin">$</span>
        <div className="press__lockup">
          <strong>Stan Editions</strong>
          <em>Everything new, every quarter</em>
        </div>
      </header>

      <nav className="press__nav">
        <a href="https://stan.store" target="_blank" rel="noreferrer" className="press__link">
          Stan.store
        </a>
        <a href="https://stan.store" target="_blank" rel="noreferrer" className="press__cta">
          Start for free
        </a>
      </nav>

      <BookStack
        editions={editions}
        selectedId={selectedId}
        onPick={(id) => setSelectedId(id)}
      />

      {selected && <DetailPanel edition={selected} onClose={() => setSelectedId(null)} />}

      <StanleyChip />
    </div>
  );
}
