import {runQuadratic} from './quadratic.js';
self.onmessage=event=>{try{self.postMessage({ok:true,result:runQuadratic(event.data)})}catch(error){self.postMessage({ok:false,error:error instanceof Error?error.message:'实验运行失败。'})}};
