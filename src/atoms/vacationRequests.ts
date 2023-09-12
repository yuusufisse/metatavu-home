import { atom } from "jotai";
import { VacationRequest } from "../generated/client";

export const vacationRequestsAtom = atom<VacationRequest[] | undefined>(undefined);