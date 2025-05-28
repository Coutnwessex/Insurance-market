// Конфигурация
const CONFIG = {
  SHEET_ID: 'YOUR_SHEET_ID',
  SHEET_NAME: 'Заявки',
  COLUMNS: {
    TIMESTAMP: 'A',
    LAST_NAME: 'B',
    FIRST_NAME: 'C',
    MIDDLE_NAME: 'D',
    BIRTH_DATE: 'E',
    IIN: 'F',
    PHONE: 'G',
    EMAIL: 'H',
    GENDER: 'I',
    MARITAL_STATUS: 'J',
    ADDRESS: 'K',
    REGISTRATION_ADDRESS: 'L',
    TARIFF: 'M',
    MEDICAL_INFO: 'N',
    STATUS: 'O'
  }
};

// Обработчик POST-запросов
function doPost(e) {
  try {
    // Получаем данные из запроса
    const data = JSON.parse(e.postData.contents);
    
    // Получаем лист
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    
    // Генерируем ID заявки
    const applicationId = generateApplicationId();
    
    // Подготавливаем данные для записи
    const rowData = [
      new Date().toISOString(), // Timestamp
      data.lastName,
      data.firstName,
      data.middleName,
      data.birthDate,
      data.iin,
      data.phone,
      data.email,
      data.gender,
      data.maritalStatus,
      data.address,
      data.registrationAddress,
      data.tariff,
      JSON.stringify(data.medicalInfo),
      'Новая' // Статус
    ];
    
    // Записываем данные
    sheet.appendRow(rowData);
    
    // Отправляем уведомление на email
    sendEmailNotification(data, applicationId);
    
    // Возвращаем успешный ответ
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      applicationId: applicationId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Логируем ошибку
    console.error('Error:', error);
    
    // Возвращаем ошибку
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Генерация ID заявки
function generateApplicationId() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `HEALTH-${timestamp}-${random}`;
}

// Отправка уведомления на email
function sendEmailNotification(data, applicationId) {
  const recipient = Session.getActiveUser().getEmail();
  const subject = `Новая заявка на страхование здоровья - ${applicationId}`;
  
  const body = `
    Новая заявка на страхование здоровья:
    
    ID заявки: ${applicationId}
    ФИО: ${data.lastName} ${data.firstName} ${data.middleName}
    Дата рождения: ${data.birthDate}
    ИИН: ${data.iin}
    Телефон: ${data.phone}
    Email: ${data.email}
    Тариф: ${data.tariff}
    
    Подробная информация доступна в таблице.
  `;
  
  MailApp.sendEmail(recipient, subject, body);
}

// Создание меню в таблице
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Заявки')
    .addItem('Обновить статус', 'updateStatus')
    .addItem('Отправить уведомление', 'sendCustomNotification')
    .addToUi();
}

// Обновление статуса заявки
function updateStatus() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  
  if (range.getColumn() === getColumnNumber(CONFIG.COLUMNS.STATUS)) {
    const statuses = ['Новая', 'В обработке', 'Одобрена', 'Отклонена'];
    const response = ui.showDialog('Выберите новый статус', 'Статус', statuses);
    
    if (response.getSelectedButton() === ui.Button.OK) {
      range.setValue(response.getResponseText());
    }
  }
}

// Отправка пользовательского уведомления
function sendCustomNotification() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  
  if (range.getColumn() === getColumnNumber(CONFIG.COLUMNS.EMAIL)) {
    const email = range.getValue();
    const message = ui.showPrompt('Введите сообщение для клиента').getResponseText();
    
    if (message) {
      MailApp.sendEmail(email, 'Обновление по вашей заявке', message);
      ui.showAlert('Уведомление отправлено');
    }
  }
}

// Вспомогательная функция для получения номера колонки
function getColumnNumber(columnLetter) {
  return columnLetter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
} 