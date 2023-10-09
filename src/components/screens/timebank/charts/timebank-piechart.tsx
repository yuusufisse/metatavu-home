import React from "react";
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

const TimebankPieChart = () => {
  const personDailyEntry = useAtomValue(personDailyEntryAtom);

  const COLORS = [
    theme.palette.success.dark,
    theme.palette.success.light,
    theme.palette.warning.main
  ];

  return (
    <ResponsiveContainer width={"75%"} height={200}>
      {personDailyEntry?.logged ? (
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
      ) : (
        <Typography sx={{ textAlign: "center", marginTop: "12%" }}>
          {strings.timebank.noData}
        </Typography>
      )}
    </ResponsiveContainer>
  );
};

export default TimebankPieChart;
