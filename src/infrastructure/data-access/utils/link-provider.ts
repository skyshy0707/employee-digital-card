const KNOWN_PROVIDERS: ReadonlyArray<readonly [domain: string, provider: string]> = [
  ['github.com', 'GitHub'],
  ['gitlab.com', 'GitLab'],
  ['linkedin.com', 'LinkedIn'],
  ['t.me', 'Telegram'],
  ['habr.com', 'Habr'],
  ['hh.ru', 'HeadHunter'],
];

/** Вычисляет провайдер ссылки по хосту URL. В БД не хранится — считается на лету. */
export function resolveLinkProvider(url: string): string {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return 'Unknown';
  }
  const known = KNOWN_PROVIDERS.find(([domain]) => host === domain || host.endsWith(`.${domain}`));
  return known ? known[1] : host;
}
