import { useEffect, useState } from 'react';

export default function AtsPanel({ result }) {
  const { score, tips, usedJD, missing } = result;
  const [shown, setShown] = useState(0);
  useEffect(() => { const t = setTimeout(() => setShown(score), 30); return () => clearTimeout(t); }, [score]);
  const C = 2 * Math.PI * 52;
  const tone = score >= 80 ? 'good' : score >= 60 ? 'mid' : 'low';

  return (
    <div className="ats">
      <div className={`ring ${tone}`}>
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className="track" />
          <circle cx="60" cy="60" r="52" className="bar" strokeDasharray={C} strokeDashoffset={C * (1 - shown / 100)} />
        </svg>
        <strong>{score}</strong>
      </div>
      <p className="verdict">
        {score >= 80 ? 'Strong. This should parse and rank well.' : score >= 60 ? 'Decent. Fix the items below to pass stricter filters.' : 'Needs work. Start with the first suggestion.'}
      </p>
      {!usedJD && <p className="hint">Paste a job description in the form to add a keyword match check.</p>}
      {usedJD && missing.length > 0 && (
        <div className="chips">{missing.map((m) => <span key={m}>{m}</span>)}</div>
      )}
      {tips.length > 0 ? (
        <ol className="tips">{tips.map((t) => <li key={t}>{t}</li>)}</ol>
      ) : (
        <p className="verdict">No suggestions left. Download your PDF.</p>
      )}
    </div>
  );
}
