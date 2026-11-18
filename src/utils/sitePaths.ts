const appBasePath = import.meta.env.BASE_URL;

export function getAppPath(path = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (normalizedPath === '/') return appBasePath;

  return `${appBasePath}${normalizedPath.slice(1)}`;
}

export function normalizeAppPath(pathname: string): string {
  const normalizedBasePath = appBasePath.endsWith('/') ? appBasePath : `${appBasePath}/`;
  const appPath = pathname.startsWith(normalizedBasePath)
    ? `/${pathname.slice(normalizedBasePath.length)}`
    : pathname;

  return appPath.replace(/\/+$/, '') || '/';
}
