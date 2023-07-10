import React from "react";
import { User } from "../types";
import styles from "./FromTitle.module.css";

interface FromTitleProps {
  user: User;
  goToProfile?: (dsnpId: string) => void;
  isReply?: boolean;
}

export const FromTitle = ({
  user,
  goToProfile,
  isReply,
}: FromTitleProps): JSX.Element => {
  const atHandle = user.handle;
  const primary = atHandle;
  const secondary = user?.profile?.name || "";

  return (
    <span onClick={() => goToProfile ? goToProfile(user.dsnpId) : ""} className={styles.root}>
      <div>{primary}</div>
      {!isReply && <div>{secondary}</div>}
    </span>
  );
};
