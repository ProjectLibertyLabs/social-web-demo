import CachedLinkPreview from "./CachedLinkPreview";
import { User } from "../types";
import { Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import type {
  ActivityContentTag,
  ActivityContentInteraction,
} from "@dsnp/activity-content/types";

interface PostTagsProps {
  tags: ActivityContentTag[];
  verifiedInteractions: any;
}

function isInteraction(
  tag: ActivityContentTag,
): tag is ActivityContentInteraction {
  return (tag as any).type?.toLowerCase() === "interaction";
}

const PostTags = ({
  tags,
  verifiedInteractions,
}: PostTagsProps): JSX.Element => {
  const renderTag = (tag: ActivityContentTag, index: any) => {
    if (isInteraction(tag)) {
      // Check if it's in verifiedInteractions
      const found = verifiedInteractions.find(
        (item: any) => item.href === tag.href,
      );
      if (found) {
        return (
          <div key={index}>
            {isInteraction(tag) && (
              <>
                <div>
                  <Tag icon={<CheckCircleOutlined />} color="processing">
                    {found.label["en-US"]}
                  </Tag>
                </div>
                <div>
                  <CachedLinkPreview url={found.href} />
                </div>
              </>
            )}
          </div>
        );
      } //found
    } // isInteraction
    return <></>; // TODO support other tag types
  };

  if (!tags) return <></>;
  if (!Array.isArray(tags)) return renderTag(tags, 0);
  const getPostTagsItems = () => {
    return tags.map((tag, index: any) => {
      return renderTag(tag, index);
    });
  };

  return <div>{getPostTagsItems()}</div>;
};

export default PostTags;
