import { ARTICLES_STATUS } from "src/constants";

export type ArticleStatusType = (typeof ARTICLES_STATUS)[keyof typeof ARTICLES_STATUS];

export type ArticleType = {
    id: string; // uuid v4
    title: string;
    content: string;
    status: ArticleStatusType;
    authorId: string | null; // refers to User
    categoryId: string | null; // refers to Category
    tags: string[]; // array of tag names
    createdAt: number; // timestamp of creation
    updatedAt: number; // timestamp of last update
}