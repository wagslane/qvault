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
exports.__esModule = true;
var dom_1 = require("../common/dom");
var electron_1 = require("electron");
var menu_1 = require("./menu");
var keyCodes_1 = require("../common/keyCodes");
var lifecycle_1 = require("../common/lifecycle");
var MenuItem = /** @class */ (function (_super) {
    __extends(MenuItem, _super);
    function MenuItem(item, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.item = item;
        _this.options = options;
        _this.currentWindow = electron_1.remote.getCurrentWindow();
        // Set mnemonic
        if (_this.item.label && options.enableMnemonics) {
            var label = _this.item.label;
            if (label) {
                var matches = menu_1.MENU_MNEMONIC_REGEX.exec(label);
                if (matches) {
                    _this.mnemonic = keyCodes_1.KeyCodeUtils.fromString((!!matches[1] ? matches[1] : matches[2]).toLocaleUpperCase());
                }
            }
        }
        return _this;
    }
    MenuItem.prototype.getContainer = function () {
        return this.container;
    };
    MenuItem.prototype.getItem = function () {
        return this.item;
    };
    MenuItem.prototype.isEnabled = function () {
        return this.item.enabled;
    };
    MenuItem.prototype.isSeparator = function () {
        return this.item.type === 'separator';
    };
    MenuItem.prototype.render = function (container) {
        var _this = this;
        this.container = container;
        this._register(dom_1.addDisposableListener(this.container, dom_1.EventType.MOUSE_DOWN, function (e) {
            if (_this.item.enabled && e.button === 0 && _this.container) {
                dom_1.addClass(_this.container, 'active');
            }
        }));
        this._register(dom_1.addDisposableListener(this.container, dom_1.EventType.CLICK, function (e) {
            if (_this.item.enabled) {
                _this.onClick(e);
            }
        }));
        this._register(dom_1.addDisposableListener(this.container, dom_1.EventType.DBLCLICK, function (e) {
            dom_1.EventHelper.stop(e, true);
        }));
        [dom_1.EventType.MOUSE_UP, dom_1.EventType.MOUSE_OUT].forEach(function (event) {
            _this._register(dom_1.addDisposableListener(_this.container, event, function (e) {
                dom_1.EventHelper.stop(e);
                dom_1.removeClass(_this.container, 'active');
            }));
        });
        this.itemElement = dom_1.append(this.container, dom_1.$('a.action-menu-item'));
        this.itemElement.setAttribute('role', 'menuitem');
        if (this.mnemonic) {
            this.itemElement.setAttribute('aria-keyshortcuts', "" + this.mnemonic);
        }
        this.checkElement = dom_1.append(this.itemElement, dom_1.$('span.menu-item-check'));
        this.checkElement.setAttribute('role', 'none');
        this.labelElement = dom_1.append(this.itemElement, dom_1.$('span.action-label'));
        if (this.item.label && this.item.accelerator) {
            dom_1.append(this.itemElement, dom_1.$('span.keybinding')).textContent = this.item.accelerator.toString();
        }
        this.updateLabel();
        this.updateTooltip();
        this.updateEnabled();
        this.updateChecked();
    };
    MenuItem.prototype.onClick = function (event) {
        dom_1.EventHelper.stop(event, true);
        if (this.item.click) {
            this.item.click(this.item, this.currentWindow, this.event);
        }
        if (this.item.type === 'checkbox') {
            this.item.checked = !this.item.checked;
            this.updateChecked();
        }
    };
    MenuItem.prototype.focus = function () {
        if (this.container) {
            this.container.focus();
            dom_1.addClass(this.container, 'focused');
        }
        this.applyStyle();
    };
    MenuItem.prototype.blur = function () {
        if (this.container) {
            this.container.blur();
            dom_1.removeClass(this.container, 'focused');
        }
        this.applyStyle();
    };
    MenuItem.prototype.updateLabel = function () {
        if (this.item.label) {
            var label = this.item.label;
            if (label) {
                var cleanLabel = menu_1.cleanMnemonic(label);
                if (!this.options.enableMnemonics) {
                    label = cleanLabel;
                }
                this.labelElement.setAttribute('aria-label', cleanLabel);
                var matches = menu_1.MENU_MNEMONIC_REGEX.exec(label);
                if (matches) {
                    label = escape(label).replace(menu_1.MENU_ESCAPED_MNEMONIC_REGEX, '<u aria-hidden="true">$1</u>');
                    this.itemElement.setAttribute('aria-keyshortcuts', (!!matches[1] ? matches[1] : matches[2]).toLocaleLowerCase());
                }
            }
            this.labelElement.innerHTML = label.trim();
        }
    };
    MenuItem.prototype.updateTooltip = function () {
        var title = null;
        if (this.item.sublabel) {
            title = this.item.sublabel;
        }
        else if (!this.item.label && this.item.label && this.item.icon) {
            title = this.item.label;
            if (this.item.accelerator) {
                title = this.item.accelerator.toString();
            }
        }
        if (title) {
            this.itemElement.title = title;
        }
    };
    MenuItem.prototype.updateEnabled = function () {
        if (this.item.enabled && this.item.type !== 'separator') {
            dom_1.removeClass(this.container, 'disabled');
            this.container.tabIndex = 0;
        }
        else {
            dom_1.addClass(this.container, 'disabled');
        }
    };
    MenuItem.prototype.updateChecked = function () {
        if (this.item.checked) {
            dom_1.addClass(this.itemElement, 'checked');
            this.itemElement.setAttribute('role', 'menuitemcheckbox');
            this.itemElement.setAttribute('aria-checked', 'true');
        }
        else {
            dom_1.removeClass(this.itemElement, 'checked');
            this.itemElement.setAttribute('role', 'menuitem');
            this.itemElement.setAttribute('aria-checked', 'false');
        }
    };
    MenuItem.prototype.dispose = function () {
        if (this.itemElement) {
            dom_1.removeNode(this.itemElement);
            this.itemElement = undefined;
        }
        _super.prototype.dispose.call(this);
    };
    MenuItem.prototype.getMnemonic = function () {
        return this.mnemonic;
    };
    MenuItem.prototype.applyStyle = function () {
        if (!this.menuStyle) {
            return;
        }
        var isSelected = this.container && dom_1.hasClass(this.container, 'focused');
        var fgColor = isSelected && this.menuStyle.selectionForegroundColor ? this.menuStyle.selectionForegroundColor : this.menuStyle.foregroundColor;
        var bgColor = isSelected && this.menuStyle.selectionBackgroundColor ? this.menuStyle.selectionBackgroundColor : this.menuStyle.backgroundColor;
        this.checkElement.style.backgroundColor = fgColor ? fgColor.toString() : null;
        this.itemElement.style.color = fgColor ? fgColor.toString() : null;
        this.itemElement.style.backgroundColor = bgColor ? bgColor.toString() : null;
    };
    MenuItem.prototype.style = function (style) {
        this.menuStyle = style;
        this.applyStyle();
    };
    return MenuItem;
}(lifecycle_1.Disposable));
exports.MenuItem = MenuItem;
