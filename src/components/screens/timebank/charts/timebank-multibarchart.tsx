import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import { DailyEntry } from "../../../../generated/client";
import { theme } from "../../../../theme";
import strings from "../../../../localization/strings";
import { getHours } from "../../../../utils/time-utils";
import { Typography } from "@mui/material";
import { renderCustomizedTooltipBarChart } from "../../../../utils/chart-utils";

interface Props {
  selectedEntries: DailyEntry[] | undefined;
}

const TimebankMultiBarChart = (props: Props) => {
  const { selectedEntries } = props;
  const data = selectedEntries?.map((entry) => {
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

  return (
    <>
      <ResponsiveContainer width="75%" height={400}>
        {selectedEntries?.length ? (
          <BarChart
            data={data}
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
              domain={[0, (dataMax: number) => dataMax * 1.1]}
            />
            <XAxis type="category" dataKey="name" />
            <Tooltip content={renderCustomizedTooltipBarChart} />
            <Legend />
            <Bar
              dataKey="billableProject"
              name={strings.timebank.billableProject}
              barSize={60}
              stackId="a"
              fill={theme.palette.success.dark}
            />
            <Bar
              dataKey="nonBillableProject"
              name={strings.timebank.nonBillableProject}
              barSize={60}
              stackId="a"
              fill={theme.palette.success.light}
            />
            <Bar
              dataKey="internal"
              name={strings.timebank.internal}
              barSize={60}
              stackId="a"
              fill={theme.palette.warning.main}
            />
            <Bar
              dataKey="expected"
              name={strings.timebank.expected}
              barSize={60}
              fill={theme.palette.info.main}
            />
          </BarChart>
        ) : (
          <Typography sx={{ textAlign: "center", marginTop: "12%" }}>
            {strings.timebank.noData}
          </Typography>
        )}
      </ResponsiveContainer>
    </>
  );
};

export default TimebankMultiBarChart;
