"use client";

import Cover from "@/app/[locale]/(main)/_components/cover";
import { Toolbar } from "@/app/[locale]/(main)/_components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import { useMemo } from "react";

interface DocumentDetailProps {
  params: {
    documentId: Id<"documents">;
  };
}
const DocumentDetail = ({ params }: DocumentDetailProps) => {
  const t = useTranslations();
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor/index"), { ssr: false }),
    []
  );
  const update = useMutation(api.documents.update);

  const document = useQuery(api.documents.getDocById, {
    documentId: params.documentId,
  });

  if (document === undefined) {
    return (
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
        <div className="space-y-4 ml-8 pt-4">
          <Skeleton className="h-20 w-[50%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[40%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
    );
  }

  const onChangeContent = (content: string) => {
    update({
      id: params.documentId,
      content,
    });
  };

  if (document === null) {
    return <p>{t("notFound")}</p>;
  }

  return (
    <div className="pb-40 pt-10" id="main">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl mx-auto lg:max-w-4xl">
        <Toolbar initialData={document} />
        <Editor onChange={onChangeContent} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentDetail;
