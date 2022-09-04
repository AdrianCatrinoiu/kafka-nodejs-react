import React, { Fragment } from "react";
import { Typography } from "@material-ui/core";
import RequireAuth from "../features/auth/RequireAuth";
import UserData from "../features/user/UserData";
export default function User() {
  return (
    <RequireAuth>
      <Fragment>
        <Typography variant="h1">User Details</Typography>
        <UserData />
      </Fragment>
    </RequireAuth>
  );
}
