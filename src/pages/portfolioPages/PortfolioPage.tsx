import React, { useEffect } from "react";
import {
  Grid,
  Typography,
  // CircularProgress,
  // Backdrop,
  Link,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";

import Markdown from "../../components/SimpleMarkdown";

import { COLOURS } from "../../shared/colours";
import { WORK } from "../../shared/content";

const useStyles = makeStyles()({
  root: {
    marginTop: 40,
    marginBottom: 20,
  },
  header: {
    height: 220,
    width: 220,
    background: COLOURS.primary,
    borderRadius: 6,
    border: `1px solid ${COLOURS.border}`,
    marginBottom: 20,
    padding: 20,
  },
  content: {
    background: COLOURS.primary,
    marginBottom: 20,
    padding: 20,
    maxWidth: 800,
    borderRadius: 6,
    border: `1px solid ${COLOURS.border}`,
  },
  textHeading: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.pink,
    paddingBottom: 20,
  },
  textBody: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
    color: COLOURS.secondary,
  },
  textTitle: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "bold",
    color: COLOURS.secondary,
  },
  link: {
    color: COLOURS.pink,
    "&:hover": {
      color: COLOURS.blue,
    },
  },
  backdrop: {
    color: COLOURS.primary,
  },
  loading: {
    color: COLOURS.pink,
  },
});

interface PortfolioPageProps {
  title: string;
  label: string;
}

const PortfolioPage: React.FC<PortfolioPageProps> = (props) => {
  const { classes } = useStyles();
  const CONTENT = WORK.items.filter((item) => item.title === props.title)[0];

  useEffect(() => {
    // scroll to the top of the page when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <title>{props.label}</title>
      <div />
      {CONTENT && (
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          className={classes.root}
        >
          <Grid>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="center"
              className={classes.header}
            >
              <Grid>{CONTENT.display.component}</Grid>
            </Grid>
          </Grid>
          <Grid>
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              className={classes.content}
            >
              <Grid>
                <Typography className={classes.textHeading}>
                  # {CONTENT.display.title}
                </Typography>
              </Grid>
              <Grid>
                <Typography className={classes.textBody}>
                  <span className={classes.textTitle}>Website: </span>
                  <Link className={classes.link} href={CONTENT.href_ext.link}>
                    {CONTENT.href_ext.title}
                  </Link>
                </Typography>
              </Grid>
              {CONTENT.figma && (
                <Grid>
                  <Typography className={classes.textBody}>
                    <span className={classes.textTitle}>Figma: </span>
                    <Link className={classes.link} href={CONTENT.figma}>
                      Figma design
                    </Link>
                  </Typography>
                </Grid>
              )}
              {CONTENT.stack && (
                <Grid>
                  <Typography className={classes.textBody}>
                    <span className={classes.textTitle}>Stack: </span>
                    {CONTENT.stack!.join(", ")}
                  </Typography>
                </Grid>
              )}
              <Grid>
                <Typography className={classes.textBody}>
                  <span className={classes.textTitle}>Description: </span>
                  {CONTENT.description}
                </Typography>
              </Grid>
              {CONTENT.inspiration && (
                <Grid>
                  <Typography className={classes.textBody}>
                    <span className={classes.textTitle}>Inspiration: </span>
                    {CONTENT.inspiration}
                  </Typography>
                </Grid>
              )}
              {CONTENT.md && <Markdown content={CONTENT.md} />}
            </Grid>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};

export default PortfolioPage;
