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

const TableForm = () => {
  const [type, setType] = useState<string>(VacationType.VACATION);
  const [message, setMessage] = useState<string>("");
  const [startDate, setStartDate] = useState<DateTime | null>(DateTime.now());
  const [endDate, setEndDate] = useState<DateTime | null>(DateTime.now());
  const [days, setDays] = useState<number>();
  const [createdVacation, setCreatedVacation] = useState<CreatedVacation>({
    type: "VACATION",
    message: "",
    startDate: DateTime.now().toJSDate(),
    endDate: DateTime.now().toJSDate(),
    days: 0
  });

  /**
   * Calculate time difference between startDate and endDate and assign it to days state
   */
  useEffect(() => {
    let diff;
    if (startDate && endDate) {
      if (startDate > endDate) {
        setEndDate(startDate);
      }
      diff = endDate.diff(startDate, ["days"]);
      setDays(Number(Math.round(diff.days)));
    }
  }, [startDate, endDate]);

  /**
   * Update created vacation request object
   */
  useEffect(() => {
    if (type && message && startDate && endDate && days) {
      const tempCreatedVacation: VacationData = {
        type: getLocalizedVacationType(type) || "VACATION",
        message: message,
        startDate: startDate?.toJSDate(),
        endDate: endDate?.toJSDate(),
        days: days
      };
      setCreatedVacation(tempCreatedVacation);
    }
  }, [type, message, startDate, endDate, days]);

  const handleSubmit = () => {
    console.log(JSON.stringify(createdVacation));
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
                    minDate={DateTime.now()}
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
          {/* <Grid
            item
            xs={6}
            sx={{
              padding: "10px"
            }}
          >
            <Typography
              variant="body1"
              color={"grey"}
              sx={{
                marginBottom: "5px"
              }}
            >
              This is how your request body looks like:
            </Typography>
            <Paper
              sx={{
                padding: "20px",
                overflow: "hidden",
                whiteSpace: "nowrap"
              }}
            >
              <pre style={{ textOverflow: "ellipsis" }}>
                {JSON.stringify(createdVacation, null, 2)}
              </pre>
            </Paper>
          </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
};

export default TableForm;
