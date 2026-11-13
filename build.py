import re, pathlib
ROOT = pathlib.Path(__file__).parent
SRC = ROOT / 'src'; DIST = ROOT / 'build'
orig = (ROOT/'original'/'police-leave-app.html').read_text().split('\n')
L = lambda a, b: '\n'.join(orig[a-1:b])
css = L(14, 225) + '\n' + (SRC/'ui_css.css').read_text()
segA = L(264, 417).split('\n')
segA = '\n'.join(x for x in segA if not x.startswith("const KEY="))
segA = re.sub(r"function nextNo\(r\)\{.*?\n\}\n", "", segA, flags=re.S)
segA = segA.replace("'ລ1':{label:'ເຄິ່ງມື້ເຊົ້າ',note:'08:30–11:30',kind:'fixed',from:'08:30',to:'11:30'", "'ລ1':{label:'ເຄິ່ງມື້ເຊົ້າ',note:'08:00–12:00',kind:'fixed',from:'08:00',to:'12:00'")
segA = segA.replace("'ລ2':{label:'ເຄິ່ງມື້ບ່າຍ',note:'12:30–17:00',kind:'fixed',from:'12:30',to:'17:00'", "'ລ2':{label:'ເຄິ່ງມື້ແລງ',note:'13:00–17:00',kind:'fixed',from:'13:00',to:'17:00'")
segA = segA.replace("if(t.kind==='fixed')return [dt(r.startDate,t.from),dt(r.startDate,t.to)];", "if(t.kind==='fixed')return [dt(r.startDate,r.timeFrom||t.from),dt(r.startDate,r.timeTo||t.to)];")
segA = segA.replace("if(t.kind==='fixed')return 'ວັນ'+wd(r.startDate)+' ທີ '+fD(r.startDate)+' ('+t.from+'–'+t.to+')';", "if(t.kind==='fixed')return 'ວັນ'+wd(r.startDate)+' ທີ '+fD(r.startDate)+' ('+(r.timeFrom||t.from)+'–'+(r.timeTo||t.to)+')';")
segA = segA.replace("'ລ1':'ລາເຄິ່ງມື້ຊ່ວງເຊົ້າ','ລ2':'ລາເຄິ່ງມື້ຊ່ວງບ່າຍ'", "'ລ1':'ລາເຄິ່ງມື້ຊ່ວງເຊົ້າ','ລ2':'ລາເຄິ່ງມື້ຊ່ວງແລງ'")
segA = segA.replace("approved:{t:'ອະນຸມັດແລ້ວ',c:'accent'}", "approved:{t:'ອະນຸມັດແລ້ວ',c:'good'}").replace("returned:{t:'ກັບຄືນແລ້ວ',c:'good'}", "returned:{t:'ກັບຄືນແລ້ວ',c:'accent'}")
assert "approved:{t:'ອະນຸມັດແລ້ວ',c:'good'}" in segA and "returned:{t:'ກັບຄືນແລ້ວ',c:'accent'}" in segA
segA = segA.replace("back='ໃຫ້ກັບມາປະຈຳການ 12:30 ແລະ ພາກຄ່ຳ 18:00.'", "back='ໃຫ້ກັບມາປະຈຳການ 13:00 ແລະ ພາກຄ່ຳ 18:00.'")
for k in ["note:'08:00–12:00'", "note:'13:00–17:00'", "r.timeFrom||t.from),dt(", "(r.timeFrom||t.from)+'–'", "ຊ່ວງແລງ'", "13:00 ແລະ"]:
    assert k in segA, k
segB = L(478, 679)
segC = L(707, 780)
assert "row('ເບີຕິດຕໍ່ໃນເວລາລາ'" in segC
segC = segC.replace("row('ເບີຕິດຕໍ່ໃນເວລາລາ'", "row('ເບີໂທຕິດຕໍ່'")
_ex = "'<button class=\"btn primary sm\" type=\"button\" data-act=\"export-leave\" data-id=\"'+r.id+'\">ສົ່ງອອກເປັນຮູບພາບ</button></div>'"
assert segC.count(_ex) == 1
segC = segC.replace(_ex, "'<span class=\"m-act\"><button class=\"btn primary sm\" type=\"button\" data-act=\"export-leave\" data-id=\"'+r.id+'\">ສົ່ງອອກເປັນຮູບພາບ</button>'+ownBtns(r)+'</span></div>'")
onf = L(885, 907)
assert onf.startswith('function onField(e){') and onf.rstrip().endswith("document.addEventListener('change',onField);")

