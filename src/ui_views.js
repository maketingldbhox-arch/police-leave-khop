/* ---------- icons ---------- */
const ICON={
  home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  pen:'<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="m13.5 6.5 4 4"/>',
  list:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  check:'<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.7 2.7L16.5 9"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
  back:'<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  sheet:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'
};
const ic=k=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON[k]+'</svg>';
const initials=o=>esc(((o&&o.name)||'?').trim().slice(0,1));
/* officer photo (from the hidden LeavePhotos sheet) or the first letter of the name */
const photoOf=o=>(o&&state.photos&&state.photos[String(o.id)])||'';
const avatar=(o,cls)=>{const p=photoOf(o);return '<span class="avatar'+(p?' has-ph':'')+(cls?' '+cls:'')+'">'+(p?'<img src="'+esc(p)+'" alt="">':initials(o))+'</span>';};

/* ---------- who are you ---------- */
function whoView(){
  return '<h2 class="who-h">ທ່ານແມ່ນໃຜ?</h2><p class="who-p">ເລືອກຊື່ຂອງທ່ານ ເພື່ອເລີ່ມໃຊ້ງານ · ເຄື່ອງນີ້ຈະຈື່ໄວ້</p><div class="whos">'+
    actives().map(o=>'<button class="who-btn" type="button" data-act="pick" data-id="'+esc(o.id)+'">'+avatar(o)+'<span><b>'+esc(full(o))+'</b><span class="r-sub">ຕຳຫຼວດປະຈຳການ · '+esc(o.phone||'')+'</span></span></button>').join('')+
    '<button class="who-btn head" type="button" data-act="pick" data-id="__head"><span class="avatar">'+ic('user')+'</span><span><b>ຫົວໜ້າໜ່ວຍບໍລິການ</b><span class="r-sub">ອະນຸມັດ, ຕິດຕາມ ແລະ ສັງລວມການລາ (ຕ້ອງມີລະຫັດ)</span></span></button>'+
    '</div>';
}
function userBar(){
  const head=state.role==='head';
  const o=head?null:off(state.me);
  return '<div class="userbar"><div class="who">'+(head?'<span class="avatar">'+ic('user')+'</span>':avatar(o))+'<span class="nm"><b>'+(head?'ຫົວໜ້າໜ່ວຍບໍລິການ':esc(full(o)))+'</b><small>'+(head?(ui.headAuthed?'ເຂົ້າລະບົບແລ້ວ':'ຍັງບໍ່ເຂົ້າລະບົບ'):'ຕຳຫຼວດປະຈຳການ')+'</small></span></div>'+
    '<div class="actions">'+(head&&ui.headAuthed?'<button class="btn ghost sm" type="button" data-act="logout">ອອກຈາກລະບົບ</button>':'')+'<button class="btn ghost sm" type="button" data-act="who">ປ່ຽນຜູ້ໃຊ້</button></div></div>';
}

