# ລະບົບບັນທຶກປະຈຳການ ແລະ ຂໍລາພັກ · ຕຳຫຼວດ ເມືອງຄອບ

Google Apps Script web app ທີ່ຜູກກັບ Google Sheet "web apps ລະບົບບັນທຶກປະຈຳການ ຕຳຫຼວດ ເມືອງຄອບ".

- ໜ້າຫຼັກ (ລົງເວລາ / ຜູ້ຄຸ້ມຄອງ): `<web app URL>`
- ລະບົບຂໍລາພັກ: `<web app URL>?page=leave`

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
