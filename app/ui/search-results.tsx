'use client';
import {useEffect,useState,type FormEvent} from 'react';
import {plainText} from '@/lib/text';
import {authorNames,type Post} from '@/lib/types';

function Highlight({text,query}:{text:string;query:string}){
  const parts=[];
  let cursor=0;
  const lower=text.toLocaleLowerCase(),q=query.toLocaleLowerCase();
  let at=lower.indexOf(q);
  while(at>=0&&q){parts.push(text.slice(cursor,at));parts.push(<mark key={at}>{text.slice(at,at+q.length)}</mark>);cursor=at+q.length;at=lower.indexOf(q,cursor)}
  parts.push(text.slice(cursor));return <>{parts}</>;
}
function snippet(post:Post,query:string){
  const text=plainText(post.content),q=query.toLocaleLowerCase();
  const at=text.toLocaleLowerCase().indexOf(q);
  if(at<0)return [post.summary,post.category,post.tags.join(' · ')].find(value=>value.toLocaleLowerCase().includes(q))||text.slice(0,180);
  const start=Math.max(0,at-44);
  return (start?'…':'')+text.slice(start,start+180)+(start+180<text.length?'…':'');
}
export function SearchResults({posts}:{posts:Post[]}){
  const [input,setInput]=useState(''),[query,setQuery]=useState('');
  useEffect(()=>{
    const read=()=>{const q=(new URLSearchParams(window.location.search).get('q')||'').trim().slice(0,120);setInput(q);setQuery(q)};
    read();window.addEventListener('popstate',read);return ()=>window.removeEventListener('popstate',read);
  },[]);
  const results=query?posts.filter(post=>[post.title,post.summary,post.category,post.tags.join(' '),post.content,authorNames(post)].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase())):[];
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const q=input.trim().slice(0,120);setQuery(q);setInput(q);window.history.pushState(null,'',q?'/search/?q='+encodeURIComponent(q):'/search/')}
  return <section className="search-page"><p className="eyebrow">在手记中寻找</p><h1>搜索文章</h1><form action="/search/" method="get" className="search-form" onSubmit={submit}><label className="sr-only" htmlFor="search-query">搜索词</label><input id="search-query" name="q" value={input} onChange={event=>setInput(event.target.value)} placeholder="标题、作者、话题或正文关键词" maxLength={120} type="search"/><button className="button primary" type="submit">搜索</button></form><noscript><p>搜索需要开启 JavaScript。你也可以返回首页浏览文章。</p></noscript>{query?<><p className="search-count">“{query}” · {results.length} 篇文章</p>{results.length?results.map(post=><article className="search-result" key={post.id}><h2><a href={'/posts/'+post.slug+'/'}><Highlight text={post.title} query={query}/></a></h2><div className="post-meta"><span><Highlight text={authorNames(post)} query={query}/></span><time dateTime={post.date}>{post.date}</time></div><p><Highlight text={snippet(post,query)} query={query}/></p></article>):<div className="empty-state">{posts.length?'没有找到匹配文章。试试更短的词，或换成模型名、作者名。':'暂无公开文章，稍后再来看看。'}</div>}</>:<p className="search-count">{posts.length?'输入一个你正在思考的问题或关键词。':'暂无公开文章，稍后再来看看。'}</p>}</section>;
}
