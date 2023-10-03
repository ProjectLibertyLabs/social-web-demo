import CachedLinkPreview from "./CachedLinkPreview";
import { User } from "../types";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
} from "@ant-design/icons";
import { verifyInteractionId } from "../service/CredentialService";

import type {
  ActivityContentTag,
  ActivityContentInteraction,
} from "@dsnp/activity-content/types";

interface PostTagsProps {
  tags: ActivityContentTag[];
  user: User;
}

function isInteraction(
  tag: ActivityContentTag
): tag is ActivityContentInteraction {
  return (tag as any).type?.toLowerCase() === "interaction";
}

const PostTags = ({ tags, user }: PostTagsProps): JSX.Element => {
  const renderTag = (tag: ActivityContentTag, index: any) => {
    if (isInteraction(tag)) {
      if (!verifyInteractionId(tag.ticket?.credentialSubject?.interactionId || "", user.dsnpId, tag.nonce)) {
        return (<Tag key={index} color="error">Invalid interactionId on credential</Tag>);
      }

      // FIXME verify credential signature
      // FIXME display verified review capsuletag
    
      return (
        <div key={index}>
          {isInteraction(tag) && (<>
            <div><Tag icon={<CheckCircleOutlined />} color="processing">Verified Purchase</Tag></div>
            <div><CachedLinkPreview url={tag.href}/></div>
            </>
          )}
        </div>
      );
    } else {
      // Unhandled tag
      return (<></>);
    }
  };
  if (!tags) return (<></>);
  if (!Array.isArray(tags)) return renderTag(tags, 0);
  const getPostTagsItems = () => {
    return tags.map((tag, index: any) => {
      return renderTag(tag, index);
    });
  };

  return (
    <div>{getPostTagsItems()}</div>
  );
};
export default PostTags;
