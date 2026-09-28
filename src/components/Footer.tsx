import React from "react";
import { Grid, Link } from "@mui/material";
import { makeStyles } from "tss-react/mui";

import GitHubIcon from "@mui/icons-material/GitHub";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

import { SITE, LinkIcon } from "../shared/siteContent";
import { COLOURS } from "../shared/colours";

const ICONS: Record<LinkIcon, React.ReactElement> = {
  email: <MailOutlinedIcon />,
  github: <GitHubIcon />,
  linkedin: <LinkedInIcon />,
  flickr: <CameraAltIcon />,
};

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
        className={classes.root}
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid>
          <Grid
            container
            spacing={5}
            // size={12} //this was causing an offset from center...
            // className={classes.root}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            {SITE.links.map((link) => (
              <Grid key={link.href}>
                <Link
                  href={link.href}
                  aria-label={link.icon}
                  underline="none"
                  className={classes.icon}
                >
                  {ICONS[link.icon]}
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
