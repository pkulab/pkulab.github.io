export type Author={name:string;url?:string;bio?:string};
export type ArticleOptions={authors?:Author[];editor?:string;showToc?:boolean;formulaOverflow?:'scroll'|'multiline';tableStyle?:'rules'|'grid'|'zebra';tableWidth?:'scroll'|'wide';thumbnail?:string;numberFigures?:boolean;revisions?:{date:string;note:string}[];related?:string[]};
export type Post={id:string;slug:string;title:string;summary:string;category:string;tags:string[];date:string;content:string;status:'draft'|'published';sample:boolean;updatedAt:string;options?:ArticleOptions};
export function readingMinutes(content:string){return Math.max(1,Math.ceil(content.replace(/\s/g,'').length/450))}
export function authorNames(post:Post){return post.options?.authors?.length?post.options.authors.map(a=>a.name).join('、'):'未署名'}
