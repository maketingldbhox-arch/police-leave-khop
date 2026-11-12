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
  if(bad.length){msg.textContent='ຍັງສົ່ງບໍ່ໄດ້: ແກ້ໄຂ '+bad.length+' ຂໍ້ທີ່ໝາຍ ✕ ກ່ອນ.';msg.className='form-msg bad';$('#f-checks').scrollIntoView({block:'center'});return;}
  if(!draft.pledge){msg.textContent='ກະລຸນາໝາຍຢັ້ງຢືນຂໍ້ມູນກ່ອນສົ່ງ.';msg.className='form-msg bad';return;}
  const btn=$('#f-submit');
  api('submit',{rec:r,linkId:draft.linkId||null},btn).then(res=>{
    draft=newDraft();state.tab.officer='mine';save();render();window.scrollTo(0,0);
    const rec=get(res.id);
    openDetail(res.id,'ສົ່ງໃບລາ '+(rec?rec.no:'')+' ແລ້ວ · ສົ່ງອອກເປັນຮູບເພື່ອແຈ້ງໃນກຸ່ມ');
  }).catch(err=>fail(err,msg));
});

$('#today').textContent='ວັນ'+wd(today())+' '+fD(today());
render();
refresh(true);
/* keep data fresh: reload when the tab comes back, and every 2 minutes when idle on a non-form view */
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ui.loaded)refresh(true);});
setInterval(()=>{if(document.hidden||!ui.loaded||ui.busy)return;const cur=state.tab[state.role];if(cur==='approve'||cur==='staff'||!$('#modal').hidden)return;refresh(true);},120000);
