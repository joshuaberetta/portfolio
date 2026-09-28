import React from "react";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";

import { COLOURS } from "../shared/colours";

const useStyles = makeStyles()({
  space: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  text: {
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
  },
  textPadding: {
    paddingBottom: 20,
  },
  h: {
    color: COLOURS.pink,
  },
  p: {
    color: COLOURS.secondary,
  },
  com: {
    color: COLOURS.blue,
    paddingLeft: 20,
  },
  img: {
    maxWidth: 500,
    maxHeight: 300,
    borderRadius: 6,
    marginBottom: 20,
    alignSelf: "center",
  },
  a: {
    color: COLOURS.pink,
    textDecoration: "none",
    "&:hover": {
      color: COLOURS.blue,
    },
  },
  em: {
    color: COLOURS.blue,
  },
});

interface MdBlockProps {
  item: {
    type: string;
    data: any;
  };
}

const MdBlock: React.FC<MdBlockProps> = ({ item }) => {
  const { classes } = useStyles();

  switch (item.type) {
    case "img": {
      return (
        <img src={item.data[0]} alt={item.data[1]} className={classes.img} />
      );
    }
    case "a": {
      return (
        <a href={item.data[1]} className={classes.a}>
          <Typography className={[classes.text, classes.textPadding].join(" ")}>
            {item.data[0]}
          </Typography>
        </a>
      );
    }
    default:
      return (
        <Typography
          className={[
            classes.text,
            classes.textPadding,
            classes[item.type],
          ].join(" ")}
        >
          {item.data.join(" ")}
        </Typography>
      );
  }
};

interface MarkdownProps {
  content: any;
}

const Markdown: React.FC<MarkdownProps> = (props) => {
  const { classes } = useStyles();

  return (
    <Grid container className={classes.space} direction="column">
      {props.content.map((item) => (
        <MdBlock item={item} />
      ))}
    </Grid>
  );
};

export default Markdown;
