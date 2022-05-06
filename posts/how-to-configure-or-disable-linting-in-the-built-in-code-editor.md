---
title: Как настроить или отключить линтинг во встроенном редакторе кода
description: Под катом небольшая заметка о том как можно настроить правила для линтинга во встроенном редакторе кода
WordPress.
date: 2018-10-29
layout: layouts/post.njk
tags:

- WordPress

---
од катом небольшая заметка о том как можно настроить правила для линтинга во встроенном редакторе кода WordPress.
Начиная с версии **4.9** в WordPress встроен
редактор [CodeMirror](https://codemirror.net/ "CodeMirror is a versatile text editor implemented in JavaScript for the browser. It is specialized for editing code, and comes with a number of language modes and addons that implement more advanced editing functionality.")
. Он поддерживает подстветку синтаксиса для более 100 языков, а также имеет встроенный анализатор кода. Итак, для
изменения параметров нам поможет
фильтр **[wp\_code\_editor_settings](https://developer.wordpress.org/reference/hooks/wp_code_editor_settings/)** Первым
параметром он принимает массив опций для редактора кода. В нем нас интересует лишь несколько
свойств. [Подробности см. в документации](https://developer.wordpress.org/reference/hooks/wp_code_editor_settings/).

```php

add_filter( 'wp_code_editor_settings', 'change_code_editor_settings');
function change_code_editor_settings( $settings ) {

/**
* Массив параметров передаваемых в codemirror
* @see https://codemirror.net/doc/manual.html#config
*/
$settings['codemirror']


/**
* Массив параметров для CSSLint
* @see https://github.com/CSSLint/csslint/wiki
*/
$settings['csslint']


/**
* Массив параметров для JSHint
* @see https://jshint.com/docs/options
*/

$settings['jshint']


/**
* Массив параметров для HTMLHint
* @see https://github.com/htmlhint/HTMLHint/wiki/Rules
*/
$settings['htmlhint']


return $settings;
}

```

### Примеры

**Отключим проверку CSSLint оставив при этом подсветку синтаксиса**. (Может быть полезно если вы используете в теме css
переменные. [#720](https://github.com/CSSLint/csslint/issues/720))

```php

add_filter( 'wp_code_editor_settings', 'disable_csslint' );
function disable_csslint( $settings ){

if ($settings['codemirror']['mode'] === 'css') {
$settings['codemirror']['lint'] = false;
}

return $settings;
}

```

**Зарегистрируем глобальную переменную.**

```php

add_filter( 'wp_code_editor_settings', 'change_code_editor_settings');
function change_code_editor_settings( $settings ) {
$settings['jshint']['globals']['axios'] = false // Глобальная переменная существует
$settings['jshint']['globals']['user_rates'] = true // Глобальная переменная существует и доступна для записи


return $settings;
}

```

**Запретим использовать антибуты без значений**

```php

add_filter( 'wp_code_editor_settings', 'change_code_editor_settings');
function change_code_editor_settings( $settings ) {
$settings['htmlhint']['attr-value-not-empty'] = true

return $settings;
}

```

