import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import { makeStyles } from "tss-react/mui";

import { COLOURS } from "../shared/colours";

const useStyles = makeStyles()({
  root: {
    height: 220,
    width: 220,
    borderRadius: 6,
    border: `1px solid ${COLOURS.border}`,
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
  cb: (item: any) => void;
  font?: string;
}

const Block: React.FC<BlockProps> = (props) => {
  const { classes } = useStyles();

  return (
    <Button disableRipple className={classes.button} onClick={props.cb}>
      <Grid
        container
        className={classes.root}
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid>
          <Typography className={classes.title}>{props.children}</Typography>
        </Grid>
      </Grid>
    </Button>
  );
};

export default Block;
