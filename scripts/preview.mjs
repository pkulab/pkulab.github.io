import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('out');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.md':'text/markdown; charset=utf-8','.woff2':'font/woff2','.woff':'font/woff','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server=http.createServer((request,response)=>{
  let url;try{url=decodeURIComponent(new URL(request.url,'http://localhost').pathname)}catch{response.writeHead(400).end();return}
  let file=path.resolve(root,'.'+url);
  if(file!==root&&!file.startsWith(root+path.sep)){response.writeHead(403).end();return}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  const exists=fs.existsSync(file)&&fs.statSync(file).isFile();
  if(!exists)file=path.join(root,'404.html');
  response.writeHead(exists?200:404,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});
  fs.createReadStream(file).pipe(response);
});
server.listen(5184,'127.0.0.1',()=>console.log('Preview http://127.0.0.1:5184'));
