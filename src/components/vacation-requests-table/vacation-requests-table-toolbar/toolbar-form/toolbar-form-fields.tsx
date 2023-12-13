import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import getVacationTypeByString from "../../../../utils/vacation-type-utils";
import { VacationType } from "../../../../generated/client";
import { ChangeEvent } from "react";
import DateRangePicker from "../../../generics/date-range-picker";
import { ToolbarFormModes, VacationData } from "../../../../types";
import { DateTime } from "luxon";
import { hasAllPropsDefined } from "../../../../utils/check-utils";
import strings from "../../../../localization/strings";
import LocalizationUtils from "../../../../utils/localization-utils";

/**
 * Component properties
 */
interface Props {
  vacationData: VacationData;
  setVacationData: (vacationDate: VacationData) => void;
  dateTimeTomorrow: DateTime;
  startDate: DateTime;
  endDate: DateTime;
  setStartDate: (startDate: DateTime) => void;
  setEndDate: (endDate: DateTime) => void;
  toolbarFormMode: ToolbarFormModes;
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
  endDate,
  setEndDate,
  setStartDate,
  startDate,
  toolbarFormMode
}: Props) => {
  /**
   * Set dates to vacationData
   *
   * @param startDate
   * @param endDate
   * @param days
   */
  const setDates = (startDate: DateTime, endDate: DateTime, days: number) => {
    setVacationData({
      ...vacationData,
      startDate: startDate,
      endDate: endDate,
      days: days
    });
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <FormLabel>{strings.vacationRequest.type}</FormLabel>
      <Select
        name="type"
        value={String(vacationData.type)}
        onChange={(event: SelectChangeEvent<string>) => {
          const vacationType = getVacationTypeByString(event.target.value);
          if (vacationType) {
            setVacationData({
              ...vacationData,
              type: vacationType
            });
          }
        }}
        sx={{ marginBottom: "5px", width: "100%" }}
      >
        {(Object.keys(VacationType) as Array<keyof typeof VacationType>).map((vacationType) => {
          return (
            <MenuItem key={vacationType} value={vacationType}>
              {LocalizationUtils.getLocalizedVacationRequestType(vacationType)}
            </MenuItem>
          );
        })}
      </Select>
      <FormLabel>{strings.vacationRequest.message}</FormLabel>
      <TextField
        required
        error={!vacationData.message?.length}
        value={vacationData.message}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setVacationData({
            ...vacationData,
            message: event.target.value
          });
        }}
        sx={{ marginBottom: "5px" }}
      />
      <FormLabel sx={{ marginBottom: "5px" }}>{strings.vacationRequest.days}</FormLabel>
      <DateRangePicker
        dateTimeTomorrow={dateTimeTomorrow}
        setDates={setDates}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
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
