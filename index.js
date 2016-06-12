var textHTML5 = {};
textHTML5.model = {

};
textHTML5.view = {

};
textHTML5.control = {
    _converterOrientation: {
        o1: 'down',
        o2: 'rightup',
        o3: 'left',
        o4: 'leftup',
        o6: 'rightdown',
        o7: 'right',
        o8: 'leftdown',
        o9: 'up'
    },
    data: {}, // template data
    /**
     * return all css property of element
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    currentStyle: function(element) {
        return element.currentStyle || document.defaultView.getComputedStyle(element, null);
    },
    bindInitEvent: function() {
        console.error('Binding event');
        var content = window.document.querySelector('div[class=ne-box]');
        this.drag(content);

        // new Resize(content).set(anchor_left, 'left');
        var anchor_down = window.document.querySelector('div[ne-orientation=o1]');
        new Resize(content).set(anchor_down, 'down');
        var anchor_rightUp = window.document.querySelector('div[ne-orientation=o2]');
        this.resizing(anchor_rightUp, content);
        var anchor_left = window.document.querySelector('div[ne-orientation=o3]');
        this.resizing(anchor_left, content);
        var anchor_leftup = window.document.querySelector('div[ne-orientation=o4]');
        this.resizing(anchor_leftup, content);
        var anchor_rightDown = window.document.querySelector('div[ne-orientation=o6]');
        this.resizing(anchor_rightDown, content);
        var anchor_right = window.document.querySelector('div[ne-orientation=o7]');
        this.resizing(anchor_right, content);
        var anchor_leftDown = window.document.querySelector('div[ne-orientation=o8]');
        this.resizing(anchor_leftDown, content);
        var anchor_up = window.document.querySelector('div[ne-orientation=o9]');
        this.resizing(anchor_up, content);
    },
    drag: function(node) {
        node.onselectstart = function() {
            return false;
        };

        var divTarget;
        var isDraggable = false;
        var diffX = 0;
        var diffY = 0;
        var nodeOffsetParent;

        node.addEventListener('mousedown', function(event) {
            if (isDraggable === false) {
                divTarget = event.target;
                nodeOffsetParent = divTarget.offsetParent;
                if (nodeOffsetParent === node) {
                    diffX = event.pageX - nodeOffsetParent.offsetLeft;
                    diffY = event.pageY - nodeOffsetParent.offsetTop;
                    isDraggable = nodeOffsetParent;
                }
            }
        }, false);
        // need take out
        var section = window.document.querySelector('#ne-section');
        var mousemove = function(event) {
            if (node === isDraggable) {
                node.style.left = (event.pageX - diffX) + 'px';
                node.style.top = (event.pageY - diffY) + 'px';
            }
        };
        section.addEventListener('mousemove', mousemove, false);

        node.addEventListener('mouseup', function(event) {
            isDraggable = false;
            var diffX = 0;
            var diffY = 0;
        }, false);
    },
    set: function(node, target) {
        //this.fun = fun;
        // this.obj = obj;
        // this.resizeelm = null;
        // this.fun = null; //记录触发什么事件的索引
        // this.original = []; //记录开始状态的数组
        // this.width = null;
        // this.height = null;
        // this.fR = BindAsEventListener(this, this.resize);
        // this.fS = Bind(this, this.stop);
        var currentStyle = this.currentStyle(target);
        this.data.obj = target;
        this.data.original = {
            w: parseInt(currentStyle.width),
            h: parseInt(currentStyle.height),
            t: parseInt(currentStyle.top),
            l: parseInt(currentStyle.left)
        };
        this.data.width = (this.data.original.l || 0) + this.data.original.w;
        this.data.height = (this.data.original.t || 0) + this.data.original.h;
        var kind = this._converterOrientation[node.getAttribute('ne-orientation')];
        this.data.func = this.orientation[kind];
        node.addEventListener('mousemove', this.data.func.bind(this));
        node.addEventListener('mouseup', this.resizeStop.bind(this));
    },
    resizing: function(node, target) {
        var kind = this._converterOrientation[node.getAttribute('ne-orientation')];
        node.addEventListener('mousedown', this.set.bind(this, node, target), false);
    },
    resizeStop: function(node, kind) {
        node.removeEventListener('mousemove', this.data.func);
        //node.removeEventListener("mouseup", this.resizeStop.apply(node, kind));
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    },
    setCSS: function (element, data) {
        for (var i in data) {
            element.style[i] = data[i];
        }
    },
    orientation: {
        up: function(event) {
            console.error('ori: up');
            var data = this.data;
            if(data.height > event.clientY) {
                this.setCSS(data.obj, {
                    top: event.clientY + 'px',
                    height: data.height - event.clientY + 'px'
                });
            } else {
                console.error('over up');
            }
        },
        down: function(event) {
            var data = this.data;
            if(event.clientY > data.original.t) {
                this.setCSS(data.obj, {
                    top: data.original.t + 'px',
                    height: event.clientY - data.original.t + 'px'
                });
            } else {
                console.error('over down');
            }
        },
        left: function(event) {
            var data = this.data;
            if(event.clientX < data.width) {
                this.setCSS(data.obj, {
                    left: event.clientX + 'px',
                    width: data.width - event.clientX + 'px'
                });
            } else {
                console.error('over left');
                // this.turnRight(e);
            }
        },
        right: function(e) {
            var data = this.data;
            if(event.clientX > data.original.l) {
                this.setCSS(data.obj, {
                    left: data.original.l + 'px',
                    width: data.width - data.original.l + 'px'
                });
            } else {
                console.error('over left');
                // this.turnLeft(e);
            }
        },
        leftUp: function(e) {
            this.up(e);
            this.left(e);
        },
        leftDown: function(e) {
            this.left(e);
            this.down(e);
        },
        rightUp: function(e) {
            this.up(e);
            this.right(e);
        },
        rightDown: function(e) {
            this.right(e);
            this.down(e);
        },
        turnDown: function(e) {
            Css(this.obj, {
                top: this.height + 'px',
                height: e.clientY - this.height + 'px'
            });
        },
        turnUp: function(e) {
            Css(this.obj, {
                top: e.clientY + 'px',
                height: this.original[3] - e.clientY + 'px'
            });
        },
        turnRight: function(e) {
            Css(this.obj, {
                left: this.width + 'px',
                width: e.clientX - this.width + 'px'
            });
        },
        turnLeft: function(e) {
            Css(this.obj, {
                left: e.clientX + 'px',
                width: this.original[2] - e.clientX + 'px'
            });
        }
    }
};
// 判斷瀏覽器
// var Sys = (function(ua) {
//     var s = {};
//     s.IE = ua.match(/msie ([\d.]+)/) ? true : false;
//     s.Firefox = ua.match(/firefox\/([\d.]+)/) ? true : false;
//     s.Chrome = ua.match(/chrome\/([\d.]+)/) ? true : false;
//     s.IE6 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6)) ? true : false;
//     s.IE7 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 7)) ? true : false;
//     s.IE8 = (s.IE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 8)) ? true : false;
//     return s;
// })(navigator.userAgent.toLowerCase());

var Css = function(e, o) {
    console.error(e);
    console.error(o);
    for (var i in o)
        e.style[i] = o[i];
};
var Extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
};
var Bind = function(object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function() {
        return fun.apply(object, args);
    }
};
var BindAsEventListener = function(object, fun) {
    var args = Array.prototype.slice.call(arguments).slice(2);
    return function(event) {
        return fun.apply(object, [event || window.event].concat(args));
    }
};
var CurrentStyle = function(element) {
    return element.currentStyle || document.defaultView.getComputedStyle(element, null);
};

function addListener(element, e, fn) {
    element.addEventListener ? element.addEventListener(e, fn, false) : element.attachEvent("on" + e, fn);
};

function removeListener(element, e, fn) {
    element.removeEventListener ? element.removeEventListener(e, fn, false) : element.detachEvent("on" + e, fn)
};
var Class = function(properties) {
    var _class = function() {
        return (arguments[0] !== null && this.initialize && typeof(this.initialize) == 'function') ? this.initialize.apply(this, arguments) : this;
    };
    _class.prototype = properties;
    return _class;
};
var Resize = new Class({
    initialize: function(obj) {
        this.obj = obj;
        this.resizeelm = null;
        this.fun = null; //记录触发什么事件的索引
        this.original = []; //记录开始状态的数组
        this.width = null;
        this.height = null;
        this.fR = BindAsEventListener(this, this.resize);
        this.fS = Bind(this, this.stop);
    },
    set: function(elm, direction) {
        if (!elm) return;
        this.resizeelm = elm;
        addListener(this.resizeelm, 'mousedown', BindAsEventListener(this, this.start, this[direction]));
        return this;
    },
    start: function(e, fun) {
        this.fun = fun;
        this.original = [parseInt(CurrentStyle(this.obj).width), parseInt(CurrentStyle(this.obj).height), parseInt(CurrentStyle(this.obj).left), parseInt(CurrentStyle(this.obj).top)];
        this.width = (this.original[2] || 0) + this.original[0];
        this.height = (this.original[3] || 0) + this.original[1];
        addListener(document, "mousemove", this.fR);
        addListener(document, 'mouseup', this.fS);
    },
    resize: function(e) {
        this.fun(e);
        // // binding for stop function
        // (this.resizeelm.onblur = function() {
        //     this.fS()
        // })
    },
    stop: function() {
        removeListener(document, "mousemove", this.fR);
        removeListener(document, "mousemove", this.fS);
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    },
    up: function(e) {
        this.height > e.clientY ? Css(this.obj, {
            top: e.clientY + "px",
            height: this.height - e.clientY + "px"
        }) : this.turnDown(e);
    },
    down: function(e) {
        e.clientY > this.original[3] ? Css(this.obj, {
            top: this.original[3] + 'px',
            height: e.clientY - this.original[3] + 'px'
        }) : this.turnUp(e);
    },
    left: function(e) {
        e.clientX < this.width ? Css(this.obj, {
            left: e.clientX + 'px',
            width: this.width - e.clientX + "px"
        }) : this.turnRight(e);
    },
    right: function(e) {
        e.clientX > this.original[2] ? Css(this.obj, {
            left: this.original[2] + 'px',
            width: e.clientX - this.original[2] + "px"
        }) : this.turnLeft(e);
    },
    leftUp: function(e) {
        this.up(e);
        this.left(e);
    },
    leftDown: function(e) {
        this.left(e);
        this.down(e);
    },
    rightUp: function(e) {
        this.up(e);
        this.right(e);
    },
    rightDown: function(e) {
        this.right(e);
        this.down(e);
    },
    turnDown: function(e) {
        Css(this.obj, {
            top: this.height + 'px',
            height: e.clientY - this.height + 'px'
        });
    },
    turnUp: function(e) {
        Css(this.obj, {
            top: e.clientY + 'px',
            height: this.original[3] - e.clientY + 'px'
        });
    },
    turnRight: function(e) {
        Css(this.obj, {
            left: this.width + 'px',
            width: e.clientX - this.width + 'px'
        });
    },
    turnLeft: function(e) {
        Css(this.obj, {
            left: e.clientX + 'px',
            width: this.original[2] - e.clientX + 'px'
        });
    }
});

(function() {
    console.error('test start');
    textHTML5.control.bindInitEvent();
}());
