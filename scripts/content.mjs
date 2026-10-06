import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'yaml';
import {z} from 'zod';

const url=z.string().max(1000).refine(value=>!value||/^https?:\/\/[^\s]+$/i.test(value));
const author=z.object({name:z.string().trim().min(1).max(80),url:url.optional(),bio:z.string().max(600).optional()});
const optionsSchema=z.object({
  authors:z.array(author).min(1).max(16),editor:z.string().max(100).optional(),showToc:z.boolean().optional(),
  formulaOverflow:z.enum(['scroll','multiline']).optional(),tableStyle:z.enum(['rules','grid','zebra']).optional(),tableWidth:z.enum(['scroll','wide']).optional(),numberFigures:z.boolean().optional(),
  thumbnail:z.string().max(1000).refine(value=>!value||/^https?:\/\/[^\s]+$/i.test(value)||/^\/media\/[^\s]+$/.test(value)).optional(),
  revisions:z.array(z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),note:z.string().min(1).max(500)})).max(40).optional(),
  related:z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).max(3).optional()
});
const schema=z.object({
  slug:z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),title:z.string().trim().min(1).max(180),
  date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value=>{const date=new Date(value+'T00:00:00Z');return !Number.isNaN(date.getTime())&&date.toISOString().startsWith(value)}),
  summary:z.string().max(1200).default(''),category:z.string().max(100).default(''),tags:z.array(z.string().max(80)).max(30).default([]),
  content:z.string().trim().min(1),options:optionsSchema
});

export function parseArticle(source,fileName){
  const normalized=source.replace(/^\uFEFF/,'').replaceAll('\r\n','\n');
  const match=normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if(!match)throw new Error(fileName+': 缺少 YAML 文章信息。');
  const data=parse(match[1],{maxAliasCount:20});
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error(fileName+': 文章信息应为对象。');
  if(data.draft===true||data.status==='draft'||data.sample===true)return null;
  if(data.status!==undefined&&data.status!=='published')throw new Error(fileName+': status 只能是 draft 或 published。');
  const options={...(data.options??{})};
  for(const key of ['authors','editor','showToc','formulaOverflow','tableStyle','tableWidth','thumbnail','numberFigures','revisions','related'])if(data[key]!==undefined)options[key]=data[key];
  if(Array.isArray(options.authors))options.authors=options.authors.map(value=>typeof value==='string'?{name:value}:value);
  const result=schema.safeParse({...data,slug:data.slug??path.basename(fileName,'.md'),content:normalized.slice(match[0].length),options});
  if(!result.success)throw new Error(fileName+': '+result.error.issues.map(issue=>issue.path.join('.')+' '+issue.message).join('; '));
  const post=result.data;
  return {...post,id:post.slug,status:'published',sample:false,updatedAt:post.date+'T00:00:00Z'};
}

export function loadArticles(directory){
  if(!fs.existsSync(directory))return [];
  const seen=new Set();
  const posts=[];
  for(const fileName of fs.readdirSync(directory).filter(file=>file.endsWith('.md')).sort()){
    const full=path.join(directory,fileName);
    if(!fs.lstatSync(full).isFile())throw new Error('文章必须是普通文件：'+fileName);
    const source=fs.readFileSync(full,'utf8');
    const post=parseArticle(source,fileName);
    if(!post)continue;
    if(seen.has(post.slug))throw new Error('文章 slug 重复：'+post.slug);
    seen.add(post.slug);posts.push({post,source});
  }
  return posts.sort((a,b)=>b.post.date.localeCompare(a.post.date)||a.post.slug.localeCompare(b.post.slug));
}

export const xml=value=>String(value).replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]));
export function makeFeed(posts,origin='https://pkulab.github.io'){
  return '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>未竟 · 机器学习札记</title><link>'+origin+'/</link><description>机器学习与大模型研究手记</description><language>zh-cn</language>'+posts.slice(0,50).map(post=>'<item><title>'+xml(post.title)+'</title><link>'+origin+'/posts/'+post.slug+'/</link><guid isPermaLink="true">'+origin+'/posts/'+post.slug+'/</guid><description>'+xml(post.summary)+'</description><dc:creator>'+xml(post.options.authors.map(value=>value.name).join('、'))+'</dc:creator><pubDate>'+new Date(post.date+'T00:00:00+08:00').toUTCString()+'</pubDate></item>').join('')+'</channel></rss>\n';
}
