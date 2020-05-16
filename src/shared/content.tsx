import React from "react";
import { Typography } from "@material-ui/core";

import GitHubIcon from "@material-ui/icons/GitHub";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import InstagramIcon from "@material-ui/icons/Instagram";
import TwitterIcon from "@material-ui/icons/Twitter";
import Dribble from "../components/svg/dribble";

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
  image: "https://d281hw6jrax8rk.cloudfront.net/me.jpg",
  subtitle: "hi, i'm josh.",
  items: [
    {
      title: "ourthreedots",
      href: "/work/ourthreedots",
      href_ext: "https://ourthreedots.com",
      stack: [
        "React",
        "Typescript",
        "Node",
        "Express",
        "MongoDB",
        "Python",
        "Flask",
        "Firebase",
        "AWS",
        "Stripe",
        "Travis CI",
      ],
      underConstruction: false,
      display: {
        type: "svg",
        component: <Ourthreedots />,
      },
    },
    {
      title: "noordhoek-bagels",
      href: "/work/noordhoek-bagels",
      underConstruction: true,
      display: {
        type: "svg",
        component: <Noordhoek />,
      },
    },
    {
      title: "travelling-hipster-coaster",
      href: "/work/travelling-hipster-coaster",
      underConstruction: true,
      display: {
        type: "svg",
        component: <THC />,
      },
    },
    {
      title: "beretta-studio",
      href: "/work/beretta-studio",
      underConstruction: true,
      display: {
        type: "svg",
        component: <BS />,
      },
    },
    {
      title: "trend",
      href: "/work/trend",
      underConstruction: true,
      display: {
        type: "svg",
        component: <Trend />,
      },
    },
    {
      title: "portfolio",
      href: "/work/portfolio",
      underConstruction: true,
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
      logo: <Typography style={{ fontWeight: "bold" }}>IH</Typography>,
      href: "https://www.indiehackers.com/joshuaberetta",
    },
    {
      title: "instagram",
      logo: <InstagramIcon />,
      href: "https://www.instagram.com/joshberetta",
    },
    {
      title: "twitter",
      logo: <TwitterIcon />,
      href: "https://www.twitter.com/joshberetta",
    },
  ],
};

