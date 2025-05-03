"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpanded?: () => void;

  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

const Item = ({
  label,
  icon: Icon,
  onClick,
  onExpanded,
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
}: ItemProps) => {
  const t = useTranslations();
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);
  const archieve = useMutation(api.documents.archieve);
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const handleExpanded = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onExpanded?.();
  };

  const onCreate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = create({
      title: "Untitle",
      parentDocument: id,
    }).then((documentId) => {
      if (!expanded) {
        onExpanded?.();
      }
      router.push(`/documents/${documentId}`);
    });

    toast.promise(promise, {
      loading: t("loading.createNote"),
      success: t("success.createNote"),
      error: t("error.createNote"),
    });
  };

  const onArchieve = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (!id) return;
    const promise = archieve({
      id,
    });
    toast.promise(promise, {
      loading: t("loading.deleteNote"),
      success: t("success.deleteNote"),
      error: t("error.deleteNote"),
    });
  };

  return (
    <div
      role="button"
      onClick={onClick}
      className={cn(
        "p-3 group min-h-[27px] text-sm  w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
      style={{
        paddingLeft: level ? `${level * 12 + 12}px` : "12px",
      }}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
          onClick={handleExpanded}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink h-[18px] mr-2">{documentIcon}</div>
      ) : (
        <Icon className="shrink h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate ">{label}</span>

      {isSearch && (
        <>
          <kbd className="ml-auto inline-flex pointer-events-none items-center h-5 select-none gap-1.5 rounded bg-muted border px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-sm">⌘</span>k
          </kbd>
        </>
      )}

      {!!id && (
        <div
          role="button"
          onClick={onCreate}
          className="ml-auto flex items-center gap-x-2"
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div role="button">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchieve}>
                <Trash className="w-4 h-4 mr-2" />
                {t("button.remove")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                {t("label.lastEditedBy", { user: user?.fullName })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="opacity-0 group-hover:opacity-100 h-full ml-auto duration-200 rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      className="flex gap-x-2 py-1.5"
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
