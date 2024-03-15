import React, { useEffect, useState } from "react";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { Badge, Box, Button, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { useApi } from "../../hooks/use-api";
import { oncallAtom } from "../../atoms/oncall";
import { useAtom, useSetAtom } from "jotai";
import { errorAtom } from "../../atoms/error";
import strings from "../../localization/strings";
import { stringToColor } from "../../utils/oncall-utils";
import { OnCallCalendarEntry } from "../../types";

const OnCallCalendarScreen = () => {
  const { onCallApi } = useApi();
  const [onCallData, setOnCallData] = useAtom(oncallAtom);
  const [selectedYear, setSelectedYear] = useState<number>(DateTime.now().year);
  const setError = useSetAtom(errorAtom);

  const getOnCallData = async (year: number) => {
    try {
      const fetchedData = await onCallApi.listOnCallData({ year: year.toString() });
      setOnCallData(fetchedData);
    } catch (error) {
      setError(`${strings.error.fetchFailedGeneral}, ${error}`);
    }
    console.log(onCallData);
  };

  useEffect(() => {
    getOnCallData(selectedYear);
  }, [selectedYear]);

  const generateCalendarProps = () => {
    const daysOfTheWeek: OnCallCalendarEntry[] = [];
    onCallData.forEach((item) => {
      const weeks = DateTime.fromObject({ weekNumber: Number(item.Week), weekYear: selectedYear });

      for (let i = 0; i < 7; i++) {
        daysOfTheWeek.push({
          date: weeks.plus({ days: i }).toISODate(),
          person: item.Person,
          paid: item.Paid,
          badgeColor: stringToColor(item.Person)
        });
      }
    });
    return daysOfTheWeek;
  };

  const renderCurrentOnCall = () => {
    const currentWeek = DateTime.local().weekNumber;
    const currentOnCallPerson = onCallData.find(
      (item) => Number(item.Week) === currentWeek
    )?.Person;

    if (currentOnCallPerson)
      return (
        <Typography sx={{ textAlign: "center" }}>
          Current on-call person: {currentOnCallPerson}
        </Typography>
      );
    else return <Typography sx={{ textAlign: "center" }}>No on call person this week</Typography>;
  };

  const populateCalendarWeekDays = (
    props: PickersDayProps<DateTime> & { highlightedDays?: number[] }
  ) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const calendarProps = generateCalendarProps();
    const badgeColor = calendarProps.find((item) => item.date === day.toISODate())?.badgeColor;
    const populatedDay = calendarProps.map((item) => item.date).includes(day.toISODate());
    const personName = calendarProps.filter((item) => item.date === day.toISODate())[0]?.person;
    const personInitials = personName?.split(" ")[0][0] + personName?.split(" ")[1][0];
    const paidStatus = calendarProps.filter((item) => item.date === day.toISODate())[0]?.paid;
    const paid = <Typography sx={{ color: "green", fontSize: 10 }}>€</Typography>;

    return (
      <Box>
        <Badge
          key={props.day.toString()}
          overlap={"circular"}
          sx={{ color: "black", ".MuiBadge-overlapCircular": { backgroundColor: badgeColor } }}
          badgeContent={populatedDay ? personInitials : undefined}
        >
          <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <DateCalendar
        onMonthChange={(value) => setSelectedYear(value.year)}
        onYearChange={(value) => setSelectedYear(value.year)}
        displayWeekNumber={true}
        slots={{ day: populateCalendarWeekDays }}
      />
      {renderCurrentOnCall()}
      <Button
        onClick={() => console.log(onCallData.find((item) => Number(item.Week) === 10)?.Person)}
      >
        TEST
      </Button>
    </Box>
  );
};

export default OnCallCalendarScreen;
