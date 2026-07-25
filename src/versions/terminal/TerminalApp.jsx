import { useEffect, useMemo, useRef, useState } from 'react';
import { editions } from '../../data/editions';
import VersionSwitcher from '../../shared/VersionSwitcher';

const PROMPT = 'stan@standard ~ %';
const num = (i) => String(i + 1).padStart(2, '0');

const HELP = [
  ['ls', 'list every edition'],
  ['show <name>', 'read one edition in full'],
  ['latest', 'jump to the newest quarter'],
  ['open <name>', 'open the edition on stan.store'],
  ['clear', 'clear the screen'],
];

function slug(e) {
  return e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function run(input) {
  const raw = input.trim();
  if (!raw) return [];
  const [cmd, ...args] = raw.split(/\s+/);
  const arg = args.join(' ').toLowerCase();
  const find = () =>
    editions.find((e) => slug(e) === arg || e.name.toLowerCase() === arg || slug(e).startsWith(arg));

  switch (cmd.toLowerCase()) {
    case 'help':
      return [
        { kind: 'label', text: 'Available commands' },
        ...HELP.map(([c, d]) => ({ kind: 'kv', key: c, val: d })),
      ];
    case 'ls':
      return [
        { kind: 'label', text: `${editions.length} editions` },
        ...editions.map((e, i) => ({
          kind: 'row',
          num: num(i),
          name: e.name,
          quarter: `${e.quarter} ${e.year}`,
          tag: e.isNew ? 'new' : '',
        })),
      ];
    case 'latest':
    case 'show': {
      const e = cmd.toLowerCase() === 'latest' ? editions[0] : find();
      if (!e) return [{ kind: 'err', text: `no edition matching "${arg}" — try \`ls\`` }];
      return [
        { kind: 'head', text: e.name, meta: `${e.quarter} ${e.year}` },
        { kind: 'text', text: e.blurb },
        ...e.highlights.map((h) => ({ kind: 'bullet', text: h })),
        { kind: 'hint', text: `run \`open ${slug(e)}\` to view it on stan.store` },
      ];
    }
    case 'open': {
      const e = find();
      if (!e) return [{ kind: 'err', text: `no edition matching "${arg}"` }];
      window.open(e.url, '_blank', 'noreferrer');
      return [{ kind: 'ok', text: `opening ${e.name} → ${e.url}` }];
    }
    case 'clear':
      return 'CLEAR';
    default:
      return [{ kind: 'err', text: `command not found: ${cmd} — try \`help\`` }];
  }
}

export default function TerminalApp() {
  const boot = useMemo(
    () => [
      { kind: 'dim', text: 'The Standard — Stan release notes' },
      { kind: 'dim', text: `${editions.length} editions indexed · Q2 2024 → Q2 2026` },
      { kind: 'hint', text: 'type `help` to begin, or click a suggestion below' },
    ],
    []
  );

  const [history, setHistory] = useState([{ cmd: null, out: boot }]);
  const [value, setValue] = useState('');
  const [recall, setRecall] = useState([]);
  const [rIdx, setRIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const submit = (text) => {
    const out = run(text);
    if (out === 'CLEAR') {
      setHistory([]);
    } else {
      setHistory((h) => [...h, { cmd: text, out }]);
    }
    setRecall((r) => [text, ...r]);
    setRIdx(-1);
    setValue('');
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const onKey = (e) => {
    if (e.key === 'Enter') submit(value);
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.min(rIdx + 1, recall.length - 1);
      if (i >= 0) {
        setRIdx(i);
        setValue(recall[i]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = rIdx - 1;
      setRIdx(i);
      setValue(i >= 0 ? recall[i] : '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const m = editions.find((x) => slug(x).startsWith(value.split(/\s+/).pop().toLowerCase()));
      if (m && value.includes(' ')) {
        setValue(`${value.split(/\s+/)[0]} ${slug(m)}`);
      }
    }
  };

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <VersionSwitcher current="terminal" />

      <div className="term__frame">
        <header className="term__bar">
          <span className="term__lights">
            <i />
            <i />
            <i />
          </span>
          <span className="term__title">the-standard — zsh — 96×32</span>
        </header>

        <div className="term__scroll" ref={scrollRef}>
          {history.map((entry, i) => (
            <div className="block" key={i}>
              {entry.cmd != null && (
                <p className="line line--cmd">
                  <span className="prompt">{PROMPT}</span> {entry.cmd}
                </p>
              )}
              {entry.out.map((o, j) => {
                if (o.kind === 'row') {
                  return (
                    <p className="line line--row" key={j}>
                      <span className="col-num">{o.num}</span>
                      <span className="col-name">{o.name}</span>
                      <span className="col-q">{o.quarter}</span>
                      {o.tag && <span className="tag">{o.tag}</span>}
                    </p>
                  );
                }
                if (o.kind === 'kv') {
                  return (
                    <p className="line line--kv" key={j}>
                      <span className="col-cmd">{o.key}</span>
                      <span className="col-desc">{o.val}</span>
                    </p>
                  );
                }
                if (o.kind === 'head') {
                  return (
                    <p className="line line--head" key={j}>
                      {o.text}
                      <span className="line__meta">{o.meta}</span>
                    </p>
                  );
                }
                if (o.kind === 'bullet') {
                  return (
                    <p className="line line--bullet" key={j}>
                      {o.text}
                    </p>
                  );
                }
                return (
                  <p className={`line line--${o.kind}`} key={j}>
                    {o.text}
                  </p>
                );
              })}
            </div>
          ))}

          <p className="line line--input">
            <span className="prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              className="term__input"
              value={value}
              spellCheck="false"
              autoComplete="off"
              autoFocus
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKey}
              aria-label="terminal input"
            />
          </p>
        </div>

        <footer className="term__suggest">
          {['help', 'ls', 'latest', 'show creator-os', 'clear'].map((s) => (
            <button key={s} type="button" onClick={() => submit(s)}>
              {s}
            </button>
          ))}
        </footer>
      </div>
    </div>
  );
}
