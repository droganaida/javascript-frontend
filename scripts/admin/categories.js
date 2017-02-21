
//================================================================//
//*********** categories.js ***********//
//*********** © Aida Drogan - #BlondieCode
//*********** Логика работы с категориями
//*********** Создание новой категории
//*********** Сортировка категорий drag-n-drop (ui-sortable)
//*********** Удаление категории
//*********** Редактирование категории
//================================================================//

$(document).ready(function(){

    //================================================================//
    //*********** Создание новой категории ***********//
    //================================================================//

    $('#b-new-category').on('click', function(){

        //------------ pop-up форма для ввода данных

        $('body').append('<div class="popup-holder dynamic">' +
            '<div class="popup-content" style="height: 300px; width: 600px; margin-left: -300px; margin-top: -150px;">' +
            '<div class="popup-header">Создать новую категорию</div>' +
            '<div class="full">' +
            '<label for="title">Заголовок категории</label>' +
            '<input type="text" id="title">' +
            '<label for="alias">URL (без домена и /)</label>' +
            '<input type="text" id="alias">' +
            '</div>' +
            '<div class="clear centered">' +
            '<div class="button green" id="save-category">Сохранить</div>' +
            '<div class="button grey p-cancel">Отмена</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

        $('.popup-holder.dynamic').fadeIn();

    });

    //------------ клик по кнопке Сохранить на pop-up форме

    $('body').on('click', '#save-category', function(){

        var button = $(this);

        if (!button.hasClass('working')){

            button.addClass('working');

            //------------ данные для ajax-запроса
            var data = {};
            data.title = $('#title').val(); // заголовок категории
            data.alias = $('#alias').val(); // алиас (url страницы)
            data.pos = $('#sortable li').length; // позиция в слайдере

            if (data.title.length == 0){
                showError('Пожалуйста введите заголовок категории!', 'popup');
                button.removeClass('working');
            } else if (data.alias.length == 0){
                showError('Пожалуйста введите роут!', 'popup');
                button.removeClass('working');
            } else {

                //------------ ajax-запрос на сохранение категории

                //------------ по завершении ajax-запроса
                //------------ result - ответ от сервера (сохраненная категория)

                var result = '<li class="ui-state-default ui-sortable-handle">' +
                                '<div class="text">' +
                                    '<span class="title">' + data.title + '</span>' +
                                    '<span class="small">0 статьи</span>' +
                                '</div>' +
                                '<div class="buttons">' +
                                    '<a href="articles.html" class="article">Статьи</a>' +
                                    '<a href="editcategory.html" class="edit">Редактор</a>' +
                                '</div>' +
                            '</li>';

                button.removeClass('working');
                $('.popup-holder.dynamic').fadeOut('fast', function(){
                    $(this).remove();
                });
                $('#sortable').append(result);
            }
        }
    });

    //================================================================//
    //*********** Сортировка категорий ***********//
    //================================================================//

    function sortItems(){
        $('.ui-sortable-handle').each( function(){

            //------------ данные для ajax-запроса
            var data = {};
            data.pos = $(this).prevAll().length; // позиция в слайдере

            //------------ ajax-запрос на смену позиции категории (сортировка)
        })
    }

    if ($('#sortable').length){

        //------------ объявляем ui-sortable

        $('#sortable').sortable({
            deactivate: function(event, ui){
                sortItems();
            },
            placeholder: "ui-state-highlight"
        });

        //------------ отключаем выделение текста
        $('#sortable').disableSelection();
    }


    //================================================================//
    //*********** Удаление категории ***********//
    //================================================================//

    $('#delete-category').on('click', function(){

        $('body').append('<div class="popup-holder dynamic">' +
            '<div class="popup-content" style="height: 200px; width: 600px; margin-left: -300px; margin-top: -100px;">' +
            '<div class="popup-header">Удаление категории</div>' +
            '<div class="full">Вы действительно хотите удалить категорию ' + $('#title').val() +'?' +
            '</div>' +
            '<div class="clear centered">' +
            '<div class="button green" id="yes-delete-category">Удалить</div>' +
            '<div class="button grey p-cancel">Отмена</div>' +
            '</div>' +
            '</div>' +
            '</div>'
        );

        $('.popup-holder.dynamic').fadeIn();

    });

    $('body').on('click', '#yes-delete-category', function(){

        var button = $(this);

        if (!button.hasClass('working')){

            button.addClass('working');

        //------------ ajax-запрос на удаление категории

        }
    });


    //================================================================//
    //*********** Редактирование категории ***********//
    //================================================================//

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

    $('#edit-category').on('click', function(){

        var button = $(this);

        if (!button.hasClass('working')){

            button.addClass('working');

            //------------ данные для ajax-запроса
            var data = {};
            data.title = $('#title').val();
            data.shortdescription = $('#shortdescription').val();
            data.htmltitle = $('#htmltitle').val();
            data.htmldescription = $('#htmldescription').val();
            data.htmlkeywords = $('#htmlkeywords').val();
            data.alias = $('#alias').val();
            data.menutitle = $('#menutitle').val();
            data.moderator = $('#moderator').text();

            var ismain = 'false';
            if ($('.ismain').hasClass('active')){
                ismain = 'true';
            }

            data.ismain = ismain;
            data.mediadescription = mediaElement.saveDescription();

            $('.loader').fadeIn('fast');

            //------------ ajax-запрос на сохраение категории

            console.log('Данные для сохранения: ' + JSON.stringify(data));

            //------------ по завершении ajax-запроса
            // $('.loader').fadeOut('fast')
            // button.removeClass('working')
        }
    });
});
