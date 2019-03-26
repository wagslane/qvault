"use strict";
/*--------------------------------------------------------------------------------------------------------
 *  This file has been modified by @AlexTorresSk (http://github.com/AlexTorresSk)
 *  to work in custom-electron-titlebar.
 *
 *  The original copy of this file and its respective license are in https://github.com/Microsoft/vscode/
 *
 *  Copyright (c) 2018 Alex Torres
 *  Licensed under the MIT License. See License in the project root for license information.
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var platform_1 = require("./common/platform");
var color_1 = require("./common/color");
var dom_1 = require("./common/dom");
var menubar_1 = require("./menubar");
var electron_1 = require("electron");
var themebar_1 = require("./themebar");
var INACTIVE_FOREGROUND_DARK = color_1.Color.fromHex('#222222');
var ACTIVE_FOREGROUND_DARK = color_1.Color.fromHex('#333333');
var INACTIVE_FOREGROUND = color_1.Color.fromHex('#EEEEEE');
var ACTIVE_FOREGROUND = color_1.Color.fromHex('#FFFFFF');
var defaultOptions = {
    backgroundColor: color_1.Color.fromHex('#444444'),
    iconsTheme: themebar_1.Themebar.win,
    shadow: false,
    menu: electron_1.remote.Menu.getApplicationMenu(),
    minimizable: true,
    maximizable: true,
    closeable: true,
    enableMnemonics: true
};
var Titlebar = /** @class */ (function (_super) {
    __extends(Titlebar, _super);
    function Titlebar(options) {
        var _this = _super.call(this) || this;
        _this.currentWindow = electron_1.remote.getCurrentWindow();
        _this._options = __assign({}, defaultOptions, options);
        _this.registerListeners();
        _this.createTitlebar();
        _this.updateStyles();
        _this.registerTheme(_this._options.iconsTheme);
        return _this;
    }
    Titlebar.prototype.registerListeners = function () {
        var _this = this;
        this.currentWindow.on(dom_1.EventType.FOCUS, function () {
            _this.onDidChangeWindowFocus(true);
            _this.onFocus();
        });
        this.currentWindow.on(dom_1.EventType.BLUR, function () {
            _this.onDidChangeWindowFocus(false);
            _this.onBlur();
        });
        this.currentWindow.on(dom_1.EventType.MAXIMIZE, function () {
            _this.onDidChangeMaximized(true);
        });
        this.currentWindow.on(dom_1.EventType.UNMAXIMIZE, function () {
            _this.onDidChangeMaximized(false);
        });
        this.currentWindow.on(dom_1.EventType.ENTER_FULLSCREEN, function () {
            _this.onDidChangeFullscreen(true);
        });
        this.currentWindow.on(dom_1.EventType.LEAVE_FULLSCREEN, function () {
            _this.onDidChangeFullscreen(false);
        });
    };
    Titlebar.prototype.createTitlebar = function () {
        var _this = this;
        // Content container
        this.container = dom_1.$('div.container-after-titlebar');
        this.container.style.overflow = 'auto';
        this.container.style.width = '100%';
        while (document.body.firstChild) {
            dom_1.append(this.container, document.body.firstChild);
        }
        dom_1.append(document.body, this.container);
        document.body.style.overflow = 'hidden';
        document.body.style.margin = '0';
        // Titlebar
        this.titlebar = dom_1.$('div.titlebar');
        dom_1.addClass(this.titlebar, platform_1.isWindows ? 'windows' : platform_1.isLinux ? 'linux' : 'mac');
        if (this._options.order) {
            dom_1.addClass(this.titlebar, this._options.order);
        }
        if (this._options.shadow) {
            this.titlebar.style.boxShadow = "0 2px 1px -1px rgba(0, 0, 0, .2), 0 1px 1px 0 rgba(0, 0, 0, .14), 0 1px 3px 0 rgba(0, 0, 0, .12)";
        }
        this.dragRegion = dom_1.append(this.titlebar, dom_1.$('div.titlebar-drag-region'));
        // App Icon (Windows/Linux)
        if (!platform_1.isMacintosh && this._options.icon) {
            this.appIcon = dom_1.append(this.titlebar, dom_1.$('div.window-appicon'));
            this.updateIcon(this._options.icon);
        }
        // Menubar
        this.menubarContainer = dom_1.append(this.titlebar, dom_1.$('div.menubar'));
        this.menubarContainer.setAttribute('role', 'menubar');
        if (this._options.menu) {
            this.updateMenu(this._options.menu);
            this.updateMenuPosition(this._options.menuPosition);
        }
        // Title
        this.title = dom_1.append(this.titlebar, dom_1.$('div.window-title'));
        if (!platform_1.isMacintosh) {
            this.title.style.cursor = 'default';
        }
        this.updateTitle();
        this.setHorizontalAlignment(this._options.titleHorizontalAlignment);
        // Maximize/Restore on doubleclick
        if (platform_1.isMacintosh) {
            var isMaximized_1 = this.currentWindow.isMaximized();
            this._register(dom_1.addDisposableListener(this.titlebar, dom_1.EventType.DBLCLICK, function () {
                isMaximized_1 = !isMaximized_1;
                _this.onDidChangeMaximized(isMaximized_1);
            }));
        }
        // Window Controls (Windows/Linux)
        if (!platform_1.isMacintosh) {
            this.windowControls = dom_1.append(this.titlebar, dom_1.$('div.window-controls-container'));
            // Minimize
            var minimizeIconContainer = dom_1.append(this.windowControls, dom_1.$('div.window-icon-bg'));
            var minimizeIcon = dom_1.append(minimizeIconContainer, dom_1.$('div.window-icon'));
            dom_1.addClass(minimizeIcon, 'window-minimize');
            if (!this._options.minimizable) {
                dom_1.addClass(minimizeIconContainer, 'inactive');
            }
            else {
                this._register(dom_1.addDisposableListener(minimizeIcon, dom_1.EventType.CLICK, function (e) {
                    _this.currentWindow.minimize();
                }));
            }
            // Restore
            var restoreIconContainer = dom_1.append(this.windowControls, dom_1.$('div.window-icon-bg'));
            this.maxRestoreControl = dom_1.append(restoreIconContainer, dom_1.$('div.window-icon'));
            dom_1.addClass(this.maxRestoreControl, 'window-max-restore');
            if (!this._options.maximizable) {
                dom_1.addClass(restoreIconContainer, 'inactive');
            }
            else {
                this._register(dom_1.addDisposableListener(this.maxRestoreControl, dom_1.EventType.CLICK, function (e) {
                    if (_this.currentWindow.isMaximized()) {
                        _this.currentWindow.unmaximize();
                        _this.onDidChangeMaximized(false);
                    }
                    else {
                        _this.currentWindow.maximize();
                        _this.onDidChangeMaximized(true);
                    }
                }));
            }
            // Close
            var closeIconContainer = dom_1.append(this.windowControls, dom_1.$('div.window-icon-bg'));
            dom_1.addClass(closeIconContainer, 'window-close-bg');
            var closeIcon = dom_1.append(closeIconContainer, dom_1.$('div.window-icon'));
            dom_1.addClass(closeIcon, 'window-close');
            if (!this._options.closeable) {
                dom_1.addClass(closeIconContainer, 'inactive');
            }
            else {
                this._register(dom_1.addDisposableListener(closeIcon, dom_1.EventType.CLICK, function (e) {
                    _this.currentWindow.close();
                }));
            }
            // Resizer
            this.resizer = {
                top: dom_1.append(this.titlebar, dom_1.$('div.resizer.top')),
                left: dom_1.append(this.titlebar, dom_1.$('div.resizer.left'))
            };
            this.onDidChangeMaximized(this.currentWindow.isMaximized());
        }
        dom_1.prepend(document.body, this.titlebar);
    };
    Titlebar.prototype.onBlur = function () {
        this.isInactive = true;
        this.updateStyles();
    };
    Titlebar.prototype.onFocus = function () {
        this.isInactive = false;
        this.updateStyles();
    };
    Titlebar.prototype.onMenubarVisibilityChanged = function (visible) {
        var _this = this;
        if (platform_1.isWindows || platform_1.isLinux) {
            // Hide title when toggling menu bar
            if (visible) {
                // Hack to fix issue #52522 with layered webkit-app-region elements appearing under cursor
                dom_1.hide(this.dragRegion);
                setTimeout(function () { return dom_1.show(_this.dragRegion); }, 50);
            }
        }
    };
    Titlebar.prototype.onMenubarFocusChanged = function (focused) {
        if (platform_1.isWindows || platform_1.isLinux) {
            if (focused) {
                dom_1.hide(this.dragRegion);
            }
            else {
                dom_1.show(this.dragRegion);
            }
        }
    };
    Titlebar.prototype.onDidChangeWindowFocus = function (hasFocus) {
        if (this.titlebar) {
            if (hasFocus) {
                dom_1.removeClass(this.titlebar, 'inactive');
            }
            else {
                dom_1.addClass(this.titlebar, 'inactive');
                if (this.menubar) {
                    this.menubar.blur();
                }
            }
        }
    };
    Titlebar.prototype.onDidChangeMaximized = function (maximized) {
        if (this.maxRestoreControl) {
            if (maximized) {
                dom_1.removeClass(this.maxRestoreControl, 'window-maximize');
                dom_1.addClass(this.maxRestoreControl, 'window-unmaximize');
            }
            else {
                dom_1.removeClass(this.maxRestoreControl, 'window-unmaximize');
                dom_1.addClass(this.maxRestoreControl, 'window-maximize');
            }
        }
        if (this.resizer) {
            if (maximized) {
                dom_1.hide(this.resizer.top, this.resizer.left);
            }
            else {
                dom_1.show(this.resizer.top, this.resizer.left);
            }
        }
    };
    Titlebar.prototype.onDidChangeFullscreen = function (fullscreen) {
        if (!platform_1.isMacintosh) {
            if (fullscreen) {
                dom_1.hide(this.appIcon, this.title, this.windowControls);
            }
            else {
                dom_1.show(this.appIcon, this.title, this.windowControls);
            }
        }
    };
    Titlebar.prototype.updateStyles = function () {
        if (this.titlebar) {
            if (this.isInactive) {
                dom_1.addClass(this.titlebar, 'inactive');
            }
            else {
                dom_1.removeClass(this.titlebar, 'inactive');
            }
            var titleBackground = this.isInactive ? this._options.backgroundColor.lighten(.3) : this._options.backgroundColor;
            this.titlebar.style.backgroundColor = titleBackground.toString();
            if (titleBackground.isLighter()) {
                dom_1.addClass(this.titlebar, 'light');
                var titleForeground = this.isInactive ? INACTIVE_FOREGROUND_DARK : ACTIVE_FOREGROUND_DARK;
                this.titlebar.style.color = titleForeground.toString();
            }
            else {
                dom_1.removeClass(this.titlebar, 'light');
                var titleForeground = this.isInactive ? INACTIVE_FOREGROUND : ACTIVE_FOREGROUND;
                this.titlebar.style.color = titleForeground.toString();
            }
            var backgroundColor = this._options.backgroundColor.darken(.16);
            var foregroundColor = backgroundColor.isLighter() ? INACTIVE_FOREGROUND_DARK : INACTIVE_FOREGROUND;
            var bgColor = !this._options.itemBackgroundColor ||
                this._options.itemBackgroundColor.equals(backgroundColor) ? new color_1.Color(new color_1.RGBA(0, 0, 0, .14)) : this._options.itemBackgroundColor;
            var fgColor = bgColor.isLighter() ? ACTIVE_FOREGROUND_DARK : ACTIVE_FOREGROUND;
            if (this.menubar) {
                this.menubar.setStyles({
                    backgroundColor: backgroundColor,
                    foregroundColor: foregroundColor,
                    selectionBackgroundColor: bgColor,
                    selectionForegroundColor: fgColor,
                    separatorColor: foregroundColor
                });
            }
        }
    };
    Object.defineProperty(Titlebar.prototype, "options", {
        /**
         * get the options of the titlebar
         */
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    /**
   * Update the background color of the title bar
   * @param backgroundColor The color for the background
   */
    Titlebar.prototype.updateBackground = function (backgroundColor) {
        this._options.backgroundColor = backgroundColor;
        this.updateStyles();
    };
    /**
   * Update the title of the title bar.
   * You can use this method if change the content of `<title>` tag on your html.
   * @param title The title of the title bar and document.
   */
    Titlebar.prototype.updateTitle = function (title) {
        if (this.title) {
            if (title) {
                document.title = title;
            }
            else {
                title = document.title;
            }
            this.title.innerText = title;
        }
    };
    /**
     * It method set new icon to title-bar-icon of title-bar.
     * @param path path to icon
     */
    Titlebar.prototype.updateIcon = function (path) {
        if (path === null || path === '') {
            return;
        }
        if (this.appIcon) {
            this.appIcon.style.backgroundImage = "url(\"" + path + "\")";
        }
    };
    /**
     * Update the default menu or set a new menu.
     * @param menu The menu.
     */
    // Menu enhancements, moved menu to bottom of window-titlebar. (by @MairwunNx) https://github.com/AlexTorresSk/custom-electron-titlebar/pull/9
    Titlebar.prototype.updateMenu = function (menu) {
        var _this = this;
        if (!platform_1.isMacintosh) {
            if (this.menubar) {
                this.menubar.dispose();
                this._options.menu = menu;
            }
            this.menubar = new menubar_1.Menubar(this.menubarContainer, this._options);
            this.menubar.setupMenubar();
            this._register(this.menubar.onVisibilityChange(function (e) { return _this.onMenubarVisibilityChanged(e); }));
            this._register(this.menubar.onFocusStateChange(function (e) { return _this.onMenubarFocusChanged(e); }));
            this.updateStyles();
        }
        else {
            electron_1.remote.Menu.setApplicationMenu(menu);
        }
    };
    /**
     * Update the position of menubar.
     * @param menuPosition The position of the menu `left` or `bottom`.
     */
    Titlebar.prototype.updateMenuPosition = function (menuPosition) {
        this._options.menuPosition = menuPosition;
        this.titlebar.style.webkitFlexWrap = this._options.menuPosition && this._options.menuPosition === 'bottom' ? 'wrap' : null;
        dom_1.removeClass(this.menubarContainer, 'bottom');
    };
    /**
     * Horizontal alignment of the title.
     * @param side `left`, `center` or `right`.
     */
    // Add ability to customize title-bar title. (by @MairwunNx) https://github.com/AlexTorresSk/custom-electron-titlebar/pull/8
    Titlebar.prototype.setHorizontalAlignment = function (side) {
        if (this.title) {
            if (side === 'left' || (side === 'right' && this._options.order === 'inverted')) {
                this.title.style.marginLeft = '8px';
                this.title.style.marginRight = 'auto';
            }
            if (side === 'right' || (side === 'left' && this._options.order === 'inverted')) {
                this.title.style.marginRight = '8px';
                this.title.style.marginLeft = 'auto';
            }
            if (side === 'center' || side === undefined) {
                this.title.style.marginRight = 'auto';
                this.title.style.marginLeft = 'auto';
            }
        }
    };
    /**
     * Remove the titlebar and all methods.
     */
    Titlebar.prototype.dispose = function () {
        this.menubar.dispose();
        _super.prototype.dispose.call(this);
        dom_1.removeNode(this.titlebar);
        while (this.container.firstChild) {
            dom_1.append(document.body, this.container.firstChild);
        }
        dom_1.removeNode(this.container);
    };
    return Titlebar;
}(themebar_1.Themebar));
exports.Titlebar = Titlebar;
exports.IsMacintosh = platform_1.isMacintosh;
