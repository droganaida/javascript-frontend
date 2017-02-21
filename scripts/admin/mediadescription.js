//*********************************************************************************************//
//======================== MEDIADESCRIPTION PLUGIN V 1.0 /02-2017/ ============================//
//================================== © #BLONDIECODE © =========================================//
//================================== © Aida Drogan © ==========================================//
//*********************************************************************************************//

//======================= ОПЦИИ =====================//
// insidedescription - type:STRING - текущее описание статьи из БД (HTML)

//======================= Функции =====================//
// destroyPluginEvent - очистить плагин (при повторном вызове без перезагрузки страницы)
// saveDescription - экспорт контекста в формате HTML (String)

(function($){

    $.fn.makemediadescription = function(options){

        var container = $(this);

        var insidedescription = options.insidedescription;

        container.append(
            '<div id="article-descr" contenteditable="true" class="article-description">' +
            insidedescription +
            '</div>');

        var id = new Date();
        id = id.getTime();

        $('body').append('<div class="md-menu-panel" id="' + id + '">' +
            '<div class="mitem adescr-reset"></div>' +
            '<div class="mitem adescr-bold"></div>' +
            '<div class="mitem adescr-italic"></div>' +
            '<div class="mitem adescr-h2">H2</div>' +
            '<div class="mitem adescr-h3">H3</div>' +
            '<div class="mitem bitem adescr-h4">H4</div>' +
            '<div class="mitem adescr-centered"></div>' +
            '<div class="mitem adescr-strong"></div>' +
            '<div class="mitem adescr-addlink"></div>' +
            '<div class="link-holder"><span class="open-link"></span><input class="href-val" type="text"></div>' +
            '</div>');

        var popupmenu = $('#' + id);

        var contentHolder = container.find('#article-descr');


//============================ TEXT HIGHLIGHTER ===============================//

        $.textHighlighter.createWrapper = function() {
            return $('<span class="temp"></span>');
        };
        contentHolder.textHighlighter();

        // ---- а еще можно определить так =)
        // contentHolder.textHighlighter({highlightedClass: 'temp', color: 'none'});

//============================ ФУНКЦИОНАЛЬНОЕ МЕНЮ ===============================//

        function parseMenu(show){

            if (popupmenu.find('.link-holder:visible').length){
                popupmenu.find('.link-holder').hide();
                popupmenu.find('.mitem').show();
            }

            if (container.find('.temp').length && (show == 'first')){

                var top = (container.find('.temp').offset().top) - 46;
                var left =container.find('.temp').offset().left;

                popupmenu.css({top: top, left: left}).fadeIn('fast');

            } else if ($('.md-menu-panel:visible').length && (show == 'change')) {

                if (container.find('.temp').length ){

                    var top = container.find('.temp').offset().top - 46;
                    var left =container.find('.temp').offset().left;

                    popupmenu.css({top: top, left: left});

                } else {
                    popupmenu.fadeOut('fast');
                }

            } else {
                popupmenu.fadeOut('fast');
            }
        }

        $(document).on( 'scroll', function(){
            parseMenu('change');
        });

        contentHolder.on( 'scroll', function(){
            parseMenu('change');
        });

        container.on('mouseup', function(){
            parseMenu('first');
        });

        popupmenu.on('click', '.mitem', function(){
            if (!$(this).hasClass('adescr-addlink')){
                parseMenu('hide');
            }
        });

//============================ KEYPRESS ===============================//

        container.on('keydown', function(e){
            handleDeleteActions(e, $(this));
        });

        container.on('keypress', function(e){
            handleDeleteActions(e, $(this));
        });

        function handleDeleteActions(e, obj){

            //=================== Обработка кнопок backspace и delete ==================//

            if ((e.keyCode == 8) || (e.keyCode == 46)){

                if (obj.find('.temp').length > 0){

                    e.preventDefault();

                    obj.find('.temp').first().before('<span id="cursorpos"></span>');

                    var node = document.getElementById('cursorpos');
                    var range = document.createRange();
                    range.setStartAfter(node);
                    range.collapse(true);
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);

                    obj.find('.temp').remove();
                    obj.find('#cursorpos').remove();

                    $('p:empty').remove();
                    $('span:empty').remove();
                    $('h2:empty').remove();
                    $('h3:empty').remove();
                    $('h4:empty').remove();
                    $('a:empty').remove();
                }
            }
        }

        //====================== КНОПКИ МЕНЮ ===========================//

        //-------- по клику на контейнер сбрасываем выделение

        container.on('mousedown', '#article-descr', function(){

            container.find('.temp').each(function(){
                $(this).contents().unwrap();
            })

        });

        //-------- функция вставки элемента на место выделения

        function wrapSelection(type, cclass){

            var str = '';
            var counter = 0;
            var length = container.find('.temp').length;

            container.find('.temp').each(function(){

                counter++;
                str = str + $(this).text();

                if ((type == 'a') && ($(this).parent().is('a'))){
                    $(this).unwrap();
                }

                if (counter == length){

                    if (cclass != ''){

                        if (type == 'span'){

                            var span = $(this).after('<' + type + ' class="' + cclass + '">' + str + '</' + type + '>');
                            span.parent().addClass(cclass).text(span.text());
                            span.remove();

                        } else if (type == 'a'){

                            var href;

                            if (popupmenu.find('.open-link').hasClass('active')){
                                href = $(this).after('<' + type + '  href="' + cclass + '" target="_blank">' + str + '</' + type + '>');
                            } else {
                                href = $(this).after('<' + type + '  href="' + cclass + '" rel="nofollow" target="_blank">' + str + '</' + type + '>');
                            }

                            if (href.parent().is('a')){
                                href.unwrap();
                            }
                        }

                    } else {

                        var h = $(this).after('<' + type + '>' + str + '</' + type + '>');
                        if (h.parent().attr('id') != contentHolder.attr('id')){
                            h.unwrap();
                        }
                    }
                }
                $(this).remove();
            })
        }

        popupmenu.on('click', '.adescr-bold', function(){
            wrapSelection('b', '');
        });

        popupmenu.on('click', '.adescr-italic', function(){
            wrapSelection('i', '');
        });

        popupmenu.on('click', '.adescr-h2', function(){
            wrapSelection('h2', '');
        });

        popupmenu.on('click', '.adescr-h3', function(){
            wrapSelection('h3', '');
        });

        popupmenu.on('click', '.adescr-h4', function(){
            wrapSelection('h4', '');
        });

        popupmenu.on('click', '.adescr-strong', function(){
            wrapSelection('strong', '');
        });

        popupmenu.on('click', '.adescr-centered', function(){
            wrapSelection('span', 'a-centered');
        });

        popupmenu.on('click', '.adescr-reset', function(){

            container.find('.temp').each(function () {
                if ($(this).parent().attr('id') != contentHolder.attr('id')){
                    $(this).unwrap();
                }
            });

        });

        //========================= Добавить ссылку ========================//

        popupmenu.on('click', '.adescr-addlink', function(){
            $(this).siblings().fadeOut('fast');
            $(this).fadeOut('fast', function(){
                $(this).next().fadeIn('fast');
                $('.href-val').focus();
            });
        });

        popupmenu.on('keyup', '.href-val', function(e){

            if (e.keyCode == 13){

                if ($(this).val() != ''){
                    var link = $(this).val();
                    wrapSelection('a', link);
                }

                $(this).val('');
                $(this).parent().fadeOut('fast', function(){
                    popupmenu.find('.mitem').fadeIn('fast');
                    popupmenu.find('.open-link').removeClass('active');
                });
            }
        });

        popupmenu.on('click', '.open-link', function(){
            $(this).toggleClass('active');
            popupmenu.find('.href-val').focus();
        });


        //====================== Сохранить описание внутри плагина ===========================//
        function saveDescription(){

            contentHolder.find('br').each(function(){
                if (($(this).parent().is('div'))&& ($(this).parent().attr('id')) != contentHolder.attr('id')){
                    $(this).unwrap();
                }
            });

            contentHolder.find('.temp').each(function(){
                $(this).contents().unwrap();
            });

            contentHolder.find('div').each(function(){
                if ($(this).text().length == 0){
                    $(this).remove();
                } else {
                    $(this).before('<br>');
                    $(this).contents().unwrap();
                }
            });

            contentHolder.find('h2:empty').remove();
            contentHolder.find('h3:empty').remove();
            contentHolder.find('h4:empty').remove();
            contentHolder.find('a:empty').remove();

            var html = contentHolder.html().replace(/&nbsp;/g, '');
            return html;
        }

        //====================== Экспортные функции ===========================//

        return {
            destroyPluginEvent: function(){
                container.children().die();
                popupmenu.children.die();
            },
            saveDescription: function(){
                return saveDescription();
            }
        };

        return container;
    };

})(jQuery);