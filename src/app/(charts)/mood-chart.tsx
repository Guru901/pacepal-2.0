import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Loader } from "@/components/loading";
import { moodCharConfig as moodChartConfig } from "@/lib/chart-configs";
import { useMoodData } from "@/hooks/useChartData";

export function MoodChart({ selectedVersion }: { selectedVersion: string }) {
  const [chartData, setChartData] = useState([
    { mood: "happy", freq: 0, fill: "#2662D9" },
    { mood: "tired", freq: 0, fill: "#2EB88A" },
    { mood: "neutral", freq: 0, fill: "#E88C30" },
    { mood: "stressed", freq: 0, fill: "#E23670" },
    { mood: "productive", freq: 0, fill: "#9062cd" },
  ]);

  const { data, isLoading } = useMoodData(selectedVersion);

  useEffect(() => {
    void (async () => {
      try {
        if (data?.success) {
          const moodCounts = {
            happy: 0,
            tired: 0,
            neutral: 0,
            stressed: 0,
            productive: 0,
          };

          data.data.forms.forEach((form: { mood: string }) => {
            const mood = form.mood;
            if (moodCounts.hasOwnProperty(mood)) {
              // @ts-expect-error - TypeScript doesn't recognize the `hasOwnProperty` method
              moodCounts[mood]++;
            }
          });

          setChartData((prevData) =>
            prevData.map((item) => ({
              ...item,
              // @ts-expect-error FIXME
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              freq: moodCounts[item.mood],
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching mood data:", error);
      }
    })();
  }, [selectedVersion, data?.success, data?.data.forms]);

  return (
    <Card className="flex w-[50vw] flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Mood Chart</CardTitle>
          <CardDescription>Shows your mood over time</CardDescription>
        </div>
      </CardHeader>
      {isLoading ? (
        <Loader />
      ) : (
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={moodChartConfig}
            className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
          >
            <PieChart width={7300} height={250}>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="visitors" hideLabel />}
              />
              <Pie data={chartData} dataKey="freq" nameKey="mood">
                <LabelList
                  dataKey="mood"
                  className="fill-background"
                  stroke="none"
                  fontSize={14}
                  formatter={(value: keyof typeof moodChartConfig) =>
                    moodChartConfig[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
