
//================================================================//
//*********** aliasmaker.js ***********//
//*********** © Aida Drogan - #BlondieCode
//*********** Функция для транслитерации русских заголовков в ссылки
//=========== ВЫЗОВ
//*********** Наличие у элемента-инпута id="alias"
//================================================================//

$(document).ready(function(){

    //================================================================//
    //*********** Input Focus ***********//
    //================================================================//
    $('body').on('focus', '#alias', function(){

        if ($(this).val() == ""){

            var text = $('#title').val();

            text = text.replace(/ /g, "-").toLowerCase();
            text = text.replace(/\./g, "-");
            text = text.replace(/:/g, "");
            text = text.replace(/,/g, "");
            text = text.replace(/;/g, "");

            text = text.replace(/а/g, "a");
            text = text.replace(/б/g, "b");
            text = text.replace(/в/g, "v");
            text = text.replace(/г/g, "g");
            text = text.replace(/д/g, "d");
            text = text.replace(/е/g, "e");
            text = text.replace(/ё/g, "yo");
            text = text.replace(/ж/g, "j");
            text = text.replace(/з/g, "z");
            text = text.replace(/и/g, "i");
            text = text.replace(/й/g, "i");
            text = text.replace(/к/g, "k");
            text = text.replace(/л/g, "l");
            text = text.replace(/м/g, "m");
            text = text.replace(/н/g, "n");
            text = text.replace(/о/g, "o");
            text = text.replace(/п/g, "p");
            text = text.replace(/р/g, "r");
            text = text.replace(/с/g, "s");
            text = text.replace(/т/g, "t");
            text = text.replace(/у/g, "u");
            text = text.replace(/ф/g, "f");
            text = text.replace(/х/g, "h");
            text = text.replace(/ц/g, "c");
            text = text.replace(/ч/g, "ch");
            text = text.replace(/ш/g, "sh");
            text = text.replace(/щ/g, "sch");
            text = text.replace(/ъ/g, "");
            text = text.replace(/ы/g, "y");
            text = text.replace(/ь/g, "");
            text = text.replace(/э/g, "e");
            text = text.replace(/ю/g, "yu");
            text = text.replace(/я/g, "ya");

            $(this).val(text);
        }
    });
});