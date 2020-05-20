import React from "react";
import { Grid, Typography, makeStyles, Link } from "@material-ui/core";

import { COLOURS } from "../../shared/colours";
import { WORK } from "../../shared/content";

const useStyles = makeStyles({
  root: {
    marginTop: 40,
    marginBottom: 20,
  },
  header: {
    height: 220,
    width: 220,
    background: COLOURS.primary,
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
  content: {
    background: COLOURS.primary,
    marginBottom: 20,
    padding: 20,
    maxWidth: 800,
    borderRadius: 10,
  },
  textHeading: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.pink,
    paddingBottom: 20,
  },
  textBody: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.secondary,
  },
  textTitle: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "bold",
    color: COLOURS.secondary,
  },
  link: {
    color: COLOURS.pink,
    "&:hover": {
      color: COLOURS.blue,
    },
  },
});

const makeCap = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const CONTENT = WORK.items.filter(
  (item) => item.title === "travelling-hipster-coaster",
)[0];

const THC: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      //   spacing={3}
      className={classes.root}
    >
      <Grid item>
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="center"
          className={classes.header}
        >
          <Grid item>{CONTENT.display.component}</Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          justify="flex-start"
          className={classes.content}
        >
          <Grid item>
            <Typography className={classes.textHeading}>
              {`# ${CONTENT.title.split("-").map(makeCap).join(" ")}`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.textBody}>
              <span className={classes.textTitle}>Website: </span>
              still to come :)
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.textBody}>
              <span className={classes.textTitle}>Stack: </span>
              {CONTENT.stack!.join(", ")}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.textBody}>
              <span className={classes.textTitle}>Description: </span>
              Still to come :)
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default THC;
