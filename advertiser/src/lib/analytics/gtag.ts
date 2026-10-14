/**
 * gtag 래퍼. 컴포넌트는 gtag 를 직접 호출하지 않고 이 모듈의 함수만 사용한다.
 *
 * config 호출 전에 들어온 이벤트는 대기열에 모았다가 초기화 후 전송한다.
 * (자식 페이지의 effect 가 레이아웃의 GA 초기화보다 먼저 실행되므로,
 *  대기열이 없으면 첫 이벤트에 user_id 가 빠질 수 있다)
 */
import { recordEvent } from "./event-log";

export type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

interface AnalyticsState {
  status: "pending" | "ready" | "disabled";
  measurementId?: string;
  debug: boolean;
}

const state: AnalyticsState = { status: "pending", debug: false };
const pending: [string, GtagParams][] = [];

function push(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // gtag.js 는 배열이 아닌 arguments 객체 형태를 기대한다
  window.dataLayer.push(toArguments(args));
}

function toArguments(args: unknown[]) {
  const capture = function () {
    // eslint-disable-next-line prefer-rest-params
    return arguments;
  } as (...values: unknown[]) => IArguments;
  return capture(...args);
}

function send(name: string, params: GtagParams) {
  const finalParams = state.debug ? { ...params, debug_mode: true } : params;
  if (state.status === "ready") {
    push("event", name, finalParams);
  } else {
    console.info("[analytics:disabled]", name, finalParams);
  }
  recordEvent(name, finalParams);
}

export interface InitOptions {
  measurementId?: string;
  cookiePrefix: string;
  userId: string | null;
  debug: boolean;
}

/** GA 초기화. config 에 user_id 를 넣어 첫 page_view 부터 user_id 가 실리게 한다. */
export function initAnalytics({ measurementId, cookiePrefix, userId, debug }: InitOptions) {
  if (state.status !== "pending") return;
  state.debug = debug;

  if (measurementId) {
    push("js", new Date());
    push("config", measurementId, {
      cookie_prefix: cookiePrefix,
      ...(userId ? { user_id: userId } : {}),
      ...(debug ? { debug_mode: true } : {}),
    });
    state.status = "ready";
    state.measurementId = measurementId;
  } else {
    state.status = "disabled";
  }
  recordEvent("config", { user_id: userId, cookie_prefix: cookiePrefix });

  pending.splice(0).forEach(([name, params]) => send(name, params));
}

export function trackEvent(name: string, params: GtagParams = {}) {
  if (state.status === "pending") {
    pending.push([name, params]);
    return;
  }
  send(name, params);
}

/** 로그인(값) / 로그아웃(null) 시 user_id 갱신 */
export function setUserId(userId: string | null) {
  if (state.status === "ready") push("set", { user_id: userId });
  recordEvent("set", { user_id: userId });
}

export function getMeasurementId() {
  return state.measurementId;
}

/** gtag('get') 으로 client_id / session_id 조회 */
export function getField(field: "client_id" | "session_id"): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (state.status !== "ready" || !state.measurementId) return resolve(undefined);
    const timer = setTimeout(() => resolve(undefined), 2000);
    push("get", state.measurementId, field, (value: unknown) => {
      clearTimeout(timer);
      resolve(value == null ? undefined : String(value));
    });
  });
}
