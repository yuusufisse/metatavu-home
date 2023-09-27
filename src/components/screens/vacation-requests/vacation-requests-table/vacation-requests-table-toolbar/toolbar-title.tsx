import { useEffect, useState } from "react";
import { ToolbarFormModes } from "../../../../../types";
import { Typography } from "@mui/material";

/**
 * Component props
 */
interface ToolbarTitleProps {
  toolbarFormMode: ToolbarFormModes;
}

/**
 * Toolbar title component
 */
const ToolbarTitle = (props: ToolbarTitleProps) => {
  const { toolbarFormMode } = props;
  const [title, setTitle] = useState<string>("My vacation requests");
  useEffect(() => {
    if (toolbarFormMode) {
      switch (true) {
        case toolbarFormMode === ToolbarFormModes.CREATE:
          setTitle("Create a new vacation request");
          break;
        case toolbarFormMode === ToolbarFormModes.EDIT:
          setTitle("Edit a vacation request");
          break;
        default:
          setTitle("My vacation requests");
          break;
      }
    }
  }, [toolbarFormMode]);
  return <Typography variant="h5">{title}</Typography>;
};

export default ToolbarTitle;
