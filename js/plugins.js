/**
 * @name screen
 * @author JungHyunKwon
 * @since 2017-11-03
 * @version 1.0.0
 * @param {object} options {
 *	   state : [{
 *	       name : string,
 *		   horizontal : {
 *			   from : number,
 *			   to : number
 *		   },
 *		   vertical : {
 *			   from : number,
 *			   to : number
 *		   }
 *	   }]
 *  }
 * @return {object}
 */
!function($) {
    var _$window = $(window)
      , _html = document.documentElement
      , _htmlCss = _getCss(_html)
      , _$extend = $.extend
      , _$inArray = $.inArray
      , _$isNumeric = $.isNumeric
      , _$trim = $.trim
      , _$isArray = $.isArray
      , _element = document.getElementById("screen")
      , _settings = {};
    function _getCss(e) {
        var t;
        try {
            t = e.currentStyle || getComputedStyle(e)
        } catch (e) {}
        return t
    }
    function _deduplicateArray(e) {
        for (var t = [], r = 0, i = e.length; r < i; r++) {
            var n = e[r];
            -1 === _$inArray(n, t) && t.push(n)
        }
        return t
    }
    function _compareArray(e, t) {
        for (var r = [], i = [], n = {
            truth: r,
            untruth: i
        }, a = 0, s = e.length; a < s; a++) {
            var o = e[a];
            _$inArray(o, t) > -1 ? r.push(o) : i.push(o)
        }
        return n
    }
    function _sortArray(e, t) {
        for (var r = [], i = 0, n = e.length; i < n; i++) {
            var a = e[i]
              , s = _$inArray(a, t);
            s > -1 && (r[s] = a)
        }
        for (i = 0; i < r.length; i++)
            r.hasOwnProperty(i) || (r.splice(i, 1),
            i--);
        return r
    }
    function _getScrollbarSize() {
        return _element.offsetWidth - _element.clientWidth
    }
    function _hasScrollbar() {
        var e = _htmlCss.overflowX
          , t = _htmlCss.overflowY;
        return {
            horizontal: _html.scrollWidth > _html.clientWidth && "hidden" !== e || "scroll" === e,
            vertical: _html.scrollHeight > _html.clientHeight && "hidden" !== t || "scroll" === t
        }
    }
    function _filterScreenState(e) {
        var t = [];
        if ("string" == typeof e && (e = [e]),
        _$isArray(e)) {
            var r = _settings.name;
            t = _sortArray(_compareArray(_deduplicateArray(e), r).truth, r)
        }
        return t
    }
    function _setScreenInfo() {
        var e = _hasScrollbar()
          , t = e.horizontal
          , r = e.vertical
          , i = _getScrollbarSize()
          , n = _$window.width()
          , a = _$window.height();
        r && (n += i),
        t && (a += i),
        _settings.horizontalScrollbar = t,
        _settings.verticalScrollbar = r,
        _settings.scrollbarSize = i,
        _settings.width = n,
        _settings.height = a
    }
    function _setScreenInfoState(e) {
        var t = _settings.state
          , r = _compareArray(e, t)
          , i = r.untruth
          , n = _compareArray(t, r.truth).untruth;
        return (i.length || n.length) && (_settings.state = e),
        {
            activeState: i,
            deactiveState: n
        }
    }
    function _callScreenEvent(e) {
        _$screen.settings = _$extend(!0, _$screen.settings, _settings);
        for (var t = 0, r = e.length; t < r; t++) {
            var i = e[t];
            _$window.triggerHandler("screen", i),
            _$window.triggerHandler("screen:" + i, i)
        }
    }
    function _destroyScreen() {
        _$window.off(".screen"),
        _settings.state = [],
        _$screen.settings = void 0,
        $(_element).remove()
    }
    _element || (_element = document.createElement("div"),
    _element.id = "screen");
    var _$screen = $.screen = function(options) {
        if (options) {
            var state = options.state
              , name = []
              , width = 0
              , height = 0
              , timer = 0
              , code = "var inState = [];\n\n";
            if (_destroyScreen(),
            _html.appendChild(_element),
            _$isArray(state))
                for (var i = 0, stateLength = state.length; i < stateLength; i++) {
                    var value = state[i];
                    if (value) {
                        var stateName = value.name;
                        if ("string" == typeof stateName && (stateName = _$trim(stateName),
                        stateName)) {
                            var horizontal = value.horizontal
                              , hasHorizontal = !1
                              , vertical = value.vertical
                              , hasVertical = !1;
                            if (horizontal) {
                                var horizontalFrom = horizontal.from
                                  , horizontalTo = horizontal.to;
                                _$isNumeric(horizontalFrom) || (horizontalFrom = -1),
                                _$isNumeric(horizontalTo) || (horizontalTo = -1),
                                horizontalFrom >= 0 && horizontalTo >= 0 && horizontalFrom >= horizontalTo && (hasHorizontal = !0)
                            }
                            if (vertical) {
                                var verticalFrom = vertical.from
                                  , verticalTo = vertical.to;
                                _$isNumeric(verticalFrom) || (verticalFrom = -1),
                                _$isNumeric(verticalTo) || (verticalTo = -1),
                                verticalFrom >= 0 && verticalTo >= 0 && verticalFrom >= verticalTo && (hasVertical = !0)
                            }
                            (hasHorizontal || hasVertical) && (code += "if(",
                            hasHorizontal && (code += "width <= " + horizontalFrom + " && width >= " + horizontalTo),
                            hasVertical && (hasHorizontal && (code += " && "),
                            code += "height <= " + verticalFrom + " && height >= " + verticalTo),
                            code += ") {\n",
                            code += "    inState.push('" + stateName + "');\n",
                            code += "}\n\n",
                            name.push(stateName))
                        }
                    }
                }
            _settings.name = name,
            _$window.on("resize.screen", function(event) {
                _setScreenInfo();
                var screenWidth = _settings.width
                  , screenHeight = _settings.height
                  , resizeState = []
                  , resizedState = []
                  , isWidthChange = !1
                  , isHeightChange = !1
                  , isTrigger = event.isTrigger;
                screenWidth !== width && (width = screenWidth,
                isWidthChange = !0),
                screenHeight !== height && (height = screenHeight,
                isHeightChange = !0),
                isTrigger && (isWidthChange = !1,
                isHeightChange = !1),
                _settings.widthChange = isWidthChange,
                _settings.heightChange = isHeightChange,
                eval(code),
                inState.length || (inState[0] = "none");
                var setState = _setScreenInfoState(inState)
                  , activeState = setState.activeState;
                isTrigger || (resizeState[0] = "resize",
                resizedState[0] = "resized");
                for (var i = 0, inStateLength = inState.length; i < inStateLength; i++) {
                    var value = inState[i];
                    isTrigger || (resizeState.push("resize:" + value),
                    resizedState.push("resized:" + value)),
                    _$inArray(value, activeState) > -1 && resizeState.push(value)
                }
                _callScreenEvent(resizeState),
                timer && (clearTimeout(timer),
                timer = 0),
                timer = setTimeout(function() {
                    _setScreenInfo(),
                    _settings.widthChange = !1,
                    _settings.heightChange = !1,
                    _callScreenEvent(resizedState)
                }, 250)
            }).triggerHandler("resize.screen")
        }
        return _$window
    }
    ;
    _$screen.destroy = _destroyScreen,
    _$screen.setState = function(e) {
        var t = _filterScreenState(e)
          , r = !1;
        if (t.length) {
            var i = _setScreenInfoState(t)
              , n = i.activeState;
            (n.length || i.deactiveState.length) && (_callScreenEvent(n),
            r = !0)
        }
        return r
    }
}(window.jQuery);

/**
 * @name getParam
 * @author JungHyunKwon
 * @since 2018-09-05
 * @version 1.0.0
 * @param {string} value
 * @param {string} name
 * @return {string}
 */
!function() {
    "use strict";
    function t(t) {
        return "string" == typeof t ? decodeURIComponent(t.replace(/\+/g, "%20")) : ""
    }
    window.getParam = function(i, r) {
        var e = "";
        if ("string" == typeof i) {
            var n = i.split("?")[1];
            if ("string" == typeof r && n)
                for (var o = 0, f = (n = n.split("&")).length, a = f - 1; o < f; o++) {
                    var p = n[o].split("=");
                    if (r === p[0]) {
                        var s = p[1];
                        if (s && (a === o && (s = s.split("#")[0]),
                        s))
                            do {
                                s = t(s),
                                e = t(s)
                            } while (s !== e);
                        break
                    }
                }
        }
        return e
    }
}();

/**
 * @name anchor
 * @author JungHyunKwon
 * @since 2019-10-24
 * @version 1.0.0
 * @param {string || object} options {
 *     animate : object {
 *         properties : object {
 *             scrollTop : string,
 *             scrollLeft : string
 *         }
 *     },
 *     stop : object,
 *     targetElement : object,
 *     scrollingElement : object,
 *     hash : boolean,
 *     focus : boolean,
 *     namespace : string
 * }
 * @param {string} value
 * @return {object}
 */
