import ExcelJS from 'exceljs';

const parseExcel = async (filePath) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const sheet = workbook.getWorksheet('TIMINGS');

  const requiredCols = [
    'ФИО исполнителя',
    'Широта',
    'Долгота',
    'Время поступления отчета на сервер',
    'Наименование клиента/вывеска'
  ];

  //Составляем карту названий колонок -> номера колонок
  const headerMap = {};
  sheet.getRow(1).eachCell((cell, colNumber) => {
    headerMap[cell.value] = colNumber;
  });

  const drivers = {};

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // пропускаем заголовки

    const driverName = row.getCell(headerMap[requiredCols[0]]).value;
    const lat = parseFloat(row.getCell(headerMap[requiredCols[1]]).value);
    const long = parseFloat(row.getCell(headerMap[requiredCols[2]]).value);
    const dateTime = row.getCell(headerMap[requiredCols[3]]).value;
    const placeName = row.getCell(headerMap[requiredCols[4]]).value;

    const point = { driverName, lat, long, dateTime, placeName };

    if (!drivers[driverName]) drivers[driverName] = [];
    drivers[driverName].push(point);
  });

  return drivers;
};

export default parseExcel;
