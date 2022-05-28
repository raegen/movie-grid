import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { FC } from "react";
import { useMovies } from "../../hooks/useMovies";

export const ComboBox: FC<{
  onChange: (value: string | null) => void;
}> = ({ onChange }) => {
  const { data } = useMovies();
  const options = React.useMemo(
    () =>
      Array.from(new Set((data?.items || []).map(({ title }) => title))).map(
        (keyword) => ({ label: keyword })
      ),
    [data]
  );
  return (
    <Autocomplete
      disablePortal
      options={options}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField key={params.id} {...params} label="Search" />
      )}
      onChange={(_event, value) => onChange(value?.label || '')}
    />
  );
};
