import React from "react";
import { RelationshipStatus, User, UserAccount } from "../types";
import { Card } from "antd";
import styles from "./HeaderProfile.module.css";
import UserAvatar from "../chrome/UserAvatar";
import { FromTitle } from "../content/FromTitle";
import GraphChangeButton from "../network/GraphChangeButton";

interface HeaderProfileProps {
  account: UserAccount;
  user: User;
  accountFollowing: string[];
}

export const HeaderProfile = ({
  user,
  account,
  accountFollowing,
}: HeaderProfileProps): JSX.Element => {
  const atHandle = user.handle;
  const primary = atHandle;
  const secondary = user?.profile?.name || "";

  return (
    <div className={styles.root}>
      <Card.Meta
        className={styles.metaInnerBlock}
        avatar={<UserAvatar user={user} avatarSize={"medium"} />}
        title={
          <FromTitle user={user}/>
        } />
        <div className={styles.profile}>
          {secondary}
          {!secondary && "No Profile"}
        </div>
        {account.dsnpId !== user.dsnpId && (<GraphChangeButton
            user={user}
            initialRelationshipStatus={
              accountFollowing.includes(user.dsnpId)
                ? RelationshipStatus.FOLLOWING
                : RelationshipStatus.NONE
            }
          />)}
      </div>
  );
};
