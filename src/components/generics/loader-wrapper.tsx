import { Backdrop, CircularProgress } from "@mui/material";
import { ReactNode } from "react";

/**
 * Components properties
 */
interface Props {
  loading: boolean;
  children: ReactNode;
}

/**
 * Loader wrapper component
 */
const LoaderWrapper = ({ loading, children }: Props) => {
  if (loading)
    return (
      <>
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
          <CircularProgress color="primary" />
        </Backdrop>
        {children}
      </>
    );

  return <>{children}</>;
};

export default LoaderWrapper;
