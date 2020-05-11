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
    width: 400,
    height: 200,
    background: COLOURS.primary,
    borderRadius: 10,
  },
  text: {
    color: COLOURS.secondary,
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
  },
});

interface ModalProps {
  open: boolean;
  onClick: () => void;
}

const Modal: React.FC<ModalProps> = (props) => {
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
          <Typography className={classes.text}>
            {MODALS.underConstruction}
          </Typography>
        </Grid>
      </Grid>
    </Backdrop>
  );
};

export default Modal;
