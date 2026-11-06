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
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
};
const ic=k=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON[k]+'</svg>';
const initials=o=>esc((o.name||'?').trim().slice(0,1));

/* ---------- who are you ---------- */
function whoView(){
  return '<h2 class="who-h">ທ່ານແມ່ນໃຜ?</h2><p class="who-p">ເລືອກຊື່ຂອງທ່ານ ເພື່ອເລີ່ມໃຊ້ງານ · ເຄື່ອງນີ້ຈະຈື່ໄວ້</p><div class="whos">'+
    actives().map(o=>'<button class="who-btn" type="button" data-act="pick" data-id="'+esc(o.id)+'"><span class="avatar">'+initials(o)+'</span><span><b>'+esc(full(o))+'</b><span class="r-sub">ຕຳຫຼວດປະຈຳການ · '+esc(o.phone||'')+'</span></span></button>').join('')+
    '<button class="who-btn head" type="button" data-act="pick" data-id="__head"><span class="avatar">'+ic('user')+'</span><span><b>ຫົວໜ້າໜ່ວຍບໍລິການ</b><span class="r-sub">ອະນຸມັດ, ຕິດຕາມ ແລະ ສັງລວມການລາ (ຕ້ອງມີລະຫັດ)</span></span></button>'+
    '</div>';
}
function userBar(){
  const head=state.role==='head';
  const o=head?null:off(state.me);
  return '<div class="userbar"><div class="who"><span class="avatar">'+(head?ic('user'):initials(o))+'</span><span class="nm"><b>'+(head?'ຫົວໜ້າໜ່ວຍບໍລິການ':esc(full(o)))+'</b><small>'+(head?(ui.headAuthed?'ເຂົ້າລະບົບແລ້ວ':'ຍັງບໍ່ເຂົ້າລະບົບ'):'ຕຳຫຼວດປະຈຳການ')+'</small></span></div>'+
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
function board(){
  return '<section class="card"><div class="card-head"><h2>ມື້ນີ້ · ວັນ'+wd(today())+' '+fD(today())+'</h2><p class="muted">ສະຖານະຂອງເຈົ້າໜ້າທີ່ຢູ່ຈຸດປະຈຳການ</p></div><ul class="board">'+
    actives().map(o=>{const s=todayStatus(o);return '<li><span><b>'+esc(full(o))+'</b>'+(s[2]?'<span class="r-sub">'+esc(s[2])+'</span>':'')+'</span><span class="pill '+s[1]+'">'+esc(s[0])+'</span></li>';}).join('')+'</ul></section>';
}
const tile=(icon,title,sub,act,id,badge,cls)=>'<button class="tile'+(cls?' '+cls:'')+'" type="button" data-act="'+act+'"'+(id?' data-id="'+id+'"':'')+'><span class="ti">'+ic(icon)+'</span><b>'+title+'</b><small>'+sub+'</small>'+(badge?'<span class="badge">'+badge+'</span>':'')+'</button>';
const linkTile=(icon,title,sub,href)=>'<a class="tile" href="'+esc(href)+'" target="_top" rel="noopener"><span class="ti">'+ic(icon)+'</span><b>'+title+'</b><small>'+sub+'</small></a>';
function officerHome(){
  const now=new Date(),o=off(state.me);
  const mine=state.records.filter(r=>String(r.officerId)===String(state.me));
  const out=mine.filter(r=>r.status==='approved'&&now>=span(r)[0]);
  const ph=mine.filter(r=>r.status==='phone');
  const pend=mine.filter(r=>r.status==='pending').length;
  const p=state.settings.unitPhone;
  return '<div><p class="hello">ສະບາຍດີ, '+esc(full(o))+'</p><p class="muted" style="margin:0">ຕ້ອງການເຮັດຫຍັງມື້ນີ້?</p></div>'+
    out.map(r=>{const er=expRet(r),over=now>er;return '<div class="card alert go"><div><b>'+(over?'ເກີນກຳນົດກັບແລ້ວ':'ທ່ານກຳລັງລາຢູ່')+'</b> · <span class="no">'+esc(r.no)+'</span><p>'+r.type+' '+TYPES[r.type].label+' · ກຳນົດກັບ '+fDate(er)+'</p></div><div class="actions"><button class="btn primary" type="button" data-act="self-return" data-id="'+r.id+'">'+ic('back')+' ກັບຄືນແລ້ວ</button></div></div>';}).join('')+
    ph.map(r=>'<div class="card alert"><div><b>ທ່ານໄດ້ແຈ້ງລາທາງໂທ</b><p>'+dueText(r)+'</p></div><div class="actions"><button class="btn primary" type="button" data-act="write-retro" data-id="'+r.id+'">ຂຽນໃບລາຍ້ອນຫຼັງ</button></div></div>').join('')+
    '<div class="tiles">'+
      tile('pen','ຂຽນໃບລາ','ຂໍລາ ຫຼື ອອກຊົ່ວຄາວ','tab','new',0,'main')+
      tile('list','ໃບລາຂອງຂ້ອຍ',pend?pend+' ໃບ ລໍຖ້າອະນຸມັດ':'ເບິ່ງສະຖານະ ແລະ ສົ່ງອອກຮູບ','tab','mine',out.length+ph.length)+
      (p?linkTile('phone','ໂທແຈ້ງລາສຸກເສີນ',esc(p),'tel:'+p.replace(/\s/g,'')):tile('phone','ໂທແຈ້ງລາສຸກເສີນ','ຫົວໜ້າຍັງບໍ່ໄດ້ຕັ້ງເບີ','noop'))+
      linkTile('cal','ບັນທຶກປະຈຳການ','ລະບົບບັນທຶກປະຈຳການ ແລະ ອັດຕາກິນ',BASE_URL)+
    '</div>'+board();
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

/* ---------- routing ---------- */
function tabsFor(head){
  const recs=state.records,now=new Date();
  if(!head){
    const myN=recs.filter(r=>String(r.officerId)===String(state.me)&&(r.status==='phone'||(r.status==='approved'&&span(r)[0]<=now))).length;
    return [['home','ໜ້າຫຼັກ','home',0],['new','ຂຽນໃບລາ','pen',0],['mine','ໃບລາຂອງຂ້ອຍ','list',myN]];
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
  n.innerHTML='<div class="bnav-in">'+tabs.map(t=>'<button type="button" data-act="tab" data-id="'+t[0]+'"'+(t[0]===cur?' aria-current="page"':'')+'>'+ic(t[2])+'<span>'+t[1]+'</span>'+(t[3]?'<span class="badge">'+t[3]+'</span>':'')+'</button>').join('')+'</div>';
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
  noop:()=>toast('ຫົວໜ້າໜ່ວຍຍັງບໍ່ໄດ້ຕັ້ງເບີໂທແຈ້ງລາສຸກເສີນ'),
  reload:()=>{ui.loadErr='';render();refresh(true);},
  refresh:()=>refresh(false),
  who:()=>{prefs.chosen=false;save();render();window.scrollTo(0,0);},
  pick:id=>{
    if(id==='__head'){state.role='head';state.tab.head='home';}
    else{state.role='officer';state.me=id;state.tab.officer='home';draft=newDraft();}
    prefs.chosen=true;save();render();window.scrollTo(0,0);
  },
  tab:id=>{state.tab[state.role]=id;ui.confirmDel=null;save();render();window.scrollTo(0,0);},
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
  'staff-add':(id,b)=>{
    const rank=$('#st-rank').value.trim(),name=$('#st-name').value.trim(),phone=$('#st-phone').value.trim(),m=$('#st-msg');
    if(!name||!phone){m.textContent='ກະລຸນາໃສ່ຊື່ ແລະ ເບີໂທ.';m.className='form-msg bad';return;}
    api('staffAdd',{rank:rank,name:name,phone:phone},b).then(()=>{render();toast('ເພີ່ມ '+(rank?rank+' ':'')+name+' ແລ້ວ');}).catch(e=>fail(e,m));
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
