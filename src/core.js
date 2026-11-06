/* ===== LeaveCore: shared by the server (Leave.gs) and the offline demo in LeaveApp.html ===== */
var LV_RATE = 50000;
var LV_HEAD = 'ຫົວໜ້າໜ່ວຍບໍລິການ ເມືອງຄອບ';
var LV_TYPES = {
  'ອຊ': {label: 'ອອກຊົ່ວຄາວ', kind: 'time', deduct: false},
  'ລ1': {label: 'ເຄິ່ງມື້ເຊົ້າ', kind: 'fixed', from: '08:30', to: '11:30', deduct: false},
  'ລ2': {label: 'ເຄິ່ງມື້ບ່າຍ', kind: 'fixed', from: '12:30', to: '17:00', deduct: false},
  'ລ3': {label: 'ໝົດມື້', kind: 'day', deduct: true},
  'ລ4': {label: 'ຫຼາຍມື້', kind: 'range', deduct: true},
  'ໜທ': {label: 'ໜ້າທີ່ ປກສ', kind: 'range', deduct: true}
};
var LV_STATUS = {pending: 'ລໍຖ້າອະນຸມັດ', approved: 'ອະນຸມັດແລ້ວ', returned: 'ກັບຄືນແລ້ວ', rejected: 'ບໍ່ອະນຸມັດ', phone: 'ແຈ້ງທາງໂທ · ລໍຖ້າໃບລາ', absent: 'ຂາດ'};
var LV_FIELDS = ['officerId', 'type', 'startDate', 'endDate', 'timeFrom', 'timeTo', 'reason', 'reasonOther', 'orderNo', 'detail', 'destination', 'phone', 'emergencyName', 'emergencyPhone', 'attachMed', 'attachOrder', 'filing', 'callTime', 'callTo', 'handoverTo', 'pksReplacement', 'pksNotified', 'pksContact'];

