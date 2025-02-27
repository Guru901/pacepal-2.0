import React, { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/loading";
import { sleepChartConfig } from "@/lib/chart-configs";
import { api } from "@/trpc/react";

export function SleepChart({
  userId,
  selectedVersion,
}: {
  userId: string;
  selectedVersion: string;
}) {
  const { data } = api.charts.getSleepData.useQuery({
    id: userId,
    version: selectedVersion,
  });
  const [chartData, setChartData] = useState([
    {
      date: "",
      actual_sleeping_hrs: 0,
      desired_sleep_hrs: 0,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  const filterDataByTimeRange = (data: [], range: string) => {
    const now = new Date();
    const startDate = new Date();

    if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
    } else if (range === "90d") {
      startDate.setDate(now.getDate() - 90);
    }

    return data.filter((item: { createdAt: string }) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= startDate && itemDate <= now;
    });
  };

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        if (data?.success && Array.isArray(data.data.forms)) {
          const filteredData = filterDataByTimeRange(
            // @ts-expect-error FIXME
            data.data.forms,
            timeRange,
          );

          const transformedData = filteredData.map(
            (item: { createdAt: string; hoursSlept: number }) => ({
              date: new Date(item.createdAt).toLocaleDateString("en-US"),
              actual_sleeping_hrs: item.hoursSlept,
              desired_sleep_hrs: data.data.desiredSleepHours?.[0] ?? 0,
            }),
          );

          setChartData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching sleep data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    userId,
    timeRange,
    selectedVersion,
    data?.success,
    data?.data.forms,
    data?.data.desiredSleepHours,
  ]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Sleep Chart</CardTitle>
          <CardDescription>
            Showing Sleeping hours for the selected time range
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      {loading ? (
        <Loader />
      ) : (
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={sleepChartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="fillActualSleepingHrs"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-actual_sleeping_hrs)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-actual_sleeping_hrs)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillDesiredSleepHrs"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="30%"
                    stopColor="var(--color-desired_sleep_hrs)"
                    stopOpacity={1}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desired_sleep_hrs)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value: string) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="desired_sleep_hrs"
                type="natural"
                fill="url(#fillDesiredSleepHrs)"
                stroke="var(--color-desired_sleep_hrs)"
                stackId="a"
              />
              <Area
                dataKey="actual_sleeping_hrs"
                type="natural"
                fill="url(#fillActualSleepingHrs)"
                stroke="var(--color-actual_sleeping_hrs)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
}
