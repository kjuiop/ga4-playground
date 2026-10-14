/** 디버그 패널용 최근 전송 이벤트 버퍼 */
export interface LoggedEvent {
  id: number;
  name: string;
  params: Record<string, unknown>;
  at: string;
}

const MAX = 10;
let seq = 0;
let events: LoggedEvent[] = [];
const listeners = new Set<() => void>();

export function recordEvent(name: string, params: Record<string, unknown>) {
  events = [
    { id: ++seq, name, params, at: new Date().toLocaleTimeString("ko-KR") },
    ...events,
  ].slice(0, MAX);
  listeners.forEach((listener) => listener());
}

export function subscribeEvents(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getEvents = () => events;
export const getServerEvents = (): LoggedEvent[] => [];
