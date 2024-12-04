import { developmentBookmarks } from "./developmentBookmarks";
import { designBookmarks } from "./designBookmarks";
import { Bookmark } from "@/types/bookmark";

export const allBookmarks: Bookmark[] = [
  ...developmentBookmarks,
  ...designBookmarks,
];

export * from "./developmentBookmarks";
export * from "./designBookmarks";