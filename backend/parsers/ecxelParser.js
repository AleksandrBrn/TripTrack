import ExcelJS from 'exceljs';

const parseExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.getWorksheet('TIMINGS');

  const requiredCols = [
    'ФИО исполнителя',
    'Широта',
    'Долгота',
    'Дата',
  ];

  //Составляем карту названий колонок -> номера колонок
  const headerMap = {};
  sheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap[cell.value] = colNumber;
  });

  const points = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // пропускаем заголовки

    const driverName = row.getCell(headerMap[requiredCols[0]]).value;
    const lat = parseFloat(row.getCell(headerMap[requiredCols[1]]).value);
    const long = parseFloat(row.getCell(headerMap[requiredCols[2]]).value);
    const dateTime = row.getCell(headerMap[requiredCols[3]]).value;

    const dateObj = new Date(dateTime);
    const date = dateObj.toLocaleDateString('ru-RU');

    const point = { driverName, lat, long, date };

    points.push(point);
  });

  return points;
};

export default parseExcel;
