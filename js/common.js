var front = {
  btnClick : function(btn, callback) {btn.off('click').on('click', function() {var nowPos = $(window).scrollTop(); callback && callback($(this), nowPos)})},
  showCallback : function(element, callback) {element.show().ready(function() {callback && callback()})},
  hideCallback : function(element, callback) {element.hide().ready(function() {callback && callback()})},
  scrollPosition : function(nowPos) {$(window).scrollTop(nowPos);},
  layerFocus : function(layer, btn) {
    btn.on('keydown', function(event) {if($(this).is(btn)) {var isShift = window.event.shiftKey ? true : false;if(!isShift && event.keyCode == 9) {layer.attr('tabindex','0').focus()}}});
    layer.on('keydown', function(event) {var isShift = window.event.shiftKey ? true : false;if(isShift && event.keyCode == 9) {if($(event.target).is(layer)) {btn.focus()}}});
  },
  allChecked : function(param1, param2) {
    var $parent_item, $children_item;
    var status, idx, children_len;
    var ui = {};
    ui.init = function() {
      status = false; idx = 0; $parent_item = param1; $children_item = param2; children_len = $children_item.length;
      ui.evt();
    };
    ui.evt = function() {
      $children_item.on('change', function() {
        if($(this).is(':checked')){$(this).prop('checked', true);idx++;}
        else if(!$(this).is(':checked')) {$(this).prop('checked', false);idx--;}
        ui.getEvt();
      });
      $parent_item.on('change', function() {if($(this).is(':checked')) {$children_item.prop('checked', true); idx = $children_item.length;} else if(!$(this).is(':checked')) {$children_item.prop('checked', false); idx = 0}});
    };
    ui.getEvt = function() {if(idx == children_len) {status = true;} else {status = false;} ui.allCheckEvt()};
    ui.allCheckEvt = function() {if(status) {$parent_item.prop('checked', true)} else {$parent_item.prop('checked', false)}};
    ui.init();
  },
  accordion : function(ul, className) {
    var selectedLi = ul.find('> li' + className), selectedLi2 = ul.find('>li > ul > li' + className);
    var btnDepth1 = ul.find('> li > a'), btnDepth2 = ul.find('> li > ul > li > a');
    var elDepth2 = ul.find('> li > ul'), elDepth3 = ul.find('> li > ul > li > ul');
    var srText = btnDepth1.find('.sr-only'), srText2 = btnDepth2.find('.sr-only');
    srText.text('열기');
    srText2.text('열기');
		$('#snb .selected.active>a').find('.sr-only').text('닫기');
		$('#snb .active>a').find('.sr-only').text('닫기');


    ul.find('> li').each(function() {
    	if($(this).find('> ul').length > 0) {
    	} else {
    		$(this).removeClass('active');
    	}
    });
    if ( selectedLi.length > 0 ) {
      selectedLi.find(srText).text('닫기');
    }
    if ( selectedLi2.length > 0 ) {
      selectedLi2.find(srText2).text('닫기');
    }
    front.btnClick(btnDepth1, function($this) {
      if ($this.parent().hasClass(className)){
        $this.next('ul').stop().slideUp(200, function() {
          $this.parent().removeClass(className);
          $this.find(srText).text('열기');
        });
      } else {

        $this.next('ul').stop().slideDown(200, function() {
          $this.parent().addClass(className);
          $this.find(srText).text('닫기');
        });
      }
    });
    front.btnClick(btnDepth2, function($this) {
      if ($this.parent().hasClass(className)){
        $this.next('ul').stop().slideUp(200, function() {
          $this.parent().removeClass(className);
          $this.find(srText2).text('열기');
        });
      } else {
        $this.next('ul').stop().slideDown(200, function() {
          $this.parent().addClass(className);
          $this.find(srText2).text('닫기');
        });
      }
    });
  }
};

