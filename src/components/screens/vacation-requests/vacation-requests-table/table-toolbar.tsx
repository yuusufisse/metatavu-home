import { Add, Cancel, Delete, Edit } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { selectedRowIdsAtom } from "../../../../atoms/selectedRowIds";
import DeleteVacationRequests from "../delete-vacation-requests";
import TableForm from "./table-form";

const TableToolbar = () => {
  const [toolbarOpen, setToolbarOpen] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const selectedRows = useAtomValue(selectedRowIdsAtom);
  const { deleteVacationRequests } = DeleteVacationRequests();

  useEffect(() => {
    if (selectedRows.length) {
      setToolbarOpen(true);
    } else {
      setToolbarOpen(false);
    }
  }, [selectedRows]);

  return (
    <Box
      sx={{
        border: "1px solid lightgrey",
        m: "0"
      }}
    >
      {toolbarOpen ? (
        <Grid container alignContent="space-around" alignItems="center">
          {selectedRows.length === 1 ? (
            <Grid
              item
              xs={6}
              sx={{
                p: "10px"
              }}
            >
              <Button
                variant="contained"
                sx={{
                  width: "100%"
                }}
              >
                <Edit />
                <Typography variant="h6">&nbsp;Edit</Typography>
              </Button>
            </Grid>
          ) : null}
          <Grid
            item
            xs={selectedRows.length === 1 ? 6 : 12}
            sx={{
              p: "10px"
            }}
          >
            <Button
              variant="contained"
              sx={{
                width: "100%"
              }}
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
        <Grid container alignContent="space-around" alignItems="center">
          <Grid
            item
            xs={6}
            sx={{
              p: "10px"
            }}
          >
            <Typography variant="h5">My Vacation Requests</Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              p: "10px"
            }}
          >
            {formOpen ? (
              <Button
                variant="outlined"
                sx={{
                  width: "100%"
                }}
                onClick={() => {
                  setFormOpen(false);
                }}
              >
                <Cancel />
                <Typography variant="h6">&nbsp;Cancel</Typography>
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  width: "100%"
                }}
                onClick={() => {
                  setFormOpen(true);
                }}
              >
                <Add />
                <Typography variant="h6">&nbsp;Create new</Typography>
              </Button>
            )}
          </Grid>
        </Grid>
      )}
      {formOpen ? <TableForm /> : null}
    </Box>
  );
};

export default TableToolbar;
