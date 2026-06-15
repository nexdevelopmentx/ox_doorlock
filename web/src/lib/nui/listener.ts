/**
 * NUI message listener — registered once at app startup. Components can
 * subscribe by calling onNuiMessage(action, handler) which returns an
 * unsubscribe function (use it inside Svelte's onMount cleanup).
 */
type Handler = (data: any) => void;

const listeners: Map<string, Set<Handler>> = new Map();

export function onNuiMessage(action: string, handler: Handler): () => void {
  let set = listeners.get(action);
  if (!set) {
    set = new Set();
    listeners.set(action, set);
  }
  set.add(handler);
  return () => {
    set!.delete(handler);
  };
}

export function initNuiListener() {
  window.addEventListener('message', (event: MessageEvent) => {
    const payload = event.data as { action?: string; data?: any };
    if (!payload || typeof payload.action !== 'string') return;
    const set = listeners.get(payload.action);
    if (!set) return;
    set.forEach((h) => {
      try {
        h(payload.data);
      } catch (err) {
        console.error('[ox_doorlock] NUI handler error', payload.action, err);
      }
    });
  });
}
