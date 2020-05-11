import React, { useState, useContext, useEffect } from "react";
import { Grid, Typography, makeStyles, Avatar } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import Block from "../components/PortfolioBlock";
import Modal from "../components/UnderConstruction";

import { WORK } from "../shared/content";
import { COLOURS } from "../shared/colours";
import { LocationContext } from "../shared/context/LocationContext";
import { WorkItem } from "../shared/models/workItem";

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
  const locationContext = useContext(LocationContext);
  const history = useHistory();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    locationContext.updateLocation("/work");
  }, []);

  const toggleModal = () => setOpen((prev: boolean) => !prev);

  const cb = (item: WorkItem) => {
    if (item.underConstruction) {
      return toggleModal;
    }
    return () => history.push(item.href);
  };

  return (
    <React.Fragment>
      <Modal open={open} onClick={toggleModal} />
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
                <Block cb={cb(item)}>{item.display.component}</Block>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Work;
