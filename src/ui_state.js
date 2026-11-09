/* ---------- demo data (used only when the page is opened outside Google Apps Script) ---------- */
function seedDemo(){
  const T=today(),now=new Date();
  const officers=[
    {id:'o1',rank:'ສທ',name:'ຈັນທະການ ຄຳວິພາ',phone:'020 9970 8556',active:true},
    {id:'o2',rank:'ພັຕ',name:'ແກ້ວ ວົງສາ',phone:'020 9538 7448',active:true}
  ];
  const store={officers:officers,settings:{unitPhone:'020 5555 0000'},seq:{},records:[]};
  const base={reasonOther:'',orderNo:'',detail:'',attachMed:false,attachOrder:false,filing:'advance',callTime:'',callTo:'',pksReplacement:'',pksNotified:false,pksContact:'',decision:null,returnedAt:'',returnBy:'',late:0,timeFrom:'',timeTo:'',no:''};
  const E={o1:{emergencyName:'ພັນລະຍາ (ຕົວຢ່າງ)',emergencyPhone:'020 1111 2222'},o2:{emergencyName:'ພໍ່ (ຕົວຢ່າງ)',emergencyPhone:'020 3333 4444'}};
  const S=(o,x)=>Object.assign({id:lvUid_()+Math.random().toString(36).slice(2,5),officerId:o,handoverTo:o==='o1'?'o2':'o1'},base,E[o],x,{endDate:x.endDate||x.startDate,phone:o==='o1'?officers[0].phone:officers[1].phone});
  const f=new Date(now.getTime()-30*6e4),t2=new Date(now.getTime()+60*6e4);
  const fromHM=iso(f)===T?hm(f):'00:05',toHM=iso(t2)===T?hm(t2):'23:59';
  const recs=[
    S('o1',{type:'ລ3',startDate:addDays(T,-20),reason:'ງານບຸນ/ງານດອງ/ງານສົບ',detail:'ງານບຸນຂຶ້ນເຮືອນໃໝ່ ຂອງຍາດພີ່ນ້ອງ',destination:'ບ້ານເກີດ, ເມືອງຄອບ',submittedAt:addDays(T,-23)+'T10:05',status:'returned',decidedAt:addDays(T,-23)+'T14:30',returnedAt:addDays(T,-19)+'T08:20',returnBy:'self'}),
    S('o2',{type:'ອຊ',startDate:addDays(T,-12),timeFrom:'09:30',timeTo:'10:40',reason:'ທຸລະກິດສ່ວນຕົວ/ຄອບຄົວ',detail:'ໄປຈ່າຍຄ່າໄຟຟ້າ',destination:'ຫ້ອງການໄຟຟ້າ ເມືອງຄອບ',submittedAt:addDays(T,-12)+'T09:15',status:'returned',decidedAt:addDays(T,-12)+'T09:20',returnedAt:addDays(T,-12)+'T10:35',returnBy:'self'}),
    S('o2',{type:'ລ1',startDate:addDays(T,-6),reason:'ທຸລະກິດສ່ວນຕົວ/ຄອບຄົວ',detail:'ສ້ອມແປງລົດຈັກ',destination:'ຮ້ານສ້ອມລົດ ໃນເມືອງ',submittedAt:addDays(T,-6)+'T07:40',status:'rejected',decidedAt:addDays(T,-6)+'T07:55',comment:'ບໍ່ອະນຸມັດ ເນື່ອງຈາກຍື່ນມື້ດຽວກັນ ບໍ່ທັນກຳນົດລ່ວງໜ້າ 1 ມື້.'}),
    S('o1',{type:'ອຊ',startDate:T,timeFrom:fromHM,timeTo:toHM,reason:'ທຸລະກິດສ່ວນຕົວ/ຄອບຄົວ',detail:'ໄປຖອນເງິນເດືອນ',destination:'ຕະຫຼາດເມືອງຄອບ',submittedAt:T+'T'+fromHM,status:'approved',decidedAt:T+'T'+fromHM}),
    S('o2',{type:'ລ1',startDate:addDays(T,1),reason:'ທຸລະກິດສ່ວນຕົວ/ຄອບຄົວ',detail:'ພາລູກໄປລົງທະບຽນໂຮງຮຽນ',destination:'ໂຮງຮຽນປະຖົມ ໃນເມືອງ',submittedAt:addDays(T,-1)+'T11:00',status:'approved',decidedAt:addDays(T,-1)+'T13:45'}),
    S('o1',{type:'ລ3',startDate:addDays(T,3),reason:'ງານບຸນ/ງານດອງ/ງານສົບ',detail:'ງານດອງນ້ອງສາວ',destination:'ເມືອງໄຊຍະບູລີ',submittedAt:T+'T08:15',status:'pending'}),
    S('o2',{type:'ໜທ',startDate:addDays(T,5),endDate:addDays(T,6),reason:'ວຽກ ປກສ',orderNo:'112/ປກສ.ຄອບ',detail:'ເຂົ້າຮ່ວມກອງປະຊຸມ',destination:'ປກສ ເມືອງຄອບ',attachOrder:true,pksNotified:true,pksContact:'ຫ້ອງການ ປກສ ເມືອງຄອບ',submittedAt:T+'T09:02',status:'pending'})
  ];
  recs.sort((a,b)=>a.submittedAt.localeCompare(b.submittedAt));
  const prevOff=state.officers;state.officers=officers;
  recs.forEach(r=>{
    r.no=lvNextNo_(store,r.submittedAt);
    if(r.status!=='pending')r.decision={result:r.status==='rejected'?'rejected':'approved',by:HEAD,at:r.decidedAt,comment:r.comment||approveText(r)};
    r.late=lvLate_(r);
    delete r.decidedAt;delete r.comment;
    store.records.push(r);
  });
  state.officers=prevOff;
  return store;
}

