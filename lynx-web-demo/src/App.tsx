import './App.css';
import '@lynx-js/web-core/index.css';
import '@lynx-js/web-elements/index.css';
import '@lynx-js/web-core';
import '@lynx-js/web-elements/all';
import { useCallback, useMemo, useRef, useState } from 'react';

const baseUrl = '/bundle';
const entryOptions = [
  { key: 'main', entry: 'main.web.bundle?fullscreen=true' },
  { key: 'index', entry: 'index.web.bundle?fullscreen=true' },
  { key: 'animationsdemo', entry: 'animationsdemo.web.bundle?fullscreen=true' },
  { key: 'bouncescroll', entry: 'bouncescroll.web.bundle?fullscreen=true' },
  { key: 'cssunit', entry: 'cssunit.web.bundle?fullscreen=true' },
  { key: 'darkmode', entry: 'darkmode.web.bundle?fullscreen=true' },
  { key: 'empty', entry: 'empty.web.bundle?fullscreen=true' },
  { key: 'furniture', entry: 'furniture.web.bundle?fullscreen=true' },
  {
    key: 'furnituredetail',
    entry: 'furnituredetail.web.bundle?fullscreen=true',
  },
];

type EntryOption = {
  key: string;
  entry: string;
};

type EntrySwitcherProps = {
  entry: string;
  options: EntryOption[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getInitialPosition = () => {
  const margin = 20;
  const width = 220;
  const height = 72;
  if (typeof window === 'undefined') {
    return { x: margin, y: margin };
  }
  const x = Math.max(margin, window.innerWidth - width - margin);
  const y = Math.max(margin, window.innerHeight - height - margin);
  return { x, y };
};

const EntrySwitcher = ({ entry, options, onChange }: EntrySwitcherProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(getInitialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dockedSide, setDockedSide] = useState<
    'left' | 'right' | 'top' | 'bottom' | null
  >(null);

  const startDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('select')) {
      return;
    }
    const node = containerRef.current;
    if (!node) {
      return;
    }
    node.setPointerCapture(event.pointerId);
    const rect = node.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    draggingRef.current = true;
    setIsDragging(true);
    setDockedSide(null);
  }, []);

  const updateDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) {
        return;
      }
      const node = containerRef.current;
      if (!node) {
        return;
      }
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      const margin = 12;
      const maxX = Math.max(margin, window.innerWidth - width - margin);
      const maxY = Math.max(margin, window.innerHeight - height - margin);
      const nextX = event.clientX - dragOffsetRef.current.x;
      const nextY = event.clientY - dragOffsetRef.current.y;
      setPosition({
        x: clamp(nextX, margin, maxX),
        y: clamp(nextY, margin, maxY),
      });
    },
    [],
  );

  const endDrag = useCallback(() => {
    if (!draggingRef.current) {
      return;
    }
    draggingRef.current = false;
    setIsDragging(false);
    const node = containerRef.current;
    if (!node) {
      return;
    }
    const rect = node.getBoundingClientRect();
    const margin = 12;
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - height - margin);
    const distances = [
      { side: 'left' as const, value: rect.left },
      {
        side: 'right' as const,
        value: window.innerWidth - rect.right,
      },
      { side: 'top' as const, value: rect.top },
      {
        side: 'bottom' as const,
        value: window.innerHeight - rect.bottom,
      },
    ];
    const nearest = distances.reduce((prev, curr) =>
      curr.value < prev.value ? curr : prev,
    );
    if (nearest.value <= 30) {
      if (nearest.side === 'left') {
        setPosition((prev) => ({ x: margin, y: prev.y }));
      }
      if (nearest.side === 'right') {
        setPosition((prev) => ({ x: maxX, y: prev.y }));
      }
      if (nearest.side === 'top') {
        setPosition((prev) => ({ x: prev.x, y: margin }));
      }
      if (nearest.side === 'bottom') {
        setPosition((prev) => ({ x: prev.x, y: maxY }));
      }
      setDockedSide(nearest.side);
    }
  }, []);

  const classes = [
    'entry-switcher',
    isDragging ? 'entry-switcher--dragging' : '',
    dockedSide ? `entry-switcher--docked-${dockedSide}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      className={classes}
      style={{ left: position.x, top: position.y }}
      onPointerDown={startDrag}
      onPointerMove={updateDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <label className="entry-switcher__label" htmlFor="entry-select">
        Entry
      </label>
      <div className="entry-switcher__control">
        <select
          id="entry-select"
          className="entry-switcher__select"
          value={entry}
          onChange={onChange}
          aria-label="Select entry"
        >
          {options.map((item) => (
            <option key={item.key} value={item.key}>
              {item.key}
            </option>
          ))}
        </select>
        <span className="entry-switcher__chevron" aria-hidden="true">
          ▾
        </span>
      </div>
    </div>
  );
};

const App = () => {
  const [entry, setEntry] = useState(entryOptions[0]?.key ?? '');
  const entryUrl = useMemo(() => {
    const selectedEntry = entryOptions.find(
      (item) => item.key === entry,
    )?.entry;
    return selectedEntry ? `${baseUrl}/${selectedEntry}` : '';
  }, [entry]);

  const onEntryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (e.target.value) {
        setEntry(e.target.value);
      }
    },
    [],
  );

  return (
    <div className="content">
      <lynx-view
        key={entryUrl}
        style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}
        url={entryUrl}
      ></lynx-view>
      <EntrySwitcher
        entry={entry}
        options={entryOptions}
        onChange={onEntryChange}
      />
    </div>
  );
};

export default App;
