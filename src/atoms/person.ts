import { atom } from "jotai";
import type { DailyEntry, Person, PersonTotalTime } from "../generated/client";
import type { DailyEntryWithIndexSignature, PersonWithTotalTime } from "../types";
import type { Allocations, Projects, UsersAvatars } from "src/generated/homeLambdasClient";

export const personsAtom = atom<Person[]>([]);
export const personTotalTimeAtom = atom<PersonTotalTime | undefined>(undefined);
export const personsWithTotalTimeAtom = atom<PersonWithTotalTime[]>([]);
export const timebankScreenPersonTotalTimeAtom = atom<PersonTotalTime | undefined>(undefined);
export const personDailyEntryAtom = atom<DailyEntryWithIndexSignature | undefined>(undefined);
export const dailyEntriesAtom = atom<DailyEntry[]>([]);
export const avatarsAtom = atom<UsersAvatars[]>([]);
export const timeEntriesAtom = atom<number[]>([]);
export const allocationsAtom = atom<Allocations[]>([]);
export const projectsAtom = atom<Projects[]>([]);