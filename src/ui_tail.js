document.addEventListener('submit',e=>{
  if(e.target.id==='login'){
    e.preventDefault();
    const p=$('#lg-pass'),m=$('#lg-msg'),b=e.target.querySelector('button[type="submit"]');
    api('login',{pass:p.value},b).then(()=>{state.tab.head=state.tab.head||'home';render();toast('ເຂົ້າສູ່ລະບົບແລ້ວ');}).catch(err=>{m.textContent=err.message;m.className='form-msg bad';p.select();});
    return;
  }
  if(e.target.id!=='lf')return;
  e.preventDefault();
  const r=draftRec(),bad=checks(r).filter(c=>c.lv==='bad'),msg=$('#f-msg');
  if(bad.length){msg.textContent='ຍັງສົ່ງບໍ່ໄດ້: ແກ້ໄຂ '+bad.length+' ຂໍ້ທີ່ໝາຍ ✕ ກ່ອນ.';msg.className='form-msg bad';pop({kind:'warn',title:'ຍັງສົ່ງໃບລາບໍ່ໄດ້',msg:'ແກ້ໄຂ '+bad.length+' ຂໍ້ນີ້ກ່ອນ:',list:bad.map(c=>c.tx)}).then(()=>{const c=$('#f-checks');if(c)c.scrollIntoView({block:'center'});});return;}
  if(!draft.pledge){msg.textContent='ກະລຸນາໝາຍຢັ້ງຢືນຂໍ້ມູນກ່ອນສົ່ງ.';msg.className='form-msg bad';pop({kind:'warn',title:'ຍັງສົ່ງໃບລາບໍ່ໄດ້',msg:'ກະລຸນາໝາຍຢັ້ງຢືນຂໍ້ມູນກ່ອນສົ່ງ'});return;}
  const btn=$('#f-submit'),o=off(r.officerId);
  if(draft.editId){
    const eid=draft.editId,ed=get(eid);
    ask({title:'ບັນທຶກການແກ້ໄຂໃບລາ '+(ed?ed.no:'')+'?',rows:[['ປະເພດ',r.type+' '+TYPES[r.type].label],['ໄລຍະ',period(r)],['ເຫດຜົນ',r.reason]],msg:'ໃບລາຍັງລໍຖ້າຫົວໜ້າໜ່ວຍບໍລິການອະນຸມັດ',ok:'ບັນທຶກການແກ້ໄຂ'}).then(go=>{
      if(!go)return;
      api('edit',{id:eid,officerId:state.me,rec:r},btn).then(()=>{
        draft=newDraft();state.tab.officer='mine';save();render();window.scrollTo(0,0);
        const rec=get(eid);
        openDetail(eid,'ແກ້ໄຂໃບລາ '+(rec?rec.no:'')+' ແລ້ວ · ສົ່ງອອກເປັນຮູບເພື່ອແຈ້ງໃນກຸ່ມ');
        pop({kind:'ok',title:'ແກ້ໄຂໃບລາສຳເລັດ',rows:[['ເລກທີ',rec&&rec.no],['ປະເພດ',r.type+' '+TYPES[r.type].label],['ໄລຍະ',period(r)]],msg:'ລໍຖ້າຫົວໜ້າໜ່ວຍບໍລິການອະນຸມັດ'});
      }).catch(err=>fail(err,msg));
    });
    return;
  }
  ask({title:'ສົ່ງໃບລານີ້?',rows:[['ຜູ້ລາ',o?full(o):''],['ປະເພດ',r.type+' '+TYPES[r.type].label],['ໄລຍະ',period(r)],['ເຫດຜົນ',r.reason]],msg:'ໃບລາຈະສົ່ງໄປໃຫ້ຫົວໜ້າໜ່ວຍບໍລິການອະນຸມັດ',ok:'ສົ່ງໃບລາ'}).then(go=>{
    if(!go)return;
    api('submit',{rec:r,linkId:draft.linkId||null},btn).then(res=>{
      draft=newDraft();state.tab.officer='mine';save();render();window.scrollTo(0,0);
      const rec=get(res.id);
      openDetail(res.id,'ສົ່ງໃບລາ '+(rec?rec.no:'')+' ແລ້ວ · ສົ່ງອອກເປັນຮູບເພື່ອແຈ້ງໃນກຸ່ມ');
      pop({kind:'ok',title:'ສົ່ງໃບລາສຳເລັດ',rows:[['ເລກທີ',rec&&rec.no],['ປະເພດ',r.type+' '+TYPES[r.type].label],['ໄລຍະ',period(r)]],msg:'ລໍຖ້າຫົວໜ້າໜ່ວຍບໍລິການອະນຸມັດ'});
    }).catch(err=>fail(err,msg));
  });
});

$('#today').textContent='ວັນ'+wd(today())+' '+fD(today());
render();
refresh(true);
/* keep data fresh: reload when the tab comes back, and every 2 minutes when idle on a non-form view */
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ui.loaded)refresh(true);});
setInterval(()=>{if(document.hidden||!ui.loaded||ui.busy)return;const cur=state.tab[state.role];if(cur==='approve'||cur==='staff'||!$('#modal').hidden)return;refresh(true);},120000);
