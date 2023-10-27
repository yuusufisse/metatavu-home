import { Variant } from "@mui/material/styles/createTypography";
import { ComponentType, ReactNode } from "react";
import { ButtonIconProps } from "../../../types";
import { Button, ButtonOwnProps, Typography } from "@mui/material";

/**
 * Component properties
 */
interface Props {
  children?: ReactNode;
  buttonVariant?: ButtonOwnProps["variant"];
  titleVariant?: Variant;
  value: boolean;
  setValue: (value: boolean) => void;
  ButtonIcon?: ComponentType<ButtonIconProps>;
  title?: string;
}

/**
 * Generic Toggle Button component
 *
 * @param props component properties
 */
const FormToggleButton = ({
  children,
  value,
  setValue,
  ButtonIcon,
  title,
  titleVariant,
  buttonVariant
}: Props) => (
  <Button
    variant={buttonVariant ? buttonVariant : "contained"}
    onClick={() => {
      setValue(!value);
    }}
    sx={{
      width: "100%"
    }}
  >
    {ButtonIcon && <ButtonIcon />}
    {title && (
      <Typography variant={titleVariant ? titleVariant : "h6"} marginLeft={1}>
        {title}
      </Typography>
    )}
    {children}
  </Button>
);

export default FormToggleButton;
