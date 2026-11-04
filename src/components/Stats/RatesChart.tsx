import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Stats } from "@/lib/stats";

const chartConfig = {
  rate: { label: "Rate", color: "var(--chart-3)" },
} satisfies ChartConfig;

interface RatesChartProps {
  stats: Stats;
}

export const RatesChart = ({ stats }: RatesChartProps) => {
  const data = [
    { label: "Response", rate: stats.responseRate ?? 0 },
    { label: "Interview", rate: stats.interviewRate ?? 0 },
    { label: "Offer", rate: stats.offerRate ?? 0 },
    { label: "Rejection", rate: stats.rejectionRate ?? 0 },
  ];

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-56 w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 8, right: 48 }}
        barCategoryGap={10}
      >
        <XAxis type="number" dataKey="rate" domain={[0, 100]} hide />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel={false}
              formatter={(value) => `${value}%`}
            />
          }
        />
        <Bar dataKey="rate" fill="var(--color-rate)" radius={4}>
          <LabelList
            dataKey="rate"
            position="right"
            className="fill-foreground"
            formatter={(value) => `${value}%`}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};
