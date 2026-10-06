import records from '@/.generated/posts.json';
import type {Post} from './types';
export function listPosts():Post[]{return records as Post[]}
export function findPost(slug:string){return listPosts().find(post=>post.slug===slug)}
