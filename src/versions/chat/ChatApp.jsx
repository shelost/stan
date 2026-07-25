import { useEffect, useRef, useState } from 'react';
import { editions } from '../../data/editions';
import { toneOf } from '../../data/tones';
import VersionSwitcher from '../../shared/VersionSwitcher';

const CHIPS = [
  'What shipped this quarter?',
  'List every edition',
  'Tell me about Booked',
  'What changed in 2024?',
];

function findEdition(text) {
  const q = text.toLowerCase();
  return editions.find((e) => q.includes(e.name.toLowerCase()));
}

// Small intent matcher — enough to feel like a real assistant without
// pretending to be a language model.
function reply(text) {
  const q = text.toLowerCase().trim();

  const named = findEdition(q);
  if (named) {
    return {
      text: `${named.name} shipped in ${named.quarter} ${named.year}. ${named.blurb}`,
      list: named.highlights,
      card: named,
    };
  }

  if (/(latest|newest|this quarter|what.?s new|recent)/.test(q)) {
    const e = editions[0];
    return {
      text: `The newest edition is ${e.name}, out in ${e.quarter} ${e.year}. ${e.blurb}`,
      list: e.highlights,
      card: e,
    };
  }

  if (/(list|all|every|everything|overview)/.test(q)) {
    return {
      text: `There are ${editions.length} editions so far, from ${
        editions[editions.length - 1].quarter
      } ${editions[editions.length - 1].year} to ${editions[0].quarter} ${editions[0].year}:`,
      list: editions.map((e) => `${e.name} — ${e.quarter} ${e.year}`),
    };
  }

  const year = q.match(/20\d\d/);
  if (year) {
    const hits = editions.filter((e) => e.year === year[0]);
    if (hits.length) {
      return {
        text: `${hits.length} editions shipped in ${year[0]}:`,
        list: hits.map((e) => `${e.name} — ${e.quarter}, ${e.blurb.toLowerCase()}`),
      };
    }
    return { text: `Nothing shipped in ${year[0]} — the record starts in 2024.` };
  }

  if (/(hi|hello|hey|thanks|thank you)/.test(q)) {
    return { text: 'Happy to help. Ask me about any edition, or a year.' };
  }

  return {
    text: "I can look up any edition by name, tell you what's newest, list everything, or filter by year. Try one of the suggestions below.",
  };
}

export default function ChatApp() {
  const [thread, setThread] = useState([
    {
      from: 'stanley',
      text: "I'm Stanley. I keep track of everything Stan has shipped — ask me about any quarter or edition.",
    },
  ]);
  const [value, setValue] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [thread, typing]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const send = (text) => {
    const body = text.trim();
    if (!body) return;
    setThread((t) => [...t, { from: 'you', text: body }]);
    setValue('');
    setTyping(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setTyping(false);
      setThread((t) => [...t, { from: 'stanley', ...reply(body) }]);
    }, 520);
  };

  return (
    <div className="chat">
      <VersionSwitcher current="chat" tone="light" />

      <div className="chat__frame">
        <header className="chat__head">
          <span className="chat__avatar">S</span>
          <span className="chat__who">
            <strong>Stanley</strong>
            <em>Stan’s release assistant</em>
          </span>
        </header>

        <div className="chat__thread">
          {thread.map((m, i) => (
            <div className={`msg msg--${m.from}`} key={i}>
              <p className="msg__bubble">{m.text}</p>

              {m.list && (
                <ul className="msg__list">
                  {m.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}

              {m.card && (
                <a
                  className="msg__card"
                  href={m.card.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ '--tone': toneOf(m.card).base, '--paper': toneOf(m.card).paper }}
                >
                  <span className="msg__mark">{m.card.name.charAt(0)}</span>
                  <span>
                    <strong>{m.card.name}</strong>
                    <em>
                      {m.card.quarter} {m.card.year} · Open in Stan →
                    </em>
                  </span>
                </a>
              )}
            </div>
          ))}

          {typing && (
            <div className="msg msg--stanley">
              <p className="msg__bubble msg__bubble--typing">
                <i />
                <i />
                <i />
              </p>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="chat__chips">
          {CHIPS.map((c) => (
            <button key={c} type="button" onClick={() => send(c)}>
              {c}
            </button>
          ))}
        </div>

        <form
          className="chat__compose"
          onSubmit={(e) => {
            e.preventDefault();
            send(value);
          }}
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask Stanley about an edition…"
            aria-label="Message Stanley"
          />
          <button type="submit" aria-label="Send" disabled={!value.trim()}>
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
