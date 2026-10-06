'use client';
import React from 'react';
import {Copy,Check} from 'lucide-react';
export function CodeBlock({value,meta=''}:{value:string;meta?:string}){const[copied,setCopied]=React.useState('');const numbered=/\blinenos\b/.test(meta);const highlights=new Set<number>();for(const part of (meta.match(/\{([\d, -]+)\}/)?.[1]||'').split(',')){const[a,b]=part.trim().split('-').map(Number);if(a>0)for(let n=a;n<=Math.min(b||a,1000);n++)highlights.add(n)}return <div className="code-block"><div className="code-toolbar"><button aria-label={copied||'复制代码'} onClick={async()=>{try{await navigator.clipboard.writeText(value);setCopied('已复制')}catch{setCopied('复制失败，请手动选择代码')}setTimeout(()=>setCopied(''),2500)}}>{copied==='已复制'?<Check size={14}/>:<Copy size={14}/>}<span role="status">{copied||'复制'}</span></button></div><pre><code>{numbered||highlights.size?value.replace(/\n$/,'').split('\n').map((line,i)=><span className={'code-line '+(highlights.has(i+1)?'emphasis':'')} key={i}>{numbered&&<span className="line-number" aria-hidden="true">{i+1}</span>}{line||'\n'}</span>):value}</code></pre></div>}


