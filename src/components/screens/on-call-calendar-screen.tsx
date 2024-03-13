import React from "react";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Badge } from "@mui/material";
import { DateTime } from "luxon";


// const renderCalendarView = () => {
//     if (onCallData) return onCallData.map()
// }

function ServerDay(props: PickersDayProps<DateTime> & { highlightedDays?: number[] }) {
  const { day, outsideCurrentMonth, ...other } = props;

  const isSelected = !props.outsideCurrentMonth;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🌚" : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

const OnCallCalendarScreen = () => {
  return (
    <>
      <DateCalendar displayWeekNumber={true} slots={{ day: ServerDay }} />
    </>
  );
};

export default OnCallCalendarScreen;
