import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Drawer,
  AppBar,
  Paper,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemText,
  Grid,
} from "@material-ui/core";

import { useDashboardStyles } from "../assets/styles/dashboard.styles";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";

export default function Dashboard({ children }) {
  const classes = useDashboardStyles();
  const user = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut());

      navigate("/");
    } catch (err) {
      console.error("Logout error", err);
    }
  };
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Grid container>
            <Grid container item justify="space-between" xs={6}>
              <Typography variant="h6" noWrap>
                Coremaker technical challenge
              </Typography>
            </Grid>
            <Grid container item justify="flex-end" xs={6}>
              <Typography variant="h6" noWrap></Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.drawerHeader}>
          <Typography>Menu</Typography>
        </div>

        <Divider />
        <List>
          <ListItem
            button
            component={NavLink}
            to="/"
            exact
            activeClassName={classes.activeLink}
          >
            <ListItemText primary={"Home"} />
          </ListItem>

          {!user && (
            <ListItem
              button
              component={NavLink}
              to="/register"
              exact
              activeClassName={classes.activeLink}
            >
              <ListItemText primary={"Register"} />
            </ListItem>
          )}
          {!user && (
            <ListItem
              button
              component={NavLink}
              to="/login"
              exact
              activeClassName={classes.activeLink}
            >
              <ListItemText primary={"Login"} />
            </ListItem>
          )}
          {user && (
            <ListItem
              button
              component={NavLink}
              to="/user"
              exact
              activeClassName={classes.activeLink}
            >
              <ListItemText primary={"User"} />
            </ListItem>
          )}
        </List>
        {user && (
          <>
            <Divider />
            <List>
              <ListItem button onClick={() => handleLogout()}>
                <ListItemText primary={"Logout"} />
              </ListItem>
            </List>
          </>
        )}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Paper variant="outlined" className={classes.paperWrapper}>
          {children}
        </Paper>
      </main>
    </div>
  );
}
