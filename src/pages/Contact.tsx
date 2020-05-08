import React from "react";
import { Grid, Typography, Avatar, Link, makeStyles } from "@material-ui/core";

import { CONTACT } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles({
  root: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    minHeight: "30rem",
  },
  card: {
    padding: 20,
    height: 300,
    width: 800,
    background: COLOURS.primary,
    borderRadius: 10,
  },
  avatar: {
    height: 200,
    width: 200,
  },
  title: {
    color: COLOURS.secondary,
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "bold",
  },
  values: {
    color: COLOURS.secondary,
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
  },
  pgp: {
    // marginTop: 10,
    width: 800,
    height: 100,
    borderRadius: 10,
    background: COLOURS.primary,
  },
  button: {
    width: 250,
    height: 50,
    background: COLOURS.primary,
    borderRadius: 10,
    border: `3px solid ${COLOURS.secondary}`,
    "&:hover": {
      border: `3px solid ${COLOURS.pink}`,
    },
  },
});

const PGPButton = () => {
  const classes = useStyles();

  return (
    <Link underline="none" component="button">
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.button}
      >
        <Grid item>
          <Typography className={classes.values}>{CONTACT.button}</Typography>
        </Grid>
      </Grid>
    </Link>
  );
};

const Contact: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      spacing={5}
      className={classes.root}
    >
      <Grid item>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          spacing={5}
          className={classes.card}
        >
          <Grid item>
            <Avatar src={CONTACT.image} alt="me" className={classes.avatar} />
          </Grid>
          <Grid item>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              spacing={1}
            >
              {CONTACT.details.map((item) => (
                <Grid item>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item>
                      <Typography className={classes.title}>
                        {item.title}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography className={classes.values}>
                        {item.value}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.pgp}
        >
          <Grid item>
            <Typography className={classes.values}>{CONTACT.pgp}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <PGPButton />
      </Grid>
    </Grid>
  );
};

export default Contact;
