"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/firebase.config";
import { useEffect } from "react";

const getStatistics = httpsCallable(functions, "getStatistics");

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { convertDate } from "@/app/event/getEvent/[eventID]/page";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  tier: {
    label: "tier",
  },
  VIP: {
    label: "General",
    color: "hsl(var(--chart-1))",
  },
  General: {
    label: "Floor",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const colorPalette: Record<number, { name: string; hex: string }> = {
  1: { name: "red", hex: "#E57373" }, // Light Red
  2: { name: "pink", hex: "#F06292" }, // Light Pink
  3: { name: "purple", hex: "#BA68C8" }, // Light Purple
  4: { name: "deepPurple", hex: "#9575CD" }, // Moderate Purple
  5: { name: "indigo", hex: "#7986CB" }, // Light Indigo
  6: { name: "blue", hex: "#64B5F6" }, // Light Blue
  7: { name: "cyan", hex: "#4DD0E1" }, // Light Cyan
  8: { name: "teal", hex: "#4DB6AC" }, // Light Teal
  9: { name: "green", hex: "#81C784" }, // Light Green
  10: { name: "lightGreen", hex: "#AED581" }, // Softer Green
  11: { name: "yellow", hex: "#FFF176" }, // Light Yellow
  12: { name: "amber", hex: "#FFD54F" }, // Light Amber
  13: { name: "orange", hex: "#FFB74D" }, // Light Orange
  14: { name: "deepOrange", hex: "#FF8A65" }, // Light Deep Orange
  15: { name: "brown", hex: "#A1887F" }, // Light Brown
  16: { name: "gray", hex: "#90A4AE" }, // Light Gray
};

export function EventsPieChart({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) {
  const [chartData, setChartData] = React.useState<
    { tier: string; quantity: number }[]
  >([]);
  const [totalVisitors, setTotalVisitors] = React.useState(0);
  const [chartConfig, setChartConfig] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    getStatistics({ eventId, userId })
      .then((result) => {
        console.log(result.data, "result.data");
        const convertedData = [];
        const data = (result.data as { data: Record<string, number> }).data;
        const chartConfig: Record<string, any> = {
          tier: {
            label: "tier",
          },
        };
        let count = 1;

        for (const key in data) {
          convertedData.push({ tier: key, quantity: data[key], fill: colorPalette[count].hex });
          chartConfig[key] = { label: key, color: colorPalette[count].hex };
          count++;
        }

        setChartConfig(chartConfig);

        convertedData && setChartData(convertedData);
        const total = convertedData.reduce(
          (acc, curr) => acc + curr.quantity,
          0
        );

        convertedData && setTotalVisitors(total);
        console.log(convertedData, total);
      })
      .catch((error) => {
        console.error(error, "error");
      });
  }, []);

  return (
    chartData &&
    chartData.length !== 0 && (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          {/* <CardTitle>Statistics</CardTitle> */}
          {/* <CardDescription>January - June 2024</CardDescription> */}
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="quantity"
                nameKey="tier"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalVisitors}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Sold Tickets
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
      </Card>
    )
  );
}
