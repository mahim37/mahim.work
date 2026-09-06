export const site = {
  name: 'Mahim Gupta',
  url: 'https://mahim.work',
  description:
    'Backend engineer shipping LLM-integrated production systems. Django REST, LLM agents, cloud migrations, Rust.',
  email: 'mahim.g03@gmail.com',
  github: 'https://github.com/mahim37',
  linkedin: 'https://www.linkedin.com/in/mahim-gupta73',
  repo: 'https://github.com/mahim37/mahim.work',
};

export type Link = { label: string; href: string };

const month = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const short = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

/** "September 2026" */
export const fmtMonth = (d: Date) => month.format(d);
/** "Sep 2026" */
export const fmtShort = (d: Date) => short.format(d);
/** "2026-09-06", for <time datetime> */
export const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** Collection filter. Drafts show in dev, or when the build runs with SHOW_DRAFTS=1 (preview deploys). */
const showDrafts = import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === '1';
export const published = (e: { data: { draft: boolean } }) => showDrafts || !e.data.draft;

export function entryLinks(d: { repo?: string; demo?: string; paper?: string }): Link[] {
  const out: Link[] = [];
  if (d.repo) out.push({ label: 'Source', href: d.repo });
  if (d.demo) out.push({ label: 'Live demo', href: d.demo });
  if (d.paper) out.push({ label: 'Paper', href: d.paper });
  return out;
}
