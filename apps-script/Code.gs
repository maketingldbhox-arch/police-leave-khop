/**
 * ລະບົບບັນທຶກປະຈຳການ - ໜ່ວຍເມືອງຄອບ
 * Backend: Google Apps Script (code.gs)
 * ---------------------------------------------------------------
 * ເຊື່ອມຕໍ່ກັບ Google Sheet ເດີມ (ຖານຂໍ້ມູນເດີມ) ໂດຍບໍ່ປ່ຽນໂຄງສ້າງ/ຊື່ຖັນເລີຍ:
 *   Sheet ຊື່  : ລາຍງານ
 *   ຖັນ A       : ວັນທີ            (yyyy-MM-dd)
 *   ຖັນ B       : ຊື່ ແລະ ນາມສະກຸນ
 *   ຖັນ C       : ສະຖານະ           ("ປະຈຳການ" ຫຼື "ຂາດ/ພັກ")
 *   ຖັນ D       : ອັດຕາກິນ
 *   ຖັນ E       : ລວມເງິນ (ກີບ)
 *
 * Sheet ນີ້ບັນທຶກແບບ 1 ແຖວ = 1 ຕຳຫຼວດ x 1 ວັນທີ (ທັງຄົນທີ່ມາ ແລະ ຂາດ)
 * ເຊິ່ງກົງກັບຮູບແບບຂໍ້ມູນເດີມທີ່ມີຢູ່ໃນ Sheet ນີ້ແລ້ວ.
 *
 * ==================== ວິທີຕິດຕັ້ງ ====================
 * 1. ເປີດ Google Sheet ນີ້ (ID: 1P-q_IduI3M1tsbF0l4zLtPc4XySPgcnOr5hJB9vEL-g)
 *    -> ເມນູ Extensions > Apps Script
 * 2. ລຶບໂຄ້ດເດີມໃນ Code.gs ອອກທັງໝົດ ແລ້ວວາງໂຄ້ດນີ້ທັບລົງໄປ
 * 3. ກົດ Deploy > New deployment
 *      - Select type: Web app
 *      - Execute as        : Me (ບັນຊີຂອງທ່ານ)
 *      - Who has access    : Anyone
 *    ແລ້ວກົດ Deploy (ຄັ້ງທຳອິດຕ້ອງ Authorize ສິດອະນຸຍາດ)
 * 4. ຄັດລອກ "Web app URL" ທີ່ໄດ້ ໄປວາງແທນຄ່າ GOOGLE_SCRIPT_URL
 *    ໃນໄຟລ໌ index.html (ໜ້າເວັບຢູ່ໃນໂປຣເຈັກດຽວກັນນີ້)
 * 5. ທຸກຄັ້ງທີ່ແກ້ໄຂໂຄ້ດນີ້ ຕ້ອງເຮັດ Deploy > Manage deployments > Edit > New version ນຳ
 *
 * ໝາຍເຫດ: index.html ດຶງ/ບັນທຶກຂໍ້ມູນຜ່ານ google.script.run (ບໍ່ໄດ້ໃຊ້ fetch() ຫາ URL ຂອງຕົນເອງ)
 * ເພື່ອຫຼີກລ້ຽງບັນຫາ CORS/ຄຸກກີ້ ທີ່ເກີດຂຶ້ນເມື່ອໜ້າເວັບຖືກໂຫລດຢູ່ໃນ iframe ຂອງ Apps Script ເອງ.
 * ຖັນ ?action=data ຍັງເກັບໄວ້ເປັນ API ສຳຮອງ ຖ້າຫາກຢາກ host index.html ແຍກຕ່າງຫາກໃນອະນາຄົດ.
 * =======================================================
 */

// ID ຂອງ Google Sheet ຖານຂໍ້ມູນເດີມ
const SHEET_ID = '1P-q_IduI3M1tsbF0l4zLtPc4XySPgcnOr5hJB9vEL-g';
const SHEET_NAME = 'ລາຍງານ';
const DEFAULT_RATE = 50000;

const STATUS_PRESENT = 'ປະຈຳການ';
const STATUS_ABSENT = 'ຂາດ/ພັກ';

// ດຶງ Sheet ຕາມຊື່ (ຖ້າຍັງບໍ່ມີ ຈະສ້າງໃໝ່ພ້ອມຫົວຖັນໃຫ້ຄືເດີມ)
function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['ວັນທີ', 'ຊື່ ແລະ ນາມສະກຸນ', 'ສະຖານະ', 'ອັດຕາກິນ', 'ລວມເງິນ (ກີບ)']);
  }
  return sheet;
}

// ສ້າງ id ຕົວເລກທີ່ຄົງທີ່ (deterministic hash) ຈາກຊື່ຕຳຫຼວດ
// ເພື່ອໃຫ້ໄດ້ id ດຽວກັນທຸກຄັ້ງທີ່ດຶງຂໍ້ມູນ (Sheet ບໍ່ມີຖັນ id ເກັບໄວ້)
function nameToId_(name) {
  let hash = 0;
  const str = String(name);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // ບີບໃຫ້ເປັນ 32-bit integer
  }
  return Math.abs(hash);
}

// ຮັບຄ່າວັນທີຈາກ cell (ອາດເປັນ Date object ຫຼື ຂໍ້ຄວາມ) ໃຫ້ອອກມາເປັນ "yyyy-MM-dd" ສະເໝີ
function formatDate_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone() || 'Asia/Vientiane', 'yyyy-MM-dd');
  }
  return String(value).trim();
}

