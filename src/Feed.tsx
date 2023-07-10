import React, { useState } from "react";
import NewPost from "./content/NewPost";
import PostList from "./content/PostList";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { UserAccount, FeedTypes, User } from "./types";
import styles from "./Feed.module.css";

type FeedProps = {
  account: UserAccount;
  user: User | undefined;
  accountFollowing: string[];
  goToProfile: (dsnpId: string) => void;
};

const Feed = ({ account, user, accountFollowing, goToProfile }: FeedProps): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());
  const [feedType, setFeedType] = useState<FeedTypes>(FeedTypes.MY_FEED);
  const [showDisplayIdNav, setShowDisplayIdNav] = useState<boolean>(false);

  if (feedType === FeedTypes.DISPLAY_ID_POSTS && user?.dsnpId === account.dsnpId) {
    setFeedType(FeedTypes.MY_POSTS);
  }

  if (feedType === FeedTypes.DISPLAY_ID_POSTS && !user) {
    setFeedType(FeedTypes.MY_FEED);
  }

  const feedNavClassName = (navItemType: FeedTypes) =>
    feedType === navItemType
      ? [styles.navigationItem, styles["navigationItem--active"]].join(" ")
      : styles.navigationItem;

  const resetFeed = () => {
    setShowDisplayIdNav(false);
    setFeedType(FeedTypes.MY_FEED);
  };

  const showProfile = (dsnpId: string) => {
    setFeedType(FeedTypes.DISPLAY_ID_POSTS);
    goToProfile(dsnpId);
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <nav className={styles.navigation}>
          {user && feedType === FeedTypes.DISPLAY_ID_POSTS && (
            <>
              <div className={styles.backArrow} onClick={() => resetFeed()}>
                <ArrowLeftOutlined />
              </div>
              <div
                className={feedNavClassName(FeedTypes.DISPLAY_ID_POSTS)}
              >
                @{user.handle}&nbsp;Posts
              </div>
              <div className={styles.navigationSpacer}></div>
            </>
          )}
          <div
            className={feedNavClassName(FeedTypes.DISCOVER)}
            onClick={() => setFeedType(FeedTypes.DISCOVER)}
          >
            Discover
          </div>
          <div className={styles.navigationSpacer}></div>
          <div
            className={feedNavClassName(FeedTypes.MY_FEED)}
            onClick={() => setFeedType(FeedTypes.MY_FEED)}
          >
            My Feed
          </div>
          <div className={styles.navigationSpacer}></div>
          <div
            className={feedNavClassName(FeedTypes.MY_POSTS)}
            onClick={() => {
              goToProfile(account.dsnpId);
              setFeedType(FeedTypes.MY_POSTS);
            }}
          >
            My Posts
          </div>
        </nav>
        <Button
          className={styles.newPostButton}
          onClick={() => setIsModalOpen(true)}
        >
          New Post
        </Button>
        {isModalOpen && (
          <NewPost
            onSuccess={() => {
              setIsModalOpen(false);
              setIsPosting(true);
              setTimeout(() => {
                setRefreshTrigger(Date.now());
                setIsPosting(false);
              }, 12_000);
            }}
            onCancel={() => setIsModalOpen(false)}
            account={account}
          />
        )}
      </div>
      <Spin spinning={isPosting} size="large" />
      <PostList
        refreshTrigger={refreshTrigger}
        feedType={feedType}
        user={user}
        goToProfile={showProfile}
        resetFeed={resetFeed}
      />
    </div>
  );
};
export default Feed;
