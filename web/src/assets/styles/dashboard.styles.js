import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 300;

export const useDashboardStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  paperWrapper: {
    minHeight: "60vh",
    padding: theme.spacing(3),
    position: "relative",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "center",
  },
  activeLink: {
    backgroundColor: theme.palette.action.selected,
  },
}));
