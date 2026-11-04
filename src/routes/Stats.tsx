import { useMemo } from "react";
import { useAppData } from "./AppLayout";
import { computeStats } from "@/lib/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/Stats/StatCard";
import { RatesChart } from "@/components/Stats/RatesChart";
import "./Applications.scss";
import "./Stats.scss";

const daysLabel = (value: number | null): string | undefined =>
  value === null ? undefined : value === 1 ? "day" : "days";

export const Stats = () => {
  const { applications } = useAppData();

  const stats = useMemo(() => computeStats(applications), [applications]);

  return (
    <section className="applications_content">
      <div className="applications_header_group">
        <div className="applications_title">
          <h1>Stats</h1>
          <p>{applications.length} applications tracked</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="stats_empty">
          No applications yet. Add one to start seeing stats.
        </div>
      ) : (
        <>
          <div className="stats_section">
            <h2>Activity</h2>
            <div className="stats_grid">
              <StatCard label="Applied today" value={stats.appliedToday} />
              <StatCard label="This week" value={stats.appliedThisWeek} />
              <StatCard label="This month" value={stats.appliedThisMonth} />
              <StatCard label="This year" value={stats.appliedThisYear} />
            </div>
          </div>

          <div className="stats_section">
            <h2>Outcomes</h2>
            <div className="stats_outcomes">
              <Card>
                <CardHeader>
                  <CardTitle>Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <RatesChart stats={stats} />
                </CardContent>
              </Card>
              <div className="stats_outcomes_side">
                <StatCard
                  label="Active applications"
                  value={stats.active}
                  hint="Applied, phone screen or interview"
                />
                <StatCard label="Offers" value={stats.offers} />
              </div>
            </div>
          </div>

          <div className="stats_section">
            <h2>Time to rejection</h2>
            <div className="stats_grid stats_grid_three">
              <StatCard
                label="Average"
                value={stats.avgDaysToRejection}
                hint={daysLabel(stats.avgDaysToRejection)}
              />
              <StatCard
                label="Fastest"
                value={stats.fastestRejection}
                hint={daysLabel(stats.fastestRejection)}
              />
              <StatCard
                label="Slowest"
                value={stats.slowestRejection}
                hint={daysLabel(stats.slowestRejection)}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};
