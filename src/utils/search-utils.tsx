import { Search } from "@mui/icons-material";
import { Box, TextField, InputAdornment } from "@mui/material";
import type { ChangeEvent } from "react";
import strings from "src/localization/strings";

/**
 *  Search component properties
 */
interface Props {
  loading: boolean;
  searchInput: string;
  handleSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Renders the search
 */
export const renderSearch = ({ loading, searchInput, handleSearchInputChange }: Props) => (
  <Box sx={{ display: "flex", justifyContent: "center" }}>
    <TextField
      value={searchInput}
      onChange={handleSearchInputChange}
      placeholder={strings.timebank.searchPlaceholder}
      variant="standard"
      disabled={loading}
      sx={{ width: "99%", padding: 1 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        )
      }}
    />
  </Box>
);
