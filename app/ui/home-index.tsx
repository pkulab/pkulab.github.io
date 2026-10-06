'use client';
import {useEffect,useRef,useState} from 'react';
import {authorNames,type Post} from '@/lib/types';

function TopicGuide({posts}:{posts:Post[]}){
  const topics=[...new Set(posts.map(post=>post.category).filter(Boolean))];
  if(!topics.length)return null;
  return <div className="topic-guide"><h2>按话题阅读</h2>{topics.map(topic=><details className="topic-group" key={topic}><summary>{topic}<small>{posts.filter(post=>post.category===topic).length}</small></summary><ul>{posts.filter(post=>post.category===topic).map(post=><li key={post.id}><a href={'/posts/'+post.slug+'/'}>{post.title}</a></li>)}</ul></details>)}</div>;
}

export function HomeIndex({initialPosts}:{initialPosts:Post[]}){
  const [count,setCount]=useState(8);
  const end=useRef<HTMLDivElement>(null);
  const topicCount=new Set(initialPosts.map(post=>post.category).filter(Boolean)).size;
  useEffect(()=>{
    if(!end.current||count>=initialPosts.length)return;
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting))setCount(value=>Math.min(value+8,initialPosts.length));
    },{rootMargin:'160px'});
    observer.observe(end.current);
    return ()=>observer.disconnect();
  },[count,initialPosts.length]);
  return <>
    {topicCount>0&&<details className="mobile-topics"><summary>按话题阅读 · {topicCount} 个话题</summary><TopicGuide posts={initialPosts}/></details>}
    <div className={'index-layout'+(!topicCount?' index-without-topics':'')}>
      <section aria-label="文章列表">
        <div className="index-head"><h2 className="section-label">文章手记<span className="count">{initialPosts.length} 篇</span></h2></div>
        {initialPosts.length===0?<div className="empty-publication"><p>暂无公开文章。</p></div>:<div className="post-list">{initialPosts.slice(0,count).map(post=><article className="post-card" key={post.id}><div className="post-card-inner"><div><h2><a href={'/posts/'+post.slug+'/'}>{post.title}</a></h2><div className="post-meta"><span>{authorNames(post)}</span><time dateTime={post.date}>{post.date.replaceAll('-','.')}</time></div></div>{post.options?.thumbnail&&<img className="post-thumb" src={post.options.thumbnail} alt="" loading="lazy"/>}</div></article>)}</div>}
        <div ref={end} className="list-end">{count<initialPosts.length?<button className="button" onClick={()=>setCount(value=>Math.min(value+8,initialPosts.length))}>加载更多文章</button>:initialPosts.length>0?'已读到目录末尾':''}</div>
      </section>
      {topicCount>0&&<aside className="desktop-topics"><TopicGuide posts={initialPosts}/></aside>}
    </div>
  </>;
}