function lvPad_(n) { return (n < 10 ? '0' : '') + n; }
function lvMs_(s) { /* 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm' -> ms, wall-clock (timezone-free) */
  var d = String(s).slice(0, 10).split('-'), t = String(s).length > 10 ? String(s).slice(11, 16).split(':') : ['0', '0'];
  return Date.UTC(+d[0], +d[1] - 1, +d[2], +t[0], +t[1]);
}
function lvIsoMs_(ms) { var d = new Date(ms); return d.getUTCFullYear() + '-' + lvPad_(d.getUTCMonth() + 1) + '-' + lvPad_(d.getUTCDate()); }
function lvAddDays_(s, n) { return lvIsoMs_(lvMs_(s.slice(0, 10)) + n * 864e5); }
function lvSpan_(r) {
  var t = LV_TYPES[r.type], end = r.endDate || r.startDate;
  if (t.kind === 'time') return [r.startDate + 'T' + r.timeFrom, r.startDate + 'T' + r.timeTo];
  if (t.kind === 'fixed') return [r.startDate + 'T' + t.from, r.startDate + 'T' + t.to];
  return [r.startDate + 'T00:00', end + 'T23:59'];
}
function lvExpRet_(r) {
  var t = LV_TYPES[r.type];
  if (t.kind === 'time' || t.kind === 'fixed') return lvSpan_(r)[1];
  return lvAddDays_(r.endDate || r.startDate, 1) + 'T08:30';
}
function lvLate_(r) { return r.returnedAt ? Math.max(0, (lvMs_(r.returnedAt) - lvMs_(lvExpRet_(r))) / 36e5) : 0; }
function lvQty_(r) {
  var t = LV_TYPES[r.type];
  if (t.kind === 'time') return Math.max(0, (lvMs_(r.startDate + 'T' + r.timeTo) - lvMs_(r.startDate + 'T' + r.timeFrom)) / 36e5);
  if (t.kind === 'fixed') return 0.5;
  if (t.kind === 'day') return 1;
  return Math.round((lvMs_(r.endDate || r.startDate) - lvMs_(r.startDate)) / 864e5) + 1;
}
function lvQtyText_(r) {
  var t = LV_TYPES[r.type], q = lvQty_(r);
  if (t.kind === 'time') return q < 1 ? Math.max(1, Math.round(q * 60)) + ' ນາທີ' : (Math.round(q * 10) / 10) + ' ຊົ່ວໂມງ';
  if (t.kind === 'fixed') return 'ເຄິ່ງມື້';
  return q + ' ມື້';
}
/* days without meal allowance for one record (0 when it does not count) */
function lvNoMealDays_(r) {
  if (r.status === 'absent') return LV_TYPES[r.type].kind === 'range' ? lvQty_(r) : 1;
  if ((r.status === 'approved' || r.status === 'returned') && LV_TYPES[r.type].deduct) return lvQty_(r);
  return 0;
}
function lvNextNo_(store, at) {
  var y = String(at).slice(0, 4);
  store.seq = store.seq || {};
  store.seq[y] = (store.seq[y] || 0) + 1;
  return ('00' + store.seq[y]).slice(-3) + '/ລພ.ໜບຄ';
}
function lvUid_() { return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function lvOff_(store, id) {
  for (var i = 0; i < store.officers.length; i++) if (String(store.officers[i].id) === String(id)) return store.officers[i];
  return null;
}
function lvGet_(store, id) {
  for (var i = 0; i < store.records.length; i++) if (store.records[i].id === id) return store.records[i];
  return null;
}
function lvFullName_(o) { return o ? (o.rank ? o.rank + ' ' : '') + o.name : '(ບໍ່ພົບລາຍຊື່)'; }
function lvValidTime_(s) { return /^\d{2}:\d{2}$/.test(s || ''); }
function lvValidDate_(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s || ''); }
function lvClean_(src) {
  var r = {};
  LV_FIELDS.forEach(function (k) {
    var v = src[k];
    if (k === 'attachMed' || k === 'attachOrder' || k === 'pksNotified') r[k] = !!v;
    else r[k] = v == null ? '' : String(v).slice(0, 500);
  });
  var t = LV_TYPES[r.type];
  if (!t) throw new Error('ປະເພດການລາບໍ່ຖືກຕ້ອງ');
  if (!lvValidDate_(r.startDate)) throw new Error('ວັນທີບໍ່ຖືກຕ້ອງ');
  if (t.kind !== 'range') r.endDate = r.startDate;
  else if (!lvValidDate_(r.endDate) || r.endDate < r.startDate) throw new Error('ວັນທີສິ້ນສຸດບໍ່ຖືກຕ້ອງ');
  if (t.kind === 'fixed') { r.timeFrom = t.from; r.timeTo = t.to; }
  else if (t.kind === 'time') { if (!lvValidTime_(r.timeFrom) || !lvValidTime_(r.timeTo) || r.timeTo <= r.timeFrom) throw new Error('ເວລາບໍ່ຖືກຕ້ອງ'); }
  else { r.timeFrom = ''; r.timeTo = ''; }
  if (r.filing !== 'retro') r.filing = 'advance';
  return r;
}

