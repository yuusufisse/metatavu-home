import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, TooltipProps } from "recharts";
import { workTimeData, renderCustomizedLabel } from "../../../utils/chart-utils";
import { PersonTotalTime } from "../../../generated/client";
import { Box, Typography } from "@mui/material";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { theme } from "../../../theme";
import { getHoursAndMinutes } from "../../../utils/time-utils";

interface Props {
  personTotalTime: PersonTotalTime | undefined;
}

const BalancePieChart = (props: Props) => {
  const { personTotalTime } = props;

  const COLORS = [
    theme.palette.success.dark,
    theme.palette.success.light,
    theme.palette.warning.main
  ];

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
      Billable: "Billable",
      NonBillable: "Non-billable",
      Internal: "Internal"
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
    <ResponsiveContainer width={300} height={300}>
      <PieChart>
        <Pie
          data={workTimeData(personTotalTime)}
          dataKey="dataKey"
          cx="50%"
          cy="50%"
          outerRadius={50}
          label={renderCustomizedLabel}
        >
          {workTimeData(personTotalTime).map((_entry, index) => (
            <>
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
              <Tooltip content={renderCustomizedTooltip} />
            </>
          ))}
        </Pie>
        <Tooltip content={renderCustomizedTooltip} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BalancePieChart;
