---
title: Как я закрыл трехлетний issue в TypeScript
description:
date: 2020-06-21
layout: layouts/post.njk
tags:

- TypeScript

---
![](https://habrastorage.org/webt/iw/u6/24/iwu624zqqotvo05frkqgtk1wqjq.jpeg) Всё началось с моего желания описать
структуру сообщений между web worker'ами. К сожалению, на тот момент встроенные возможности TypeScript этого не
позволяли. Я засучил рукава и решил это исправить.

Суть проблемы
-------------

Попробуйте написать простой воркер и повесить на него слушателя событий. Посмотрите, какие типы выведет компилятор для
параметров функции обратного вызова:
```ts
new Worker().addEventListener('message', (message) => {
  message // MessageEvent
  message.data // any
})
```

В поле `data` находятся именно те данные, что вы, автор кода, отправляете. И именно тип этого поля хочется определять.

### Изучаем MessageEvent поближе

MessageEvent — интерфейс, описывающий сообщения при коммуникации между вкладками, воркерами, сокетами, WebRTC каналами и
т.д. В экосистеме TypeScript этот интерфейс является частью `lib.dom.ts` и `lib.webworker.d.ts`, и описан следующим
образом:
```ts
interface MessageEvent extends Event {
  readonly data: any;
  readonly lastEventId: string;
  readonly origin: string;
  readonly ports: ReadonlyArray<MessagePort>;
  readonly source: MessageEventSource | null;
}
```

Опытные разработчики сразу увидят тут проблему. Этот интерфейс
не [Generic](https://www.typescriptlang.org/docs/handbook/generics.html) — поле `data` описано строго как **any**, и мы
никак не можем на это повлиять извне. Решив поискать информацию по этому поводу в репозитории TypeScript я быстро
нашел [issue](https://github.com/microsoft/TypeScript/issues/19370) в котором описана эта проблема. И даже больше —
автор предложил решение. Но за почти **три года**, оно так и не было имплементировано. Я засучил рукава, и решил сделать
это. Всего-то и нужно что привести интерфейс MessageEvent, в файлах **lib/lib.dom.d.ts** и **lib/lib.webworker.d.ts** к
такому виду:
```ts
  interface MessageEvent<T = any> extends Event {
  readonly data: T;
  readonly lastEventId: string;
  readonly origin: string;
  readonly ports: ReadonlyArray<MessagePort>;
  readonly source: MessageEventSource | null;
}
```

Сделаем это.

Изучаем TypeScript Instructions for Contributing Code
-----------------------------------------------------

В нем есть целый раздел посвященный изменениям в файлах **lib.d.ts**. Оттуда узнаём две вещи:

1. Файлы в папке **lib/** напрямую изменять нельзя. Там находятся last-known-good версии и они периодически обновляются
   на основе соответствующих файлов из папки **src/lib/**. Вот в них то и нужно вносить правки. В нашем случае это **
   src/lib/dom.generated.d.ts** и **src/lib/webworker.generated.d.ts**
2. Практически все файлы в директории **src/lib/** можно просто отредактировать. За исключением генерируемых (**
   .generated.d.ts**). Такие файлы создаются с помощью
   утилиты [TSJS-lib-generator](https://github.com/microsoft/TSJS-lib-generator) и мы должны вносить правки именно в
   неё.

### Изучаем TSJS-lib-generator

TSJS-lib-generator — это инструмент (написанный на TS) который принимает все известные Microsoft Edge веб-интерфейсы и
преобразовывает их в набор TypeScript интерфейсов. При этом существует возможность переопределить характеристики
каких-либо интерфейсов, удалить некоторые или добавить новые. Все эти правила описываются в json формате в файлах **
addedTypes.json**, **overridingTypes.json** и **removedTypes.json**.

### Правило для изменения MessageEvent

Нам нужно **изменить существующий** интерфейс, поэтому будем редактировать **overridingTypes.json**. К сожалению, я не
нашел подробной документации о синтаксисе этих файлов, но существующих примеров было достаточно для понимания концепции.
Итак, в **overridingTypes.json** в свойстве `interfaces` добавляем новый интерфейс, пока что без каких либо свойств:
```json


{
  "interfaces": {
    "interface": {
      "MessageEvent": {}
    }
  }
}
```

Пробуем запустить сборку и проверим, что ничего не сломалось:
```bash


    npm run build
```

TSJS-lib-generator сгенерирует те самые ***.generated.d.ts** файлы. И сейчас они должны быть идентичны ***
.generated.d.ts** файлам в репозитории TS. Добавляем свойство `type-parameters`, тем самым превращая MessageEvent в
Generic:
```json


{
  "interfaces": {
    "interface": {
      "MessageEvent": {
        "type-parameters": [
          {
            "name": "T",
            "default": "any"
          }
        ]
      }
    }
  }
}
```

Запускаем сборку и проверяем результат:
```ts
interface MessageEvent<T = any> extends Event {
  readonly data: any;
  readonly lastEventId: string;
  readonly origin: string;
  readonly ports: ReadonlyArray<MessagePort>;
  readonly source: MessageEventSource | null;
}
```

Уже ближе к тому, что мы в итоге хотим получить. Добавим описание свойства `data` и сигнатуры конструктора:
```json


{
  "interfaces": {
    "interface": {
      "MessageEvent": {
        "name": "MessageEvent",
        "type-parameters": [
          {
            "name": "T",
            "default": "any"
          }
        ],
        "properties": {
          "property": {
            "data": {
              "name": "data",
              "read-only": 1,
              "override-type": "T"
            }
          }
        },
        "constructor": {
          "override-signatures": [
            "new<T>(type: string, eventInitDict?: MessageEventInit<T>): MessageEvent<T>"
          ]
        }
      }
    }
  }
}
```

И вуаля! Генерируется в точности то, что нам необходимо.
```ts
interface MessageEvent<T = any> extends Event {
  readonly data: T;
  readonly lastEventId: string;
  readonly origin: string;
  readonly ports: ReadonlyArray<MessagePort>;
  readonly source: MessageEventSource | null;
}
```

Далее дело за малым:

* Запустить тесты.
* Оформить Pull Request в соответствии со всеми правилами описанными
  в [Contribution Guidelines](https://github.com/microsoft/TSJS-lib-generator/tree/af75df4264964bac7e8acb7f359866b151ec94e4#contribution-guidelines)
  .
* И подписать [CLA](https://cla.opensource.microsoft.com/microsoft/TSJS-lib-generator?pullRequest=860) от Microsoft.

Итог
----

Спустя неделю с момента отправки [мой Pull Request](https://github.com/microsoft/TSJS-lib-generator/pull/860) был
принят. 12.06.2020 были обновлены `**src/lib/**dom.generated.d.ts` и `**src/lib/**webworker.generated.d.ts` в
репозитории TypeScript. А на момент написания статьи все правки перенесены в `**lib/**lib.dom.ts`
и `**lib/**lib.webworker.d.ts` и уже доступны
в [TypeScript Nightly](https://www.typescriptlang.org/play/index.html?ts=Nightly#code/HYUw7gBA6g9gTgaxHAFAcjQSgHQEMAm+AogG4jAAuAMgJYDOF5y6AtiHXbgOYhoA0EFGw7cQALggBZdpx6lyFADzAAriwBGyANoBdAHyYIAXj0QA3gCgI1iMNkgrNu6Oz5cFXBYC+mIA)
.
