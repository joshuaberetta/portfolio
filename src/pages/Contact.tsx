import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Grid, Typography, Avatar, Link, makeStyles } from "@material-ui/core";

import PublicKeyModal from "../components/PublicKeyModal";

import { CONTACT } from "../shared/content";
import { COLOURS } from "../shared/colours";
import { LocationContext } from "../shared/context/LocationContext";

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: 20,
    marginTop: 40,
    marginBottom: 40,
    minHeight: "30rem",
  },
  card: {
    padding: 20,
    minHeight: 300,
    // maxWidth: 800,
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
    width: "inherit",
    // maxWidth: 800,
    // flex: 1,
    minHeight: 100,
    borderRadius: 10,
    paddingRight: 20,
    paddingLeft: 20,
    background: COLOURS.primary,
  },
  button: {
    maxWidth: 250,
    minHeight: 50,
    background: COLOURS.primary,
    borderRadius: 10,
    paddingRight: 20,
    paddingLeft: 20,
    border: `3px solid ${COLOURS.secondary}`,
    "&:hover": {
      border: `3px solid ${COLOURS.blue}`,
    },
  },
}));

interface PGPButtonProps {
  onClick: () => void;
}

const PGPButton: React.FC<PGPButtonProps> = (props) => {
  const classes = useStyles();

  return (
    <Link underline="none" component="button" onClick={props.onClick}>
      <Grid
        container
        item
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.button}
        xs={12}
      >
        <Grid item xs={12}>
          <Typography className={classes.values}>{CONTACT.button}</Typography>
        </Grid>
      </Grid>
    </Link>
  );
};

const Contact: React.FC = () => {
  const classes = useStyles();
  const locationContext = useContext(LocationContext);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    locationContext.updateLocation("/contact");
  }, []);

  const toggleModal = () => setOpen((prev: boolean) => !prev);

  return (
    <React.Fragment>
      <Helmet>
        <title>Joshua Beretta - Contact</title>
      </Helmet>
      <PublicKeyModal open={open} onClick={toggleModal} />
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
            item
            direction="row"
            justify="center"
            alignItems="center"
            spacing={5}
            className={classes.card}
          >
            <Grid item>
              <Avatar src={CONTACT.image} alt="me" className={classes.avatar} />
            </Grid>
            <Grid item>
              {CONTACT.details.map((item) => (
                <Typography className={classes.values}>
                  <span className={classes.title}>{item.title} </span>
                  {item.value}
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid
            container
            item
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
          <PGPButton onClick={toggleModal} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Contact;
