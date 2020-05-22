import React, { useContext } from "react";
import { Grid, Typography, makeStyles, Link } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { NAV } from "../shared/content";
import { COLOURS } from "../shared/colours";
import { LocationContext } from "../shared/context/LocationContext";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 50,
    paddingLeft: 200,
    paddingRight: 200,
    [theme.breakpoints.down("sm")]: {
      paddingRight: 100,
      paddingLeft: 100,
    },
  },
  logo: {
    color: COLOURS.secondary,
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "bold",
    // "&:hover": {
    //   color: COLOURS.blue,
    // },
  },
  links: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.secondary,
    "&:hover": {
      color: COLOURS.blue,
    },
  },
  active: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.blue,
  },
}));

const NavBar: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const locationContext = useContext(LocationContext);

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.root}
    >
      <Grid item>
        <Link
          underline="none"
          component="button"
          onClick={() => history.push(NAV.title.href)}
        >
          <Typography variant="h5" className={classes.logo}>
            {NAV.title.title}
          </Typography>
        </Link>
      </Grid>
      <Grid item>
        <Grid
          container
          item
          direction="row"
          justify="center"
          alignItems="center"
          spacing={5}
          xs={12}
        >
          {NAV.links.map((link) => {
            return (
              <Grid item xs={4}>
                <Link
                  underline="none"
                  component="button"
                  onClick={() => history.push(link.href)}
                >
                  <Typography
                    // className={classes.links}
                    className={
                      link.title === locationContext.location
                        ? classes.active
                        : classes.links
                    }
                  >
                    {link.title}
                  </Typography>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NavBar;
