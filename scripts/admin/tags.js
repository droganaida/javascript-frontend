
//================================================================//
//*********** tags.js ***********//
//*********** © Aida Drogan - #BlondieCode
//*********** Виджет с автоподстановкой и заполнением тегов
//================================================================//

//======================= ПАРАМЕТРЫ =====================//
// iInput - элемент для ввода тега
// iContainer - панель для вывода результатов подстановки
// iContainerClass - класс панели для вывода результатов подстановки (String)
// iTagHolder - контейнер для выгрузки выбранных тегов
// iItemClass - класс элемента с тегом в контейнере
// iRoute - роут для ajax-запроса к серверу (совпадение тегов для постановки)

function tagMeBabe(iInput, iContainer, iContainerClass, iTagHolder, iItemClass, iRoute){

    //------------ функция добавления тега в контейнер
    function appendTag(tag){

        var toAppend = true;
        iInput.val('');

        iTagHolder.find('.' + iItemClass).each(function(){

            //------------ проверяем теги на дубли
            if ($(this).text() == tag){
                $(this).addClass('double');
                toAppend = false;
            } else {
                $(this).removeClass('double');
            }
        });

        if (toAppend) {
            iTagHolder.prepend('<div class="' + iItemClass + '">' + tag + '</div>');
        }

    }

    function checkTag(input){

        if (input.val().length > 1){

            //------------ данные для ajax-запроса
            var data = {};
            data.key = input.val();

            //------------ ajax-запрос для выборки из базы на подстановку
            //------------ result - массив тегов (ответ от сервера)

            var result = ['кот', 'любовь', 'няшка'];

            //------------ по завершении ajax-запроса парсим массив в контейнер подстановки
            iContainer.children().remove();
            for (var i=0; i<result.length; i++){
                iContainer.append('<span>' + result[i] + '</span>')
            }
            if (iContainer.children().length > 0){
                iContainer.slideDown(200);
            } else {
                iContainer.slideUp(10);
            }
        }
    }

    iInput.on('focus', function(){
        checkTag($(this));
    });

    iInput.on('keyup', function(e){

        var tag = $(this).val();
        var input = $(this);

        //------------ навигация по панели подстановки
        if (e.keyCode == 40) {

            if (iContainer.find('.active').length > 0){
                iContainer.find('.active').removeClass('active').next().addClass('active');
            } else {
                iContainer.find('span:first').addClass('active');
            }

            input.val(iContainer.find('.active').text());

        } else if (e.keyCode == 38) {

            if (iContainer.find('.active').length > 0){
                iContainer.find('.active').removeClass('active').prev().addClass('active');
            } else {
                iContainer.find('span:last').addClass('active');
            }

            input.val(iContainer.find('.active').text());

        } else if (e.keyCode == 13){

            appendTag(tag);
            iContainer.slideUp(10);

        } else {

            checkTag(input);
        }
    });

    //------------ удаляем тег из контейнера по клику
    iTagHolder.on('click', '.' + iItemClass, function(){
        $(this).fadeOut(100, function(){
            $(this).remove();
        });
    });

    //------------ переносим тег в контейнер из панели подстановки
    iContainer.on('click', 'span', function(){
        appendTag($(this).text());
        iContainer.slideUp(10);
    });

    //------------ закрываем панель подстановки по клику в любое место документа
    $(document).mousedown(function(e){

        if (!$(e.target).is('span') && (!$(e.target).parent().hasClass(iContainerClass))){
            iContainer.slideUp(10, function(){
                iContainer.children().remove();
            });
        }
    });
}