def rep(s, a, b):
    assert a in s, a[:60]
    return s.replace(a, b)
segB = rep(segB, "(state.settings.adminPass==='1234'?'<p class=\"how\">ຕົວຢ່າງນີ້ໃຊ້ລະຫັດ <b>1234</b>. ປ່ຽນໄດ້ໃນແຖບ ເຈົ້າໜ້າທີ່ ແລະ ຕັ້ງຄ່າ.</p>':'')",
              "(state.settings.passIsDefault?'<p class=\"how\">ລະຫັດເລີ່ມຕົ້ນແມ່ນ <b>1234</b>. ກະລຸນາປ່ຽນໃນແຖບ ຕັ້ງຄ່າ ຫຼັງເຂົ້າລະບົບ.</p>':'')")
# no emergency-call strip on the officer pages; officerMine (with the leave summary) lives in src/ui_views.js
segB, k = re.subn(r"function hotline\(\)\{.*?\n\}\n", "", segB, flags=re.S); assert k == 1
segB = rep(segB, "return hotline()+'<form", "return '<form")
segB, k = re.subn(r"function officerMine\(\)\{.*?\n\}\n", "", segB, flags=re.S); assert k == 1
assert 'hotline' not in segB
segB, k = re.subn(r"function headStaff\(\)\{.*?\n\}(?=\n|$)", "", segB, flags=re.S); assert k == 1
segB, k = re.subn(r"function officerNew\(\)\{.*?\n\}\nfunction dyn\(\)\{.*?\n\}\n", "", segB, flags=re.S); assert k == 1
# ids may be numbers-as-strings from the attendance system: compare loosely as strings
segA = rep(segA, "const off=id=>state.officers.find(o=>o.id===id)", "const off=id=>state.officers.find(o=>String(o.id)===String(id))")
segB = segB.replace("r.officerId===state.me", "String(r.officerId)===String(state.me)")

core = (SRC/'core.js').read_text()
page = f'''<!DOCTYPE html>
<html lang="lo">
<head>
<base target="_top">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>ລະບົບເຂົ້າບັນທຶກ ຕຳຫຼວດ ເມືອງຄອບ</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Noto+Sans+Lao+Looped:wght@600;700&family=Noto+Sans+Lao:wght@400;500;600;700&display=swap">
<style>
{css}
</style>
</head>
<body>
<div id="cfg" data-base="<?= baseUrl ?>" hidden></div>
<div id="busy" class="busy" hidden></div>
<header class="top">
  <div class="wrap top-in">
    <div class="brand">
      <div class="mark" aria-hidden="true">ລພ</div>
      <div>
        <h1>ລະບົບເຂົ້າບັນທຶກ ຕຳຫຼວດປະຈຳການ</h1>
        <p>ທະນາຄານພັດທະນາລາວ · ໜ່ວຍບໍລິການ ເມືອງຄອບ</p>
      </div>
    </div>
    <div class="top-act">
      <p class="today" id="today"></p>
      <button class="icon-btn" id="refresh" type="button" data-act="refresh" aria-label="ໂຫຼດຂໍ້ມູນໃໝ່"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg></button>
    </div>
  </div>
</header>
<div class="wrap"><p class="demo" id="demo" hidden>ໂໝດທົດລອງ: ເປີດນອກ Google Apps Script · ຂໍ້ມູນເປັນຕົວຢ່າງ ແລະ ບໍ່ໄດ້ບັນທຶກລົງ Google Sheet · ລະຫັດຫົວໜ້າ 1234</p></div>
<main class="wrap" id="app"></main>
<nav class="bnav" id="bnav" hidden aria-label="ເມນູຫຼັກ"></nav>

<div id="modal" class="modal" hidden role="dialog" aria-modal="true" aria-label="ໃບຂໍລາພັກ">
  <div class="modal-card">
    <button class="close" type="button" data-act="close" aria-label="ປິດ">✕</button>
    <div id="modal-body"></div>
  </div>
</div>
<div id="xmodal" class="modal" hidden role="dialog" aria-modal="true" aria-label="ຮູບພາບສຳລັບສົ່ງໃນກຸ່ມ">
  <div class="modal-card">
    <button class="close" type="button" data-act="xclose" aria-label="ປິດ">✕</button>
    <div id="xbody"></div>
  </div>
</div>
<div id="toast" class="toast" role="status" aria-live="polite" hidden></div>
<div id="pop" class="pop" hidden role="alertdialog" aria-modal="true" aria-labelledby="pop-t">
  <div class="pop-card" id="pop-body"></div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script>
{core}
</script>
<script>
(function(){{
'use strict';
{segA}
{(SRC/'ui_state.js').read_text()}
{segB}
{(SRC/'ui_views.js').read_text()}
{(SRC/'ui_form.js').read_text()}
{segC}
{(SRC/'ui_tail.js').read_text()}
}})();
</script>
</body>
</html>
'''
assert page.count('<' + '?') == 1, 'stray scriptlet marker'
DIST.mkdir(exist_ok=True)
(DIST/'LeaveApp.html').write_text(page)

