import { Delete, Edit } from "@mui/icons-material";
import { Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { selectedRowIdsAtom } from "../../../../atoms/selectedRowIds";
import DeleteVacationRequests from "../delete-vacation-requests";

interface VacationRequestsTableToolbarProps {
  skeleton?: boolean;
}

const VacationRequestsTableToolbar = (props: VacationRequestsTableToolbarProps) => {
  const { skeleton } = props;
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const selectedRows = useAtomValue(selectedRowIdsAtom);
  const { deleteVacationRequests } = DeleteVacationRequests();

  useEffect(() => {
    if (selectedRows.length) {
      setEditorOpen(true);
    } else {
      setEditorOpen(false);
    }
  }, [selectedRows]);

  return (
    <Box
      sx={{
        border: "1px solid lightgrey",
        p: "15px",
        m: "0"
      }}
    >
      {editorOpen ? (
        <Grid container alignContent="space-around">
          {selectedRows.length === 1 ? (
            <Grid item xs={6}>
              <Button>
                <Edit />
                <Typography variant="h6">&nbsp;Edit</Typography>
              </Button>
            </Grid>
          ) : (
            <Grid item xs={6} />
          )}
          <Grid item xs={6}>
            <Button
              onClick={() => {
                deleteVacationRequests();
              }}
            >
              <Delete />
              <Typography variant="h6">&nbsp;Delete</Typography>
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6">
          {skeleton ? <Skeleton sx={{ width: "250px" }} /> : "My Vacation Requests"}
        </Typography>
      )}
    </Box>
  );
};

export default VacationRequestsTableToolbar;
