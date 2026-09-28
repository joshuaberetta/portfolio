import React, { useState, useContext, useEffect } from "react";
import { Grid, Typography, Avatar } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useNavigate } from "react-router";

import Block from "../components/PortfolioBlock";
import Modal from "../components/UnderConstruction";

import { WORK } from "../shared/content";
import { SITE } from "../shared/siteContent";
import { COLOURS } from "../shared/colours";
import { LocationContext } from "../shared/context/LocationContext";
import { WorkItem } from "../shared/models/workItem";

const useStyles = makeStyles()({
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
  const { classes } = useStyles();
  const locationContext = useContext(LocationContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    locationContext.updateLocation("/work");
  }, []);

  const toggleModal = () => setOpen((prev: boolean) => !prev);

  const cb = (item: WorkItem) => {
    if (item.underConstruction) {
      return toggleModal;
    }
    return () => navigate(item.href);
  };

  return (
    <React.Fragment>
      <title>Joshua Beretta</title>
      <Modal open={open} onClick={toggleModal} />
      <Grid
        container
        className={classes.root}
        spacing={3}
        sx={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Grid>
          <Avatar
            src={SITE.profile.image}
            alt="me"
            className={classes.avatar}
          />
        </Grid>
        <Grid>
          <Typography variant="body1" className={classes.subtitle}>
            {WORK.subtitle}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" className={classes.subtitle}>
            {/* the job title is the second line in content.yaml */}
            {SITE.profile.details[1]?.value}
          </Typography>
        </Grid>
        <Grid>
          <Grid
            container
            spacing={5}
            className={classes.grid}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            {WORK.items.map((item) => (
              <Grid key={item.title}>
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
