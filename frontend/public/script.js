const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const spinner = document.getElementById('spinner');
const resultsDiv = document.getElementById('results');

uploadBtn.onclick = async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert('Выберите файл!');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  spinner.style.display = 'block';
  resultsDiv.innerHTML = '';

  try {
    const res = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    let html = '<table><tr><th>Сотрудник</th><th>Дистанция (м)</th></tr>';
    for (const [driver, info] of Object.entries(data)) {
      html += `<tr><td>${driver}</td><td>${info.totalDistanceMeters.toFixed(2)}</td></tr>`;
    }
    html += '</table>';

    resultsDiv.innerHTML = html;

  } catch (err) {
    console.error(err);
    alert('Ошибка при загрузке или обработке файла.');
  } finally {
    spinner.style.display = 'none';
  }
};

