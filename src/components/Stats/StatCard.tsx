import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: number | null;
  suffix?: string;
  hint?: string;
}

export const StatCard = ({ label, value, suffix = "", hint }: StatCardProps) => {
  return (
    <Card size="sm" className="stat_card">
      <CardContent>
        <p className="stat_card_label">{label}</p>
        <p className="stat_card_value">
          {value === null ? "—" : `${value}${suffix}`}
        </p>
        {hint && <p className="stat_card_hint">{hint}</p>}
      </CardContent>
    </Card>
  );
};
