import { GridRowId } from "@mui/x-data-grid";
import { atom } from "jotai";

export const selectedRowIdsAtom = atom<GridRowId[]>([]);
