import { localizationDate } from '@/utils/localizationDate';
import ExcelJS from 'exceljs';

const parseExcel = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet('TIMINGS');

  const requiredCols = ['ФИО исполнителя', 'Широта', 'Долгота', 'Дата', 'Начало работы'];

  // Составляем карту: название -> колонка
  const headerMap = {};
  sheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap[cell.value] = colNumber;
  });

  const points = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // пропускаем заголовок

    const driverName = row.getCell(headerMap[requiredCols[0]]).value;
    const lat = parseFloat(row.getCell(headerMap[requiredCols[1]]).value);
    const long = parseFloat(row.getCell(headerMap[requiredCols[2]]).value);
    const dateCell = row.getCell(headerMap[requiredCols[3]]).value;
    const startTime = row.getCell(headerMap[requiredCols[4]]).value;

    let date;
    if (typeof dateCell === 'object' && dateCell instanceof Date) {
      dateCell.setUTCHours(0, 0, 0, 0);
      date = localizationDate(new Date(dateCell.getTime()));
    } else if (typeof dateCell === 'number') {
      const excelEpoch = new Date(0); // Начало Unix-эпохи (01.01.1970)
      excelEpoch.setFullYear(1899, 11, 30); // 30.12.1899
      excelEpoch.setDate(excelEpoch.getDate() + Math.floor(dateCell));

      //коррекция после високосного дня
      if (dateCell >= 61) excelEpoch.setDate(excelEpoch.getDate());

      date = localizationDate(excelEpoch);
    } else {
      date = dateCell;
    }

    points.push({ driverName, lat, long, date, startTime });
  });

  return points;
};

export default parseExcel;
