import React from "react";
import { Grid, Typography, Dialog } from "@mui/material";
import { makeStyles } from "tss-react/mui";

import { CONTACT } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles()({
  root: {},
  backdrop: {
    zIndex: 2,
    background: "rgba(245,239,225,0.8)",
  },
  container: {
    // width: 800,
    // height: 400,
    padding: 20,
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

interface PublicKeyModalProps {
  open: boolean;
  onClick: () => void;
}

const PublicKeyModal: React.FC<PublicKeyModalProps> = (props) => {
  const { classes } = useStyles();

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
        // spacing={3}
        className={classes.container}
        sx={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Grid>
          {CONTACT.publickey.map((line) => (
            <Typography className={classes.text}>{line}</Typography>
          ))}
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default PublicKeyModal;