/* Apply one action to the store. `now` is 'YYYY-MM-DDTHH:mm' local time. Returns {id, changed:[ids], meta:bool}. */
function leaveCore_(store, action, data, now, authed) {
  data = data || {};
  var head = function () { if (!authed) throw new Error('AUTH'); };
  var rec = function () { var r = lvGet_(store, data.id); if (!r) throw new Error('ບໍ່ພົບໃບລາ'); return r; };
  var r, o;
  switch (action) {
    case 'submit': {
      var c = lvClean_(data.rec || {});
      o = lvOff_(store, c.officerId);
      if (!o || !o.active) throw new Error('ບໍ່ພົບລາຍຊື່ຜູ້ຂໍລາ');
      c.submittedAt = now; c.status = 'pending'; c.decision = null;
      if (data.linkId) {
        r = lvGet_(store, data.linkId);
        if (!r || r.status !== 'phone' || String(r.officerId) !== String(c.officerId)) throw new Error('ບໍ່ພົບການແຈ້ງທາງໂທ');
        c.filing = 'retro'; c.callTime = r.callTime; c.callTo = r.callTo;
        Object.keys(c).forEach(function (k) { r[k] = c[k]; });
        r.no = lvNextNo_(store, now);
        r.late = lvLate_(r);
        return {id: r.id, changed: [r.id], meta: true};
      }
      c.id = lvUid_(); c.no = lvNextNo_(store, now);
      c.returnedAt = ''; c.returnBy = ''; c.late = 0;
      store.records.push(c);
      return {id: c.id, changed: [c.id], meta: true};
    }
    case 'selfReturn': {
      r = rec();
      var started = now >= lvSpan_(r)[0];
      if (r.returnedAt || !((r.status === 'approved' && started) || r.status === 'phone')) throw new Error('ກົດກັບຄືນບໍ່ໄດ້ສຳລັບໃບລານີ້');
      r.returnedAt = now; r.late = lvLate_(r); r.returnBy = 'self'; r.returnAck = false;
      if (r.status === 'approved') r.status = 'returned';
      return {id: r.id, changed: [r.id]};
    }
    case 'approve':
    case 'reject': {
      head(); r = rec();
      if (r.status !== 'pending') throw new Error('ໃບລານີ້ຖືກພິຈາລະນາແລ້ວ');
      var ok = action === 'approve';
      r.status = ok ? (r.returnedAt ? 'returned' : 'approved') : 'rejected';
      r.decision = {result: ok ? 'approved' : 'rejected', by: String(data.by || LV_HEAD).slice(0, 120), at: now, comment: String(data.comment || '').slice(0, 2000)};
      return {id: r.id, changed: [r.id]};
    }
    case 'ack': {
      head(); r = rec(); r.returnAck = true; r.returnAckAt = now;
      return {id: r.id, changed: [r.id]};
    }
    case 'phoneSave': {
      head();
      var p = data.rec || {};
      var pc = lvClean_(Object.assign({}, p, {filing: 'retro'}));
      o = lvOff_(store, pc.officerId);
      if (!o) throw new Error('ບໍ່ພົບລາຍຊື່');
      if (!lvValidTime_(pc.callTime) || !pc.callTo) throw new Error('ກະລຸນາໃສ່ເວລາໂທ ແລະ ຜູ້ຮັບແຈ້ງ');
      pc.id = lvUid_(); pc.no = ''; pc.submittedAt = ''; pc.status = 'phone'; pc.decision = null;
      pc.returnedAt = ''; pc.returnBy = ''; pc.late = 0;
      pc.phoneLog = {at: now, by: pc.callTo, deadline: lvAddDays_(pc.startDate, 1) + 'T23:59'};
      store.records.push(pc);
      return {id: pc.id, changed: [pc.id]};
    }
    case 'retSave': {
      head(); r = rec();
      if (r.status !== 'approved') throw new Error('ບັນທຶກກັບຄືນບໍ່ໄດ້');
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(data.at || '')) throw new Error('ເວລາກັບບໍ່ຖືກຕ້ອງ');
      r.returnedAt = data.at; r.late = lvLate_(r); r.status = 'returned'; r.returnBy = 'head';
      return {id: r.id, changed: [r.id]};
    }
    case 'absent': {
      head(); r = rec();
      if (r.status !== 'phone') throw new Error('ໝາຍຂາດໄດ້ສະເພາະການແຈ້ງທາງໂທ');
      r.status = 'absent';
      r.decision = {result: 'absent', by: LV_HEAD, at: now, comment: 'ບໍ່ຍື່ນໃບລາຍ້ອນຫຼັງພາຍໃນກຳນົດ 1 ວັນ: ນັບເປັນ "ຂາດ" ແລະ ບໍ່ໄດ້ອັດຕາກິນມື້ດັ່ງກ່າວ.'};
      return {id: r.id, changed: [r.id]};
    }
    case 'staffAdd': {
      head();
      var name = String(data.name || '').trim(), phone = String(data.phone || '').trim();
      if (!name || !phone) throw new Error('ກະລຸນາໃສ່ຊື່ ແລະ ເບີໂທ');
      store.officers.push({id: 'o' + Date.now().toString(36), rank: String(data.rank || '').trim(), name: name, phone: phone, active: true});
      return {changed: [], meta: true};
    }
    case 'staffDel': {
      head();
      o = lvOff_(store, data.id);
      if (!o) throw new Error('ບໍ່ພົບລາຍຊື່');
      if (store.officers.filter(function (x) { return x.active; }).length <= 1) throw new Error('ຕ້ອງມີເຈົ້າໜ້າທີ່ຢ່າງໜ້ອຍ 1 ທ່ານ');
      o.active = false;
      return {changed: [], meta: true};
    }
    case 'settingsSave': {
      head();
      store.settings = store.settings || {};
      store.settings.unitPhone = String(data.unitPhone || '').trim().slice(0, 40);
      return {changed: [], meta: true};
    }
  }
  throw new Error('ບໍ່ຮູ້ຈັກຄຳສັ່ງ: ' + action);
}
/* ===== end LeaveCore ===== */
