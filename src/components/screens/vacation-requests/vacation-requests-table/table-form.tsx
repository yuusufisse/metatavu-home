import { Box, Divider, FormControl, FormLabel, Select, TextField } from "@mui/material";
import { VacationType } from "../../../../generated/client";

import { ChangeEvent, useEffect, useState } from "react";

const TableForm = () => {
  const [message, setMessage] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [type, setType] = useState<VacationType>("VACATION");
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
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setType(event.target.value);
              }}
            />
            <FormLabel>Message</FormLabel>
            <TextField
              value={message}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setMessage(event.target.value);
              }}
            />
          </FormControl>
        </form>
      </Box>
    </Box>
  );
};

export default TableForm;