/* ---------- today board ---------- */
function todayStatus(o){
  const now=new Date(),T=today();
  const rs=state.records.filter(r=>String(r.officerId)===String(o.id)&&['approved','phone','returned'].indexOf(r.status)>=0);
  for(const r of rs){const s=span(r);if(r.status!=='returned'&&!r.returnedAt&&now>=s[0]&&now<=new Date(Math.max(s[1],expRet(r))))return ['ກຳລັງລາ · '+r.type+' '+TYPES[r.type].label,'warn','ກຳນົດກັບ '+fDate(expRet(r))];}
  for(const r of rs){const s=span(r);if(now>expRet(r)&&!r.returnedAt&&r.status==='approved')return ['ເກີນກຳນົດກັບ','bad',r.type+' '+TYPES[r.type].label];}
  for(const r of rs){if(r.status==='approved'&&iso(span(r)[0])===T&&now<span(r)[0])return ['ປະຈຳການ · ຈະລາ '+hm(span(r)[0]),'accent',r.type+' '+TYPES[r.type].label];}
  return ['ປະຈຳການ','good',''];
}
const p2=n=>(n<10?'0':'')+n;
const clockText=()=>{const d=new Date();return p2(d.getHours())+':'+p2(d.getMinutes())+':'+p2(d.getSeconds());};
const kip=n=>Math.round(Number(n)||0).toLocaleString('en-US');
function attPart(it,mine){
  if(!it)return '';
  const id=esc(it.id);
  if(it.present){
    const pill='<span class="pill good">'+ic('check')+' ລົງເວລາແລ້ວ'+(it.inAt?' '+esc(it.inAt):'')+'</span>';
    if(!mine)return pill;
    if(ui.confirmOut===String(it.id))return '<span class="att-ask">ອອກເວລາ ແລະ ບໍ່ຮັບອັດຕາກິນມື້ນີ້?</span><button class="btn danger sm" type="button" data-act="att-out-go" data-id="'+id+'">ຢືນຢັນອອກເວລາ</button><button class="btn ghost sm" type="button" data-act="att-out-no">ຍົກເລີກ</button>';
    return pill+'<button class="btn ghost sm att-out" type="button" data-act="att-out" data-id="'+id+'">'+ic('back')+' ອອກເວລາ</button>';
  }
  const outPill=it.outAt?'<span class="pill warn">ອອກເວລາແລ້ວ '+esc(it.outAt)+'</span>':'';
  if(mine)return outPill+'<button class="btn primary sm att-in" type="button" data-act="att-in" data-id="'+id+'">'+ic('clock')+' ລົງເວລາເຂົ້າ</button>';
  return outPill||'<span class="pill">ຍັງບໍ່ລົງເວລາ</span>';
}
function board(){
  const a=ui.att,ok=a&&!a.err&&a.items,off2=state.role==='officer';
  const by={};if(ok)a.items.forEach(it=>{by[String(it.id)]=it;});
  const me=off2?by[String(state.me)]:null;
  let note='';
  if(!a)note='<p class="muted att-note">ກຳລັງໂຫຼດຂໍ້ມູນບັນທຶກປະຈຳການ…</p>';
  else if(a.err)note='<p class="muted att-note">'+(a.err==='OLD'?'ລະບົບບັນທຶກປະຈຳການຍັງບໍ່ເຊື່ອມ: ຕ້ອງອັບເດດ Leave.gs ໃນ Apps Script':'ໂຫຼດບັນທຶກປະຈຳການບໍ່ໄດ້: '+esc(a.err))+'</p>';
  return '<section class="card att"><div class="att-top"><div class="card-head"><h2>ບັນທຶກປະຈຳການ · ມື້ນີ້</h2><p class="muted">ວັນ'+wd(today())+' '+fD(today())+'</p></div><div class="att-clock" id="att-clock" aria-label="ເວລາປັດຈຸບັນ">'+clockText()+'</div></div>'+
    note+
    (me&&me.name?'<p class="att-me">ເດືອນນີ້ທ່ານປະຈຳການ <b>'+me.month+' ມື້</b> · ອັດຕາກິນ <b>'+kip(me.money)+' ກີບ</b></p>':'')+
    '<ul class="board">'+
    actives().filter(o=>!off2||String(o.id)===String(state.me)).map(o=>{
      const s=todayStatus(o),it=by[String(o.id)],mine=off2&&String(o.id)===String(state.me);
      const sub=[s[2],(it&&it.name&&!off2?'ເດືອນນີ້ ປະຈຳການ '+it.month+' ມື້':'')].filter(Boolean).join(' · ');
      const leavePill=(!ok||s[1]!=='good')?'<span class="pill '+s[1]+'">'+esc(s[0])+'</span>':'';
      return '<li'+(mine?' class="me"':'')+'><span class="b-nm">'+avatar(o,'sm')+'<span><b>'+esc(full(o))+'</b>'+(sub?'<span class="r-sub">'+esc(sub)+'</span>':'')+'</span></span><span class="b-st">'+leavePill+(ok?attPart(it,mine):'')+'</span></li>';
    }).join('')+'</ul></section>';
}
const tile=(icon,title,sub,act,id,badge,cls)=>'<button class="tile'+(cls?' '+cls:'')+'" type="button" data-act="'+act+'"'+(id?' data-id="'+id+'"':'')+'><span class="ti">'+ic(icon)+'</span><b>'+title+'</b><small>'+sub+'</small>'+(badge?'<span class="badge">'+badge+'</span>':'')+'</button>';
const linkTile=(icon,title,sub,href)=>'<a class="tile" href="'+esc(href)+'" target="_top" rel="noopener"><span class="ti">'+ic(icon)+'</span><b>'+title+'</b><small>'+sub+'</small></a>';
function officerHome(){
  const now=new Date(),o=off(state.me);
  const mine=state.records.filter(r=>String(r.officerId)===String(state.me));
  const out=mine.filter(r=>r.status==='approved'&&now>=span(r)[0]);
  const ph=mine.filter(r=>r.status==='phone');
  const pend=mine.filter(r=>r.status==='pending').length;
  return '<div><p class="hello">ສະບາຍດີ, '+esc(full(o))+'</p><p class="muted" style="margin:0">ຕ້ອງການເຮັດຫຍັງມື້ນີ້?</p></div>'+
    out.map(r=>{const er=expRet(r),over=now>er;return '<div class="card alert go"><div><b>'+(over?'ເກີນກຳນົດກັບແລ້ວ':'ທ່ານກຳລັງລາຢູ່')+'</b> · <span class="no">'+esc(r.no)+'</span><p>'+r.type+' '+TYPES[r.type].label+' · ກຳນົດກັບ '+fDate(er)+'</p></div><div class="actions"><button class="btn primary" type="button" data-act="self-return" data-id="'+r.id+'">'+ic('back')+' ກັບຄືນແລ້ວ</button></div></div>';}).join('')+
    ph.map(r=>'<div class="card alert"><div><b>ທ່ານໄດ້ແຈ້ງລາທາງໂທ</b><p>'+dueText(r)+'</p></div><div class="actions"><button class="btn primary" type="button" data-act="write-retro" data-id="'+r.id+'">ຂຽນໃບລາຍ້ອນຫຼັງ</button></div></div>').join('')+
    decisionCards(unseen(),true)+
    board()+
    '<div class="tiles one">'+
      tile('list','ໃບລາຂອງຂ້ອຍ',pend?pend+' ໃບ ລໍຖ້າອະນຸມັດ':'ສະຫຼຸບຈຳນວນຄັ້ງທີ່ລາ · ເບິ່ງສະຖານະ ແລະ ສົ່ງອອກຮູບ','tab','mine',out.length+ph.length+unseen().length)+
    '</div>';
}
function headHome(){
  const now=new Date(),recs=state.records;
  const pend=recs.filter(r=>r.status==='pending').length;
  const trackN=recs.filter(r=>r.status==='phone').length+recs.filter(r=>r.status==='approved'&&span(r)[0]<=now).length+unacked().length;
  return '<div class="tiles">'+
    tile('check','ອະນຸມັດໃບລາ',pend?pend+' ໃບ ລໍຖ້າ':'ບໍ່ມີໃບລາລໍຖ້າ','tab','approve',pend,'main')+
    tile('clock','ຕິດຕາມ','ແຈ້ງທາງໂທ, ກັບຄືນ','tab','track',trackN)+
    tile('table','ທະບຽນ ແລະ ສັງລວມ','ສັງລວມອັດຕາກິນປະຈຳເດືອນ','tab','register')+
    linkTile('sheet','ເປີດ Google Sheet','ແຜ່ນ ບັນທຶກການລາ',SHEET_URL)+
  '</div>'+board()+
  '<div class="tiles" style="grid-template-columns:1fr">'+linkTile('cal','ບັນທຶກປະຈຳການ','ໄປທີ່ລະບົບບັນທຶກປະຈຳການ ແລະ ລາຍງານອັດຕາກິນ',BASE_URL)+'</div>';
}

