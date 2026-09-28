import React, { useContext } from "react";
import { Grid, Typography, Link } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useNavigate } from "react-router";

import { NAV } from "../shared/content";
import { SITE } from "../shared/siteContent";
import { COLOURS } from "../shared/colours";
import { LocationContext } from "../shared/context/LocationContext";

const useStyles = makeStyles()((theme) => ({
  root: {
    padding: 30,
    marginBottom: 20,
    borderBottom: `1px solid ${COLOURS.border}`,
    paddingLeft: 200,
    paddingRight: 200,
    [theme.breakpoints.down("md")]: {
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
  const { classes } = useStyles();
  const navigate = useNavigate();
  const locationContext = useContext(LocationContext);

  return (
    <Grid
      container
      className={classes.root}
      sx={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <Grid>
        <Link underline="none" component="button" onClick={() => navigate("/")}>
          <Typography variant="h5" className={classes.logo}>
            {SITE.site.name}
          </Typography>
        </Link>
      </Grid>
      {/* <Grid>
        <Grid
          container
          spacing={5}
          size={12} sx={{ justifyContent: "center", alignItems: "center" }}
        >
          {NAV.links.map((link) => {
            return (
              <Grid size={4}>
                <Link
                  underline="none"
                  component="button"
                  onClick={() => navigate(link.href)}
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
      </Grid> */}
    </Grid>
  );
};

export default NavBar;