/* ---------- state: data from Google Sheet + this device's preferences ---------- */
const PREF_KEY='ldb-khop-leave-prefs-v1',TOK_KEY='ldb-khop-leave-tok';
const IS_GAS=!!(window.google&&google.script&&google.script.run);
let BASE_URL=(document.getElementById('cfg')||{dataset:{}}).dataset.base||'';
if(!/^https:/.test(BASE_URL))BASE_URL='https://script.google.com/macros/s/AKfycbyHycdbHn73ir_ZKXQXpm2puN6zX1drI-zUHHw_LYCuIS9mJOiUd--JrBPM8ox9_jRsTQ/exec';
const SHEET_URL='https://docs.google.com/spreadsheets/d/1P-q_IduI3M1tsbF0l4zLtPc4XySPgcnOr5hJB9vEL-g/edit#gid=7100001';
function loadPrefs(){try{const p=JSON.parse(localStorage.getItem(PREF_KEY));if(p&&p.tab)return p;}catch(e){}return {chosen:false,role:'officer',me:'',tab:{officer:'home',head:'home'}};}
const prefs=loadPrefs();
let state={officers:[],settings:{unitPhone:'',passIsDefault:false},records:[],role:prefs.role,me:prefs.me,tab:prefs.tab};
function save(){prefs.role=state.role;prefs.me=state.me;prefs.tab=state.tab;try{localStorage.setItem(PREF_KEY,JSON.stringify(prefs));}catch(e){}}
const ui={phoneOpen:false,month:null,headAuthed:false,confirmDel:null,loaded:false,loadErr:'',busy:0,att:null,mineRange:'year'};
try{ui.token=sessionStorage.getItem(TOK_KEY)||'';}catch(e){ui.token='';}
const pendUI={};
function ensureMe(){if(!actives().find(o=>String(o.id)===String(state.me))){const a=actives()[0];state.me=a?a.id:'';}}