/* ---------- ໃບລາຂອງຂ້ອຍ + ສະຫຼຸບ ---------- */
const USED=['approved','returned','phone'];
const r1=n=>Math.round(n*10)/10;
function mineSummary(mine){
  const R=ui.mineRange,T=today(),Y=T.slice(0,4),M=T.slice(0,7);
  const rs=mine.filter(r=>R==='all'||(R==='year'?r.startDate.slice(0,4)===Y:r.startDate.slice(0,7)===M));
  const used=rs.filter(r=>USED.indexOf(r.status)>=0);
  const n=st=>rs.filter(r=>r.status===st).length;
  const noMeal=rs.reduce((t,r)=>t+lvNoMealDays_(r),0);
  const seg=[['month','ເດືອນນີ້'],['year','ປີ '+Y],['all','ທັງໝົດ']].map(x=>'<button type="button" data-act="mine-range" data-id="'+x[0]+'" aria-pressed="'+(x[0]===R)+'">'+x[1]+'</button>').join('');
  const kpi=(v,l,c)=>'<div class="kpi'+(c?' '+c:'')+'"><b>'+v+'</b><span>'+l+'</span></div>';
  const rows=Object.keys(TYPES).map(k=>{
    const xs=used.filter(r=>r.type===k);if(!xs.length)return '';
    const t=TYPES[k],q=xs.reduce((s,r)=>s+lvQty_(r),0);
    const amt=t.kind==='time'?r1(q)+' ຊົ່ວໂມງ':(r1(q)+' ມື້');
    return '<li><span><b>'+k+'</b> '+t.label+'</span><span><b>'+xs.length+' ຄັ້ງ</b> · '+amt+'</span></li>';
  }).join('');
  return '<section class="card"><div class="card-head sum-head"><div><h2>ສະຫຼຸບການລາຂອງຂ້ອຍ</h2><p class="muted">ນັບຕາມວັນທີເລີ່ມລາ</p></div><div class="seg" role="group" aria-label="ຊ່ວງເວລາ">'+seg+'</div></div>'+
    '<div class="kpis">'+kpi(used.length,'ຄັ້ງທີ່ລາ','main')+kpi(n('pending'),'ລໍຖ້າອະນຸມັດ')+kpi(n('rejected'),'ບໍ່ອະນຸມັດ')+kpi(n('absent'),'ຂາດ',n('absent')?'bad':'')+'</div>'+
    (rows?'<ul class="bytype">'+rows+'</ul>':'<p class="empty">ບໍ່ມີການລາໃນຊ່ວງນີ້</p>')+
    '<p class="sum-foot">ມື້ທີ່ບໍ່ໄດ້ອັດຕາກິນ (ລາໝົດມື້ / ຫຼາຍມື້ / ຂາດ): <b>'+r1(noMeal)+' ມື້</b></p></section>';
}
function officerMine(){
  const now=new Date();
  const mine=state.records.filter(r=>String(r.officerId)===String(state.me)).sort((a,b)=>b.startDate.localeCompare(a.startDate));
  const ph=mine.filter(r=>r.status==='phone');
  const out=mine.filter(r=>r.status==='approved'&&now>=span(r)[0]);
  return out.map(r=>{const er=expRet(r),over=now>er;return '<div class="card alert go"><div><b>'+(over?'ເກີນກຳນົດກັບແລ້ວ':'ກຳລັງລາຢູ່')+'</b> · <span class="no">'+esc(r.no)+'</span><p>'+r.type+' '+TYPES[r.type].label+' · '+esc(period(r))+' · ກຳນົດກັບ '+fDate(er)+'</p><p class="muted">ເມື່ອກັບຮອດຫ້ອງການ ກົດ "ກັບຄືນ" ລະບົບຈະບັນທຶກເວລາ ແລະ ແຈ້ງຫົວໜ້າໜ່ວຍບໍລິການ</p></div><div class="actions"><button class="btn primary" type="button" data-act="self-return" data-id="'+r.id+'">ກັບຄືນ</button><button class="btn ghost" type="button" data-act="detail" data-id="'+r.id+'">ເປີດໃບລາ</button></div></div>';}).join('')+
  ph.map(r=>'<div class="card alert"><div><b>ທ່ານໄດ້ແຈ້ງລາທາງໂທລະສັບ</b><p>'+r.type+' '+TYPES[r.type].label+' · '+esc(period(r))+' · ໂທແຈ້ງ '+esc(r.callTo)+' ເວລາ '+esc(r.callTime)+'</p><p>'+dueText(r)+(r.returnedAt?' · ກັບມາແລ້ວ '+fDT(r.returnedAt):'')+'</p></div><div class="actions">'+(canSelfReturn(r)?'<button class="btn primary" type="button" data-act="self-return" data-id="'+r.id+'">ກັບຄືນ</button>':'')+'<button class="btn '+(canSelfReturn(r)?'ghost':'primary')+'" type="button" data-act="write-retro" data-id="'+r.id+'">ຂຽນໃບລາຍ້ອນຫຼັງ</button></div></div>').join('')+
  decisionCards(mine.filter(r=>ui.fresh&&ui.fresh.has(r.id)),false)+
  mineSummary(mine)+
  '<section class="card"><div class="card-head"><h2>ປະຫວັດໃບລາ</h2><p class="muted">'+mine.length+' ລາຍການ · ກົດເພື່ອເບິ່ງໃບລາ ຫຼື ສົ່ງອອກເປັນຮູບພາບ</p></div>'+
  (mine.length?'<ul class="list hist">'+mine.map(r=>{
    const fr=ui.fresh&&ui.fresh.has(r.id),pl=pill(r);
    return itemRow(r,false).replace('<li>','<li class="st-'+r.status+(fr?' fresh':'')+'">').replace(pl,pl+(fr?'<span class="pill new">'+ic('bell')+' ໃໝ່</span>':''));
  }).join('')+'</ul>':empty('ຍັງບໍ່ມີໃບລາ'))+'</section>';
}

