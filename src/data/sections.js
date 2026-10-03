const L = (title, org, date, text) => ({ title, org, date, text });
const GEN = { title: 'Title', org: 'Organisation', date: 'Dates', text: 'Details (one point per line)' };

// req = cannot be removed. rec = recommended.
export const DEFS = {
  summary: { icon: '📝', label: 'Summary', desc: 'A 30 to 80 word pitch on who you are and the role you want.', kind: 'text', req: true, ph: 'Final-year MCA student with hands-on experience in...' },
  skills: { icon: '🧠', label: 'Skills', desc: 'Add your hard and soft skills that help you stand out from the crowd today.', kind: 'skills', req: true },
  education: { icon: '🎓', label: 'Education', desc: 'Add your degrees and schools. Include your focus, honors, or exchange terms.', kind: 'list', req: true, f: { title: 'Degree / course', org: 'School / university', date: 'Year', text: 'Focus, CGPA, honors (one per line)' } },
  experience: { icon: '💼', label: 'Professional Experience', desc: 'Add your professional roles and employer history including internships.', kind: 'list', rec: true, f: { title: 'Role', org: 'Company', date: 'Dates', text: 'Achievements (one per line, start with a verb)' } },
  projects: { icon: '📂', label: 'Projects', desc: 'Add key projects you participated in and highlight your challenges, role, and impact.', kind: 'list', rec: true, f: { title: 'Project name', org: 'Tech stack / link', date: 'Year', text: 'What you built and the result (one per line)' } },
  certificates: { icon: '📜', label: 'Certificates', desc: 'Add your industry certificates or licences. Include issuer and date earned.', kind: 'list', f: { title: 'Certificate', org: 'Issuer', date: 'Date' } },
  courses: { icon: '📚', label: 'Courses', desc: 'Add online or in-person courses and trainings you joined and completed.', kind: 'list', f: { title: 'Course', org: 'Provider', date: 'Date' } },
  awards: { icon: '🏅', label: 'Awards', desc: 'Add your awards and recognitions from industry, competitions, or academia.', kind: 'list', f: { title: 'Award', org: 'Awarded by', date: 'Date', text: 'Why you won (optional)' } },
  organisations: { icon: '🏛️', label: 'Organisations', desc: 'Add your memberships or volunteering with organisations including your role.', kind: 'list', f: { title: 'Role', org: 'Organisation', date: 'Dates', text: 'What you did (one per line)' } },
  publications: { icon: '📰', label: 'Publications', desc: 'Add publications, articles, or books you wrote or contributed to.', kind: 'list', f: { title: 'Title', org: 'Journal / publisher', date: 'Date', text: 'Short note or link' } },
  references: { icon: '🤝', label: 'References', desc: 'Add your references from managers or coworkers, including their contact details.', kind: 'list', f: { title: 'Name', org: 'Designation, company', text: 'Email or phone' } },
  achievements: { icon: '🏆', label: 'Achievements', desc: 'Add wins and milestones that do not fit anywhere else.', kind: 'list', f: { title: 'Achievement', org: 'Where', date: 'Date', text: 'Details (one per line)' } },
  languages: { icon: '🌐', label: 'Languages', desc: 'Add your languages and proficiency level to show your communication range.', kind: 'list', inline: true, f: { title: 'Language', date: 'Level (e.g. Fluent)' } },
  interests: { icon: '🎸', label: 'Interests', desc: 'Add relevant personal interests that support your career story and cultural fit.', kind: 'text', ph: 'Open source, chess, photography' },
  custom: { icon: '🧩', label: 'Custom', desc: 'Add a custom section for anything else, or combine sections cleanly.', kind: 'list', f: GEN },
};

export const SKILL_GROUPS = {
  tech: ['Frontend', 'Backend', 'Programming Languages', 'Databases', 'Tools & DevOps', 'Hardware & IoT'],
  commerce: ['Accounting & Finance Tools', 'Data & Analytics', 'Business Skills', 'Soft Skills'],
  media: ['Writing & Editing', 'Software & Tools', 'Digital & Social', 'Soft Skills'],
};

export const AUDIENCES = {
  tech: { name: 'Tech / Engineering', order: ['summary', 'skills', 'experience', 'projects', 'education', 'certificates'] },
  commerce: { name: 'BCom / BBA / MBA', order: ['summary', 'education', 'experience', 'skills', 'projects', 'certificates', 'achievements'] },
  media: { name: 'BJMC / Media', order: ['summary', 'experience', 'projects', 'skills', 'education', 'certificates'] },
};

export const uid = () => Math.random().toString(36).slice(2, 9);
export const blankItem = () => L('', '', '', '');

export function newSection(type, audience = 'tech') {
  const d = DEFS[type];
  const s = { id: uid(), type, title: d.label };
  if (d.kind === 'text') s.text = '';
  else if (d.kind === 'skills') s.groups = SKILL_GROUPS[audience].map((label) => ({ label, items: '', key: false }));
  else s.items = [blankItem()];
  return s;
}

export const emptyProfile = { name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '' };
export const makePreset = (audience) => AUDIENCES[audience].order.map((t) => newSection(t, audience));

export function makeSample() {
  const secs = makePreset('tech');
  const get = (t) => secs.find((s) => s.type === t);
  get('summary').text = 'Final-year computer science student who builds responsive web applications with React and Node.js, and small hardware projects with Arduino. Completed a web development internship and shipped three projects with real users. Comfortable working in a team, learning new tools quickly and explaining technical ideas clearly.';
  const g = get('skills').groups;
  g[0].items = 'HTML, CSS, JavaScript, React JS, Tailwind CSS'; g[0].key = true;
  g[1].items = 'Node.js, Express, REST APIs';
  g[2].items = 'JavaScript, Python, C, SQL';
  g[3].items = 'MySQL, MongoDB';
  g[4].items = 'Git, GitHub, VS Code, Postman';
  g[5].items = 'Arduino, ESP32, Sensors, Bluetooth modules'; g[5].key = true;
  get('experience').items = [L('Web Development Intern', 'XYZ Technologies', 'Jun 2025 - Aug 2025', 'Built 6 responsive pages in React that cut page load time by 25%\nIntegrated 4 REST APIs and fixed 20+ UI bugs reported by testers\nCollaborated with a team of 5 developers using Git and weekly code reviews')];
  get('projects').items = [
    L('Task Manager App', 'React, Node.js, MongoDB', '2025', 'Developed a full stack task app with login, filters and reminders used by 50+ classmates\nDeployed the app on a free cloud host with automatic builds'),
    L('Smart Plant Monitor', 'Arduino, Soil sensor, LCD', '2025', 'Designed a low-cost system that reads soil moisture and shows live status on an LCD\nReduced manual watering checks by 60% during a 2 week trial'),
  ];
  get('education').items = [L('Bachelor of Technology in Computer Science', 'ABC University', '2026', 'CGPA: 8.0 / 10')];
  return { profile: { name: 'Aarav Sharma', title: 'Full Stack Web Developer', email: 'aarav.sharma@example.com', phone: '+91 90000 00000', location: 'Your City, India', linkedin: 'linkedin.com/in/aarav-sharma', github: 'github.com/aarav-sharma' }, jd: '', audience: 'tech', sections: secs };
}
