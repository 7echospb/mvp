# Архитектура операционного центра

## 1. Архитектурный подход

Для MVP используется модульный монолит.

Причины выбора:

- короткий срок разработки;
- простое локальное развёртывание;
- единая транзакционная база;
- отсутствие необходимости поддерживать микросервисы;
- возможность позднее выделить интеграции и обработку видео в отдельные сервисы.

Приложение разделено на независимые доменные модули, но разворачивается как единая система.

## 2. Предлагаемый стек

### Backend

- Python 3.12;
- Django;
- Django REST Framework;
- Django Admin для первичного управления справочниками;
- Celery для фоновых заданий;
- Redis как брокер фоновых заданий и краткосрочный кэш.

Django выбран для быстрого создания:

- модели данных;
- авторизации;
- разграничения доступа;
- административного интерфейса;
- миграций;
- REST API.

### Frontend

- React;
- TypeScript;
- Vite;
- React Router;
- TanStack Query;
- компонентная UI-библиотека;
- адаптивный интерфейс для компьютера и телефона.

Для MVP создаётся веб-приложение без отдельного мобильного клиента.

### База данных

- PostgreSQL.

PostgreSQL хранит:

- объекты;
- устройства;
- заявки;
- правила SLA;
- комментарии;
- историю действий;
- метаданные файлов;
- результаты интеграций.

### Файлы

Для MVP:

- локальное файловое хранилище на сервере;
- отдельные каталоги для схем, снимков и вложений;
- в базе хранятся метаданные и ссылки на файлы.

Для следующего этапа:

- локальный S3-совместимый MinIO;
- политики хранения;
- контроль целостности;
- версионирование документов.

### Работа с RTSP

- FFmpeg на сервере;
- получение одиночного JPEG-кадра;
- ограничение времени подключения;
- выполнение операции в фоновой задаче;
- сохранение результата в файловом хранилище.

Браузер не подключается к RTSP напрямую.

### Развёртывание

- Linux-сервер во внутренней инфраструктуре;
- Docker Compose;
- Nginx;
- backend;
- frontend;
- PostgreSQL;
- Redis;
- Celery worker;
- Celery scheduler;
- файловое хранилище.

Доступ к закрытой сети камер предоставляется только серверным компонентам, которым он необходим.

## 3. Общая схема

Пользовательский браузер взаимодействует только с веб-приложением.

Веб-приложение взаимодействует с:

- PostgreSQL;
- файловым хранилищем;
- Redis;
- фоновыми обработчиками;
- ManageEngine ServiceDesk Plus;
- RTSP-устройствами;
- Zabbix;
- Statserver;
- Netris;
- городским порталом плановых работ.

Внешние интеграции изолируются адаптерами. Доменная логика не должна зависеть от формата конкретной внешней системы.

## 4. Основные сущности

### User

Пользователь системы.

Поля:

- id;
- username;
- full_name;
- email;
- role;
- department;
- is_active;
- last_login;
- created_at;
- updated_at.

### Role

Роль пользователя.

Начальные роли:

- administrator;
- coordinator;
- manager;
- engineer;
- viewer.

### Site

Физический объект или адрес.

Поля:

- id;
- normalized_address;
- source_address;
- city;
- street;
- house;
- building;
- latitude;
- longitude;
- service_types;
- intercom_company;
- access_notes;
- access_contact;
- management_company;
- district_office_address;
- status;
- created_at;
- updated_at.

### SiteAccess

Структурированная информация о доступе.

Поля:

- id;
- site_id;
- access_type;
- location;
- contact_name;
- contact_phone;
- schedule;
- instructions;
- is_active.

### Device

Оборудование.

Поля:

- id;
- external_id;
- device_type;
- model;
- vendor;
- serial_number;
- site_id;
- contract_id;
- ownership_type;
- installation_location;
- ip_address;
- mac_address;
- status;
- monitoring_status;
- last_seen_at;
- created_at;
- updated_at.

Типы устройств:

- camera;
- switch;
- intercom;
- access_controller;
- OPM;
- router;
- other.

### CameraProfile

Дополнительные поля камеры.

Поля:

- device_id;
- camera_type;
- rtsp_profile_id;
- osd;
- azimuth;
- customer_camera_id;
- reference_image_id;
- last_snapshot_id;
- expected_fps;
- actual_fps.

### NetworkProfile

Сетевые параметры устройства.

