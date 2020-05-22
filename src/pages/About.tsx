import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Grid, Typography, makeStyles } from "@material-ui/core";

import { ABOUT } from "../shared/content";
import { COLOURS } from "../shared/colours";
import { LocationContext } from "../shared/context/LocationContext";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 20,
    marginTop: 40,
    marginBottom: 40,
    maxWidth: "50rem",
    minHeight: "40rem",
    borderRadius: 10,
    background: COLOURS.primary,
  },
  text: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.secondary,
    // paddingBottom: 20,
  },
  textSecondary: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.blue,
    // paddingBottom: 20,
  },
  textBold: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "bold",
    color: COLOURS.secondary,
    // paddingBottom: 20,
  },
  heading: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    paddingBottom: 20,
    color: COLOURS.pink,
  },
}));

const Whoami: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.heading}>
        {ABOUT.sections.whoami.title}
      </Typography>
      <Typography className={classes.text}>
        {ABOUT.sections.whoami.body}
      </Typography>
    </>
  );
};

const Experience: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.heading}>
        {ABOUT.sections.experience.title}
      </Typography>
      {ABOUT.sections.experience.body.map((item) => (
        <div style={{ paddingBottom: 20 }}>
          <Typography className={classes.text}>
            <span className={classes.textBold}>{item.title}: </span>
            {item.startDate} - {item.endDate}
          </Typography>
          <Typography className={classes.textSecondary}>{item.role}</Typography>
          <Typography className={classes.text}>{item.description}</Typography>
        </div>
      ))}
    </>
  );
};

const Education: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.heading}>
        {ABOUT.sections.education.title}
      </Typography>
      {ABOUT.sections.education.body.map((item) => (
        <>
          <Typography className={classes.heading}>{item.title}</Typography>
          {item.body.map((e) => (
            <div style={{ paddingBottom: 20 }}>
              <Typography className={classes.text}>
                <span className={classes.textBold}>{e.title}: </span>
                {e.startDate} - {e.endDate}
              </Typography>
              <Typography className={classes.textSecondary}>
                {e.description}
              </Typography>
              {e.body && (
                <Typography className={classes.text}>{e.body}</Typography>
              )}
            </div>
          ))}
        </>
      ))}
    </>
  );
};

const Honours: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.heading}>
        {ABOUT.sections.honours.title}
      </Typography>
      {ABOUT.sections.honours.body.map((item) => (
        <div style={{ paddingBottom: 20 }}>
          <Typography className={classes.text}>
            <span className={classes.textBold}>{item.title}: </span>
            {item.years.join(", ")}
          </Typography>
          <Typography className={classes.textSecondary}>
            {item.subtitle}
          </Typography>
        </div>
      ))}
    </>
  );
};

const Skills: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.heading}>
        {ABOUT.sections.skills.title}
      </Typography>
      <Typography className={classes.text}>
        {ABOUT.sections.skills.body.join(", ")}
      </Typography>
    </>
  );
};

const Interests: React.FC = () => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.heading}>
        {ABOUT.sections.interests.title}
      </Typography>
      <Typography className={classes.text}>
        {ABOUT.sections.interests.body.join(", ")}
      </Typography>
    </>
  );
};

const About: React.FC = () => {
  const classes = useStyles();
  const locationContext = useContext(LocationContext);

  useEffect(() => {
    locationContext.updateLocation("/about");
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>Joshua Beretta - About</title>
      </Helmet>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Grid
            container
            item
            direction="column"
            alignItems="flex-start"
            justify="flex-start"
            spacing={3}
            className={classes.root}
            xs={12}
          >
            <Grid item xs={12}>
              <Whoami />
            </Grid>
            <Grid item xs={12}>
              <Experience />
            </Grid>
            <Grid item xs={12}>
              <Education />
            </Grid>
            <Grid item xs={12}>
              <Honours />
            </Grid>
            <Grid item xs={12}>
              <Skills />
            </Grid>
            <Grid item xs={12}>
              <Interests />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default About;
