import React from "react";
import { Button, Modal, Input, Form } from "antd";
import UserAvatar from "../chrome/UserAvatar";
import NewPostImageUpload from "./NewPostImageUpload";
import type { User } from "../types";
import { createNote } from "@dsnp/activity-content/factories";
import { InternalUploadFile } from "antd/es/upload/interface";
import * as dsnpLink from "../dsnpLink";

const dsnpLinkCtx = dsnpLink.createContext();

interface NewPostProps {
  onSuccess: () => void;
  onCancel: () => void;
  account: User;
}

type NewPostValues = {
  message: string;
  test: string;
  images: Array<{ upload: { file: InternalUploadFile } }>
};

const NewPost = ({
  onSuccess,
  onCancel,
  account,
}: NewPostProps): JSX.Element => {
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState<boolean>(false);


  const success = () => {
    setSaving(false);
    onSuccess();
  };

  const createPost = async (formValues: NewPostValues) => {
    console.log(formValues);
    const note = createNote(formValues.message, new Date());
    await dsnpLink.createBroadcast(dsnpLinkCtx, {}, note);
    console.log("postActivityContentCreated", { note: note });
    // await sendPost(userId, note);
    // dispatch(postLoading({ loading: true, currentUserId: userId }));
    success();
  };

  return (
    <Modal
      title="New Post"
      open={true}
      onCancel={onCancel}
      footer={null}
      centered={true}
    >
      <Form form={form} onFinish={createPost}>
        <Form.Item>
          <UserAvatar user={account} avatarSize={"medium"} />
          Posting as @{account.handle}
        </Form.Item>
        <Form.Item name="message" required={true}>
          <Input.TextArea rows={4} placeholder="Enter your message" />
        </Form.Item>
        <NewPostImageUpload onChange={(fileList) => {
          form.setFieldsValue({ images: fileList });
          form.validateFields(['images']);
        }} />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Post
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewPost;
