import React from "react";
import { Grid, Link } from "@mui/material";
import { makeStyles } from "tss-react/mui";

import { FOOTER } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles()({
  root: {
    height: 100,
  },
  icon: {
    color: COLOURS.muted,
    padding: "0px",
    "&:hover": {
      color: COLOURS.blue,
    },
  },
});

const Footer: React.FC = () => {
  const { classes } = useStyles();

  return (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={5}
            // size={12} //this was causing an offset from center...
            // className={classes.root}
          >
            {FOOTER.icons.map((icon) => (
              <Grid>
                <Link
                  href={icon.href}
                  underline="none"
                  className={classes.icon}
                >
                  {icon.logo}
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Footer;
