import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import getLocalizedVacationType from "../../../../../../utils/vacation-type-utils";
import { VacationType } from "../../../../../../generated/client";
import { ChangeEvent, Dispatch } from "react";
import DateRangePicker from "../../../../../generics/date-range-picker";
import { VacationData } from "../../../../../../types";
import { SetStateAction } from "jotai";
import { DateTime } from "luxon";
/**
 * Component properties
 */
interface FormFieldsProps {
  vacationData: VacationData;
  setVacationData: Dispatch<SetStateAction<VacationData>>;
  dateTimeNow: DateTime;
  initialStartDate: DateTime | undefined;
  initialEndDate: DateTime | undefined;
  readyToSubmit: boolean;
}

/**
 * FormFields
 *
 * @param props FormFieldsProps
 */
const FormFields = (props: FormFieldsProps) => {
  const {
    vacationData,
    setVacationData,
    dateTimeNow,
    initialEndDate,
    initialStartDate,
    readyToSubmit
  } = props;

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
      <FormLabel>Vacation Type</FormLabel>
      <Select
        name="type"
        value={String(vacationData.type)}
        onChange={(event: SelectChangeEvent<string>) => {
          setVacationData({
            ...vacationData,
            type: getLocalizedVacationType(event.target.value)
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

      <FormLabel>Message</FormLabel>
      <TextField
        value={vacationData.message}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setVacationData({
            ...vacationData,
            message: event.target.value
          });
        }}
        sx={{ marginBottom: "5px" }}
      />

      <FormLabel sx={{ marginBottom: "5px" }}>Duration</FormLabel>
      <DateRangePicker
        dateTimeNow={dateTimeNow}
        setDates={setDates}
        initialStartDate={initialStartDate}
        initialEndDate={initialEndDate}
      />

      <Button
        disabled={!readyToSubmit}
        type="submit"
        variant="contained"
        size="large"
        sx={{ marginTop: "10px" }}
      >
        Submit
      </Button>
    </FormControl>
  );
};

export default FormFields;