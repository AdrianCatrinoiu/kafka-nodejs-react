import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import theme from "./assets/styles/theme.style";
import { store } from "./store";
import Dashboard from "./layouts/Dashboard";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";
import User from "./containers/User";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <Dashboard>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/login" element={<Login />} />
              {/* protected routes */}
              <Route exact path="/user" element={<User />} />
            </Routes>
          </Dashboard>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
