import { isEnvBrowser } from './misc';

export async function fetchNui<T = any>(eventName: string, data?: any): Promise<T | null> {
  if (isEnvBrowser()) return null;

  const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : 'nui-frame-app';

  const resp = await fetch(`https://${resourceName}/${eventName}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data ?? {}),
  });

  try {
    return (await resp.json()) as T;
  } catch {
    return null;
  }
}
