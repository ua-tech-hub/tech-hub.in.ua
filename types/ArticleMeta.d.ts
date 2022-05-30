import { ParsedContent } from "@nuxt/content/dist/runtime/types";

export interface ArticleMeta {
  date: string
}

export interface Article extends ParsedContent, ArticleMeta {}
