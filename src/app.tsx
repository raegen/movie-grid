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
import { FC, PropsWithChildren } from "react";
import { QueryProvider } from "./hooks";
import { Movies } from "./movies";
import { columnFill } from "./style";

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
        <Container
            sx={columnFill}
          >
            <Movies />
        </Container>
      </QueryProvider>
    </Theme>
  );
};

export default App;
