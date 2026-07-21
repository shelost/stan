import { useState } from 'react';

const TIPS = [
  'New this quarter: I can draft your whole product page from one sentence.',
  'Ask me for a launch checklist — I build it from what your store sells.',
  'I answer your DMs while you sleep, in your voice, with your links.',
  'Try me on pricing: I compare stores like yours and suggest a number.',
];

export default function StanleyChip() {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(0);

  return (
    <div className="stanley">
      <button className="stanley__chip" type="button" onClick={() => setOpen((o) => !o)}>
        ✦ Stanley
      </button>
      {open && (
        <div className="stanley__bubble" role="status">
          <p>{TIPS[tip]}</p>
          <button
            className="stanley__next"
            type="button"
            onClick={() => setTip((t) => (t + 1) % TIPS.length)}
          >
            Next tip →
          </button>
        </div>
      )}
    </div>
  );
}
