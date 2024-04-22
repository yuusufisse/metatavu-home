import {
  MenuItem,
  Card,
  Grow,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { formatTimePeriod, getHoursAndMinutes } from "src/utils/time-utils";
import { Timespan } from "src/generated/client";
import TimebankPieChart from "../charts/timebank-piechart";
import TimebankOverviewChart from "../charts/timebank-overview-chart";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import strings from "src/localization/strings";
import TimebankMultiBarChart from "../charts/timebank-multibar-chart";
import DateRangePicker from "./timebank-daterange-picker";
import { useEffect, useState } from "react";
import { theme } from "src/theme";
import { useAtom, useAtomValue } from "jotai";
import {
  personDailyEntryAtom,
  dailyEntriesAtom,
  timespanAtom,
  personsAtom,
  timebankScreenPersonTotalTimeAtom
} from "src/atoms/person";
import UserRoleUtils from "src/utils/user-role-utils";
import { DailyEntryWithIndexSignature, DateRange } from "src/types";
import LocalizationUtils from "src/utils/localization-utils";

/**
 * Component properties
 */
interface Props {
  selectedEmployeeId: number | undefined;
  setSelectedEmployeeId: (selectedEmployeeId?: number) => void;
}

/**
 * Component that contains the entirety of Timebank content, such as charts
 *
 * @param props Component properties
 */
const TimebankContent = ({
  selectedEmployeeId,
  setSelectedEmployeeId
}: Props) => {
  const persons = useAtomValue(personsAtom);
  const isAdmin = UserRoleUtils.isAdmin();

  return (
    <>
      {isAdmin && (
        <Grow in>
          <Card sx={{ p: "1%", display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <FormControl fullWidth>
              <InputLabel id="employee-select-label">{strings.employeeSelect.employeeSelectlabel}</InputLabel>
              <Select
                labelId="employee-select-label"
                id="employee-select"
                value={selectedEmployeeId}
                onChange={(event) => setSelectedEmployeeId(Number(event.target.value))}
                label={strings.employeeSelect.employeeSelectlabel}
              >
                {persons.map((person) => (
                  <MenuItem key={person.id} value={person.id}>
                    {`${person.firstName} ${person.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
        </Grow>
      )}
      <SummaryTimEntriesCard selectedEmployeeId={selectedEmployeeId}/>
      <br />
      <SpecificTimeEntriesCard selectedEmployeeId={selectedEmployeeId}/> 
      <br />
    </>
  );
};

export default TimebankContent;
