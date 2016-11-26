! function e(t, n, i) {
    function o(a, s) {
        if (!n[a]) {
            if (!t[a]) {
                var u = "function" == typeof require && require;
                if (!s && u) return u(a, !0);
                if (r) return r(a, !0);
                var l = new Error("Cannot find module '" + a + "'");
                throw l.code = "MODULE_NOT_FOUND", l
            }
            var c = n[a] = {
                exports: {}
            };
            t[a][0].call(c.exports, function(e) {
                var n = t[a][1][e];
                return o(n ? n : e)
            }, c, c.exports, e, t, n, i)
        }
        return n[a].exports
    }
    for (var r = "function" == typeof require && require, a = 0; a < i.length; a++) o(i[a]);
    return o
}({
    1: [function(e, t, n) {
        "use strict";

        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o() {
            g.matches && (d["default"].disable(), $.fn.fullpage.setAllowScrolling(!1), $.fn.fullpage.setKeyboardScrolling(!1))
        }

        function r() {
            d["default"].enable(), $.fn.fullpage.setAllowScrolling(!0), $.fn.fullpage.setKeyboardScrolling(!0)
        }

        function a(e) {
            var t = e.matches;
            t ? ((0, p.setAnimationsProgress)(0), (0, _["default"])(), y.removeClass("mobile")) : (y.addClass("mobile"), (0, p.setAnimationsProgress)(1), l["default"].animation.progress(0).pause(), l["default"].disableParallax(), d["default"].enable(), b = null, f.pubSub.removeListener(f.eventsNames.WHEEL_START, s), "function" == typeof $.fn.fullpage.destroy && $.fn.fullpage.destroy("all"), $(".links.is-dark").removeClass("is-dark")), l["default"].toggleIntroTextVisibility()
        }

        function s(e) {
            var t = d["default"].getDirection();
            switch (t) {
                case "up":
                    f.pubSub.emit(f.eventsNames.INTRO_FIRST_STATE);
                    break;
                case "down":
                    2 === b && $.fn.fullpage.moveSectionDown(), f.pubSub.emit(f.eventsNames.INTRO_SECOND_STATE)
            }
        }
        var u = e("./modules/intro"),
            l = i(u),
            c = e("./modules/scroll-controller"),
            d = i(c),
            f = e("./modules/pub-sub"),
            p = e("./modules/animations"),
            m = e("./modules/pagination"),
            v = e("./modules/fp"),
            _ = i(v),
            y = $("body"),
            h = $(".pagination__link"),
            g = window.matchMedia("(min-width: 1024px)"),
            b = null,
            T = null;
        g.addListener(function(e) {
            a(e)
        }), f.pubSub.on(f.eventsNames.FP_INIT, function(e) {
            var t = e.slides,
                n = t.filter(".active");
            n.prevAll().addClass("prev"), n.nextAll().addClass("next"), $(".scroll-down").on("click touchend", function(e) {
                e.preventDefault(), h.eq(1).trigger("click")
            }), $(".intro__main-text .btn").on("click touchend", $.fn.fullpage.moveSectionDown), $(".header__link").on("click", function(e) {
                e.preventDefault(), h.first().trigger("click")
            }), h.on("click", function(e) {
                var t = $(this);
                switch (e.preventDefault(), t.index()) {
                    case 0:
                        setTimeout(function() {
                            f.pubSub.emit(f.eventsNames.INTRO_FIRST_STATE)
                        }, 100);
                        break;
                    case 1:
                        return $.fn.fullpage.moveTo(1), void setTimeout(function() {
                            f.pubSub.emit(f.eventsNames.INTRO_SECOND_STATE)
                        }, 100)
                }
                $.fn.fullpage.moveTo(this.hash.slice(1))
            })
        }), f.pubSub.on(f.eventsNames.INTRO_FIRST_STATE, function() {
            l["default"].animation.progress();
            setTimeout(function() {
                return m.pagination.toggle(0)
            }, 700), 1 !== b && (l["default"].animation.reverse(), l["default"].enableParallax(), b = 1)
        }), f.pubSub.on(f.eventsNames.INTRO_SECOND_STATE, function() {
            l["default"].animation.progress();
            setTimeout(function() {
                return m.pagination.toggle(1)
            }, 700), 2 !== b && (l["default"].disableParallax(), l["default"].animation.play(), b = 2)
        }), f.pubSub.on(f.eventsNames.FP_BEFORE_CHANGE, function(e) {
            var t = e.slide,
                n = e.direction;
            e.nextIndex;
            switch (t.prevAll().removeClass("next").addClass("prev"), t.nextAll().removeClass("prev").addClass("next"), n) {
                case "down":
                    t.addClass("prev");
                    break;
                case "up":
                    t.addClass("next")
            }
        }), f.pubSub.on(f.eventsNames.FP_AFTER_CHANGE, function(e) {
            var t = e.slide,
                n = e.index,
                i = e.anchorLink,
                o = p.animations[i],
                r = p.animations[T];
            t.removeClass("prev next"), g.matches && (o && o.play(), r && r.progress(0).pause()), 1 !== n && m.pagination.toggle(n - 1, !0), T = i
        }), f.pubSub.on(f.eventsNames.FP_INTRO_FOCUSIN, function(e) {
            var t = (e.index, e.prevIndex);
            $(".links, .pagination").removeClass("is-dark"), setTimeout(o, 0), f.pubSub.on(f.eventsNames.WHEEL_START, s), 2 === t && m.pagination.toggle(1)
        }), f.pubSub.once(f.eventsNames.FP_INTRO_FOCUSIN, function(e) {
            var t = e.prevIndex;
            null === t && f.pubSub.emit(f.eventsNames.INTRO_FIRST_STATE)
        }), f.pubSub.on(f.eventsNames.FP_INTRO_FOCUSOUT, function(e) {
            $(".links, .pagination").addClass("is-dark"), f.pubSub.removeListener(f.eventsNames.WHEEL_START, s), r(), g.matches && f.pubSub.emit(f.eventsNames.INTRO_SECOND_STATE)
        }), $(document).ready(function() {
            $("body").addClass("in"), $(".header__link").on("click", function(e) {
                g.matches || (e.preventDefault(), $("html, body").animate({
                    scrollTop: 0
                }, 500))
            }), setTimeout(function() {
                return l["default"].demonstarateParallax(!g.matches)
            }, 1e3)
        }), a(g)
    }, {
        "./modules/animations": 3,
        "./modules/fp": 4,
        "./modules/intro": 5,
        "./modules/pagination": 6,
        "./modules/pub-sub": 7,
        "./modules/scroll-controller": 8
    }],
    2: [function(e, t, n) {
        "use strict";

        function i(e) {
            var t = e.find(".project__heading"),
                n = Power3.easeOut;
            return TweenMax.set(t, {
                y: -220,
                autoAlpha: 0
            }), TweenMax.to(t, .3, {
                y: 0,
                autoAlpha: 1,
                ease: n
            })
        }

        function o(e) {
            var t = e.find(".project__about .h3"),
                n = e.find(".project__about-line"),
                i = e.find(".project__description"),
                o = e.find(".project__about .btn"),
                r = Power3.easeOut;
            return TweenMax.set([t, n, i, o], {
                x: -150,
                autoAlpha: 0
            }), [TweenMax.to(t, .5, {
                x: 0,
                autoAlpha: 1,
                ease: r
            }), TweenMax.to(n, .5, {
                x: 0,
                autoAlpha: 1,
                delay: .1,
                ease: r
            }), TweenMax.to(i, .5, {
                x: 0,
                autoAlpha: 1,
                delay: .2,
                ease: r
            }), TweenMax.to(o, .5, {
                x: 0,
                autoAlpha: 1,
                delay: .25,
                ease: r
            })]
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.createHeadingAnimFor = i, n.createAboutAnimFor = o
    }, {}],
    3: [function(e, t, n) {
        "use strict";

        function i() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? 0 : arguments[0];
            for (var t in f) f.hasOwnProperty(t) && "intro" !== t && f[t].progress(e)
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.animations = void 0, n.setAnimationsProgress = i;
        var o = e("./animations-base"),
            r = $(".project[data-animations=qmedic]"),
            a = $(".project[data-animations=milkyway]"),
            s = $(".project[data-animations=rexpro]"),
            u = new TimelineMax({
                paused: !0
            }),
            l = new TimelineMax({
                paused: !0
            }),
            c = new TimelineMax({
                paused: !0
            }),
            d = Power3.easeOut;
        u.add((0, o.createHeadingAnimFor)(r)).fromTo(r.find(".project__image"), .5, {
            yPercent: 50,
            opacity: 0
        }, {
            yPercent: 0,
            opacity: 1,
            ease: d
        }).fromTo(r.find(".project__bg"), .5, {
            yPercent: 100,
            opacity: 0
        }, {
            yPercent: 0,
            opacity: 1,
            ease: d
        }, "-=0.2").add((0, o.createAboutAnimFor)(r), "-=0.5"), l.add((0, o.createHeadingAnimFor)(a)).add([TweenMax.fromTo(a.find(".milkyway"), .6, {
            yPercent: 150,
            opacity: 0
        }, {
            yPercent: 0,
            opacity: 1,
            ease: d
        }), TweenMax.fromTo(a.find(".milkyway__layer-0"), .6, {
            x: 200
        }, {
            x: 0,
            ease: d
        }), TweenMax.fromTo(a.find(".milkyway__layer-2"), .3, {
            x: -200,
            opacity: 0
        }, {
            x: 0,
            delay: .3,
            opacity: 1,
            ease: d
        }), TweenMax.fromTo(a.find(".bg-milkyway__layer-1"), .3, {
            xPercent: 100,
            opacity: 0
        }, {
            xPercent: 0,
            delay: .3,
            opacity: 1,
            ease: d
        }), TweenMax.fromTo(a.find(".milkyway__layer-1"), .3, {
            yPercent: 100,
            opacity: 0
        }, {
            yPercent: 0,
            delay: .5,
            opacity: 1,
            ease: d
        })]).add([TweenMax.fromTo(a.find(".bg-milkyway__layer-2"), .4, {
            yPercent: 100,
            opacity: 0
        }, {
            yPercent: 0,
            opacity: 1,
            ease: d
        }), (0, o.createAboutAnimFor)(a)], "-=0.3"), c.add((0, o.createHeadingAnimFor)(s)).addLabel("begin", 0).fromTo(s.find(".bg-rex-pro__layer-2"), .6, {
            xPercent: -100
        }, {
            xPercent: 0,
            ease: d
        }).fromTo(s.find(".project__image"), .5, {
            yPercent: 70,
            opacity: 0
        }, {
            yPercent: 0,
            opacity: 1,
            ease: d
        }, "begin+=0.2").fromTo(s.find(".bg-rex-pro__layer-3"), .6, {
            opacity: 0
        }, {
            opacity: 1,
            ease: d
        }, "begin+=0.5").add((0, o.createAboutAnimFor)(s), "begin+=0.5");
        var f = n.animations = {
            qmedic: u,
            milkyway: l,
            rexpro: c
        }
    }, {
        "./animations-base": 2
    }],
    4: [function(e, t, n) {
        "use strict";

        function i() {
            var e = $("#fullpage"),
                t = e.find(".section"),
                n = t.length,
                i = null,
                r = null;
            e.fullpage({
                verticalCentered: !1,
                scrollingSpeed: 700,
                anchors: ["intro", "qmedic", "milkyway", "rexpro"],
                autoScrolling: !0,
                scrollBar: !1,
                fixedElements: null,
                navigation: !1,
                navigationPosition: "right",
                responsiveWidth: 1024,
                recordHistory: !0,
                fitToSection: !0,
                easingcss3: "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
                onLeave: function(e, t, a) {
                    var s = {
                        slide: this,
                        index: e,
                        nextIndex: t,
                        direction: a,
                        slideCount: n
                    };
                    1 === e && o.pubSub.emit(o.eventsNames.FP_INTRO_FOCUSOUT, s), o.pubSub.emit(o.eventsNames.FP_BEFORE_CHANGE, s), i = a, r = e
                },
                afterLoad: function(e, t) {
                    var n = {
                        slide: this,
                        anchorLink: e,
                        index: t,
                        prevIndex: r,
                        directionBefore: i
                    };
                    1 === t && o.pubSub.emit(o.eventsNames.FP_INTRO_FOCUSIN, n), o.pubSub.emit(o.eventsNames.FP_AFTER_CHANGE, n)
                },
                afterRender: function() {
                    o.pubSub.emit(o.eventsNames.FP_INIT, {
                        slides: t
                    })
                }
            })
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n["default"] = i;
        var o = e("./pub-sub")
    }, {
        "./pub-sub": 7
    }],
    5: [function(e, t, n) {
        "use strict";

        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }

        function o(e) {
            return e && "undefined" != typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = e("./pub-sub"),
            a = e("lodash.debounce"),
            s = i(a);
        n["default"] = function() {
            function e(e) {
                var t, n, i, r, a, s, u, l = arguments.length <= 1 || void 0 === arguments[1] ? 0 : arguments[1];
                "object" === ("undefined" == typeof e ? "undefined" : o(e)) ? (t = e.pageX, n = e.pageY) : (t = e, n = l), i = t - window.innerWidth / 2, r = n - window.innerHeight / 2, s = .008 * -i, a = .008 * r, u = .5, TweenMax.to(p, u, {
                    x: .005 * i,
                    y: .005 * r,
                    rotationX: a + "deg",
                    rotationY: s + "deg"
                }), TweenMax.to(m, u, {
                    x: .01 * -i,
                    y: .01 * -r,
                    rotationX: a + "deg",
                    rotationY: s + "deg"
                }), TweenMax.to(v, u, {
                    x: .025 * -i,
                    y: .025 * -r,
                    rotationX: a + "deg",
                    rotationY: s + "deg"
                }), T && TweenMax.to(_, u, {
                    x: .015 * -i,
                    y: .015 * -r,
                    rotationX: a + "deg",
                    rotationY: s + "deg"
                })
            }

            function t(e) {
                var t = b.getTweensOf(f),
                    n = t[0],
                    i = t[1],
                    r = window.innerWidth / 2,
                    a = b.progress();
                "object" === o(t[0].vars.css) ? (n.vars.css.x = r, i.vars.css.x = -r, n.invalidate().progress(a), i.invalidate().progress(a)) : (n.updateTo({
                    x: r
                }), i.updateTo({
                    x: -r
                }))
            }

            function n() {
                w && !x && ($(document).on("mousemove", e), x = !0)
            }

            function i() {
                x && ($(document).off("mousemove", e), TweenMax.to([p, m, v], .5, {
                    x: 0,
                    y: 0,
                    rotationY: 0,
                    rotationX: 0
                }), T && TweenMax.to(_, .5, {
                    x: 0,
                    y: 0,
                    rotationY: 0,
                    rotationX: 0
                }), x = !1)
            }

            function a() {
                x ? i() : n()
            }

            function u(t) {
                e(0, 0), w = !0, n()
            }

            function l() {
                var e = y[0].style.opacity,
                    t = "1" === e;
                TweenMax.set(y, {
                    autoAlpha: t ? 0 : 1
                }), TweenMax.set(h, {
                    opacity: t ? 0 : 1,
                    y: 0
                })
            }
            var c = $(".intro"),
                d = c.find(".parallax__row .char:not(.char-placeholder)"),
                f = c.find(".char-a"),
                p = (c.find(".parallax__inner"), c.find(".parallax__layer-1")),
                m = c.find(".parallax__layer-2"),
                v = c.find(".parallax__layer-3"),
                _ = c.find(".parallax__layer-static"),
                y = c.find(".intro__main-text"),
                h = y.find(".btn"),
                g = c.find(".intro__triangle .svg-icon"),
                b = new TimelineMax({
                    paused: !0
                }),
                T = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
                x = !1,
                w = !1,
                S = 300,
                N = [{
                    duration: .2,
                    delay: .4,
                    y: -S
                }, {
                    duration: .2,
                    delay: .5,
                    y: -S
                }, {
                    duration: .2,
                    delay: .4,
                    y: S
                }, {
                    duration: .4,
                    delay: 0,
                    y: -S
                }, {
                    duration: .4,
                    delay: .175,
                    y: -S
                }, {
                    duration: .25,
                    delay: .25,
                    y: -S
                }, {
                    duration: .3,
                    delay: .3,
                    y: -S
                }, {
                    duration: .4,
                    delay: .05,
                    y: S
                }, {
                    duration: .35,
                    delay: .2,
                    y: S
                }, {
                    duration: .2,
                    delay: .35,
                    y: S
                }];
            return $(window).on("resize", (0, s["default"])(t, 300)), b.add(N.map(function(e, t) {
                return TweenMax.to(d[t], e.duration, {
                    y: e.y,
                    delay: e.delay,
                    opacity: 0,
                    ease: Power1.easeInOut
                })
            }, 0)).add(function() {
                return c.toggleClass("is-animated")
            }).add([TweenMax.fromTo(f[0], .5, {
                x: 0
            }, {
                x: window.innerWidth / 2,
                ease: Power1.easeInOut
            }), TweenMax.fromTo(f[1], .5, {
                x: 0
            }, {
                x: -window.innerWidth / 2,
                ease: Power1.easeInOut
            }), TweenMax.to(g, .5, {
                scale: .625
            })], "-=0.1").fromTo(y, .5, {
                autoAlpha: 0
            }, {
                autoAlpha: 1
            }).fromTo(h, .4, {
                y: 100,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                ease: Power1.easeInOut
            }, "-=0.3").add(function() {
                r.pubSub.emit(r.eventsNames.INTRO_END_ANIMATIONS, {
                    animation: b
                })
            }), {
                enableParallax: n,
                disableParallax: i,
                toggleParallax: a,
                animation: b,
                toggleIntroTextVisibility: l,
                demonstarateParallax: u
            }
        }()
    }, {
        "./pub-sub": 7,
        "lodash.debounce": 10
    }],
    6: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        n.pagination = function() {
            function e(e) {
                var t = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1],
                    n = t ? r : o;
                ("number" == typeof e || isFinite(e)) && (o.filter("." + i).removeClass(i), n.eq(e).addClass(i))
            }

            function t() {
                o.filter("." + i).removeClass(i)
            }
            var n = 2,
                i = "is-active",
                o = $(".pagination__link"),
                r = o.not(":nth-child(" + n + ")");
            return {
                toggle: e,
                reset: t
            }
        }()
    }, {}],
    7: [function(e, t, n) {
        "use strict";

        function i(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        Object.defineProperty(n, "__esModule", {
            value: !0
        }), n.eventsNames = n.pubSub = void 0;
        var o = e("events"),
            r = i(o);
        n.pubSub = new r["default"], n.eventsNames = {
            INTRO_END_ANIMATIONS: "introAnimEnd",
            INTRO_FIRST_STATE: "introFirstState",
            INTRO_SECOND_STATE: "introSecondState",
            FP_INTRO_FOCUSIN: "fpIntroFocusIn",
            FP_INTRO_FOCUSOUT: "fpIntroFocusOut",
            FP_BEFORE_CHANGE: "fpBeforeChange",
            FP_AFTER_CHANGE: "fpAfterChange",
            FP_LOOP_TOP: "fpLoopTop",
            FP_INIT: "fpInit",
            WHEEL_START: "wheel.start",
            WHEEL_END: "wheel.end"
        }
    }, {
        events: 9
    }],
    8: [function(e, t, n) {
        "use strict";
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var i = e("./pub-sub");
        n["default"] = function() {
            function e(e) {
                e.preventDefault()
            }

            function t(e) {
                var t = e.originalEvent.deltaY;
                c = 0 > t ? "up" : t > 0 ? "down" : 0 > f ? "up" : "down", f = t
            }

            function n() {
                l || (u.on("wheel", e), l = !0)
            }

            function o() {
                l && (u.off("wheel", e), l = !1)
            }

            function r() {
                return l
            }

            function a() {
                return d
            }

            function s(e) {
                return c
            }
            var u = $("body"),
                l = !1,
                c = null,
                d = $(window).scrollTop(),
                f = null,
                p = null;
            return u.on("wheel", function(e) {
                t(e), p || i.pubSub.emit(i.eventsNames.WHEEL_START, e, c), clearTimeout(p), p = setTimeout(function() {
                    p = null, i.pubSub.emit(i.eventsNames.WHEEL_END, e, c), c = null
                }, 100)
            }), u.on("scroll", function(e) {
                d = $(window).scrollTop()
            }), {
                disable: n,
                enable: o,
                isDisabled: r,
                getDirection: s,
                getScrollPos: a
            }
        }()
    }, {
        "./pub-sub": 7
    }],
    9: [function(e, t, n) {
        function i() {
            this._events = this._events || {}, this._maxListeners = this._maxListeners || void 0
        }

        function o(e) {
            return "function" == typeof e
        }

        function r(e) {
            return "number" == typeof e
        }

        function a(e) {
            return "object" == typeof e && null !== e
        }

        function s(e) {
            return void 0 === e
        }
        t.exports = i, i.EventEmitter = i, i.prototype._events = void 0, i.prototype._maxListeners = void 0, i.defaultMaxListeners = 10, i.prototype.setMaxListeners = function(e) {
            if (!r(e) || 0 > e || isNaN(e)) throw TypeError("n must be a positive number");
            return this._maxListeners = e, this
        }, i.prototype.emit = function(e) {
            var t, n, i, r, u, l;
            if (this._events || (this._events = {}), "error" === e && (!this._events.error || a(this._events.error) && !this._events.error.length)) {
                if (t = arguments[1], t instanceof Error) throw t;
                throw TypeError('Uncaught, unspecified "error" event.')
            }
            if (n = this._events[e], s(n)) return !1;
            if (o(n)) switch (arguments.length) {
                case 1:
                    n.call(this);
                    break;
                case 2:
                    n.call(this, arguments[1]);
                    break;
                case 3:
                    n.call(this, arguments[1], arguments[2]);
                    break;
                default:
                    r = Array.prototype.slice.call(arguments, 1), n.apply(this, r)
            } else if (a(n))
                for (r = Array.prototype.slice.call(arguments, 1), l = n.slice(), i = l.length, u = 0; i > u; u++) l[u].apply(this, r);
            return !0
        }, i.prototype.addListener = function(e, t) {
            var n;
            if (!o(t)) throw TypeError("listener must be a function");
            return this._events || (this._events = {}), this._events.newListener && this.emit("newListener", e, o(t.listener) ? t.listener : t), this._events[e] ? a(this._events[e]) ? this._events[e].push(t) : this._events[e] = [this._events[e], t] : this._events[e] = t, a(this._events[e]) && !this._events[e].warned && (n = s(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners, n && n > 0 && this._events[e].length > n && (this._events[e].warned = !0, console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length), "function" == typeof console.trace && console.trace())), this
        }, i.prototype.on = i.prototype.addListener, i.prototype.once = function(e, t) {
            function n() {
                this.removeListener(e, n), i || (i = !0, t.apply(this, arguments))
            }
            if (!o(t)) throw TypeError("listener must be a function");
            var i = !1;
            return n.listener = t, this.on(e, n), this
        }, i.prototype.removeListener = function(e, t) {
            var n, i, r, s;
            if (!o(t)) throw TypeError("listener must be a function");
            if (!this._events || !this._events[e]) return this;
            if (n = this._events[e], r = n.length, i = -1, n === t || o(n.listener) && n.listener === t) delete this._events[e], this._events.removeListener && this.emit("removeListener", e, t);
            else if (a(n)) {
                for (s = r; s-- > 0;)
                    if (n[s] === t || n[s].listener && n[s].listener === t) {
                        i = s;
                        break
                    }
                if (0 > i) return this;
                1 === n.length ? (n.length = 0, delete this._events[e]) : n.splice(i, 1), this._events.removeListener && this.emit("removeListener", e, t)
            }
            return this
        }, i.prototype.removeAllListeners = function(e) {
            var t, n;
            if (!this._events) return this;
            if (!this._events.removeListener) return 0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e], this;
            if (0 === arguments.length) {
                for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
                return this.removeAllListeners("removeListener"), this._events = {}, this
            }
            if (n = this._events[e], o(n)) this.removeListener(e, n);
            else if (n)
                for (; n.length;) this.removeListener(e, n[n.length - 1]);
            return delete this._events[e], this
        }, i.prototype.listeners = function(e) {
            var t;
            return t = this._events && this._events[e] ? o(this._events[e]) ? [this._events[e]] : this._events[e].slice() : []
        }, i.prototype.listenerCount = function(e) {
            if (this._events) {
                var t = this._events[e];
                if (o(t)) return 1;
                if (t) return t.length
            }
            return 0
        }, i.listenerCount = function(e, t) {
            return e.listenerCount(t)
        }
    }, {}],
    10: [function(e, t, n) {
        function i(e, t, n) {
            function i() {
                y && clearTimeout(y), p && clearTimeout(p), g = 0, p = y = h = void 0
            }

            function r(t, n) {
                n && clearTimeout(n), p = y = h = void 0, t && (g = l(), m = e.apply(_, f), y || p || (f = _ = void 0))
            }

            function u() {
                var e = t - (l() - v);
                0 >= e || e > t ? r(h, p) : y = setTimeout(u, e)
            }

            function c() {
                r(T, y)
            }

            function d() {
                if (f = arguments, v = l(), _ = this, h = T && (y || !x), b === !1) var n = x && !y;
                else {
                    p || x || (g = v);
                    var i = b - (v - g),
                        o = 0 >= i || i > b;
                    o ? (p && (p = clearTimeout(p)), g = v, m = e.apply(_, f)) : p || (p = setTimeout(c, i))
                }
                return o && y ? y = clearTimeout(y) : y || t === b || (y = setTimeout(u, t)), n && (o = !0, m = e.apply(_, f)), !o || y || p || (f = _ = void 0), m
            }
            var f, p, m, v, _, y, h, g = 0,
                b = !1,
                T = !0;
            if ("function" != typeof e) throw new TypeError(a);
            if (t = 0 > t ? 0 : +t || 0, n === !0) {
                var x = !0;
                T = !1
            } else o(n) && (x = !!n.leading, b = "maxWait" in n && s(+n.maxWait || 0, t), T = "trailing" in n ? !!n.trailing : T);
            return d.cancel = i, d
        }

        function o(e) {
            var t = typeof e;
            return !!e && ("object" == t || "function" == t)
        }
        var r = e("lodash._getnative"),
            a = "Expected a function",
            s = Math.max,
            u = r(Date, "now"),
            l = u || function() {
                return (new Date).getTime()
            };
        t.exports = i
    }, {
        "lodash._getnative": 11
    }],
    11: [function(e, t, n) {
        function i(e) {
            return !!e && "object" == typeof e
        }

        function o(e, t) {
            var n = null == e ? void 0 : e[t];
            return s(n) ? n : void 0
        }

        function r(e) {
            return a(e) && p.call(e) == u
        }

        function a(e) {
            var t = typeof e;
            return !!e && ("object" == t || "function" == t)
        }

        function s(e) {
            return null == e ? !1 : r(e) ? m.test(d.call(e)) : i(e) && l.test(e)
        }
        var u = "[object Function]",
            l = /^\[object .+?Constructor\]$/,
            c = Object.prototype,
            d = Function.prototype.toString,
            f = c.hasOwnProperty,
            p = c.toString,
            m = RegExp("^" + d.call(f).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
        t.exports = o
    }, {}]
}, {}, [1]);
//# sourceMappingURL=app.js.map