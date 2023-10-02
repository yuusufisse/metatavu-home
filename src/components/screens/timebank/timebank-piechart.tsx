import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, TooltipProps } from "recharts";
import { renderCustomizedLabel, dailyEntryToChart } from "../../../utils/chart-utils";
import { DailyEntry, PersonTotalTime } from "../../../generated/client";
import { Box, Typography } from "@mui/material";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { theme } from "../../../theme";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import strings from "../../../localization/strings";

interface Props {
  personTotalTime: PersonTotalTime;
  dailyEntries: DailyEntry[];
  personDailyEntry: DailyEntry;
}

const TimebankPieChart = (props: Props) => {
  const { personDailyEntry } = props;

  const COLORS = [
    theme.palette.success.dark,
    theme.palette.success.light,
    theme.palette.warning.main
  ];
  /**
   * Renders a customized tooltip when hovering over the chart
   * @param props props, such as displayed data (payload), passed from the parent (chart)
   * @returns JSX element as a tooltip
   */
  const renderCustomizedTooltip = (props: TooltipProps<ValueType, NameType>) => {
    const { active, payload } = props;
    if (!active || !payload || !payload.length) {
      return null;
    }

    const selectedData = payload[0];

    if (!selectedData.value || !selectedData.name) {
      return null;
    }

    const sectionName = {
      Billable: strings.timebank.billableProject,
      NonBillable: strings.timebank.nonBillableProject,
      Internal: strings.timebank.internal
    }[selectedData.name];

    return (
      <Box style={{ backgroundColor: "rgba(0, 0, 0)", opacity: "70%" }}>
        <Typography
          variant="h6"
          style={{
            color: "#fff",
            padding: theme.spacing(1)
          }}
        >
          {`${sectionName}: ${getHoursAndMinutes(selectedData.value as number)}`}
        </Typography>
      </Box>
    );
  };
  return (
    <ResponsiveContainer width={"75%"} height={200}>
      {personDailyEntry.logged ? (
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
                <Tooltip content={renderCustomizedTooltip} />
              </>
            ))}
          </Pie>
          <Tooltip content={renderCustomizedTooltip} />
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
