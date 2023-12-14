import { Button, FormControl, FormLabel, MenuItem, TextField } from "@mui/material";
import getVacationTypeByString from "../../../../utils/vacation-type-utils";
import { VacationType } from "../../../../generated/client";
import { ChangeEvent, useEffect } from "react";
import DateRangePicker from "../../../generics/date-range-picker";
import { DateRange, ToolbarFormModes, VacationData } from "../../../../types";
import { DateTime } from "luxon";
import { hasAllPropsDefined } from "../../../../utils/check-utils";
import strings from "../../../../localization/strings";
import LocalizationUtils from "../../../../utils/localization-utils";
import { getVacationDurationInDays } from "../../../../utils/time-utils";

/**
 * Component properties
 */
interface Props {
  vacationData: VacationData;
  setVacationData: (vacationDate: VacationData) => void;
  dateTimeTomorrow: DateTime;
  toolbarFormMode: ToolbarFormModes;
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}

/**
 * Toolbar form fields component
 *
 * @param props component properties
 */
const ToolbarFormFields = ({
  vacationData,
  setVacationData,
  dateTimeTomorrow,
  toolbarFormMode,
  dateRange,
  setDateRange
}: Props) => {
  useEffect(() => {
    setVacationData({
      ...vacationData,
      startDate: dateRange.start,
      endDate: dateRange.end,
      days: getVacationDurationInDays(dateRange.start, dateRange.end)
    });
  }, [dateRange]);

  /**
   * Handle vacation type change
   *
   * @param value vacation type string
   */
  const handleVacationTypeChange = (value: string) => {
    const vacationType = getVacationTypeByString(value);
    if (vacationType) {
      setVacationData({
        ...vacationData,
        type: vacationType
      });
    }
  };

  /**
   * Handle vacation data change
   *
   * @param value message string
   */
  const handleVacationDataChange = (value: string) => {
    setVacationData({
      ...vacationData,
      message: value
    });
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <TextField
        select
        label={strings.vacationRequest.type}
        name="type"
        value={String(vacationData.type)}
        onChange={(event) => {
          handleVacationTypeChange(event.target.value);
        }}
        sx={{ marginBottom: "5px", width: "100%" }}
      >
        {Object.keys(VacationType).map((vacationType) => {
          return (
            <MenuItem key={vacationType} value={vacationType}>
              {LocalizationUtils.getLocalizedVacationRequestType(vacationType as VacationType)}
            </MenuItem>
          );
        })}
      </TextField>
      <FormLabel>{strings.vacationRequest.message}</FormLabel>
      <TextField
        required
        error={!vacationData.message?.length}
        value={vacationData.message}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          handleVacationDataChange(event.target.value);
        }}
        sx={{ marginBottom: "5px" }}
      />
      <FormLabel sx={{ marginBottom: "5px" }}>{strings.vacationRequest.days}</FormLabel>
      <DateRangePicker
        dateTimeTomorrow={dateTimeTomorrow}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <Button
        disabled={!hasAllPropsDefined(vacationData) || !vacationData.message?.length}
        type="submit"
        variant="contained"
        size="large"
        sx={{ marginTop: "10px" }}
      >
        {toolbarFormMode === ToolbarFormModes.CREATE ? strings.form.submit : strings.form.update}
      </Button>
    </FormControl>
  );
};

export default ToolbarFormFields;
