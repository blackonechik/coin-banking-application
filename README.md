# Coin - банковское приложение

## Общее описание

Приложение представляет собой систему управления счетами пользователя, переводов средств и валютных обменов. Оно предоставляет функционал для авторизации, просмотра списка счетов, просмотра информации о существующей карте, перевода средств, просмотра истории баланса, мониторинга курса валют и отображения точек банкоматов на карте.


## Основные технологии

* JavaScript
* Webpack
* Jest
* Cypress
* Sass
* GSAP
* Navigo

## Скрипты

Для запуска проекта доступны следующие скрипты:

* `npm run lint` - запуск линтера для проверки кода на соответствие стандартам кодирования
* `npm run lint:report` - запуск линтера с генерацией отчета о проверке кода
* `npm run build` - сборка проекта в режиме production
* `npm run dev` - запуск проекта в режиме разработки с автоматической перезагрузкой страницы при изменении кода
* `npm run cypress` - запуск тестов Cypress

## Зависимости

В проекте используются следующие зависимости:

* `@cubejs-client/core` - клиентская библиотека для работы с Cube.js
* `chart.js` - библиотека для создания диаграмм и графиков
* `gsap` - библиотека для создания анимаций
* `js-cookie` - библиотека для работы с куки
* `moment` - библиотека для работы с датами и временем
* `navigo` - библиотека для работы с маршрутизацией на клиенте
* `nprogress` - библиотека для отображения прогресс-бара при загрузке страницы
* `redom` - библиотека для работы с DOM
* `simple-notify` - библиотека для отображения уведомлений

Кроме того, в проекте используются различные зависимости для работы с Webpack, Babel, ESLint, Jest, Cypress, CSS и Sass. Подробнее о них можно узнать в файле `package.json`.

## Функционал приложения

### Форма входа пользователя

На экране входа пользователь вводит логин и пароль, после чего авторизуется в системе. При вводе логина и пароля происходит валидация на заполненность полей и длину не менее 6 символов без пробелов. Регистрация пользователей через портал не предусмотрена.

### Список счетов пользователя

После авторизации пользователь попадает на страницу со списком своих счетов. Здесь отображаются все счета, которыми владеет пользователь, с указанием баланса в рублях. Предусмотрена возможность создания нового счета и сортировки счетов по признакам: «Создать новый счет», «Открыть», «Номер счета», «Баланс», «Время последней транзакции».

### Просмотр информации о существующей карте и форма перевода средств

На этой странице пользователь может посмотреть информацию о своей карте и совершить перевод средств. Форма переводов содержит поле для ввода счета получателя (с автодополнением из localStorage), поле для ввода суммы перевода и кнопку отправки перевода. Предусмотрена валидация на заполненность полей и ввод положительной суммы. После успешной отправки перевода счет получателя сохраняется в localStorage для дальнейшего использования.

Также на этой странице отображается график истории баланса и список прошлых транзакций. График истории баланса выводит bar chart истории значений баланса данного счета за последние 6 месяцев. Список прошлых транзакций выводит таблицу из 10 (или менее) записей последних транзакций с участием текущего просматриваемого счета. Отрицательные суммы (исходящие переводы) выделяются красным цветом, положительные суммы (входящие переводы) - зеленым цветом.

### Подробный просмотр истории баланса

На этой странице пользователь может посмотреть подробную историю баланса своего счета. График динамики баланса выводит bar chart истории значений баланса данного счета за последние 12 месяцев. Также на этой странице отображается график «Соотношение входящих и исходящих транзакций» и таблица истории переводов. График «Соотношение входящих и исходящих транзакций» выводит раскрашенные частями полоски, красная часть полоски отражает процент расходных (негативных) транзакций в этом столбике, зеленая часть полоски - процент доходных (положительных) транзакций в этом столбике. Таблица истории переводов выводит 25 (или менее) записей последних транзакций с участием текущего просматриваемого счета. Если в истории переводов больше записей, чем 25, тогда вводится механизм постраничного отображения.

### Валютные инструменты

Здесь пользователи могут получить информацию о состоянии своих валютных счетов, быть в курсе последних колебаний курса и обменять одну валюту на другую. Список всех известных валют получается из API. При переводе из одной валюты в другую бэкенд может выдать ошибки о недостатке средств валюты списания, эта ошибка обрабатывается. Предусмотрена валидация на запрет перевода отрицательной суммы.

### Карта банкоматов

В этом разделе выводится карта с точками, где располагаются банкоматы, где может обслуживать наш банк. Для составления карт используется [API Яндекс карт](https://yandex.ru/maps-api/).

### Запуск тестов ([Cypress](https://www.cypress.io/))

1. Запустите Cypress с помощью команды:
`npm run cypress`
2. Нажать в открытом окне **E2E Testing** и затем выбрать подходящий браузер.
3. В открывшемся браузере нажать на интерисующий вас тест.
