(function() {
  var $ = window.jQuery;

  $(function() {
    // 주요뉴스 슬라이더
    var hiSlider = $('.hi_slide').bxSlider({
      auto: true,
      pause: 4000,
      speed: 500,
      controls: false,
      pager: false,
      adaptiveHeight: true,
      onSlideAfter: function($slideElement, oldIndex, newIndex) {
        updateHiPager(newIndex);
      }
    });

    // 시민참여 슬라이더
    var ciSlider = $('.ci_slide').bxSlider({
      auto: true,
      pause: 4000,
      speed: 500,
      controls: false,
      pager: false,
      adaptiveHeight: true,
      onSlideAfter: function($slideElement, oldIndex, newIndex) {
        updateCiPager(newIndex);
      }
    });

    // 페이저 업데이트 함수
    function updateHiPager(idx) {
      var total = $('.hi_slide > li').not('.bx-clone').length;
      var current = idx + 1;
      if (current > total) current = 1;
      $('.hi_pagers .index_count').text(current);
      $('.hi_pagers .total_count').text(total);
    }
    function updateCiPager(idx) {
      var total = $('.ci_slide > li').not('.bx-clone').length;
      var current = idx + 1;
      if (current > total) current = 1;
      $('.ci_pagers .index_count').text(current);
      $('.ci_pagers .total_count').text(total);
    }

    // 초기 페이저 세팅
    updateHiPager(hiSlider.getCurrentSlide());
    updateCiPager(ciSlider.getCurrentSlide());

    // 주요뉴스 슬라이드 컨트롤
    $('.btn_hi_next .bx-next').on('click', function(e) {
      e.preventDefault();
      hiSlider.goToNextSlide();
    });
    $('.btn_hi_prev .bx-prev').on('click', function(e) {
      e.preventDefault();
      hiSlider.goToPrevSlide();
    });
    $('.btn_hi_start').on('click', function(e) {
      e.preventDefault();
      hiSlider.startAuto();
    });
    $('.btn_hi_stop').on('click', function(e) {
      e.preventDefault();
      hiSlider.stopAuto();
    });

    // 시민참여 슬라이드 컨트롤
    $('.btn_ci_next .bx-next').on('click', function(e) {
      e.preventDefault();
      ciSlider.goToNextSlide();
    });
    $('.btn_ci_prev .bx-prev').on('click', function(e) {
      e.preventDefault();
      ciSlider.goToPrevSlide();
    });
    $('.btn_ci_start').on('click', function(e) {
      e.preventDefault();
      ciSlider.startAuto();
    });
    $('.btn_ci_stop').on('click', function(e) {
      e.preventDefault();
      ciSlider.stopAuto();
    });

    // 탭 전환(주요뉴스/시민참여)
    $('.slide_content1 h3 a, .slide_content2 h3 a').on('click', function(e) {
      e.preventDefault();
      $('.slide_content1 h3 a, .slide_content2 h3 a').removeClass('on');
      $(this).addClass('on');
      var target = $(this).attr('href');
      if (target === '#slide1') {
        $('.slide_content2').hide();
        $('.slide_content1').show();
        hiSlider.reloadSlider();
      } else if (target === '#slide2') {
        $('.slide_content1').hide();
        $('.slide_content2').show();
        ciSlider.reloadSlider();
      }
    });

    // 첫 화면: 주요뉴스만 보이게
    $('.slide_content2').hide();
    $('.slide_content1').show();
    $('.slide_content1 h3 a').addClass('on');
    $('.slide_content2 h3 a').removeClass('on');

    // 전체보기 버튼
    $('.btn-showAll').on('click', function() {
      $('.banner-all-wrap').show();
      $('body').addClass('banner-all-open');
    });
    $('.btn-showAll-close').on('click', function() {
      $('.banner-all-wrap').hide();
      $('body').removeClass('banner-all-open');
    });
    // 전체보기 영역 바깥 클릭 시 닫기
    $('.banner-all-wrap').on('click', function(e) {
      if ($(e.target).is('.banner-all-wrap')) {
        $('.banner-all-wrap').hide();
        $('body').removeClass('banner-all-open');
      }
    });
  });
})();

// 탭 클릭 시 슬라이드 전환
$('.slide_tabs a').on('click', function(e) {
  e.preventDefault();
  $('.slide_tabs a').removeClass('on');
  $(this).addClass('on');
  var target = $(this).attr('href');
  $('.slide_content').hide();
  if (target === '#slide1') {
    $('.slide_content1').show();
  } else if (target === '#slide2') {
    $('.slide_content2').show();
  }
});

// 페이지 로드시 초기 상태
$('.slide_content').hide();
$('.slide_content1').show();
$('.slide_tabs a').removeClass('on');
$('.slide_tabs a[href="#slide1"]').addClass('on');