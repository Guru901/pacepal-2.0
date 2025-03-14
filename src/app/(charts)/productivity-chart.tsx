import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import { productivityChartConfig } from "@/lib/chart-configs";
import { useProductivityData } from "@/hooks/useChartData";

export function ProductivityChart({
  selectedVersion,
}: {
  selectedVersion: string;
}) {
  const [chartData, setChartData] = useState<
    Array<{
      date: string;
    }>
  >([]);
  const { data, isLoading } = useProductivityData(selectedVersion);

  useEffect(() => {
    void (async () => {
      try {
        if (data?.success) {
          setChartData(
            data.data.productivityData
              .map((item: { date: string }) => ({
                ...item,
                date: item.date.split("/").reverse().join("-"),
              }))
              .reverse(),
          );
        }
      } catch (error) {
        console.error("Error fetching productivity data:", error);
      }
    })();
  }, [selectedVersion, data?.success, data?.data.productivityData]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Productivity Chart</CardTitle>
          <CardDescription>
            Showing the last 30 productivity ratings
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <Loader />
        ) : (
          <ChartContainer
            config={productivityChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                interval={0}
                tickFormatter={(value: string) => {
                  const [year, month, day] = value.split("-");
                  return new Date(`${year}-${month}-${day}`).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                    },
                  );
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value: string) => {
                      const [year, month, day] = value.split("-");
                      return new Date(
                        `${year}-${month}-${day}`,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar
                dataKey={"productivity"}
                fill={`var(--color-productivity)`}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
