import { atom } from "jotai";
import { Person } from "../generated/client";

export const personsAtom = atom<Person[] | undefined>(undefined);