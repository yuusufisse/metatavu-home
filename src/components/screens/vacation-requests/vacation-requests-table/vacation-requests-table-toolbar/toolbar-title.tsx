import { useEffect, useState } from "react";
import { ToolbarFormModes } from "../../../../../types";
import { Typography } from "@mui/material";
import { getToolbarTitle } from "../../../../../utils/toolbar-utils";

/**
 * Component props
 */
interface ToolbarTitleProps {
  toolbarFormMode: ToolbarFormModes;
}

/**
 * Toolbar title component
 */
const ToolbarTitle = ({ toolbarFormMode }: ToolbarTitleProps) => {
  const [title, setTitle] = useState<string>("My vacation requests");

  useEffect(() => {
    if (toolbarFormMode) {
      setTitle(getToolbarTitle(toolbarFormMode));
    }
  }, [toolbarFormMode]);
  return <Typography variant="h5">{title}</Typography>;
};

export default ToolbarTitle;
