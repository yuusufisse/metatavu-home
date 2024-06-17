import { Select, MenuItem, type SelectChangeEvent, Card, Box, FormControl } from "@mui/material";
import strings from "src/localization/strings";
import type { Person } from "src/generated/client";
/**
 *  Select component properties
 */
interface Props {
  loading: boolean;
  selectedEmployeeId: any;
  persons: Person[];
  onChange: (event: SelectChangeEvent<any>) => void;
}
/**
 * Renders the select
 */
export const renderSelect = ({
  loading,
  selectedEmployeeId,
  persons,
  onChange
}: Props) => (
  <Box sx={{ width: "40%", justifyContent: "center" }}>
    <FormControl size="small" style={{ width: "100%", float: "right" }}>
      <Select
        fullWidth
        style={{
          borderRadius: "30px",
          float: "right",
        }}
        labelId="employee-select-label"
        id="employee-select"
        value={selectedEmployeeId || ""}
        disabled={loading}
        onChange={onChange}
      >
        {persons.map((person) => (
          <MenuItem key={person.id} value={person.id}>
            {`${person.firstName} ${person.lastName}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);
