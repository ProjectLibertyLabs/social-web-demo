import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Title from "antd/es/typography/Title";
import BlankPost from "./BlankPost";
import Post from "./Post";
import * as dsnpLink from "../dsnpLink";
import { User, FeedTypes } from "../types";
import { getContext } from "../service/AuthService";
import styles from "./Post.module.css";

type PostListProps = {
  feedType: FeedTypes;
  user: User;
  // Uses Date.now to trigger an update
  refreshTrigger: number;
};

type FeedItem = dsnpLink.BroadcastExtended;

const PostList = ({
  feedType,
  user,
  refreshTrigger,
}: PostListProps): JSX.Element => {
  const [priorTrigger, setPriorTrigger] =
    React.useState<number>(refreshTrigger);
  const [newestBlockNumber, setNewestBlockNumber] = React.useState<
    number | undefined
  >(undefined);
  const [oldestBlockNumber, setOldestBlockNumber] = React.useState<
    number | undefined
  >(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  const [currentFeed, setCurrentFeed] = React.useState<FeedItem[]>([]);

  const postGetPosts = (
    result: dsnpLink.PaginatedBroadcast,
    appendOrPrepend: "append" | "prepend"
  ) => {
    setOldestBlockNumber(
      Math.min(
        oldestBlockNumber || result.oldestBlockNumber,
        result.oldestBlockNumber
      )
    );
    setNewestBlockNumber(
      Math.max(
        newestBlockNumber || result.newestBlockNumber,
        result.newestBlockNumber
      )
    );
    if (appendOrPrepend === "append") {
      setCurrentFeed([...currentFeed, ...result.posts]);
    } else {
      setCurrentFeed([...result.posts, ...currentFeed]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("useEffect", {
      feedType,
      user,
      refreshTrigger,
    });
    const getOlder = refreshTrigger === priorTrigger;
    fetchData(getOlder);
  }, [feedType, user, refreshTrigger]);

  const fetchData = async (getOlder: boolean) => {
    console.log("fetchData", {
      getOlder,
    });
    const params = {
      // Going back in time should be undefined, but forward starts at the oldest
      oldestBlockNumber: getOlder
        ? undefined
        : newestBlockNumber
        ? newestBlockNumber + 1
        : undefined,
      // Going back in time should start at our oldest, but going forward is undefined
      newestBlockNumber: getOlder
        ? oldestBlockNumber
          ? oldestBlockNumber - 1
          : undefined
        : undefined,
    };
    setPriorTrigger(refreshTrigger);
    setIsLoading(true);
    const appendOrPrepend = getOlder ? "append" : "prepend";
    switch (feedType) {
      case FeedTypes.MY_FEED:
        postGetPosts(
          await dsnpLink.getFeed(getContext(), params),
          appendOrPrepend
        );
        return;
      case FeedTypes.DISPLAY_ID_POSTS:
        postGetPosts(
          await dsnpLink.getUserFeed(getContext(), {
            dsnpId: user.dsnpId,
            ...params,
          }),
          appendOrPrepend
        );
        return;
    }
  };

  const hasMore = oldestBlockNumber ? oldestBlockNumber > 1 : true;

  return (
    <div className={styles.root}>
      {isLoading && <BlankPost />}
      {oldestBlockNumber !== undefined && currentFeed.length > 0 ? (
        <InfiniteScroll
          dataLength={currentFeed.length + (hasMore ? 1 : 0)}
          next={() => {
            fetchData(false);
          }}
          hasMore={hasMore}
          loader={<Title level={4}>Loading...</Title>}
          endMessage={<Title level={4}>That's all there is!</Title>}
        >
          {currentFeed.map((feedItem, index) => (
            <Post
              key={index}
              feedItem={feedItem}
              showReplyInput={true}
              goToProfile={() => {}}
            />
          ))}
        </InfiniteScroll>
      ) : (
        "Empty Feed!"
      )}
    </div>
  );
};

export default PostList;
