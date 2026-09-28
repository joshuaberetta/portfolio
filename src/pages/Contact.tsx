import React, { useContext, useEffect, useState } from "react";
import { Grid, Typography, Avatar, Link } from "@mui/material";
import { makeStyles } from "tss-react/mui";

import PublicKeyModal from "../components/PublicKeyModal";

import { CONTACT } from "../shared/content";
import { COLOURS } from "../shared/colours";
import { LocationContext } from "../shared/context/LocationContext";

const useStyles = makeStyles()((theme) => ({
  root: {
    // padding: 20,
    marginTop: 40,
    marginBottom: 40,
    minHeight: "30rem",
  },
  card: {
    padding: 20,
    minHeight: 300,
    // maxWidth: 800,
    background: COLOURS.primary,
    borderRadius: 6,
    border: `1px solid ${COLOURS.border}`,
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
      <title>Joshua Beretta - Contact</title>
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
        <Grid>
          <Grid
            container
            spacing={5}
            className={classes.card}
            sx={{ justifyContent: "center", alignItems: "center" }}
          >
            <Grid>
              <Avatar src={CONTACT.image} alt="me" className={classes.avatar} />
            </Grid>
            <Grid>
              {CONTACT.details.map((item) => (
                <Typography className={classes.values}>
                  <span className={classes.title}>{item.title} </span>
                  {item.value}
                </Typography>
              ))}
            </Grid>
          </Grid>
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
