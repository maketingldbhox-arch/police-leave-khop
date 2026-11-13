/* ---------- ຂຽນໃບລາ: ເຄິ່ງວັນ / 1 ວັນ / ຫຼາຍວັນ ---------- */
const KINDS=[['half','ເຄິ່ງວັນ','½','ຕອນເຊົ້າ ຫຼື ຕອນແລງ'],['day','1 ວັນ','1','ໝົດມື້'],['multi','ຫຼາຍວັນ','2+','ເລືອກວັນທີເລີ່ມ ແລະ ສຸດທ້າຍ']];
const SESSIONS=[['ລ1','ຕອນເຊົ້າ','08:00 – 12:00'],['ລ2','ຕອນແລງ','13:00 – 17:00']];
const ATTACH=[['','ບໍ່ມີ / ບໍ່ລະບຸ'],['med','ໃບຢັ້ງຢືນແພດ'],['order','ຄຳສັ່ງ ປກສ'],['both','ໃບຢັ້ງຢືນແພດ ແລະ ຄຳສັ່ງ ປກສ']];
const kindOf=t=>t==='ລ1'||t==='ລ2'||t==='ອຊ'?'half':(t==='ລ3'?'day':'multi');
const attachVal=d=>d.attachMed&&d.attachOrder?'both':(d.attachMed?'med':(d.attachOrder?'order':''));
const opt=(v,label,cur)=>'<option value="'+esc(v)+'"'+(String(v)===String(cur)?' selected':'')+'>'+esc(label)+'</option>';
function handoverOpts(d){
  const others=actives().filter(x=>String(x.id)!==String(d.officerId));
  if(!others.length)return opt('','ບໍ່ມີເຈົ້າໜ້າທີ່ອື່ນ','');
  if(!others.find(x=>String(x.id)===String(d.handoverTo)))d.handoverTo=others[0].id;
  return others.map(x=>opt(x.id,full(x),d.handoverTo)).join('');
}
function officerNew(){
  const o=off(state.me),d=draft;
  const link=d.linkId?get(d.linkId):null,ed=d.editId?get(d.editId):null,lock=link||(ed&&ed.phoneLog);
  if(d.type==='ໜທ')d.type='ລ4';
  const k=kindOf(d.type);
  return '<form id="lf" class="card form" novalidate>'+
  '<div class="card-head"><h2>'+(d.editId?'ແກ້ໄຂໃບຂໍລາພັກ':'ຂຽນໃບຂໍລາພັກ')+'</h2><p class="muted">ຜູ້ຂໍລາ: <b>'+esc(full(o))+'</b> · ປກສ ເມືອງຄອບ</p></div>'+
  (d.editId?(canEdit(ed)?'<div class="note edit-note">ກຳລັງແກ້ໄຂໃບລາ <b class="no">'+esc(ed.no)+'</b> (ຍັງລໍຖ້າອະນຸມັດ) <button class="btn ghost sm" type="button" data-act="edit-cancel">ຍົກເລີກການແກ້ໄຂ</button></div>':'<div class="note edit-note bad">ໃບລາ '+esc(ed?ed.no:'')+' ຖືກພິຈາລະນາ ຫຼື ລົບແລ້ວ: ແກ້ໄຂບໍ່ໄດ້ <button class="btn ghost sm" type="button" data-act="edit-cancel">ຂຽນໃບລາໃໝ່</button></div>'):'')+
  (link?'<div class="note">ຍື່ນຍ້ອນຫຼັງ ສຳລັບການແຈ້ງທາງໂທ ວັນທີ '+fD(link.startDate)+' ເວລາ '+esc(link.callTime)+' · '+dueText(link)+'</div>':'')+
  '<fieldset class="field"><legend><span class="sec-n">1</span>ປະເພດການລາ</legend><div class="kinds">'+
    KINDS.map(x=>'<label class="type"><input type="radio" name="kind" value="'+x[0]+'"'+(k===x[0]?' checked':'')+'><span class="code">'+x[2]+'</span><span class="tl">'+x[1]+'</span><span class="tn">'+x[3]+'</span></label>').join('')+
  '</div></fieldset>'+
  (d.type==='ອຊ'?'<div class="note" data-show="time">ອອກຊົ່ວຄາວ (ຕາມການແຈ້ງທາງໂທ): ລະບຸເວລາອອກ ແລະ ເວລາກັບ</div>':'')+
  '<fieldset class="field" data-show="half"><legend>ຊ່ວງເວລາພັກ</legend><div class="kinds two">'+
    SESSIONS.map(x=>'<label class="type"><input type="radio" name="session" value="'+x[0]+'"'+(d.type===x[0]?' checked':'')+'><span class="code">'+(x[0]==='ລ1'?'ເຊົ້າ':'ແລງ')+'</span><span class="tl">'+x[1]+'</span><span class="tn">'+x[2]+'</span></label>').join('')+
  '</div></fieldset>'+
  '<div class="row">'+
    '<div class="field"><label for="f-start" id="l-start">ວັນທີ</label><input type="date" id="f-start" name="startDate" value="'+d.startDate+'"></div>'+
    '<div class="field" data-show="range"><label for="f-end">ວັນທີສຸດທ້າຍ</label><input type="date" id="f-end" name="endDate" value="'+d.endDate+'"></div>'+
    '<div class="field" data-show="time"><label for="f-tf">ເວລາອອກ</label><input type="time" id="f-tf" name="timeFrom" value="'+esc(d.timeFrom)+'"></div>'+
    '<div class="field" data-show="time"><label for="f-tt">ເວລາກັບ</label><input type="time" id="f-tt" name="timeTo" value="'+esc(d.timeTo)+'"></div>'+
  '</div>'+
  '<p class="period days" id="f-period"></p>'+
  '<div class="row">'+
    '<div class="field"><label for="f-reason"><span class="sec-n">2</span>ເຫດຜົນການລາ</label><select id="f-reason" name="reason">'+opt('','— ເລືອກເຫດຜົນ —',d.reason)+REASONS.map(x=>opt(x,x,d.reason)).join('')+'</select></div>'+
    '<div class="field" data-show="reasonOther"><label for="f-ro">ລະບຸເຫດຜົນ</label><input id="f-ro" name="reasonOther" value="'+esc(d.reasonOther)+'"></div>'+
    '<div class="field" data-show="order"><label for="f-order">ເລກທີຄຳສັ່ງ ປກສ</label><input id="f-order" name="orderNo" placeholder="ເຊັ່ນ 112/ປກສ.ຄອບ" value="'+esc(d.orderNo)+'"></div>'+
  '</div>'+
  '<div class="field"><label for="f-detail">ລາຍລະອຽດເຫດຜົນ</label><textarea id="f-detail" name="detail" rows="2">'+esc(d.detail)+'</textarea></div>'+
  '<div class="row">'+
    '<div class="field"><label for="f-dest">ສະຖານທີ່ທີ່ຈະໄປ</label><input id="f-dest" name="destination" value="'+esc(d.destination)+'"></div>'+
    '<div class="field"><label for="f-phone">ເບີໂທຕິດຕໍ່</label><input id="f-phone" name="phone" inputmode="tel" value="'+esc(d.phone)+'"></div>'+
  '</div>'+
  '<fieldset class="field" data-show="emerg"><legend>ຕິດຕໍ່ສຸກເສີນ (ກໍລະນີໂທຫາຜູ້ລາບໍ່ໄດ້)</legend><div class="row">'+
    '<div class="field"><label for="f-en" class="sub-label">ຊື່ ແລະ ຄວາມສຳພັນ</label><input id="f-en" name="emergencyName" placeholder="ເຊັ່ນ ພັນລະຍາ, ພໍ່, ແມ່" value="'+esc(d.emergencyName)+'"></div>'+
    '<div class="field"><label for="f-ep" class="sub-label">ເບີໂທສຸກເສີນ</label><input id="f-ep" name="emergencyPhone" inputmode="tel" value="'+esc(d.emergencyPhone)+'"></div>'+
  '</div></fieldset>'+
  '<div class="row">'+
    '<div class="field"><label for="f-att"><span class="sec-n">3</span>ເອກະສານຕິດຄັດ <span class="muted">(ບໍ່ລະບຸກໍໄດ້)</span></label><select id="f-att" name="attach">'+ATTACH.map(x=>opt(x[0],x[1],attachVal(d))).join('')+'</select></div>'+
    '<div class="field"><label for="f-filing">ການຍື່ນ</label><select id="f-filing" name="filing"'+(lock?' disabled':'')+'>'+opt('advance','ຍື່ນລ່ວງໜ້າ',d.filing)+opt('retro','ຍື່ນຍ້ອນຫຼັງ (ສຸກເສີນ)',d.filing)+'</select></div>'+
  '</div>'+
  '<div class="row" data-show="retro">'+
    '<div class="field"><label for="f-ct">ເວລາໂທແຈ້ງ</label><input type="time" id="f-ct" name="callTime" value="'+esc(d.callTime)+'"></div>'+
    '<div class="field"><label for="f-cto">ໂທແຈ້ງຫາ</label><input id="f-cto" name="callTo" value="'+esc(d.callTo)+'"></div>'+
  '</div>'+
  '<fieldset class="field"><legend><span class="sec-n">4</span>ການມອບໜ້າທີ່</legend><div class="row">'+
    '<div class="field"><label for="f-ho" class="sub-label">ຜູ້ຮັບມອບໜ້າທີ່ (ຢູ່ປະຈຳການ)</label><select id="f-ho" name="handoverTo">'+handoverOpts(d)+'</select></div>'+
    '<div class="field"><label for="f-rep" class="sub-label">ຜູ້ມາແທນຈາກ ປກສ (ຖ້າມີ)</label><input id="f-rep" name="pksReplacement" value="'+esc(d.pksReplacement)+'" placeholder="ຍົດ, ຊື່ ແລະ ນາມສະກຸນ"></div>'+
  '</div><p class="how" id="f-ho-note" hidden>ມີຜູ້ມາແທນຈາກ ປກສ ແລ້ວ: ລະບົບຈະບໍ່ບັນທຶກ "ຜູ້ຮັບມອບໜ້າທີ່ (ຢູ່ປະຈຳການ)"</p></fieldset>'+
  '<div class="field" data-show="pks"><label class="check" for="f-pksn"><input type="checkbox" id="f-pksn" name="pksNotified"'+(d.pksNotified?' checked':'')+'><span>ແຈ້ງ ປກສ ເມືອງຄອບແລ້ວ</span></label><input id="f-pkc" name="pksContact" placeholder="ຜູ້ຮັບແຈ້ງ ແລະ ເບີໂທ" value="'+esc(d.pksContact)+'"></div>'+
  '<div class="checks-box"><h3>ກວດຕາມລະບຽບ (ອັດຕະໂນມັດ)</h3><ul class="checks" id="f-checks"></ul></div>'+
  '<label class="check pledge" for="f-pledge"><input type="checkbox" id="f-pledge" name="pledge"'+(d.pledge?' checked':'')+'><span>ຂ້າພະເຈົ້າຂໍຢັ້ງຢືນວ່າ ຂໍ້ມູນຂ້າງເທິງເປັນຄວາມຈິງ ແລະ ຈະກັບມາປະຈຳການຕາມກຳນົດ. ຖ້າກັບຊ້າ ຫຼື ບໍ່ຍື່ນໃບລາຕາມລະບຽບ ຍິນດີໃຫ້ນັບເປັນ "ຂາດ".</span></label>'+
  '<div class="actions"><button type="submit" class="btn primary" id="f-submit">'+(d.editId?'ບັນທຶກການແກ້ໄຂ':'ສົ່ງໃບລາໃຫ້ຫົວໜ້າອະນຸມັດ')+'</button><p class="form-msg" id="f-msg" role="status"></p></div>'+
  '</form>';
}
/* checked in today and this leave takes away today's meal allowance: remind to check out */
function attWarn(r){
  const a=ui.att,it=a&&a.items?a.items.find(x=>String(x.id)===String(r.officerId)):null;
  if(!it||!it.present||!TYPES[r.type].deduct||r.startDate>today()||(r.endDate||r.startDate)<today())return null;
  return {lv:'warn',tx:'ທ່ານລົງເວລາເຂົ້າມື້ນີ້ແລ້ວ: ຖ້າລາມື້ນີ້ ໃຫ້ກົດ "ອອກເວລາ" ທີ່ໜ້າຫຼັກ ເພື່ອບໍ່ໃຫ້ນັບອັດຕາກິນມື້ນີ້'};
}
function dyn(){
  const f=$('#lf');if(!f)return;
  const t=TYPES[draft.type],k=kindOf(draft.type),pks=!!String(draft.pksReplacement||'').trim();
  const show={half:k==='half'&&draft.type!=='ອຊ',range:t.kind==='range',time:t.kind==='time',reasonOther:draft.reason==='ອື່ນໆ',order:draft.reason==='ວຽກ ປກສ',retro:draft.filing==='retro',pks:!!t.pks,emerg:draft.type!=='ອຊ'};
  f.querySelectorAll('[data-show]').forEach(el=>{el.hidden=!show[el.dataset.show];});
  $('#l-start').textContent=t.kind==='range'?'ວັນທີເລີ່ມຕົ້ນ':'ວັນທີ';
  const ho=$('#f-ho');ho.disabled=pks;$('#f-ho-note').hidden=!pks;
  const r=draftRec();
  $('#f-period').innerHTML=t.kind==='range'?'ລາພັກທັງໝົດ <b class="big">'+qty(r)+' ວັນ</b> · '+esc(period(r)):'<b>'+esc(period(r))+'</b> · '+qtyText(r);
  const cs=checks(r),w=attWarn(r);if(w)cs.splice(cs.length-1,0,w);
  $('#f-checks').innerHTML=checksHTML(cs);
}
/* keep the handover list in step with the officer list after a background reload */
function syncFormLists(){const s=$('#f-ho');if(!s||!draft)return;s.innerHTML=handoverOpts(draft);dyn();}
function onField(e){
  const el=e.target;
  if(el.id==='me-sel'){if(e.type!=='change')return;state.me=el.value;draft=newDraft();save();render();return;}
  if(el.id==='reg-month'){if(e.type!=='change')return;ui.month=el.value;render();return;}
  if(el.id==='pf-t'){const x=$('.pf-time');if(x)x.hidden=el.value!=='ອຊ';return;}
  if(el.id&&el.id.indexOf('cm-')===0){const u=pendUI[el.id.slice(3)]=pendUI[el.id.slice(3)]||{};u.comment=el.value;u.arm=null;return;}
  if(el.id&&el.id.indexOf('by-')===0){const u=pendUI[el.id.slice(3)]=pendUI[el.id.slice(3)]||{};u.by=el.value;return;}
  if(!el.closest||!el.closest('#lf')||!el.name)return;
  const n=el.name;
  if(n==='kind'||n==='session'){
    if(!el.checked)return;
    const v=n==='session'?el.value:{half:'ລ1',day:'ລ3',multi:'ລ4'}[el.value];
    if(n==='kind'&&el.value==='half'&&(draft.type==='ລ2'||draft.type==='ອຊ'))return dyn();
    draft.type=v;
    if(n==='kind'&&v==='ລ1'){const s=f=>document.querySelector('#lf input[name="session"][value="'+f+'"]');s('ລ1').checked=true;}
    if(v==='ລ4'&&draft.endDate<=draft.startDate){draft.endDate=addDays(draft.startDate,1);$('#f-end').value=draft.endDate;}
  }
  else if(n==='attach'){draft.attachMed=el.value==='med'||el.value==='both';draft.attachOrder=el.value==='order'||el.value==='both';}
  else if(el.type==='checkbox')draft[n]=el.checked;
  else if(el.type==='radio'){if(!el.checked)return;draft[n]=el.value;}
  else draft[n]=el.value;
  if(n==='startDate'&&TYPES[draft.type].kind==='range'&&draft.endDate<draft.startDate){draft.endDate=draft.startDate;$('#f-end').value=draft.endDate;}
  $('#f-msg').textContent='';
  dyn();
}
document.addEventListener('input',onField);
document.addEventListener('change',onField);
