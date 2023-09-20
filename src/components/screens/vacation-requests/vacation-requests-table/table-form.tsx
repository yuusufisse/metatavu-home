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

const TableForm = () => {
  const [message, setMessage] = useState<string>("");
  const [startDate, setStartDate] = useState<DateTime | null>(DateTime.now());
  const [endDate, setEndDate] = useState<DateTime | null>(DateTime.now());
  const [type, setType] = useState<string>("VACATION");
  const [days, setDays] = useState<number>(0);

  /**
   * Calculate time difference between startDate and endDate and assign it to days state
   */
  useEffect(() => {
    let diff;
    if (startDate && endDate) {
      diff = endDate.diff(startDate, ["days"]);
      setDays(diff.days);
    }
  }, [startDate, endDate]);

  return (
    <Box
      sx={{
        width: "100%"
      }}
    >
      <Divider />
      <Box sx={{ padding: "10px" }}>
        <form>
          <FormControl>
            <FormLabel>Vacation Type</FormLabel>
            <Select
              value={type}
              onChange={(event: SelectChangeEvent<string>) => {
                setType(event.target.value);
              }}
              sx={{ marginBottom: "5px" }}
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
            <Grid container>
              <DatePicker
                label="Start Date"
                value={startDate}
                minDate={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                minDate={startDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </Grid>
            <Button type="submit" variant="contained" sx={{ marginTop: "10px" }}>
              Submit
            </Button>
          </FormControl>
        </form>
      </Box>
    </Box>
  );
};

export default TableForm;
