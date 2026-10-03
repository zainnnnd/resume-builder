import { useEffect, useMemo, useState } from 'react';
import Background3D from './components/Background3D';
import Form from './components/Form';
import Preview from './components/Preview';
import AtsPanel from './components/AtsPanel';
import SectionPicker from './components/SectionPicker';
import { analyze } from './utils/ats';
import { makeSample, makePreset, newSection, emptyProfile } from './data/sections';
import { templates } from './data/templates';

const KEY = 'resume-builder-v3';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && Array.isArray(raw.sections) && raw.profile) return { ...raw, profile: { ...emptyProfile, ...raw.profile } };
  } catch (e) { /* ignore corrupted storage */ }
  return makeSample();
}

export default function App() {
  const [data, setData] = useState(load);
  const [template, setTemplate] = useState('classic');
  const [tab, setTab] = useState('edit');
  const [picker, setPicker] = useState(false);
  const result = useMemo(() => analyze(data), [data]);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* storage unavailable */ }
  }, [data]);

  const addSection = (type) => {
    setData({ ...data, sections: [...data.sections, newSection(type, data.audience)] });
    setPicker(false);
  };
  const removeSection = (id) => {
    if (confirm('Remove this section and its content?')) setData({ ...data, sections: data.sections.filter((s) => s.id !== id) });
  };
  const switchAudience = (a) => {
    if (a === data.audience) return;
    if (confirm('Switching resets your sections to a new layout. Contact details are kept. Continue?')) {
      setData({ ...data, audience: a, sections: makePreset(a) });
    }
  };
  const clearAll = () => {
    if (confirm('Clear everything?')) setData({ profile: emptyProfile, jd: '', audience: data.audience, sections: makePreset(data.audience) });
  };
  const download = () => {
    const old = document.title;
    document.title = `${(data.profile.name || 'Resume').replace(/\s+/g, '_')}_Resume`;
    window.print();
    setTimeout(() => { document.title = old; }, 500);
  };

  return (
    <div className={`app show-${tab}`}>
      <Background3D />
      <header className="topbar">
        <h1>ATS Resume Builder</h1>
        <div className="actions">
          <button className="ghost" onClick={clearAll}>Clear</button>
          <button className="primary" onClick={download}>Download PDF</button>
        </div>
      </header>
      <nav className="tabs">
        {[['edit', 'Edit'], ['preview', 'Preview'], ['score', `Score ${result.score}`]].map(([id, label]) => (
          <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>
        ))}
      </nav>
      <main className="main">
        <section className="pane pane-form">
          <Form data={data} set={setData} onAdd={() => setPicker(true)} onRemove={removeSection} onAudience={switchAudience} />
        </section>
        <section className="pane pane-preview">
          <div className="tpl-bar">
            {templates.map((t) => (
              <button key={t.id} className={template === t.id ? 'on' : ''} onClick={() => setTemplate(t.id)} title={t.note}>{t.name}</button>
            ))}
          </div>
          <Preview data={data} template={template} />
        </section>
        <section className="pane pane-ats"><AtsPanel result={result} /></section>
      </main>
      {picker && <SectionPicker sections={data.sections} onPick={addSection} onClose={() => setPicker(false)} />}
    </div>
  );
}
