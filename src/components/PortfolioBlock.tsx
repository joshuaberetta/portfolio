import React from "react";
import { Grid, Typography, Button, makeStyles } from "@material-ui/core";

import { COLOURS } from "../shared/colours";

const useStyles = makeStyles({
  root: {
    height: 220,
    width: 220,
    borderRadius: 10,
    background: COLOURS.primary,
  },
  title: {
    color: COLOURS.secondary,
  },
  button: {
    padding: "none",
    margin: "none",
    textTransform: "none",
    "&:hover": {
      background: "none",
    },
  },
});

interface BlockProps {
  children: any;
  font?: string;
}

const Block: React.FC = (props) => {
  const classes = useStyles();
  return (
    <Button disableRipple className={classes.button}>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item>
          <Typography className={classes.title}>{props.children}</Typography>
        </Grid>
      </Grid>
    </Button>
  );
};

export default Block;