# GitHub Pages version -> docs/leave.html
# Same page, served from github.io. A tiny google.script.run shim sends each call to the
# Apps Script web app with fetch (doPost in Code.gs routes {app:'leave'} to leaveApi), and
# Google Sheets stays the database.
EXEC_URL = 'https://script.google.com/macros/s/AKfycbyHycdbHn73ir_ZKXQXpm2puN6zX1drI-zUHHw_LYCuIS9mJOiUd--JrBPM8ox9_jRsTQ/exec'
SHIM = '''<script>
/* GitHub Pages: forward google.script.run.leaveApi(...) to the Apps Script web app */
window.LEAVE_API_URL='%s';
(function(){
  function runner(ok,fail){
    return new Proxy({},{get:function(_,k){
      if(k==='withSuccessHandler')return function(f){return runner(f,fail);};
      if(k==='withFailureHandler')return function(f){return runner(ok,f);};
      return function(arg){
        fetch(window.LEAVE_API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
          body:JSON.stringify({app:'leave',fn:String(k),req:JSON.parse(arg||'{}')})})
        .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
        .then(function(t){if(ok)ok(t);})
        .catch(function(e){if(fail)fail(e);});
      };
    }});
  }
  window.google={script:{run:runner(null,null)}};
})();
</script>''' % EXEC_URL
gh = page.replace('<?= baseUrl ?>', EXEC_URL)
gh = gh.replace('<script src="https://cdnjs', SHIM + '\n<script src="https://cdnjs', 1)
# logo (GitHub Pages only, so apps-script/Leave.gs stays identical to the live script)
MARK = (ROOT/'docs'/'img'/'mark.svg').read_text().strip()
HEAD = ('<link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32.png">\n'
        '<link rel="icon" type="image/svg+xml" href="img/logo.svg">\n'
        '<link rel="apple-touch-icon" href="img/apple-touch-icon.png">\n'
        '<link rel="manifest" href="manifest.webmanifest">\n'
        '<meta name="theme-color" content="#2778b9">\n'
        '<style>.mark.logo{border:0;border-radius:0;width:36px;height:44px}.mark.logo svg{width:100%;height:100%;display:block}</style>\n</head>')
gh = gh.replace('</head>', HEAD, 1)
old_mark = '<div class="mark" aria-hidden="true">ລພ</div>'
assert old_mark in gh
gh = gh.replace(old_mark, '<div class="mark logo" aria-hidden="true">' + MARK + '</div>', 1)
assert '<?' not in gh and 'LEAVE_API_URL' in gh
(ROOT/'docs'/'leave.html').write_text(gh)
print('wrote docs/leave.html')
(DIST/'Leave.gs').write_text((SRC/'server.gs').read_text() + '\n\n' + core)
print('built', len(page), 'bytes')

# single-file version for Apps Script (page embedded as a string) -> apps-script/Leave.gs
import json
gs = (DIST/'Leave.gs').read_text().replace("  var t = HtmlService.createTemplateFromFile('LeaveApp');", "  var t = HtmlService.createTemplate(LEAVE_PAGE_HTML_);")
gs += "\n\n/* ===== ໜ້າເວັບ (HTML) ຢູ່ໃນໄຟລ໌ນີ້ເລີຍ ===== */\nvar LEAVE_PAGE_HTML_ = " + json.dumps(page, ensure_ascii=False).replace('</script>', '<\\/script>') + ";\n"
(ROOT/'apps-script'/'Leave.gs').write_text(gs)
print('wrote apps-script/Leave.gs')