/* ---------- server calls ---------- */
const demo={store:null,pass:'1234',toks:{},att:{}};
function demoAtt(){
  const T=today(),s=demo.store;
  return {date:T,rate:50000,items:s.officers.filter(o=>o.active).map(o=>{const k=o.id;demo.att[k]=demo.att[k]||{month:7};const p=!!demo.att[k][T];return {id:String(o.id),name:(o.rank?o.rank+' ':'')+o.name,present:p,month:demo.att[k].month+(p?1:0),money:(demo.att[k].month+(p?1:0))*50000};})};
}
function demoCall(req){
  return new Promise(res=>setTimeout(()=>{
    try{
      if(!demo.store)demo.store=seedDemo();
      const a=req.action,d=req.data||{};let authed=!!demo.toks[req.token];const out={ok:true};
      if(a==='login'){if(d.pass!==demo.pass){res({ok:false,err:'ລະຫັດບໍ່ຖືກຕ້ອງ. ລອງໃໝ່ອີກຄັ້ງ.'});return;}const t='t'+Math.random().toString(36).slice(2);demo.toks[t]=1;out.token=t;authed=true;}
      else if(a==='logout'){delete demo.toks[req.token];authed=false;}
      else if(a==='attCheckin'){const k=d.id;demo.att[k]=demo.att[k]||{month:7};out.already=!!demo.att[k][today()];demo.att[k][today()]=1;out.att=demoAtt();res(JSON.parse(JSON.stringify(out)));return;}
      else if(a!=='load'){
        if(a==='settingsSave'&&d.pass){if(!authed)throw new Error('AUTH');if(String(d.pass).length<4)throw new Error('ລະຫັດຕ້ອງມີຢ່າງໜ້ອຍ 4 ຕົວ');demo.pass=d.pass;}
        out.id=leaveCore_(demo.store,a,d,nowL(),authed).id;
      }
      const s=demo.store;
      out.data={officers:s.officers,settings:{unitPhone:s.settings.unitPhone||'',passIsDefault:demo.pass==='1234'},records:s.records,authed:authed};
      if(a==='load')out.att=demoAtt();
      res(JSON.parse(JSON.stringify(out)));
    }catch(e){res({ok:false,err:String(e&&e.message||e)});}
  },200));
}
function gasCall(req){
  return new Promise((res,rej)=>google.script.run.withSuccessHandler(s=>{try{res(JSON.parse(s));}catch(e){rej(e);}}).withFailureHandler(rej).leaveApi(JSON.stringify(req)));
}
function setBusy(d){ui.busy=Math.max(0,ui.busy+d);$('#busy').hidden=!ui.busy;const b=$('#refresh');if(b)b.classList.toggle('spin',!!ui.busy);}
function setToken(t){ui.token=t||'';ui.headAuthed=!!t;try{t?sessionStorage.setItem(TOK_KEY,t):sessionStorage.removeItem(TOK_KEY);}catch(e){}}
function applyData(d){
  if(!d)return;
  state.officers=d.officers||[];state.settings=d.settings||{};state.records=d.records||[];
  if(!d.authed&&ui.token)setToken('');
  ui.headAuthed=!!d.authed;ui.loaded=true;ui.loadErr='';
}
function api(action,data,btn){
  setBusy(1);if(btn)btn.disabled=true;
  return (IS_GAS?gasCall:demoCall)({action:action,data:data||{},token:ui.token}).then(res=>{
    setBusy(-1);if(btn)btn.disabled=false;
    if(!res.ok){
      if(res.err==='AUTH'){setToken('');render();throw new Error('ໝົດເວລາເຂົ້າລະບົບ: ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່');}
      throw new Error(res.err||'ເກີດຂໍ້ຜິດພາດ');
    }
    if(res.token)setToken(res.token);
    applyData(res.data);
    return res;
  },e=>{setBusy(-1);if(btn)btn.disabled=false;throw new Error('ເຊື່ອມຕໍ່ເຊີບເວີບໍ່ໄດ້: ກວດອິນເຕີເນັດແລ້ວລອງໃໝ່');});
}
function fail(e,msgEl){const t=e&&e.message||String(e);if(msgEl){msgEl.textContent=t;msgEl.className='form-msg bad';}toast(t);}
function refresh(quiet){
  return api('load').then(res=>{ui.att=res.att||{err:'OLD'};render();if(!quiet)toast('ອັບເດດຂໍ້ມູນແລ້ວ');}).catch(e=>{if(!ui.loaded){ui.loadErr=e.message;render();}else toast(e.message);});
}
function newDraft(){
  const o=off(state.me),h=actives().find(x=>x.id!==o.id);
  return {officerId:o.id,type:'ລ2',startDate:addDays(today(),1),endDate:addDays(today(),2),timeFrom:'09:00',timeTo:'10:00',reason:'',reasonOther:'',orderNo:'',detail:'',destination:'',phone:o.phone||'',emergencyName:'',emergencyPhone:'',attachMed:false,attachOrder:false,filing:'advance',callTime:'',callTo:'ຫົວໜ້າໜ່ວຍບໍລິການ',handoverTo:h?h.id:'',pksReplacement:'',pksNotified:false,pksContact:'',pledge:false,linkId:null};
}
let draft=null;
function draftRec(){
  const t=TYPES[draft.type];
  const r=Object.assign({},draft,{id:draft.linkId||'__draft',submittedAt:nowL()});
  if(t.kind!=='range')r.endDate=r.startDate;
  if(t.kind==='fixed'){r.timeFrom=t.from;r.timeTo=t.to;}
  if(t.kind==='day'||t.kind==='range'){r.timeFrom='';r.timeTo='';}
  return r;
}