Поля:

- device_id;
- connection_type;
- vlan;
- subnet;
- gateway;
- public_ip;
- OPM_device_id;
- switch_device_id;
- switch_port;
- network_notes.

Чувствительные параметры доступа не возвращаются обычным API.

### DeviceRelation

Связь между устройствами.

Примеры:

- камера подключена к коммутатору;
- коммутатор подключён к ОПМ;
- камера заменена другой камерой;
- устройство является резервным.

Поля:

- id;
- source_device_id;
- target_device_id;
- relation_type;
- valid_from;
- valid_to.

### Contract

Контракт.

Поля:

- id;
- number;
- name;
- customer;
- starts_at;
- ends_at;
- status;
- notes.

### SlaRule

Правило SLA.

Поля:

- id;
- contract_id;
- device_type;
- device_subtype;
- priority;
- response_minutes;
- resolution_minutes;
- repeat_window_days;
- repeat_threshold;
- penalty_type;
- valid_from;
- valid_to;
- is_active.

### Ticket

Локальное представление заявки Service Desk.

Поля:

- id;
- source_system;
- external_id;
- external_url;
- title;
- description;
- source_address;
- site_id;
- device_id;
- contract_id;
- status;
- priority;
- received_at;
- due_at;
- closed_at;
- repeat_count;
- sla_state;
- penalty_risk;
- matching_state;
- source_payload;
- last_synced_at;
- created_at;
- updated_at.

### TicketMatch

Результат сопоставления заявки.

Поля:

- id;
- ticket_id;
- site_id;
- device_id;
- method;
- confidence;
- confirmed_by;
- confirmed_at.

Методы:

- external_device_id;
- exact_address;
- normalized_address;
- manual;
- import_mapping.

### Visit

Выезд инженера.

Поля:

- id;
- ticket_id;
- site_id;
- engineer_id;
- status;
- assigned_at;
- accepted_at;
- arrived_at;
- completed_at;
- result;
- created_at;
- updated_at.

### Comment

Комментарий.

Поля:

- id;
- entity_type;
- entity_id;
- author_id;
- comment_type;
- text;
- source_system;
- external_id;
- created_at.

Комментарий может относиться к:

- заявке;
- объекту;
- устройству;
- выезду;
- массовому инциденту.

### Attachment

Файл.

Поля:

- id;
- entity_type;
- entity_id;
- file_name;
- media_type;
- storage_path;
- size;
- checksum;
- uploaded_by;
- source_system;
- created_at.

### Snapshot

Снимок с камеры.

Поля:

- id;
- device_id;
- ticket_id;
- snapshot_type;
- status;
- storage_path;
- captured_at;
- error_message;
- created_by;
- created_at.

Типы снимков:

- reference;
- before_work;
- after_work;
- manual;
- monitoring.

### MonitoringEvent

Событие мониторинга.

Поля:

- id;
- source_system;
- external_id;
- device_id;
- event_type;
- severity;
- status;
- value;
- started_at;
- resolved_at;
- raw_payload.

### MassIncident

Массовая авария.

Поля:

- id;
- title;
- status;
- detected_at;
- resolved_at;
- grouping_key;
- probable_cause;
- coordinator_comment;
- created_by.

### MassIncidentTicket

Связь массовой аварии и заявки.

Поля:

- mass_incident_id;
- ticket_id;
- linked_automatically;
- confidence.

### WorkOrder

Задание инженеру.

Поля:

- id;
- ticket_id;
- engineer_id;
- status;
- message;
- sent_via;
- sent_at;
- created_by;
- created_at.

### IntegrationSync

Состояние синхронизации.

Поля:

- id;
- integration;
- entity_type;
- entity_id;
- operation;
- status;
- attempts;
- next_retry_at;
- error_message;
- created_at;
- updated_at.

### AuditEvent

Журнал действий.

Поля:

- id;
- user_id;
- action;
- entity_type;
- entity_id;
- before_data;
- after_data;
- ip_address;
- created_at.

## 5. Модули приложения

### 5.1. Authentication

Отвечает за:

- вход;
- выход;
- сессии;
- роли;
- права доступа;
- блокировку пользователей.

### 5.2. Sites

Отвечает за:

- адресный перечень;
- нормализацию адресов;
- сведения о доступе;
- контакты;
- схемы объектов;
- типы обслуживания.

### 5.3. Devices

