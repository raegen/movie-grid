import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { FC } from "react";
import { useMovies } from "../../hooks/useMovies";

export const ComboBox: FC<{
  onChange: (value: string | null) => void;
}> = ({ onChange }) => {
  const { data, isFetching } = useMovies();
  const options = React.useMemo(
    () =>
      Array.from(new Set((data?.items || []).map(({ title }) => title))),
    [data]
  );
  return (
    <Autocomplete
      disablePortal
      options={options}
      sx={{ width: 300 }}
      loading={isFetching}
      freeSolo={true}
      renderInput={(params) => (
        <TextField {...params} label="Search" />
      )}
      onChange={(_event, value) => onChange(value || '')}
    />
  );
};
