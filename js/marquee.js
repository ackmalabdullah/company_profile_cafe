/* marquee */
const mt=['Live akustik tiap Sabtu','Paket Nugas 35 ribu','Beli 5 gratis 1','WiFi gratis','Buka sampai malam'];
$('#mq').innerHTML=(mt.map(t=>`<span>${t}</span><span>✦</span>`).join('')).repeat(4);
