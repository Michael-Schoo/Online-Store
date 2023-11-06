'use client'

import { AreaChart, LineChartProps } from "@tremor/react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const dataFormatter = (visits: number) => `${visits.toString()}`;
const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });

export default function AnalyticsGraph({ chartData }: { chartData: LineChartProps['data'] }) {
    const startTime = new Date(chartData[0]?.day)

    // go and create list of month and year pairs from startDate to current date
    const monthYearNames = [] as string[];
    for (let year = startTime.getFullYear(); year <= new Date().getFullYear(); year++) {
        // don't go earlier than the start date and don't go later than the current date
        const start = year === startTime.getFullYear() ? startTime.getMonth() : 0;
        const end = year === new Date().getFullYear() ? new Date().getMonth() : 11;
        
        for (let month = start; month <= end; month++) {
            monthYearNames.push(`${monthFormatter.format(new Date(year, month))} ${year}`);
        }
    }

    const [monthChosen, setMonthChosen] = useState<string>(monthYearNames.at(-1)!);

    const getMonthData = (chartData: LineChartProps['data'], monthChosen: string) => chartData.filter((item) => {
        const date = new Date(item.day);
        const month = date.getMonth();
        const year = date.getFullYear();
        return monthChosen === `${monthFormatter.format(new Date(year, month))} ${year}`;
    });

    const monthData = getMonthData(chartData, monthChosen)
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Page visits per day</CardTitle>
                <CardDescription>
                    This is how many views your listing has had in each day (days set to utc).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Select defaultValue={monthYearNames.at(-1)} onValueChange={setMonthChosen}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a month" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                        <SelectGroup>
                            {monthYearNames.map((monthYearName) => (
                                <SelectItem
                                    key={monthYearName}
                                    value={monthYearName}
                                >
                                    {monthYearName}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <AreaChart
                    className="mt-6"
                    data={monthData}
                    index="day"
                    categories={["Page Visits"]}
                    valueFormatter={dataFormatter}
                    showAnimation={true}
                />
            </CardContent>

        </Card>
    );
}