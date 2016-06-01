App.directive('valuePicker', function () {
    return {
        restrict: "A",
        scope: true,
        //templateUrl: 'directives/valuePicker/valuePicker.html',
        link: function ($scope, $element, $attrs) {
            function xpos(e) {
                // touch event
                if (e.originalEvent.targetTouches && (e.originalEvent.targetTouches.length >= 1)) {
                    return e.originalEvent.targetTouches[0].clientX;

                } else if (e.originalEvent.touch) {
                    return e.originalEvent.touch.clientX;
                }
                // mouse event
                return e.clientX;
            }

            var ValuePicker = {

                // variables
                _list: "",
                _tapped: false,
                _overlay: "",
                minimumValue: 0,
                maximumValue:100,
                max: 0,
                min: 0,
                offset: 0,
                reference: 0,
                pressed: false,
                xform: "transform",
                velocity: 0,
                frame: 0,
                timestamp: 0,
                ticker: null,
                amplitude: 0,
                target: 0,
                timeConstant: 225,
                snap: 0,
                adding: false,

                init: function (element, options) {
                    // base call to initialize widget
                    var that = this;

                    //set max and min
                    if (typeof $attrs.min !== "undefined") {
                        that.minimumValue = $attrs.min;
                    }

                    if (typeof $attrs.max !== "undefined") {
                        that.maximumValue = $attrs.max;
                    }
                    

                    that._list = $('<ul class="madbarz-value-picker-list"></ul>');
                    that._overlay = $('<div class="madbarz-value-picker-overlay"></div>');

                    for (var i = that.minimumValue; i < that.maximumValue; i++) {
                        $(that._list).append($('<li>' + i + '</li>'));
                    }

                    $($(that._list).children()).on('click, touchend', function (e) {
                        setTimeout(function () {
                            if (that._tapped) {
                                that.animatedGoTo(parseInt($(e.currentTarget).html()));
                            }
                        }, 100);
                    });

                    $(element).addClass('madbarz-value-picker');
                    $(element).append(that._overlay);
                    $(element).append(that._list);

                    if (typeof window.ontouchstart !== 'undefined') {
                        $(element).on('touchstart', that.tap);
                        $(element).on('touchmove', that.drag);
                        $(element).on('touchend touchleave touchcancel', that.release);
                    }

                    /*
                     $(element).on('mousedown', that.tap);
                     $(element).on('mousemove', that.drag);
                     $(element).on('mouseup', that.release);
                    */
                    that.initNumbers();
                    ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
                        var e = prefix + 'Transform';
                        //console.log("element is:", element[0]);
                        if (typeof element.style[e] !== 'undefined') {
                            that.xform = e;
                            return false;
                        }
                        return true;
                    });
                },

                initNumbers: function () {
                    var that = this;

                    var dr_svi = $(that._list).children();
                    var dr_ukupno = $(dr_svi).length;
                    var dr_prvi = $(that._list).children()[0];
                    var dr_prvi_sirina = $(dr_prvi).width();

                    that.max = dr_ukupno * dr_prvi_sirina;
                    that.offset = 0;

                    that.elementsOnEachSide = (($(window).innerWidth() - dr_prvi_sirina) / dr_prvi_sirina) / 2;

                    $(that._overlay).width(dr_prvi_sirina);
                    $(that._overlay).css('left', (dr_prvi_sirina * that.elementsOnEachSide) + "px");

                    that.snap = dr_prvi_sirina;
                    console.log("snap is",that.snap);
                    that.min = -(that.snap * that.elementsOnEachSide);
                    that.max = (dr_ukupno - that.elementsOnEachSide-1) * that.snap;
                    //that._moveValue();
                },

                scroll: function (x) {

                    var that = this;
                    //console.log("tried scroll offset:", that.offset, " x is:", x);


                    if (x > that.max) {
                        that.offset = that.max;
                    } else if (x < that.min) {
                        that.offset = that.min;
                    } else {
                        that.offset = x;
                    }
                    //that.offset = (x > that.max) ? that.max : x;
                    //that.offset = (x < that.min) ? that.min : x;
                    that._list.css('transform', 'translate3d(0,0,0) translateX(' + (-that.offset) + 'px)');



                    var maxSteps = Math.round(that.max / that.snap);
                    var currentStep = Math.round(that.offset / that.snap);
                    if (maxSteps - currentStep < 10 && that.adding === false) {
                        that.adding = true;
                        //for (var i = maxSteps + 3; i < maxSteps + 54; i++) {
                        //    $(that._list).append('<li>' + i + '</li>');
                        //}
                        $($(that._list).children()).unbind("click");
                        $($(that._list).children()).unbind("touchend");
                        $($(that._list).children()).on('click, touchend', function (e) {
                            //console.log("got click:", $(e.currentTarget).html());
                            setTimeout(function () {
                                if (that._tapped) {
                                    that.animatedGoTo(parseInt($(e.currentTarget).html()));
                                }

                            }, 100);
                        });
                        that.max = ($($(that._list).children()).length - that.elementsOnEachSide-1) * that.snap;
                        that.adding = false;
                    }
                },

                working: false,

                tap: function (e) {
                    var that = ValuePicker;

                    that._tapped = true;
                    that.working = true;
                    that.pressed = true;
                    that.reference = xpos(e);

                    that.velocity = that.amplitude = 0;
                    that.frame = that.offset;
                    that.timestamp = Date.now();
                    clearInterval(that.ticker);

                    function track() {
                        var now, elapsed, delta, v;
                        now = Date.now();
                        elapsed = now - that.timestamp;
                        timestamp = now;
                        delta = that.offset - that.frame;
                        that.frame = that.offset;
                        v = 1000 * delta / (1 + elapsed);
                        that.velocity = 0.8 * v + 0.2 * that.velocity;
                    }
                    that.ticker = setInterval(track, 100);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                },

                drag: function (e) {
                    var x, delta;
                    var that = ValuePicker;
                    that._tapped = false;
                    if (that.pressed) {
                        x = xpos(e);
                        delta = that.reference - x;
                        if (delta > that.elementsOnEachSide || delta < -that.elementsOnEachSide) {
                            that.reference = x;
                            that.scroll(that.offset + delta);
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                },

                release: function (e) {
                    var that = ValuePicker;
                    that.pressed = false;

                    function autoScroll() {
                        var elapsed, delta;
                        if (that.amplitude) {
                            elapsed = Date.now() - that.timestamp;
                            delta = -that.amplitude * Math.exp(-elapsed / that.timeConstant);
                            if (delta > 5 || delta < -5) {
                                that.scroll(that.target + delta);
                                requestAnimationFrame(autoScroll);
                            } else {
                                that.scroll(that.target);
                                var vl = Math.floor(that.target / that.snap) + 2;
                                if (vl < 0)
                                    vl = 0;
                                that._update(vl);
                            }
                            that.working = false;
                        }
                    }

                    clearInterval(that.ticker);
                    that.target = that.offset;
                    if (that.velocity > 10 || that.velocity < -10) {
                        that.amplitude = 0.8 * that.velocity;
                        that.target = that.offset + that.amplitude;
                    }
                    that.target = Math.round(that.target / that.snap) * that.snap;
                    that.amplitude = that.target - that.offset;
                    that.timestamp = Date.now();
                    requestAnimationFrame(autoScroll);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                },

                _value: 1,

                value: function (v) {
                    var that = this;
                    if (v === undefined)
                        return that._value;
                    else {
                        that._update(v);
                        that._moveValue();
                    }
                },

                animatedGoTo: function (v) {
                    var that = this;

                    that._update(v);
                    that._animatedMoveValue();
                },

                _update: function (value) {
                    var that = this;
                    that._value = value;
                    console.log("setting value:", value);
                    //that.trigger(CHANGE);
                },

                _animatedMoveValue: function () {
                    var that = this;
                    $(that._list).css('transition', 'all linear 0.3s');
                    setTimeout(function () {
                        console.log("animated move to value should scroll to:", (that.value() - that.minimumValue - that.elementsOnEachSide) * that.snap)
                        that.scroll((that.value() - that.minimumValue - that.elementsOnEachSide) * that.snap);
                    }, 50);
                    setTimeout(function () {
                        $(that._list).css('transition', '');
                    }, 360);
                },

                _moveValue: function () {
                    var that = this;

                    that.scroll((that.value() - that.elementsOnEachSide) * that.snap);
                },

                _change: function (value) {
                    var that = this;
                    //Determine if the value is different than it was before
                    if (that._old !== value) {
                        //It is different, update the value
                        that._update(value);
                        //Capture the new value for future change detection
                        that._old = value;
                        // trigger the external change
                        //that.trigger(CHANGE);
                        //console.log("changed");
                    }
                },


                options: {
                    // the name is what it will appear as off the kendo namespace(i.e. kendo.ui.MyWidget). 
                    // The jQuery plugin would be jQuery.fn.kendoMyWidget.
                    name: "ValuePicker"
                    // other options go here

                }

            };
            console.log("should init value picker");
            console.log($element[0]);
            ValuePicker.init($element[0]);
        }
    }
});