/* ---------- ແຈ້ງເຕືອນຜົນການອະນຸມັດ (ຈື່ໄວ້ໃນເຄື່ອງນີ້ວ່າເບິ່ງແລ້ວ) ---------- */
const SEEN_KEY='ldb-khop-leave-seen-v1';
function seenMap(){try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'{}')||{};}catch(e){return {};}}
function seenSave(m){try{localStorage.setItem(SEEN_KEY,JSON.stringify(m));}catch(e){}}
const decKey=r=>r.id+'@'+((r.decision&&r.decision.at)||'');
const isDecided=r=>!!(r.decision&&['approved','rejected','absent'].indexOf(r.decision.result)>=0);
function unseen(){
  const me=String(state.me),m=seenMap(),mine=state.records.filter(r=>String(r.officerId)===me&&isDecided(r));
  if(!m['__init:'+me]){ // first run on this device: only decisions from the last 3 days count as new
    const cut=Date.now()-3*864e5;
    mine.forEach(r=>{const t=new Date(r.decision.at).getTime();if(!(t>=cut))m[decKey(r)]=1;});
    m['__init:'+me]=1;seenSave(m);
  }
  return mine.filter(r=>!m[decKey(r)]);
}
function takeFresh(){
  const u=unseen();if(!u.length)return;
  ui.fresh=ui.fresh||new Set();const m=seenMap();
  u.forEach(r=>{ui.fresh.add(r.id);m[decKey(r)]=1;});seenSave(m);
}
function decisionCards(list,home){
  if(!list.length)return '';
  return list.map(r=>{
    const res=r.decision.result,ok=res==='approved';
    const head=ok?'ໃບລາຂອງທ່ານໄດ້ຮັບການອະນຸມັດແລ້ວ':(res==='absent'?'ໃບລາຖືກນັບເປັນ "ຂາດ"':'ໃບລາຂອງທ່ານບໍ່ໄດ້ຮັບອະນຸມັດ');
    return '<div class="card alert decision '+(ok?'ok':'no')+'"><span class="dec-ic">'+ic(ok?'check':'bell')+'</span><div><b>'+head+'</b> · <span class="no">'+esc(r.no||'')+'</span>'+
      '<p>'+r.type+' '+TYPES[r.type].label+' · '+esc(period(r))+'</p>'+
      (r.decision.comment?'<p class="muted">ຄຳເຫັນ: '+esc(r.decision.comment)+'</p>':'')+'</div>'+
      (home?'<div class="actions"><button class="btn '+(ok?'primary':'ghost')+' sm" type="button" data-act="tab" data-id="mine">ເບິ່ງໃບລາ</button></div>':'')+'</div>';
  }).join('');
}

