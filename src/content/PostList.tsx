import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BlankPost from "./BlankPost";
import Post from "./Post";
import * as dsnpLink from "../dsnpLink";
import { User, FeedTypes } from "../types";

type PostListProps = {
  feedType: FeedTypes;
  user: User;
};

type FeedItem = dsnpLink.BroadcastExtended;

const dsnpLinkCtx = dsnpLink.createContext();

const itemsPerPage = 5;

const PostList = ({ feedType, user }: PostListProps): JSX.Element => {
  // const [headBlockNumber, setHeadBlockNumber] = React.useState<number | undefined>(undefined);
  const [oldestBlockNumber, setOldestBlockNumber] = React.useState<
    number | undefined
  >(undefined);
  const [isLoading, setIsLoading] = React.useState(false);

  const [currentFeed, setCurrentFeed] = React.useState<FeedItem[]>([]);

  const postGetPosts = (
    newOldestBlockNumber: number,
    newPosts: dsnpLink.BroadcastExtended[]
  ) => {
    setOldestBlockNumber(newOldestBlockNumber);
    setCurrentFeed([...currentFeed, ...newPosts]);
    setIsLoading(false);
  };

  const getFeed = async () => {
    const result = await dsnpLink.getFeed(dsnpLinkCtx, {
      pageSize: itemsPerPage,
      startBlockNumber: oldestBlockNumber,
    });
    postGetPosts(result.oldestBlockNumber, result.posts);
  };

  const getUserPosts = async (dsnpId: number) => {
    const result = await dsnpLink.getUserFeed(dsnpLinkCtx, {
      dsnpId,
      pageSize: itemsPerPage,
      startBlockNumber: oldestBlockNumber,
    });
    postGetPosts(result.oldestBlockNumber, result.posts);
  };

  useEffect(() => {
    fetchData();
  }, [feedType, user]);

  const fetchData = () => {
    setIsLoading(true);
    switch (feedType) {
      case FeedTypes.MY_FEED:
        getFeed();
        return;
      case FeedTypes.DISPLAY_ID_POSTS:
        getUserPosts(user.dsnpId);
        return;
    }
  };

  const hasMore = oldestBlockNumber ? oldestBlockNumber > 1 : true;

  return (
    <div className="PostList__block">
      {isLoading && <BlankPost />}
      {oldestBlockNumber !== undefined && currentFeed.length > 0 ? (
        <InfiniteScroll
          dataLength={currentFeed.length + (hasMore ? 1 : 0)}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<h4>That's all there is!</h4>}
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
