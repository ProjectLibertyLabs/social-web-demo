import * as r from "@typoas/runtime";
import React from "react";
import { Button, Modal, Input, Form } from "antd";
import UserAvatar from "../chrome/UserAvatar";
import NewPostImageUpload from "./NewPostImageUpload";
import CachedLinkPreview from "./CachedLinkPreview";
import type { User } from "../types";
import type { UploadFile } from "antd/es/upload/interface";
import * as dsnpLink from "../dsnpLink";
import { getContext } from "../service/AuthService";
import { makeInteractionIdAndNonce } from "../service/CredentialService";

interface NewReviewProps {
  onSuccess: () => void;
  onCancel: () => void;
  account: User;
}

type NewReviewValues = {
  message: string;
  images: UploadFile[];
};

const NewReview = ({
  onSuccess,
  onCancel,
  account,
}: NewReviewProps): JSX.Element => {
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState<boolean>(false);
  const [interactionTicket, setInteractionTicket] = React.useState<any>({});
  const [nonce, setNonce] = React.useState<string>("z");
  const [open, setOpen] = React.useState<boolean>(true);

  const success = () => {
    setSaving(false);
    setOpen(false);
    onSuccess();
  };

  if (!location.search || !location.search.startsWith("?")) {
    return <div>Must specify query string</div>;
  }
  const params = new URLSearchParams(location.search.substring(1));
  const href = params.get("href") || "";
  const attributeSetType = params.get("attributeSetType") || "";

  const getInteractionTicket = async () => {
    if (location.search && location.search.startsWith("?")) {
      const params = new URLSearchParams(location.search.substring(1));
      // Generate an interaction Id
      const { interactionId, nonce } = makeInteractionIdAndNonce(
        account.dsnpId,
      );
      setNonce(nonce);
      const reference = JSON.parse(params.get("reference") || "{}");

      // submit these to get a ticket
      const ctx = getContext();
      const req = await ctx.createRequest({
        path: "/v1/interactions",
        params: {},
        method: r.HttpMethod.POST,
        auth: ["tokenAuth"],
        body: { href, attributeSetType, interactionId, reference },
      });
      const res = await ctx.sendRequest(req);
      const json = await res.body.json();
      return json;
    }
  };

  React.useEffect(() => {
    getInteractionTicket().then((interactionResponse) => {
      if (interactionResponse.attributeSetType !== attributeSetType) {
        // TODO handle this error
      } else {
        setInteractionTicket(interactionResponse.ticket);
      }
    });
  }, []);

  const createPost = async (formValues: NewReviewValues) => {
    try {
      const body = new FormData();
      body.append("content", formValues.message);
      (formValues.images || []).forEach((upload) => {
        if (upload.originFileObj) body.append("images", upload.originFileObj);
      });
      body.append(
        "tag",
        JSON.stringify([
          {
            type: "Interaction",
            href,
            rel: attributeSetType,
            nonce,
            ticket: interactionTicket,
          },
        ]),
      );
      const resp = await dsnpLink.createBroadcast(getContext(), {}, body);
      console.log("postActivityContentCreated", { resp });
      success();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  const previewCache: any = {};

  return (
    <Modal
      title="New Review"
      open={open}
      onCancel={
        () => {
          setOpen(false);
        } /* onCancel */
      }
      footer={null}
      centered={true}
    >
      <Form form={form} onFinish={createPost}>
        <Form.Item>
          <UserAvatar user={account} avatarSize={"medium"} />
          Posting as @{account.handle}
        </Form.Item>
        <Form.Item name="message" required={true}>
          <Input.TextArea rows={4} placeholder={"Enter your review"} />
        </Form.Item>
        <CachedLinkPreview url={href} />
        <NewPostImageUpload
          onChange={(fileList) => {
            form.setFieldsValue({ images: fileList });
            form.validateFields(["images"]);
          }}
        />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving}>
            Post
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewReview;
