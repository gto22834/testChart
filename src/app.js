(function(root, __FILENAME__) {
    'use strict';

    var randomScalingFactor = function() {
        return Math.round(Math.random() * 100);
    };

    var randomColorFactor = function() {
        return Math.round(Math.random() * 255);
    };

    var randomColor = function(opacity) {
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
    };

    var config = {
        type: 'pie',
        data: {
            datasets: [{
                data: [
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                ],
                backgroundColor: [
                    "#F7464A",
                    "#46BFBD",
                    "#FDB45C",
                    "#949FB1",
                    "#4D5360",
                ],
            }],
            labels: [
                "Red",
                "Green",
                "Yellow",
                "Grey",
                "Dark Grey"
            ]
        },
        options: {
            responsive: false,
            title: {
                display: true,
                fontSize: 20,
                text: '文字測試'
            },
            legend: {
                labels: {
                    fontSize: 30
                }
            },
            tooltips: {
                mode: 'label',
                bodyFontSize: 30,
                yPadding: 20,
                xPadding: 20
            }
        }
    };

    /**
     * The entrance of test
     * @type {Object}
     */
    var app = {
        init: function() {
            // setting screen scale
            var main_section = window.document.getElementById('ne-section');
            var scale_w = window.innerWidth / main_section.offsetWidth;
            var scale_h = window.innerHeight / main_section.offsetHeight;
            if (scale_w > 1) {
                scale_w = scale_h;
            }
            main_section.style.top = main_section.offsetHeight * scale_h / 2 + "px";
            $Test.scaleValue = [scale_w, scale_h];
            this.scale(main_section);
            this.createChart();

            this.getScreenShot2();
            this.toggleFullScreen();
        },
        scale: function(element) {
            var scale_w = $Test.scaleValue[0];
            var scale_h = $Test.scaleValue[1];
            element.style.transform = "translate(-50%, -50%) scale(" + scale_w + ", " + scale_h + ")";
            element.style.webkitTransform = "translate(-50%, -50%) scale(" + scale_w + ", " + scale_h + ")";
            element.style.mozTransform = "translate(-50%, -50%) scale(" + scale_w + ", " + scale_h + ")";
            element.style.msTransform = "translate(-50%, -50%) scale(" + scale_w + ", " + scale_h + ")";
            element.style.oTransform = "translate(-50%, -50%) scale(" + scale_w + ", " + scale_h + ")";
        },
        createChart: function() {
            var section = document.getElementById('ne-section');
            var canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 400;
            canvas.id = "NED-chart";
            section.appendChild(canvas);
            var ctx = canvas.getContext("2d");
            $Test.myNewChart = new Chart(ctx, config);
            canvas.style.width = '400px';
            canvas.style.height = '400px';
        },
        getScreenShot: function() {
            var canvas = document.getElementById('canvasTest');
            var ctx = canvas.getContext('2d');

            var screen = document.getElementById('ne-section');
            var section = screen.querySelector('section');
            var svg = document.createElement('svg');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            var foreignObject = document.createElement('foreignObject');
            foreignObject.setAttribute('width', '100%');
            foreignObject.setAttribute('height', '100%');
            foreignObject.appendChild(section);
            var dataInsert = svg.appendChild(foreignObject);
            var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
                '<foreignObject width="100%" height="100%">' +
                '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
                section.innerHTML +
                //    '<em>I</em> like <span style="color:white; text-shadow:0 0 2px blue;">cheese</span>' +
                '</div>' +
                '</foreignObject>' +
                '</svg>';
            // console.error(dataInsert.outerHTML);
            // var data = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
            //                 dataInsert.outerHTML +
            //            '</svg>';
            var DOMURL = window.URL || window.webkitURL || window;
            var img = new Image();
            var svg_info = new Blob([data], {
                type: 'image/svg+xml;charset=utf-8'
            });
            var url = DOMURL.createObjectURL(svg_info);

            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);
            }

            img.src = url;
            console.error(img);
        },
        getScreenShot2: function() {
            var canvas = document.getElementById("canvasTest");
            var screen = document.getElementById('ne-section');
            var section = screen.querySelector('section');
            console.error(rasterizeHTML.drawHTML);
            // rasterizeHTML.drawHTML(section.innerHTML, canvas);
        },
        toggleFullScreen: function() {
            if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }
    }

    root[__FILENAME__] = app;
    // for nodejs and mocha testing.
    if (typeof module !== 'undefined' && module.exports) {
        app.root = exports = module.exports = app;
    }
}(this, '$Test'));
