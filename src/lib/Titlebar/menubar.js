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
var electron_1 = require("electron");
var dom_1 = require("./common/dom");
var menu_1 = require("./menu/menu");
var keyboardEvent_1 = require("./browser/keyboardEvent");
var keyCodes_1 = require("./common/keyCodes");
var lifecycle_1 = require("./common/lifecycle");
var event_1 = require("./common/event");
var event_2 = require("./browser/event");
var platform_1 = require("./common/platform");
var MenubarState;
(function (MenubarState) {
    MenubarState[MenubarState["HIDDEN"] = 0] = "HIDDEN";
    MenubarState[MenubarState["VISIBLE"] = 1] = "VISIBLE";
    MenubarState[MenubarState["FOCUSED"] = 2] = "FOCUSED";
    MenubarState[MenubarState["OPEN"] = 3] = "OPEN";
})(MenubarState || (MenubarState = {}));
var Menubar = /** @class */ (function (_super) {
    __extends(Menubar, _super);
    function Menubar(container, options) {
        var _this = _super.call(this) || this;
        _this.container = container;
        _this.options = options;
        _this.menuItems = [];
        _this.mnemonics = new Map();
        _this._focusState = MenubarState.VISIBLE;
        _this._onVisibilityChange = _this._register(new event_1.Emitter());
        _this._onFocusStateChange = _this._register(new event_1.Emitter());
        _this._register(ModifierKeyEmitter.getInstance().event(_this.onModifierKeyToggled, _this));
        _this._register(dom_1.addDisposableListener(_this.container, dom_1.EventType.KEY_DOWN, function (e) {
            var event = new keyboardEvent_1.StandardKeyboardEvent(e);
            var eventHandled = true;
            var key = !!e.key ? keyCodes_1.KeyCodeUtils.fromString(e.key) : 0 /* Unknown */;
            if (event.equals(15 /* LeftArrow */)) {
                _this.focusPrevious();
            }
            else if (event.equals(17 /* RightArrow */)) {
                _this.focusNext();
            }
            else if (event.equals(9 /* Escape */) && _this.isFocused && !_this.isOpen) {
                _this.setUnfocusedState();
            }
            else if (!_this.isOpen && !event.ctrlKey && _this.options.enableMnemonics && _this.mnemonicsInUse && _this.mnemonics.has(key)) {
                var menuIndex = _this.mnemonics.get(key);
                _this.onMenuTriggered(menuIndex, false);
            }
            else {
                eventHandled = false;
            }
            if (eventHandled) {
                event.preventDefault();
                event.stopPropagation();
            }
        }));
        _this._register(dom_1.addDisposableListener(window, dom_1.EventType.MOUSE_DOWN, function () {
            // This mouse event is outside the menubar so it counts as a focus out
            if (_this.isFocused) {
                _this.setUnfocusedState();
            }
        }));
        _this._register(dom_1.addDisposableListener(_this.container, dom_1.EventType.FOCUS_IN, function (e) {
            var event = e;
            if (event.relatedTarget) {
                if (!_this.container.contains(event.relatedTarget)) {
                    _this.focusToReturn = event.relatedTarget;
                }
            }
        }));
        _this._register(dom_1.addDisposableListener(_this.container, dom_1.EventType.FOCUS_OUT, function (e) {
            var event = e;
            if (event.relatedTarget) {
                if (!_this.container.contains(event.relatedTarget)) {
                    _this.focusToReturn = undefined;
                    _this.setUnfocusedState();
                }
            }
        }));
        _this._register(dom_1.addDisposableListener(window, dom_1.EventType.KEY_DOWN, function (e) {
            if (!_this.options.enableMnemonics || !e.altKey || e.ctrlKey || e.defaultPrevented) {
                return;
            }
            var key = keyCodes_1.KeyCodeUtils.fromString(e.key);
            if (!_this.mnemonics.has(key)) {
                return;
            }
            _this.mnemonicsInUse = true;
            _this.updateMnemonicVisibility(true);
            var menuIndex = _this.mnemonics.get(key);
            _this.onMenuTriggered(menuIndex, false);
        }));
        _this.setUnfocusedState();
        _this.registerListeners();
        return _this;
    }
    Menubar.prototype.registerListeners = function () {
        var _this = this;
        if (!platform_1.isMacintosh) {
            this._register(dom_1.addDisposableListener(window, dom_1.EventType.RESIZE, function () {
                _this.blur();
            }));
        }
    };
    Menubar.prototype.setupMenubar = function () {
        var _this = this;
        var topLevelMenus = this.options.menu.items;
        this._register(this.onFocusStateChange(function (e) { return _this._onFocusStateChange.fire(e); }));
        this._register(this.onVisibilityChange(function (e) { return _this._onVisibilityChange.fire(e); }));
        topLevelMenus.forEach(function (menubarMenu) {
            var menuIndex = _this.menuItems.length;
            var cleanMenuLabel = menu_1.cleanMnemonic(menubarMenu.label);
            var buttonElement = dom_1.$('div.menubar-menu-button', { 'role': 'menuitem', 'tabindex': -1, 'aria-label': cleanMenuLabel, 'aria-haspopup': true });
            if (!menubarMenu.enabled) {
                dom_1.addClass(buttonElement, 'disabled');
            }
            var titleElement = dom_1.$('div.menubar-menu-title', { 'role': 'none', 'aria-hidden': true });
            buttonElement.appendChild(titleElement);
            dom_1.append(_this.container, buttonElement);
            var mnemonicMatches = menu_1.MENU_MNEMONIC_REGEX.exec(menubarMenu.label);
            // Register mnemonics
            if (mnemonicMatches) {
                var mnemonic = !!mnemonicMatches[1] ? mnemonicMatches[1] : mnemonicMatches[2];
                _this.registerMnemonic(_this.menuItems.length, mnemonic);
            }
            _this.updateLabels(titleElement, buttonElement, menubarMenu.label);
            if (menubarMenu.enabled) {
                _this._register(dom_1.addDisposableListener(buttonElement, dom_1.EventType.KEY_UP, function (e) {
                    var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                    var eventHandled = true;
                    if ((event.equals(18 /* DownArrow */) || event.equals(3 /* Enter */)) && !_this.isOpen) {
                        _this.focusedMenu = { index: menuIndex };
                        _this.openedViaKeyboard = true;
                        _this.focusState = MenubarState.OPEN;
                    }
                    else {
                        eventHandled = false;
                    }
                    if (eventHandled) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }));
                _this._register(dom_1.addDisposableListener(buttonElement, dom_1.EventType.MOUSE_DOWN, function (e) {
                    if (!_this.isOpen) {
                        // Open the menu with mouse down and ignore the following mouse up event
                        _this.ignoreNextMouseUp = true;
                        _this.onMenuTriggered(menuIndex, true);
                    }
                    else {
                        _this.ignoreNextMouseUp = false;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }));
                _this._register(dom_1.addDisposableListener(buttonElement, dom_1.EventType.MOUSE_UP, function () {
                    if (!_this.ignoreNextMouseUp) {
                        if (_this.isFocused) {
                            _this.onMenuTriggered(menuIndex, true);
                        }
                    }
                    else {
                        _this.ignoreNextMouseUp = false;
                    }
                }));
                _this._register(dom_1.addDisposableListener(buttonElement, dom_1.EventType.MOUSE_ENTER, function () {
                    if (_this.isOpen && !_this.isCurrentMenu(menuIndex)) {
                        _this.menuItems[menuIndex].buttonElement.focus();
                        _this.cleanupMenu();
                        if (_this.menuItems[menuIndex].submenu) {
                            _this.showMenu(menuIndex, false);
                        }
                    }
                    else if (_this.isFocused && !_this.isOpen) {
                        _this.focusedMenu = { index: menuIndex };
                        buttonElement.focus();
                    }
                }));
                _this.menuItems.push({
                    menuItem: menubarMenu,
                    submenu: menubarMenu.submenu,
                    buttonElement: buttonElement,
                    titleElement: titleElement
                });
            }
        });
    };
    Menubar.prototype.onClick = function (menuIndex) {
        var electronEvent;
        var item = this.menuItems[menuIndex].menuItem;
        if (item.click) {
            item.click(item, electron_1.remote.getCurrentWindow(), electronEvent);
        }
    };
    Object.defineProperty(Menubar.prototype, "onVisibilityChange", {
        get: function () {
            return this._onVisibilityChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menubar.prototype, "onFocusStateChange", {
        get: function () {
            return this._onFocusStateChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Menubar.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.menuItems.forEach(function (menuBarMenu) {
            dom_1.removeNode(menuBarMenu.titleElement);
            dom_1.removeNode(menuBarMenu.buttonElement);
        });
    };
    Menubar.prototype.blur = function () {
        this.setUnfocusedState();
    };
    Menubar.prototype.setStyles = function (style) {
        this.menuStyle = style;
    };
    Menubar.prototype.updateLabels = function (titleElement, buttonElement, label) {
        var cleanMenuLabel = menu_1.cleanMnemonic(label);
        titleElement.innerHTML = this.options.enableMnemonics ?
            escape(label).replace(menu_1.MENU_ESCAPED_MNEMONIC_REGEX, '<mnemonic aria-hidden="true">$1</mnemonic>') :
            cleanMenuLabel;
        var mnemonicMatches = menu_1.MENU_MNEMONIC_REGEX.exec(label);
        if (mnemonicMatches) {
            var mnemonic = !!mnemonicMatches[1] ? mnemonicMatches[1] : mnemonicMatches[2];
            if (this.options.enableMnemonics) {
                buttonElement.setAttribute('aria-keyshortcuts', 'Alt+' + mnemonic.toUpperCase());
            }
            else {
                buttonElement.removeAttribute('aria-keyshortcuts');
            }
        }
    };
    Menubar.prototype.registerMnemonic = function (menuIndex, mnemonic) {
        this.mnemonics.set(keyCodes_1.KeyCodeUtils.fromString(mnemonic), menuIndex);
    };
    Menubar.prototype.hideMenubar = function () {
        if (this.container.style.display !== 'none') {
            this.container.style.display = 'none';
        }
    };
    Menubar.prototype.showMenubar = function () {
        if (this.container.style.display !== 'flex') {
            this.container.style.display = 'flex';
        }
    };
    Object.defineProperty(Menubar.prototype, "focusState", {
        get: function () {
            return this._focusState;
        },
        set: function (value) {
            if (value === this._focusState) {
                return;
            }
            var isVisible = this.isVisible;
            var isOpen = this.isOpen;
            var isFocused = this.isFocused;
            this._focusState = value;
            switch (value) {
                case MenubarState.HIDDEN:
                    if (isVisible) {
                        this.hideMenubar();
                    }
                    if (isOpen) {
                        this.cleanupMenu();
                    }
                    if (isFocused) {
                        this.focusedMenu = undefined;
                        if (this.focusToReturn) {
                            this.focusToReturn.focus();
                            this.focusToReturn = undefined;
                        }
                    }
                    break;
                case MenubarState.VISIBLE:
                    if (!isVisible) {
                        this.showMenubar();
                    }
                    if (isOpen) {
                        this.cleanupMenu();
                    }
                    if (isFocused) {
                        if (this.focusedMenu) {
                            this.menuItems[this.focusedMenu.index].buttonElement.blur();
                        }
                        this.focusedMenu = undefined;
                        if (this.focusToReturn) {
                            this.focusToReturn.focus();
                            this.focusToReturn = undefined;
                        }
                    }
                    break;
                case MenubarState.FOCUSED:
                    if (!isVisible) {
                        this.showMenubar();
                    }
                    if (isOpen) {
                        this.cleanupMenu();
                    }
                    if (this.focusedMenu) {
                        this.menuItems[this.focusedMenu.index].buttonElement.focus();
                    }
                    break;
                case MenubarState.OPEN:
                    if (!isVisible) {
                        this.showMenubar();
                    }
                    if (this.focusedMenu) {
                        if (this.menuItems[this.focusedMenu.index].submenu) {
                            this.showMenu(this.focusedMenu.index, this.openedViaKeyboard);
                        }
                    }
                    break;
            }
            this._focusState = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menubar.prototype, "isVisible", {
        get: function () {
            return this.focusState >= MenubarState.VISIBLE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menubar.prototype, "isFocused", {
        get: function () {
            return this.focusState >= MenubarState.FOCUSED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menubar.prototype, "isOpen", {
        get: function () {
            return this.focusState >= MenubarState.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    Menubar.prototype.setUnfocusedState = function () {
        this.focusState = MenubarState.VISIBLE;
        this.ignoreNextMouseUp = false;
        this.mnemonicsInUse = false;
        this.updateMnemonicVisibility(false);
    };
    Menubar.prototype.focusPrevious = function () {
        if (!this.focusedMenu) {
            return;
        }
        var newFocusedIndex = (this.focusedMenu.index - 1 + this.menuItems.length) % this.menuItems.length;
        if (newFocusedIndex === this.focusedMenu.index) {
            return;
        }
        if (this.isOpen) {
            this.cleanupMenu();
            if (this.menuItems[newFocusedIndex].submenu) {
                this.showMenu(newFocusedIndex);
            }
        }
        else if (this.isFocused) {
            this.focusedMenu.index = newFocusedIndex;
            this.menuItems[newFocusedIndex].buttonElement.focus();
        }
    };
    Menubar.prototype.focusNext = function () {
        if (!this.focusedMenu) {
            return;
        }
        var newFocusedIndex = (this.focusedMenu.index + 1) % this.menuItems.length;
        if (newFocusedIndex === this.focusedMenu.index) {
            return;
        }
        if (this.isOpen) {
            this.cleanupMenu();
            if (this.menuItems[newFocusedIndex].submenu) {
                this.showMenu(newFocusedIndex);
            }
        }
        else if (this.isFocused) {
            this.focusedMenu.index = newFocusedIndex;
            this.menuItems[newFocusedIndex].buttonElement.focus();
        }
    };
    Menubar.prototype.updateMnemonicVisibility = function (visible) {
        if (this.menuItems) {
            this.menuItems.forEach(function (menuBarMenu) {
                if (menuBarMenu.titleElement.children.length) {
                    var child = menuBarMenu.titleElement.children.item(0);
                    if (child) {
                        child.style.textDecoration = visible ? 'underline' : null;
                    }
                }
            });
        }
    };
    Object.defineProperty(Menubar.prototype, "mnemonicsInUse", {
        get: function () {
            return this._mnemonicsInUse;
        },
        set: function (value) {
            this._mnemonicsInUse = value;
        },
        enumerable: true,
        configurable: true
    });
    Menubar.prototype.onMenuTriggered = function (menuIndex, clicked) {
        if (this.isOpen) {
            if (this.isCurrentMenu(menuIndex)) {
                this.setUnfocusedState();
            }
            else {
                this.cleanupMenu();
                if (this.menuItems[menuIndex].submenu) {
                    this.showMenu(menuIndex, this.openedViaKeyboard);
                }
                else {
                    if (this.menuItems[menuIndex].menuItem.enabled) {
                        this.onClick(menuIndex);
                    }
                }
            }
        }
        else {
            this.focusedMenu = { index: menuIndex };
            this.openedViaKeyboard = !clicked;
            if (this.menuItems[menuIndex].submenu) {
                this.focusState = MenubarState.OPEN;
            }
            else {
                if (this.menuItems[menuIndex].menuItem.enabled) {
                    this.onClick(menuIndex);
                }
            }
        }
    };
    Menubar.prototype.onModifierKeyToggled = function (modifierKeyStatus) {
        var allModifiersReleased = !modifierKeyStatus.altKey && !modifierKeyStatus.ctrlKey && !modifierKeyStatus.shiftKey;
        // Alt key pressed while menu is focused. This should return focus away from the menubar
        if (this.isFocused && modifierKeyStatus.lastKeyPressed === 'alt' && modifierKeyStatus.altKey) {
            this.setUnfocusedState();
            this.mnemonicsInUse = false;
            this.awaitingAltRelease = true;
        }
        // Clean alt key press and release
        if (allModifiersReleased && modifierKeyStatus.lastKeyPressed === 'alt' && modifierKeyStatus.lastKeyReleased === 'alt') {
            if (!this.awaitingAltRelease) {
                if (!this.isFocused) {
                    this.mnemonicsInUse = true;
                    this.focusedMenu = { index: 0 };
                    this.focusState = MenubarState.FOCUSED;
                }
                else if (!this.isOpen) {
                    this.setUnfocusedState();
                }
            }
        }
        // Alt key released
        if (!modifierKeyStatus.altKey && modifierKeyStatus.lastKeyReleased === 'alt') {
            this.awaitingAltRelease = false;
        }
        if (this.options.enableMnemonics && this.menuItems && !this.isOpen) {
            this.updateMnemonicVisibility((!this.awaitingAltRelease && modifierKeyStatus.altKey) || this.mnemonicsInUse);
        }
    };
    Menubar.prototype.isCurrentMenu = function (menuIndex) {
        if (!this.focusedMenu) {
            return false;
        }
        return this.focusedMenu.index === menuIndex;
    };
    Menubar.prototype.cleanupMenu = function () {
        if (this.focusedMenu) {
            // Remove focus from the menus first
            this.menuItems[this.focusedMenu.index].buttonElement.focus();
            if (this.focusedMenu.holder) {
                if (this.focusedMenu.holder.parentElement) {
                    dom_1.removeClass(this.focusedMenu.holder.parentElement, 'open');
                }
                this.focusedMenu.holder.remove();
            }
            if (this.focusedMenu.widget) {
                this.focusedMenu.widget.dispose();
            }
            this.focusedMenu = { index: this.focusedMenu.index };
        }
    };
    Menubar.prototype.showMenu = function (menuIndex, selectFirst) {
        var _this = this;
        if (selectFirst === void 0) { selectFirst = true; }
        var customMenu = this.menuItems[menuIndex];
        var menuHolder = dom_1.$('ul.menubar-menu-container');
        dom_1.addClass(customMenu.buttonElement, 'open');
        menuHolder.setAttribute('role', 'menu');
        menuHolder.tabIndex = 0;
        menuHolder.style.top = customMenu.buttonElement.getBoundingClientRect().bottom + "px";
        menuHolder.style.left = customMenu.buttonElement.getBoundingClientRect().left + "px";
        customMenu.buttonElement.appendChild(menuHolder);
        var menuOptions = {
            enableMnemonics: this.mnemonicsInUse && this.options.enableMnemonics,
            ariaLabel: customMenu.buttonElement.attributes['aria-label'].value
        };
        var menuWidget = new menu_1.Menu(menuHolder, menuOptions);
        menuWidget.createMenu(customMenu.submenu.items);
        menuWidget.style(this.menuStyle);
        this._register(menuWidget.onDidCancel(function () {
            _this.focusState = MenubarState.FOCUSED;
        }));
        menuWidget.focus(selectFirst);
        this.focusedMenu = {
            index: menuIndex,
            holder: menuHolder,
            widget: menuWidget
        };
    };
    return Menubar;
}(lifecycle_1.Disposable));
exports.Menubar = Menubar;
var ModifierKeyEmitter = /** @class */ (function (_super) {
    __extends(ModifierKeyEmitter, _super);
    function ModifierKeyEmitter() {
        var _this = _super.call(this) || this;
        _this._subscriptions = [];
        _this._keyStatus = {
            altKey: false,
            shiftKey: false,
            ctrlKey: false
        };
        _this._subscriptions.push(event_2.domEvent(document.body, 'keydown', true)(function (e) {
            var event = new keyboardEvent_1.StandardKeyboardEvent(e);
            if (e.altKey && !_this._keyStatus.altKey) {
                _this._keyStatus.lastKeyPressed = 'alt';
            }
            else if (e.ctrlKey && !_this._keyStatus.ctrlKey) {
                _this._keyStatus.lastKeyPressed = 'ctrl';
            }
            else if (e.shiftKey && !_this._keyStatus.shiftKey) {
                _this._keyStatus.lastKeyPressed = 'shift';
            }
            else if (event.keyCode !== 6 /* Alt */) {
                _this._keyStatus.lastKeyPressed = undefined;
            }
            else {
                return;
            }
            _this._keyStatus.altKey = e.altKey;
            _this._keyStatus.ctrlKey = e.ctrlKey;
            _this._keyStatus.shiftKey = e.shiftKey;
            if (_this._keyStatus.lastKeyPressed) {
                _this.fire(_this._keyStatus);
            }
        }));
        _this._subscriptions.push(event_2.domEvent(document.body, 'keyup', true)(function (e) {
            if (!e.altKey && _this._keyStatus.altKey) {
                _this._keyStatus.lastKeyReleased = 'alt';
            }
            else if (!e.ctrlKey && _this._keyStatus.ctrlKey) {
                _this._keyStatus.lastKeyReleased = 'ctrl';
            }
            else if (!e.shiftKey && _this._keyStatus.shiftKey) {
                _this._keyStatus.lastKeyReleased = 'shift';
            }
            else {
                _this._keyStatus.lastKeyReleased = undefined;
            }
            if (_this._keyStatus.lastKeyPressed !== _this._keyStatus.lastKeyReleased) {
                _this._keyStatus.lastKeyPressed = undefined;
            }
            _this._keyStatus.altKey = e.altKey;
            _this._keyStatus.ctrlKey = e.ctrlKey;
            _this._keyStatus.shiftKey = e.shiftKey;
            if (_this._keyStatus.lastKeyReleased) {
                _this.fire(_this._keyStatus);
            }
        }));
        _this._subscriptions.push(event_2.domEvent(document.body, 'mousedown', true)(function (e) {
            _this._keyStatus.lastKeyPressed = undefined;
        }));
        _this._subscriptions.push(event_2.domEvent(window, 'blur')(function (e) {
            _this._keyStatus.lastKeyPressed = undefined;
            _this._keyStatus.lastKeyReleased = undefined;
            _this._keyStatus.altKey = false;
            _this._keyStatus.shiftKey = false;
            _this._keyStatus.shiftKey = false;
            _this.fire(_this._keyStatus);
        }));
        return _this;
    }
    ModifierKeyEmitter.getInstance = function () {
        if (!ModifierKeyEmitter.instance) {
            ModifierKeyEmitter.instance = new ModifierKeyEmitter();
        }
        return ModifierKeyEmitter.instance;
    };
    ModifierKeyEmitter.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._subscriptions = lifecycle_1.dispose(this._subscriptions);
    };
    return ModifierKeyEmitter;
}(event_1.Emitter));
function escape(html) {
    return html.replace(/[<>&]/g, function (match) {
        switch (match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            default: return match;
        }
    });
}
exports.escape = escape;