!function(t) {
    "use strict";
    var o = t.extend;
    t.fn.anchor = function(e, i) {
        if (e)
            if ("string" == typeof e) {
                var n = arguments.hasOwnProperty(1);
                if ("destroy" === e) {
                    var r = ".anchor.";
                    n && (r += i),
                    this.off(r)
                }
            } else {
                var f = o(!0, {}, e)
                  , s = f.animate;
                if (s) {
                    var a = s.properties;
                    if (a) {
                        var c = s.options || {}
                          , l = c.complete
                          , p = "function" == typeof l
                          , u = a.scrollTop
                          , h = a.scrollLeft
                          , v = "offset" === u || "position" === u
                          , m = "offset" === h || "position" === h
                          , d = f.stop
                          , y = t(f.targetElement).first()
                          , x = y[0]
                          , b = t(f.scrollingElement)
                          , g = b[0]
                          , E = !0 === f.focus
                          , T = !0 === f.hash;
                        this.on("click.anchor." + f.namespace, function(t) {
                            if (x) {
                                var o = {
                                    offset: y.offset(),
                                    position: y.position()
                                };
                                c.complete = function() {
                                    if (g === this) {
                                        var t = y.attr("id");
                                        if (E) {
                                            var o = y.attr("tabindex");
                                            o || y.attr("tabindex", -1),
                                            y.focus()
                                        }
                                        T && t && (location.hash = t),
                                        E && !o && y.removeAttr("tabindex"),
                                        p && l()
                                    }
                                }
                                ,
                                d && b.stop(d.queue, d.clearQueue, d.jumpToEnd),
                                v && (a.scrollTop = o[u].top),
                                m && (a.scrollLeft = o[h].left),
                                b.animate(a, c),
                                t.preventDefault()
                            }
                        })
                    }
                }
            }
        return this
    }
}(window.jQuery);

/*
 Name : slick
 Version: 1.8.0
 Author: Ken Wheeler
 Repo: http://github.com/kenwheeler/slick
 */
