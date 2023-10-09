import * as r from "@typoas/runtime";
import React from "react";
import { Modal } from "antd";
import type { User } from "../types";
import type { UploadFile } from "antd/es/upload/interface";
import * as dsnpLink from "../dsnpLink";
import { getContext } from "../service/AuthService";
import { makeInteractionIdAndNonce } from "../service/CredentialService";

interface ReviewProcessorProps {
  account: User;
}

type ReviewProcessorValues = {
  message: string;
  images: UploadFile[];
};

const ReviewProcessor = ({ account }: ReviewProcessorProps): JSX.Element => {
  const [saving, setSaving] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(true);

  let interactionTicket: any | null = null;
  let nonce: string | null = null;

  const success = () => {
    setSaving(false);
    setOpen(false);
  };

  if (!location.search || !location.search.startsWith("?")) {
    return <div>Must specify query string</div>;
  }
  const params = new URLSearchParams(location.search.substring(1));
  const href = params.get("href") || "";
  const attributeSetType = params.get("attributeSetType") || "";
  const reviewText = params.get("text") || "";
  const successUrl = params.get("success_url") || "";
  const errorUrl = params.get("error_url") || "";

  const getInteractionTicket = async () => {
    if (location.search && location.search.startsWith("?")) {
      const params = new URLSearchParams(location.search.substring(1));
      // Generate an interaction Id
      const { interactionId, nonce: nonceStr } = makeInteractionIdAndNonce(
        account.dsnpId,
      );
      nonce = nonceStr;
      const reference = JSON.parse(params.get("reference") || "{}");

      // submit these to get a ticket
      const json = await dsnpLink.submitInteraction(
        getContext(),
        {},
        { href, attributeSetType, interactionId, reference },
      );
      return json;
    }
  };

  const doSubmit = () => {
    getInteractionTicket()
      .then((interactionResponse) => {
        if (
          !interactionResponse ||
          interactionResponse.attributeSetType !== attributeSetType
        ) {
          doRedirect(errorUrl);
        } else {
          interactionTicket = interactionResponse.ticket;
          createPost({
            message: reviewText,
            images: [],
          })
            .then(() => {
              // Redirect back to application
              doRedirect(successUrl);
            })
            .catch((e) => {
              // Redirect to error
              doRedirect(errorUrl);
            });
        }
      })
      .catch((e) => {
        doRedirect(errorUrl);
      });
  };

  const doRedirect = (url: string) => {
    window.location.replace(url);
  };

  const createPost = async (formValues: ReviewProcessorValues) => {
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
      //success();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  const previewCache: any = {};

  return (
    <Modal
      title="Post your review"
      open={open}
      onCancel={
        () => {
          setOpen(false);
          doRedirect(errorUrl);
        } /* onCancel */
      }
      onOk={doSubmit}
      centered={true}
    >
      Your review will be posted as {account.handle}.
    </Modal>
  );
};

export default ReviewProcessor;
