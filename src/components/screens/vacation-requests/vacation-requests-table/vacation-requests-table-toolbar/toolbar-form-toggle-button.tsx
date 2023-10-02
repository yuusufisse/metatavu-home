import { Variant } from "@mui/material/styles/createTypography";
import { ComponentType, Dispatch, ReactNode, SetStateAction } from "react";
import { ButtonIconProps } from "../../../../../types";
import { Button, Typography } from "@mui/material";

/**
 * Component properties
 */
interface FormToggleButtonProps {
  children?: ReactNode;
  buttonVariant?: "text" | "contained" | "outlined";
  titleVariant?: Variant;
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  ButtonIcon?: ComponentType<ButtonIconProps>;
  title?: string;
}

/**
 * Generic Toggle Button component
 *
 * @param props FormToggleButtonProps
 */
const FormToggleButton = ({
  children,
  value,
  setValue,
  ButtonIcon,
  title,
  titleVariant,
  buttonVariant
}: FormToggleButtonProps) => {
  return (
    <Button
      variant={buttonVariant ? buttonVariant : "contained"}
      onClick={() => {
        setValue(!value);
      }}
      sx={{
        width: "100%"
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

export default FormToggleButton;