/*
*/
!function(i) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery)
}(function(i) {
    "use strict";
    var e = window.Slick || {};
    (e = function() {
        var e = 0;
        return function(t, o) {
            var s, n = this;
            n.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: i(t),
                appendDots: i(t),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(e, t) {
                    return i('<button type="button" />').text(t + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                focusOnChange: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            },
            n.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            },
            i.extend(n, n.initials),
            n.activeBreakpoint = null,
            n.animType = null,
            n.animProp = null,
            n.breakpoints = [],
            n.breakpointSettings = [],
            n.cssTransitions = !1,
            n.focussed = !1,
            n.interrupted = !1,
            n.hidden = "hidden",
            n.paused = !0,
            n.positionProp = null,
            n.respondTo = null,
            n.rowCount = 1,
            n.shouldClick = !0,
            n.$slider = i(t),
            n.$slidesCache = null,
            n.transformType = null,
            n.transitionType = null,
            n.visibilityChange = "visibilitychange",
            n.windowWidth = 0,
            n.windowTimer = null,
            s = i(t).data("slick") || {},
            n.options = i.extend({}, n.defaults, o, s),
            n.currentSlide = n.options.initialSlide,
            n.originalSettings = n.options,
            void 0 !== document.mozHidden ? (n.hidden = "mozHidden",
            n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden",
            n.visibilityChange = "webkitvisibilitychange"),
            n.autoPlay = i.proxy(n.autoPlay, n),
            n.autoPlayClear = i.proxy(n.autoPlayClear, n),
            n.autoPlayIterator = i.proxy(n.autoPlayIterator, n),
            n.changeSlide = i.proxy(n.changeSlide, n),
            n.clickHandler = i.proxy(n.clickHandler, n),
            n.selectHandler = i.proxy(n.selectHandler, n),
            n.setPosition = i.proxy(n.setPosition, n),
            n.swipeHandler = i.proxy(n.swipeHandler, n),
            n.dragHandler = i.proxy(n.dragHandler, n),
            n.keyHandler = i.proxy(n.keyHandler, n),
            n.instanceUid = e++,
            n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/,
            n.registerBreakpoints(),
            n.init(!0)
        }
    }()).prototype.activateADA = function() {
        this.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        }).parents('.slick-slide').attr({
            tabindex: "-1"
        })
    }
    ,
    e.prototype.addSlide = e.prototype.slickAdd = function(e, t, o) {
        var s = this;
        if ("boolean" == typeof t)
            o = t,
            t = null;
        else if (t < 0 || t >= s.slideCount)
            return !1;
        s.unload(),
        "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack),
        s.$slides = s.$slideTrack.children(this.options.slide),
        s.$slideTrack.children(this.options.slide).detach(),
        s.$slideTrack.append(s.$slides),
        s.$slides.each(function(e, t) {
            i(t).attr("data-slick-index", e)
        }),
        s.$slidesCache = s.$slides,
        s.reinit()
    }
    ,
    e.prototype.animateHeight = function() {
        var i = this;
        if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.animate({
                height: e
            }, i.options.speed)
        }
    }
    ,
    e.prototype.animateSlide = function(e, t) {
        var o = {}
          , s = this;
        s.animateHeight(),
        !0 === s.options.rtl && !1 === s.options.vertical && (e = -e),
        !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
            left: e
        }, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({
            top: e
        }, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft),
        i({
            animStart: s.currentLeft
        }).animate({
            animStart: e
        }, {
            duration: s.options.speed,
            easing: s.options.easing,
            step: function(i) {
                i = Math.ceil(i),
                !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)",
                s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)",
                s.$slideTrack.css(o))
            },
            complete: function() {
                t && t.call()
            }
        })) : (s.applyTransition(),
        e = Math.ceil(e),
        !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)",
        s.$slideTrack.css(o),
        t && setTimeout(function() {
            s.disableTransition(),
            t.call()
        }, s.options.speed))
    }
    ,
    e.prototype.getNavTarget = function() {
        var e = this
          , t = e.options.asNavFor;
        return t && null !== t && (t = i(t).not(e.$slider)),
        t
    }
    ,
    e.prototype.asNavFor = function(e) {
        var t = this.getNavTarget();
        null !== t && "object" == typeof t && t.each(function() {
            var t = i(this).slick("getSlick");
            t.unslicked || t.slideHandler(e, !0)
        })
    }
    ,
    e.prototype.applyTransition = function(i) {
        var e = this
          , t = {};
        !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase,
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }
    ,
    e.prototype.autoPlay = function() {
        var i = this;
        i.autoPlayClear(),
        i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed))
    }
    ,
    e.prototype.autoPlayClear = function() {
        var i = this;
        i.autoPlayTimer && clearInterval(i.autoPlayTimer)
    }
    ,
    e.prototype.autoPlayIterator = function() {
        var i = this
          , e = i.currentSlide + i.options.slidesToScroll;
        i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll,
        i.currentSlide - 1 == 0 && (i.direction = 1))),
        i.slideHandler(e))
    }
    ,
    e.prototype.buildArrows = function() {
        var e = this;
        !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"),
        e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"),
        e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows),
        e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows),
        !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }
    ,
    e.prototype.buildDots = function() {
        var e, t, o = this;
        if (!0 === o.options.dots) {
            for (o.$slider.addClass("slick-dotted"),
            t = i("<ul />").addClass(o.options.dotsClass),
            e = 0; e <= o.getDotCount(); e += 1)
                t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
            o.$dots = t.appendTo(o.options.appendDots),
            o.$dots.find("li").first().addClass("slick-active")
        }
    }
    ,
    e.prototype.buildOut = function() {
        var e = this;
        e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"),
        e.slideCount = e.$slides.length,
        e.$slides.each(function(e, t) {
            i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "")
        }),
        e.$slider.addClass("slick-slider"),
        e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(),
        e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(),
        e.$slideTrack.css("opacity", 0),
        !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1),
        i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"),
        e.setupInfinite(),
        e.buildArrows(),
        e.buildDots(),
        e.updateDots(),
        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0),
        !0 === e.options.draggable && e.$list.addClass("draggable")
    }
    ,
    e.prototype.buildRows = function() {
        var i, e, t, o, s, n, r, l = this;
        if (o = document.createDocumentFragment(),
        n = l.$slider.children(),
        l.options.rows > 0) {
            for (r = l.options.slidesPerRow * l.options.rows,
            s = Math.ceil(n.length / r),
            i = 0; i < s; i++) {
                var d = document.createElement("div");
                for (e = 0; e < l.options.rows; e++) {
                    var a = document.createElement("div");
                    for (t = 0; t < l.options.slidesPerRow; t++) {
                        var c = i * r + (e * l.options.slidesPerRow + t);
                        n.get(c) && a.appendChild(n.get(c))
                    }
                    d.appendChild(a)
                }
                o.appendChild(d)
            }
            l.$slider.empty().append(o),
            l.$slider.children().children().children().css({
                width: 100 / l.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }
    ,
    e.prototype.checkResponsive = function(e, t) {
        var o, s, n, r = this, l = !1, d = r.$slider.width(), a = window.innerWidth || i(window).width();
        if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)),
        r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
            s = null;
            for (o in r.breakpoints)
                r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
            null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s,
            "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]),
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e)),
            l = s) : (r.activeBreakpoint = s,
            "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]),
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e)),
            l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null,
            r.options = r.originalSettings,
            !0 === e && (r.currentSlide = r.options.initialSlide),
            r.refresh(e),
            l = s),
            e || !1 === l || r.$slider.trigger("breakpoint", [r, l])
        }
    }
    ,
    e.prototype.changeSlide = function(e, t) {
        var o, s, n, r = this, l = i(e.currentTarget);
        switch (l.is("a") && e.preventDefault(),
        l.is("li") || (l = l.closest("li")),
        n = r.slideCount % r.options.slidesToScroll != 0,
        o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll,
        e.data.message) {
        case "previous":
            s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o,
            r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
            break;
        case "next":
            s = 0 === o ? r.options.slidesToScroll : o,
            r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
            break;
        case "index":
            var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
            r.slideHandler(r.checkNavigable(d), !1, t),
            l.children().trigger("focus");
            break;
        default:
            return
        }
    }
    ,
    e.prototype.checkNavigable = function(i) {
        var e, t;
        if (e = this.getNavigableIndexes(),
        t = 0,
        i > e[e.length - 1])
            i = e[e.length - 1];
        else
            for (var o in e) {
                if (i < e[o]) {
                    i = t;
                    break
                }
                t = e[o]
            }
        return i
    }
    ,
    e.prototype.cleanUpEvents = function() {
        var e = this;
        e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)),
        !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)),
        e.$slider.off("focus.slick blur.slick"),
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide),
        e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide),
        !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler),
        e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))),
        e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler),
        e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler),
        e.$list.off("touchend.slick mouseup.slick", e.swipeHandler),
        e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler),
        e.$list.off("click.slick", e.clickHandler),
        i(document).off(e.visibilityChange, e.visibility),
        e.cleanUpSlideEvents(),
        !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler),
        i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange),
        i(window).off("resize.slick.slick-" + e.instanceUid, e.resize),
        i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault),
        i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition)
    }
    ,
    e.prototype.cleanUpSlideEvents = function() {
        var e = this;
        e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }
    ,
    e.prototype.cleanUpRows = function() {
        var i, e = this;
        e.options.rows > 0 && ((i = e.$slides.children().children()).removeAttr("style"),
        e.$slider.empty().append(i))
    }
    ,
    e.prototype.clickHandler = function(i) {
        !1 === this.shouldClick && (i.stopImmediatePropagation(),
        i.stopPropagation(),
        i.preventDefault())
    }
    ,
    e.prototype.destroy = function(e) {
        var t = this;
        t.autoPlayClear(),
        t.touchObject = {},
        t.cleanUpEvents(),
        i(".slick-cloned", t.$slider).detach(),
        t.$dots && t.$dots.remove(),
        t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()),
        t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()),
        t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            i(this).attr("style", i(this).data("originalStyling"))
        }),
        t.$slideTrack.children(this.options.slide).detach(),
        t.$slideTrack.detach(),
        t.$list.detach(),
        t.$slider.append(t.$slides)),
        t.cleanUpRows(),
        t.$slider.removeClass("slick-slider"),
        t.$slider.removeClass("slick-initialized"),
        t.$slider.removeClass("slick-dotted"),
        t.unslicked = !0,
        e || t.$slider.trigger("destroy", [t])
    }
    ,
    e.prototype.disableTransition = function(i) {
        var e = this
          , t = {};
        t[e.transitionType] = "",
        !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t)
    }
    ,
    e.prototype.fadeSlide = function(i, e) {
        var t = this;
        !1 === t.cssTransitions ? (t.$slides.eq(i).css({
            zIndex: t.options.zIndex
        }),
        t.$slides.eq(i).animate({
            opacity: 1
        }, t.options.speed, t.options.easing, e)) : (t.applyTransition(i),
        t.$slides.eq(i).css({
            opacity: 1,
            zIndex: t.options.zIndex
        }),
        e && setTimeout(function() {
            t.disableTransition(i),
            e.call()
        }, t.options.speed))
    }
    ,
    e.prototype.fadeSlideOut = function(i) {
        var e = this;
        !1 === e.cssTransitions ? e.$slides.eq(i).animate({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }, e.options.speed, e.options.easing) : (e.applyTransition(i),
        e.$slides.eq(i).css({
            opacity: 0,
            zIndex: e.options.zIndex - 2
        }))
    }
    ,
    e.prototype.filterSlides = e.prototype.slickFilter = function(i) {
        var e = this;
        null !== i && (e.$slidesCache = e.$slides,
        e.unload(),
        e.$slideTrack.children(this.options.slide).detach(),
        e.$slidesCache.filter(i).appendTo(e.$slideTrack),
        e.reinit())
    }
    ,
    e.prototype.focusHandler = function() {
        var e = this;
        e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function(t) {
            t.stopImmediatePropagation();
            var o = i(this);
            setTimeout(function() {
                e.options.pauseOnFocus && (e.focussed = o.is(":focus"),
                e.autoPlay())
            }, 0)
        })
    }
    ,
    e.prototype.getCurrent = e.prototype.slickCurrentSlide = function() {
        return this.currentSlide
    }
    ,
    e.prototype.getDotCount = function() {
        var i = this
          , e = 0
          , t = 0
          , o = 0;
        if (!0 === i.options.infinite)
            if (i.slideCount <= i.options.slidesToShow)
                ++o;
            else
                for (; e < i.slideCount; )
                    ++o,
                    e = t + i.options.slidesToScroll,
                    t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        else if (!0 === i.options.centerMode)
            o = i.slideCount;
        else if (i.options.asNavFor)
            for (; e < i.slideCount; )
                ++o,
                e = t + i.options.slidesToScroll,
                t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
        else
            o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
        return o - 1
    }
    ,
    e.prototype.getLeft = function(i) {
        var e, t, o, s, n = this, r = 0;
        return n.slideOffset = 0,
        t = n.$slides.first().outerHeight(!0),
        !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1,
        s = -1,
        !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)),
        r = t * n.options.slidesToShow * s),
        n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1,
        r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1,
        r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth,
        r = (i + n.options.slidesToShow - n.slideCount) * t),
        n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0,
        r = 0),
        !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0,
        n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)),
        e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r,
        !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow),
        e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
        !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1),
        e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0,
        e += (n.$list.width() - o.outerWidth()) / 2)),
        e
    }
    ,
    e.prototype.getOption = e.prototype.slickGetOption = function(i) {
        return this.options[i]
    }
    ,
    e.prototype.getNavigableIndexes = function() {
        var i, e = this, t = 0, o = 0, s = [];
        for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll,
        o = -1 * e.options.slidesToScroll,
        i = 2 * e.slideCount); t < i; )
            s.push(t),
            t = o + e.options.slidesToScroll,
            o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        return s
    }
    ,
    e.prototype.getSlick = function() {
        return this
    }
    ,
    e.prototype.getSlideCount = function() {
        var e, t, o = this;
        return t = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0,
        !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each(function(s, n) {
            if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft)
                return e = n,
                !1
        }),
        Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll
    }
    ,
    e.prototype.goTo = e.prototype.slickGoTo = function(i, e) {
        this.changeSlide({
            data: {
                message: "index",
                index: parseInt(i)
            }
        }, e)
    }
    ,
    e.prototype.init = function(e) {
        var t = this;
        i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"),
        t.buildRows(),
        t.buildOut(),
        t.setProps(),
        t.startLoad(),
        t.loadSlider(),
        t.initializeEvents(),
        t.updateArrows(),
        t.updateDots(),
        t.checkResponsive(!0),
        t.focusHandler()),
        e && t.$slider.trigger("init", [t]),
        !0 === t.options.accessibility && t.initADA(),
        t.options.autoplay && (t.paused = !1,
        t.autoPlay())
    }
    ,
    e.prototype.initADA = function() {
        var e = this
          , t = Math.ceil(e.slideCount / e.options.slidesToShow)
          , o = e.getNavigableIndexes().filter(function(i) {
            return i >= 0 && i < e.slideCount
        });
        e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }),
        null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t) {
            var s = o.indexOf(t);
            i(this).attr({
                role: "tabpanel",
                id: "slick-slide" + e.instanceUid + t,
                tabindex: -1
            }),
            -1 !== s && i(this).attr({
                "aria-describedby": "slick-slide-control" + e.instanceUid + s
            })
        }),
        e.$dots.attr("role", "tablist").find("li").each(function(s) {
            var n = o[s];
            i(this).attr({
                role: "presentation"
            }),
            i(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + e.instanceUid + s,
                "aria-controls": "slick-slide" + e.instanceUid + n,
                "aria-label": s + 1 + " of " + t,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(e.currentSlide).find("button").attr({
            "aria-selected": "true",
            tabindex: "0"
        }).end());
        for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++)
            e.$slides.eq(s).attr("tabindex", 0);
        e.activateADA()
    }
    ,
    e.prototype.initArrowEvents = function() {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, i.changeSlide),
        i.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, i.changeSlide),
        !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler),
        i.$nextArrow.on("keydown.slick", i.keyHandler)))
    }
    ,
    e.prototype.initDotEvents = function() {
        var e = this;
        !0 === e.options.dots && (i("li", e.$dots).on("click.slick", {
            message: "index"
        }, e.changeSlide),
        !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)),
        !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1))
    }
    ,
    e.prototype.initSlideEvents = function() {
        var e = this;
        e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)),
        e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)))
    }
    ,
    e.prototype.initializeEvents = function() {
        var e = this;
        e.initArrowEvents(),
        e.initDotEvents(),
        e.initSlideEvents(),
        e.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, e.swipeHandler),
        e.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, e.swipeHandler),
        e.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, e.swipeHandler),
        e.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, e.swipeHandler),
        e.$list.on("click.slick", e.clickHandler),
        i(document).on(e.visibilityChange, i.proxy(e.visibility, e)),
        !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler),
        !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)),
        i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)),
        i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault),
        i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition),
        i(e.setPosition)
    }
    ,
    e.prototype.initUI = function() {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(),
        i.$nextArrow.show()),
        !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show()
    }
    ,
    e.prototype.keyHandler = function(i) {
        var e = this;
        i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({
            data: {
                message: !0 === e.options.rtl ? "next" : "previous"
            }
        }) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({
            data: {
                message: !0 === e.options.rtl ? "previous" : "next"
            }
        }))
    }
    ,
    e.prototype.lazyLoad = function() {
        function e(e) {
            i("img[data-lazy]", e).each(function() {
                var e = i(this)
                  , t = i(this).attr("data-lazy")
                  , o = i(this).attr("data-srcset")
                  , s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes")
                  , r = document.createElement("img");
                r.onload = function() {
                    e.animate({
                        opacity: 0
                    }, 100, function() {
                        o && (e.attr("srcset", o),
                        s && e.attr("sizes", s)),
                        e.attr("src", t).animate({
                            opacity: 1
                        }, 200, function() {
                            e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }),
                        n.$slider.trigger("lazyLoaded", [n, e, t])
                    })
                }
                ,
                r.onerror = function() {
                    e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                    n.$slider.trigger("lazyLoadError", [n, e, t])
                }
                ,
                r.src = t
            })
        }
        var t, o, s, n = this;
        if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)),
        s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide,
        s = Math.ceil(o + n.options.slidesToShow),
        !0 === n.options.fade && (o > 0 && o--,
        s <= n.slideCount && s++)),
        t = n.$slider.find(".slick-slide").slice(o, s),
        "anticipated" === n.options.lazyLoad)
            for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++)
                r < 0 && (r = n.slideCount - 1),
                t = (t = t.add(d.eq(r))).add(d.eq(l)),
                r--,
                l++;
        e(t),
        n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow))
    }
    ,
    e.prototype.loadSlider = function() {
        var i = this;
        i.setPosition(),
        i.$slideTrack.css({
            opacity: 1
        }),
        i.$slider.removeClass("slick-loading"),
        i.initUI(),
        "progressive" === i.options.lazyLoad && i.progressiveLazyLoad()
    }
    ,
    e.prototype.next = e.prototype.slickNext = function() {
        this.changeSlide({
            data: {
                message: "next"
            }
        })
    }
    ,
    e.prototype.orientationChange = function() {
        var i = this;
        i.checkResponsive(),
        i.setPosition()
    }
    ,
    e.prototype.pause = e.prototype.slickPause = function() {
        var i = this;
        i.autoPlayClear(),
        i.paused = !0
    }
    ,
    e.prototype.play = e.prototype.slickPlay = function() {
        var i = this;
        i.autoPlay(),
        i.options.autoplay = !0,
        i.paused = !1,
        i.focussed = !1,
        i.interrupted = !1
    }
    ,
    e.prototype.postSlide = function(e) {
        var t = this;
        t.unslicked || (t.$slider.trigger("afterChange", [t, e]),
        t.animating = !1,
        t.slideCount > t.options.slidesToShow && t.setPosition(),
        t.swipeLeft = null,
        t.options.autoplay && t.autoPlay(),
        !0 === t.options.accessibility && (t.initADA(),
        t.options.focusOnChange && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()))
    }
    ,
    e.prototype.prev = e.prototype.slickPrev = function() {
        this.changeSlide({
            data: {
                message: "previous"
            }
        })
    }
    ,
    e.prototype.preventDefault = function(i) {
        i.preventDefault()
    }
    ,
    e.prototype.progressiveLazyLoad = function(e) {
        e = e || 1;
        var t, o, s, n, r, l = this, d = i("img[data-lazy]", l.$slider);
        d.length ? (t = d.first(),
        o = t.attr("data-lazy"),
        s = t.attr("data-srcset"),
        n = t.attr("data-sizes") || l.$slider.attr("data-sizes"),
        (r = document.createElement("img")).onload = function() {
            s && (t.attr("srcset", s),
            n && t.attr("sizes", n)),
            t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),
            !0 === l.options.adaptiveHeight && l.setPosition(),
            l.$slider.trigger("lazyLoaded", [l, t, o]),
            l.progressiveLazyLoad()
        }
        ,
        r.onerror = function() {
            e < 3 ? setTimeout(function() {
                l.progressiveLazyLoad(e + 1)
            }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
            l.$slider.trigger("lazyLoadError", [l, t, o]),
            l.progressiveLazyLoad())
        }
        ,
        r.src = o) : l.$slider.trigger("allImagesLoaded", [l])
    }
    ,
    e.prototype.refresh = function(e) {
        var t, o, s = this;
        o = s.slideCount - s.options.slidesToShow,
        !s.options.infinite && s.currentSlide > o && (s.currentSlide = o),
        s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0),
        t = s.currentSlide,
        s.destroy(!0),
        i.extend(s, s.initials, {
            currentSlide: t
        }),
        s.init(),
        e || s.changeSlide({
            data: {
                message: "index",
                index: t
            }
        }, !1)
    }
    ,
    e.prototype.registerBreakpoints = function() {
        var e, t, o, s = this, n = s.options.responsive || null;
        if ("array" === i.type(n) && n.length) {
            s.respondTo = s.options.respondTo || "window";
            for (e in n)
                if (o = s.breakpoints.length - 1,
                n.hasOwnProperty(e)) {
                    for (t = n[e].breakpoint; o >= 0; )
                        s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1),
                        o--;
                    s.breakpoints.push(t),
                    s.breakpointSettings[t] = n[e].settings
                }
            s.breakpoints.sort(function(i, e) {
                return s.options.mobileFirst ? i - e : e - i
            })
        }
    }
    ,
    e.prototype.reinit = function() {
        var e = this;
        e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"),
        e.slideCount = e.$slides.length,
        e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll),
        e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0),
        e.registerBreakpoints(),
        e.setProps(),
        e.setupInfinite(),
        e.buildArrows(),
        e.updateArrows(),
        e.initArrowEvents(),
        e.buildDots(),
        e.updateDots(),
        e.initDotEvents(),
        e.cleanUpSlideEvents(),
        e.initSlideEvents(),
        e.checkResponsive(!1, !0),
        !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler),
        e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0),
        e.setPosition(),
        e.focusHandler(),
        e.paused = !e.options.autoplay,
        e.autoPlay(),
        e.$slider.trigger("reInit", [e])
    }
    ,
    e.prototype.resize = function() {
        var e = this;
        i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay),
        e.windowDelay = window.setTimeout(function() {
            e.windowWidth = i(window).width(),
            e.checkResponsive(),
            e.unslicked || e.setPosition()
        }, 50))
    }
    ,
    e.prototype.removeSlide = e.prototype.slickRemove = function(i, e, t) {
        var o = this;
        if (i = "boolean" == typeof i ? !0 === (e = i) ? 0 : o.slideCount - 1 : !0 === e ? --i : i,
        o.slideCount < 1 || i < 0 || i > o.slideCount - 1)
            return !1;
        o.unload(),
        !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(),
        o.$slides = o.$slideTrack.children(this.options.slide),
        o.$slideTrack.children(this.options.slide).detach(),
        o.$slideTrack.append(o.$slides),
        o.$slidesCache = o.$slides,
        o.reinit()
    }
    ,
    e.prototype.setCSS = function(i) {
        var e, t, o = this, s = {};
        !0 === o.options.rtl && (i = -i),
        e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px",
        t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px",
        s[o.positionProp] = i,
        !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {},
        !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")",
        o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)",
        o.$slideTrack.css(s)))
    }
    ,
    e.prototype.setDimensions = function() {
        var i = this;
        !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({
            padding: "0px " + i.options.centerPadding
        }) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow),
        !0 === i.options.centerMode && i.$list.css({
            padding: i.options.centerPadding + " 0px"
        })),
        i.listWidth = i.$list.width(),
        i.listHeight = i.$list.height(),
        !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow),
        i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth),
        i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
        var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
        !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e)
    }
    ,
    e.prototype.setFade = function() {
        var e, t = this;
        t.$slides.each(function(o, s) {
            e = t.slideWidth * o * -1,
            !0 === t.options.rtl ? i(s).css({
                position: "relative",
                right: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0
            }) : i(s).css({
                position: "relative",
                left: e,
                top: 0,
                zIndex: t.options.zIndex - 2,
                opacity: 0
            })
        }),
        t.$slides.eq(t.currentSlide).css({
            zIndex: t.options.zIndex - 1,
            opacity: 1
        })
    }
    ,
    e.prototype.setHeight = function() {
        var i = this;
        if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
            var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
            i.$list.css("height", e)
        }
    }
    ,
    e.prototype.setOption = e.prototype.slickSetOption = function() {
        var e, t, o, s, n, r = this, l = !1;
        if ("object" === i.type(arguments[0]) ? (o = arguments[0],
        l = arguments[1],
        n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0],
        s = arguments[1],
        l = arguments[2],
        "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")),
        "single" === n)
            r.options[o] = s;
        else if ("multiple" === n)
            i.each(o, function(i, e) {
                r.options[i] = e
            });
        else if ("responsive" === n)
            for (t in s)
                if ("array" !== i.type(r.options.responsive))
                    r.options.responsive = [s[t]];
                else {
                    for (e = r.options.responsive.length - 1; e >= 0; )
                        r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1),
                        e--;
                    r.options.responsive.push(s[t])
                }
        l && (r.unload(),
        r.reinit())
    }
    ,
    e.prototype.setPosition = function() {
        var i = this;
        i.setDimensions(),
        i.setHeight(),
        !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(),
        i.$slider.trigger("setPosition", [i])
    }
    ,
    e.prototype.setProps = function() {
        var i = this
          , e = document.body.style;
        i.positionProp = !0 === i.options.vertical ? "top" : "left",
        "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"),
        void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0),
        i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex),
        void 0 !== e.OTransform && (i.animType = "OTransform",
        i.transformType = "-o-transform",
        i.transitionType = "OTransition",
        void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)),
        void 0 !== e.MozTransform && (i.animType = "MozTransform",
        i.transformType = "-moz-transform",
        i.transitionType = "MozTransition",
        void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)),
        void 0 !== e.webkitTransform && (i.animType = "webkitTransform",
        i.transformType = "-webkit-transform",
        i.transitionType = "webkitTransition",
        void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)),
        void 0 !== e.msTransform && (i.animType = "msTransform",
        i.transformType = "-ms-transform",
        i.transitionType = "msTransition",
        void 0 === e.msTransform && (i.animType = !1)),
        void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform",
        i.transformType = "transform",
        i.transitionType = "transition"),
        i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType
    }
    ,
    e.prototype.setSlideClasses = function(i) {
        var e, t, o, s, n = this;
        if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"),
        n.$slides.eq(i).addClass("slick-current"),
        !0 === n.options.centerMode) {
            var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
            e = Math.floor(n.options.slidesToShow / 2),
            !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i,
            t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")),
            0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")),
            n.$slides.eq(i).addClass("slick-center")
        } else
            i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow,
            o = !0 === n.options.infinite ? n.options.slidesToShow + i : i,
            n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad()
    }
    ,
    e.prototype.setupInfinite = function() {
        var e, t, o, s = this;
        if (!0 === s.options.fade && (s.options.centerMode = !1),
        !0 === s.options.infinite && !1 === s.options.fade && (t = null,
        s.slideCount > s.options.slidesToShow)) {
            for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow,
            e = s.slideCount; e > s.slideCount - o; e -= 1)
                t = e - 1,
                i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
            for (e = 0; e < o + s.slideCount; e += 1)
                t = e,
                i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
            s.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                i(this).attr("id", "")
            })
        }
    }
    ,
    e.prototype.interrupt = function(i) {
        var e = this;
        i || e.autoPlay(),
        e.interrupted = i
    }
    ,
    e.prototype.selectHandler = function(e) {
        var t = this
          , o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide")
          , s = parseInt(o.attr("data-slick-index"));
        s || (s = 0),
        t.slideCount <= t.options.slidesToShow ? t.slideHandler(s, !1, !0) : t.slideHandler(s)
    }
    ,
    e.prototype.slideHandler = function(i, e, t) {
        var o, s, n, r, l, d = null, a = this;
        if (e = e || !1,
        !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i))
            if (!1 === e && a.asNavFor(i),
            o = i,
            d = a.getLeft(o),
            r = a.getLeft(a.currentSlide),
            a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft,
            !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll))
                !1 === a.options.fade && (o = a.currentSlide,
                !0 !== t ? a.animateSlide(r, function() {
                    a.postSlide(o)
                }) : a.postSlide(o));
            else if (!1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll))
                !1 === a.options.fade && (o = a.currentSlide,
                !0 !== t ? a.animateSlide(r, function() {
                    a.postSlide(o)
                }) : a.postSlide(o));
            else {
                if (a.options.autoplay && clearInterval(a.autoPlayTimer),
                s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o,
                a.animating = !0,
                a.$slider.trigger("beforeChange", [a, a.currentSlide, s]),
                n = a.currentSlide,
                a.currentSlide = s,
                a.setSlideClasses(a.currentSlide),
                a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide),
                a.updateDots(),
                a.updateArrows(),
                !0 === a.options.fade)
                    return !0 !== t ? (a.fadeSlideOut(n),
                    a.fadeSlide(s, function() {
                        a.postSlide(s)
                    })) : a.postSlide(s),
                    void a.animateHeight();
                !0 !== t ? a.animateSlide(d, function() {
                    a.postSlide(s)
                }) : a.postSlide(s)
            }
    }
    ,
    e.prototype.startLoad = function() {
        var i = this;
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(),
        i.$nextArrow.hide()),
        !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(),
        i.$slider.addClass("slick-loading")
    }
    ,
    e.prototype.swipeDirection = function() {
        var i, e, t, o, s = this;
        return i = s.touchObject.startX - s.touchObject.curX,
        e = s.touchObject.startY - s.touchObject.curY,
        t = Math.atan2(e, i),
        (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)),
        o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical"
    }
    ,
    e.prototype.swipeEnd = function(i) {
        var e, t, o = this;
        if (o.dragging = !1,
        o.swiping = !1,
        o.scrolling)
            return o.scrolling = !1,
            !1;
        if (o.interrupted = !1,
        o.shouldClick = !(o.touchObject.swipeLength > 10),
        void 0 === o.touchObject.curX)
            return !1;
        if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]),
        o.touchObject.swipeLength >= o.touchObject.minSwipe) {
            switch (t = o.swipeDirection()) {
            case "left":
            case "down":
                e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(),
                o.currentDirection = 0;
                break;
            case "right":
            case "up":
                e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(),
                o.currentDirection = 1
            }
            "vertical" != t && (o.slideHandler(e),
            o.touchObject = {},
            o.$slider.trigger("swipe", [o, t]))
        } else
            o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide),
            o.touchObject = {})
    }
    ,
    e.prototype.swipeHandler = function(i) {
        var e = this;
        if (!(!1 === e.options.swipe || "ontouchend"in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse")))
            switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1,
            e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold,
            !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold),
            i.data.action) {
            case "start":
                e.swipeStart(i);
                break;
            case "move":
                e.swipeMove(i);
                break;
            case "end":
                e.swipeEnd(i)
            }
    }
    ,
    e.prototype.swipeMove = function(i) {
        var e, t, o, s, n, r, l = this;
        return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null,
        !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide),
        l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX,
        l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY,
        l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))),
        r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))),
        !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0,
        !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r),
        t = l.swipeDirection(),
        void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0,
        i.preventDefault()),
        s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1),
        !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1),
        o = l.touchObject.swipeLength,
        l.touchObject.edgeHit = !1,
        !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction,
        l.touchObject.edgeHit = !0),
        !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s,
        !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s),
        !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null,
        !1) : void l.setCSS(l.swipeLeft))))
    }
    ,
    e.prototype.swipeStart = function(i) {
        var e, t = this;
        if (t.interrupted = !0,
        1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow)
            return t.touchObject = {},
            !1;
        void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]),
        t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX,
        t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY,
        t.dragging = !0
    }
    ,
    e.prototype.unfilterSlides = e.prototype.slickUnfilter = function() {
        var i = this;
        null !== i.$slidesCache && (i.unload(),
        i.$slideTrack.children(this.options.slide).detach(),
        i.$slidesCache.appendTo(i.$slideTrack),
        i.reinit())
    }
    ,
    e.prototype.unload = function() {
        var e = this;
        i(".slick-cloned", e.$slider).remove(),
        e.$dots && e.$dots.remove(),
        e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(),
        e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(),
        e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }
    ,
    e.prototype.unslick = function(i) {
        var e = this;
        e.$slider.trigger("unslick", [e, i]),
        e.destroy()
    }
    ,
    e.prototype.updateArrows = function() {
        var i = this;
        Math.floor(i.options.slidesToShow / 2),
        !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }
    ,
    e.prototype.updateDots = function() {
        var i = this;
        null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(),
        i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"))
    }
    ,
    e.prototype.visibility = function() {
        var i = this;
        i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1)
    }
    ,
    i.fn.slick = function() {
        var i, t, o = this, s = arguments[0], n = Array.prototype.slice.call(arguments, 1), r = o.length;
        for (i = 0; i < r; i++)
            if ("object" == typeof s || void 0 === s ? o[i].slick = new e(o[i],s) : t = o[i].slick[s].apply(o[i].slick, n),
            void 0 !== t)
                return t;
        return o
    }
});
/**
 * @name slickExtensions
 * @author JungHyunKwon
 * @since 2017-12-06
 * @version 1.0.0
 * @since 2018-08-02
 * @param {object || string} options {
 *	   isRunOnLowIE : boolean,
 *	   autoArrow : object,
 *	   playArrow : object,
 *	   pauseArrow : object,
 *	   pauseOnArrowClick : boolean,
 *	   pauseOnDotsClick : boolean,
 *	   pauseOnDirectionKeyPush : boolean,
 *	   pauseOnSwipe : boolean,
 *	   playText : string,
 *	   pauseText : string,
 *	   current : object,
 *	   total : object,
 *	   customState : function
 * }
 * @return {object}
 */
