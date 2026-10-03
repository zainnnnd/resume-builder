const cubes = [
  { l: '6%', t: '12%', s: 70, d: 22 }, { l: '88%', t: '18%', s: 50, d: 28 },
  { l: '14%', t: '78%', s: 56, d: 25 }, { l: '80%', t: '72%', s: 84, d: 30 },
  { l: '48%', t: '6%', s: 36, d: 20 }, { l: '60%', t: '88%', s: 44, d: 26 },
];

export default function Background3D() {
  return (
    <div className="bg3d" aria-hidden="true">
      {cubes.map((c, i) => (
        <div key={i} className="cube-wrap" style={{ left: c.l, top: c.t, '--s': `${c.s}px`, '--d': `${c.d}s` }}>
          <div className="cube">
            {['f', 'b', 'r', 'l', 't', 'u'].map((k) => <span key={k} className={`face ${k}`} />)}
          </div>
        </div>
      ))}
    </div>
  );
}
