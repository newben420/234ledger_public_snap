export class Post {
    id?: number;
    category?: number;
    date_created?: string;
    last_modified?: number;
    title?: string;
    description?: string;
    image?: number;
    title_slug?: string;
    is_hap?: 0 | 1;
    visibility?: 0 | 1;
    ready?: 0 | 1;
}