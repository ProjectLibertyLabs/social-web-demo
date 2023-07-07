import React from "react";
import { RelationshipStatus, User, UserAccount } from "../types";
import GraphChangeButton from "./GraphChangeButton";
import { FromTitle } from "../content/FromTitle";
import UserAvatar from "../chrome/UserAvatar";
import styles from "./ConnectionsListProfiles.module.css";

interface ConnectionsListProfilesProps {
  account: UserAccount;
  graphRootUser: User;
  connectionsList: User[];
}

const ConnectionsListProfiles = ({
  account,
  graphRootUser,
  connectionsList,
}: ConnectionsListProfilesProps): JSX.Element => {
  return (
    <>
      {connectionsList.map((user) => (
        <div className={styles.profile} key={user.dsnpId}>
          <UserAvatar user={user} avatarSize="small" />
          <div className={styles.name}>
            <FromTitle user={user} />
          </div>
          <GraphChangeButton
            account={account}
            user={user}
            // TODO: Fix initial status
            initialRelationshipStatus={RelationshipStatus.FOLLOWING}
          />
        </div>
      ))}
    </>
  );
};
export default ConnectionsListProfiles;
