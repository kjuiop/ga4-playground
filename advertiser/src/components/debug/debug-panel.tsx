"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getEvents, getServerEvents, subscribeEvents } from "@/lib/analytics/event-log";
import { getField, getMeasurementId } from "@/lib/analytics/gtag";
import { readLandingUtm } from "@/lib/analytics/landing";
import { useSession } from "@/lib/auth/session-store";

interface GaIds {
  measurementId?: string;
  clientId?: string;
  sessionId?: string;
}

/**
 * README 결과표에 기록할 값(client_id, user_id, 랜딩 UTM)을 확인하는 패널.
 * 실제 사이트처럼 보이도록 기본은 접힌 상태 (?panel=1 이면 펼침).
 */
const noopSubscribe = () => () => {};
const readPanelFlag = () => new URLSearchParams(window.location.search).get("panel") === "1";

export function DebugPanel({ site }: { site: string }) {
  const panelFlag = useSyncExternalStore(noopSubscribe, readPanelFlag, () => false);
  const [toggled, setToggled] = useState<boolean | null>(null);
  const open = toggled ?? panelFlag;
  const setOpen = setToggled;

  const [ids, setIds] = useState<GaIds>({});
  const [utm, setUtm] = useState<ReturnType<typeof readLandingUtm>>();
  const { account } = useSession();
  const events = useSyncExternalStore(subscribeEvents, getEvents, getServerEvents);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    Promise.all([getField("client_id"), getField("session_id")]).then(([clientId, sessionId]) => {
      if (cancelled) return;
      setIds({ measurementId: getMeasurementId(), clientId, sessionId });
      setUtm(readLandingUtm(site));
    });
    return () => {
      cancelled = true;
    };
  }, [open, site, events]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="디버그 패널 열기"
        className="fixed bottom-3 right-3 z-50 h-7 w-7 rounded-full bg-neutral-900/20 text-[10px] text-white hover:bg-neutral-900/70"
      >
        GA
      </button>
    );
  }

  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 max-h-[60vh] overflow-y-auto border-t border-neutral-700 bg-neutral-900 p-4 font-mono text-[11px] text-neutral-100 md:inset-x-auto md:right-3 md:bottom-3 md:w-[420px] md:rounded">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-semibold text-emerald-400">GA4 Debug · /{site}</span>
        <button type="button" onClick={() => setOpen(false)} className="text-neutral-400 hover:text-white">
          닫기
        </button>
      </div>

      <dl className="grid grid-cols-[110px_1fr] gap-x-2 gap-y-1">
        <Field label="measurement_id" value={ids.measurementId ?? "(미설정 · 콘솔 출력)"} />
        <Field label="client_id" value={ids.clientId} />
        <Field label="session_id" value={ids.sessionId} />
        <Field label="user_id" value={account?.userId ?? "(비로그인)"} />
        <Field label="login_id" value={account?.loginId} />
        <Field
          label="landing utm"
          value={utm ? `${utm.utm_source ?? "-"} / ${utm.utm_medium ?? "-"} / ${utm.utm_campaign ?? "-"}` : "(없음)"}
        />
        <Field label="landed_at" value={utm?.landed_at} />
      </dl>

      <p className="mb-1 mt-4 text-neutral-400">최근 이벤트</p>
      <ul className="space-y-1">
        {events.map((event) => (
          <li key={event.id} className="break-all">
            <span className="text-neutral-500">{event.at}</span>{" "}
            <span className="text-amber-300">{event.name}</span>{" "}
            <span className="text-neutral-400">{summarize(event.params)}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <>
      <dt className="text-neutral-400">{label}</dt>
      <dd className="break-all">{value ?? "-"}</dd>
    </>
  );
}

function summarize(params: Record<string, unknown>) {
  const { items, ...rest } = params;
  const text = JSON.stringify(rest);
  return Array.isArray(items) ? `${text} items:${items.length}` : text;
}
