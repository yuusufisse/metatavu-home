import { BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";
import { PersonTotalTime } from "../../../../generated/client";
import { renderCustomizedTooltipBarChart, totalTimeToChart } from "../../../../utils/chart-utils";
import { theme } from "../../../../theme";
import strings from "../../../../localization/strings";
import { getHours } from "../../../../utils/time-utils";

interface Props {
  personTotalTime: PersonTotalTime;
}

const TimebankOverviewChart = (props: Props) => {
  const { personTotalTime } = props;
  const data = totalTimeToChart(personTotalTime);

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

          {[data[0], data[1]].flatMap((item: any, idx: number) => {
            console.log(data);
            console.log(Object.keys(item));
          })}

          {/* <Bar
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
          /> */}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default TimebankOverviewChart;
