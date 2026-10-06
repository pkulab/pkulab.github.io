// 只转换 Markdown AST，不解析或执行作者提供的 HTML/脚本。
type Node={type:string;value?:string;depth?:number;meta?:string;children?:Node[];data?:{hProperties?:Record<string,unknown>}};
export function remarkNotebook(options:{prefix?:string}={}){return (tree:Node)=>{let heading=0,figure=0;const visit=(node:Node)=>{
 const props=()=>{node.data??={};node.data.hProperties??={};return node.data.hProperties};
 if(node.type==='heading')props().id=(options.prefix||'section')+'-'+(++heading);
 if(node.type==='code'&&node.meta)props()['data-meta']=node.meta;
 if(node.type==='image')props()['data-figure']=++figure;
 if(node.type==='blockquote'){const first=node.children?.[0]?.children?.[0];const match=first?.value?.match(/^\[!(NOTE|IMPORTANT|TIP|WARNING|CAUTION)\]\s*/i);if(match&&first){props()['data-kind']=match[1].toLowerCase();first.value=first.value!.slice(match[0].length)}}
 node.children?.forEach(visit);
 };visit(tree)}}


