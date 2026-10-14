/** 디버그 모드(?ga_debug=1)와 최초 랜딩 UTM 을 sessionStorage 에 보관한다 */

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const debugKey = (site: string) => `${site}_ga_debug`;
const utmKey = (site: string) => `${site}_landing_utm`;

function storage(): Storage | undefined {
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function resolveDebug(site: string): boolean {
  const flag = new URLSearchParams(window.location.search).get("ga_debug");
  const store = storage();
  if (flag === "1") store?.setItem(debugKey(site), "1");
  if (flag === "0") store?.removeItem(debugKey(site));
  return store?.getItem(debugKey(site)) === "1";
}

/** UTM 이 붙은 랜딩이면 기록한다 (세션 중 다시 UTM 으로 들어오면 갱신) */
export function captureLandingUtm(site: string) {
  const query = new URLSearchParams(window.location.search);
  const utm: Utm = {};
  UTM_KEYS.forEach((key) => {
    const value = query.get(key);
    if (value) utm[key] = value;
  });
  if (Object.keys(utm).length > 0) {
    storage()?.setItem(utmKey(site), JSON.stringify({ ...utm, landed_at: new Date().toISOString() }));
  }
}

export function readLandingUtm(site: string): (Utm & { landed_at?: string }) | undefined {
  const raw = storage()?.getItem(utmKey(site));
  return raw ? JSON.parse(raw) : undefined;
}
