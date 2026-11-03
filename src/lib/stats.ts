import type { JobApplication } from "./types";

export interface Stats {
  appliedToday: number;
  appliedThisWeek: number;
  appliedThisMonth: number;
  appliedThisYear: number;
  active: number;
  responseRate: number | null;
  interviewRate: number | null;
  offers: number;
  offerRate: number | null;
  rejectionRate: number | null;
  avgDaysToRejection: number | null;
  fastestRejection: number | null;
  slowestRejection: number | null;
}

const Status = {
  APPLIED: "APPLIED",
  PHONE_SCREEN: "PHONE_SCREEN",
  INTERVIEW: "INTERVIEW",
  OFFER: "OFFER",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;

const MS_PER_DAY = 86_400_000;

const toIsoDate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const days = (from: string, to: string): number => {
  return Math.round((Date.parse(to) - Date.parse(from)) / MS_PER_DAY);
};

const rate = (count: number, total: number): number | null => {
  return total === 0 ? null : Math.round((count / total) * 1000) / 10;
};

const countWhere = (
  applications: JobApplication[],
  predicate: (app: JobApplication) => boolean,
): number => {
  return applications.filter(predicate).length;
};

const isActive = (app: JobApplication): boolean =>
  app.status === Status.APPLIED ||
  app.status === Status.PHONE_SCREEN ||
  app.status === Status.INTERVIEW;

const hasResponse = (app: JobApplication): boolean =>
  app.status !== Status.APPLIED && app.status !== Status.WITHDRAWN;

const reachedInterview = (app: JobApplication): boolean =>
  app.status === Status.INTERVIEW || app.status === Status.OFFER;

const isOffer = (app: JobApplication): boolean => app.status === Status.OFFER;

const isRejected = (app: JobApplication): boolean =>
  app.status === Status.REJECTED;

const countSince = (
  applications: JobApplication[],
  since: Date,
  now: Date,
): number => {
  const start = toIsoDate(since);
  const end = toIsoDate(now);

  return countWhere(
    applications,
    (app) =>
      !!app.dateApplied && app.dateApplied >= start && app.dateApplied <= end,
  );
};

const rejectionDurations = (applications: JobApplication[]): number[] => {
  return applications
    .filter((app) => isRejected(app) && app.dateApplied && app.dateRejected)
    .map((app) => days(app.dateApplied!, app.dateRejected!))
    .filter((d) => d >= 0);
};

const average = (values: number[]): number | null => {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
};

export const computeStats = (applications: JobApplication[]): Stats => {
  const now = new Date();

  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - ((now.getDay() + 6) % 7),
  );
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const total = applications.length;
  const offers = countWhere(applications, isOffer);
  const durations = rejectionDurations(applications);

  return {
    appliedToday: countSince(applications, dayStart, now),
    appliedThisWeek: countSince(applications, weekStart, now),
    appliedThisMonth: countSince(applications, monthStart, now),
    appliedThisYear: countSince(applications, yearStart, now),
    active: countWhere(applications, isActive),
    responseRate: rate(countWhere(applications, hasResponse), total),
    interviewRate: rate(countWhere(applications, reachedInterview), total),
    offers,
    offerRate: rate(offers, total),
    rejectionRate: rate(countWhere(applications, isRejected), total),
    avgDaysToRejection: average(durations),
    fastestRejection: durations.length ? Math.min(...durations) : null,
    slowestRejection: durations.length ? Math.max(...durations) : null,
  };
};
