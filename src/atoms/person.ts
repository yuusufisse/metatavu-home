import { atom } from "jotai";
import { DailyEntry, Person, PersonTotalTime } from "../generated/client";

export const personsAtom = atom<Person[]>([]);
export const personTotalTimeAtom = atom<PersonTotalTime | undefined>(undefined);
export const personDailyEntryAtom = atom<DailyEntry | undefined>(undefined);
export const dailyEntriesAtom = atom<DailyEntry[]>([]);
