/**
 * initial the KuLib library.
 *
 * @namespace KuLib
 * @author KuLib.cc
 */
(function (root, __FILENAME__) {
    'use strict';
    /**
     * @lends KuLib
     */
    var app = {
        PROD: 'production',
        DEV: 'development',
        VERSION: '1.0.0',
        root: root, // for nodejs export root scope
        /**
         * declare string 'x.x.x' to object x.x.x
         * and assign the value to the x.x.x
         *
         * the value will override the original value!
         *
         * @param  {string} dotStringName [description]
         * @param  {mixed}  value         [description]
         * @param  {object} parent        default scope in browser is Window,
         *                                in nodejs is app (module.exports)
         * @return {void}
         * @example
         *
         * // declare once.
         * KuLib.declare('a.b.c'); // a.b.c === {}
         *
         * // declare twice
         * KuLib.declare('a.b.c', 123); // a.b.c === 123
         *
         * // different scope
         * KuLib.declare('a.b.c', {}, KuLib); // KuLib.a.b.c === {}
         *
         */
        declare: function (dotStringName, value, parent) {
            if (!parent) {
                // nodejs two different files can not access each other variables,
                // but module.exports
                // so if we not assign the parent, we need default the scope to the app (in nodejs)
                //
                // example // if we just do 'parent = root'
                //
                // var KuLib = require(thisFile);
                // KuLib.declare('a.b.c'); // KuLib.a === undifined (not as our expectation)
                parent = app.root;
            }
            var nodes = dotStringName.split('.');
            var lastNode;
            var node = parent;
            var nodeName;
            var i;
            for (i = 0; i < nodes.length; i++) {
                lastNode = node;
                nodeName = nodes[i];
                if (!node[nodeName]) {
                    node[nodeName] = {};
                }
                node = node[nodeName];
            }
            if (value !== undefined) {
                lastNode[nodeName] = value;
            }
        },
        /**
         * find node by node name
         * @param  {string} string The node name
         * @param  {object} root   The root of node
         * @return {void}
         */
        find: function (string, root) {
            if (string === undefined) {
                return root;
            }
            var nodes = string.split('.');
            if (!root) {
                root = window;
            }
            var nodeName;
            for (var i = 0; i < nodes.length; i++) {
                nodeName = nodes[i];
                if (root && typeof root[nodeName] !== 'undefined') {
                    root = root[nodeName];
                } else {
                    return undefined;
                }
            }
            return root;
        },
        // TODO: 需要確認用法
        // Generate four random hex digits.
        S4: function () {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        },
        // Generate a pseudo-GUID by concatenating random hexadecimal.
        guid: function (prefix) {
            prefix = prefix || '';
            if (prefix) {
                prefix = prefix + '-';
            }
            var S4 = this.S4;
            return prefix + (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        }
    };
    root[__FILENAME__] = app;
    // for nodejs and mocha testing.
    if (typeof module !== 'undefined' && module.exports) {
        app.root = exports = module.exports = app;
    }
}(this, 'KuLib'));
