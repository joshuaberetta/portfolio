import React from "react";
import {
  Grid,
  Typography,
  // CircularProgress,
  // Backdrop,
  makeStyles,
  Link,
} from "@material-ui/core";

import { COLOURS } from "../../shared/colours";
import { WORK } from "../../shared/content";

const useStyles = makeStyles({
  root: {
    marginTop: 40,
    marginBottom: 20,
  },
  header: {
    height: 220,
    width: 220,
    background: COLOURS.primary,
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
  content: {
    background: COLOURS.primary,
    marginBottom: 20,
    padding: 20,
    maxWidth: 800,
    borderRadius: 10,
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

// interface LoadingProps {
//   open: boolean;
// }

// const Loading: React.FC<LoadingProps> = (props) => {
//   const classes = useStyles();
//   return (
//     <Backdrop className={classes.backdrop} open={props.open}>
//       <CircularProgress color="inherit" className={classes.loading} />
//     </Backdrop>
//   );
// };

interface PortfolioPageProps {
  title: string;
}

const PortfolioPage: React.FC<PortfolioPageProps> = (props) => {
  const classes = useStyles();
  const CONTENT = WORK.items.filter((item) => item.title === props.title)[0];

  return (
    <React.Fragment>
      <div />
      {CONTENT && (
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          className={classes.root}
        >
          <Grid item>
            <Grid
              container
              direction="row"
              alignItems="center"
              justify="center"
              className={classes.header}
            >
              <Grid item>{CONTENT.display.component}</Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="column"
              alignItems="flex-start"
              justify="flex-start"
              className={classes.content}
            >
              <Grid item>
                <Typography className={classes.textHeading}>
                  # {CONTENT.display.title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.textBody}>
                  <span className={classes.textTitle}>Website: </span>
                  <Link className={classes.link} href={CONTENT.href_ext.link}>
                    {CONTENT.href_ext.title}
                  </Link>
                </Typography>
              </Grid>
              {CONTENT.figma && (
                <Grid item>
                  <Typography className={classes.textBody}>
                    <span className={classes.textTitle}>Figma: </span>
                    <Link className={classes.link} href={CONTENT.figma}>
                      Figma design
                    </Link>
                  </Typography>
                </Grid>
              )}
              {CONTENT.stack && (
                <Grid item>
                  <Typography className={classes.textBody}>
                    <span className={classes.textTitle}>Stack: </span>
                    {CONTENT.stack!.join(", ")}
                  </Typography>
                </Grid>
              )}
              <Grid item>
                <Typography className={classes.textBody}>
                  <span className={classes.textTitle}>Description: </span>
                  {CONTENT.description}
                </Typography>
              </Grid>
              {CONTENT.inspiration && (
                <Grid item>
                  <Typography className={classes.textBody}>
                    <span className={classes.textTitle}>Inspiration: </span>
                    {CONTENT.inspiration}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};

export default PortfolioPage;
