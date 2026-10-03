import { useState } from 'react';
import { DEFS, blankItem } from '../data/sections';

function Field({ label, children }) {
  return <label className="f"><span>{label}</span>{children}</label>;
}

export default function SectionCard({ s, index, count, onChange, onMove, onRemove, drag }) {
  const [open, setOpen] = useState(false);
  const d = DEFS[s.type];
  const upItem = (i, k, v) => onChange({ ...s, items: s.items.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });
  const upGroup = (i, k, v) => onChange({ ...s, groups: s.groups.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });

  return (
    <div className={`scard${drag.over === index ? ' over' : ''}`} onDragOver={(e) => { e.preventDefault(); drag.setOver(index); }} onDrop={() => drag.drop(index)}>
      <div className="shead">
        <span className="handle" draggable title="Drag to reorder" aria-label="Drag to reorder"
          onDragStart={(e) => { e.dataTransfer.setDragImage(e.currentTarget.closest('.scard'), 10, 10); drag.start(index); }}
          onDragEnd={drag.end}>⠿</span>
        <button className="stitle" onClick={() => setOpen(!open)} aria-expanded={open}>
          {d.icon} {s.title}{d.req && <em> required</em>}
        </button>
        <button className="mini" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Move up">↑</button>
        <button className="mini" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label="Move down">↓</button>
        {!d.req && <button className="mini del" onClick={() => onRemove(s.id)} aria-label="Remove section">✕</button>}
      </div>

      {open && (
        <div className="sbody">
          {s.type === 'custom' && <Field label="Section name"><input value={s.title} onChange={(e) => onChange({ ...s, title: e.target.value })} /></Field>}

          {d.kind === 'text' && (
            <Field label={s.type === 'summary' ? '30 to 80 words works best' : 'Separate with commas'}>
              <textarea rows={s.type === 'summary' ? 5 : 2} value={s.text} placeholder={d.ph} onChange={(e) => onChange({ ...s, text: e.target.value })} />
            </Field>
          )}

          {d.kind === 'skills' && (
            <>
              {s.groups.map((g, i) => (
                <div className="item" key={i}>
                  <Field label="Group name"><input value={g.label} onChange={(e) => upGroup(i, 'label', e.target.value)} /></Field>
                  <Field label="Skills, separated by commas"><textarea rows="2" value={g.items} onChange={(e) => upGroup(i, 'items', e.target.value)} /></Field>
                  <div className="rowbtn">
                    <label className="chk"><input type="checkbox" checked={g.key} onChange={(e) => upGroup(i, 'key', e.target.checked)} /> Highlight in bold</label>
                    <button className="link" onClick={() => onChange({ ...s, groups: s.groups.filter((_, j) => j !== i) })}>Remove group</button>
                  </div>
                </div>
              ))}
              <button className="ghost" onClick={() => onChange({ ...s, groups: [...s.groups, { label: '', items: '', key: false }] })}>Add skill group</button>
            </>
          )}

          {d.kind === 'list' && (
            <>
              {s.items.map((it, i) => (
                <div className="item" key={i}>
                  <div className="grid2">
                    {['title', 'org', 'date'].filter((k) => d.f[k]).map((k) => (
                      <Field key={k} label={d.f[k]}><input value={it[k]} onChange={(e) => upItem(i, k, e.target.value)} /></Field>
                    ))}
                  </div>
                  {d.f.text && <Field label={d.f.text}><textarea rows="3" value={it.text} onChange={(e) => upItem(i, 'text', e.target.value)} /></Field>}
                  {s.items.length > 1 && <button className="link" onClick={() => onChange({ ...s, items: s.items.filter((_, j) => j !== i) })}>Remove entry</button>}
                </div>
              ))}
              <button className="ghost" onClick={() => onChange({ ...s, items: [...s.items, blankItem()] })}>Add entry</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
