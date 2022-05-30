import TheatersIcon from "@mui/icons-material/Theaters";
import {
  AppBar,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography
} from "@mui/material";
import { FC, PropsWithChildren, useState } from "react";
import { QueryProvider } from "./hooks";
import { Sort } from "./hooks/useMovies";
import { Movies } from "./movies";
import { ComboBox } from "./movies/search";

const Theme: FC<PropsWithChildren<{}>> = ({ children }) => {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#00c8b4",
      },
      secondary: {
        main: "#ec407a",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export const App = () => {
  return (
    <Theme>
      <QueryProvider>
        <AppBar position="relative">
          <Toolbar>
            <TheatersIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
              Movie Grid
            </Typography>
          </Toolbar>
        </AppBar>
        <main style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Container
            style={{ display: "flex", flexDirection: "column", flex: 1 }}
          >
            <Movies />
          </Container>
        </main>
      </QueryProvider>
    </Theme>
  );
};

export default App;
