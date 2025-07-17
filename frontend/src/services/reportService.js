import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
/**
 *
 * @param {Array<{
 *   driverName: String
 *   id: String
 *   routes: Array<{
 *     date: String
 *     distance: Number
 *     geometry: Object
 *     points: Array
 *   }>
 *   totalDistance: Number
 * }>} drivers
 * @param {String} fileName
 */
export const reportMaker = async (drivers, fileName) => {
  if (!drivers || !fileName) return;

  const columns = [
    { header: 'ФИО', key: 'name', width: 50 },
    { header: 'Общая дистанция', key: 'totalDistance', width: 20 },
  ];

  for (let i = 1; i < 32; i++) {
    columns.push({ header: i.toString(), key: `date${i}`, width: 20 });
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  worksheet.columns = columns;

  drivers.forEach((driver) => {
    const row = {};
    row.name = driver.driverName;
    row.totalDistance = driver.totalDistance;

    if (driver.routes) {
      driver.routes.forEach((route) => {
        // дата приходит в формате дд.мм.гггг
        // преобразовываем в число. При преобразовании 01 -> 1
        const date = parseInt(route.date.slice(0, 2), 10);
        row[`date${date}`] = route.distance;
      });
    }

    worksheet.addRow(row);
  });

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${fileName}.xlsx`);
};
