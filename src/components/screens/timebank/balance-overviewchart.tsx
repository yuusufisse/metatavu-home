import {
  BarChart,
  CartesianGrid,
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
import { Button } from "@mui/base";
import strings from "../../../localization/strings";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface Props {
  personTotalTime: PersonTotalTime | undefined;
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
        { `${name}: ${TimeUtils.convertToMinutesAndHours(time)}` }
      </Typography>
    );
  };

  const renderCustomizedTooltip = (props: TooltipProps<ValueType, NameType>) => {
    const { active, payload } = props;

    if (!active || !payload || !payload.length || !payload[0].payload) {
      return null;
    }

    const { billableProject, nonBillableProject, internal, expected, name } = payload[0].payload;

    return (
      <Box>
        <Typography
          variant="h6"
          style={{
            padding: theme.spacing(1)
          }}
        >
          { name }
        </Typography>
        { billableProject !== undefined && renderCustomizedTooltipRow(strings.billableProject, billableProject as number, theme.palette.success.main) }
        { nonBillableProject !== undefined && renderCustomizedTooltipRow(strings.nonBillableProject, nonBillableProject as number, theme.palette.success.main) }
        { internal !== undefined && renderCustomizedTooltipRow(strings.internal, internal as number, theme.palette.warning.main) }
        { expected !== undefined && renderCustomizedTooltipRow(strings.expected, expected as number, theme.palette.info.main) }
      </Box>
    );
  };

  return (
    <>
      <ResponsiveContainer width={400} height={200}>
        <BarChart data={data} layout="vertical" barGap={0}>
          <XAxis
            type="number"
            axisLine={false}
            tickFormatter={(value) => getHoursAndMinutes(value as number)}
          />
          <YAxis type="category" dataKey="name" />
          {/* <Tooltip content={ renderCustomizedTooltip }/> */}
          <Legend/>
          <Bar dataKey="project" barSize={60} stackId="a" fill={theme.palette.success.dark} />
          <Bar
            dataKey="nonBillableProject"
            barSize={60}
            stackId="a"
            fill={theme.palette.success.light}
          />
          <Bar dataKey="internal" barSize={60} stackId="a" fill={theme.palette.warning.main} />
          <Bar dataKey="expected" barSize={60} stackId="a" fill={theme.palette.info.main} />
        </BarChart>
      </ResponsiveContainer>
      {/* <Button onClick={() => console.log(data)}>TEST</Button> */}
    </>
  );
};

export default BalanceOverviewChart;
