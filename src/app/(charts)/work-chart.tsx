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
import { Loader } from "@/components/loading";
import { workChartConfig } from "@/lib/chart-configs";
import { useWorkData } from "@/hooks/useChartData";

export function WorkChart({ selectedVersion }: { selectedVersion: string }) {
  const [desiredWorkHrs, setDesiredWorkHrs] = useState<
    Array<{
      name: string;
      hours: number;
    }>
  >([]);
  const [chartData, setChartData] = useState<
    Array<{
      date: string;
    }>
  >([]);
  const { data, isLoading } = useWorkData(selectedVersion);

  useEffect(() => {
    void (async () => {
      try {
        if (data?.success && data.data.desiredWorkingHours) {
          const desiredHours = data.data.desiredWorkingHours[0]!;
          setDesiredWorkHrs(desiredHours);

          const combinedChartData = data.data.forms?.map(
            // @ts-expect-error FIXME
            (form: {
              hoursPlanned: number;
              hoursWorked: { name: string; hours: number }[];
              createdAt: string;
            }) => {
              const date = new Date(form.createdAt).toLocaleDateString("en-US");
              const dataForDate = { date };

              form.hoursWorked.forEach((entry) => {
                const periodName = entry.name;

                const desiredPeriod = desiredHours.find(
                  (d) => d.name.toLowerCase() === periodName.toLowerCase(),
                );

                if (desiredPeriod) {
                  // @ts-expect-error FIXME
                  dataForDate[periodName] = {
                    actual_working_hrs: entry.hours,
                    desired_working_hrs: desiredPeriod.hours,
                  };
                }
              });

              return dataForDate;
            },
          );

          setChartData(combinedChartData);
        }
      } catch (error) {
        console.error("Error fetching work data:", error);
      }
    })();
  }, [
    selectedVersion,
    isLoading,
    data?.success,
    data?.data.desiredWorkingHours,
    data?.data.forms,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Hours Charts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {desiredWorkHrs?.map((item: { name: string; hours: number }) => (
              <Card key={item.name} className="m-2">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>{item.name} Hours Chart</CardTitle>
                    <CardDescription>
                      Showing last 30 entries of a particular slot
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                  {chartData.length > 0 ? (
                    <ChartContainer
                      config={workChartConfig}
                      className="aspect-auto h-[250px] w-full"
                    >
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient
                            id="fillActualWorkingHrs"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-actual_working_hrs)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-actual_working_hrs)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="fillDesiredWorkingHrs"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-desired_working_hrs)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-desired_working_hrs)"
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
                                return new Date(value).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                );
                              }}
                              indicator="dot"
                            />
                          }
                        />
                        <Area
                          dataKey={(
                            entry: Record<
                              string,
                              { actual_working_hrs: number }
                            >,
                          ) => entry[item.name]?.actual_working_hrs}
                          name="Actual Working Hours"
                          type="natural"
                          fill="url(#fillActualWorkingHrs)"
                          stroke="var(--color-actual_working_hrs)"
                          stackId="a"
                        />
                        <Area
                          dataKey={(
                            entry: Record<
                              string,
                              { desired_working_hrs: number }
                            >,
                          ) => entry[item.name]?.desired_working_hrs}
                          name="Desired Working Hours"
                          type="natural"
                          fill="url(#fillDesiredWorkingHrs)"
                          stroke="var(--color-desired_working_hrs)"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                      </AreaChart>
                    </ChartContainer>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No data available for {item.name}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
