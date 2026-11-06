/**
 * ລະບົບຂໍລາພັກ ຕຳຫຼວດປະຈຳການ · ໜ່ວຍບໍລິການ ເມືອງຄອບ
 * Server side for the leave web app. Stores data in the sheets
 *   "ບັນທຶກການລາ" (one row per leave record, readable) and "LeaveDB" (officers, settings, numbering).
 * The page is opened with  <web app URL>?page=leave
 */
var LEAVE_SS_ID = '1P-q_IduI3M1tsbF0l4zLtPc4XySPgcnOr5hJB9vEL-g';
var LEAVE_LOG_SHEET = 'ບັນທຶກການລາ';
var LEAVE_DB_SHEET = 'LeaveDB';
var LEAVE_TZ = 'Asia/Vientiane';
var LEAVE_COLS = 28; // A..AB, AB = JSON data

/** Returns the leave page. Call this from doGet when e.parameter.page == 'leave'. */
function leavePage_() {
  var t = HtmlService.createTemplateFromFile('LeaveApp');
  t.baseUrl = ScriptApp.getService().getUrl();
  return t.evaluate()
    .setTitle('ລະບົບຂໍລາພັກ ຕຳຫຼວດ ເມືອງຄອບ')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Single entry point called from the page with google.script.run.leaveApi(jsonString). */
function leaveApi(reqJson) {
  try {
    var req = JSON.parse(reqJson || '{}');
    var action = req.action || 'load', data = req.data || {};
    var authed = leaveCheckToken_(req.token);
    var out = {ok: true};
    if (action === 'login') {
      if (leaveHash_(String(data.pass || '')) !== leaveAdminHash_()) return JSON.stringify({ok: false, err: 'ລະຫັດບໍ່ຖືກຕ້ອງ. ລອງໃໝ່ອີກຄັ້ງ.'});
      out.token = leaveNewToken_();
      authed = true;
    } else if (action === 'logout') {
      if (req.token) CacheService.getScriptCache().remove('lv_tok_' + req.token);
      authed = false;
    } else if (action !== 'load') {
      var lock = LockService.getScriptLock();
      lock.waitLock(20000);
      try {
        var store = leaveReadStore_();
        if (action === 'settingsSave' && data.pass) {
          if (!authed) throw new Error('AUTH');
          if (String(data.pass).length < 4) throw new Error('ລະຫັດຕ້ອງມີຢ່າງໜ້ອຍ 4 ຕົວ');
          PropertiesService.getScriptProperties().setProperty('LEAVE_ADMIN_HASH', leaveHash_(String(data.pass)));
        }
        var res = leaveCore_(store, action, data, leaveNow_(), authed);
        if (res.meta) leaveWriteMeta_(store);
        (res.changed || []).forEach(function (id) { leaveWriteRecord_(store, lvGet_(store, id)); });
        SpreadsheetApp.flush();
        out.id = res.id;
        out.data = leaveClientData_(store, authed);
      } finally {
        lock.releaseLock();
      }
      return JSON.stringify(out);
    }
    out.data = leaveClientData_(leaveReadStore_(), authed);
    out.authed = authed;
    return JSON.stringify(out);
  } catch (e) {
    return JSON.stringify({ok: false, err: String(e && e.message || e)});
  }
}

/* ---------- storage ---------- */
function leaveSS_() { return SpreadsheetApp.openById(LEAVE_SS_ID); }
function leaveSheet_(name, cols) {
  var ss = leaveSS_(), sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (name === LEAVE_LOG_SHEET) {
      sh.getRange(1, 1, 1, LEAVE_COLS).setValues([LEAVE_HEADERS]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  }
  return sh;
}
var LEAVE_HEADERS = ['ID', 'ເລກທີ', 'ວັນທີຍື່ນ', 'ຍົດ ຊື່ ແລະ ນາມສະກຸນ', 'ປະເພດ', 'ຊື່ປະເພດ', 'ແຕ່ວັນທີ', 'ຫາວັນທີ', 'ເວລາອອກ', 'ເວລາກັບ', 'ຈຳນວນ', 'ເຫດຜົນ', 'ລາຍລະອຽດ', 'ສະຖານທີ່ທີ່ຈະໄປ', 'ເບີໂທຕິດຕໍ່', 'ຕິດຕໍ່ສຸກເສີນ', 'ຜູ້ຮັບມອບ / ຜູ້ແທນ', 'ການຍື່ນ', 'ສະຖານະ', 'ຜູ້ອະນຸມັດ', 'ວັນທີອະນຸມັດ', 'ຄຳເຫັນຫົວໜ້າ', 'ກັບມາເວລາ', 'ກັບຊ້າ (ຊົ່ວໂມງ)', 'ມື້ບໍ່ໄດ້ອັດຕາກິນ', 'ອັດຕາກິນທີ່ຫັກ (ກີບ)', 'ອັບເດດລ່າສຸດ', 'DATA (ລະບົບ · ຫ້າມແກ້)'];

function leaveReadStore_() {
  var db = leaveSheet_(LEAVE_DB_SHEET);
  var meta = null;
  try { meta = JSON.parse(db.getRange('A1').getValue() || 'null'); } catch (e) { meta = null; }
  if (!meta || !meta.officers) meta = {officers: leaveOfficersFromSystemDB_(), settings: {unitPhone: ''}, seq: {}};
  var sh = leaveSheet_(LEAVE_LOG_SHEET), last = sh.getLastRow(), records = [];
  if (last >= 2) {
    sh.getRange(2, LEAVE_COLS, last - 1, 1).getValues().forEach(function (row) {
      if (!row[0]) return;
      try { records.push(JSON.parse(row[0])); } catch (e) {}
    });
  }
  var settings = meta.settings || {unitPhone: ''};
  if (!settings.unitPhone) settings.unitPhone = PropertiesService.getScriptProperties().getProperty('LEAVE_UNIT_PHONE') || ''; // from the older leave version
  return {officers: meta.officers, settings: settings, seq: meta.seq || {}, records: records};
}
function leaveWriteMeta_(store) {
  leaveSheet_(LEAVE_DB_SHEET).getRange('A1').setValue(JSON.stringify({officers: store.officers, settings: store.settings, seq: store.seq}));
}
/** Reads officers from the attendance system (SystemDB!A1) on first run: "ສທ ຊື່ ນາມສະກຸນ (020...)". */
function leaveOfficersFromSystemDB_() {
  try {
    var s = JSON.parse(leaveSS_().getSheetByName('SystemDB').getRange('A1').getValue());
    return (s.officers || []).map(function (o) {
      var m = String(o.name).match(/^(\S+)\s+(.+?)\s*\(([\d\s]+)\)\s*$/);
      return m ? {id: String(o.id), rank: m[1], name: m[2], phone: m[3], active: true} : {id: String(o.id), rank: '', name: String(o.name), phone: '', active: true};
    });
  } catch (e) { return []; }
}
function leaveWriteRecord_(store, r) {
  if (!r) return;
  var sh = leaveSheet_(LEAVE_LOG_SHEET), last = sh.getLastRow(), row = -1;
  if (last >= 2) {
    var ids = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) if (ids[i][0] === r.id) { row = i + 2; break; }
  }
  if (row < 0) row = Math.max(last, 1) + 1;
  var o = lvOff_(store, r.officerId), t = LV_TYPES[r.type], d = r.decision || {};
  var cover = r.pksReplacement ? r.pksReplacement + ' (ປກສ)' : (r.handoverTo ? lvFullName_(lvOff_(store, r.handoverTo)) : '');
  var reason = r.reason === 'ອື່ນໆ' ? (r.reasonOther || 'ອື່ນໆ') : (r.reason || '');
  if (r.orderNo) reason += ' · ຄຳສັ່ງ ' + r.orderNo;
  var noMeal = lvNoMealDays_(r);
  var values = [
    r.id, r.no || 'ແຈ້ງທາງໂທ', (r.submittedAt || '').replace('T', ' '), lvFullName_(o) + (o && o.phone ? ' (' + o.phone + ')' : ''),
    r.type, t.label, r.startDate, r.endDate || r.startDate, r.timeFrom || '', r.timeTo || '', lvQtyText_(r),
    reason, r.detail || '', r.destination || '', r.phone || '',
    r.emergencyPhone ? (r.emergencyName || '') + ' ' + r.emergencyPhone : '', cover,
    r.filing === 'retro' ? 'ຍ້ອນຫຼັງ · ໂທ ' + (r.callTo || '') + ' ' + (r.callTime || '') : 'ລ່ວງໜ້າ',
    LV_STATUS[r.status] || r.status, d.by || '', (d.at || '').replace('T', ' '), d.comment || '',
    (r.returnedAt || '').replace('T', ' '), r.late > 0.01 ? Math.round(r.late * 100) / 100 : 0,
    noMeal, noMeal * LV_RATE, leaveNow_().replace('T', ' '), JSON.stringify(r)
  ];
  var rg = sh.getRange(row, 1, 1, LEAVE_COLS);
  rg.setNumberFormat('@');
  sh.getRange(row, 24, 1, 3).setNumberFormat('#,##0.##');
  rg.setValues([values]);
}
function leaveClientData_(store, authed) {
  return {
    officers: store.officers,
    settings: {unitPhone: (store.settings || {}).unitPhone || '', passIsDefault: leaveAdminHash_() === leaveHash_('1234')},
    records: store.records,
    authed: !!authed,
    now: leaveNow_()
  };
}

/* ---------- auth ---------- */
function leaveHash_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'ldb-mkx-leave:' + s, Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}
function leaveAdminHash_() { return PropertiesService.getScriptProperties().getProperty('LEAVE_ADMIN_HASH') || leaveHash_('1234'); }
function leaveNewToken_() {
  var tok = Utilities.getUuid();
  CacheService.getScriptCache().put('lv_tok_' + tok, '1', 6 * 3600);
  return tok;
}
function leaveCheckToken_(tok) { return !!(tok && CacheService.getScriptCache().get('lv_tok_' + tok)); }
function leaveNow_() { return Utilities.formatDate(new Date(), LEAVE_TZ, "yyyy-MM-dd'T'HH:mm"); }

/** Run once from the editor (optional) to check access to the spreadsheet. */
function leaveSetupTest() {
  var s = leaveReadStore_();
  Logger.log('ເຈົ້າໜ້າທີ່: ' + s.officers.length + ' · ໃບລາ: ' + s.records.length);
}