!function(s) {
    "use strict";
    var t = s.fn.slick
      , i = navigator.userAgent.toLowerCase()
      , e = i.indexOf("msie 7.0") > -1 || i.indexOf("msie 8.0") > -1
      , n = s.extend;
    s.fn.slick = function() {
        var i = this
          , o = i.first()
          , c = o[0]
          , l = arguments[0];
        if (c && l) {
            var r = "string" == typeof l
              , a = c.slick || {};
            if (!r) {
                a.unslicked && o.slick("unslick"),
                l = n(!0, {}, l);
                var k = s(l.total)
                  , u = s(l.current);
                l.autoArrow = s(l.autoArrow),
                l.playArrow = s(l.playArrow),
                l.pauseArrow = s(l.pauseArrow),
                l.total = k,
                l.totalText = k.text(),
                l.current = u,
                l.currentText = u.text(),
                e && !l.isRunOnLowIE && (l.responsive = void 0),
                arguments[0] = l
            }
            if (!a.unslicked || "unslick" !== l)
                try {
                    i = t.apply(o, arguments)
                } catch (s) {}
            if (!r) {
                var d = (a = o.slick("getSlick")).options || {}
                  , f = function() {
                    a.slideCount > d.slidesToShow ? (o.slick("slickPlay"),
                    s(d.autoArrow).addClass("slick-pause").removeClass("slick-play").text(d.pauseText)) : x()
                }
                  , x = function() {
                    o.slick("slickPause"),
                    s(d.autoArrow).addClass("slick-play").removeClass("slick-pause").text(d.playText)
                };
                o.on("destroy.slickExtensions", function(t, i) {
                    var e = s(d.total);
                    s(d.autoArrow).removeClass("slick-play slick-pause").add(d.playArrow).add(d.pauseArrow).removeClass("slick-arrow slick-hidden").removeAttr("tabindex aria-disabled").add(a.$prevArrow).add(a.$nextArrow).off("click.slickExtensions"),
                    s(d.current).text(d.currentText).add(e).removeClass("slick-text"),
                    e.text(d.totalText),
                    o.off(".slickExtensions")
                }).on("afterChange.slickExtensions", function(t, i, e) {
                    var n = d.customState
                      , o = a.slideCount
                      , c = (a.currentSlide || 0) + 1;
                    if ("function" == typeof n) {
                        var l = n({
                            current: c,
                            total: o
                        });
                        l || (l = {
                            current: c,
                            total: o
                        }),
                        c = l.current || c,
                        o = l.total || o
                    }
                    s(d.current).text(c),
                    s(d.total).text(o)
                }).on("reInit.slickExtensions breakpoint.slickExtensions", function(t, i) {
                    var e = s(a.$prevArrow)
                      , n = s(a.$nextArrow)
                      , c = s(d.autoArrow)
                      , l = s(d.playArrow)
                      , r = s(d.pauseArrow)
                      , k = c.add(l).add(r)
                      , u = e.add(n);
                    d.arrows ? (k.addClass("slick-arrow").off("click.slickExtensions"),
                    c.on("click.slickExtensions", function(s) {
                        a.paused ? f() : x(),
                        s.preventDefault()
                    }),
                    l.on("click.slickExtensions", function(s) {
                        f(),
                        s.preventDefault()
                    }),
                    r.on("click.slickExtensions", function(s) {
                        x(),
                        s.preventDefault()
                    }),
                    u.off("click.slickExtensions"),
                    u.css("display", "").off("click.slick").on("click.slickExtensions", function(s) {
                        !0 === d.pauseOnArrowClick && x()
                    }),
                    s(d.current).add(d.total).addClass("slick-text"),
                    e.on("click.slickExtensions", function(s) {
                        o.slick("slickPrev"),
                        s.preventDefault()
                    }),
                    n.on("click.slickExtensions", function(s) {
                        o.slick("slickNext"),
                        s.preventDefault()
                    })) : k.addClass("slick-hidden").attr({
                        tabindex: -1,
                        "aria-disabled": !0
                    }),
                    s(a.$dots).css("display", "").children("li").off("click.slickExtensions").on("click.slickExtensions", function(s) {
                        !0 === d.dots && !0 === d.pauseOnDotsClick && x()
                    }),
                    s(a.$slides).off("click.slickExtensions").on("click.slickExtensions", function(s) {
                        !0 === d.focusOnSelect && x()
                    }),
                    o.triggerHandler("afterChange.slickExtensions")
                }).on("swipe.slickExtensions", function(s, t, i) {
                    !0 === d.pauseOnSwipe && x()
                }).on("keydown.slickExtensions", function(s) {
                    if (!0 === d.pauseOnDirectionKeyPush) {
                        var t = this.tagName
                          , i = s.which || s.keyCode;
                        !0 !== d.accessibility || "TEXTAREA" === t || "INPUT" === t || "SELECT" === t || 37 !== i && 39 !== i || x()
                    }
                }).triggerHandler("reInit.slickExtensions"),
                !0 === l.autoplay ? f() : x()
            }
        }
        return i
    }
}(window.jQuery);