/* ---------- ຕັ້ງຄ່າ: ລາຍຊື່ເຈົ້າໜ້າທີ່ (ມີຮູບ) ---------- */
function photoPick(o){
  const p=photoOf(o);
  return '<label class="ph-pick" title="'+(p?'ປ່ຽນຮູບ':'ເພີ່ມຮູບ')+'">'+avatar(o,'lg')+'<span class="ph-cam">'+ic('cam')+'</span><input type="file" accept="image/*" data-photo="'+esc(o.id)+'" aria-label="'+(p?'ປ່ຽນຮູບ ':'ເພີ່ມຮູບ ')+esc(full(o))+'"></label>';
}
function headStaff(){
  const act=actives(),s=state.settings;
  return '<section class="card"><div class="card-head"><h2>ລາຍຊື່ເຈົ້າໜ້າທີ່ຕຳຫຼວດ</h2><p class="muted">'+act.length+' ທ່ານ · ກົດທີ່ຮູບເພື່ອເພີ່ມ ຫຼື ປ່ຽນຮູບ · ລົບອອກຈາກລາຍຊື່ແລ້ວ ປະຫວັດການລາຍັງເກັບໄວ້</p></div>'+
  '<ul class="list">'+act.map(o=>'<li class="staff"><div class="st-who">'+photoPick(o)+'<div><b>'+esc(full(o))+'</b><span class="r-sub">'+esc(o.phone||'—')+'</span>'+
    (photoOf(o)?'<button class="linkbtn" type="button" data-act="staff-photo-del" data-id="'+esc(o.id)+'">ລົບຮູບ</button>':'<span class="r-sub ph-hint">ຍັງບໍ່ມີຮູບ</span>')+'</div></div>'+
    (ui.confirmDel===o.id?'<div class="actions"><span class="form-msg bad">ລົບ '+esc(full(o))+' ອອກຈາກລາຍຊື່?</span><button class="btn danger sm" type="button" data-act="staff-del" data-id="'+o.id+'">ຢືນຢັນລົບ</button><button class="btn ghost sm" type="button" data-act="staff-del-cancel">ຍົກເລີກ</button></div>'
    :'<button class="btn ghost sm" type="button" data-act="staff-del-ask" data-id="'+o.id+'">ລົບອອກ</button>')+'</li>').join('')+'</ul>'+
  '<div class="subform" style="margin:14px 0 0"><b>ເພີ່ມເຈົ້າໜ້າທີ່ໃໝ່</b><div class="st-new">'+
    '<div class="ph-new"><label class="ph-pick" title="ເລືອກຮູບ"><span class="avatar lg'+(ui.newPhoto?' has-ph':'')+'" id="st-ph-prev">'+(ui.newPhoto?'<img src="'+esc(ui.newPhoto)+'" alt="">':ic('cam'))+'</span><input type="file" accept="image/*" data-photo="__new" aria-label="ເລືອກຮູບເຈົ້າໜ້າທີ່"></label>'+
      '<span class="ph-lbl">ຮູບ</span><button class="linkbtn" type="button" id="st-ph-clear" data-act="st-ph-clear"'+(ui.newPhoto?'':' hidden')+'>ລົບຮູບ</button></div>'+
    '<div class="row">'+
    '<div class="field"><label for="st-rank">ຍົດ</label><input id="st-rank" placeholder="ເຊັ່ນ ສທ, ພັຕ"></div>'+
    '<div class="field"><label for="st-name">ຊື່ ແລະ ນາມສະກຸນ</label><input id="st-name"></div>'+
    '<div class="field"><label for="st-phone">ເບີໂທ</label><input id="st-phone" inputmode="tel"></div></div></div>'+
    '<p class="form-msg" id="st-msg" role="status"></p><div class="actions"><button class="btn primary" type="button" data-act="staff-add">ເພີ່ມເຂົ້າລາຍຊື່</button></div></div></section>'+
  '<section class="card"><div class="card-head"><h2>ຕັ້ງຄ່າ</h2><p class="muted">ເບີໂທຂອງຫົວໜ້າໜ່ວຍບໍລິການ (ເກັບໄວ້ໃນລະບົບ · ບໍ່ສະແດງໃນໜ້າຕຳຫຼວດ)</p></div><div class="row">'+
    '<div class="field"><label for="set-phone">ເບີໂທແຈ້ງລາສຸກເສີນ (ຫົວໜ້າໜ່ວຍ)</label><input id="set-phone" inputmode="tel" value="'+esc(s.unitPhone)+'" placeholder="020 …"></div>'+
    '<div class="field"><label for="set-pass">ລະຫັດ admin ໃໝ່ (ປ່ອຍຫວ່າງ = ບໍ່ປ່ຽນ)</label><input id="set-pass" type="password" autocomplete="new-password" placeholder="ຢ່າງໜ້ອຍ 4 ຕົວ"></div></div>'+
    '<p class="form-msg" id="set-msg" role="status"></p><div class="actions"><button class="btn primary" type="button" data-act="settings-save">ບັນທຶກການຕັ້ງຄ່າ</button></div></section>';
}
/* resize + square-crop a chosen picture in the browser: ~200x200 JPEG, small enough for one sheet cell */
function shrinkPhoto(file){
  return new Promise((res,rej)=>{
    if(!file||(file.type&&!/^image\//.test(file.type))){rej(new Error('ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ'));return;}
    const url=URL.createObjectURL(file),img=new Image();
    img.onload=()=>{
      const S=200,c=document.createElement('canvas'),g=c.getContext('2d');c.width=c.height=S;
      const w=img.naturalWidth,h=img.naturalHeight,k=Math.min(w,h);
      g.fillStyle='#fff';g.fillRect(0,0,S,S);
      g.drawImage(img,(w-k)/2,(h-k)/2*0.6,k,k,0,0,S,S); /* tall photos: keep a bit more of the top (face) */
      URL.revokeObjectURL(url);
      let q=0.85,d=c.toDataURL('image/jpeg',q);
      while(d.length>40000&&q>0.35){q-=0.1;d=c.toDataURL('image/jpeg',q);}
      res(d);
    };
    img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('ອ່ານຮູບນີ້ບໍ່ໄດ້: ລອງເລືອກຮູບ JPG ຫຼື PNG'));};
    img.src=url;
  });
}
/* re-render without losing what was typed in the add-officer form */
function renderKeepStaff(){
  const keep=['st-rank','st-name','st-phone','set-phone'].map(i=>[i,($('#'+i)||{}).value]);
  render();
  keep.forEach(x=>{const el=$('#'+x[0]);if(el&&x[1]!=null)el.value=x[1];});
}
document.addEventListener('change',e=>{
  const el=e.target;
  if(!el.matches||!el.matches('input[type="file"][data-photo]'))return;
  const id=el.dataset.photo,f=el.files&&el.files[0];
  if(!f)return;
  shrinkPhoto(f).then(p=>{
    el.value='';
    if(id==='__new'){
      ui.newPhoto=p;
      const v=$('#st-ph-prev');if(v){v.innerHTML='<img src="'+p+'" alt="">';v.classList.add('has-ph');}
      const c=$('#st-ph-clear');if(c)c.hidden=false;
      return;
    }
    const o=off(id);
    return api('staffPhoto',{id:id,photo:p}).then(()=>{renderKeepStaff();toast('ບັນທຶກຮູບ '+full(o)+' ແລ້ວ');});
  }).catch(err=>{el.value='';fail(err);});
});

