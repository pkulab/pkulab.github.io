import {z} from 'zod';
const httpUrl=z.string().max(1000).refine(v=>!v||/^https?:\/\/[^\s]+$/i.test(v),'主页需为 http(s) 地址');
export const articleOptionsSchema=z.object({
authors:z.array(z.object({name:z.string().trim().min(1).max(80),url:httpUrl.optional(),bio:z.string().trim().max(600).optional()})).max(16).optional(),
editor:z.string().trim().max(100).optional(),showToc:z.boolean().optional(),formulaOverflow:z.enum(['scroll','multiline']).optional(),tableStyle:z.enum(['rules','grid','zebra']).optional(),tableWidth:z.enum(['scroll','wide']).optional(),numberFigures:z.boolean().optional(),
thumbnail:z.string().max(1000).refine(v=>!v||/^https?:\/\/[^\s]+$/i.test(v)||/^\/(?!\/)[^\s]*$/.test(v)).optional(),
revisions:z.array(z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),note:z.string().trim().min(1).max(500)})).max(40).optional(),
related:z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120)).max(3).optional()
});
export function readArticleOptions(value:unknown){try{const parsed=articleOptionsSchema.safeParse(typeof value==='string'?JSON.parse(value):value);return parsed.success?parsed.data:{}}catch{return {}}}
export function safeExternalUrl(url?:string){return url&&/^https?:\/\/[^\s]+$/i.test(url)?url:undefined}
