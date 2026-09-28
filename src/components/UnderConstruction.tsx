import React from "react";
import { Grid, Typography, Backdrop } from "@mui/material";
import { makeStyles } from "tss-react/mui";

import { MODALS } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles()({
  root: {},
  backdrop: {
    zIndex: 2,
    background: "rgba(245,239,225,0.8)",
  },
  container: {
    width: 400,
    height: 200,
    background: COLOURS.primary,
    borderRadius: 6,
    border: `1px solid ${COLOURS.border}`,
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
  const { classes } = useStyles();

  return (
    <Backdrop
      className={classes.backdrop}
      open={props.open}
      onClick={props.onClick}
    >
      <Grid
        container
        spacing={5}
        className={classes.container}
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid>
          <Typography className={classes.text}>
            {MODALS.underConstruction}
          </Typography>
        </Grid>
      </Grid>
    </Backdrop>
  );
};

export default Modal;
