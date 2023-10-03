import { useEffect, useState } from "react";
import { ToolbarFormModes } from "../../../../../types";
import { Typography } from "@mui/material";
import { getToolbarTitle } from "../../../../../utils/toolbar-utils";

/**
 * Component properties
 */
interface Props {
  toolbarFormMode: ToolbarFormModes;
}

/**
 * Toolbar title component
 */
const ToolbarTitle = ({ toolbarFormMode }: Props) => {
  const [title, setTitle] = useState<string>("My vacation requests");

  useEffect(() => {
    if (toolbarFormMode) {
      setTitle(getToolbarTitle(toolbarFormMode));
    }
  }, [toolbarFormMode]);
  return <Typography variant="h5">{title}</Typography>;
};

export default ToolbarTitle;
