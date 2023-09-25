import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import { VacationType } from "../../../../generated/client";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateTime } from "luxon";
import getLocalizedVacationType from "../../../../utils/vacation-type-utils";
import { VacationData } from "../../../../types";
import CreateVacationRequest from "../create-vacation-request";
import { hasAllPropsDefined } from "../../../../utils/check-utils";
import DateRangePicker from "../../../generics/date-range-picker";

/**
 * Table form props
 */
interface TableFormProps {
  setFormOpen: Dispatch<SetStateAction<boolean>>;
}
/**
 * Table form component, provides a form to create a new vacation request
 * @props TableFormProps
 */
const TableForm = (props: TableFormProps) => {
  const { setFormOpen } = props;
  const dateTimeNow = DateTime.now();
  const [vacationData, setVacationData] = useState<VacationData>({
    startDate: dateTimeNow,
    endDate: dateTimeNow,
    type: VacationType.VACATION,
    message: "",
    days: 1
  });
  const { createVacationRequest } = CreateVacationRequest();
  const [readyToSubmit, setReadyToSubmit] = useState(false);

  /**
   * Vacation data validation
   */
  useEffect(() => {
    if (hasAllPropsDefined(vacationData) && vacationData.message?.length) {
      setReadyToSubmit(true);
    } else {
      setReadyToSubmit(false);
    }
  });

  /**
   * Handle form submit
   * Pass vacation data to createVacationRequest and clear vacationData
   */
  const handleFormSubmit = () => {
    createVacationRequest(vacationData);
    setFormOpen(false);
    setVacationData({
      type: "VACATION",
      message: "",
      startDate: dateTimeNow,
      endDate: dateTimeNow,
      days: 1
    });
  };

  /**
   * Handle dates
   * @param startDate
   * @param endDate
   */
  const setDates = (
    startDate: DateTime | null | undefined,
    endDate: DateTime | null | undefined
  ) => {
    setVacationData({
      ...vacationData,
      startDate: startDate,
      endDate: endDate
    });
  };

  return (
    <Box
      sx={{
        width: "100%"
      }}
    >
      <Divider />
      <Box sx={{ padding: "10px", width: "100%" }}>
        <Grid container>
          <Grid item xs={12}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleFormSubmit();
              }}
            >
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
                  {(Object.keys(VacationType) as Array<keyof typeof VacationType>).map(
                    (vacationType) => {
                      return (
                        <MenuItem key={vacationType} value={vacationType}>
                          {vacationType}
                        </MenuItem>
                      );
                    }
                  )}
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
                <DateRangePicker dateTimeNow={dateTimeNow} setDates={setDates} />
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
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TableForm;