Отвечает за:

- реестр оборудования;
- карточки устройств;
- сетевые параметры;
- связи устройств;
- эталонные изображения;
- текущий статус.

### 5.4. Contracts and SLA

Отвечает за:

- контракты;
- правила SLA;
- крайние сроки;
- повторы;
- штрафные условия;
- приоритет заявок.

### 5.5. Tickets

Отвечает за:

- локальные заявки;
- очередь координатора;
- сопоставление заявок;
- статусы;
- комментарии;
- закрытие заявок.

### 5.6. Visits and Work Orders

Отвечает за:

- задания инженерам;
- рабочие статусы;
- выезды;
- результаты;
- фото и видео;
- формирование сообщения для мессенджера.

### 5.7. Media

Отвечает за:

- схемы;
- фотографии;
- вложения;
- эталонные снимки;
- контрольные снимки;
- проверку типа и размера файлов.

### 5.8. RTSP Gateway

Отвечает за:

- получение одиночного кадра;
- тайм-аут подключения;
- ограничение параллельных запросов;
- журнал ошибок;
- сохранение результата.

RTSP Gateway не предоставляет пользователю сетевые учётные данные.

### 5.9. Monitoring

Отвечает за:

- события Zabbix;
- статусы Statserver;
- данные Netris;
- привязку событий к устройствам;
- выявление массовых проблем.

### 5.10. Analytics

Отвечает за:

- показатели дашборда;
- статистику SLA;
- повторы;
- проблемные адреса;
- проблемные устройства;
- качество справочных данных.

### 5.11. Imports

Отвечает за:

- импорт CSV/XLSX;
- предварительную проверку;
- сопоставление колонок;
- поиск дублей;
- отчёт об ошибках;
- повторяемый импорт.

### 5.12. Integrations

Содержит отдельные адаптеры:

- ManageEngineAdapter;
- ZabbixAdapter;
- StatserverAdapter;
- NetrisAdapter;
- PlannedWorksAdapter.

Каждый адаптер преобразует внешний формат во внутреннюю модель.

## 6. REST API

Базовый префикс:

`/api/v1`

### 6.1. Авторизация

- `POST /auth/login` — вход;
- `POST /auth/logout` — выход;
- `GET /auth/me` — текущий пользователь;
- `GET /users` — список пользователей;
- `POST /users` — создание пользователя;
- `PATCH /users/{id}` — изменение пользователя.

### 6.2. Объекты

- `GET /sites` — список и поиск объектов;
- `POST /sites` — создание объекта;
- `GET /sites/{id}` — карточка объекта;
- `PATCH /sites/{id}` — изменение объекта;
- `GET /sites/{id}/devices` — оборудование объекта;
- `GET /sites/{id}/tickets` — заявки объекта;
- `GET /sites/{id}/visits` — история выездов;
- `GET /sites/{id}/attachments` — схемы и файлы;
- `POST /sites/{id}/comments` — комментарий к объекту;
- `GET /sites/search?query={value}` — быстрый поиск.

### 6.3. Оборудование

- `GET /devices` — список устройств;
- `POST /devices` — создание устройства;
- `GET /devices/{id}` — карточка устройства;
- `PATCH /devices/{id}` — изменение устройства;
- `GET /devices/{id}/tickets` — история заявок;
- `GET /devices/{id}/events` — события мониторинга;
- `GET /devices/{id}/snapshots` — снимки;
- `GET /devices/{id}/relations` — связанные устройства;
- `POST /devices/{id}/comments` — комментарий;
- `POST /devices/{id}/snapshots` — запрос нового снимка;
- `GET /devices/search?query={value}` — поиск по ID, IP и модели.

### 6.4. Заявки

- `GET /tickets` — очередь заявок;
- `POST /tickets` — ручное создание;
- `GET /tickets/{id}` — карточка заявки;
- `PATCH /tickets/{id}` — изменение локальных полей;
- `POST /tickets/{id}/match` — ручная привязка;
- `DELETE /tickets/{id}/match` — снятие привязки;
- `GET /tickets/{id}/history` — история заявки;
- `POST /tickets/{id}/comments` — добавление комментария;
- `POST /tickets/{id}/attachments` — добавление файла;
- `POST /tickets/{id}/work-orders` — создание задания;
- `POST /tickets/{id}/capture-before-close` — контрольный снимок;
- `POST /tickets/{id}/close` — закрытие заявки;
- `POST /tickets/{id}/retry-sync` — повтор синхронизации;
- `POST /tickets/{id}/recalculate-sla` — пересчёт SLA.

