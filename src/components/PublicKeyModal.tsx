import React from "react";
import { Grid, Typography, Backdrop, makeStyles } from "@material-ui/core";

import { MODALS } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles({
  root: {},
  backdrop: {
    zIndex: 2,
    background: "rgba(255,255,255,0.7)",
  },
  container: {
    width: 800,
    height: 400,
    background: COLOURS.primary,
    borderRadius: 10,
  },
  text: {
    color: COLOURS.secondary,
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
  },
});

interface PublicKeyModalProps {
  open: boolean;
  onClick: () => void;
}

const PublicKeyModal: React.FC<PublicKeyModalProps> = (props) => {
  const classes = useStyles();

  return (
    <Backdrop
      className={classes.backdrop}
      open={props.open}
      onClick={props.onClick}
    >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={5}
        className={classes.container}
      >
        <Grid item>
          <Typography className={classes.text}>Public Key</Typography>
        </Grid>
      </Grid>
    </Backdrop>
  );
};

export default PublicKeyModal;
