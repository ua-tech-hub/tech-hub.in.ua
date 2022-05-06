---
title: Знакомьтесь, <details>
description: Здравствуйте. Пишу эту статью как инструкцию по использованию своего чат-бота — Анимешница Фокси и для портфолио
date: 2019-11-26
tags:
- HTML
layout: layouts/post.njk

---
Я хочу рассказать о замечательном элементе `<details>` и показать несколько примеров его использования, от простых до
безумных.

  <cut />

Вам знаком паттерн верстки компонента, который может менять своё состояние с видимого на скрытый:

  ```css
  .component {
  display: none;
}

.component.open {
  display: block;
}
  ```

  ```javascript
  toggleButton.onclick = () => component.classList.toggle('open')
  ```

А теперь забудьте. Существует элемент, который может делать это из коробки. Знакомьтесь — **`<details>`**

    >  HTML-элемент `<details>` используется для раскрытия скрытой (дополнительной) информации.

      ### Базовое применение
      Прежде всего давайте посмотрим как этот элемент работает:
      <oembed> https://codepen.io/cawa-93/pen/JjjQKVj </oembed>

      Обратите внимание, что пример работает без каких либо дополнительных стилей или JavaScript. Вся функциональность встроена в сам браузер.

      По умолчанию видимый текст зависит от настроек языка вашей системы, но его можно изменить добавив в `<details>` элемент `<summary>`:

        <oembed>https://codepen.io/cawa-93/pen/pooXbXx?editors=1000</oembed>

        Чтобы изменить состояние элемента в html вам достаточно добавить атрибут `open`
        ```xml
        <!-- Содержимое по-умолчанию видимо -->
        <details open> ... </details>

        <!-- Содержимое по-умолчанию скрыто -->
        <details> ... </details>
        ```

        А чтобы управлять состоянием средствами JavaScript предусмотрен специальный API:

        ```javascript
        const details = document.querySelector('details')

        details.open = true  // Отобразить содержимое
        details.open = false // Скрыть содержимое
        ```

        ### Пара слов о доступности
        Элемент `<summary>` фокусируемый. То есть передвигаясь по странице с клавиатуры вы попадёте на этот элемент. А вот содержимое может попасть в фокус только если `<details>` открыт, то есть фокус никогда не попадет на невидимые элементы внутри `<details>`.

          Как правило, программы чтения с экрана хорошо справляются со стандартным использованием `<details>` и `<summary>`. Существуют некоторые вариации в объявлении в зависимости от программы и браузера. [*Подробнее*](https://www.scottohara.me/blog/2018/09/03/details-and-summary.html).

            ### Примеры использования
            Далее я примерно повторю некоторые компоненты из документации bootstrap, но практически без JavaScript.

            #### Изменяем маркер
            Первое что вам может понадобится — изменить внешний вид маркера. Делается это очень просто:
            ```css
            summary::-webkit-details-marker {
            /* Любые стили */
            }
            ```

            Или вы можете скрыть стандартный маркер и реализовать собственный
            ```css
            /* Убираем стандартный маркер Chrome */
            details summary::-webkit-details-marker {
            display: none
            }
            /* Убираем стандартный маркер Firefox */
            details > summary {
            list-style: none;
            }

            /* Добавляем собственный маркер для закрытого состояния */
            details summary:before {
            content: '\f0fe';
            font-family: "Font Awesome 5 free";
            margin-right: 7px;
            }

            /* Добавляем собственный маркер для открытого состояния */
            details[open] summary:before {
            content: '\f146';
            }


            ```
            <oembed>https://codepen.io/cawa-93/pen/pooXEyq?editors=0100</oembed>


            #### Collapse Component
            Здесь всё просто. Базовый функционал такой же. Нужно лишь немного изменить внешний вид:
            <oembed>https://codepen.io/cawa-93/pen/KKKjgWJ?editors=1000</oembed>


            #### Accordion Component
            Повторим предыдущий пример, немного изменим внешний вид `<summary>` и получим аккордеон:
              <oembed>https://codepen.io/cawa-93/pen/vYYqXeJ?editors=1000</oembed>

              Но, как видите, один элемент не закрывается когда открывается другой. Чтобы добиться этого нам понадобится пара строк JavaScript. `<details>` поддерживает событие `toggle`. Используя это, можно очень легко отслеживать открытие одного элемента и по этому событию закрывать остальные:

                <oembed> https://codepen.io/cawa-93/pen/NWWZRBo?editors=0010 </oembed>


                #### Popover Component
                Эта реализация очень похожа на Collapse Component, с той разницей что содержимое `<details>` имеет абсолютное позиционирование и перекрывает контент.

                  <oembed>https://codepen.io/cawa-93/pen/ZEEdBpp?editors=1000</oembed>



                  #### Dropdown Component
                  В своей основе это тот же Popover Component. Отличается лишь внешний вид.

                  <oembed>https://codepen.io/cawa-93/pen/JjjQRgJ?editors=1000</oembed>

                  Тот же пример, только с отдельной кнопкой

                  <oembed>https://codepen.io/cawa-93/pen/GRRbNJY?editors=1000</oembed>

                  Но у Dropdown Component есть ещё одно важное отличие: по клику за его пределами он должен скрываться. Чтобы реализовать это снова понадобится написать пару строк JavaScript.

                  ```javascript
                  // По клику на тело документа
                  document.body.onclick = () => {
                  // Найти все открытые <details>
                    document.body.querySelectorAll('details.dropdown[open]')
                    // И закрыть каждый из них
                    .forEach(e => e.open = false)
                    }
                    ```



                    #### Modal Component
                    И напоследок пример модального окна.
                    <oembed>https://codepen.io/cawa-93/pen/MWWMbBm</oembed>

                    Вообще `<details>` не лучший выбор для реализации этого компонента. Существует куда более подходящий элемент — `<dialog>`, но у него весьма плохая поддержка браузерами.

                    ### Ссылки
                    [Can I Use Details & Summary elements](https://caniuse.com/#feat=details)
                    [MDN details element](https://developer.mozilla.org/ru/docs/Web/HTML/Element/details)
                    [W3C details element](https://www.w3.org/TR/html51/semantics.html#the-details-element)

                    **UPD.**
                    Решил добавить ещё один пример использования `<details>` — многоуровневая навигация. Ещё раз хочу обратить ваше внимание на то, что пример работает без какого либо JavaScript. И он намного более инклюзивный чем традиционная верстка на `<div>`.

                      <oembed>https://codepen.io/cawa-93/pen/QWWXPEx?editors=1100</oembed>
