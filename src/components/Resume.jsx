import { DEFS } from '../data/sections';
import { splitList, toLines } from '../utils/ats';

function Body({ s }) {
  const def = DEFS[s.type];
  if (def.kind === 'text') return s.text.trim() ? <p>{s.text}</p> : null;
  if (def.kind === 'skills') {
    const gs = s.groups.filter((g) => splitList(g.items).length);
    if (!gs.length) return null;
    return gs.map((g, i) => (
      <p className={`skillline${g.key ? ' key' : ''}`} key={i}>
        {g.label && <b>{g.label}: </b>}<span>{splitList(g.items).join(', ')}</span>
      </p>
    ));
  }
  const items = s.items.filter((i) => i.title.trim() || i.org.trim());
  if (!items.length) return null;
  if (def.inline) return <p>{items.map((i) => (i.date ? `${i.title} (${i.date})` : i.title)).join(', ')}</p>;
  return items.map((i, k) => (
    <div className="entry" key={k}>
      <div className="row"><b>{[i.title, i.org].filter(Boolean).join(', ')}</b><span>{i.date}</span></div>
      {toLines(i.text).length > 0 && <ul>{toLines(i.text).map((b, j) => <li key={j}>{b}</li>)}</ul>}
    </div>
  ));
}

const hasContent = (s) => {
  if (s.text !== undefined) return s.text.trim();
  if (s.groups) return s.groups.some((g) => splitList(g.items).length);
  return s.items.some((i) => i.title.trim() || i.org.trim());
};

export default function Resume({ data, template }) {
  const p = data.profile;
  const contact = [p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean);
  return (
    <div className={`resume r-${template}`}>
      <header>
        <h1>{p.name || 'Your Name'}</h1>
        {p.title && <h2>{p.title}</h2>}
        <p className="contact">{contact.join('  |  ')}</p>
      </header>
      {data.sections.filter(hasContent).map((s) => (
        <section key={s.id}><h3>{s.title}</h3><Body s={s} /></section>
      ))}
    </div>
  );
}
