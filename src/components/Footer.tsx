import React from "react";
import { Grid, Link, makeStyles } from "@material-ui/core";

import { FOOTER } from "../shared/content";
import { COLOURS } from "../shared/colours";

const useStyles = makeStyles({
  root: {
    height: 100,
  },
  icon: {
    color: COLOURS.pink,
    padding: "0px",
    "&:hover": {
      color: COLOURS.blue,
    },
  },
});

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <div>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item>
          <Grid
            container
            item
            direction="row"
            alignItems="center"
            justify="center"
            spacing={5}
            // xs={12} //this was causing an offset from center...
            // className={classes.root}
          >
            {FOOTER.icons.map((icon) => (
              <Grid item>
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
