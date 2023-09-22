import { atom } from "jotai";
import { DataGridRow } from "../types";

export const rowsAtom = atom<DataGridRow[]>([]);
