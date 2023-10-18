import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  renderCustomizedLabel,
  dailyEntryToChart,
  renderCustomizedTooltipPieChart
} from "../../../../utils/chart-utils";
import { Typography } from "@mui/material";
import { theme } from "../../../../theme";
import strings from "../../../../localization/strings";
import { personDailyEntryAtom } from "../../../../atoms/person";
import { useAtomValue } from "jotai";

/**
 * Time bank pie chart component
 * @returns A pie chart containing daily entry logged time breakdown
 */
const TimebankPieChart = () => {
  const personDailyEntry = useAtomValue(personDailyEntryAtom);

  const COLORS = [
    theme.palette.success.dark,
    theme.palette.success.light,
    theme.palette.warning.main
  ];

  if (!personDailyEntry?.logged) {
    return (
      <ResponsiveContainer width={"75%"} height={200}>
        <Typography sx={{ textAlign: "center", marginTop: "12%" }}>
          {strings.timebank.noData}
        </Typography>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width={"75%"} height={200}>
      <PieChart>
        <Pie
          data={dailyEntryToChart(personDailyEntry)}
          dataKey="dataKey"
          cx="50%"
          cy="50%"
          outerRadius={50}
          label={renderCustomizedLabel}
        >
          {dailyEntryToChart(personDailyEntry).map((_entry, index) => (
            <>
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
              <Tooltip content={renderCustomizedTooltipPieChart} />
            </>
          ))}
        </Pie>
        <Tooltip content={renderCustomizedTooltipPieChart} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TimebankPieChart;
