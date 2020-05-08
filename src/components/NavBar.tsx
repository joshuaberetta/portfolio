import React from "react";
import { Grid, Typography, makeStyles, Link } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { NAV } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles({
  root: {
    padding: 50,
    paddingLeft: 200,
    paddingRight: 200,
  },
  logo: {
    color: COLOURS.secondary,
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "bold",
  },
  links: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.secondary,
    "&:hover": {
      color: COLOURS.blue,
    },
  },
});

const NavBar: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

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
          direction="row"
          justify="center"
          alignItems="center"
          spacing={5}
        >
          {NAV.links.map((link) => {
            let colour;
            if (link.title === "/work") {
              colour = COLOURS.blue;
            }

            return (
              <Grid item>
                <Link
                  underline="none"
                  component="button"
                  onClick={() => history.push(link.href)}
                >
                  <Typography
                    className={classes.links}
                    style={{ color: colour ? colour : "none" }}
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
