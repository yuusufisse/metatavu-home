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
import { DailyEntry } from "../../../generated/client";
import { theme } from "../../../theme";
import strings from "../../../localization/strings";
import { getHours, getHoursAndMinutes } from "../../../utils/time-utils";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface Props {
  selectedEntries: DailyEntry[] | undefined
}

const TimebankMultiBarChart = (props: Props) => {
  const { selectedEntries } = props;
  const data = selectedEntries?.map((entry) => {
    return(
      {
        name: entry.date.toLocaleDateString(),
        internal: entry.internalTime,
        billableProject: entry.billableProjectTime,
        nonBillableProject: entry.nonBillableProjectTime,
        expected: entry.expected
      })
  })

  // useEffect(() => {
  //   data = generateMultiBarChart(selectedEntries);
  // }, [selectedEntries])
  

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
   * @param props props, such as chart values, passed from the parent (chart)
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
      <ResponsiveContainer width="100%" height={400}>
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
          <Tooltip content={renderCustomizedTooltip} />
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
      </ResponsiveContainer>
    </>
  );
};

export default TimebankMultiBarChart;