Фильтры списка:

- status;
- contract;
- device_type;
- sla_state;
- penalty_risk;
- repeat_only;
- unassigned;
- unmatched;
- mass_incident;
- received_from;
- received_to.

### 6.5. Выезды

- `GET /visits` — список выездов;
- `POST /visits` — регистрация выезда;
- `GET /visits/{id}` — карточка выезда;
- `PATCH /visits/{id}` — изменение статуса;
- `POST /visits/{id}/comments` — комментарий;
- `POST /visits/{id}/attachments` — фото или видео;
- `POST /visits/{id}/complete` — завершение выезда.

### 6.6. Контракты и SLA

- `GET /contracts` — список контрактов;
- `POST /contracts` — создание контракта;
- `GET /contracts/{id}` — карточка контракта;
- `PATCH /contracts/{id}` — изменение контракта;
- `GET /sla-rules` — правила SLA;
- `POST /sla-rules` — создание правила;
- `PATCH /sla-rules/{id}` — изменение правила;
- `POST /sla/calculate` — предварительный расчёт SLA.

### 6.7. Массовые аварии

- `GET /mass-incidents` — список аварий;
- `POST /mass-incidents` — создание аварии;
- `GET /mass-incidents/{id}` — карточка аварии;
- `PATCH /mass-incidents/{id}` — изменение;
- `POST /mass-incidents/{id}/tickets` — добавление заявок;
- `DELETE /mass-incidents/{id}/tickets/{ticket_id}` — исключение заявки;
- `POST /mass-incidents/{id}/resolve` — закрытие аварии;
- `POST /mass-incidents/detect` — запуск группировки.

### 6.8. Аналитика

- `GET /dashboard/summary` — общие показатели;
- `GET /analytics/sla` — статистика SLA;
- `GET /analytics/repeats` — повторные заявки;
- `GET /analytics/problem-sites` — проблемные объекты;
- `GET /analytics/problem-devices` — проблемные устройства;
- `GET /analytics/contracts` — показатели по контрактам;
- `GET /analytics/data-quality` — качество справочников.

### 6.9. Импорт

- `POST /imports` — загрузка файла;
- `GET /imports/{id}` — состояние импорта;
- `GET /imports/{id}/preview` — предварительный результат;
- `POST /imports/{id}/confirm` — подтверждение;
- `GET /imports/{id}/errors` — ошибки импорта.

### 6.10. Интеграции

- `POST /integrations/manageengine/sync` — ручной запуск синхронизации;
- `GET /integrations/manageengine/status` — состояние интеграции;
- `POST /integrations/zabbix/sync` — синхронизация событий;
- `POST /integrations/statserver/sync` — синхронизация статусов;
- `GET /integrations/jobs/{id}` — состояние фоновой операции.

### 6.11. Справочники

- `GET /references/device-types`;
- `GET /references/service-types`;
- `GET /references/ticket-statuses`;
- `GET /references/ownership-types`;
- `GET /references/visit-statuses`.

## 7. Фоновые задания

Фоновые задачи:

- получение новых заявок из Service Desk;
- обновление изменённых заявок;
- отправка комментариев и вложений;
- повтор неуспешных синхронизаций;
- получение RTSP-снимков;
- пересчёт SLA;
- пересчёт повторов;
- загрузка событий Zabbix;
- обновление статусов Statserver;
- обнаружение массовых аварий;
- очистка временных файлов;
- проверка просроченных заявок.

Каждая задача должна быть идемпотентной: повторный запуск не создаёт дубли.

## 8. Интеграция с ManageEngine ServiceDesk Plus

Интеграция реализуется через адаптер.

Адаптер должен поддерживать:

- получение заявок;
- получение одной заявки;
- получение комментариев;
- получение вложений;
- добавление комментария;
- добавление вложения;
- изменение статуса;
- закрытие заявки.

Точная реализация зависит от:

- редакции ServiceDesk Plus;
- версии API;
- локального или облачного размещения;
- настроек авторизации;
- прав интеграционной учётной записи.

Внутренняя модель не должна хранить Service Desk payload как единственный источник данных. Исходный payload сохраняется только для диагностики.

Если API временно недоступен:

