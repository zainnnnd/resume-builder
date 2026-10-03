import { useState } from 'react';
import SectionCard from './SectionCard';
import { AUDIENCES } from '../data/sections';

export default function Form({ data, set, onAdd, onRemove, onAudience }) {
  const [dragFrom, setDragFrom] = useState(null);
  const [over, setOver] = useState(null);
  const p = data.profile;
  const up = (k) => (e) => set({ ...data, profile: { ...p, [k]: e.target.value } });

  const move = (from, to) => {
    if (from === null || from === to || to < 0 || to >= data.sections.length) return;
    const next = [...data.sections];
    next.splice(to, 0, next.splice(from, 1)[0]);
    set({ ...data, sections: next });
  };
  const drag = {
    over, setOver, start: setDragFrom,
    end: () => { setDragFrom(null); setOver(null); },
    drop: (to) => { move(dragFrom, to); setDragFrom(null); setOver(null); },
  };
  const change = (s) => set({ ...data, sections: data.sections.map((x) => (x.id === s.id ? s : x)) });
  const inp = (label, k, ph) => <label className="f"><span>{label}</span><input value={p[k]} placeholder={ph} onChange={up(k)} /></label>;

  return (
    <div className="form">
      <h3>I am building this resume for</h3>
      <div className="aud">
        {Object.entries(AUDIENCES).map(([id, a]) => (
          <button key={id} className={data.audience === id ? 'on' : ''} onClick={() => onAudience(id)}>{a.name}</button>
        ))}
      </div>

      <h3>Contact</h3>
      <div className="grid2">
        {inp('Full name', 'name', 'Your full name')}
        {inp('Headline', 'title', 'e.g. Frontend Developer')}
        {inp('Email', 'email', 'name@email.com')}
        {inp('Phone', 'phone', '+91 99999 99999')}
        {inp('Location', 'location', 'City, Country')}
        {inp('LinkedIn', 'linkedin', 'linkedin.com/in/you')}
        {inp('GitHub / portfolio', 'github', 'github.com/you')}
      </div>

      <h3>Sections</h3>
      <p className="hint">Tap a section to edit it. Drag the handle, or use the arrows, to change the order on your resume.</p>
      {data.sections.map((s, i) => (
        <SectionCard key={s.id} s={s} index={i} count={data.sections.length} onChange={change} onMove={move} onRemove={onRemove} drag={drag} />
      ))}
      <button className="primary wide" onClick={onAdd}>Add section</button>

      <h3>Target job description</h3>
      <label className="f"><span>Paste it to check keyword match (optional)</span>
        <textarea rows="5" value={data.jd} onChange={(e) => set({ ...data, jd: e.target.value })} />
      </label>
    </div>
  );
}
