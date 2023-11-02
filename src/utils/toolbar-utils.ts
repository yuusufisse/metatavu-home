import { GridRowId } from "@mui/x-data-grid";
import { ToolbarFormModes } from "../types";
import strings from "../localization/strings";

/**
 * DetermineToolbarFormMode properties
 */
interface DetermineToolbarFormModeProps {
  selectedRowIds: GridRowId[];
  formOpen: boolean;
  setToolbarFormMode: (toolbarFormMode: ToolbarFormModes) => void;
}

/**
 * Determine toolbar form mode
 *
 * @param props utility properties
 */
export const determineToolbarFormMode = ({
  formOpen,
  selectedRowIds,
  setToolbarFormMode
}: DetermineToolbarFormModeProps) => {
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
    }
  }
};

/**
 * Get toolbar title
 *
 * @param toolbarFormMode toolbar form mode
 * @returns title as string
 */
export const getToolbarTitle = (toolbarFormMode: ToolbarFormModes) =>
  ({
    [ToolbarFormModes.CREATE]: strings.tableToolbar.createRequests,
    [ToolbarFormModes.EDIT]: strings.tableToolbar.editRequests,
    [ToolbarFormModes.NONE]: strings.tableToolbar.myRequests
  })[toolbarFormMode];
