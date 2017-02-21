
//================================================================//
//*********** articles.js ***********//
//*********** © Aida Drogan - #BlondieCode
//*********** Логика работы со статьями
//*********** Поиск по статьям
//*********** Создание новой стаьи
//*********** Удаление статьи
//*********** Редактирование статьи
//*********** Публикация статьи и снятие с публикации
//================================================================//

$(document).ready(function(){

    //================================================================//
    //*********** Создание статьи по запросу ***********//
    //================================================================//

    $('#search-article').on('keyup', function(e){

        if ($(this).val().length > 1){

            //------------ данные для ajax-запроса
            var data = {};
            data.key = $(this).val();

            //------------ ajax-запрос на поиск статьи

            //------------ по завершении ajax-запроса
            //------------ result - ответ от сервера (найденная статья)

            var result = '<div class="v-item flex-row" id="588b9b41e9630480121633c7">' +
                            '<div class="image">' +
                                '<img src="../files/04/mainimage-min.jpg" width="40" height="40" alt="Как Боня был маленьким">' +
                            '</div>' +
                            '<div class="title">Как Боня был маленьким</div>' +
                            '<div class="created flex-col">' +
                                '<span>Создана: Пт, 27. Янв 2017, в 21:59</span>' +
                                '<span>Обновлена: Пн, 30. Янв 2017, в 18:40</span>' +
                            '</div>' +
                            '<div class="published">' +
                                '<span class="yes">Опубликована</span>' +
                            '</div>' +
                            '<div class="buttons">' +
                                '<a href="editarticle.html" class="button green">Редактор</a>' +
                            '</div>' +
                        '</div>'

            //------------ если ничего не найдено по запросу

            var notFound = '<div class="notfound">Ой... Похоже ничего не найдено!</div>';

            $('.articles').children().remove();
            $('.articles').append(notFound);
            $('.articles').append(result);
        }
    });

    //------------------ функция для подстановки тегов tagMeBabe

    if ($('#tags').length){

        var tagInput = $('#tags'); // элемент для ввода тега
        var tagAutoFillBar = $('.autofill-bar'); // панель для вывода результатов подстановки
        var tagAutoFillClass = 'autofill-bar'; // класс панели для вывода результатов подстановки (String)
        var tagContainer = $('#article-tags'); // контейнер для выгрузки выбранных тегов
        var tagItemClass = 't-item'; // класс элемента с тегом в контейнере
        var routeToTagSearch = '/route/to/tags'; // роут для ajax-запроса к серверу (совпадение тегов для постановки)

        tagMeBabe(tagInput, tagAutoFillBar, tagAutoFillClass, tagContainer, tagItemClass, routeToTagSearch);
    }

    //------------------ подключение плагина mediadescription

    var mediaElement = null;

    if ($('.mediaelement').length){

        var insidedescription = $('.mediaelement').find('.mediacontent').html();

        mediaElement = $('.mediaelement').makemediadescription({
            insidedescription:insidedescription
        });

        //-------------- подтвердить перезагрузку окна\ уход со страницы

        window.onbeforeunload = function() {

            if (!$('#deleted').length){
                return 'Ты сохранил все изменения?';
            }
        };
    }


    //================================================================//
    //*********** Сохранение статьи ***********//
    //================================================================//

    function saveArticle(type, button){

        //--------------- button - кнопка, с которой был переход
        //--------------- type - новая статья или редактирование существующей

        if (!button.hasClass('working')){

            //--------------- проверка выбрана ли хоть одна категория
            if (($('#article-categories .active').length > 0)){

                //--------------- проверка на обязательные поля
                if ($('#title').val().length == 0){
                    showError('Введите название статьи!', 'login');
                } else if ($('#alias').val().length == 0) {
                    showError('Введите URL статьи!', 'login');
                } else {

                    button.addClass('working');

                    //------------ данные для ajax-запроса
                    var data = {};

                    //--------------- передать тип на сервер!
                    data.action = type;

                    //--------------- разобраться с загрузкой изображения!
                    console.log('Главное изображение - ' + globalArticleMainImageFileNameToUpload);

                    data.title = $('#title').val();
                    data.alias = $('#alias').val();
                    data.shortdescription = $('#shortdescription').val();
                    data.htmltitle = $('#htmltitle').val();
                    data.htmldescription = $('#htmldescription').val();
                    data.htmlkeywords = $('#htmlkeywords').val();
                    data.moderator = $('#moderator').text();

                    var catArray = [];
                    $('#article-categories .active').each(function(){
                        catArray.push($(this).text());
                    });
                    data.categories = catArray;

                    var tagArray = [];
                    $('#article-tags .t-item').each(function(){
                        tagArray.push($(this).text());
                    });
                    data.tags = tagArray;

                    data.mediadescription = mediaElement.saveDescription();

                    $('.loader').fadeIn('fast');

                    //------------ ajax-запрос на сохранение статьи

                    console.log('Данные для сохранения: ' + JSON.stringify(data));

                    //------------ по завершении ajax-запроса
                    // $('.loader').fadeOut('fast')
                    // button.removeClass('working')
                }

            } else {
                showError('Выберите хотя бы одну категорию!', 'login');
            }
        }
    }

    //================================================================//
    //*********** Редактирование статьи ***********//
    //================================================================//

    $('#edit-article').on('click', function(){

        var button = $(this);

        //----------- проверяем нужно ли удалить старое изображение
        if (button.hasClass('todelete')){

            //------------ данные для ajax-запроса на удаление файла с сервера
            var data = {};
            data.file = 'path/to/file';
        }

        saveArticle('editarticle', button);

    });

    //================================================================//
    //*********** Новая статья ***********//
    //================================================================//

    $('#new-article').on('click', function(){

        var button = $(this);
        saveArticle('newarticle', button);

    });

    //================================================================//
    //*********** Удаление статьи ***********//
    //================================================================//

    $('#delete-article').on('click', function(){

        $('body').append('<div class="popup-holder dynamic">' +
            '<div class="popup-content" style="height: 200px; width: 600px; margin-left: -300px; margin-top: -100px;">' +
            '<div class="popup-header">Удаление статьи</div>' +
            '<div class="full">Вы действительно хотите удалить статью ' + $('#title').val() +'?' +
            '</div>' +
            '<div class="clear centered">' +
            '<div class="button green" id="yes-delete-article">Удалить</div>' +
            '<div class="button grey p-cancel">Отмена</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

        $('.popup-holder.dynamic').fadeIn();

    });

    $('body').on('click', '#yes-delete-article', function(){

        var button = $(this);

        if (!button.hasClass('working')){

            button.addClass('working');
            //------------ ajax-запрос на удаление категории
        }
    });

    //================================================================//
    //*********** Публикация статьи ***********//
    //================================================================//

    $('.articles').on('click', '.published span', function(){

        var button = $(this);

        //------------ данные для ajax-запроса
        var data = {};
        var flag = 'yes';
        if (button.hasClass('yes')){
            flag = 'no';
        }
        data.flag = flag;

        //------------ ajax-запрос на публикацию статьи

        //------------ по завершении ajax-запроса

        if (flag == 'yes'){
            button.removeClass('no').addClass('yes').text('Опубликована');
            showSuccess('Статья опубликована', 'login');
        } else {
            button.removeClass('yes').addClass('no').text('Не опубликована');
            showSuccess('Статья снята с публикации', 'login');
        }
    });

});