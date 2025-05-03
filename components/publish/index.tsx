"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Check, Copy, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { Doc } from "@/convex/_generated/dataModel";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/useOrigin";
import printJS from "print-js";

interface PublishProps {
  initialData: Doc<"documents">;
}

export const Publish = ({ initialData }: PublishProps) => {
  const t = useTranslations();
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: t("loading.publishNote"),
      success: t("success.publishNote"),
      error: t("error.publishNote"),
    });
  };

  const onUnpublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: t("loading.unPublishNote"),
      success: t("success.unPublishNote"),
      error: t("error.unPublishNote"),
    });
  };

  function generateHTMLFromJSON(data: any) {
    let htmlContent = "";

    JSON.parse(data).forEach((item: any) => {
      if (item.type === "paragraph") {
        let paragraphContent = item.content
          .map((c: any) =>
            c.type === "text"
              ? `<span style="${generateStyles(c.styles)}">${c.text}</span>`
              : ""
          )
          .join("");
        htmlContent += `<p style="text-align:${item.props.textAlignment};">${paragraphContent}</p>`;
      }
    });

    return htmlContent;
  }

  function generateStyles(styles: any) {
    let stylesString = "";
    for (let prop in styles) {
      stylesString += `${prop}:${styles[prop]};`;
    }
    return stylesString;
  }

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    console.log(generateHTMLFromJSON(initialData.content));

    toast.success(t("success.copyPublishedLink"));
    // window.print();
    printJS({
      printable: generateHTMLFromJSON(initialData.content),
      type: "json",
      documentTitle: "hi",
      // header: generateHTMLFromJSON(initialData.content),
    });

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">
          {t("button.publish")}
          {initialData.isPublished && (
            <Globe className="text-sky-500 w-4 h-4 ml-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                {t("thisNoteIsLiveOnWeb")}
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full text-xs"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              {t("button.unpublish")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">{t("publishThisNote")}</p>
            <span className="text-xs text-muted-foreground mb-4">
              {t("shareYouWorkWithOther")}
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              {t("button.publish")}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
