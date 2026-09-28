import React, { useContext, useEffect, useState } from "react";
import { Grid, Typography, Avatar, Link } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { makeStyles } from "tss-react/mui";

import PublicKeyModal from "../components/PublicKeyModal";

import { CONTACT } from "../shared/content";
import { SITE } from "../shared/siteContent";
import { COLOURS } from "../shared/colours";
import { LocationContext } from "../shared/context/LocationContext";

const useStyles = makeStyles()((theme) => ({
  root: {
    // padding: 20,
    marginTop: 40,
    marginBottom: 40,
    minHeight: "30rem",
  },
  cards: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  card: {
    padding: 20,
    // maxWidth: 800,
    background: COLOURS.primary,
    borderRadius: 6,
    border: `1px solid ${COLOURS.border}`,
  },
  profile: {
    minHeight: 300,
  },
  heading: {
    color: COLOURS.pink,
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "bold",
    paddingBottom: 12,
  },
  research: {
    paddingTop: 12,
    "& + &": {
      borderTop: `1px solid ${COLOURS.border}`,
      marginTop: 16,
      paddingTop: 16,
    },
  },
  detail: {
    color: COLOURS.muted,
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: "0.875rem",
  },
  // modelled on VS Code's primary button
  download: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    padding: "6px 14px",
    borderRadius: 4,
    background: COLOURS.button,
    color: "#FFFFFF",
    fontFamily: "IBM Plex Mono, monospace",
    fontSize: "0.8125rem",
    lineHeight: 1.4,
    textDecoration: "none",
    "&:hover": {
      background: COLOURS.buttonHover,
    },
    "&:focus-visible": {
      outline: `1px solid ${COLOURS.blue}`,
      outlineOffset: 2,
    },
    "& svg": {
      fontSize: 16,
    },
  },
  avatar: {
    height: 200,
    width: 200,
    border: `1px solid ${COLOURS.border}`,
  },
  title: {
    color: COLOURS.secondary,
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "bold",
  },
  values: {
    color: COLOURS.secondary,
    fontFamily: "IBM Plex Mono, monospace",
    fontWeight: "normal",
  },
  pgp: {
    // marginTop: 10,
    width: "inherit",
    // maxWidth: 800,
    // flex: 1,
    minHeight: 100,
    borderRadius: 6,
    border: `1px solid ${COLOURS.border}`,
    paddingRight: 20,
    paddingLeft: 20,
    background: COLOURS.primary,
  },
  button: {
    maxWidth: 250,
    minHeight: 50,
    background: COLOURS.primary,
    borderRadius: 6,
    paddingRight: 20,
    paddingLeft: 20,
    border: `1px solid ${COLOURS.secondary}`,
    "&:hover": {
      border: `1px solid ${COLOURS.blue}`,
    },
  },
}));

// interface PGPButtonProps {
//   onClick: () => void;
// }

// const PGPButton: React.FC<PGPButtonProps> = (props) => {
//   const { classes } = useStyles();

//   return (
//     <Link underline="none" component="button" onClick={props.onClick}>
//       <Grid
//         container
//         className={classes.button}
//         size={12}
//         sx={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}
//       >
//         <Grid size={12}>
//           <Typography className={classes.values}>{CONTACT.button}</Typography>
//         </Grid>
//       </Grid>
//     </Link>
//   );
// };

const Contact: React.FC = () => {
  const { classes } = useStyles();
  const locationContext = useContext(LocationContext);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    locationContext.updateLocation("/contact");
  }, []);

  const toggleModal = () => setOpen((prev: boolean) => !prev);

  return (
    <React.Fragment>
      <title>{`${SITE.site.title} - Contact`}</title>
      <PublicKeyModal open={open} onClick={toggleModal} />
      <Grid
        container
        spacing={5}
        className={classes.root}
        sx={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Grid
          className={classes.cards}
          // sx, not a class: Grid items set maxWidth: none, which would win
          sx={{ maxWidth: "calc(100vw - 32px)" }}
        >
          <Grid
            container
            spacing={5}
            className={`${classes.card} ${classes.profile}`}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Grid>
              <Avatar
                src={SITE.profile.image}
                alt={SITE.site.title}
                className={classes.avatar}
              />
            </Grid>
            <Grid sx={{ maxWidth: "100%" }}>
              {SITE.profile.details.map((item) => (
                <Typography key={item.label} className={classes.values}>
                  <span className={classes.title}>{item.label}: </span>
                  {item.value}
                </Typography>
              ))}
            </Grid>
          </Grid>
          <div className={classes.card}>
            <Typography className={classes.heading}>
              {SITE.research.title}
            </Typography>
            {SITE.research.items.map((item) => (
              <div key={item.file} className={classes.research}>
                <Typography className={classes.title}>{item.title}</Typography>
                {item.detail && (
                  <Typography className={classes.detail}>
                    {item.detail}
                  </Typography>
                )}
                <a
                  href={item.file}
                  download={item.fileName}
                  className={classes.download}
                >
                  <FileDownloadOutlinedIcon />
                  {item.button}
                </a>
              </div>
            ))}
          </div>
        </Grid>
        {/* <Grid>
          <Grid
            container
            className={classes.pgp} sx={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}
          >
            <Grid>
              <Typography className={classes.values}>{CONTACT.pgp}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <PGPButton onClick={toggleModal} />
        </Grid> */}
      </Grid>
    </React.Fragment>
  );
};

export default Contact;
