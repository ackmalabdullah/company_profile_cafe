/* jam buka: [buka,tutup] per hari, 0=Minggu */
const H={0:[9,23],1:[8,22],2:[8,22],3:[8,22],4:[8,22],5:[8,23],6:[9,23]};
const HR=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const now=new Date(),d=now.getDay(),hh=now.getHours()+now.getMinutes()/60;
const open=hh>=H[d][0]&&hh<H[d][1];
const bd=$('#bd');bd.classList.toggle('on',open);
bd.querySelector('em').textContent=open?`Buka sekarang · tutup ${H[d][1]}.00`:`Tutup · buka ${H[d][0]}.00`;
$('#jm').innerHTML=[1,2,3,4,5,6,0].map(i=>`<tr class="${i===d?'today':''}"><td>${HR[i]}</td><td>${H[i][0]}.00 – ${H[i][1]}.00</td></tr>`).join('');
