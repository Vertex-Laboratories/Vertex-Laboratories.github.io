(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _intro = require('./modules/intro');

var _intro2 = _interopRequireDefault(_intro);

var _scrollController = require('./modules/scroll-controller');

var _scrollController2 = _interopRequireDefault(_scrollController);

var _pubSub = require('./modules/pub-sub');

var _animations = require('./modules/animations');

var _pagination = require('./modules/pagination');

var _fp = require('./modules/fp');

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EVENTS_LIST = 'wheel';
var $root = $('body');
var $paginationsLinks = $('.pagination__link');
var mq = window.matchMedia('(min-width: 1024px)');
var introState = null; // (swiched between 1 and 2)
var lastSectionName = null;

// functions
function disableScroll() {
    if (!mq.matches) return;
    _scrollController2.default.disable();
    $.fn.fullpage.setAllowScrolling(false);
    $.fn.fullpage.setKeyboardScrolling(false);
}

function enableScroll() {
    _scrollController2.default.enable();
    $.fn.fullpage.setAllowScrolling(true);
    $.fn.fullpage.setKeyboardScrolling(true);
}

function windowResizeHandler(e) {
    var matches = e.matches;
    if (matches) {
        (0, _animations.setAnimationsProgress)(0);
        (0, _fp2.default)();
        $root.removeClass('mobile');
    } else {
        // complete animations for section on mobile
        $root.addClass('mobile');
        (0, _animations.setAnimationsProgress)(1);
        _intro2.default.animation.progress(0).pause();
        _intro2.default.disableParallax();
        _scrollController2.default.enable();
        introState = null;
        _pubSub.pubSub.removeListener(_pubSub.eventsNames.WHEEL_START, scrollHandlerWhenOnIntro);
        if (typeof $.fn.fullpage.destroy === 'function') {
            $.fn.fullpage.destroy('all');
        }
        $('.links.is-dark').removeClass('is-dark');
    }
    _intro2.default.toggleIntroTextVisibility();
}

function scrollHandlerWhenOnIntro(e) {
    var direction = _scrollController2.default.getDirection();

    switch (direction) {
        case 'up':
            _pubSub.pubSub.emit(_pubSub.eventsNames.INTRO_FIRST_STATE);
            break;
        case 'down':
            if (introState === 2) $.fn.fullpage.moveSectionDown();
            _pubSub.pubSub.emit(_pubSub.eventsNames.INTRO_SECOND_STATE);
            break;
    }
}

// events
mq.addListener(function (e) {
    windowResizeHandler(e);
});

_pubSub.pubSub.on(_pubSub.eventsNames.FP_INIT, function (props) {
    var slides = props.slides;

    var activeSlide = slides.filter('.active');

    activeSlide.prevAll().addClass('prev');
    activeSlide.nextAll().addClass('next');

    $('.scroll-down').on('click touchend', function (e) {
        e.preventDefault();
        $paginationsLinks.eq(1).trigger('click');
    });

    $('.intro__main-text .btn').on('click touchend', $.fn.fullpage.moveSectionDown);

    $('.header__link').on('click', function (e) {
        e.preventDefault();
        $paginationsLinks.first().trigger('click');
    });

    $paginationsLinks.on('click', function (e) {
        var $this = $(this);

        e.preventDefault();

        switch ($this.index()) {
            case 0:
                setTimeout(function () {
                    _pubSub.pubSub.emit(_pubSub.eventsNames.INTRO_FIRST_STATE);
                }, 100);
                break;
            case 1:
                $.fn.fullpage.moveTo(1);
                setTimeout(function () {
                    _pubSub.pubSub.emit(_pubSub.eventsNames.INTRO_SECOND_STATE);
                }, 100);
                return;
        }

        $.fn.fullpage.moveTo(this.hash.slice(1));
    });
});

_pubSub.pubSub.on(_pubSub.eventsNames.INTRO_FIRST_STATE, function () {
    var progress = _intro2.default.animation.progress();

    setTimeout(function () {
        return _pagination.pagination.toggle(0);
    }, 700);

    if (introState === 1) return;

    _intro2.default.animation.reverse();
    _intro2.default.enableParallax();

    introState = 1;
});

_pubSub.pubSub.on(_pubSub.eventsNames.INTRO_SECOND_STATE, function () {
    var progress = _intro2.default.animation.progress();

    setTimeout(function () {
        return _pagination.pagination.toggle(1);
    }, 700);

    if (introState === 2) return;

    _intro2.default.disableParallax();
    _intro2.default.animation.play();

    introState = 2;
});

_pubSub.pubSub.on(_pubSub.eventsNames.FP_BEFORE_CHANGE, function (props) {
    var slide = props.slide;
    var direction = props.direction;
    var nextIndex = props.nextIndex;

    slide.prevAll().removeClass('next').addClass('prev');
    slide.nextAll().removeClass('prev').addClass('next');

    switch (direction) {
        case 'down':
            slide.addClass('prev');
            break;
        case 'up':
            slide.addClass('next');
            break;
    }
});

_pubSub.pubSub.on(_pubSub.eventsNames.FP_AFTER_CHANGE, function (props) {
    var slide = props.slide;
    var index = props.index;
    var anchorLink = props.anchorLink;

    var sectionAnim = _animations.animations[anchorLink];
    var prevSectionAnim = _animations.animations[lastSectionName];

    slide.removeClass('prev next');

    if (mq.matches) {
        if (sectionAnim) sectionAnim.play();
        if (prevSectionAnim) prevSectionAnim.progress(0).pause();
    }

    if (index !== 1) {
        _pagination.pagination.toggle(index - 1, true);
    }

    lastSectionName = anchorLink;
});

_pubSub.pubSub.on(_pubSub.eventsNames.FP_INTRO_FOCUSIN, function (props) {
    var index = props.index;
    var prevIndex = props.prevIndex;

    $('.links, .pagination').removeClass('is-dark');

    setTimeout(disableScroll, 0);
    _pubSub.pubSub.on(_pubSub.eventsNames.WHEEL_START, scrollHandlerWhenOnIntro);
    if (prevIndex === 2) _pagination.pagination.toggle(1);
});

_pubSub.pubSub.once(_pubSub.eventsNames.FP_INTRO_FOCUSIN, function (props) {
    var prevIndex = props.prevIndex;

    if (prevIndex === null) _pubSub.pubSub.emit(_pubSub.eventsNames.INTRO_FIRST_STATE);
});

_pubSub.pubSub.on(_pubSub.eventsNames.FP_INTRO_FOCUSOUT, function (props) {
    $('.links, .pagination').addClass('is-dark');
    _pubSub.pubSub.removeListener(_pubSub.eventsNames.WHEEL_START, scrollHandlerWhenOnIntro);
    enableScroll();
    if (mq.matches) {
        _pubSub.pubSub.emit(_pubSub.eventsNames.INTRO_SECOND_STATE);
    }
});

// initial actions
$(document).ready(function () {
    $('body').addClass('in');

    $('.header__link').on('click', function (e) {
        if (mq.matches) return;
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

    setTimeout(function () {
        return _intro2.default.demonstarateParallax(!mq.matches);
    }, 1000);
});

windowResizeHandler(mq);

},{"./modules/animations":3,"./modules/fp":4,"./modules/intro":5,"./modules/pagination":6,"./modules/pub-sub":7,"./modules/scroll-controller":8}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createHeadingAnimFor = createHeadingAnimFor;
exports.createAboutAnimFor = createAboutAnimFor;
function createHeadingAnimFor(context) {
    var heading = context.find('.project__heading');
    var ease = Power3.easeOut;

    TweenMax.set(heading, { y: -220, autoAlpha: 0 });

    return TweenMax.to(heading, 0.3, {
        y: 0,
        autoAlpha: 1,
        ease: ease
    });
}

function createAboutAnimFor(context) {
    var title = context.find('.project__about .h3');
    var line = context.find('.project__about-line');
    var description = context.find('.project__description');
    var btn = context.find('.project__about .btn');
    var ease = Power3.easeOut;

    TweenMax.set([title, line, description, btn], { x: -150, autoAlpha: 0 });

    return [TweenMax.to(title, 0.5, {
        x: 0,
        autoAlpha: 1,
        ease: ease
    }), TweenMax.to(line, 0.5, {
        x: 0,
        autoAlpha: 1,
        delay: 0.1,
        ease: ease
    }), TweenMax.to(description, 0.5, {
        x: 0,
        autoAlpha: 1,
        delay: 0.2,
        ease: ease
    }), TweenMax.to(btn, 0.5, {
        x: 0,
        autoAlpha: 1,
        delay: 0.25,
        ease: ease
    })];
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.animations = undefined;
exports.setAnimationsProgress = setAnimationsProgress;

var _animationsBase = require('./animations-base');

var $qmedic = $('.project[data-animations=qmedic]');
var $milkyway = $('.project[data-animations=milkyway]');
var $rexpro = $('.project[data-animations=rexpro]');

var qmedic = new TimelineMax({ paused: true });
var milkyway = new TimelineMax({ paused: true });
var rexpro = new TimelineMax({ paused: true });

var ease = Power3.easeOut;

qmedic.add((0, _animationsBase.createHeadingAnimFor)($qmedic)).fromTo($qmedic.find('.project__image'), 0.5, {
    yPercent: 50,
    opacity: 0
}, {
    yPercent: 0,
    opacity: 1,
    ease: ease
}).fromTo($qmedic.find('.project__bg'), 0.5, {
    yPercent: 100,
    opacity: 0
}, {
    yPercent: 0,
    opacity: 1,
    ease: ease
}, '-=0.2').add((0, _animationsBase.createAboutAnimFor)($qmedic), '-=0.5');

milkyway.add((0, _animationsBase.createHeadingAnimFor)($milkyway)).add([TweenMax.fromTo($milkyway.find('.milkyway'), 0.6, {
    yPercent: 150,
    opacity: 0
}, {
    yPercent: 0,
    opacity: 1,
    ease: ease
}), TweenMax.fromTo($milkyway.find('.milkyway__layer-0'), 0.6, {
    x: 200
}, {
    x: 0,
    ease: ease
}), TweenMax.fromTo($milkyway.find('.milkyway__layer-2'), 0.3, {
    x: -200,
    opacity: 0
}, {
    x: 0,
    delay: 0.3,
    opacity: 1,
    ease: ease
}), TweenMax.fromTo($milkyway.find('.bg-milkyway__layer-1'), 0.3, {
    xPercent: 100,
    opacity: 0
}, {
    xPercent: 0,
    delay: 0.3,
    opacity: 1,
    ease: ease
}), TweenMax.fromTo($milkyway.find('.milkyway__layer-1'), 0.3, {
    yPercent: 100,
    opacity: 0
}, {
    yPercent: 0,
    delay: 0.5,
    opacity: 1,
    ease: ease
})]).add([TweenMax.fromTo($milkyway.find('.bg-milkyway__layer-2'), 0.4, {
    yPercent: 100,
    opacity: 0
}, {
    yPercent: 0,
    opacity: 1,
    ease: ease
}), (0, _animationsBase.createAboutAnimFor)($milkyway)], '-=0.3');

rexpro.add((0, _animationsBase.createHeadingAnimFor)($rexpro)).addLabel('begin', 0).fromTo($rexpro.find('.bg-rex-pro__layer-2'), 0.6, {
    xPercent: -100
}, {
    xPercent: 0,
    ease: ease
}).fromTo($rexpro.find('.project__image'), 0.5, {
    yPercent: 70,
    opacity: 0
}, {
    yPercent: 0,
    opacity: 1,
    ease: ease
}, 'begin+=0.2').fromTo($rexpro.find('.bg-rex-pro__layer-3'), 0.6, {
    opacity: 0
}, {
    opacity: 1,
    ease: ease
}, 'begin+=0.5').add((0, _animationsBase.createAboutAnimFor)($rexpro), 'begin+=0.5');

// return all Timelines include Timeline from ./intro.js
var animations = exports.animations = {
    qmedic: qmedic,
    milkyway: milkyway,
    rexpro: rexpro
};

function setAnimationsProgress() {
    var val = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    for (var key in animations) {
        if (!animations.hasOwnProperty(key) || key === 'intro') continue;
        animations[key].progress(val);
    }
}

},{"./animations-base":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = activateFullpage;

var _pubSub = require('./pub-sub');

function activateFullpage() {
    var fp = $('#fullpage');
    var slides = fp.find('.section');
    var slideCount = slides.length;
    var directionBefore = null;
    var prevIndex = null;

    fp.fullpage({
        verticalCentered: false,
        scrollingSpeed: 700,
        anchors: ['intro', 'qmedic', 'milkyway', 'rexpro'],
        autoScrolling: true,
        scrollBar: false,
        fixedElements: null,
        navigation: false,
        navigationPosition: 'right',
        responsiveWidth: 1024,
        // responsiveHeight: 650,
        recordHistory: true,
        fitToSection: true,
        easingcss3: 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
        onLeave: function onLeave(index, nextIndex, direction) {
            var props = {
                slide: this,
                index: index,
                nextIndex: nextIndex,
                direction: direction,
                slideCount: slideCount
            };

            if (index === 1) {
                _pubSub.pubSub.emit(_pubSub.eventsNames.FP_INTRO_FOCUSOUT, props);
            }

            _pubSub.pubSub.emit(_pubSub.eventsNames.FP_BEFORE_CHANGE, props);

            directionBefore = direction;
            prevIndex = index;
        },
        afterLoad: function afterLoad(anchorLink, index) {
            var props = { slide: this, anchorLink: anchorLink, index: index, prevIndex: prevIndex, directionBefore: directionBefore };

            if (index === 1) _pubSub.pubSub.emit(_pubSub.eventsNames.FP_INTRO_FOCUSIN, props);
            _pubSub.pubSub.emit(_pubSub.eventsNames.FP_AFTER_CHANGE, props);
        },
        afterRender: function afterRender() {
            _pubSub.pubSub.emit(_pubSub.eventsNames.FP_INIT, { slides: slides });
        }
    });
}

},{"./pub-sub":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pubSub = require('./pub-sub');

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

exports.default = (function () {
    var $intro = $('.intro');
    var $chars = $intro.find('.parallax__row .char:not(.char-placeholder)');
    var $charsA = $intro.find('.char-a');
    var $parallaxIn = $intro.find('.parallax__inner');
    var $parallaxL1 = $intro.find('.parallax__layer-1');
    var $parallaxL2 = $intro.find('.parallax__layer-2');
    var $parallaxL3 = $intro.find('.parallax__layer-3');
    var $parallaxSt = $intro.find('.parallax__layer-static');
    var $text = $intro.find('.intro__main-text');
    var $button = $text.find('.btn');
    var $triangle = $intro.find('.intro__triangle .svg-icon');
    var animation = new TimelineMax({ paused: true });
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    var parallaxActive = false;
    var allowParallax = false;

    // animations properties for each character in words 'coming soon'
    var deltaYForChar = 300;
    var animProp = [
    // m
    {
        duration: 0.2,
        delay: 0.4,
        y: -deltaYForChar
    },
    // i
    {
        duration: 0.2,
        delay: 0.5,
        y: -deltaYForChar
    },
    // o
    {
        duration: 0.2,
        delay: 0.4,
        y: deltaYForChar
    },
    // c
    {
        duration: 0.4,
        delay: 0,
        y: -deltaYForChar
    },
    // o
    {
        duration: 0.4,
        delay: 0.175,
        y: -deltaYForChar
    },

    // n
    {
        duration: 0.25,
        delay: 0.25,
        y: -deltaYForChar
    },
    // g
    {
        duration: 0.3,
        delay: 0.3,
        y: -deltaYForChar
    },
    // s
    {
        duration: 0.4,
        delay: 0.05,
        y: deltaYForChar
    },

    // o
    {
        duration: 0.35,
        delay: 0.2,
        y: deltaYForChar
    },
    // n
    {
        duration: 0.2,
        delay: 0.35,
        y: deltaYForChar
    }];

    $(window).on('resize', (0, _lodash2.default)(_updateAnimation, 300));

    animation.add(animProp.map(function (props, i) {
        return TweenMax.to($chars[i], props.duration, {
            y: props.y,
            delay: props.delay,
            opacity: 0,
            ease: Power1.easeInOut
        });
    }, 0)).add(function () {
        return $intro.toggleClass('is-animated');
    }).add([TweenMax.fromTo($charsA[0], 0.5, {
        x: 0
    }, {
        x: window.innerWidth / 2,
        ease: Power1.easeInOut
    }), TweenMax.fromTo($charsA[1], 0.5, {
        x: 0
    }, {
        x: -window.innerWidth / 2,
        ease: Power1.easeInOut
    }), TweenMax.to($triangle, 0.5, {
        scale: 0.625
    })], '-=0.1').fromTo($text, 0.5, {
        autoAlpha: 0
    }, {
        autoAlpha: 1
    }).fromTo($button, 0.4, {
        y: 100,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        ease: Power1.easeInOut
    }, '-=0.3').add(function () {
        _pubSub.pubSub.emit(_pubSub.eventsNames.INTRO_END_ANIMATIONS, { animation: animation });
    });

    function _rotateLayers(e) {
        var posY = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        var pageX, pageY, x, y, angleX, angleY, dur;

        if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object') {
            pageX = e.pageX;
            pageY = e.pageY;
        } else {
            pageX = e;
            pageY = posY;
        }

        x = pageX - window.innerWidth / 2;
        y = pageY - window.innerHeight / 2;
        angleY = -x * 0.008;
        angleX = y * 0.008;
        dur = 0.5;

        TweenMax.to($parallaxL1, dur, {
            x: x * 0.005,
            y: y * 0.005,
            rotationX: angleX + 'deg',
            rotationY: angleY + 'deg'
        });
        TweenMax.to($parallaxL2, dur, {
            x: -x * 0.01,
            y: -y * 0.01,
            rotationX: angleX + 'deg',
            rotationY: angleY + 'deg'
        });
        TweenMax.to($parallaxL3, dur, {
            x: -x * 0.025,
            y: -y * 0.025,
            rotationX: angleX + 'deg',
            rotationY: angleY + 'deg'
        });
        if (isSafari) {
            TweenMax.to($parallaxSt, dur, {
                x: -x * 0.015,
                y: -y * 0.015,
                rotationX: angleX + 'deg',
                rotationY: angleY + 'deg'
            });
        }
    }

    function _updateAnimation(e) {
        var tweens = animation.getTweensOf($charsA);
        var tween1 = tweens[0];
        var tween2 = tweens[1];
        var newX = window.innerWidth / 2;
        var progress = animation.progress();
        // animation was played at least once
        if (_typeof(tweens[0].vars.css) === 'object') {
            tween1.vars.css.x = newX;
            tween2.vars.css.x = -newX;
            tween1.invalidate().progress(progress);
            tween2.invalidate().progress(progress);
        } else {
            tween1.updateTo({ x: newX });
            tween2.updateTo({ x: -newX });
        }
    }

    function enableParallax() {
        if (!allowParallax || parallaxActive) return;
        $(document).on('mousemove', _rotateLayers);
        parallaxActive = true;
    }

    function disableParallax() {
        if (!parallaxActive) return;
        $(document).off('mousemove', _rotateLayers);
        TweenMax.to([$parallaxL1, $parallaxL2, $parallaxL3], 0.5, {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0
        });
        if (isSafari) {
            TweenMax.to($parallaxSt, 0.5, {
                x: 0,
                y: 0,
                rotationY: 0,
                rotationX: 0
            });
        }
        parallaxActive = false;
    }

    function toggleParallax() {
        if (parallaxActive) {
            disableParallax();
        } else {
            enableParallax();
        }
    }

    function demonstarateParallax(makeAllowOnly) {
        _rotateLayers(0, 0);
        allowParallax = true;
        enableParallax();
        // let width = window.innerWidth;
        // let height = window.innerHeight;
        //
        // if (makeAllowOnly) {
        //     allowParallax = true;
        //     return;
        // }
        //
        // _rotateLayers(0, 0);
        // setTimeout(() => _rotateLayers(width/2, height/2), 500);
        // setTimeout(() => _rotateLayers(width / 4, height / 4), 1000);
        // setTimeout(() => {
        //     allowParallax = true;
        //     enableParallax();
        // }, 1500);
    }

    function toggleIntroTextVisibility() {
        var opacity = $text[0].style.opacity;
        var visible = opacity === '1';
        TweenMax.set($text, {
            autoAlpha: visible ? 0 : 1
        });
        TweenMax.set($button, {
            opacity: visible ? 0 : 1,
            y: 0
        });
    }

    return {
        enableParallax: enableParallax,
        disableParallax: disableParallax,
        toggleParallax: toggleParallax,
        animation: animation,
        toggleIntroTextVisibility: toggleIntroTextVisibility,
        demonstarateParallax: demonstarateParallax
    };
})();

},{"./pub-sub":7,"lodash.debounce":10}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var pagination = exports.pagination = (function () {
    var fakeDotIndex = 2;
    var activeClass = 'is-active';
    var $dots = $('.pagination__link');
    var $dotsReal = $dots.not(':nth-child(' + fakeDotIndex + ')');

    function toggle(index) {
        var real = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        var $targetDots = real ? $dotsReal : $dots;
        if (typeof index !== 'number' && !isFinite(index)) return;
        $dots.filter('.' + activeClass).removeClass(activeClass);
        $targetDots.eq(index).addClass(activeClass);
    }

    function reset() {
        $dots.filter('.' + activeClass).removeClass(activeClass);
    }

    return {
        toggle: toggle,
        reset: reset
    };
})();

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eventsNames = exports.pubSub = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pubSub = exports.pubSub = new _events2.default();

var eventsNames = exports.eventsNames = {
    INTRO_END_ANIMATIONS: 'introAnimEnd',
    INTRO_FIRST_STATE: 'introFirstState',
    INTRO_SECOND_STATE: 'introSecondState',
    FP_INTRO_FOCUSIN: 'fpIntroFocusIn',
    FP_INTRO_FOCUSOUT: 'fpIntroFocusOut',
    FP_BEFORE_CHANGE: 'fpBeforeChange',
    FP_AFTER_CHANGE: 'fpAfterChange',
    FP_LOOP_TOP: 'fpLoopTop',
    FP_INIT: 'fpInit',
    WHEEL_START: 'wheel.start',
    WHEEL_END: 'wheel.end'
};

},{"events":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _pubSub = require('./pub-sub');

exports.default = (function () {
    var $root = $('body');
    var disabled = false;
    var direction = null;
    var scrollPos = $(window).scrollTop();
    var prevDeltaY = null; // need for fix bug when scrolling from touchpad
    var wheeling = null;

    $root.on('wheel', function (e) {
        _detectScrollDirection(e);
        if (!wheeling) {
            // start of wheeling
            _pubSub.pubSub.emit(_pubSub.eventsNames.WHEEL_START, e, direction);
        }
        clearTimeout(wheeling);
        wheeling = setTimeout(function () {
            // end of wheeling
            wheeling = null;
            _pubSub.pubSub.emit(_pubSub.eventsNames.WHEEL_END, e, direction);
            direction = null;
        }, 100);
    });

    $root.on('scroll', function (e) {
        scrollPos = $(window).scrollTop();
    });

    function _preventScroll(e) {
        e.preventDefault();
    }

    function _detectScrollDirection(e) {
        var deltaY = e.originalEvent.deltaY;
        if (deltaY < 0) {
            direction = 'up';
        } else if (deltaY > 0) {
            direction = 'down';
        } else {
            direction = prevDeltaY < 0 ? 'up' : 'down';
        }
        prevDeltaY = deltaY;
    }

    function disable() {
        if (disabled) return;
        $root.on('wheel', _preventScroll);
        disabled = true;
    }

    function enable() {
        if (!disabled) return;
        $root.off('wheel', _preventScroll);
        disabled = false;
    }

    function isDisabled() {
        return disabled;
    }

    function getScrollPos() {
        return scrollPos;
    }

    function getDirection(argument) {
        return direction;
    }

    return {
        disable: disable,
        enable: enable,
        isDisabled: isDisabled,
        getDirection: getDirection,
        getScrollPos: getScrollPos
    };
})();

},{"./pub-sub":7}],9:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],10:[function(require,module,exports){
/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = require('lodash._getnative');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeNow = getNative(Date, 'now');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Date
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => logs the number of milliseconds it took for the deferred function to be invoked
 */
var now = nativeNow || function() {
  return new Date().getTime();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed invocations. Provide an options object to indicate that `func`
 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
 * Subsequent calls to the debounced function return the result of the last
 * `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading
 *  edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
 *  delayed before it is invoked.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // ensure `batchLog` is invoked once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }));
 *
 * // cancel a debounced call
 * var todoChanges = _.debounce(batchLog, 1000);
 * Object.observe(models.todo, todoChanges);
 *
 * Object.observe(models, function(changes) {
 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
 *     todoChanges.cancel();
 *   }
 * }, ['delete']);
 *
 * // ...at some point `models.todo` is changed
 * models.todo.completed = true;
 *
 * // ...before 1 second has passed `models.todo` is deleted
 * // which cancels the debounced `todoChanges` call
 * delete models.todo;
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = wait < 0 ? 0 : (+wait || 0);
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = !!options.leading;
    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    lastCalled = 0;
    maxTimeoutId = timeoutId = trailingCall = undefined;
  }

  function complete(isCalled, id) {
    if (id) {
      clearTimeout(id);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (isCalled) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = undefined;
      }
    }
  }

  function delayed() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0 || remaining > wait) {
      complete(trailingCall, maxTimeoutId);
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  }

  function maxDelayed() {
    complete(trailing, timeoutId);
  }

  function debounced() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0 || remaining > maxWait;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = undefined;
    }
    return result;
  }
  debounced.cancel = cancel;
  return debounced;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = debounce;

},{"lodash._getnative":11}],11:[function(require,module,exports){
/**
 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = getNative;

},{}]},{},[1])

