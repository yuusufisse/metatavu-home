import { calculateTotalVacationDays } from "src/utils/time-utils";
import { DateTime } from "luxon";
import { fromMonToFri, fromMonToFriNotMonWed, fromMonToFriNotWed, nonWeeekWorker, oneDayWorker } from "./mocks/working-weeks-mock";
import { fullTimeWorkerTestCases, nonWeeekWorkerTestCases, oneDayWorkerTestCases, partTimeWorkerNotMonWedTestCases, partTimeWorkerNotWedTestCases } from "./mocks/vacations-days-mock"

describe("Test vacation days calculation function", () => {
  describe.each(fullTimeWorkerTestCases)("Test full-time worker (from Mon-Fri)", (startDate, endDate, expected) => {
    test(`From ${startDate} to ${endDate} expect ${expected}`, () => {
      expect(calculateTotalVacationDays(DateTime.fromISO(startDate.toString()), DateTime.fromISO(endDate.toString()), fromMonToFri)).toBe(expected);
    });
  });
  describe.each(partTimeWorkerNotWedTestCases)("Test part-time worker (from Mon-Fri, and not on Wed)", (startDate, endDate, expected) => {
    test(`From ${startDate} to ${endDate} expect ${expected}`, () => {
      expect(calculateTotalVacationDays(DateTime.fromISO(startDate.toString()), DateTime.fromISO(endDate.toString()), fromMonToFriNotWed)).toBe(expected);
    });
  });
  describe.each(partTimeWorkerNotMonWedTestCases)("Test part-time worker (from Mon-Fri, and not on Mon, Wed)", (startDate, endDate, expected) => {
    test(`From ${startDate} to ${endDate} expect ${expected}`, () => {
      expect(calculateTotalVacationDays(DateTime.fromISO(startDate.toString()), DateTime.fromISO(endDate.toString()), fromMonToFriNotMonWed)).toBe(expected);
    });
  });
  describe.each(oneDayWorkerTestCases)("Test one-day worker (on Wed)", (startDate, endDate, expected) => {
    test(`From ${startDate} to ${endDate} expect ${expected}`, () => {
      expect(calculateTotalVacationDays(DateTime.fromISO(startDate.toString()), DateTime.fromISO(endDate.toString()), oneDayWorker)).toBe(expected);
    });
  });
  describe.each(nonWeeekWorkerTestCases)("Test non-week worker", (startDate, endDate, expected) => {
    test(`From ${startDate} to ${endDate} expect ${expected}`, () => {
      expect(calculateTotalVacationDays(DateTime.fromISO(startDate.toString()), DateTime.fromISO(endDate.toString()), nonWeeekWorker)).toBe(expected);
    });
  });
})