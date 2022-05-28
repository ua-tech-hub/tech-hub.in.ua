---
title: Современная архитектура Electron приложений в 2021
date: 2021-09-16
tags:
- Electron
---
Современная архитектура Electron приложений в 2021

Современный Electron приложение состоит из трех модулей:

main;

renderer;

preload;

Каждый из этих модулей выполняется в собственном контексте и среде. Учитывая это ваш проект может быть организован как моно репозиторий, где каждый модуль — отдельный пакет со своими настройками, зависимостями, тестами и системой сборки (или вообще без нее).

main

Среда выполнения: Node.js.

Поддержка ESM: Нет.

Полный доступ к Electron API.

Это backend вашего приложения и точка входа — с этого модуля начинается запуск. Код в этом модуле это обычный JavaScript который выполняется в Node.js. Именно здесь вы должны описать когда создавать окна программы, с каким содержимым, с какими параметрами, проверять обновления, отслеживать события и выполнять завершения вашего приложения — по умолчанию Electron не делает ничего за вас.

Примечание: Хотя Node.js уже имеет поддержку ESM на момент написания этой статьи вы все еще не можете использовать ES модули в среде выполнения Electron. Так что, вам придется использовать Commonjs синтаксис, или транспилировать свой код из ESM в CJS.

Базовый код этого модуля выглядит следующим образом:

const {BrowserWindow, app} = require('electron')  // Дождаться полной инициализации Electron // Только после этого возможно создавать окна app.whenReady().then(() => {     // Создаёт новое окно браузера     const win = new BrowserWindow({         show: false // Пока-что окно не нужно показывать пользователю     })      // Загружаем в окне веб-содержимое     win.load('index.html')      // Когда веб-страница будет загружена и отрисована — показать окно пользователю     win.once('ready-to-show', win.show) })  // Завершить работу приложения  // если пользователь закрыл все окна программы app.on('window-all-closed', app.quit)

Этот код создаст новое окно браузера, в котором будет загружено file://path/to/app/index.html .

Обратите внимание, что по умолчанию веб-содержание открываться по протоколу file:, что накладывает определенные ограничения. Чтобы обойти эту проблему, зачастую, программа регистрирует собственный, произвольный протокол и загружает страницу через него.

const {protocol} = require('electron'); const path = require('path')  protocol.registerFileProtocol('my-cool-app', (request, respond) => {     let requestedResource = new URL(request.url).pathname;     respond( path.resolve('path/to/files', requestedResource) ); });  // ...  win.load('my-cool-app://index.html')

Подробнее об произвольных протоколах

renderer

Среда выполнения: Chromium.

Поддержка ESM: Да.

Нет прямого доступа к API Node.js или Electron.

