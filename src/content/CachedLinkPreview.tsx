import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { getContext } from "../service/AuthService";
import * as r from "@typoas/runtime";

interface CachedLinkPreviewProps {
  url: string;
}

const CachedLinkPreview = ({
  url,
}: CachedLinkPreviewProps): JSX.Element => {

  const fetchPreview = async (url: string) => {
    const ctx = getContext();
    const req = await ctx.createRequest({
      path: "/preview?url=" + url,
      params: {},
      method: r.HttpMethod.GET,
      auth: ["tokenAuth"],
    });
    const res = await ctx.sendRequest(req);
    const json = await res.body.json();
    return {
      title: json.title || "",
      description: json.description || "",
      image: json.image || "",
      siteName: "",
      hostname: ""
    };
  };

  const previewCache : any = {};

  return (
    <LinkPreview url={url} fetcher={
      async (url) => {
        if (!previewCache[url]) {
          previewCache[url] = fetchPreview(url);
        }
        return previewCache[url];
      }
    } width='400px' />
  )
};

export default CachedLinkPreview;