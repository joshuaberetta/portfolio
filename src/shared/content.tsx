import React from "react";
import { Typography } from "@material-ui/core";

import workImage from "../static/me.png";
import contactImage from "../static/me.png";

import GitHubIcon from "@material-ui/icons/GitHub";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";

import Ourthreedots from "../components/svg/Ourthreedots";
import Noordhoek from "../components/svg/Noordhoek";
import THC from "../components/svg/THC";
import BS from "../components/svg/BS";
import Trend from "../components/svg/trend";
import Portfolio from "../components/svg/Portfolio";

export const NAV = {
  title: {
    title: "JOSHUA BERETTA",
    href: "/",
  },
  subtitle: "hi, i'm josh.",
  links: [
    { title: "/work", href: "/" },
    { title: "/about", href: "/about" },
    { title: "/contact", href: "/contact" },
  ],
};

export const WORK = {
  image: workImage,
  subtitle: "hi, i'm josh.",
  items: [
    {
      title: "ourthreedots",
      href: "/work/ourthreedots",
      display: {
        type: "svg",
        component: <Ourthreedots />,
      },
    },
    {
      title: "noordhoek-bagels",
      href: "/work/noordhoek-bagels",
      display: {
        type: "svg",
        component: <Noordhoek />,
      },
    },
    {
      title: "travelling-hipster-coaster",
      href: "/work/travelling-hipster-coaster",
      display: {
        type: "svg",
        component: <THC />,
      },
    },
    {
      title: "beretta-studio",
      href: "/work/beretta-studio",
      display: {
        type: "svg",
        component: <BS />,
      },
    },
    {
      title: "trend",
      href: "/work/trend",
      display: {
        type: "svg",
        component: <Trend />,
      },
    },
    {
      title: "portfolio",
      href: "/work/portfolio",
      display: {
        type: "svg",
        component: <Portfolio />,
      },
    },
  ],
};

export const FOOTER = {
  icons: [
    {
      title: "email",
      logo: <MailOutlineIcon />,
      href: "mailto:joshuaberetta@gmail.com",
    },

    {
      title: "github",
      logo: <GitHubIcon />,
      href: "https://www.github.com/joshuaberetta",
    },
    {
      title: "linkedin",
      logo: <LinkedInIcon />,
      href: "https://www.linkedin.com/in/joshua-beretta-aa857693/",
    },

    {
      title: "indie-hackers",
      logo: <Typography>IH</Typography>,
      href: "https://www.indiehackers.com/joshuaberetta",
    },
    {
      title: "instagram",
      logo: <InstagramIcon />,
      href: "instagram.com/joshuaberetta",
    },
  ],
};

export const ABOUT = {
  sections: [
    {
      title: "# whoami",
      body: [
        "I grew up in the beautiful suburb of Noordhoek in Cape Town, South Africa.",
        "I am married to the beautiful Naomi Beretta and we are currently travelling the world, experiencing new things and working remotely.",
        "I am a passionate about technology and an advocate for privacy and individual freedom.",
      ],
    },
    {
      title: "# Experience",
      body: [],
    },
    {
      title: "# Education",
      body: [],
    },
    {
      title: "## Formal",
      body: [],
    },
    {
      title: "## Informal",
      body: [],
    },
    {
      title: "# Interests & Hobbies",
      body: [],
    },
  ],
};

export const CONTACT = {
  image: contactImage,
  details: [
    { title: "NAME:", value: "JOSHUA BERETTA" },
    { title: "TITLE:", value: "ENTREPRENEUR / DEVELOPER / ENGINEER" },
    { title: "DOB:", value: "19/06/1995" },
    { title: "NATIONALITY:", value: "ITALIAN / SOUTH AFRICAN" },
    { title: "EMAIL:", value: "JOSHUABERETTA@GMAIL.COM" },
  ],
  pgp: "PGP FINGERPRINT: 2B51 8B51 D0C4 2000 4C2C CFE4 ED79 D7ED CB6C EFA3",
  button: "SHOW PUBLIC KEY",
  publickey: "",
};
