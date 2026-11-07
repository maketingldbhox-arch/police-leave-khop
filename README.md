# ລະບົບບັນທຶກປະຈຳການ ແລະ ຂໍລາພັກ · ຕຳຫຼວດ ເມືອງຄອບ

Google Apps Script web app ທີ່ຜູກກັບ Google Sheet "web apps ລະບົບບັນທຶກປະຈຳການ ຕຳຫຼວດ ເມືອງຄອບ".

- ໜ້າຫຼັກ (ລົງເວລາ / ຜູ້ຄຸ້ມຄອງ): `<web app URL>`
- ລະບົບຂໍລາພັກ: `<web app URL>?page=leave`
- **GitHub Pages** (ເຜີຍແຜ່ app): https://maketingldbhox-arch.github.io/police-leave-khop/ · ລະບົບຂໍລາ: https://maketingldbhox-arch.github.io/police-leave-khop/leave.html

## ໂຄງສ້າງ
| ໂຟນເດີ | ເນື້ອໃນ |
|---|---|
| `apps-script/` | ໄຟລ໌ທີ່ຢູ່ໃນ Apps Script ຕົວຈິງ: `Code.gs`, `index.html`, `Leave.gs`, `appsscript.json` |
| `src/` | ໂຄດຕົ້ນສະບັບຂອງລະບົບຂໍລາ (ກົດລະບຽບ, ເຊີບເວີ, ໜ້າຈໍ) |
| `original/` | HTML ຕົ້ນແບບຂອງລະບົບຂໍລາ (ສະບັບ localStorage) |
| `build.py` | ລວມ `src/` + `original/` ເປັນ `apps-script/Leave.gs` (ໄຟລ໌ດຽວ) |

## ແກ້ໄຂ ແລະ ອັບໂຫຼດ
1. ແກ້ໄຟລ໌ໃນ `src/` ແລ້ວແລ່ນ `python3 build.py`
2. ເປີດ `build/LeaveApp.html` ໃນ browser ເພື່ອທົດລອງ (ໂໝດທົດລອງ, ລະຫັດຫົວໜ້າ 1234)
3. ວາງ `apps-script/Leave.gs` ແທນທີ່ Leave.gs ໃນ Apps Script → Save → Deploy → Manage deployments → New version

## ຂໍ້ມູນໃນ Google Sheet
- **ບັນທຶກການລາ**: 1 ແຖວ = 1 ໃບລາ (ຖັນ DATA ທີ່ເຊື່ອງໄວ້ແມ່ນຂໍ້ມູນລະບົບ, ຢ່າແກ້ດ້ວຍມື)
- **LeaveDB** (ເຊື່ອງ): ລາຍຊື່ຕຳຫຼວດ, ການຕັ້ງຄ່າ, ເລກທີໃບລາ
- ລະຫັດ admin ເກັບເປັນ hash ໃນ Script Properties (`LEAVE_ADMIN_HASH`), ບໍ່ຢູ່ໃນ repo ນີ້

## ສະຖາປັດຕະຍະກຳ
| ສ່ວນ | ໜ້າທີ່ |
|---|---|
| **Google Sheets** | ຖານຂໍ້ມູນ: ແຜ່ນ "ບັນທຶກການລາ", "LeaveDB" (ລະບົບຂໍລາ) ແລະ "ລາຍງານ" (ບັນທຶກປະຈຳການ) |
| **Google Apps Script** | Backend / API: `Code.gs` (`doGet`, `doPost`) ແລະ `Leave.gs` (`leaveApi`) |
| **GitHub Pages** (`docs/`) | ໜ້າເວັບທີ່ຜູ້ໃຊ້ເປີດ: `index.html` (ໜ້າເລືອກລະບົບ), `leave.html` (ລະບົບຂໍລາ) |

`docs/leave.html` ເອີ້ນ Apps Script ດ້ວຍ `fetch` POST `{app:"leave", req:{...}}` → `doPost` ສົ່ງຕໍ່ໃຫ້ `leaveApi` → ອ່ານ/ຂຽນ Google Sheet.
`docs/leave.html` ສ້າງຈາກ `build.py` ເຊັ່ນກັນ (ຢ່າແກ້ດ້ວຍມື). ຖ້າ URL web app ປ່ຽນ ໃຫ້ແກ້ `EXEC_URL` ໃນ `build.py` ແລ້ວ build ໃໝ່.
