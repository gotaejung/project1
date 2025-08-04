$(document).ready(function() {
    // 슬라이드 탭 기능
    $('.slide_content h3 a').on('click', function(e) {
        e.preventDefault();
        
        // 모든 탭에서 'on' 클래스 제거
        $('.slide_content h3 a').removeClass('on');
        
        // 클릭된 탭에 'on' 클래스 추가
        $(this).addClass('on');
        
        // 모든 슬라이드 숨기기
        $('.hotissue_banner').hide();
        
        // 클릭된 탭의 href 값에 해당하는 슬라이드 보이기
        var targetSlide = $(this).attr('href');
        $(targetSlide).show();
    });
    
    // 초기 상태 설정 (첫 번째 탭 활성화)
    $('.slide_content h3 a').first().addClass('on');
    $('.hotissue_banner').hide();
    $('#slide1').show();
});