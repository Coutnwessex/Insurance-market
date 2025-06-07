document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('freedomHealthForm');
    const phoneInput = document.getElementById('phone');
    const iinInput = document.getElementById('iin');

    // Маска для телефона
    phoneInput.addEventListener('input', function(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        e.target.value = !x[2] ? x[1] : '+7 (' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '');
    });

    // Валидация ИИН
    iinInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 12) {
            value = value.slice(0, 12);
        }
        e.target.value = value;
    });

    // Обработка чекбоксов заболеваний
    document.querySelectorAll('.disease-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const textarea = this.closest('.disease-item').querySelector('textarea');
            if (this.checked) {
                textarea.style.display = 'block';
                textarea.required = true;
            } else {
                textarea.style.display = 'none';
                textarea.required = false;
                textarea.value = '';
            }
        });
    });

    // Обработка радио-кнопок
    document.querySelectorAll('.question-group input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const textarea = this.closest('.question-group').querySelector('textarea');
            if (this.value === 'yes') {
                textarea.style.display = 'block';
                textarea.required = true;
            } else {
                textarea.style.display = 'none';
                textarea.required = false;
                textarea.value = '';
            }
        });
    });

    // Обработка показа/скрытия полей иностранного налогового резидентства
    const foreignTaxRadios = document.querySelectorAll('input[name="foreignTaxResidency"]');
    const foreignTaxDetails = document.getElementById('foreignTaxDetails');

    foreignTaxRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                foreignTaxDetails.classList.remove('hidden');
                foreignTaxDetails.querySelectorAll('input').forEach(input => {
                    input.required = true;
                });
            } else {
                foreignTaxDetails.classList.add('hidden');
                foreignTaxDetails.querySelectorAll('input').forEach(input => {
                    input.required = false;
                    input.value = '';
                });
            }
        });
    });

    // Обработчики для чекбоксов статуса клиента
    const clientStatusRadios = form.querySelectorAll('input[name="clientStatus"]');
    const previousContractDetails = document.getElementById('previousContractDetails');
    const insurerPreviousContractDetails = document.getElementById('insurerPreviousContractDetails');

    // Проверяем, что элементы найдены
    console.log('Радио кнопки:', clientStatusRadios);
    console.log('Блок с деталями договора:', previousContractDetails);

    // Функция обработки изменения статуса клиента
    function handleClientStatusChange(event) {
        console.log('Изменение статуса клиента:', event.target.value);
        if (event.target.value === 'existing') {
            previousContractDetails.classList.remove('hidden');
            previousContractDetails.style.display = 'block';
        } else {
            previousContractDetails.classList.add('hidden');
            previousContractDetails.style.display = 'none';
            const previousContractInput = form.querySelector('#previousContract');
            if (previousContractInput) {
                previousContractInput.value = '';
            }
        }
    }

    // Добавляем обработчик для каждой радиокнопки статуса клиента
    clientStatusRadios.forEach(radio => {
        radio.addEventListener('change', handleClientStatusChange);
    });

    // Проверяем начальное состояние
    const selectedRadio = form.querySelector('input[name="clientStatus"]:checked');
    if (selectedRadio) {
        handleClientStatusChange({ target: selectedRadio });
    }

    // Функция копирования данных из первого раздела во второй
    function copyInsuredDataToInsurer() {
        console.log('Начинаем копирование данных...');
        
        const fieldsMapping = [
            ['fullName', 'insurerFullName'],
            ['permanentAddress', 'insurerPermanentAddress'],
            ['homePhone', 'insurerHomePhone'],
            ['workPhone', 'insurerWorkPhone'],
            ['mobilePhone', 'insurerMobilePhone'],
            ['birthDate', 'insurerBirthDate'],
            ['birthPlace', 'insurerBirthPlace'],
            ['gender', 'insurerGender'],
            ['maritalStatus', 'insurerMaritalStatus'],
            ['email', 'insurerEmail'],
            ['profession', 'insurerProfession'],
            ['workplace', 'insurerWorkplace'],
            ['jobDescription', 'insurerJobDescription'],
            ['economySector', 'insurerEconomySector'],
            ['citizenship', 'insurerCitizenship'],
            ['iin', 'insurerIin'],
            ['documentNumber', 'insurerDocumentNumber'],
            ['documentIssuer', 'insurerDocumentIssuer'],
            ['documentValidity', 'insurerDocumentValidity']
        ];

        // Копируем значения полей
        fieldsMapping.forEach(([fromId, toId]) => {
            const fromElement = document.getElementById(fromId);
            const toElement = document.getElementById(toId);
            
            if (fromElement && toElement) {
                console.log(`Копирование ${fromId} -> ${toId}`);
                
                if (fromElement.tagName === 'SELECT') {
                    // Для select-элементов нужно установить selectedIndex
                    console.log('Копирование select-элемента');
                    toElement.selectedIndex = fromElement.selectedIndex;
                } else {
                    toElement.value = fromElement.value;
                }
                
                // Вызываем событие change для обработки зависимых полей
                toElement.dispatchEvent(new Event('change'));
                console.log('Значение скопировано:', fromElement.value);
            } else {
                console.log('Элемент не найден:', !fromElement ? fromId : toId);
            }
        });

        // Копируем радио-кнопки
        const radioGroups = [
            ['residencyStatus', 'insurerResidencyStatus'],
            ['clientStatus', 'insurerClientStatus'],
            ['foreignTaxResidency', 'insurerForeignTaxResidency']
        ];

        radioGroups.forEach(([fromName, toName]) => {
            console.log(`Копирование радио-группы ${fromName} -> ${toName}`);
            const selectedRadio = form.querySelector(`input[name="${fromName}"]:checked`);
            
            if (selectedRadio) {
                const targetRadio = form.querySelector(`input[name="${toName}"][value="${selectedRadio.value}"]`);
                if (targetRadio) {
                    targetRadio.checked = true;
                    // Вызываем событие change для обработки зависимых полей
                    const event = new Event('change');
                    targetRadio.dispatchEvent(event);
                    console.log(`Установлено значение ${selectedRadio.value} для ${toName}`);
                }
            }
        });

        // Обработка зависимых элементов после копирования
        const insurerDetails = document.getElementById('insurerDetails');
        if (insurerDetails) {
            // Показываем все поля страхователя
            insurerDetails.style.display = 'block';
        }
    }

    // Функция очистки данных страхователя
    function clearInsurerData() {
        console.log('Очистка данных страхователя...');
        const insurerDetails = document.getElementById('insurerDetails');
        const inputs = insurerDetails.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            if (input.type === 'radio') {
                if (input.value === 'new' || input.value === 'no') {
                    input.checked = true;
                } else {
                    input.checked = false;
                }
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
            // Вызываем событие change для обработки зависимых полей
            input.dispatchEvent(new Event('change'));
        });

        // Скрываем зависимые поля
        insurerPreviousContractDetails.classList.add('hidden');
        insurerPreviousContractDetails.style.display = 'none';
        document.getElementById('insurerForeignTaxDetails').classList.add('hidden');
    }

    // Обработчик изменения статуса "Страхователь является Застрахованным лицом"
    const isInsuredPersonRadios = form.querySelectorAll('input[name="isInsuredPerson"]');
    console.log('Найдены радио-кнопки isInsuredPerson:', isInsuredPersonRadios);

    isInsuredPersonRadios.forEach(radio => {
        radio.addEventListener('change', function(event) {
            console.log('Изменение статуса страхователя:', this.value);
            if (this.value === 'yes') {
                copyInsuredDataToInsurer();
            } else {
                clearInsurerData();
            }
        });
    });

    // Обработчик для показа/скрытия поля предыдущего договора страхователя
    const insurerClientStatusRadios = form.querySelectorAll('input[name="insurerClientStatus"]');
    insurerClientStatusRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'existing') {
                insurerPreviousContractDetails.classList.remove('hidden');
                insurerPreviousContractDetails.style.display = 'block';
            } else {
                insurerPreviousContractDetails.classList.add('hidden');
                insurerPreviousContractDetails.style.display = 'none';
                const previousContractInput = form.querySelector('#insurerPreviousContract');
                if (previousContractInput) {
                    previousContractInput.value = '';
                }
            }
        });
    });

    // Обработчик для показа/скрытия полей иностранного налогового резидентства страхователя
    const insurerForeignTaxRadios = form.querySelectorAll('input[name="insurerForeignTaxResidency"]');
    const insurerForeignTaxDetails = document.getElementById('insurerForeignTaxDetails');
    
    insurerForeignTaxRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                insurerForeignTaxDetails.classList.remove('hidden');
                insurerForeignTaxDetails.style.display = 'block';
            } else {
                insurerForeignTaxDetails.classList.add('hidden');
                insurerForeignTaxDetails.style.display = 'none';
            }
        });
    });

    // Анимация появления элементов формы
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.form-group').forEach(group => {
        observer.observe(group);
    });

    // Валидация формы перед отправкой
    function validateForm() {
        let isValid = true;
        let errorMessages = [];

        // Проверка обязательных полей
        form.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                errorMessages.push(`Поле "${field.previousElementSibling.textContent.replace(':', '')}" обязательно для заполнения`);
            }
        });

        // Проверка ИИН
        if (iinInput.value.length !== 12) {
            isValid = false;
            errorMessages.push('ИИН должен содержать 12 цифр');
        }

        // Проверка возраста
        const birthDate = new Date(form.birthDate.value);
        const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < 18) {
            isValid = false;
            errorMessages.push('Вам должно быть не менее 18 лет');
        }

        return { isValid, errorMessages };
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

    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Валидация формы
        const { isValid, errorMessages } = validateForm();
        if (!isValid) {
            errorMessages.forEach(message => showErrorMessage(message));
            return;
        }

        // Сбор данных формы
        const formData = {
            // Личные данные
            personalInfo: {
                lastName: form.lastName.value,
                firstName: form.firstName.value,
                middleName: form.middleName.value,
                birthDate: form.birthDate.value,
                iin: form.iin.value,
                documentType: form.documentType.value,
                documentNumber: form.documentNumber.value,
                documentIssueDate: form.documentIssueDate.value,
                documentIssuer: form.documentIssuer.value
            },
            // Контактная информация
            contactInfo: {
                phone: form.phone.value,
                email: form.email.value,
                address: form.address.value
            },
            // Медицинская информация
            medicalInfo: {
                diseases: Array.from(form.querySelectorAll('.disease-item input[type="checkbox"]:checked')).map(checkbox => ({
                    type: checkbox.value,
                    details: checkbox.closest('.disease-item').querySelector('textarea').value
                })),
                trauma: {
                    had: form.hadTrauma.value,
                    details: form.trauma_details.value
                },
                hospitalization: {
                    had: form.hadHospitalization.value,
                    details: form.hospitalization_details.value
                }
            },
            // Дополнительная информация
            additionalInfo: {
                height: form.height.value,
                weight: form.weight.value,
                smoking: form.smoking.value
            },
            // Метаданные
            metadata: {
                timestamp: new Date().toISOString(),
                source: 'freedom-health-form'
            },
            clientStatus: {
                status: form.clientStatus.value,
                previousContract: form.previousContract?.value || null
            }
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
            showSuccessMessage('Ваша анкета успешно отправлена! Мы свяжемся с вами в ближайшее время.');
            
            // Очищаем форму
            form.reset();
            
            // Перенаправляем на страницу подтверждения
            setTimeout(() => {
                window.location.href = `/confirmation.html?applicationId=${result.applicationId}`;
            }, 2000);

        } catch (error) {
            console.error('Ошибка:', error);
            showErrorMessage('Произошла ошибка при отправке анкеты. Пожалуйста, попробуйте позже.');
        }
    });
}); 