- локальное действие не теряется;
- создаётся запись IntegrationSync;
- операция повторяется;
- пользователь видит состояние синхронизации.

## 9. Расчёт SLA

Алгоритм:

1. Найти контракт заявки.
2. Определить тип устройства.
3. Найти активное правило SLA на время поступления заявки.
4. Рассчитать due_at.
5. Найти предыдущие заявки по устройству.
6. Ограничить их периодом repeat_window_days.
7. Рассчитать repeat_count.
8. Сравнить значение с repeat_threshold.
9. Определить sla_state и penalty_risk.
10. Рассчитать операционный приоритет.

Состояния SLA:

- normal;
- warning;
- critical;
- breached;
- unknown.

SLA пересчитывается:

- при создании заявки;
- при изменении устройства;
- при изменении контракта;
- при изменении правила;
- периодическим заданием;
- перед закрытием.

## 10. Нормализация и сопоставление данных

Приоритет сопоставления:

1. внешний ID устройства;
2. внутренний ID устройства;
3. точный нормализованный адрес и ID;
4. точный нормализованный адрес;
5. ручное сопоставление.

Автоматическая привязка по нечёткому совпадению адреса не выполняется без порога уверенности.

Для каждого сопоставления сохраняются:

- метод;
- коэффициент уверенности;
- дата;
- пользователь, подтвердивший связь.

## 11. Хранение сетевых настроек

Обычные сетевые параметры могут храниться в базе:

- IP;
- VLAN;
- подсеть;
- шлюз;
- порт;
- схема подключения.

Секреты не хранятся в открытом виде:

- пароли;
- токены;
- RTSP-учётные данные;
- API-ключи.

Для MVP секреты задаются через:

- переменные окружения;
- серверный конфигурационный файл с ограниченными правами;
- отдельные профили доступа.

В интерфейсе пользователь видит параметры, необходимые для работы, но не получает системные секреты без отдельного разрешения.

## 12. Управляющие действия с оборудованием

Перезагрузка устройства не входит в обязательное ядро MVP.

Если функция включается, она должна иметь:

- список разрешённых моделей;
- отдельное право доступа;
- подтверждение операции;
- ограничение частоты;
- проверку доступности до действия;
- журнал команды;
- проверку результата;
- запрет массовой перезагрузки.

Управляющее действие оформляется отдельной сущностью DeviceCommand.

## 13. Безопасность

Минимальные требования:

- локальная авторизация;
- ролевой доступ;
- HTTPS внутри инфраструктуры;
- журналирование изменений;
- ограничение типов файлов;
- ограничение размера загрузки;
- защита от прямого доступа к файлам;
- отсутствие паролей в API-ответах;
- тайм-ауты внешних запросов;
- ограничение параллельных RTSP-подключений;
- резервное копирование базы;
- резервное копирование файлов;
- отдельная техническая учётная запись для интеграций.

## 14. Наблюдаемость

Система должна журналировать:

- ошибки API;
- ошибки фоновых задач;
- ошибки синхронизации;
- ошибки получения RTSP-кадров;
- действия пользователей;
- время выполнения интеграций;
- количество обработанных записей.

Минимальные health endpoints:

- `GET /health/live` — приложение запущено;
- `GET /health/ready` — база и обязательные компоненты доступны;
- `GET /health/integrations` — состояние внешних интеграций.

## 15. Принятые архитектурные решения

### Модульный монолит вместо микросервисов

Микросервисы увеличат сроки разработки и эксплуатационную сложность. Выделение сервисов возможно после подтверждения продукта.

### PostgreSQL как единый источник внутренних данных

Excel, Google Таблицы и внешние системы являются источниками импорта, но не используются приложением как оперативная база.

### Адаптеры для внешних систем

ManageEngine, Statserver, Netris и Zabbix не должны влиять на внутреннюю структуру приложения.

### Асинхронные внешние операции

RTSP, синхронизация и обработка вложений выполняются в фоне, чтобы внешний сбой не блокировал интерфейс.

### Снимки вместо постоянной трансляции RTSP

Это упрощает MVP, снижает сетевую нагрузку и позволяет сохранять подтверждение результата работ.

### Ручное подтверждение неоднозначных связей

Неверная автоматическая привязка опаснее отсутствия привязки.

### История вместо перезаписи

Изменения статусов, комментариев, привязок и правил должны быть доступны для аудита.