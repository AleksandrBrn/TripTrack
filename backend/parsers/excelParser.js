import ExcelJS from 'exceljs';

// Локализация даты формат DD.MM.YYYY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1, потому что месяц 0-based
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

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

    let date;
    if (typeof dateCell === 'object' && dateCell instanceof Date) {
      date = formatDate(dateCell);
    } else if (typeof dateCell === 'number') {
      const excelEpoch = new Date(1899, 11, 30);
      excelEpoch.setDate(excelEpoch.getDate() + dateCell);
      date = formatDate(excelEpoch);
    } else {
      // fallback
      date = dateCell;
    }

    points.push({ driverName, lat, long, date });
  });

  return points;
};



export default parseExcel;

