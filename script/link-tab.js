$(function(){
    // 탭 클릭 이벤트
    $('#target_box h3 > a').on('click', function(e){
        e.preventDefault();
        // 모든 obj 숨김
        $('#target_box .obj').hide();
        // 클릭한 h3의 다음 .obj만 표시
        var $nextObj = $(this).parent().next('.obj');
        if($nextObj.length){
            $nextObj.show();
            // 탭 활성화 클래스 처리
            $('#target_box h3 > a').removeClass('ov');
            $(this).addClass('ov');
        }
    });
});