$(function(){
    var isMobile = {
        Android: function () {
                 return navigator.userAgent.match(/Android/i) == null ? false : true;
        },
        BlackBerry: function () {
                 return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
        },
        IOS: function () {
                 return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
        },
        Opera: function () {
                 return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
        },
        Windows: function () {
                 return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
        },
        any: function () {
                 return (isMobile.Android() || isMobile.BlackBerry() || isMobile.IOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    var windowSize = document.body.clientWidth;

	if(isMobile.any()) { /* 2020-08-13 */
		$('#content').prepend('<a href="#content" id="sub-content" class="mobile-only"><h2>본문영역</h2></a>');
		$('#skip>a').attr('href', '#sub-content');	
	}

    // 모바일 접속일 경우 ios / android 운영체제 구분
    if(isMobile.any() && windowSize <= 768){
        if(isMobile.Android()){
            $("html").addClass("android mobile");
        }else if(isMobile.IOS()){
            $("html").addClass("ios mobile");
        }else if(isMobile.BlackBerry()){
            $("html").addClass("android mobile");
        }else if(isMobile.Opera()){
            $("html").addClass("android mobile");
        }else if(isMobile.Windows()){
            $("html").addClass("android mobile");
        }
    }
// ie버전 확인 및 크로스 브라우징을 위한 클래스 추가 스크립트
  var agent = navigator.userAgent.toLowerCase();
  if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
      $("#content").attr("tanindex","0"); // ie에서 스킵네비게이션 동작안될경우

      if(agent.indexOf("trident/7.0") != -1){
        $("html").addClass("ie11");
      } else if(agent.indexOf("trident/6.0") != -1){
        $("html").addClass("ie10");
      } else if(agent.indexOf("trident/5.0") != -1){
        $("html").addClass("ie19");
      } else if(agent.indexOf("trident/4.0") != -1){
        $("html").addClass("ie8");
      } else {
        $("html").addClass("oldIE");
      }
  }
    // 모바일 서브메뉴
    $("#snb ul li a").click(function(e){
        var snbOpen = $("#snb ul").hasClass("fixed");
        if(windowSize <= 768){
            if(snbOpen == false){
                e.preventDefault();
                $("#snb ul").addClass("fixed");
                $(this).parent().siblings().slideDown();
                //console.log("열림");
            } else{
                $(this).parent().siblings().hide();
                $(this).parent().show();
                //console.log("닫힘");
            }
        }
    })

    var $snb = $("#snb");
    var $container = $("#container");
    /*if( $snb.length > 0 && !isMobile.any()){
        var height = $container.outerHeight();
        $snb.css("height",height);
    }*/
    popupCheck();

});
function popOpen(name, width, height){
    var popUrl = name+".html";	//팝업창에 출력될 페이지 URL
    var winWidth = $(window).width();

    if(winWidth < 768){
        var popOption = "width="+screen.width+", ";
        popOption +=  "height="+screen.height+", ";
        popOption +=  "fullscreen=yes, scrollbars=yes, left=0, top=0";
    } else{
        var popOption = "width="+width+", ";
        popOption +=  "height="+height+", ";
        popOption +=  "resizable=yes, scrollbars=yes, status=no";
    }
    window.open(popUrl,"",popOption);
}

function popupCheck(){
    if(opener !=undefined){
        $("html").addClass("popup");
    } else{
        $("html").removeClass("popup");
    }
}
/*
  * param opener 레이어팝업 호출 버튼
*/
function openLayer(name,w,h, opener){
  var windowSize = document.body.clientWidth; 
  var layer = "#"+name;
  var width = w;
  var height = h;
  var dim = $("#dim-layer");
  // 20181023_접근성 수정 추가 Start
  if (opener){
  $(layer).attr('tabindex', '0').show().focus();
      $(layer).find('.btn.btn-close').on('keydown', function(e){
          if(!window.event.shiftKey && e.keyCode == 9) {
              $(layer).attr('tabindex','0').focus()
    }
  })
  .one('click', function(){
    closeLayer(name)	
  })
  $('#dim-layer').one('click', function(){
    closeLayer(name);
  })

      opener.attr('data-opener', 'target');
  }
  // 20181023_접근성 수정 추가 End


  dim.show();
  if(windowSize < 768){
      $(layer).css({
          "width": "100%", //너비
          "height" : "auto",
          "margin-left" : 0,
          "margin-top" : 0,
          "top":0,
          "left":0,
          "bottom":0,
          "right":0
      });
  } else{
    $(layer).css({
        "width": width+"px", //너비
        "height" : height +"px",
        "margin-left" : -(width/2)+"px",
        "margin-top" : -(height/2)+"px",
    });
  }
}  

$(function(){
	jQuery(function($) {
		$.datepicker.regional['ko'] = {
			closeText : '닫기',
			prevText : '이전달',
			nextText : '다음달',
			currentText : '오늘',
			monthNames : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			monthNamesShort : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
			dayNames : ['일', '월', '화', '수', '목', '금', '토'],
			dayNamesShort : ['일', '월', '화', '수', '목', '금', '토'],
			dayNamesMin : ['일', '월', '화', '수', '목', '금', '토'],
			weekHeader : 'Wk',
			dateFormat : 'yy-mm-dd',
			firstDay : 0,
			isRTL : false,
			showMonthAfterYear : true,
			yearSuffix : '년'
		};
		$.datepicker.setDefaults($.datepicker.regional['ko']);
	});
});

$(window).on('resize', function() {
  if($(window).width() <= 1151) {
    $('html').addClass('mobile');
    
  }else {
    $('html').removeClass('mobile');
  }
});
