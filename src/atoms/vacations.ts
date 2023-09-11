import { atom } from "jotai";
import { VacationRequest } from "../generated/client";

export const vacationsAtom = atom<VacationRequest[] | undefined>(undefined);