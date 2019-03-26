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
var keyCodes_1 = require("../common/keyCodes");
var platform_1 = require("../common/platform");
var keyboardEvent_1 = require("../browser/keyboardEvent");
var menuitem_1 = require("./menuitem");
var lifecycle_1 = require("../common/lifecycle");
var event_1 = require("../common/event");
var async_1 = require("../common/async");
exports.MENU_MNEMONIC_REGEX = /\(&{1,2}(.)\)|&{1,2}(.)/;
exports.MENU_ESCAPED_MNEMONIC_REGEX = /(?:&amp;){1,2}(.)/;
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(container, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.triggerKeys = {
            keys: [3 /* Enter */, 10 /* Space */],
            keyDown: true
        };
        _this.parentData = {
            parent: _this
        };
        _this._onDidCancel = _this._register(new event_1.Emitter());
        _this.menuContainer = container;
        _this.options = options;
        _this.items = [];
        _this.focusedItem = undefined;
        _this.mnemonics = new Map();
        _this._register(dom_1.addDisposableListener(_this.menuContainer, dom_1.EventType.KEY_DOWN, function (e) {
            var event = new keyboardEvent_1.StandardKeyboardEvent(e);
            var eventHandled = true;
            if (event.equals(16 /* UpArrow */)) {
                _this.focusPrevious();
            }
            else if (event.equals(18 /* DownArrow */)) {
                _this.focusNext();
            }
            else if (event.equals(9 /* Escape */)) {
                _this.cancel();
            }
            else if (_this.isTriggerKeyEvent(event)) {
                // Staying out of the else branch even if not triggered
                if (_this.triggerKeys && _this.triggerKeys.keyDown) {
                    _this.doTrigger(event);
                }
            }
            else {
                eventHandled = false;
            }
            if (eventHandled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }));
        _this._register(dom_1.addDisposableListener(_this.menuContainer, dom_1.EventType.KEY_UP, function (e) {
            var event = new keyboardEvent_1.StandardKeyboardEvent(e);
            // Run action on Enter/Space
            if (_this.isTriggerKeyEvent(event)) {
                if (_this.triggerKeys && !_this.triggerKeys.keyDown) {
                    _this.doTrigger(event);
                }
                event.preventDefault();
                event.stopPropagation();
            }
            // Recompute focused item
            else if (event.equals(2 /* Tab */) || event.equals(1024 /* Shift */ | 2 /* Tab */)) {
                _this.updateFocusedItem();
            }
        }));
        if (options.enableMnemonics) {
            _this._register(dom_1.addDisposableListener(_this.menuContainer, dom_1.EventType.KEY_DOWN, function (e) {
                var key = keyCodes_1.KeyCodeUtils.fromString(e.key);
                if (_this.mnemonics.has(key)) {
                    var items = _this.mnemonics.get(key);
                    if (items.length === 1) {
                        if (items[0] instanceof Submenu) {
                            _this.focusItemByElement(items[0].getContainer());
                        }
                        items[0].onClick(e);
                    }
                    if (items.length > 1) {
                        var item = items.shift();
                        if (item) {
                            _this.focusItemByElement(item.getContainer());
                            items.push(item);
                        }
                        _this.mnemonics.set(key, items);
                    }
                }
            }));
        }
        if (platform_1.isLinux) {
            _this._register(dom_1.addDisposableListener(_this.menuContainer, dom_1.EventType.KEY_DOWN, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                if (event.equals(14 /* Home */) || event.equals(11 /* PageUp */)) {
                    _this.focusedItem = _this.items.length - 1;
                    _this.focusNext();
                    dom_1.EventHelper.stop(e, true);
                }
                else if (event.equals(13 /* End */) || event.equals(12 /* PageDown */)) {
                    _this.focusedItem = 0;
                    _this.focusPrevious();
                    dom_1.EventHelper.stop(e, true);
                }
            }));
        }
        _this._register(dom_1.addDisposableListener(_this.menuContainer, dom_1.EventType.MOUSE_OUT, function (e) {
            var relatedTarget = e.relatedTarget;
            if (!dom_1.isAncestor(relatedTarget, _this.menuContainer)) {
                _this.focusedItem = undefined;
                _this.updateFocus();
                e.stopPropagation();
            }
        }));
        _this._register(dom_1.addDisposableListener(_this.menuContainer, dom_1.EventType.MOUSE_UP, function (e) {
            // Absorb clicks in menu dead space https://github.com/Microsoft/vscode/issues/63575
            dom_1.EventHelper.stop(e, true);
        }));
        _this._register(dom_1.addDisposableListener(_this.menuContainer, dom_1.EventType.MOUSE_OVER, function (e) {
            var target = e.target;
            if (!target || !dom_1.isAncestor(target, _this.menuContainer) || target === _this.menuContainer) {
                return;
            }
            while (target.parentElement !== _this.menuContainer && target.parentElement !== null) {
                target = target.parentElement;
            }
            if (dom_1.hasClass(target, 'action-item')) {
                var lastFocusedItem = _this.focusedItem;
                _this.setFocusedItem(target);
                if (lastFocusedItem !== _this.focusedItem) {
                    _this.updateFocus();
                }
            }
        }));
        if (_this.options.ariaLabel) {
            _this.menuContainer.setAttribute('aria-label', _this.options.ariaLabel);
        }
        return _this;
        //container.style.maxHeight = `${Math.max(10, window.innerHeight - container.getBoundingClientRect().top - 70)}px`;
    }
    Object.defineProperty(Menu.prototype, "onDidCancel", {
        get: function () { return this._onDidCancel.event; },
        enumerable: true,
        configurable: true
    });
    Menu.prototype.setAriaLabel = function (label) {
        if (label) {
            this.menuContainer.setAttribute('aria-label', label);
        }
        else {
            this.menuContainer.removeAttribute('aria-label');
        }
    };
    Menu.prototype.isTriggerKeyEvent = function (event) {
        var ret = false;
        if (this.triggerKeys) {
            this.triggerKeys.keys.forEach(function (keyCode) {
                ret = ret || event.equals(keyCode);
            });
        }
        return ret;
    };
    Menu.prototype.updateFocusedItem = function () {
        for (var i = 0; i < this.menuContainer.children.length; i++) {
            var elem = this.menuContainer.children[i];
            if (dom_1.isAncestor(document.activeElement, elem)) {
                this.focusedItem = i;
                break;
            }
        }
    };
    Menu.prototype.getContainer = function () {
        return this.menuContainer;
    };
    Menu.prototype.createMenu = function (items) {
        var _this = this;
        items.forEach(function (menuItem) {
            var itemElement = document.createElement('li');
            itemElement.className = 'action-item';
            itemElement.setAttribute('role', 'presentation');
            // Prevent native context menu on actions
            _this._register(dom_1.addDisposableListener(itemElement, dom_1.EventType.CONTEXT_MENU, function (e) {
                e.preventDefault();
                e.stopPropagation();
            }));
            var item = null;
            if (menuItem.type === 'separator') {
                item = new Separator(menuItem, _this.options);
            }
            else if (menuItem.type === 'submenu' || menuItem.submenu) {
                var submenuItems = menuItem.submenu.items;
                item = new Submenu(menuItem, submenuItems, _this.parentData, _this.options);
                if (_this.options.enableMnemonics) {
                    var mnemonic = item.getMnemonic();
                    if (mnemonic && item.isEnabled()) {
                        var actionItems = [];
                        if (_this.mnemonics.has(mnemonic)) {
                            actionItems = _this.mnemonics.get(mnemonic);
                        }
                        actionItems.push(item);
                        _this.mnemonics.set(mnemonic, actionItems);
                    }
                }
            }
            else {
                var menuItemOptions = { enableMnemonics: _this.options.enableMnemonics };
                item = new menuitem_1.MenuItem(menuItem, menuItemOptions);
                if (_this.options.enableMnemonics) {
                    var mnemonic = item.getMnemonic();
                    if (mnemonic && item.isEnabled()) {
                        var actionItems = [];
                        if (_this.mnemonics.has(mnemonic)) {
                            actionItems = _this.mnemonics.get(mnemonic);
                        }
                        actionItems.push(item);
                        _this.mnemonics.set(mnemonic, actionItems);
                    }
                }
            }
            item.render(itemElement);
            _this.menuContainer.appendChild(itemElement);
            _this.items.push(item);
        });
    };
    Menu.prototype.focus = function (arg) {
        var selectFirst = false;
        var index = undefined;
        if (arg === undefined) {
            selectFirst = true;
        }
        else if (typeof arg === 'number') {
            index = arg;
        }
        else if (typeof arg === 'boolean') {
            selectFirst = arg;
        }
        if (selectFirst && typeof this.focusedItem === 'undefined') {
            // Focus the first enabled item
            this.focusedItem = this.items.length - 1;
            this.focusNext();
        }
        else {
            if (index !== undefined) {
                this.focusedItem = index;
            }
            this.updateFocus();
        }
    };
    Menu.prototype.focusNext = function () {
        if (typeof this.focusedItem === 'undefined') {
            this.focusedItem = this.items.length - 1;
        }
        var startIndex = this.focusedItem;
        var item;
        do {
            this.focusedItem = (this.focusedItem + 1) % this.items.length;
            item = this.items[this.focusedItem];
        } while ((this.focusedItem !== startIndex && !item.isEnabled()) || item.isSeparator());
        if ((this.focusedItem === startIndex && !item.isEnabled()) || item.isSeparator()) {
            this.focusedItem = undefined;
        }
        this.updateFocus();
    };
    Menu.prototype.focusPrevious = function () {
        if (typeof this.focusedItem === 'undefined') {
            this.focusedItem = 0;
        }
        var startIndex = this.focusedItem;
        var item;
        do {
            this.focusedItem = this.focusedItem - 1;
            if (this.focusedItem < 0) {
                this.focusedItem = this.items.length - 1;
            }
            item = this.items[this.focusedItem];
        } while ((this.focusedItem !== startIndex && !item.isEnabled()) || item.isSeparator());
        if ((this.focusedItem === startIndex && !item.isEnabled()) || item.isSeparator()) {
            this.focusedItem = undefined;
        }
        this.updateFocus();
    };
    Menu.prototype.updateFocus = function () {
        if (typeof this.focusedItem === 'undefined') {
            this.menuContainer.focus();
        }
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (i === this.focusedItem) {
                if (item.isEnabled()) {
                    item.focus();
                }
                else {
                    this.menuContainer.focus();
                }
            }
            else {
                item.blur();
            }
        }
    };
    Menu.prototype.doTrigger = function (event) {
        if (typeof this.focusedItem === 'undefined') {
            return; //nothing to focus
        }
        // trigger action
        var item = this.items[this.focusedItem];
        if (item instanceof menuitem_1.MenuItem) {
            item.onClick(event);
        }
    };
    Menu.prototype.cancel = function () {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur(); // remove focus from focused action
        }
        this._onDidCancel.fire();
    };
    Menu.prototype.dispose = function () {
        lifecycle_1.dispose(this.items);
        this.items = [];
        dom_1.removeNode(this.getContainer());
        _super.prototype.dispose.call(this);
    };
    Menu.prototype.style = function (style) {
        var container = this.getContainer();
        container.style.backgroundColor = style.backgroundColor ? style.backgroundColor.toString() : null;
        if (this.items) {
            this.items.forEach(function (item) {
                if (item instanceof menuitem_1.MenuItem || item instanceof Separator) {
                    item.style(style);
                }
            });
        }
    };
    Menu.prototype.focusItemByElement = function (element) {
        var lastFocusedItem = this.focusedItem;
        this.setFocusedItem(element);
        if (lastFocusedItem !== this.focusedItem) {
            this.updateFocus();
        }
    };
    Menu.prototype.setFocusedItem = function (element) {
        for (var i = 0; i < this.menuContainer.children.length; i++) {
            var elem = this.menuContainer.children[i];
            if (element === elem) {
                this.focusedItem = i;
                break;
            }
        }
    };
    return Menu;
}(lifecycle_1.Disposable));
exports.Menu = Menu;
var Submenu = /** @class */ (function (_super) {
    __extends(Submenu, _super);
    function Submenu(item, submenuItems, parentData, submenuOptions) {
        var _this = _super.call(this, item, submenuOptions) || this;
        _this.submenuItems = submenuItems;
        _this.parentData = parentData;
        _this.submenuOptions = submenuOptions;
        _this.submenuDisposables = [];
        _this.showScheduler = new async_1.RunOnceScheduler(function () {
            if (_this.mouseOver) {
                _this.cleanupExistingSubmenu(false);
                _this.createSubmenu(false);
            }
        }, 250);
        _this.hideScheduler = new async_1.RunOnceScheduler(function () {
            if (_this.container && (!dom_1.isAncestor(document.activeElement, _this.container) && _this.parentData.submenu === _this.mysubmenu)) {
                _this.parentData.parent.focus(false);
                _this.cleanupExistingSubmenu(true);
            }
        }, 750);
        return _this;
    }
    Submenu.prototype.render = function (container) {
        var _this = this;
        _super.prototype.render.call(this, container);
        if (!this.itemElement) {
            return;
        }
        dom_1.addClass(this.itemElement, 'submenu-item');
        this.itemElement.setAttribute('aria-haspopup', 'true');
        this.submenuIndicator = dom_1.append(this.itemElement, dom_1.$('span.submenu-indicator'));
        this.submenuIndicator.setAttribute('aria-hidden', 'true');
        this._register(dom_1.addDisposableListener(this.container, dom_1.EventType.KEY_UP, function (e) {
            var event = new keyboardEvent_1.StandardKeyboardEvent(e);
            if (event.equals(17 /* RightArrow */) || event.equals(3 /* Enter */)) {
                dom_1.EventHelper.stop(e, true);
                _this.createSubmenu(true);
            }
        }));
        this._register(dom_1.addDisposableListener(this.container, dom_1.EventType.KEY_DOWN, function (e) {
            var event = new keyboardEvent_1.StandardKeyboardEvent(e);
            if (event.equals(17 /* RightArrow */) || event.equals(3 /* Enter */)) {
                dom_1.EventHelper.stop(e, true);
            }
        }));
        this._register(dom_1.addDisposableListener(this.container, dom_1.EventType.MOUSE_OVER, function (e) {
            if (!_this.mouseOver) {
                _this.mouseOver = true;
                _this.showScheduler.schedule();
            }
        }));
        this._register(dom_1.addDisposableListener(this.container, dom_1.EventType.MOUSE_LEAVE, function (e) {
            _this.mouseOver = false;
        }));
        this._register(dom_1.addDisposableListener(this.container, dom_1.EventType.FOCUS_OUT, function (e) {
            if (_this.container && !dom_1.isAncestor(document.activeElement, _this.container)) {
                _this.hideScheduler.schedule();
            }
        }));
    };
    Submenu.prototype.onClick = function (e) {
        // stop clicking from trying to run an action
        dom_1.EventHelper.stop(e, true);
        this.cleanupExistingSubmenu(false);
        this.createSubmenu(false);
    };
    Submenu.prototype.cleanupExistingSubmenu = function (force) {
        if (this.parentData.submenu && (force || (this.parentData.submenu !== this.mysubmenu))) {
            this.parentData.submenu.dispose();
            this.parentData.submenu = undefined;
            if (this.submenuContainer) {
                this.submenuContainer = undefined;
            }
        }
    };
    Submenu.prototype.createSubmenu = function (selectFirstItem) {
        var _this = this;
        if (selectFirstItem === void 0) { selectFirstItem = true; }
        if (!this.itemElement) {
            return;
        }
        if (!this.parentData.submenu) {
            this.submenuContainer = dom_1.append(this.container, dom_1.$('ul.submenu'));
            dom_1.addClasses(this.submenuContainer, 'menubar-menu-container');
            this.parentData.submenu = new Menu(this.submenuContainer, this.submenuOptions);
            this.parentData.submenu.createMenu(this.submenuItems);
            if (this.menuStyle) {
                this.parentData.submenu.style(this.menuStyle);
            }
            var boundingRect = this.container.getBoundingClientRect();
            var childBoundingRect = this.submenuContainer.getBoundingClientRect();
            var computedStyles = getComputedStyle(this.parentData.parent.getContainer());
            var paddingTop = parseFloat(computedStyles.paddingTop || '0') || 0;
            if (window.innerWidth <= boundingRect.right + childBoundingRect.width) {
                this.submenuContainer.style.left = '10px';
                this.submenuContainer.style.top = this.container.offsetTop + boundingRect.height + "px";
            }
            else {
                this.submenuContainer.style.left = this.container.offsetWidth + "px";
                this.submenuContainer.style.top = this.container.offsetTop - paddingTop + "px";
            }
            this.submenuDisposables.push(dom_1.addDisposableListener(this.submenuContainer, dom_1.EventType.KEY_UP, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                if (event.equals(15 /* LeftArrow */)) {
                    dom_1.EventHelper.stop(e, true);
                    _this.parentData.parent.focus();
                    if (_this.parentData.submenu) {
                        _this.parentData.submenu.dispose();
                        _this.parentData.submenu = undefined;
                    }
                    _this.submenuDisposables = lifecycle_1.dispose(_this.submenuDisposables);
                    _this.submenuContainer = undefined;
                }
            }));
            this.submenuDisposables.push(dom_1.addDisposableListener(this.submenuContainer, dom_1.EventType.KEY_DOWN, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                if (event.equals(15 /* LeftArrow */)) {
                    dom_1.EventHelper.stop(e, true);
                }
            }));
            this.submenuDisposables.push(this.parentData.submenu.onDidCancel(function () {
                _this.parentData.parent.focus();
                if (_this.parentData.submenu) {
                    _this.parentData.submenu.dispose();
                    _this.parentData.submenu = undefined;
                }
                _this.submenuDisposables = lifecycle_1.dispose(_this.submenuDisposables);
                _this.submenuContainer = undefined;
            }));
            this.parentData.submenu.focus(selectFirstItem);
            this.mysubmenu = this.parentData.submenu;
        }
        else {
            this.parentData.submenu.focus(false);
        }
    };
    Submenu.prototype.applyStyle = function () {
        _super.prototype.applyStyle.call(this);
        if (!this.menuStyle) {
            return;
        }
        var isSelected = this.container && dom_1.hasClass(this.container, 'focused');
        var fgColor = isSelected && this.menuStyle.selectionForegroundColor ? this.menuStyle.selectionForegroundColor : this.menuStyle.foregroundColor;
        this.submenuIndicator.style.backgroundColor = fgColor ? "" + fgColor : null;
        if (this.parentData.submenu) {
            this.parentData.submenu.style(this.menuStyle);
        }
    };
    Submenu.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.hideScheduler.dispose();
        if (this.mysubmenu) {
            this.mysubmenu.dispose();
            this.mysubmenu = null;
        }
        if (this.submenuContainer) {
            this.submenuDisposables = lifecycle_1.dispose(this.submenuDisposables);
            this.submenuContainer = undefined;
        }
    };
    return Submenu;
}(menuitem_1.MenuItem));
var Separator = /** @class */ (function (_super) {
    __extends(Separator, _super);
    function Separator(item, options) {
        return _super.call(this, item, options) || this;
    }
    Separator.prototype.render = function (container) {
        if (container) {
            this.separatorElement = dom_1.append(container, dom_1.$('a.action-label'));
            this.separatorElement.setAttribute('role', 'presentation');
            dom_1.addClass(this.separatorElement, 'separator');
        }
    };
    Separator.prototype.style = function (style) {
        this.separatorElement.style.borderBottomColor = style.separatorColor ? "" + style.separatorColor : null;
    };
    return Separator;
}(menuitem_1.MenuItem));
function cleanMnemonic(label) {
    var regex = exports.MENU_MNEMONIC_REGEX;
    var matches = regex.exec(label);
    if (!matches) {
        return label;
    }
    var mnemonicInText = matches[0].charAt(0) === '&';
    return label.replace(regex, mnemonicInText ? '$2' : '').trim();
}
exports.cleanMnemonic = cleanMnemonic;
