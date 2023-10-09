import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import { renderCustomizedTooltipBarChart, totalTimeToChart } from "../../../../utils/chart-utils";
import { theme } from "../../../../theme";
import strings from "../../../../localization/strings";
import { getHours } from "../../../../utils/time-utils";
import { personTotalTimeAtom } from "../../../../atoms/person";
import { useAtomValue } from "jotai";
import { PersonTotalTime } from "../../../../generated/client";

const TimebankOverviewChart = () => {
  const personTotalTime = useAtomValue(personTotalTimeAtom);
  const data = totalTimeToChart(personTotalTime as PersonTotalTime);

  return (
    <>
      <ResponsiveContainer width="75%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
          barGap={0}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <XAxis
            type="number"
            axisLine={false}
            tickFormatter={(value) => getHours(value as number)}
            domain={[0, (dataMax: number) => dataMax]}
          />
          <YAxis type="category" dataKey="name" />
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
            stackId="a"
            fill={theme.palette.info.main}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default TimebankOverviewChart;
