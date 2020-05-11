import React from "react";
import { Grid, Typography, Dialog, makeStyles } from "@material-ui/core";

import { CONTACT } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles({
  root: {},
  backdrop: {
    zIndex: 2,
    background: "rgba(255,255,255,0.7)",
  },
  container: {
    // width: 800,
    // height: 400,
    padding: 20,
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
    <Dialog
      // className={classes.backdrop}
      open={props.open}
      onClose={props.onClick}
      scroll="paper"
      maxWidth="lg"
    >
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        // spacing={3}
        className={classes.container}
      >
        <Grid item>
          {CONTACT.publickey.map((line) => (
            <Typography className={classes.text}>{line}</Typography>
          ))}
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default PublicKeyModal;
