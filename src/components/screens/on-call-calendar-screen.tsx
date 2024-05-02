import React, { useEffect, useState } from "react";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import {
  Badge,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import { DateTime } from "luxon";
import { useLambdasApi } from "../../hooks/use-api";
import { oncallAtom } from "../../atoms/oncall";
import { useAtom, useSetAtom } from "jotai";
import { errorAtom } from "../../atoms/error";
import strings from "../../localization/strings";
import { stringToColor } from "../../utils/oncall-utils";
import { OnCallCalendarEntry } from "../../types";
import OnCallHandler from "../contexts/oncall-handler";
import OnCallListView from "../oncall-calendars/oncall-list-view";
import { OnCallPaid } from "src/generated/homeLambdasClient";

const OnCallCalendarScreen = () => {
  const { onCallApi } = useLambdasApi();
  const [onCallData, setOnCallData] = useAtom(oncallAtom);
  const [open, setOpen] = useState(false);
  const [isCalendarView, setIsCalendarView] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(DateTime.now().year);
  const [onCallPerson, setOnCallPerson] = useState("");
  const [selectedOnCallEntry, setSelectedOnCallEntry] = useState<OnCallCalendarEntry>();
  const setError = useSetAtom(errorAtom);

  useEffect(() => {
    getOnCallData(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    getCurrentOnCallPerson();
  }, [onCallData]);

  const getOnCallData = async (year: number) => {
    try {
      const fetchedData = await onCallApi.listOnCallData({ year: year.toString() });
      setOnCallData(fetchedData);
    } catch (error) {
      setError(`${strings.error.fetchFailedGeneral}, ${error}`);
    }
  };

  const getCurrentOnCallPerson = () => {
    if (selectedYear === DateTime.now().year) {
      const currentWeek = DateTime.now().weekNumber;
      const currentOnCallPerson = onCallData.find(
        (item) => Number(item.Week) === currentWeek
      )?.Person;

      if (currentOnCallPerson) setOnCallPerson(currentOnCallPerson);
    }
  };

  const generateOnCallWeeks = () => {
    const onCallWeeks: OnCallCalendarEntry[] = [];
    console.log(onCallData)
    onCallData.forEach((item) => {
      const weeks = DateTime.fromObject({ weekNumber: item.week, weekYear: selectedYear });

      for (let i = 0; i < 7; i++) {
        onCallWeeks.push({
          date: weeks.plus({ days: i }).toISODate(),
          person: item.person,
          paid: item.paid,
          badgeColor: stringToColor(item.person)
        });
      }
    });
    return onCallWeeks;
  };

  const updatePaidStatus = async (entry: OnCallCalendarEntry) => {
    if (entry.date) {
      const weekNumber = DateTime.fromISO(entry.date).weekNumber;
      const year = DateTime.fromISO(entry.date).year;
      const updateParameters: OnCallPaid = {
        year: year,
        week: weekNumber,
        paid: !entry.paid,
      };
      await onCallApi.updatePaid({ onCallPaid : updateParameters });
      getOnCallData(year);
    }
  };

  const renderCurrentOnCall = () => {
    if (onCallPerson)
      return (
        <Typography sx={{ textAlign: "center" }}>Current on-call person: {onCallPerson}</Typography>
      );

    return <Typography sx={{ textAlign: "center" }}>No on call person this week</Typography>;
  };
  const populateCalendarWeeks = (
    props: PickersDayProps<DateTime> & { highlightedDays?: number[] }
  ) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const calendarProps = generateOnCallWeeks();
    console.log(calendarProps)
    const badgeColor = calendarProps.find((item) => item.date === day.toISODate())?.badgeColor;
    const populatedDay = calendarProps.map((item) => item.date).includes(day.toISODate());
    const personName = calendarProps.filter((item) => item.date === day.toISODate())[0]?.person;
    const personInitials = personName?.split(" ")[0][0] + personName?.split(" ")[1][0];
    const paidStatus = calendarProps.filter((item) => item.date === day.toISODate())[0]?.paid;

    return (
      <Box>
        <Badge
          key={props.day.toString()}
          overlap={"circular"}
          sx={{ color: "black", ".MuiBadge-overlapCircular": { backgroundColor: badgeColor } }}
          badgeContent={populatedDay ? personInitials : undefined}
        >
          <PickersDay
            onClick={() => selectEntryToUpdate(calendarProps, day)}
            sx={paidStatus ? { color: "green", fontWeight: "bold" } : {}}
            {...other}
            outsideCurrentMonth={outsideCurrentMonth}
            day={day}
          />
        </Badge>
      </Box>
    );
  };

  const handleCalendarViewChange = (toggle: boolean) => {
    setIsCalendarView(toggle);
  };

  const renderCalendarOrList = () => {
    if (isCalendarView)
      return (
        <DateCalendar
          onMonthChange={(value) => setSelectedYear(value.year)}
          onYearChange={(value) => setSelectedYear(value.year)}
          displayWeekNumber={true}
          slots={{ day: populateCalendarWeeks }}
        />
      );

    return <OnCallListView selectedYear={selectedYear} updatePaid={updatePaidStatus} />;
  };

  const selectEntryToUpdate = (onCallEntries: OnCallCalendarEntry[], date: DateTime) => {
    const selectedEntry = onCallEntries.find((item) => item.date === date.toISODate());
    setSelectedOnCallEntry(selectedEntry);
    setOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <FormControl sx={{ width: "50%", textAlign: "center", margin: "auto" }}>
        <InputLabel id="calendarSelect">Select calendar view</InputLabel>
        <Select
          labelId="calendarSelect"
          id="calendarSelect"
          label="Select calendar view"
          value={isCalendarView ? "Calendar" : "List"}
        >
          <MenuItem value={"Calendar"} onClick={() => handleCalendarViewChange(true)}>
            Calendar
          </MenuItem>
          <MenuItem value={"List"} onClick={() => handleCalendarViewChange(false)}>
            List
          </MenuItem>
        </Select>
      </FormControl>
      <OnCallHandler
        open={open}
        setOpen={setOpen}
        onCallEntry={selectedOnCallEntry}
        updatePaidStatus={updatePaidStatus}
      />
      {renderCalendarOrList()}
      {renderCurrentOnCall()}
    </Box>
  );
};

export default OnCallCalendarScreen;
