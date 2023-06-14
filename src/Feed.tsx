import React, { useEffect, useState } from "react";
import NewPost from "./content/NewPost";
import PostList from "./content/PostList";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { UserAccount, FeedTypes, User } from "./types";

type FeedProps = {
  account: UserAccount;
};

const Feed = ({ account }: FeedProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [feedType, setFeedType] = useState<FeedTypes>(FeedTypes.MY_FEED);
  const [showDisplayIdNav, setShowDisplayIdNav] = useState<boolean>(false);
  const [user, setUser] = useState<User>(account);

  // const user: types.User = displayId
  //   ? users[displayId]
  //   : { fromId: "unknown", blockNumber: 0, blockIndex: 0, batchIndex: 0 };

  const feedNavClassName = (navItemType: FeedTypes) =>
    feedType === navItemType
      ? "Feed__navigationItem Feed__navigationItem--active"
      : "Feed__navigationItem";

  const resetFeed = () => {
    setShowDisplayIdNav(false);
    setFeedType(FeedTypes.MY_FEED);
  };

  // useEffect(() => {
  //   showDisplayIdNav && setFeedType(FeedTypes.DISPLAY_ID_POSTS);
  // }, [showDisplayIdNav, displayId]);

  return (
    <div className="Feed__block">
      <div className="Feed__header">
        <nav className="Feed__navigation">
          {showDisplayIdNav && (
            <>
              <div className="Feed__backArrow" onClick={() => resetFeed()}>
                <ArrowLeftOutlined />
              </div>
              <div
                className={feedNavClassName(FeedTypes.DISPLAY_ID_POSTS)}
                onClick={() => setFeedType(FeedTypes.DISPLAY_ID_POSTS)}
              >
                {/* <UserName user={user} /> */}
                TODO: Single User's Posts
              </div>
              <div className="Feed__navigationSpacer"></div>
            </>
          )}
          <div
            className={feedNavClassName(FeedTypes.DISCOVER)}
            onClick={() => setFeedType(FeedTypes.DISCOVER)}
          >
            Discover
          </div>
          <div className="Feed__navigationSpacer"></div>
          <div
            className={feedNavClassName(FeedTypes.MY_FEED)}
            onClick={() => setFeedType(FeedTypes.MY_FEED)}
          >
            My Feed
          </div>
          <div className="Feed__navigationSpacer"></div>
          <div
            className={feedNavClassName(FeedTypes.DISPLAY_ID_POSTS)}
            onClick={() => setFeedType(FeedTypes.DISPLAY_ID_POSTS)}
          >
            TODO: My Posts
          </div>
        </nav>
        <Button
          className="Feed__newPostButton"
          onClick={() => setIsModalOpen(true)}
        >
          New Post
        </Button>
        {isModalOpen && (
          <NewPost
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
            account={account}
          />
        )}
      </div>
      <PostList feedType={feedType} user={user} />
    </div>
  );
};
export default Feed;