/* ---------- routing ---------- */
function tabsFor(head){
  const recs=state.records,now=new Date();
  if(!head){
    const myN=recs.filter(r=>String(r.officerId)===String(state.me)&&(r.status==='phone'||(r.status==='approved'&&span(r)[0]<=now))).length;
    const nu=unseen().length;
    return [['home','ໜ້າຫຼັກ','home',0],['new','ຂຽນໃບລາ','pen',0],['mine','ໃບລາຂອງຂ້ອຍ','list',myN+nu,nu>0]];
  }
  const pend=recs.filter(r=>r.status==='pending').length;
  const trackN=recs.filter(r=>r.status==='phone').length+recs.filter(r=>r.status==='approved'&&span(r)[0]<=now).length+unacked().length;
  return [['home','ໜ້າຫຼັກ','home',0],['approve','ອະນຸມັດ','check',pend],['track','ຕິດຕາມ','clock',trackN],['register','ທະບຽນ','table',0],['staff','ຕັ້ງຄ່າ','gear',0]];
}
function view(k){
  if(state.role==='officer'){if(k==='mine')return officerMine();if(k==='new')return officerNew();return officerHome();}
  if(!ui.headAuthed)return loginView();
  if(k==='approve')return headApprove();
  if(k==='track')return headTrack();
  if(k==='register')return headRegister();
  if(k==='staff')return headStaff();
  return headHome();
}
function renderNav(tabs,cur){
  const n=$('#bnav');
  if(!tabs){n.hidden=true;return;}
  n.hidden=false;
  n.innerHTML='<div class="bnav-in">'+tabs.map(t=>'<button type="button" data-act="tab" data-id="'+t[0]+'"'+(t[0]===cur?' aria-current="page"':'')+'>'+ic(t[2])+'<span>'+t[1]+'</span>'+(t[3]?'<span class="badge'+(t[4]?' alert':'')+'">'+t[3]+'</span>':'')+'</button>').join('')+'</div>';
}
function render(){
  const app=$('#app');
  $('#demo').hidden=IS_GAS;
  if(!ui.loaded){
    app.innerHTML=ui.loadErr?'<section class="card err-card"><div class="card-head"><h2>ໂຫຼດຂໍ້ມູນບໍ່ສຳເລັດ</h2><p class="muted">'+esc(ui.loadErr)+'</p></div><button class="btn primary" type="button" data-act="reload">ລອງໃໝ່</button></section>':'<div class="skel"><div></div><div></div><div></div></div>';
    renderNav(null);return;
  }
  ensureMe();
  if(!prefs.chosen){app.innerHTML=whoView();renderNav(null);return;}
  if(!draft||String(draft.officerId)!==String(state.me))draft=newDraft();
  const head=state.role==='head';
  if(!head&&state.tab.officer==='mine')takeFresh();
  const tabs=tabsFor(head);
  let cur=state.tab[state.role];
  if(!tabs.find(t=>t[0]===cur))cur=state.tab[state.role]='home';
  app.innerHTML=userBar()+'<div class="view">'+view(cur)+'</div>';
  renderNav(head&&!ui.headAuthed?null:tabs,cur);
  if(!head&&cur==='new')dyn();
  if(head&&!ui.headAuthed){const p=$('#lg-pass');if(p)p.focus();}
}

