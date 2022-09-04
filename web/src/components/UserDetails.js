import React, { Fragment } from "react";
import { Typography } from "@material-ui/core";

export default function UserDetails(userData) {
  const user = userData.userData;
  return (
    <Fragment>
      <Typography variant="h6">ID : {user?.id}</Typography>
      <Typography variant="h6">Name : {user?.name}</Typography>
      <Typography variant="h6">Email : {user?.email}</Typography>
    </Fragment>
  );
}