/**
 * GET -> ຖ້າມີ ?action=data ຈະສົ່ງຂໍ້ມູນ JSON ກັບຄືນ (ໃຊ້ໂດຍ index.html ຜ່ານ fetch())
 * ຖ້າເປີດ URL ທຳມະດາ (ບໍ່ມີ parameter) ຈະສະແດງໜ້າເວັບ index.html ໃຫ້ເລີຍ
 * ນີ້ເຮັດໃຫ້ URL ດຽວກັນນີ້ ເປັນທັງ "ໜ້າຕ່າງ web app" ແລະ "API" ໃນຕົວດຽວກັນ
 */
function doGet(e) {
  if (e && e.parameter && e.parameter.page === 'leave') return leavePage_();
  if (e && e.parameter && e.parameter.action === 'data') {
    return getDataJson_();
  }
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('ລະບົບບັນທຶກປະຈຳການ - ໜ່ວຍເມືອງຄອບ')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * ອ່ານທຸກແຖວຈາກ Sheet "ລາຍງານ" ແລ້ວປະກອບເປັນ object
 * ຮູບແບບດຽວກັບທີ່ໜ້າເວັບຕ້ອງການ:
 * { rate: number, officers: [{id, name}], records: { "yyyy-MM-dd": [id, id, ...] } }
 */
function buildData_() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();

  const officersMap = {}; // name -> id (ກັນຊື່ຊ້ຳ)
  const officers = [];
  const records = {};
  let latestDate = '';
  let rate = DEFAULT_RATE;

  if (lastRow > 1) {
    const values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
    values.forEach(function (row) {
      const dateStr = formatDate_(row[0]);
      const name = String(row[1]).trim();
      const status = String(row[2]).trim();
      const rowRate = Number(row[3]) || 0;

      if (!dateStr || !name) return;

      if (!(name in officersMap)) {
        const id = nameToId_(name);
        officersMap[name] = id;
        officers.push({ id: id, name: name });
      }
      const id = officersMap[name];

      if (!records[dateStr]) records[dateStr] = [];
      if (status === STATUS_PRESENT && records[dateStr].indexOf(id) === -1) {
        records[dateStr].push(id);
      }

      // ໃຊ້ອັດຕາກິນຂອງແຖວທີ່ມີວັນທີຫຼ້າສຸດເປັນຄ່າປັດຈຸບັນ
      if (dateStr >= latestDate) {
        latestDate = dateStr;
        if (rowRate) rate = rowRate;
      }
    });
  }

  return { rate: rate, officers: officers, records: records };
}

// API ສຳຮອງ (ໃຊ້ຖ້າ host index.html ແຍກຕ່າງຫາກ ຫຼືທົດສອບຜ່ານ browser ໂດຍກົງ)
function getDataJson_() {
  return ContentService.createTextOutput(JSON.stringify(buildData_()))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ຮັບການຮຽກຈາກ google.script.run ໃນ index.html ເພື່ອດຶງຂໍ້ມູນ
 * (ວິທີນີ້ບໍ່ຕິດບັນຫາ CORS ເພາະບໍ່ໄດ້ຜ່ານ fetch() ທຳມະດາ)
 */
function getAttendanceData() {
  return buildData_();
}

/**
 * ຮັບການຮຽກຈາກ google.script.run ໃນ index.html ເພື່ອບັນທຶກຂໍ້ມູນ
 * jsonStr = JSON.stringify({rate, officers, records}) ທີ່ສົ່ງມາຈາກ client
 */
function saveAttendanceData(jsonStr) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = JSON.parse(jsonStr) || {};
    writeAllData_(data);
    return { status: 'success' };
  } finally {
    lock.releaseLock();
  }
}

/**
 * POST -> ຮັບຂໍ້ມູນທັງໝົດຈາກໜ້າເວັບ ({ data: {rate, officers, records} })
 * ແລ້ວຂຽນທັບ Sheet ໃໝ່ທັງໝົດ (ຮັກສາຮູບແບບແຖວແບບເດີມ: 1 ແຖວ = 1 ຕຳຫຼວດ x 1 ວັນທີ)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const payload = JSON.parse(e.postData.contents);
    const data = payload.data || {};
    writeAllData_(data);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function writeAllData_(data) {
  const sheet = getSheet_();
  const officers = data.officers || [];
  const records = data.records || {};
  const rate = Number(data.rate) || DEFAULT_RATE;

  let dates = Object.keys(records).sort();

  // ຖ້າຍັງບໍ່ມີວັນທີໃດເລີຍ ແຕ່ມີລາຍຊື່ຕຳຫຼວດ (ຫາກເພິ່ນເພີ່ມລາຍຊື່ແຕ່ຍັງບໍ່ທັນລົງເວລາ)
  // ໃຫ້ໃສ່ວັນທີປັດຈຸບັນໄວ້ກ່ອນ ເພື່ອບໍ່ໃຫ້ລາຍຊື່ຫາຍໄປຈາກ Sheet
  if (dates.length === 0 && officers.length > 0) {
    const todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Vientiane', 'yyyy-MM-dd');
    dates = [todayStr];
    records[todayStr] = records[todayStr] || [];
  }

  const rows = [];
  dates.forEach(function (date) {
    const presentIds = records[date] || [];
    officers.forEach(function (officer) {
      const isPresent = presentIds.indexOf(officer.id) !== -1;
      rows.push([
        date,
        officer.name,
        isPresent ? STATUS_PRESENT : STATUS_ABSENT,
        rate,
        isPresent ? rate : 0
      ]);
    });
  });

  // ລຶບຂໍ້ມູນເກົ່າ (ເກັບໄວ້ແຕ່ຫົວແຖວ) ແລ້ວຂຽນຂໍ້ມູນທັງໝົດໃໝ່
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 5).clearContent();
  }
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 5).setValues(rows);
  }
}
