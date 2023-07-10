import React from "react";
import { RelationshipStatus, User, UserAccount } from "../types";
import GraphChangeButton from "./GraphChangeButton";
import { FromTitle } from "../content/FromTitle";
import UserAvatar from "../chrome/UserAvatar";
import styles from "./ConnectionsListProfiles.module.css";

interface ConnectionsListProfilesProps {
  account: UserAccount;
  connectionsList: User[];
  accountFollowing: string[];
}

const ConnectionsListProfiles = ({
  account,
  connectionsList,
  accountFollowing,
}: ConnectionsListProfilesProps): JSX.Element => {
  return (
    <>
      {connectionsList.map((user) => (
        <div className={styles.profile} key={user.dsnpId}>
          <UserAvatar user={user} avatarSize="small" />
          <div className={styles.name}>
            <FromTitle user={user} />
          </div>
          {/* Skip change button for self */}
          {user.dsnpId !== account.dsnpId && (
            <GraphChangeButton
              user={user}
              initialRelationshipStatus={
                accountFollowing.includes(user.dsnpId)
                  ? RelationshipStatus.FOLLOWING
                  : RelationshipStatus.NONE
              }
            />
          )}
        </div>
      ))}
    </>
  );
};
export default ConnectionsListProfiles;
