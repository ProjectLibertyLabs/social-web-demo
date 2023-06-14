import React from "react";
import { User } from "../types";

interface FromTitleProps {
  user: User;
  isHoveringProfile?: boolean;
  isReply?: boolean;
}

export const FromTitle = ({
  user,
  isHoveringProfile,
  isReply,
}: FromTitleProps): JSX.Element => {
  const atHandle = user.handle;
  const primary = atHandle;
  const secondary = user?.profile?.name || "";

  const primaryClassName = () => {
    let className = "FromTitle__primary";
    if (isHoveringProfile) {
      className = className + " FromTitle__primary--active";
    }
    if (isReply) {
      className = className + " FromTitle__primary--reply";
    }
    return className;
  };

  return (
    <span className="FromTitle__block">
      <div className={primaryClassName()}>{primary}</div>
      {!isReply && <div className="FromTitle__secondary">{secondary}</div>}
    </span>
  );
};