Каждый раз, когда вы создаете новое окно вызывая BrowserWindow электрон порождает новый процесс Renderer с тем содержимым, которое вы передали (win.load('my-cool-app://index.html')').

Этот модуль — обычный веб-сайт. И работать с ним можно точно так же: HTML/CSS/JS.

Так же как и привычные веб-страницы этот модуль, хотя и поддерживает ESM, не имеет прямого доступа к npm пакетам или к файловой системе. А значит вам нужно включать все зависимости в свои JS бандлы с помощью таких инструментов как webpack, rollup, vite и тому подобное. И загружать каждый бандл через произвольный протокол, как было показано выше.

Кроме этого скрипты в renderer не имеют прямого доступа к Node.js API. Единственный способ взаимодействовать с системой пользователя - использовать интерфейсы описаны в модуле preload как прослойку.

preload

Среда выполнения: Chromium.

Поддержка ESM: Нет.

Полный доступ к Node.js API.

Частичный доступ к Electron API.

preload - это особые JS сценарии, которые будут выполняться перед каждой загрузкой веб-страницы.

Подключается он индивидуально для каждого окна:

new BrowserWindow({     webPreferences: {         preload: 'preload.js'     } })

Предназначен этот модуль для создания узких, контролируемых интерфейсов через которые renderer сможет взаимодействовать с Node.js API:

В preload создаете глобальный метод.

А в renderer используете его. Благодаря замыканию метод созданный в preload будет иметь доступ к Node.js даже если его вызвали в renderer.

Примечание: preload выполняется изолированно от renderer. Это означает, что globalThis в preload не тот же что в renderer. Для передачи глобальной переменной с одного контекста в другой существует специальное API: contextBridge.exposeInMainWorld(key, value).

Например:

// preload.js  const {contextBridge} = require('electron') const {readFile, writeFile} = require('fs/promises')  contextBridge.exposeInMainWorld('settingsAPI', {     getSettings: () => readFile('path/to/user-settings.json').then(JSON.parse),     saveSettings: (value) => writeFile('path/to/user-settings.json', JSON.stringify(value)), })

Вызов этого кода в контексте preload создаст глобальную переменную settingsAPI для контекста renderer:

// renderer.js  // Возвращает результат чтения с файловой системы globalThis.settingsAPI.getSettings()  // Записывает данные в файловою систему globalThis.settingsAPI.saveSettings({foo: 'bar'})

Вам может показаться хорошей идеей просто передать в renderer полный доступ к Node.js API:

const fs = require('fs/promises')  contextBridge.exposeInMainWorld('fs', fs)

Но это нарушением требований к безопасности программы, о которых я поговорю позже.

Несмотря на то, что preload имеет прямой доступ к Node.js API и к npm пакетам, он все же имеет ограниченный доступ непосредственно к Electron API. Например, вы можете таким же образом использовать crashReporter api но не можете dialog api.

В документации для всех встроенных API указано в каком процессе он может работать: Main или Renderer.

Обратите внимание, даже если в документации указано, что вы можете использовать что-то в процессе Renderer, это не значит, что вы можете вызвать это в модуле renderer, поскольку вы просто не сможете импортировать необходимое из Electron.

// renderer.js // Приведёт к ошибке, поскольку renderer не имеет доступа к require const {crashReporter} = require('electron')

Вам все еще нужно импортировать необходимые API в preload а затем передать соответствующий интерфейс к renderer:

// preload.js const {crashReporter} = require('electron')  contextBridge.exposeInMainWorld('crashReporter', {     start: () => crashReporter.start() })

// renderer.js globalThis.crashReporter.start()

А для использования всех других API необходимо отправлять в Main процесс сообщения о намерениях и вызвать соответствующие API там:

// renderer.js globalThis.dialogs.showMessageBox('Message text') // Вернёт результат выполнения из Main

// preload.js  const {contextBridge, ipcRenderer} = require('electron')  // preload не может создать диалог самостоятельно,  // поэтому отправляет соответствующую команду в Main contextBridge.exposeInMainWorld('dialogs', {     showMessageBox: (message) => ipcRenderer.invoke('dialogs', message) })

Требования к безопасности

При традиционной разработке веб-сайта мы редко задумываемся о безопасности, поскольку браузер уже позаботился об изоляции нашего кода от системы пользователя. Однако при работе с Electron у нашего кода намного больше полномочий. Поэтому, важно позаботиться, чтобы наша программа не стала дырой в системы пользователя.

Вот некоторые требования.

Создавайте минимальные интерфейсы в preload

Почему нельзя передать в renderer все методы сразу?

const fs = require('fs/promises')  contextBridge.exposeInMainWorld('fs', fs)

Дело в том, что доступ к этому api получаете не только вы, а абсолютно все содержимое окна. То есть любые посторонние скрипты, виджеты, встроенные видео плееры, фреймы, веб-сайты открытые в этом окне или в дочерних окнах, все npm пакеты включены в ваш бандл, код которых вы не контролируете — все это будет иметь полный и не контролируем доступ к файловой системе.

Представьте, браузер, который позволяет любым сайтам записывать или читать что-угодно из вашего диска.

Весь доступ к системе заблокирован по-умолчанию. В preload необходимо открывать минимально необходимые API и строго проверять все входные параметры.

Используйте песочницу когда возможно

new BrowserWindow({     webPreferences: {         sandbox: true     } })

Режим песочницы в значительной степени ограничивает ваше приложение на уровне операционной системы. Кроме того, это ограничивает те системные Node.js API которые можно использовать в preload:

events

timers

url

Используйте Content Security Policy

Как и для интернета CSP это мощный инструмент для защиты от "cross-site-scripting". Он позволяет определить из каких источников позволить загрузку и выполнение содержания.

По умолчанию вам следует запретить абсолютно все:

Запретить загружать и выполнять JS который не был включен в вашу программу.

Запретить обращаться к любым внешним источникам.

Запретить загружать любые внешние ресурсы, такие как изображения, видео, файлы и тому подобное.

И добавлять исключения позволяя доступ к строго контролируемому списку внешних ресурсов. Так вы гарантируете, что в вашем приложении не загрузится ничего лишнего.

Установить политику можно с помощью мета тега. Например:

<meta      http-equiv="Content-Security-Policy"      content="script-src 'self' https://apis.example.com" >

Разрешает выполнение только встроенных скриптов и тех, которые были загружены с домена apis.example.com по защищенному протоколу https. Все остальные скрипты будут заблокированы.

Подробнее о Content Security Policy