/* ---------- actions ---------- */
const H={
  'att-in':(id,b)=>{
    if(String(id)!==String(state.me))return;
    api('attCheckin',{id:id},b).then(res=>{ui.att=res.att||ui.att;render();toast(res.already?'ທ່ານລົງເວລາມື້ນີ້ໄວ້ແລ້ວ':'ລົງເວລາເຂົ້າປະຈຳການແລ້ວ · '+clockText().slice(0,5));}).catch(e=>fail(e));
  },
  'att-out':id=>{ui.confirmOut=String(id);render();},
  'att-out-no':()=>{ui.confirmOut=null;render();},
  'att-out-go':(id,b)=>{
    if(String(id)!==String(state.me))return;
    api('attCheckout',{id:id},b).then(res=>{ui.confirmOut=null;ui.att=res.att||ui.att;render();toast(res.already?'ທ່ານຍັງບໍ່ໄດ້ລົງເວລາມື້ນີ້':'ອອກເວລາແລ້ວ · '+clockText().slice(0,5)+' · ມື້ນີ້ບໍ່ນັບອັດຕາກິນ');}).catch(e=>{ui.confirmOut=null;render();fail(e);});
  },
  'mine-range':id=>{ui.mineRange=id;render();},
  reload:()=>{ui.loadErr='';render();refresh(true);},
  refresh:()=>refresh(false),
  who:()=>{prefs.chosen=false;save();render();window.scrollTo(0,0);},
  pick:id=>{
    if(id==='__head'){state.role='head';state.tab.head='home';}
    else{state.role='officer';state.me=id;state.tab.officer='home';ui.fresh=null;draft=newDraft();}
    prefs.chosen=true;save();render();window.scrollTo(0,0);
  },
  tab:id=>{if(id!=='mine')ui.fresh=null;state.tab[state.role]=id;ui.confirmDel=null;ui.confirmOut=null;save();render();window.scrollTo(0,0);if(state.role==='officer'&&id==='new'&&ui.loaded)refresh(true);},
  logout:()=>{api('logout').catch(()=>{}).then(()=>{setToken('');render();toast('ອອກຈາກລະບົບແລ້ວ');});},
  detail:id=>openDetail(id),
  close:()=>closeModal(),
  xclose:()=>{$('#xmodal').hidden=true;},
  'write-retro':id=>{const r=get(id);draft=Object.assign(newDraft(),{type:r.type,startDate:r.startDate,endDate:r.endDate||r.startDate,timeFrom:r.timeFrom||'09:00',timeTo:r.timeTo||'10:00',detail:r.detail||'',filing:'retro',callTime:r.callTime,callTo:r.callTo,linkId:r.id});state.tab.officer='new';render();window.scrollTo(0,0);},
  'export-leave':(id,b)=>{const r=get(id);exportImage(paperHTML(r,false),leaveFile(r),720,b);},
  'export-reg':(id,b)=>{exportImage(regExportHTML(ui.month),'ທະບຽນການລາ-'+ui.month+'.png',1180,b);},
  'x-save':()=>{
    if(!X)return;
    const a=document.createElement('a');a.href=URL.createObjectURL(X.blob);a.download=X.filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);
  },
  'x-copy':()=>{
    if(!X)return;
    try{
      if(!navigator.clipboard||!window.ClipboardItem)throw new Error('no');
      navigator.clipboard.write([new ClipboardItem({'image/png':X.blob})]).then(()=>toast('ສຳເນົາຮູບແລ້ວ · ວາງ (Paste) ໃນກຸ່ມແຊັດໄດ້ເລີຍ'),()=>toast('ສຳເນົາບໍ່ໄດ້ໃນເຄື່ອງນີ້: ກົດຄ້າງທີ່ຮູບແທນ'));
    }catch(e){toast('ສຳເນົາບໍ່ໄດ້ໃນເຄື່ອງນີ້: ກົດຄ້າງທີ່ຮູບແທນ');}
  },
  'self-return':(id,b)=>{
    api('selfReturn',{id:id},b).then(()=>{const r=get(id);render();openDetail(id,'ກັບຄືນ '+fDT(r.returnedAt)+(r.late>0.01?' (ຊ້າ '+fmtH(r.late)+')':'')+' · ແຈ້ງຫົວໜ້າໜ່ວຍບໍລິການແລ້ວ');}).catch(e=>fail(e));
  },
  approve:(id,b)=>{
    const r=get(id),ta=$('#cm-'+id),m=$('#am-'+id),u=pendUI[id]=pendUI[id]||{};
    u.comment=ta.value;u.by=$('#by-'+id).value;
    const v=ta.value.trim();
    if(v.indexOf('ບໍ່ອະນຸມັດ')===0){m.textContent='ຄຳເຫັນຂຽນວ່າ "ບໍ່ອະນຸມັດ": ແກ້ຄຳເຫັນ ຫຼື ກົດປຸ່ມ ບໍ່ອະນຸມັດ.';m.className='form-msg bad';return;}
    const nb=checks(r).filter(c=>c.lv==='bad').length;
    if(nb&&u.arm!=='approve'){u.arm='approve';m.textContent='ໃບລານີ້ມີ '+nb+' ຂໍ້ບໍ່ຖືກລະບຽບ (✕). ກົດ ອະນຸມັດ ອີກຄັ້ງເພື່ອຢືນຢັນ.';m.className='form-msg bad';return;}
    api('approve',{id:id,by:u.by.trim()||HEAD,comment:v||approveText(r)},b).then(()=>{delete pendUI[id];render();openDetail(id,'ອະນຸມັດແລ້ວ · ສົ່ງອອກເປັນຮູບເພື່ອແຈ້ງໃນກຸ່ມ');}).catch(e=>fail(e,m));
  },
  reject:(id,b)=>{
    const ta=$('#cm-'+id),m=$('#am-'+id),u=pendUI[id]=pendUI[id]||{};
    const prefix='ບໍ່ອະນຸມັດ ເນື່ອງຈາກ ';
    const v=ta.value.trim();
    if(v.indexOf('ບໍ່ອະນຸມັດ')!==0){ta.value=prefix;u.comment=prefix;ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);m.textContent='ຂຽນເຫດຜົນທີ່ບໍ່ອະນຸມັດ ແລ້ວກົດ ບໍ່ອະນຸມັດ ອີກຄັ້ງ.';m.className='form-msg warn';return;}
    if(v.length<prefix.trim().length+4){ta.focus();m.textContent='ກະລຸນາຂຽນເຫດຜົນໃຫ້ຊັດເຈນ.';m.className='form-msg bad';return;}
    api('reject',{id:id,by:$('#by-'+id).value.trim()||HEAD,comment:v},b).then(()=>{delete pendUI[id];render();openDetail(id,'ບໍ່ອະນຸມັດແລ້ວ · ສົ່ງອອກເປັນຮູບເພື່ອແຈ້ງໃນກຸ່ມ');}).catch(e=>fail(e,m));
  },
  ack:(id,b)=>{api('ack',{id:id},b).then(()=>{render();toast('ຮັບຊາບການກັບຄືນແລ້ວ');}).catch(e=>fail(e));},
  'phone-open':()=>{ui.phoneOpen=!ui.phoneOpen;render();},
  'phone-cancel':()=>{ui.phoneOpen=false;render();},
  'phone-save':(id,b)=>{
    const type=$('#pf-t').value,d=$('#pf-d').value,m=$('#pf-msg');
    const tf=$('#pf-tf').value,tt=$('#pf-tt').value,ct=$('#pf-ct').value,by=$('#pf-by').value.trim();
    if(!d||!ct||!by){m.textContent='ກະລຸນາໃສ່ວັນທີ, ເວລາໂທ ແລະ ຜູ້ຮັບແຈ້ງ.';m.className='form-msg bad';return;}
    if(type==='ອຊ'&&(!tf||!tt||tt<=tf)){m.textContent='ອອກຊົ່ວຄາວ: ໃສ່ເວລາອອກ ແລະ ເວລາກັບໃຫ້ຖືກຕ້ອງ.';m.className='form-msg bad';return;}
    const oid=$('#pf-o').value,o=off(oid),h=actives().find(x=>String(x.id)!==String(oid));
    const r={officerId:oid,type:type,startDate:d,endDate:d,timeFrom:type==='ອຊ'?tf:'',timeTo:type==='ອຊ'?tt:'',detail:$('#pf-note').value.trim(),phone:o.phone,filing:'retro',callTime:ct,callTo:by,handoverTo:h?h.id:''};
    const clash=checks(Object.assign({id:'__p',reason:'',destination:'',emergencyName:'',emergencyPhone:'',pksReplacement:''},r)).find(c=>c.lv==='bad'&&c.tx.indexOf('ຫ້າມລາພ້ອມກັນ')===0);
    api('phoneSave',{rec:r},b).then(()=>{ui.phoneOpen=false;render();toast(clash?'ບັນທຶກແລ້ວ · ລະວັງ: ບໍ່ມີຄົນຢູ່ປະຈຳການ ໃຫ້ຂໍຄົນແທນຈາກ ປກສ':'ບັນທຶກການແຈ້ງທາງໂທແລ້ວ · ລໍຖ້າໃບລາຍ້ອນຫຼັງ');}).catch(e=>fail(e,m));
  },
  'ret-save':(id,b)=>{
    const v=$('#ret-'+id).value;
    if(!v){toast('ກະລຸນາໃສ່ເວລາກັບ');return;}
    api('retSave',{id:id,at:v.slice(0,16)},b).then(()=>{const r=get(id);render();toast(r.late>0.01?'ບັນທຶກກັບຄືນແລ້ວ · ຊ້າ '+fmtH(r.late):'ບັນທຶກກັບຄືນແລ້ວ · ກັບຕາມກຳນົດ');}).catch(e=>fail(e));
  },
  absent:(id,b)=>{api('absent',{id:id},b).then(()=>{render();toast('ໝາຍເປັນ "ຂາດ" ແລ້ວ');}).catch(e=>fail(e));},
  'staff-del-ask':id=>{ui.confirmDel=id;render();},
  'staff-del-cancel':()=>{ui.confirmDel=null;render();},
  'staff-del':(id,b)=>{
    const o=off(id);
    api('staffDel',{id:id},b).then(()=>{ui.confirmDel=null;ensureMe();if(String(draft.officerId)===String(id)||String(draft.handoverTo)===String(id))draft=newDraft();render();toast('ລົບ '+full(o)+' ອອກຈາກລາຍຊື່ແລ້ວ');}).catch(e=>{ui.confirmDel=null;render();fail(e);});
  },
  'staff-photo-del':(id,b)=>{
    const o=off(id);
    api('staffPhoto',{id:id,photo:''},b).then(()=>{renderKeepStaff();toast('ລົບຮູບ '+full(o)+' ແລ້ວ');}).catch(e=>fail(e));
  },
  'st-ph-clear':()=>{
    ui.newPhoto='';
    const v=$('#st-ph-prev');if(v){v.innerHTML=ic('cam');v.classList.remove('has-ph');}
    const c=$('#st-ph-clear');if(c)c.hidden=true;
  },
  'staff-add':(id,b)=>{
    const rank=$('#st-rank').value.trim(),name=$('#st-name').value.trim(),phone=$('#st-phone').value.trim(),m=$('#st-msg');
    if(!name||!phone){m.textContent='ກະລຸນາໃສ່ຊື່ ແລະ ເບີໂທ.';m.className='form-msg bad';return;}
    api('staffAdd',{rank:rank,name:name,phone:phone,photo:ui.newPhoto||''},b).then(()=>{ui.newPhoto='';render();toast('ເພີ່ມ '+(rank?rank+' ':'')+name+' ແລ້ວ');}).catch(e=>fail(e,m));
  },
  'settings-save':(id,b)=>{
    const p=$('#set-phone').value.trim(),pw=$('#set-pass').value,m=$('#set-msg');
    if(pw&&pw.length<4){m.textContent='ລະຫັດຕ້ອງມີຢ່າງໜ້ອຍ 4 ຕົວ.';m.className='form-msg bad';return;}
    api('settingsSave',{unitPhone:p,pass:pw||''},b).then(()=>{render();toast(pw?'ບັນທຶກແລ້ວ · ປ່ຽນລະຫັດ admin ແລ້ວ':'ບັນທຶກການຕັ້ງຄ່າແລ້ວ');}).catch(e=>fail(e,m));
  }
};
document.addEventListener('click',e=>{
  if(e.target.id==='modal'){closeModal();return;}
  if(e.target.id==='xmodal'){$('#xmodal').hidden=true;return;}
  const b=e.target.closest('[data-act]');if(!b)return;
  const f=H[b.dataset.act];if(f)f(b.dataset.id,b);
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(!$('#xmodal').hidden){$('#xmodal').hidden=true;return;}if(!$('#modal').hidden)closeModal();}
  if(e.key==='Enter'&&e.target.matches&&e.target.matches('tr.click'))openDetail(e.target.dataset.id);
});

/* live clock on the today card */
setInterval(()=>{const c=document.getElementById('att-clock');if(c)c.textContent=clockText();},1000);
