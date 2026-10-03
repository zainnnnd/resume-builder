import { useEffect, useRef, useState } from 'react';
import Resume from './Resume';

const PAPER = 794; // A4 width at 96dpi

export default function Preview({ data, template }) {
  const wrap = useRef(null);
  const paper = useRef(null);
  const [scale, setScale] = useState(1);
  const [h, setH] = useState(1123);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const measure = () => {
      if (!wrap.current || !paper.current) return;
      const s = Math.min(1, wrap.current.clientWidth / PAPER);
      setScale(s);
      setH(paper.current.offsetHeight * s);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(wrap.current);
    ro.observe(paper.current);
    measure();
    return () => ro.disconnect();
  }, []);

  const move = (e) => {
    const r = wrap.current.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 8, y: ((e.clientY - r.top) / r.height - 0.5) * -6 });
  };

  return (
    <div className="stage" ref={wrap} onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="tilt" style={{ transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`, height: h }}>
        <div className="scaler" ref={paper} style={{ transform: `scale(${scale})`, width: PAPER }}>
          <Resume data={data} template={template} />
        </div>
      </div>
    </div>
  );
}
