import { atom } from "jotai";
import { VacationRequestStatus } from "../generated/client";

export const vacationRequestStatusesAtom = atom<VacationRequestStatus[] | undefined>(undefined);