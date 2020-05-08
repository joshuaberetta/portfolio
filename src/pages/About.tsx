import React from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";

import { ABOUT } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles({
  root: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    maxWidth: "50rem",
    height: "40rem",
    borderRadius: 10,
    background: COLOURS.primary,
  },
  text: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.secondary,
  },
  heading: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.pink,
  },
});

const About: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container direction="column" justify="center" alignItems="center">
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          justify="flex-start"
          spacing={3}
          className={classes.root}
        >
          {ABOUT.sections.map((sec) => {
            return (
              <React.Fragment>
                <Grid item>
                  <Typography className={classes.heading}>
                    {sec.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.text}>
                    {sec.body.join("\n")}
                  </Typography>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default About;
