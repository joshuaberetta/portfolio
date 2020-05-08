import React from "react";
import { Grid, Typography, makeStyles, Avatar } from "@material-ui/core";

import me from "../static/me.png";

const useStyles = makeStyles({
  root: {
    minHeight: "40rem",
  },
  avatar: {
    width: 200,
    height: 200,
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
    >
      <Grid item>
        <img src={me} alt="me" className={classes.avatar} />
      </Grid>
      <Grid item>
        <Typography variant="h1">Hello</Typography>
      </Grid>
    </Grid>
  );
};

export default Work;
