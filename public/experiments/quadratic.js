/** 确定性的教学实验；不使用随机数或外部数据。 */
export function runQuadratic({learningRate=0.15,steps=40,start=4}={}){
 if(!Number.isFinite(learningRate)||learningRate<=0||learningRate>3||!Number.isInteger(steps)||steps<1||steps>500||!Number.isFinite(start)||Math.abs(start)>20)throw new Error('学习率需在 0 到 3 之间，步数 1–500，初始值 -20 到 20。');
 let x=start;const points=[{step:0,x,loss:0.5*x*x}];
 for(let step=1;step<=steps;step++){x=x-learningRate*x;const loss=0.5*x*x;if(!Number.isFinite(loss)||loss>1e80)throw new Error('数值发散：请降低学习率后重试。');points.push({step,x,loss});}
 return {learningRate,steps,start,points,finalLoss:points[points.length-1].loss,finalX:x};
}
