import React from "react";
import { Button, Spin } from "antd";
import * as dsnpLink from "../dsnpLink";
import { RelationshipStatus, User, UserAccount } from "../types";
import { getContext } from "../service/AuthService";

interface FollowButtonProps {
  account: UserAccount;
  user: User;
  initialRelationshipStatus: RelationshipStatus;
}

const GraphChangeButton = ({
  account,
  user,
  initialRelationshipStatus,
}: FollowButtonProps): JSX.Element => {
  const [relationshipStatus, setRelationshipStatus] =
    React.useState<RelationshipStatus>(initialRelationshipStatus);

  const isFollowing = (): boolean =>
    [RelationshipStatus.FOLLOWING, RelationshipStatus.UPDATING].includes(
      relationshipStatus
    );

  const isFollowingUpdating = (): boolean =>
    relationshipStatus === RelationshipStatus.UPDATING;

  const buttonText = (): string =>
    isFollowingUpdating() ? "updating" : isFollowing() ? "Unfollow" : "Follow";

  const changeGraphState = async () => {
    if (isFollowing()) {
      await dsnpLink.graphFollow(getContext(), { dsnpId: user.dsnpId });
    } else {
      await dsnpLink.graphUnfollow(getContext(), { dsnpId: user.dsnpId });
    }
    setRelationshipStatus(RelationshipStatus.UPDATING);
  };

  return (
    <Button
      className="GraphChangeButton"
      name={buttonText()}
      onClick={() => changeGraphState()}
      disabled={isFollowingUpdating()}
    >
      {buttonText()}
      {isFollowingUpdating() ? (
        <Spin></Spin>
      ) : (
        <div
          className={
            buttonText() === "Follow"
              ? "GraphChangeButton__followIcon"
              : "GraphChangeButton__unfollowIcon"
          }
        >
          &#10005;
        </div>
      )}
    </Button>
  );
};
export default GraphChangeButton;
