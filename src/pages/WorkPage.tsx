import React from "react";
import { Grid, Typography, makeStyles, Avatar } from "@material-ui/core";

import Block from "../components/PortfolioBlock";

import { WORK } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles({
  root: {
    minHeight: "40rem",
  },
  avatar: {
    width: 200,
    height: 200,
  },
  subtitle: {
    color: COLOURS.secondary,
    fontFamily: "IBM Plex Mono, monospace",
  },
  grid: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    maxWidth: "55rem",
  },
});

const Work: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="center"
      className={classes.root}
      spacing={3}
    >
      <Grid item>
        <Avatar src={WORK.image} alt="me" className={classes.avatar} />
      </Grid>
      <Grid item>
        <Typography variant="body1" className={classes.subtitle}>
          {WORK.subtitle}
        </Typography>
      </Grid>
      <Grid item>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={5}
          className={classes.grid}
        >
          {WORK.items.map((item) => (
            <Grid item key={item.title}>
              <Block>{item.display.component}</Block>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Work;
