import { GridRowId } from "@mui/x-data-grid";
import { SetStateAction } from "jotai";
import { Dispatch } from "react";
import { ToolbarFormModes } from "../types";

/**
 * Determine toolbar form mode props
 */
interface determineToolbarFormModeProps {
  selectedRowIds: GridRowId[] | undefined;
  formOpen: boolean;
  setToolbarFormMode: Dispatch<SetStateAction<ToolbarFormModes>>;
}

/**
 * Determine toolbar form mode
 */
export const determineToolbarFormMode = (props: determineToolbarFormModeProps) => {
  const { formOpen, selectedRowIds, setToolbarFormMode } = props;
  if (selectedRowIds) {
    switch (true) {
      case selectedRowIds.length === 0 && formOpen:
        setToolbarFormMode(ToolbarFormModes.CREATE);
        break;
      case selectedRowIds.length === 1:
        setToolbarFormMode(ToolbarFormModes.EDIT);
        break;
      default:
        setToolbarFormMode(ToolbarFormModes.NONE);
        break;
    }
  }
};
/**
 * Get toolbar title
 *
 * @param toolbarFormMode toolbar form mode
 * @returns title as string
 */
export const getToolbarTitle = (toolbarFormMode: ToolbarFormModes): string => {
  let title = "";
  switch (true) {
    case toolbarFormMode === ToolbarFormModes.CREATE:
      title = "Create a new vacation request";
      break;
    case toolbarFormMode === ToolbarFormModes.EDIT:
      title = "Edit a vacation request";
      break;
    default:
      title = "My vacation requests";
      break;
  }
  return title;
};
