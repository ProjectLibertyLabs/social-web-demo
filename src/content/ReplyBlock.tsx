import React from "react";
import ReplyInput from "./ReplyInput";
import * as dsnpLink from "../dsnpLink";
import { DSNPContentURI } from "../helpers/dsnp";
import Post from "./Post";

interface isReplyLoadingType {
  loading: boolean;
  parent: DSNPContentURI | undefined;
}

interface ReplyBlockProps {
  parentURI: DSNPContentURI;
  replies: dsnpLink.ReplyExtended[];
  goToProfile: (dsnpId: number) => void;
  showReplyInput: boolean;
}

const ReplyBlock = ({
  parentURI,
  replies,
  goToProfile,
  showReplyInput,
}: ReplyBlockProps): JSX.Element => {
  return (
    <>
      <div className="ReplyBlock__repliesList">
        {replies.length > 0 && (
          <>
            {replies.map((reply, index) => (
              <Post
                feedItem={reply}
                goToProfile={goToProfile}
                key={index}
                showReplyInput={false}
              />
            ))}
          </>
        )}
      </div>
      (showReplyInput && <ReplyInput parentURI={parentURI} />)
    </>
  );
};

export default ReplyBlock;
