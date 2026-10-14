/**
 * 클라이언트 로그인 상태 저장소.
 * 레이아웃의 Suspense 안에서 서버가 쿠키를 읽어 hydrate 하고, 로그인/로그아웃 시 갱신한다.
 * (페이지 전체를 쿠키 읽기에 묶지 않기 위해 Context 대신 외부 저장소를 사용)
 */
import { useSyncExternalStore } from "react";

export interface ClientAccount {
  loginId: string;
  userId: string;
  label: string;
}

export interface SessionState {
  status: "loading" | "ready";
  account: ClientAccount | null;
}

const LOADING: SessionState = { status: "loading", account: null };
let state: SessionState = LOADING;
const listeners = new Set<() => void>();

export function setSession(account: ClientAccount | null) {
  state = { status: "ready", account };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSession(): SessionState {
  return useSyncExternalStore(subscribe, () => state, () => LOADING);
}
