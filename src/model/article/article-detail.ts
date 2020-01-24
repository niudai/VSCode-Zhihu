import { ITarget } from "../target/target";

export interface IArticle extends ITarget {
    title: string,
    excerpt_title: "",
    image_url: "",
    title_image: "",
    excerpt: string,
    content: string,
}