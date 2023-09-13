import { atom } from "jotai";
import { Person, PersonTotalTime } from "../generated/client";

export const personAtom = atom<Person | undefined>(undefined);
export const personTotalTimeAtom = atom<PersonTotalTime | undefined>(undefined);