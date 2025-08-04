
(function($) {
    'use strict';

    window.element = {};

    var $window = element.$window = $(window),
        $document = element.$document = $(document),
        $html = element.$html = $('html'),
        $screen = $.screen,
        $isArray = $.isArray;

    //screen
    $document.on('ready.layout', function(event) {
        $screen({
            state : [{
                name : 'wide',
                horizontal : {
                    from : 9999,
                    to : 1300
                }
            }, {
                name : 'web',
                horizontal : {
                    from : 1280,
                    to : 1001
                }
            }, {
                name : 'tablet',
                horizontal : {
                    from : 1000,
                    to : 641
                }
            }, {
                name : 'phone',
                horizontal : {
                    from : 640,
                    to : 0
                }
            }]
        });
    });

    $(function() {

        var $header = element.$header = $('#header'),
            $container = element.$container = $('#container'),
            $footer = element.$footer = $('#footer');

        //헤더
        $window.scroll(function(){
            if($(this).scrollTop() > 0){
                $html.addClass('fixed');
            } else {
                $html.removeClass('fixed');
            }
        });

        //패밀리사이트
        var $family = $header.find('.family'),
            $familyOpen = $header.find('.family_open'),
            $familyhide = $header.find('.family_hide');

        $familyOpen.on('click', function(event) {
            $family.addClass('active');
            $html.addClass('dimded').removeClass('lnb_show lnb_open');
        });
        $familyhide.on('click', function(event) {
            $family.removeClass('active');
            $html.removeClass('dimded');
        });

        //언어
        var $language = $header.find('.language');

        $language.on('click', function(event) {
            var $this = $(this);
            $this.toggleClass('active');
            $this.find('.language_panel').stop(false, true).slideToggle('250', 'easeOutExpo');
        });

        //검색
        var $search = $header.find('.search'),
            $searchOpen = $search.find('.search_open'),
            $searchClose = $search.find('.search_close');

        $searchOpen.on('click', function(event) {
            $search.toggleClass('active');
        });
        $searchClose.on('click', function(event) {
            $search.removeClass('active');
        });

        //공유
        var $share = $container.find('.share'),
            $shareOpen = $share.find('.addons_button'),
            $shareClose = $share.find('.share_close'),
            url = document.url;

        $shareOpen.on('click', function(event) {
            $share.addClass('active');
        });
        $shareClose.on('click', function(event) {
            $share.removeClass('active');
        });

        //클립보드복사
        var $urlCopy = $container.find('#url_copy');

        $urlCopy.on('click', function(event) {
            $('#url_copy div').remove();
            var html = "<div><label for='clip_target'>복사된 URL</label><input id='clip_target' type='text' value='' /></div>";
            $(this).append(html);

            var input_clip = document.getElementById("clip_target");
            var _url = $(location).attr('href');
            $("#clip_target").val(_url);

            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                var editable = input_clip.contentEditable;
                var readOnly = input_clip.readOnly;

                input_clip.contentEditable = true;
                input_clip.readOnly = false;

                var range = document.createRange();
                range.selectNodeContents(input_clip);

                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                input_clip.setSelectionRange(0, 999999);

                input_clip.contentEditable = editable;
                input_clip.readOnly = readOnly;
            } else {
                input_clip.select();
            }
            try {
                var successful = document.execCommand('copy');
                input_clip.blur();
                if (successful) {
                    alert("URL이 복사 되었습니다. 원하시는 곳에 붙여넣기 해 주세요.");
                } else {
                    alert('이 브라우저는 지원하지 않습니다.');
                }
            } catch (err) {
                alert('이 브라우저는 지원하지 않습니다.');
            }
        });

        //배너모음
        var $banner = $footer.find('.banner'),
            $bannerList = $banner.find('.banner_list'),
            $bannerPrev = $banner.find('.banner_prev'),
            $bannerAuto = $banner.find('.banner_auto'),
            $bannerNext = $banner.find('.banner_next');

        $bannerList.slick({
            infinite: true,
            rows: 6,
            slidesToScroll: 1,
            autoplay: true,
            playText : '재생',
            pauseText : '정지',
            autoArrow : $bannerAuto,
            prevArrow : $bannerPrev,
            nextArrow : $bannerNext,
            vertical: true,
            responsive: [
                {
                    breakpoint: 1401,
                    settings:{
                        rows: 4
                    }
                },
                {
                    breakpoint: 901,
                    settings:{
                        rows: 3
                    }
                },
                {
                    breakpoint: 761,
                    settings:{
                        rows: 2
                    }
                }
            ]
        });

        //만족도조사 버튼
        var $satisfy = $('footer.satisfy'),
            $koglOpen = $satisfy.find('.kogl_open'),
            $managerInfo = $satisfy.find('.manager_info'),
            $koglButton = $koglOpen.find('button'),
            $explanation = $managerInfo.find('.explanation');

        $koglButton.on('click', function () {
            $explanation.toggleClass('active');
        });


        //업버튼
        var $htmlBody = $('html, body'),
            $wrapper = $('#header'),
            $upButton = $footer.find('.up_button');

        if($upButton.length){
            $upButton.on('click', function(event) {
                event.preventDefault();
                $htmlBody.animate({
                    scrollTop : 0
                }, 300);
            });

            $window.scroll(function(){
                if($window.scrollTop() > 100){
                    $upButton.addClass('show');
                }else{
                    $upButton.removeClass('show');
                }
            });
        }

    });
})(window.jQuery);

