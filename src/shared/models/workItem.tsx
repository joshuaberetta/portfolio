import React from "react";

export interface WorkItem {
  title: string;
  href: string;
  underConstruction: boolean;
  display: {
    type: string;
    component: React.ReactElement;
  };
}
