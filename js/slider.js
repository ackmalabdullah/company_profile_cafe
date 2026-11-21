/* slider generik */
function slider(track,n,{prev,next,dots,auto}){let i=0,t;
 const go=k=>{i=(k+n)%n;track.style.transform=`translateX(-${i*100}%)`;if(dots)[...dots.children].forEach((x,j)=>x.classList.toggle('a',j===i))};
 if(dots)dots.innerHTML='<i></i>'.repeat(n);
 prev.onclick=()=>{go(i-1);rs()};next.onclick=()=>{go(i+1);rs()};
 const rs=()=>{clearInterval(t);if(auto)t=setInterval(()=>go(i+1),auto)};
 let x0=null;track.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
 track.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40){go(i+(dx<0?1:-1));rs()}x0=null});
 go(0);rs()}
slider($('#hs .track'),3,{prev:$('#pv'),next:$('#nx'),dots:$('#dt'),auto:6000});
