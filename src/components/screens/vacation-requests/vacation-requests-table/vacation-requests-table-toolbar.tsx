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
        m: "0"
      }}
    >
      {editorOpen ? (
        <Grid container alignContent="space-around" alignItems="center">
          {selectedRows.length === 1 ? (
            <Grid item xs={6} sx={{ p: "10px" }}>
              <Button variant="contained" sx={{ width: "100%" }}>
                <Edit />
                <Typography variant="h6">&nbsp;Edit</Typography>
              </Button>
            </Grid>
          ) : null}
          <Grid item xs={selectedRows.length === 1 ? 6 : 12} sx={{ p: "10px" }}>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
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
        <Grid item xs={12} sx={{ p: "10px", height: "64px" }}>
          <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
            <Typography variant="h5">
              {skeleton ? <Skeleton sx={{ width: "250px" }} /> : "My Vacation Requests"}
            </Typography>
          </Box>
        </Grid>
      )}
    </Box>
  );
};

export default VacationRequestsTableToolbar;
