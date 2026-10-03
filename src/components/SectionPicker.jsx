import { DEFS } from '../data/sections';

export default function SectionPicker({ sections, onPick, onClose }) {
  const have = new Set(sections.map((s) => s.type));
  const types = Object.keys(DEFS).filter((t) => !DEFS[t].req);
  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="Add a section">
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head"><h3>Add a section</h3><button className="ghost" onClick={onClose}>Close</button></div>
        <div className="picker">
          {types.map((t) => {
            const d = DEFS[t];
            const added = t !== 'custom' && have.has(t);
            return (
              <button key={t} className={`pick${added ? ' added' : ''}${t === 'custom' ? ' dashed' : ''}`} disabled={added} onClick={() => onPick(t)}>
                <b>{d.icon} {d.label}{d.rec ? ' (recommended)' : ''}</b>
                <span>{added ? 'Already added' : d.desc}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