//가상키보드
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.findInternal = function(a, b, c) {
    a instanceof String && (a = String(a));
    for (var d = a.length, e = 0; e < d; e++) {
        var f = a[e];
        if (b.call(c, f, e, a))
            return {
                i: e,
                v: f
            }
    }
    return {
        i: -1,
        v: void 0
    }
}
;
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    a != Array.prototype && a != Object.prototype && (a[b] = c.value)
}
;
$jscomp.getGlobal = function(a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
}
;
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(a, b, c, d) {
    if (b) {
        c = $jscomp.global;
        a = a.split(".");
        for (d = 0; d < a.length - 1; d++) {
            var e = a[d];
            e in c || (c[e] = {});
            c = c[e]
        }
        a = a[a.length - 1];
        d = c[a];
        b = b(d);
        b != d && null != b && $jscomp.defineProperty(c, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
}
;
$jscomp.polyfill("Array.prototype.find", function(a) {
    return a ? a : function(a, c) {
        return $jscomp.findInternal(this, a, c).v
    }
}, "es6", "es3");
var NeoVirtualKeyboard = function(a) {
    this.userOptions = a;
    this.defaultOptions = {
        inputElement: null,
        keyLayout: "KOREAN",
        keyLayoutType: "SIMPLE",
        offset: {
            top: 0,
            left: 0
        }
    };
    this.shiftKeyToggle = !1;
    this._init();
    this._inputBindEvent()
};
NeoVirtualKeyboard.prototype = {
    setInputElement: function(a) {
        this._.inputElement = a;
        this.$inputElement = $(a)
    },
    setKeyLayout: function(a) {
        this._.keyLayout = a
    },
    setKeyLayoutType: function(a) {
        this._.keyLayoutType = a
    },
    _inputBindEvent: function() {
        var a = this;
        $('input[type="text"],textarea').on("click", function() {
            a.$inputElement = $(this)
        })
    },
    _init: function() {
        this.HANGUL = {
            OFFSET: 44032,
            LAST_OFFSET: 55203,
            INDEX: {
                I: "\u3131\u3132\u3134\u3137\u3138\u3139\u3141\u3142\u3143\u3145\u3146\u3147\u3148\u3149\u314a\u314b\u314c\u314d\u314e".split(""),
                M: "\u314f\u3150\u3151\u3152\u3153\u3154\u3155\u3156\u3157\u3158\u3159\u315a\u315b\u315c\u315d\u315e\u315f\u3160\u3161\u3162\u3163".split(""),
                F: " \u3131 \u3132 \u3133 \u3134 \u3135 \u3136 \u3137 \u3139 \u313a \u313b \u313c \u313d \u313e \u313f \u3140 \u3141 \u3142 \u3144 \u3145 \u3146 \u3147 \u3148 \u314a \u314b \u314c \u314d \u314e".split(" "),
                CC1: "\u3133\u3135\u3136\u313a\u313b\u313c\u313d\u313e\u313f\u3140\u3144".split(""),
                CC2: "\u3131\u3145 \u3134\u3148 \u3134\u314e \u3139\u3131 \u3139\u3141 \u3139\u3142 \u3139\u3145 \u3139\u314c \u3139\u314d \u3139\u314e \u3142\u3145".split(" "),
                CV1: "\u3158\u3159\u315a\u315d\u315e\u315f\u3162".split(""),
                CV2: "\u3157\u314f \u3157\u3150 \u3157\u3163 \u315c\u3153 \u315c\u3154 \u315c\u3163 \u3161\u3163".split(" ")
            }
        };
        this.KOREAN_LAYOUT = [["\ud55c\uae00"], [["`", "~"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["BACKSPACE", ""]], [["TAB", ""], ["\u3142", "\u3143"], ["\u3148", "\u3149"], ["\u3137", "\u3138"], ["\u3131", "\u3132"], ["\u3145", "\u3146"], ["\u315b", "\u315b"], ["\u3155", "\u3155"], ["\u3151", "\u3151"], ["\u3150", "\u3152"], ["\u3154", "\u3156"], ["[", "{"], ["]", "}"], ["\\", "|"]], [["TRANS", "EN"], ["\u3141", "\u3141"], ["\u3134", "\u3134"], ["\u3147", "\u3147"], ["\u3139", "\u3139"], ["\u314e", "\u314e"], ["\u3157", "\u3157"], ["\u3153", "\u3153"], ["\u314f", "\u314f"], ["\u3163", "\u3163"], [";", ":"], ["'", '"'], ["RETURN", ""]], [["SHIFT_LEFT", ""], ["\u314b", "\u314b"], ["\u314c", "\u314c"], ["\u314a", "\u314a"], ["\u314d", "\u314d"], ["\u3160", "\u3160"], ["\u315c", "\u315c"], ["\u3161", "\u3161"], [",", "<"], [".", ">"], ["/", "?"], ["SHIFT_RIGHT", ""]], [["SPACE", ""]]];
        this.ENGLISH_LAYOUT = [["\uc601\ubb38"], [["`", "~"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["BACKSPACE", ""]], [["TAB", ""], ["q", "Q"], ["w", "W"], ["e", "E"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["[", "{"], ["]", "}"], ["\\", "|"]], [["TRANS", "KO"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], [";", ":"], ["'", '"'], ["RETURN", ""]], [["SHIFT_LEFT", ""], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", "<"], [".", ">"], ["/", "?"], ["SHIFT_RIGHT", ""]], [["SPACE", ""]]];
        this.KEYLAYOUT = [];
        this.KEYLAYOUT.KOREAN = this.KOREAN_LAYOUT;
        this.KEYLAYOUT.ENGLISH = this.ENGLISH_LAYOUT;
        this.neoVirtualKeyboard = [];
        this.neoVirtualKeyboard.MULTI = '<div id="neoVirtualKeyboard" class="neoVK"><span id="selectLang"></span><button type="button" id="neoVirtualKeyboardClose" class="close"></button><ul id="neoVirtualKeyboardLayout" class="clearfix keyboard-layout"></ul></div>';
        this.neoVirtualKeyboard.SIMPLE = '<div id="neoVirtualKeyboard" class="neoVK"><span id="selectLang"></span><button type="button" id="neoVirtualKeyboardClose" class="close"></button><ul id="neoVirtualKeyboardLayout" class="simple clearfix keyboard-layout"></ul></div>';
        this._ = $.extend({}, this.defaultOptions, this.userOptions)
    },
    _assignElement: function() {
        this.$neoVirtualKeyboard = $("#neoVirtualKeyboard");
        this.$neoVirtualKeyboard.css(this._.offset);
        this.$keyboardLayout = this.$neoVirtualKeyboard.find("#neoVirtualKeyboardLayout");
        this.$keyboardSelectLang = this.$neoVirtualKeyboard.find("#selectLang");
        this.$neoVirtualKeyboardClose = this.$neoVirtualKeyboard.find("#neoVirtualKeyboardClose");
        this.$neoVirtualKeyboardClose.text("KOREAN" === this._.keyLayout ? "\ub2eb\uae30" : "Close")
    },
    _createKeyboard: function(a) {
        var b = this;
        this.$keyboardSelectLang.html(this.KEYLAYOUT[a][0]);
        this.$keyboardLayout.empty();
        $.each(this.KEYLAYOUT[a], function(a, d) {
            0 !== a && $.each(d, function(a, c) {
                a = c[0];
                var d = c[1];
                "MULTI" === b._.keyLayoutType ? "BACKSPACE" === a ? b.$keyboardLayout.append('<li><button type="button" id="backspaceKey" class="special-event"><em class="backspace-key">backspace</em></button></li>') : "TAB" === a ? b.$keyboardLayout.append('<li><button type="button" id="tabKey" class="special-event"><em class="tab-key">Tab</em></button></li>') : "TRANS" === a ? b.$keyboardLayout.append('<li><button type="button" id="langConversionKey" class="special-event"><em class="lang-conversion ' + ("KO" === d ? "ko" : "en") + '">ko/en</em></button></li>') : "RETURN" === a ? b.$keyboardLayout.append('<li class="absorption align-left"><button type="button" id="returnKey" class="special-event"><em class="return-key">Return</em></button></li>') : "SHIFT_LEFT" === a ? b.$keyboardLayout.append('<li class="absorption align-right"><button type="button" id="shiftLeftKey" class="special-event ' + (b.shiftKeyToggle ? "active" : "") + '"><em class="shift-key left">Shift</em></button></li>') : "SHIFT_RIGHT" === a ? b.$keyboardLayout.append('<li class="absorption"><button type="button" id="shiftRightKey" class="special-event ' + (b.shiftKeyToggle ? "active" : "") + '"><em class="shift-key right">Shift</em></button></li>') : "SPACE" === a ? b.$keyboardLayout.append('<li class="absorption all"><button type="button" id="spaceKey" class="special-event"><em class="space">Space</em></button></li>') : (a = b.shiftKeyToggle ? c[1] : c[0],
                d = b.shiftKeyToggle ? c[0] : c[1],
                a === d ? b.$keyboardLayout.append('<li><button type="button"><span>' + a + "</span></button></li>") : b.$keyboardLayout.append('<li><button type="button"><span>' + a + "</span><i>" + d + "</i></button></li>")) : "SIMPLE" === b._.keyLayoutType && ("BACKSPACE" === a ? b.$keyboardLayout.append('<li><button type="button" id="backspaceKey" class="special-event"><em class="backspace-key">backspace</em></button></li>') : "TAB" === a ? b.$keyboardLayout.append('<li><button type="button" id="tabKey" class="special-event"><em class="tab-key">Tab</em></button></li>') : "TRANS" === a ? b.$keyboardLayout.append('<li><button type="button" id="langConversionKey" class="special-event"><em class="lang-conversion ' + ("KO" === d ? "ko" : "en") + '">ko/en</em></button></li>') : "RETURN" === a ? b.$keyboardLayout.append('<li class="absorption align-left"><button type="button" id="returnKey" class="special-event"><em class="return-key">Return</em></button></li>') : "SHIFT_LEFT" === a ? b.$keyboardLayout.append('<li class="absorption align-right"><button type="button" id="shiftLeftKey" class="special-event ' + (b.shiftKeyToggle ? "active" : "") + '"><em class="shift-key left">Shift</em></button></li>') : "SHIFT_RIGHT" === a ? b.$keyboardLayout.append('<li class="absorption"><button type="button" id="shiftRightKey" class="special-event ' + (b.shiftKeyToggle ? "active" : "") + '"><em class="shift-key right">Shift</em></button></li>') : "SPACE" === a ? b.$keyboardLayout.append('<li class="absorption all"><button type="button" id="spaceKey" class="special-event"><em class="space">Space</em></button></li>') : (a = b.shiftKeyToggle ? c[1] : c[0],
                b.$keyboardLayout.append('<li><button type="button"><span>' + a + "</span></button></li>")))
            })
        })
    },
    _bindEvent: function() {
        var a = this;
        this.$neoVirtualKeyboard.draggable({
            handle: this.$keyboardSelectLang,
            stop: function() {
                a._.offset = $(this).offset()
            }
        });
        this.$neoVirtualKeyboard.disableSelection();
        this.$keyboardSelectLang.css("cursor", "move");
        this.$keyboardLayout.off("click.NeoVirtualKeyboard");
        this.$keyboardLayout.on("click.NeoVirtualKeyboard", "button", $.proxy(this._clickKeyButton, this));
        this.$neoVirtualKeyboardClose.on("click.NeoVirtualKeyboard", $.proxy(this.hideKeyboard, this))
    },
    changeKeyboard: function(a) {
        this._.keyLayout = a;
        this._createKeyboard(a);
        this._bindEvent()
    },
    hideKeyboard: function() {
        $("#neoVirtualKeyboard").remove()
    },
    showKeyboard: function(a, b) {
        this._ = $.extend({}, this._, b);
        this.setInputElement(this._.inputElement);
        this.setKeyLayout(this._.keyLayout);
        this.setKeyLayoutType(this._.keyLayoutType);
        $("#neoVirtualKeyboard").remove();
        this._.offset.top || this._.offset.left || !a || (this._.offset = {
            top: $(a).offset().top + $(a).height() + 10,
            left: $(a).offset().left
        });
        $("#wrapper").prepend(this.neoVirtualKeyboard[this._.keyLayoutType]);
        this._assignElement();
        this.changeKeyboard(this._.keyLayout)
    },
    _splitFinalSound: function(a) {
        a = this.HANGUL.INDEX.CC2[this.HANGUL.INDEX.CC1.indexOf(a)];
        var b = [];
        if ("undefined" === typeof a)
            return a;
        b[0] = a[0];
        b[1] = a[1];
        return b
    },
    _getComplexConsonantIndex: function(a, b) {
        return "undefined" === typeof b ? this.HANGUL.INDEX.CC1.indexOf(a) : this.HANGUL.INDEX.CC2.indexOf(a + b)
    },
    _getComplexVowelIndex: function(a, b) {
        return "undefined" === typeof b ? this.HANGUL.INDEX.CV1.indexOf(a) : this.HANGUL.INDEX.CV2.indexOf(a + b)
    },
    isHangul: function(a) {
        return this.HANGUL.OFFSET <= a && a <= this.HANGUL.LAST_OFFSET
    },
    combineChar: function(a, b, c) {
        return String.fromCharCode(28 * (21 * a + b) + c + this.HANGUL.OFFSET)
    },
    getInitialSoundIndex: function(a) {
        a = (a.charCodeAt(0) - this.HANGUL.OFFSET) / 28 / 21;
        return parseInt(a, 10)
    },
    getMiddleSoundIndex: function(a) {
        a = (a.charCodeAt(0) - this.HANGUL.OFFSET) / 28 % 21;
        return parseInt(a, 10)
    },
    getFinalSoundIndex: function(a) {
        a = (a.charCodeAt(0) - this.HANGUL.OFFSET) % 28;
        return parseInt(a, 10)
    },
    splitCharIndex: function(a) {
        var b = [0, 0, 0];
        b[0] = this.getInitialSoundIndex(a);
        b[1] = this.getMiddleSoundIndex(a);
        b[2] = this.getFinalSoundIndex(a);
        return b
    },
    isConsonant: function(a) {
        return 12593 <= a && 12622 >= a
    },
    isVowel: function(a) {
        return 12623 <= a && 12643 >= a
    },
    _changeLayoutKey: function(a) {
        return "shiftLeftKey" === a || "shiftRightKey" === a ? (this.shiftKeyToggle = !this.shiftKeyToggle,
        this.changeKeyboard(this._.keyLayout),
        !0) : "langConversionKey" === a ? (a = this._.keyLayout,
        "KOREAN" === a ? a = "ENGLISH" : "ENGLISH" === a && (a = "KOREAN"),
        this.changeKeyboard(a),
        !0) : !1
    },
    _clickFunctionKey: function(a, b, c) {
        "shiftLeftKey" !== b && "shiftRightKey" !== b && "langConversionKey" !== b && this.$inputElement.focus();
        return "tabKey" === b ? (this._inputElementValue(a, "\t", c, !1),
        !0) : "backspaceKey" === b ? (this._inputElementValue(a.substring(0, a.length - 1), "", c, !1),
        !0) : "spaceKey" === b ? (this._inputElementValue(a, " ", c, !1),
        !0) : "returnKey" === b ? keyboardSubmit(a) : !1
    },
    _inputElementValue: function(a, b, c, d) {
        a = d ? a.substring(0, a.length - 1) + b : a + b;
        this.$inputElement.val(a + c);
        this.$inputElement.prop({
            selectionStart: a.length
        });
        this.$inputElement.prop({
            selectionEnd: a.length
        })
    },
    _clickKeyButton: function(a) {
        a = $(a.currentTarget);
        var b = a.prop("id")
          , c = a.find("span").text()
          , d = c.charCodeAt(0);
        if (!this._changeLayoutKey(b) && "undefined" !== typeof this.$inputElement.val()) {
            var e = this.$inputElement.val();
            a = this.$inputElement.prop("selectionStart");
            var f = this.$inputElement.prop("selectionEnd");
            a = e.substring(0, a);
            e = e.substring(f, e.length);
            f = a.substring(a.length - 1);
            var g = f.charCodeAt(0);
            if (!this._clickFunctionKey(a, b, e)) {
                if (this.isConsonant(g)) {
                    if (this.isVowel(d)) {
                        c = this.combineChar(this.HANGUL.INDEX.I.indexOf(f), this.HANGUL.INDEX.M.indexOf(c), 0);
                        this._inputElementValue(a, c, e, !0);
                        return
                    }
                } else if (this.isHangul(g))
                    if (b = this.splitCharIndex(f),
                    0 === b[2]) {
                        if (this.isConsonant(d)) {
                            c = this.combineChar(b[0], b[1], this.HANGUL.INDEX.F.indexOf(c));
                            this._inputElementValue(a, c, e, !0);
                            return
                        }
                        if (this.isVowel(d) && (d = this._getComplexVowelIndex(this.HANGUL.INDEX.M[b[1]], c),
                        -1 !== d)) {
                            c = this.HANGUL.INDEX.M.indexOf(this.HANGUL.INDEX.CV1[d]);
                            c = this.combineChar(b[0], c, 0);
                            this._inputElementValue(a, c, e, !0);
                            return
                        }
                    } else if (this.isConsonant(d)) {
                        if (d = this._getComplexConsonantIndex(this.HANGUL.INDEX.F[b[2]], c),
                        -1 !== d) {
                            c = this.HANGUL.INDEX.F.indexOf(this.HANGUL.INDEX.CC1[d]);
                            c = this.combineChar(b[0], b[1], c);
                            this._inputElementValue(a, c, e, !0);
                            return
                        }
                    } else if (this.isVowel(d)) {
                        f = this._splitFinalSound(this.HANGUL.INDEX.F[b[2]]);
                        "undefined" === typeof f ? (d = this.combineChar(b[0], b[1], 0),
                        c = this.combineChar(this.HANGUL.INDEX.I.indexOf(this.HANGUL.INDEX.F[b[2]]), this.HANGUL.INDEX.M.indexOf(c), 0)) : (d = this.combineChar(b[0], b[1], this.HANGUL.INDEX.F.indexOf(f[0])),
                        c = this.combineChar(this.HANGUL.INDEX.I.indexOf(f[1]), this.HANGUL.INDEX.M.indexOf(c), 0));
                        this._inputElementValue(a, d + c, e, !0);
                        return
                    }
                this._inputElementValue(a, c, e, !1)
            }
        }
    }
};

function keyboardSubmit(a) {
    var frm = document.searchForm;
    frm.query.value = a;
    frm.submit();
}

//테스트 메뉴
(function($) {
    'use strict';

    var $window = $(window)
      , $html = $('html');

    $(function() {
        //lnb
        var $header = $('#header'), $lnb = $header.find('.lnb'), $lnbTabItem = $lnb.find('.tab_item'), $lnbNavItem = $lnbTabItem.eq(0), $lnbTabContent = $lnb.find('.tab_content'), $lnbNavContent = $lnbTabContent.eq(0), $lnbShow = $lnb.find('.menu_show'), $lnbShowBtn = $lnbShow.find('.menu_btn'), $lnbHide = $lnb.find('.menu_hide'), $lnbHideBtn = $lnbHide.find('.menu_btn'), $lnbDepthItem = $lnb.find('.depth_item'), $lnbMenu = $lnb.find('.menu'), $lnbOther = $header.find('.logo_anchor, .sitemap_show'), $lnbDepth2FirstChild = $lnbMenu.find('.depth2 > :first-child'), $lnbSpy = $lnbMenu.find('.spy:last'), lnbHeight;

        if ($('body').hasClass('sotong')) {
            var depth1ListLenght = $lnb.find('.depth1_item').length - 1;
        } else {
            var depth1ListLenght = $lnb.find('.depth1_item').length - 2;
        }

        $lnb.addClass('length' + depth1ListLenght);

        if (depth1ListLenght <= 5) {
            $html.addClass('min');
        } else {
            $html.addClass('max');
        }

        $lnbSpy.parents('.depth_item').addClass('actived');

        function refreshLnbHeight() {
            lnbHeight = $lnbMenu.css('transition-property', 'none').removeClass('init').outerHeight() || '';

            $lnbMenu.css('transition-property', '').addClass('init');
        }

        $lnbShowBtn.on('click.menu', function(event) {
            //클래스 토글
            $html.toggleClass('lnb_show lnb_open');

            //추가 분기 추가필요함
            // if(site.id === 'main' || site.id === 'public'){
            //     if($lnbDepthItem.hasClass('depth1_item')) {
            //         $lnbMenu.find('.depth1_item:first-child').addClass('active');
            //     }
            // }

            $lnbMenu.find('.depth1_item').css('margin-left', '');
        });

        $lnbHideBtn.on('click.menu', function(event) {
            //클래스 토글
            $html.removeClass('lnb_show lnb_open');
            //$html.removeClass('lnb_open');
        });

        $window.on('screen:wide.menu screen:web.menu', function(event) {
            window.mode = 'pc';
            $html.removeClass('lnb_show lnb_open');

            $lnbTabItem.removeClass('active');
            $lnbNavItem.addClass('active');

            $lnbTabContent.removeClass('active');
            $lnbNavContent.addClass('active');
        });

        $window.on('screen:tablet.menu screen:phone.menu', function(event) {
            window.mode = 'mobile';
            //$html.removeClass('lnb_show lnb_open');
        });

        $lnbDepthItem.on('mouseover.menu focusin.menu', function(event) {
            //mouseover
            if (mode === 'pc') {
                var $this = $(this)
                  , $depth1Item = ($this.hasClass('depth1_item')) ? $this : $this.parents('.depth1_item');

                if ($lnbMenu.hasClass('pulldown')) {
                    var maxHeight = 0;

                    $lnbDepth2FirstChild.each(function(index, element) {
                        var $element = $(element)
                          , outerHeight = $element.outerHeight() || 0;

                        //기존 값 보다 얻은 값이 초과일 때
                        if (outerHeight > maxHeight) {
                            maxHeight = outerHeight;
                        }
                    });

                    $lnbMenu.height(lnbHeight + maxHeight);
                } else if ($lnbMenu.hasClass('eachdown')) {
                    $lnbMenu.height(lnbHeight + ($depth1Item.find('.depth2 > :first-child').outerHeight() || ''));
                }

                $html.addClass('lnb_open');
                $lnbDepthItem.removeClass('active');
                $this.addClass('active').parents('li').addClass('active');
            }

            event.stopPropagation();
        }).on('click.menu', function(event) {
            if (mode === 'mobile') {
                var $this = $(this)
                  , $depthText = $this.children('.depth_text')
                  , eventTarget = event.target;

                if ($depthText.find(eventTarget).length || $depthText[0] === eventTarget) {
                    /*
                    if($this.hasClass('depth1_item')) {
                        if($this.hasClass('active')) {
                            $html.removeClass('lnb_open');
                        }else{
                            $html.addClass('lnb_open');
                        }
                    }
                    */
                    if ($this.children('.depth').length) {
                        if ($this.hasClass('depth1_item')) {
                            /* addClass > toggle 변경*/
                            $this.toggleClass('active').siblings('.depth_item').removeClass('active');
                        } else {
                            $this.toggleClass('active').siblings('.depth_item').removeClass('active');
                        }
                        event.preventDefault();
                    }
                }
            }

            event.stopPropagation();
        }).each(function(index, element) {
            var $element = $(element);

            if ($element.children('.depth').length) {
                $element.addClass('has');
            }
        });

        $lnbOther.on('focusin.menu', function(event) {
            $lnbMenu.height('');
            $html.removeClass('lnb_open');
            $lnbDepthItem.removeClass('active');
        })

        $lnbMenu.find('.depth1_item:last-child .depth2 .depth2_list .depth2_item:last-child .depth2_text').on('focusout', function(event) {
            if (mode === 'pc') {
                $lnbMenu.height('');
                $html.removeClass('lnb_open');
                $lnbDepthItem.removeClass('active');
            }
        });

        $lnbMenu.on('mouseleave.menu', function(event) {
            //mouseleave
            if (mode === 'pc') {
                $lnbMenu.height('');
                $html.removeClass('lnb_open');
                $lnbDepthItem.removeClass('active');
            }
        });

        $window.on('screen:wide.menu screen:web.menu', function(event) {
            refreshLnbHeight();

            if ($lnbSpy.length) {
                $html.removeClass('lnb_open');
                $lnbSpy.parents('.depth_item').removeClass('active');
            }
        });

        $window.on('screen:tablet.menu screen:phone.menu', function(event) {
            refreshLnbHeight();

            if ($lnbSpy.length) {
                $html.addClass('lnb_open');
                $lnbSpy.parents('.depth_item').addClass('active');
            }
        });

        //뎁스3 개수 많을때
        var $depth3List = $lnb.find('.depth3_list');

        $depth3List.each(function() {
            if ($('.depth3_item', this).length > 8) {
                $(this).parent().parent('.depth2_item').addClass('wide');
            }
        });

        //사이드
        var $container = $('#container')
          , $side = $container.find('.side')
          , $sideDepthItem = $side.find('.depth_item')
          , $sideMenu = $side.find('.menu').addClass('init')
          , $sideSpy = $sideMenu.find('.spy:last');

        $sideDepthItem.on('click.menu', function(event) {
            var $this = $(this)
              , $depthText = $this.children('.depth_text')
              , eventTarget = event.target;

            if ($depthText.find(eventTarget).length || $depthText[0] === eventTarget) {
                if ($this.hasClass('depth1_item')) {
                    if ($this.hasClass('active')) {
                        $html.removeClass('side_open');
                    } else {
                        $html.addClass('side_open');
                    }
                }

                if ($this.children('.depth').length) {
                    $this.toggleClass('active').siblings('.depth_item').removeClass('active');

                    //임시 코드
                    if ($this.children('a').attr('href') == '/www/contents.do?key=65' || $this.children('a').attr('href') == '/www/contents.do?key=7060' || $this.children('a').attr('href') == '/www/contents.do?key=2176' || $this.children('a').attr('href') == '/www/contents.do?key=5840' || $this.children('a').attr('href') == '/www/contents.do?key=5841') {//alert($this.children('a').attr('href'));
                    } else {
                        event.preventDefault();
                    }
                }
            }

            event.stopPropagation();
        }).each(function(index, element) {
            var $element = $(element);

            if ($element.children('.depth').length) {
                $element.addClass('has');
            }

            /**/
            if ($element.children('.active').length) {
                $element.addClass('active');
            }
        });

        if ($sideSpy.length) {
            $html.addClass('side_open');
            $sideSpy.parents('.depth_item').addClass('active');
        }

    });
}
)(window.jQuery);