export const ABOUT = {
  sections: {
    whoami: {
      title: "# whoami",
      body: [
        `I grew up in the peaceful suburb of Noordhoek in Cape Town, South Africa.
        
        I am married to the beautiful Naomi Beretta and we are currently travelling the world, experiencing new things and working remotely.
        
        I am a passionate about technology and an advocate for privacy and individual freedom.`,
      ],
    },
    experience: {
      title: "# Experience",
      body: [
        {
          title: "Ourthreedots",
          startDate: "03/2020",
          endDate: "present",
          role: "Solo-Founder",
          description: `
          My first foray into technology startups, OurThreeDots is a digital service that analyses your WhatsApp chats, outputting a customizable PDF of your chat history with interesting analyses of your conversations. The tech stack includes Typescript, React, Node, Python, Flask, MongoDB, Stripe, Figma, Docker, Travis CI, Heroku, Firebase and AWS Lambda, S3, SES, SQS.
          `,
        },
        {
          title: "Aurecon",
          startDate: "02/2018",
          endDate: "02/2020",
          role: "Mechanical Engineer",
          description:
            "Mechanical engineer in municipal wastewater treatment. Experience in data analysis and scripting in Python, project management, contract management, innovation, tendering, proposals, bills of quantities, specifications, payment certificates, inspections, mechanical design, tender evaluation, management of students.",
        },
        {
          title: "Beretta Studio",
          startDate: "10/2016",
          endDate: "11/2018",
          role: "Co-Founder",
          description:
            "Business and product management and development, B2B and B2C relations, strategy, finances, product design, hiring, manufacturing, quality control, sales.",
        },
        {
          title: "Allan Gray",
          startDate: "06/2017",
          endDate: "07/2017",
          role: "Intern",
          description:
            "Business analyst within a small team focussed on root-cause analysis using historical data, conducting staff interviews and in-depth market research. Presentation of the final solution to management.",
        },
        {
          title: "Aurecon",
          startDate: "06/2016",
          endDate: "07/2016",
          role: "Student Mechanical Engineer",
          description:
            "Work related to wastewater treatment plant analysis and tender documentation for road development around South Africa.",
        },
      ],
    },
    education: {
      title: "# Education",
      body: [
        {
          title: "## Formal",
          body: [
            {
              title: "University of Cape Town",
              startDate: "2014",
              endDate: "2017",
              description:
                "Bachelor of Science (B.Sc.), Mechanical Engineering (First Class Honours)",
              body: `I graduated with First Class Honours in a BSc in Mechanical Engineering at the University of Cape Town with the Class of 2017. Several honours and awards were won throughout my four-year course of study, including class medals in physics, calculus, materials, and mechanical design, and awards for overall academic performance in first and second year in the Faculty of the Built Environment.`,
            },
            {
              title: "Fish Hoek High School",
              startDate: "2011",
              endDate: "2013",
              description:
                "Head Student (Final Year), Class Representative (Grade 11)",
            },
            {
              title: "Reddam House Constantia",
              startDate: "2008",
              endDate: "2010",
              description: "High school",
            },
          ],
        },
        {
          title: "## Informal",
          body: [
            {
              title: "Microsoft",
              startDate: "2020",
              endDate: "2020",
              description: "Advanced C++",
            },
            {
              title: "Microsoft",
              startDate: "2020",
              endDate: "2020",
              description: "Intermediate C++",
            },
            {
              title: "Microsoft",
              startDate: "2020",
              endDate: "2020",
              description: "Introduction to C++",
            },
            {
              title: "StanfordOnline",
              startDate: "2020",
              endDate: "2020",
              description: "Compilers",
            },
            {
              title: "IsraelX",
              startDate: "2020",
              endDate: "2020",
              description: "Unlocking Information Security: Part II",
            },
            {
              title: "IsraelX",
              startDate: "2020",
              endDate: "2020",
              description: "Unlocking Information Security: Part I",
            },
            {
              title: "StanfordOnline",
              startDate: "2020",
              endDate: "2020",
              description: "Algorithms: Design and Analysis, Part 1",
            },
            {
              title: "HarvardX",
              startDate: "2020",
              endDate: "2020",
              description: "CS50's Introduction to Computer Science",
            },
            {
              title: "Udemy",
              startDate: "2020",
              endDate: "2020",
              description: "Understanding Typescript",
            },
            {
              title: "Udemy",
              startDate: "2019",
              endDate: "2019",
              description:
                "React, NodeJS, Express, MongoDB - The MERN Fullstack Guide",
            },
            {
              title: "Udemy",
              startDate: "2019",
              endDate: "2019",
              description: "React - The Complete Guide",
            },
            {
              title: "fast.ai",
              startDate: "2019",
              endDate: "2019",
              description: "Deep Learning from the Foundations",
            },
            {
              title: "fast.ai",
              startDate: "2019",
              endDate: "2019",
              description: "Practical Deep Learning for Coders",
            },
            {
              title: "Udemy",
              startDate: "2019",
              endDate: "2019",
              description: "The Complete Javascript Course 2020",
            },
            {
              title: "Dataquest.io",
              startDate: "2019",
              endDate: "2019",
              description: "Data Science Certificate, Python",
            },
            {
              title: "TUMx",
              startDate: "2019",
              endDate: "2019",
              description: "Six Sigma: Define and Measure",
            },
          ],
        },
      ],
    },
    honours: {
      title: "# Honours",
      body: [
        {
          title: "Dean's Merit List",
          subtitle: "University of Cape Town",
          years: ["2014", "2015", "2016", "2017"],
        },
        {
          title: "MEC3072F Class Medal",
          subtitle: "University of Cape Town",
          years: ["2016"],
        },
        {
          title: "Aurecon Bursary Scheme",
          subtitle: "Aurecon Group",
          years: ["2016", "2017"],
        },
        {
          title: "Twamley Undergraduate Scholarship",
          subtitle: "University of Cape Town",
          years: ["2015"],
        },
        {
          title: "Golden Key Society",
          subtitle: "Golden Key Society",
          years: ["2015", "2016", "2017"],
        },
        {
          title: "MEC2044S Class Medal",
          subtitle: "University of Cape Town",
          years: ["2015"],
        },
        {
          title: "EBE Faculty Scholarship",
          subtitle: "University of Cape Town",
          years: ["2015", "2016"],
        },
        {
          title: "MAM2083F Class Medal",
          subtitle: "University of Cape Town",
          years: ["2015"],
        },
        {
          title: "PHY1013S Class Medal",
          subtitle: "University of Cape Town",
          years: ["2014"],
        },
        {
          title: "Head Student",
          subtitle: "Fish Hoek High School",
          years: ["2013"],
        },
        {
          title: "Full Academic Colours: Grades 11, 12",
          subtitle: "Fish Hoek High School",
          years: ["2012", "2013"],
        },
        {
          title: "Van Belle Mathematics Trophy",
          subtitle: "Fish Hoek High School",
          years: ["2013"],
        },
        {
          title: "Balco Trophy for Electrical Technology",
          subtitle: "Fish Hoek High School",
          years: ["2013"],
        },
        {
          title: "Ubique Cup for Service",
          subtitle: "Fish Hoek High School",
          years: ["2013"],
        },

        {
          title:
            "First in Western Cape for Electrical Technology in NSC Examinations",
          subtitle: "Fish Hoek High School",
          years: ["2013"],
        },
        {
          title: "Summiting Mount Kilimanjaro",
          subtitle: "Tribe Safari",
          years: ["2012"],
        },
      ],
    },
    skills: {
      title: "# Skills",
      body: [
        "Leadership",
        "Entrepreneurship",
        "Project Management",
        "Video Editing",
        "Photoshop",
        "SolidWorks",
        "Microsoft Office 365",
        "Python",
        "Flask",
        "Javascript",
        "Typescript",
        "React",
        "Node",
        "Git",
        "Bash",
        "Linux",
        "Docker",
        "Travis CI",
        "Figma",
        "AWS",
        "DigitalOcean",
        "MongoDB",
        "Golf",
        "Tennis",
        "Table Tennis",
      ],
    },
    interests: {
      title: "# Interests & Hobbies",
      body: [
        "Engineering",
        "Coding",
        "Entrepreneurship",
        "Theology",
        "History",
        "Philosophy",
        "Design",
        "Technology",
        "Innovation",
        "Hiking",
        "Adventure",
        "Travel",
      ],
    },
  },
};

export const CONTACT = {
  image: "https://d281hw6jrax8rk.cloudfront.net/me.jpg",
  details: [
    { title: "NAME:", value: "JOSHUA BERETTA" },
    { title: "TITLE:", value: "ENTREPRENEUR / DEVELOPER / ENGINEER" },
    { title: "DOB:", value: "19/06/1995" },
    { title: "NATIONALITY:", value: "ITALIAN / SOUTH AFRICAN" },
    { title: "EMAIL:", value: "JOSHUABERETTA@GMAIL.COM" },
  ],
  pgp: "PGP FINGERPRINT: 2B51 8B51 D0C4 2000 4C2C CFE4 ED79 D7ED CB6C EFA3",
  button: "SHOW PUBLIC KEY",
  publickey: [
    "-----BEGIN PGP PUBLIC KEY BLOCK-----",
    "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",
    "jksWduQubBhI/7sSuAljJA==",
    "=/4ND",
    "-----END PGP PUBLIC KEY BLOCK-----",
  ],
};

export const MODALS = {
  underConstruction:
    "My site is still under some construction and will be completed shortly. Please check back soon :)",
  error: "Something seems to have gone wrong :(",
};
