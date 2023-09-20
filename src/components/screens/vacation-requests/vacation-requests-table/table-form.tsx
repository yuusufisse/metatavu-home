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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

const TableForm = () => {
  const [message, setMessage] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [type, setType] = useState<string>("VACATION");
  const [days, setDays] = useState<number>(0);

  useEffect(() => {}, []);

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
                  return <MenuItem value={vacationType}>{vacationType}</MenuItem>;
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
            <LocalizationProvider />
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
