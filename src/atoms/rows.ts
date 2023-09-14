import { atom } from "jotai";
import { DataGridRow } from "../types/data-types";

export const rowsAtom = atom<DataGridRow[]>([]);
