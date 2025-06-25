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

    const { drivers, errors } = await res.json();

    let html = '';

    drivers.forEach(driver => {
      html += `
        <div class="accordion-item">
          <button class="accordion-header">
            ${driver.driverName} — ${driver.totalDistance.toFixed(2)} км
          </button>
          <div class="accordion-body">
            <table>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Дистанция (км)</th>
                </tr>
              </thead>
              <tbody>
                ${driver.routes.map(route => `
                  <tr>
                    <td>${route.date}</td>
                    <td>${route.distance.toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr class="total-row">
                  <td><strong>Итого</strong></td>
                  <td><strong>${driver.totalDistance.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    });

    if (errors && errors.length) {
      html += `
        <div class="errors">
          <h3>Ошибки</h3>
          <ul>
            ${errors.map(err => `
              <li>
                ${err['Имя водителя']} — ${err['Дата поездки']}: ${err['Ошибка']}
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    resultsDiv.innerHTML = html;

    // Аккордеон
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        header.classList.toggle('active');
        const body = header.nextElementSibling;
        body.style.display = body.style.display === 'block' ? 'none' : 'block';
      });
    });

  } catch (err) {
    console.error(err);
    alert('Ошибка при загрузке или обработке файла.');
  } finally {
    spinner.style.display = 'none';
  }
};


