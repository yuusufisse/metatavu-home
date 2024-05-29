import { atom } from "jotai";
import { DailyEntry, Person, PersonTotalTime } from "../generated/client";
import { DailyEntryWithIndexSignature, PersonWithTotalTime } from "../types";
import { UsersAvatars } from "src/generated/homeLambdasClient";

export const personsAtom = atom<Person[]>([]);
export const personTotalTimeAtom = atom<PersonTotalTime | undefined>(undefined);
export const personsWithTotalTimeAtom = atom<PersonWithTotalTime[]>([]);
export const timebankScreenPersonTotalTimeAtom = atom<PersonTotalTime | undefined>(undefined);
export const personDailyEntryAtom = atom<DailyEntryWithIndexSignature | undefined>(undefined);
export const dailyEntriesAtom = atom<DailyEntry[]>([]);
export const avatarsAtom = atom<UsersAvatars[]>([]);