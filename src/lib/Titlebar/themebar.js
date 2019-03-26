"use strict";
/*--------------------------------------------------------------------------------------------------------
 *  Copyright (c) 2018 Alex Torres
 *  Licensed under the MIT License. See License in the project root for license information.
 *
 *  This file has parts of one or more project files (VS Code) from Microsoft
 *  You can check your respective license and the original file in https://github.com/Microsoft/vscode/
 *-------------------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var lifecycle_1 = require("./common/lifecycle");
var ThemingRegistry = /** @class */ (function (_super) {
    __extends(ThemingRegistry, _super);
    function ThemingRegistry() {
        var _this = _super.call(this) || this;
        _this.theming = [];
        _this.theming = [];
        return _this;
    }
    ThemingRegistry.prototype.onThemeChange = function (theme) {
        var _this = this;
        this.theming.push(theme);
        return lifecycle_1.toDisposable(function () {
            var idx = _this.theming.indexOf(theme);
            _this.theming.splice(idx, 1);
        });
    };
    ThemingRegistry.prototype.getTheming = function () {
        return this.theming;
    };
    return ThemingRegistry;
}(lifecycle_1.Disposable));
var Themebar = /** @class */ (function (_super) {
    __extends(Themebar, _super);
    function Themebar() {
        var _this = _super.call(this) || this;
        // Titlebar
        _this.registerTheme(function (collector) {
            collector.addRule("\n            .titlebar {\n                top: 0;\n                left: 0;\n                right: 0;\n                box-sizing: border-box;\n                width: 100%;\n                font-size: 13px;\n                padding: 0 16px;\n                overflow: hidden;\n                flex-shrink: 0;\n                align-items: center;\n                justify-content: center;\n                user-select: none;\n                zoom: 1;\n                line-height: 22px;\n                height: 22px;\n                display: flex;\n                z-index: 1000;\n            }\n        \n            .titlebar.windows, .titlebar.linux {\n                padding: 0;\n                height: 30px;\n                line-height: 30px;\n                justify-content: left;\n                overflow: visible;\n            }\n        \n            .titlebar.inverted, .titlebar.inverted .menubar,\n            .titlebar.inverted .window-controls-container {\n                flex-direction: row-reverse;\n            }\n        \n            .titlebar.inverted .window-controls-container {\n                margin: 0 5px 0 0;\n            }\n        \n            .titlebar.first-buttons .window-controls-container {\n                order: -1;\n                margin: 0 5px 0 0;\n            }\n            ");
        });
        // Drag region
        _this.registerTheme(function (collector) {
            collector.addRule("\n            .titlebar .titlebar-drag-region {\n                top: 0;\n                left: 0;\n                display: block;\n                position: absolute;\n                width: 100%;\n                height: 100%;\n                z-index: -1;\n                -webkit-app-region: drag;\n            }\n            ");
        });
        // icon app
        _this.registerTheme(function (collector) {
            collector.addRule("\n            .titlebar > .window-appicon {\n                width: 35px;\n                height: 30px;\n                position: relative;\n                z-index: 99;\n                background-repeat: no-repeat;\n                background-position: center center;\n                background-size: 16px;\n                flex-shrink: 0;\n            }\n            ");
        });
        // Menubar
        _this.registerTheme(function (collector) {
            collector.addRule("\n            .menubar {\n                display: flex;\n                flex-shrink: 1;\n                box-sizing: border-box;\n                height: 30px;\n                overflow: hidden;\n                flex-wrap: wrap;\n            }\n        \n            .menubar.bottom {\n                order: 1;\n                width: 100%;\n                padding: 0 5px;\n            }\n            \n            .menubar .menubar-menu-button {\n                align-items: center;\n                box-sizing: border-box;\n                padding: 0px 8px;\n                cursor: default;\n                -webkit-app-region: no-drag;\n                zoom: 1;\n                white-space: nowrap;\n                outline: 0;\n            }\n\n            .menubar .menubar-menu-button.disabled {\n                opacity: 0.4;\n            }\n\n            .menubar .menubar-menu-button:not(.disabled):focus,\n\t\t\t.menubar .menubar-menu-button:not(.disabled).open,\n\t\t\t.menubar .menubar-menu-button:not(.disabled):hover {\n\t\t\t\tbackground-color: rgba(255, 255, 255, .1);\n\t\t\t}\n\t\n\t\t\t.titlebar.light .menubar .menubar-menu-button:focus,\n\t\t\t.titlebar.light .menubar .menubar-menu-button.open,\n\t\t\t.titlebar.light .menubar .menubar-menu-button:hover {\n\t\t\t\tbackground-color: rgba(0, 0, 0, .1);\n\t\t\t}\n        \n            .menubar-menu-container {\n                position: absolute;\n                display: block;\n                left: 0px;\n                opacity: 1;\n                outline: 0;\n                border: none;\n                text-align: left;\n                margin: 0 auto;\n                padding: .5em 0;\n                margin-left: 0;\n                overflow: visible;\n                justify-content: flex-end;\n                white-space: nowrap;\n                box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);\n                z-index: 2000;\n            }\n            \n            .menubar-menu-container:focus {\n                outline: 0;\n            }\n            \n            .menubar-menu-container .action-item {\n                padding: 0;\n                transform: none;\n                display: -ms-flexbox;\n                display: flex;\n                outline: none;\n            }\n            \n            .menubar-menu-container .action-item.active {\n                transform: none;\n            }\n            \n            .menubar-menu-container .action-menu-item {\n                -ms-flex: 1 1 auto;\n                flex: 1 1 auto;\n                display: -ms-flexbox;\n                display: flex;\n                height: 2em;\n                align-items: center;\n                position: relative;\n            }\n            \n            .menubar-menu-container .action-label {\n                -ms-flex: 1 1 auto;\n                flex: 1 1 auto;\n                text-decoration: none;\n                padding: 0 1em;\n                background: none;\n                font-size: 12px;\n                line-height: 1;\n            }\n        \n            .menubar-menu-container .action-label:not(.separator),\n            .menubar-menu-container .keybinding {\n                padding: 0 2em;\n            }\n            \n            .menubar-menu-container .keybinding,\n            .menubar-menu-container .submenu-indicator {\n                display: inline-block;\n                -ms-flex: 2 1 auto;\n                flex: 2 1 auto;\n                padding: 0 1em;\n                text-align: right;\n                font-size: 12px;\n                line-height: 1;\n            }\n            \n            .menubar-menu-container .submenu-indicator {\n                height: 100%;\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.52 12.364L9.879 7 4.52 1.636l.615-.615L11.122 7l-5.986 5.98-.615-.616z' fill='%23000'/%3E%3C/svg%3E\") no-repeat right center/13px 13px;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.52 12.364L9.879 7 4.52 1.636l.615-.615L11.122 7l-5.986 5.98-.615-.616z' fill='%23000'/%3E%3C/svg%3E\") no-repeat right center/13px 13px;\n                font-size: 60%;\n                margin: 0 1.3em;\n            }\n            \n            .menubar-menu-container .action-item.disabled .action-menu-item,\n            .menubar-menu-container .action-label.separator {\n                opacity: 0.4;\n            }\n            \n            .menubar-menu-container .action-label:not(.separator) {\n                display: inline-block;\n                -webkit-box-sizing: border-box;\n                -o-box-sizing: border-box;\n                -moz-box-sizing: border-box;\n                -ms-box-sizing:\tborder-box;\n                box-sizing:\tborder-box;\n                margin: 0;\n            }\n            \n            .menubar-menu-container .action-item .submenu {\n                position: absolute;\n            }\n            \n            .menubar-menu-container .action-label.separator {\n                font-size: inherit;\n                padding: .2em 0 0;\n                margin-left: .8em;\n                margin-right: .8em;\n                margin-bottom: .2em;\n                width: 100%;\n                border-bottom: 1px solid transparent;\n            }\n            \n            .menubar-menu-container .action-label.separator.text {\n                padding: 0.7em 1em 0.1em 1em;\n                font-weight: bold;\n                opacity: 1;\n            }\n            \n            .menubar-menu-container .action-label:hover {\n                color: inherit;\n            }\n            \n            .menubar-menu-container .menu-item-check {\n                position: absolute;\n                visibility: hidden;\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='-2 -2 16 16'%3E%3Cpath fill='%23424242' d='M9 0L4.5 9 3 6H0l3 6h3l6-12z'/%3E%3C/svg%3E\") no-repeat 50% 56%/15px 15px;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='-2 -2 16 16'%3E%3Cpath fill='%23424242' d='M9 0L4.5 9 3 6H0l3 6h3l6-12z'/%3E%3C/svg%3E\") no-repeat 50% 56%/15px 15px;\n                width: 2em;\n                height: 100%;\n            }\n            \n            .menubar-menu-container .action-menu-item.checked .menu-item-check {\n                visibility: visible;\n            }\n            ");
        });
        // Title
        _this.registerTheme(function (collector) {
            collector.addRule("\n            .titlebar .window-title {\n                flex: 0 1 auto;\n                font-size: 12px;\n                overflow: hidden;\n                white-space: nowrap;\n                text-overflow: ellipsis;\n                margin: 0 auto;\n                zoom: 1;\n            }\n            ");
        });
        // Window controls
        _this.registerTheme(function (collector) {
            collector.addRule("\n            .titlebar .window-controls-container {\n                display: flex;\n                flex-grow: 0;\n                flex-shrink: 0;\n                text-align: center;\n                position: relative;\n                z-index: 99;\n                -webkit-app-region: no-drag;\n                height: 30px;\n                margin-left: 5px;\n            }\n            ");
        });
        // Resizer
        _this.registerTheme(function (collector) {
            collector.addRule("\n            .titlebar.windows .resizer, .titlebar.linux .resizer {\n                -webkit-app-region: no-drag;\n                position: absolute;\n            }\n        \n            .titlebar.windows .resizer.top, .titlebar.linux .resizer.top {\n                top: 0;\n                width: 100%;\n                height: 6px;\n            }\n        \n            .titlebar.windows .resizer.left, .titlebar.linux .resizer.left {\n                top: 0;\n                left: 0;\n                width: 6px;\n                height: 100%;\n            }\n            ");
        });
        return _this;
    }
    Themebar.prototype.registerTheme = function (theme) {
        this.onThemeChange(theme);
        var cssRules = [];
        var hasRule = {};
        var ruleCollector = {
            addRule: function (rule) {
                if (!hasRule[rule]) {
                    cssRules.push(rule);
                    hasRule[rule] = true;
                }
            }
        };
        this.getTheming().forEach(function (p) { return p(ruleCollector); });
        _applyRules(cssRules.join('\n'), 'titlebar-style');
    };
    Object.defineProperty(Themebar, "win", {
        get: function () {
            return (function (collector) {
                collector.addRule("\n            .titlebar .window-controls-container .window-icon-bg {\n                display: inline-block;\n                -webkit-app-region: no-drag;\n                height: 100%;\n                width: 46px;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg .window-icon {\n                height: 100%;\n                width: 100%;\n                -webkit-mask-size: 23.1% !important;\n                mask-size: 23.1% !important;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg .window-icon.window-close {\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg .window-icon.window-close:hover {\n                background-color: #ffffff!important;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg .window-icon.window-unmaximize {\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg .window-icon.window-maximize {\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg .window-icon.window-minimize {\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg.window-close-bg:hover {\n                background-color: rgba(232, 17, 35, 0.9)!important;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg.inactive {\n                background-color: transparent!important;\n            }\n\n            .titlebar .window-controls-container .window-icon-bg.inactive .window-icon {\n                opacity: .4;\n            }\n            \n            .titlebar .window-controls-container .window-icon {\n                background-color: #eeeeee;\n            }\n\n            .titlebar.light .window-controls-container .window-icon {\n                background-color: #333333;\n            }\n\n            .titlebar.inactive .window-controls-container .window-icon {\n                opacity: .7;\n            }\n\n            .titlebar .window-controls-container .window-icon-bg:not(.inactive):hover {\n                background-color: rgba(255, 255, 255, .1);\n            }\n\n            .titlebar.light .window-controls-container .window-icon-bg:not(.inactive):hover {\n                background-color: rgba(0, 0, 0, .1);\n            }\n        ");
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Themebar, "mac", {
        get: function () {
            return (function (collector) {
                collector.addRule("\n            .titlebar .window-controls-container .window-icon-bg {\n                display: inline-block;\n                -webkit-app-region: no-drag;\n                height: 15px;\n                width: 15px;\n                margin: 7.5px 6px;\n                border-radius: 50%;\n                overflow: hidden;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg.inactive {\n                background-color: #cdcdcd;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:nth-child(2n) {\n                order: -1;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive) .window-icon {\n                height: 100%;\n                width: 100%;\n                background-color: transparent;\n                -webkit-mask-size: 100% !important;\n                mask-size: 100% !important;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive) .window-icon:hover {\n                background-color: rgba(0, 0, 0, 0.4);\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive):first-child {\n                background-color: #febc28;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive):first-child:hover {\n                background-color: #feb30a;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive):nth-child(2n) {\n                background-color: #01cc4e;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive):nth-child(2n):hover {\n                background-color: #01ae42;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive).window-close-bg {\n                background-color: #ff5b5d;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive).window-close-bg:hover {\n                background-color: #ff3c3f;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive).window-close-bg .window-close {\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive) .window-maximize {\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.17,12L15,8.83L16.41,7.41L21,12L16.41,16.58L15,15.17L18.17,12M5.83,12L9,15.17L7.59,16.59L3,12L7.59,7.42L9,8.83L5.83,12Z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                transform: rotate(-45deg);\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive) .window-unmaximize {\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.41,7.41L10,12L5.41,16.59L4,15.17L7.17,12L4,8.83L5.41,7.41M18.59,16.59L14,12L18.59,7.42L20,8.83L16.83,12L20,15.17L18.59,16.59Z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.41,7.41L10,12L5.41,16.59L4,15.17L7.17,12L4,8.83L5.41,7.41M18.59,16.59L14,12L18.59,7.42L20,8.83L16.83,12L20,15.17L18.59,16.59Z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                transform: rotate(-45deg);\n            }\n            \n            .titlebar .window-controls-container .window-icon-bg:not(.inactive) .window-minimize {\n                -webkit-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19,13H5V11H19V13Z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n                mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19,13H5V11H19V13Z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%;\n            }\n        ");
            });
        },
        enumerable: true,
        configurable: true
    });
    return Themebar;
}(ThemingRegistry));
exports.Themebar = Themebar;
function _applyRules(styleSheetContent, rulesClassName) {
    var themeStyles = document.head.getElementsByClassName(rulesClassName);
    if (themeStyles.length === 0) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.className = rulesClassName;
        styleElement.innerHTML = styleSheetContent;
        document.head.appendChild(styleElement);
    }
    else {
        themeStyles[0].innerHTML = styleSheetContent;
    }
}
