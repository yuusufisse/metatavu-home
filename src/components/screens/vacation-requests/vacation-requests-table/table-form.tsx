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
import { ChangeEvent, useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import getLocalizedVacationType from "../../../../utils/vacation-type-utils";
import { VacationData } from "../../../../types";
import CreateVacationRequest from "../create-vacation-request";

/**
 * Table form component, provides a form to create a new vacation request
 *
 */
const TableForm = () => {
  const dateTimeNow = DateTime.now();
  const dateTimeNowString = dateTimeNow.toJSDate();
  const [type, setType] = useState<string>(VacationType.VACATION);
  const [message, setMessage] = useState<string>("");
  const [startDate, setStartDate] = useState<DateTime | null>(dateTimeNow);
  const [endDate, setEndDate] = useState<DateTime | null>(dateTimeNow);
  const [days, setDays] = useState<number>();
  const [vacationData, setVacationData] = useState<VacationData>({
    type: "VACATION",
    message: "",
    startDate: dateTimeNowString,
    endDate: dateTimeNowString,
    days: 1
  });
  const { createVacationRequest } = CreateVacationRequest();

  /**
   * Calculate time difference between startDate and endDate and assign it to days,
   * and set endDate as startDate if startDate is ahead of endDate,
   * and set days to 1 if startDate and endDate are equal
   * (in case user requests for a one-day vacation)
   */
  useEffect(() => {
    if (startDate && endDate) {
      if (startDate > endDate) {
        setEndDate(startDate);
      }
      if (startDate === endDate) {
        setDays(1);
      } else {
        const diff = endDate.diff(startDate, ["days"]);
        setDays(Number(Math.round(diff.days)));
      }
    }
  }, [startDate, endDate]);

  /**
   * Update created vacation request object
   */
  useEffect(() => {
    const tempVacationData: VacationData = {
      type: getLocalizedVacationType(type),
      message: message,
      startDate: startDate?.toJSDate(),
      endDate: endDate?.toJSDate(),
      days: days
    };
    setVacationData(tempVacationData);
  }, [type, message, startDate, endDate, days]);

  /**
   * Handle submit
   */
  const handleSubmit = () => {
    // TODO: Vacation data validation
    createVacationRequest(vacationData);
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
                handleSubmit();
              }}
            >
              <FormControl sx={{ width: "100%" }}>
                <FormLabel>Vacation Type</FormLabel>
                <Select
                  name="type"
                  value={type}
                  onChange={(event: SelectChangeEvent<string>) => {
                    setType(event.target.value);
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
                  value={message}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setMessage(event.target.value);
                  }}
                  sx={{ marginBottom: "5px" }}
                />
                <FormLabel sx={{ marginBottom: "5px" }}>Duration</FormLabel>
                <Box
                  sx={{
                    display: "flex",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                >
                  <DatePicker
                    sx={{ width: "100%", padding: "0 5px 0 0" }}
                    label="Start Date"
                    value={startDate}
                    minDate={dateTimeNow}
                    onChange={(newValue) => setStartDate(newValue)}
                  />
                  <DatePicker
                    sx={{ width: "100%", padding: "0 0 0 5px" }}
                    label="End Date"
                    value={endDate}
                    minDate={startDate}
                    onChange={(newValue) => setEndDate(newValue)}
                  />
                </Box>
                <Button type="submit" variant="contained" sx={{ marginTop: "10px" }}>
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
