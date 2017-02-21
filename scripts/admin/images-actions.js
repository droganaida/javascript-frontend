
//================================================================//
//*********** images-actions.js ***********//
//*********** © Aida Drogan - #BlondieCode
//*********** Работа с изображениями
//*********** Запись файла в глобальную переменную globalArticleMainImageFileNameToUpload
//*********** Предпросмотр изображения
//*********** Удаление изображения
//================================================================//

//====================== Переменные ===========================//

var globalArticleMainImageFileNameToUpload = null;


//====================== Предпросмотр изображения ===========================//

function uploadMainArticleImg(file){

    //------- передаем файл в глобальную переменную
    globalArticleMainImageFileNameToUpload = file;

    //------- если файл есть, передаем его в FileReader
    if (file != undefined){
        if (!file.type.match('image.*')) {
            showError('File type should be an image', 'popup');
            return;
        }

        var reader = new FileReader();
        reader.onload = (function(file){

            return function(e){

                //------- после того, как FileReader распознал файл отображаем его в элементе .imgarticle
                if ($('.logo-holder.imgarticle img').length){

                    $('.logo-holder.imgarticle img').fadeOut('fast', function(){
                        $('.logo-holder.imgarticle').append('<img src="' + e.target.result + '">');
                        $(this).remove();
                    });
                } else {
                    $('.logo-holder.imgarticle').append('<img src="' + e.target.result + '">');
                }
            };
        })(file);
        reader.readAsDataURL(file);
    }
}


$(document).ready(function(){

    //------- клик по кнопке выбора изображения (инициируем клик по скрытому инпуту)
    $('body').on('click', '#main-article-img', function(){
        $('#imgarticle').click();
    });

    //------- выбор изображение при помощи инпута с типом "файл"
    $('body').on('change', '#imgarticle', function(f){

        var files = f.target.files;
        var file = files[0];

        uploadMainArticleImg(file);

    });

    //====================== Удаление изображения ===========================//

    $('#del-main-img').on('click', function(){

        //------- проверяем, есть ли что удалять (изображение в виджете и это не noimage)
        if ($('.logo-holder img').length && ($('.logo-holder img').attr('src').indexOf('noimage') == -1)){

            $('.logo-holder img').fadeOut('fast', function(){

                globalArticleMainImageFileNameToUpload = null;
                //------- добавляем класс на кнопку edit-article, отмечаем, что старое изображение нужно удалить
                $('#edit-article').addClass('todelete');
                $(this).remove();
            });

            $('.logo-holder').append('<img src="../images/noimage-slide.jpg" alt="noimage" />');
        }
    });
});