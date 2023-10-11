import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import getVacationTypeByString from "../../../../../../utils/vacation-type-utils";
import { VacationType } from "../../../../../../generated/client";
import { ChangeEvent, Dispatch } from "react";
import DateRangePicker from "../../../../../generics/date-range-picker";
import { VacationData } from "../../../../../../types";
import { SetStateAction } from "jotai";
import { DateTime } from "luxon";
import { hasAllPropsDefined } from "../../../../../../utils/check-utils";
import strings from "../../../../../../localization/strings";

/**
 * Component properties
 */
interface Props {
  vacationData: VacationData;
  setVacationData: Dispatch<SetStateAction<VacationData>>;
  dateTimeNow: DateTime;
  startDate: DateTime;
  endDate: DateTime;
  setStartDate: Dispatch<SetStateAction<DateTime>>;
  setEndDate: Dispatch<SetStateAction<DateTime>>;
}

/**
 * FormFields
 *
 * @param props component properties
 */
const FormFields = ({
  vacationData,
  setVacationData,
  dateTimeNow,
  endDate,
  setEndDate,
  setStartDate,
  startDate
}: Props) => {
  /**
   * Set dates to vacationData
   *
   * @param startDate
   * @param endDate
   * @param days
   */
  const setDates = (
    startDate: DateTime | undefined,
    endDate: DateTime | undefined,
    days: number
  ) => {
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
          setVacationData({
            ...vacationData,
            type: getVacationTypeByString(event.target.value)
          });
        }}
        sx={{ marginBottom: "5px", width: "100%" }}
      >
        {(Object.keys(VacationType) as Array<keyof typeof VacationType>).map((vacationType) => {
          return (
            <MenuItem key={vacationType} value={vacationType}>
              {vacationType}
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
        dateTimeNow={dateTimeNow}
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
        {strings.form.submit}
      </Button>
    </FormControl>
  );
};

export default FormFields;
