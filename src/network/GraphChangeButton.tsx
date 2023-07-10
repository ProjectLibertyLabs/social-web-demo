import React from "react";
import { Button } from "antd";
import styles from "./GraphChangeButton.module.css";
import * as dsnpLink from "../dsnpLink";
import { RelationshipStatus, User } from "../types";
import { getContext } from "../service/AuthService";

interface GraphChangeButtonProps {
  user: User;
  initialRelationshipStatus: RelationshipStatus;
}

const GraphChangeButton = ({
  user,
  initialRelationshipStatus,
}: GraphChangeButtonProps): JSX.Element => {
  const [relationshipStatus, setRelationshipStatus] =
    React.useState<RelationshipStatus>(initialRelationshipStatus);

  const isFollowing = relationshipStatus === RelationshipStatus.FOLLOWING;

  const isFollowingUpdating = relationshipStatus === RelationshipStatus.UPDATING;

  const buttonText = (): string =>
    isFollowingUpdating ? "Updating" :
    isFollowing ? "Unfollow"
    : "Follow";

  const changeGraphState = async () => {
    setRelationshipStatus(RelationshipStatus.UPDATING);
    if (isFollowing) {
      await dsnpLink.graphFollow(getContext(), { dsnpId: user.dsnpId });
    } else {
      await dsnpLink.graphUnfollow(getContext(), { dsnpId: user.dsnpId });
    }
  };

  return (
    <Button
      className={styles.root}
      name={buttonText()}
      size="small"
      onClick={() => changeGraphState()}
      loading={isFollowingUpdating}
    >
      {buttonText()}
    </Button>
  );
};
export default GraphChangeButton;
