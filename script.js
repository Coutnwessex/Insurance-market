document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('courierForm');
    const formMessage = document.getElementById('formMessage');

    // ЗАМЕНИТЕ ЭТОТ URL НА URL ВАШЕГО GOOGLE APPS SCRIPT ПОСЛЕ ЕГО СОЗДАНИЯ
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'; // <-- ЗАМЕНИТЬ!

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Предотвращаем стандартную отправку формы

            formMessage.textContent = ''; // Очищаем предыдущие сообщения
            formMessage.style.color = '';

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Добавляем временную метку для Google Sheets
            data['timestamp'] = new Date().toLocaleString();

            // Показываем индикатор загрузки (можно улучшить)
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Важно для обхода CORS при прямых запросах к Apps Script без JSONP
                cache: 'no-cache',
                headers: {
                    // 'Content-Type': 'application/json', // no-cors не позволяет application/json, Apps Script будет парсить как form data
                },
                body: formData // Отправляем как FormData, Apps Script это поймет
            })
            .then(response => {
                // При mode: 'no-cors', мы не можем прочитать ответ от сервера.
                // Поэтому мы просто предполагаем, что все прошло успешно, если нет сетевой ошибки.
                // Реальную обработку ошибок лучше делать внутри Apps Script и отправлять, например, email уведомления.
                formMessage.textContent = 'Заявка успешно отправлена! Мы скоро с вами свяжемся.';
                formMessage.style.color = 'green';
                form.reset(); // Очищаем форму
            })
            .catch(error => {
                console.error('Ошибка при отправке формы:', error);
                formMessage.textContent = 'Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз позже или свяжитесь с нами напрямую.';
                formMessage.style.color = 'red';
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
    }

    // Плавный скролл для якорных ссылок (опционально, для улучшения UX)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Простой аккордеон для FAQ (опционально)
    const faqItems = document.querySelectorAll('#faq .faq-item h3');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
                // Можно добавить логику для скрытия других открытых ответов, если нужно
            }
        });
        // Скрываем ответы по умолчанию
        if (item.nextElementSibling) {
             item.nextElementSibling.style.display = 'none';
        }
    });
}); 