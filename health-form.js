document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('healthInsuranceForm');
    const phoneInput = document.getElementById('phone');

    // Маска для телефона
    phoneInput.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        e.target.value = !x[2] ? x[1] : '+7 (' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
    });

    // Валидация ИИН
    const iinInput = document.getElementById('iin');
    iinInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 12) {
            value = value.slice(0, 12);
        }
        e.target.value = value;
    });

    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Создаем объект с данными формы
        const formData = {
            // Личные данные
            lastName: form.lastName.value,
            firstName: form.firstName.value,
            middleName: form.middleName.value,
            birthDate: form.birthDate.value,
            iin: form.iin.value,
            phone: form.phone.value,
            email: form.email.value,
            gender: form.gender.value,
            maritalStatus: form.maritalStatus.value,

            // Адрес
            address: form.address.value,
            registrationAddress: form.registrationAddress.value,

            // Медицинская информация
            medicalInfo: {
                chronicDiseases: form.chronicDiseases.value,
                surgeries: form.surgeries.value,
                medications: form.medications.value,
                allergies: form.allergies.value,
                smoking: form.smoking.value,
                alcohol: form.alcohol.value,
                injuries: form.injuries.value,
                disability: form.disability.value,
                cancer: form.cancer.value,
                heartDisease: form.heartDisease.value,
                endocrineDisease: form.endocrineDisease.value,
                nervousDisease: form.nervousDisease.value,
                respiratoryDisease: form.respiratoryDisease.value,
                digestiveDisease: form.digestiveDisease.value,
                musculoskeletalDisease: form.musculoskeletalDisease.value,
                genitourinaryDisease: form.genitourinaryDisease.value,
                eyeDisease: form.eyeDisease.value,
                hearingDisease: form.hearingDisease.value,
                mentalDisease: form.mentalDisease.value,
                hereditaryDisease: form.hereditaryDisease.value,
                infectiousDisease: form.infectiousDisease.value,
                bloodDisease: form.bloodDisease.value,
                immuneDisease: form.immuneDisease.value,
                skinDisease: form.skinDisease.value,
                boneDisease: form.boneDisease.value
            },

            // Тариф
            tariff: form.tariff.value,

            // Метаданные
            timestamp: new Date().toISOString(),
            source: 'health-insurance-form'
        };

        try {
            // Отправка данных в Google Sheets через API
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Ошибка при отправке данных');
            }

            const result = await response.json();
            
            // Показываем сообщение об успехе
            showSuccessMessage('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
            
            // Очищаем форму
            form.reset();
            
            // Перенаправляем на страницу подтверждения
            setTimeout(() => {
                window.location.href = `/confirmation.html?applicationId=${result.applicationId}`;
            }, 2000);

        } catch (error) {
            console.error('Ошибка:', error);
            showErrorMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.');
        }
    });

    // Функция для показа сообщения об успехе
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        const formContainer = document.querySelector('.form-container');
        formContainer.insertBefore(successDiv, form);

        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Функция для показа сообщения об ошибке
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const formContainer = document.querySelector('.form-container');
        formContainer.insertBefore(errorDiv, form);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Анимация появления элементов формы
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми группами формы
    document.querySelectorAll('.form-group').forEach(group => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
        observer.observe(group);
    });
}); 