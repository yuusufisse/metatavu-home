import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { PersonTotalTime } from "../../../generated/client";
import { workTimeDataOverview } from "../../../utils/chart-utils";
import { theme } from "../../../theme";
import strings from "../../../localization/strings";
import { getHours, getHoursAndMinutes } from "../../../utils/time-utils";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface Props {
  personTotalTime: PersonTotalTime;
}

const BalanceOverviewChart = (props: Props) => {
  const { personTotalTime } = props;
  const data = workTimeDataOverview(personTotalTime);

  const renderCustomizedTooltipRow = (name: string, time: number, color: string) => {
    return (
      <Typography
        variant="h6"
        style={{
          color: color,
          padding: theme.spacing(1)
        }}
      >
        {`${name}: ${getHoursAndMinutes(time)}`}
      </Typography>
    );
  };
  /**
   * Renders a customized tooltip when hovering over the chart
   * @param props props passed from the parent (chart)
   * @returns JSX element as a tooltip
   */
  const renderCustomizedTooltip = (props: TooltipProps<ValueType, NameType>) => {
    const { active, payload } = props;

    if (!active || !payload || !payload.length || !payload[0].payload) {
      return null;
    }

    const { billableProject, nonBillableProject, internal, expected, name } = payload[0].payload;

    return (
      <Box
        style={{
          padding: theme.spacing(1),
          backgroundColor: "#fff",
          border: "1px solid rgba(0, 0, 0, 0.4)"
        }}
      >
        <Typography
          variant="h6"
          style={{
            padding: theme.spacing(1)
          }}
        >
          {name}
        </Typography>
        {billableProject !== undefined &&
          renderCustomizedTooltipRow(
            strings.timebank.billableProject,
            billableProject as number,
            theme.palette.success.main
          )}
        {nonBillableProject !== undefined &&
          renderCustomizedTooltipRow(
            strings.timebank.nonBillableProject,
            nonBillableProject as number,
            theme.palette.success.main
          )}
        {internal !== undefined &&
          renderCustomizedTooltipRow(
            strings.timebank.internal,
            internal as number,
            theme.palette.warning.main
          )}
        {expected !== undefined &&
          renderCustomizedTooltipRow(
            strings.timebank.expected,
            expected as number,
            theme.palette.info.main
          )}
      </Box>
    );
  };

  return (
    <>
      <ResponsiveContainer width="50%" height={200}>
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
            domain={[(dataMin: number) => dataMin, (dataMax: number) => dataMax * 1.1]}
          />
          <YAxis type="category" dataKey="name" />
          <Tooltip content={renderCustomizedTooltip} />
          <Legend />
          <Bar
            dataKey="billableProject"
            name="Billable"
            barSize={60}
            stackId="a"
            fill={theme.palette.success.dark}
          />
          <Bar
            dataKey="nonBillableProject"
            name="Non Billable"
            barSize={60}
            stackId="a"
            fill={theme.palette.success.light}
          />
          <Bar
            dataKey="internal"
            name="Internal"
            barSize={60}
            stackId="a"
            fill={theme.palette.warning.main}
          />
          <Bar
            dataKey="expected"
            name="Expected"
            barSize={60}
            stackId="a"
            fill={theme.palette.info.main}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default BalanceOverviewChart;
