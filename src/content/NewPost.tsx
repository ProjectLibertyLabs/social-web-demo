import React from "react";
import { Button, Space, Spin, Modal, Input } from "antd";
import UserAvatar from "../chrome/UserAvatar";
import NewPostImageUpload from "./NewPostImageUpload";
import type { User } from "../types";
import { createNote } from "@dsnp/activity-content/factories";

interface NewPostProps {
  onSuccess: () => void;
  onCancel: () => void;
  account: User;
}

const NewPost = ({
  onSuccess,
  onCancel,
  account,
}: NewPostProps): JSX.Element => {
  const [saving, setSaving] = React.useState<boolean>(false);
  const [uriList, setUriList] = React.useState<string[]>([]);
  const [postMessage, setPostMessage] = React.useState<string>("");
  const [isValidPost, setIsValidPost] = React.useState<boolean>(false);

  const success = () => {
    setSaving(false);
    onSuccess();
  };

  const createPost = async () => {
    const note = createNote(postMessage, new Date());
    console.log("postActivityContentCreated", { note: note });
    // await sendPost(userId, note);
    // dispatch(postLoading({ loading: true, currentUserId: userId }));
    success();
  };

  const handleMessageInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (saving) return;
    e.target.value !== "" ? setIsValidPost(true) : setIsValidPost(false);
    setPostMessage(e.target.value);
  };

  return (
    <Modal
      className="NewPost"
      open={true}
      onCancel={onCancel}
      width="535px"
      centered={true}
      footer={[
        <Spin spinning={saving} key={1}>
          <Space>
            <Button
              className="NewPost__footerBtn"
              key="post"
              type="primary"
              disabled={!isValidPost || saving}
              onClick={createPost}
            >
              Post
            </Button>
          </Space>
        </Spin>,
      ]}
    >
      <div className="NewPost__textAreaRow">
        <UserAvatar user={account} avatarSize={"medium"} />
        <Input.TextArea
          autoFocus={true}
          className="NewPost__textArea"
          placeholder="Message"
          value={postMessage || ""}
          onChange={(e) => handleMessageInputChange(e)}
          autoSize={{ minRows: 2, maxRows: 5 }}
        />
      </div>
      <NewPostImageUpload onNewPostImageUpload={setUriList} />
    </Modal>
  );
};

export default NewPost;
