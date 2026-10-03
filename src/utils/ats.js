const VERBS = ['built','developed','designed','led','created','improved','implemented','managed','reduced','increased','launched','optimized','delivered','automated','taught','trained','analyzed','analysed','deployed','integrated','collaborated','achieved','organized','organised','conducted','established','engineered','mentored','published','researched','coordinated','streamlined','wrote','edited','produced','reported','supported','maintained','tested','migrated','executed','generated','presented','drove','handled','prepared','audited','reconciled','promoted'];
const STOP = new Set('with that this from have will your our their they them been being were able also such more than into about over need must should work working team role years year experience skills ability strong good including etc and the for are you'.split(' '));

export const splitList = (s = '') => s.split(/[,\n]/).map((x) => x.trim()).filter(Boolean);
export const toLines = (s = '') => s.split('\n').map((x) => x.replace(/^[-•*\s]+/, '').trim()).filter(Boolean);
const wc = (s = '') => (s.trim().match(/\S+/g) || []).length;
const clamp = (n) => Math.max(0, Math.min(1, n));

export function resumeText(d) {
  return [d.profile.title, ...d.sections.flatMap((s) => [s.title, s.text,
    ...(s.groups || []).flatMap((g) => [g.label, g.items]),
    ...(s.items || []).flatMap((i) => [i.title, i.org, i.text])])].join(' ').toLowerCase();
}

export function jdKeywords(jd = '') {
  const freq = {};
  (jd.toLowerCase().match(/[a-z][a-z+#.]{2,}/g) || []).forEach((w) => { if (!STOP.has(w)) freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([w]) => w);
}

export function analyze(d) {
  const p = d.profile;
  const of = (...t) => d.sections.filter((s) => t.includes(s.type));
  const summary = of('summary').map((s) => s.text).join(' ');
  const groups = of('skills').flatMap((s) => s.groups);
  const skillCount = groups.flatMap((g) => splitList(g.items)).length;
  const filledGroups = groups.filter((g) => splitList(g.items).length).length;
  const work = of('experience', 'projects', 'organisations').flatMap((s) => s.items).filter((i) => i.title.trim());
  const mainWork = of('experience', 'projects').flatMap((s) => s.items).filter((i) => i.title.trim());
  const bullets = work.flatMap((i) => toLines(i.text));
  const verbFrac = bullets.length ? bullets.filter((b) => VERBS.includes(b.split(' ')[0].toLowerCase())).length / bullets.length : 0;
  const numFrac = bullets.length ? bullets.filter((b) => /\d/.test(b)).length / bullets.length : 0;
  const sw = wc(summary);
  const edu = of('education').flatMap((s) => s.items).some((i) => i.title.trim() && i.org.trim());

  const checks = [
    { w: 5, f: p.name.trim() ? 1 : 0, tip: 'Add your full name.' },
    { w: 8, f: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email.trim()) ? 1 : 0, tip: 'Add a valid email address (name@domain.com).' },
    { w: 6, f: p.phone.replace(/\D/g, '').length >= 10 ? 1 : 0, tip: 'Add a phone number with at least 10 digits.' },
    { w: 4, f: p.linkedin.trim() ? 1 : 0, tip: 'Add your LinkedIn or portfolio link.' },
    { w: 4, f: p.title.trim() ? 1 : 0, tip: 'Add a headline that matches the role you want.' },
    { w: 10, f: sw === 0 ? 0 : sw >= 30 && sw <= 80 ? 1 : 0.5, tip: sw === 0 ? 'Write a 30 to 80 word summary.' : 'Keep your summary between 30 and 80 words.' },
    { w: 10, f: clamp(skillCount / 8), tip: 'List at least 8 skills in total.' },
    { w: 4, f: clamp(filledGroups / 3), tip: 'Fill at least 3 skill groups so recruiters can scan them quickly.' },
    { w: 7, f: edu ? 1 : 0, tip: 'Add your degree and institution in Education.' },
    { w: 12, f: mainWork.length ? 1 : 0, tip: 'Add one experience, internship or project with a title.' },
    { w: 10, f: clamp(bullets.length / Math.max(1, work.length) / 2), tip: 'Write at least 2 bullet points for each experience or project.' },
    { w: 8, f: clamp(verbFrac), tip: 'Start every bullet with an action verb such as Built, Led, Analysed, Edited.' },
    { w: 8, f: clamp(numFrac / 0.5), tip: 'Add numbers to at least half your bullets (users, %, revenue, team size).' },
  ];

  if (d.audience === 'tech') checks.push({ w: 3, f: p.github.trim() ? 1 : 0, tip: 'Add your GitHub profile link so recruiters can see your code.' });

  let missing = [];
  const kws = jdKeywords(d.jd);
  if (kws.length) {
    const text = resumeText(d);
    missing = kws.filter((k) => !text.includes(k));
    checks.push({ w: 15, f: (kws.length - missing.length) / kws.length, tip: `Add these job description keywords where true: ${missing.slice(0, 8).join(', ')}.` });
  }
  const total = checks.reduce((a, c) => a + c.w, 0);
  const earned = checks.reduce((a, c) => a + c.w * c.f, 0);
  const tips = checks.filter((c) => c.f < 1).sort((a, b) => b.w * (1 - b.f) - a.w * (1 - a.f)).map((c) => c.tip);
  return { score: Math.round((earned / total) * 100), tips, usedJD: kws.length > 0, missing };
}
