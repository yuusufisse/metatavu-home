import { Variant } from "@mui/material/styles/createTypography";
import { ComponentType, Dispatch, ReactNode, SetStateAction } from "react";
import { ButtonIconProps } from "../../types";
import { Button, Typography } from "@mui/material";

/**
 * Interface describing FormOpen Toggle Button properties
 */
interface ToggleButtonProps {
  children?: ReactNode;
  buttonVariant?: "text" | "contained" | "outlined";
  titleVariant?: Variant;
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  ButtonIcon?: ComponentType<ButtonIconProps>;
  title?: string;
}
/**
 * FormOpen Toggle Button component
 *
 * @param props CreateNewButtonProps
 */
const GenericToggleButton = (props: ToggleButtonProps) => {
  const { children, value, setValue, ButtonIcon, title, titleVariant, buttonVariant } = props;
  return (
    <Button
      variant={buttonVariant ? buttonVariant : "contained"}
      sx={{
        width: "100%"
      }}
      onClick={() => {
        if (value) {
          setValue(false);
        } else {
          setValue(true);
        }
      }}
    >
      {ButtonIcon ? <ButtonIcon /> : null}
      {title ? (
        <Typography variant={titleVariant ? titleVariant : "h6"}>&nbsp;{title}</Typography>
      ) : null}
      {children}
    </Button>
  );
};

export default GenericToggleButton;
