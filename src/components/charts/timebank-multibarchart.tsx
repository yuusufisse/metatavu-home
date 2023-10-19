import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import { DailyEntry } from "../../generated/client";
import { theme } from "../../theme";
import strings from "../../localization/strings";
import { getHours } from "../../utils/time-utils";
import { Typography } from "@mui/material";
import { renderCustomizedTooltipBarChart } from "../../utils/chart-utils";
import { Worktime } from "../../types";

/**
 * Component properties
 */
interface Props {
  selectedEntries: DailyEntry[];
}

/**
 * Timebank multiple bar chart component representing data from a selected range
 */
const TimebankMultiBarChart = (props: Props) => {
  const { selectedEntries } = props;
  const chartData = selectedEntries.map((entry) => {
    return {
      name: entry.date.toLocaleDateString(strings.localization.time, {
        day: "numeric",
        month: "numeric"
      }),
      internal: entry.internalTime,
      billableProject: entry.billableProjectTime,
      nonBillableProject: entry.nonBillableProjectTime,
      expected: entry.expected
    };
  });

  if (!selectedEntries.length)
    return (
      <ResponsiveContainer width="75%" height={400}>
        <Typography sx={{ textAlign: "center", marginTop: "12%" }}>
          {strings.timebank.noData}
        </Typography>
      </ResponsiveContainer>
    );
  return (
    <ResponsiveContainer width="75%" height={400}>
      <BarChart
        data={chartData}
        layout="horizontal"
        barGap={10}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <YAxis
          type="number"
          axisLine={false}
          tickFormatter={(value) => getHours(value as number)}
          domain={[0, (dataMax: number) => dataMax]}
        />
        <XAxis type="category" dataKey="name" />
        <Tooltip content={renderCustomizedTooltipBarChart} />
        <Legend />
        <Bar
          dataKey={Worktime.Billable}
          name={strings.timebank.billableProject}
          barSize={60}
          stackId="stackedBar"
          fill={theme.palette.success.dark}
        />
        <Bar
          dataKey={Worktime.NonBillable}
          name={strings.timebank.nonBillableProject}
          barSize={60}
          stackId="stackedBar"
          fill={theme.palette.success.light}
        />
        <Bar
          dataKey={Worktime.Internal}
          name={strings.timebank.internal}
          barSize={60}
          stackId="stackedBar"
          fill={theme.palette.warning.main}
        />
        <Bar
          dataKey={Worktime.Expected}
          name={strings.timebank.expected}
          barSize={60}
          fill={theme.palette.info.main}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TimebankMultiBarChart;
