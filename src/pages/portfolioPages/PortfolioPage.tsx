import React from "react";
import {
  Grid,
  Typography,
  // CircularProgress,
  // Backdrop,
  makeStyles,
  Link,
} from "@material-ui/core";
import Markdown from "markdown-to-jsx";
import styled from "styled-components";

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

const MainTitle = styled.h1`
  // font-family: "IBM Plex Mono, monospace";
  // font-weight: "normal";
  font-size: 1.1rem;
  color: ${COLOURS.pink};
`;

const SectionTitle = styled.h2`
  // font-family: "IBM Plex Mono, monospace";
  // font-weight: "normal";
  font-size: 1.1rem;
  color: ${COLOURS.pink};
`;

const SubSectionTitle = styled.h3`
  color: #2980b9;
  text-transform: uppercase;
`;

const ParaText = styled.p`
  // font-family: "IBM Plex Mono, monospace";
  // font-weight: "normal";
  color: ${COLOURS.secondary};
  text-align: left;
  line-height: 1.375rem;
`;

const StrongText = styled.strong`
  color: black;
  padding: 2px;
  text-decoration: underline;
`;

const ExtLink = styled.a.attrs({
  target: "_blank",
})`
  color: #2980b9;
  &:hover {
    color: #ffd700;
  }
`;

const Code = styled.code`
  color: ${COLOURS.secondary};
  // font-size: 1.125rem;
  padding-left: none;
`;

const DividerLine = styled.hr`
  border: 1px solid #2980b9;
`;

const Image = styled.img`
  border: 5px solid #895fad;
  border-left: none;
  border-right: none;
`;

const Div = styled.div`
  max-width: 30rem;
`;

const options = {
  overrides: {
    h1: {
      component: MainTitle,
    },
    h2: {
      component: SectionTitle,
    },
    h3: {
      component: SubSectionTitle,
    },
    p: {
      component: ParaText,
    },
    strong: {
      component: StrongText,
    },
    a: {
      component: ExtLink,
    },
    code: {
      component: Code,
    },
    img: {
      component: Image,
    },
    hr: {
      component: DividerLine,
    },
    div: {
      component: Div,
    },
  },
};

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

const md = `
# testing out some md

hello there

## is this working?

> Maybe...
`;

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
              {CONTENT.md && (
                <Grid item>
                  <Markdown options={options}>{CONTENT.md}</Markdown>
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
