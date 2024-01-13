import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Sidebar from "./scenes/global/Sidebar";
import { Route, Routes } from "react-router-dom";
import Aum from "./scenes/aum";
import LivePerformance from "./scenes/live";
import Stocks from "./scenes/stocks";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Routes>
              <Route
                path="market-watcher-client"
                element={<LivePerformance />}
              />
              <Route path="market-watcher-client/stocks" element={<Stocks />} />
              <Route path="/market-watcher-client/aum" element={<Aum />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
