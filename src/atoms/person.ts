import { atom } from "jotai";
import { Person } from "../generated/client";

export const personAtom = atom<Person | undefined>(undefined);