'use client';
import React,{useEffect,useRef} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {Link as LinkIcon} from 'lucide-react';
import {CodeBlock} from './code-block';
import {remarkNotebook} from '@/lib/remark-notebook';
import {ResearchImage} from './research-image';
import {Experiment,ExperimentTable} from './experiment';
import type {ArticleOptions} from '@/lib/types';
export function textOf(node:React.ReactNode):string{if(typeof node==='string'||typeof node==='number')return String(node);if(Array.isArray(node))return node.map(textOf).join('');if(React.isValidElement<{children?:React.ReactNode}>(node))return textOf(node.props.children);return ''}
const labels:Record<string,string>={quote:'引用',note:'作者手记',important:'重要结论',tip:'使用条件',warning:'局限与待验证',caution:'操作提醒'};
export function Markdown({content,options={},depth=0}:{content:string;options?:ArticleOptions;depth?:number}){const instance=React.useId().replace(/[^a-zA-Z0-9_-]/g,'');const prefix=depth===0?'section':instance;const body=useRef<HTMLDivElement>(null);useEffect(()=>{const nodes=body.current?.querySelectorAll<HTMLElement>('.katex-display');const check=()=>nodes?.forEach(n=>{n.dataset.overflow=String(n.scrollWidth>n.clientWidth+2)});check();const observer=new ResizeObserver(check);if(body.current)observer.observe(body.current);return()=>observer.disconnect()},[content]);return <div ref={body} className={'prose table-'+(options.tableStyle||'rules')+' '+(options.formulaOverflow==='multiline'?'formula-fit':'formula-scroll')}><ReactMarkdown remarkRehypeOptions={{footnoteLabel:'脚注',footnoteBackLabel:'返回正文'}} skipHtml remarkPlugins={[remarkGfm,remarkMath,[remarkNotebook,{prefix}]]} rehypePlugins={[[rehypeKatex,{strict:'ignore',trust:false,maxExpand:1000,throwOnError:false}]]} components={{
p:({node,children})=>node?.children.some(child=>child.type==='element'&&child.tagName==='img')?<div>{children}</div>:<p>{children}</p>,
h1:({node,children})=><h1 id={String(node?.properties.id||'')}>{children}<a className="heading-anchor" aria-label={'链接到'+textOf(children)} href={'#'+node?.properties.id}><LinkIcon size={14}/></a></h1>,
h4:({node,children})=><h4 id={String(node?.properties.id||'')}>{children}<a className="heading-anchor" aria-label={'链接到'+textOf(children)} href={'#'+node?.properties.id}><LinkIcon size={13}/></a></h4>,
h5:({node,children})=><h5 id={String(node?.properties.id||'')}>{children}<a className="heading-anchor" aria-label={'链接到'+textOf(children)} href={'#'+node?.properties.id}><LinkIcon size={13}/></a></h5>,
h6:({node,children})=><h6 id={String(node?.properties.id||'')}>{children}<a className="heading-anchor" aria-label={'链接到'+textOf(children)} href={'#'+node?.properties.id}><LinkIcon size={13}/></a></h6>,
h2:({node,children})=><h2 id={String(node?.properties.id||'')}>{children}<a className="heading-anchor" aria-label={'链接到'+textOf(children)} href={'#'+node?.properties.id}><LinkIcon size={14}/></a></h2>,
h3:({node,children})=><h3 id={String(node?.properties.id||'')}>{children}<a className="heading-anchor" aria-label={'链接到'+textOf(children)} href={'#'+node?.properties.id}><LinkIcon size={13}/></a></h3>,
blockquote:({node,children})=>{const kind=String(node?.properties['data-kind']||'quote');return <blockquote data-kind={kind}><span className="quote-title">{labels[kind]||labels.quote}</span>{children}</blockquote>},
pre:({node,children})=>{const code=node?.children[0];const props=code?.type==='element'?code.properties:{};const lang=String(props.className||'').replace('language-','');const meta=String(props['data-meta']||'');const value=textOf(children);
if(lang==='details'&&depth<4)return <details className="disclosure" open={/^open\b/.test(meta)}><summary>{meta.replace(/^(?:open|closed)\s*/,'')||'补充推导'}</summary><Markdown content={value} options={options} depth={depth+1}/></details>;
if(lang==='experiment-table')return <ExperimentTable/>;
if(lang==='experiment')return <Experiment source={value}/>;
if(lang==='video'){const url=value.trim();return /^https?:\/\/[^\s]+$|^\/media\/[^\s]+$/i.test(url)?<figure className="research-figure"><video controls preload="none" style={{maxWidth:'100%'}} src={url}>视频无法播放，<a href={url}>下载查看</a></video><figcaption>{meta||'视频 · 点击播放'}</figcaption></figure>:<p className="error-message">视频地址格式不正确。</p>}
return <CodeBlock value={value} meta={meta}/>},
table:({children})=><div className="table-frame"><div className="table-scroll" tabIndex={0} role="region" aria-label="表格，宽表可横向滚动"><table>{children}</table></div></div>,
a:({href,children})=><a href={href} target={href?.startsWith('http')?'_blank':undefined} rel={href?.startsWith('http')?'noreferrer':undefined}>{children}</a>,
img:({node,src,alt})=><ResearchImage src={typeof src==='string'?src:undefined} alt={alt||''} number={options.numberFigures?Number(node?.properties['data-figure']):undefined}/>
}}>{content}</ReactMarkdown></div>}




