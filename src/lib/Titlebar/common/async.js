"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var lifecycle_1 = require("./lifecycle");
var TimeoutTimer = /** @class */ (function (_super) {
    __extends(TimeoutTimer, _super);
    function TimeoutTimer(runner, timeout) {
        var _this = _super.call(this) || this;
        _this._token = -1;
        if (typeof runner === 'function' && typeof timeout === 'number') {
            _this.setIfNotSet(runner, timeout);
        }
        return _this;
    }
    TimeoutTimer.prototype.dispose = function () {
        this.cancel();
        _super.prototype.dispose.call(this);
    };
    TimeoutTimer.prototype.cancel = function () {
        if (this._token !== -1) {
            clearTimeout(this._token);
            this._token = -1;
        }
    };
    TimeoutTimer.prototype.cancelAndSet = function (runner, timeout) {
        var _this = this;
        this.cancel();
        this._token = setTimeout(function () {
            _this._token = -1;
            runner();
        }, timeout);
    };
    TimeoutTimer.prototype.setIfNotSet = function (runner, timeout) {
        var _this = this;
        if (this._token !== -1) {
            // timer is already set
            return;
        }
        this._token = setTimeout(function () {
            _this._token = -1;
            runner();
        }, timeout);
    };
    return TimeoutTimer;
}(lifecycle_1.Disposable));
exports.TimeoutTimer = TimeoutTimer;
var RunOnceScheduler = /** @class */ (function () {
    function RunOnceScheduler(runner, timeout) {
        this.timeoutToken = -1;
        this.runner = runner;
        this.timeout = timeout;
        this.timeoutHandler = this.onTimeout.bind(this);
    }
    /**
     * Dispose RunOnceScheduler
     */
    RunOnceScheduler.prototype.dispose = function () {
        this.cancel();
        this.runner = null;
    };
    /**
     * Cancel current scheduled runner (if any).
     */
    RunOnceScheduler.prototype.cancel = function () {
        if (this.isScheduled()) {
            clearTimeout(this.timeoutToken);
            this.timeoutToken = -1;
        }
    };
    /**
     * Cancel previous runner (if any) & schedule a new runner.
     */
    RunOnceScheduler.prototype.schedule = function (delay) {
        if (delay === void 0) { delay = this.timeout; }
        this.cancel();
        this.timeoutToken = setTimeout(this.timeoutHandler, delay);
    };
    /**
     * Returns true if scheduled.
     */
    RunOnceScheduler.prototype.isScheduled = function () {
        return this.timeoutToken !== -1;
    };
    RunOnceScheduler.prototype.onTimeout = function () {
        this.timeoutToken = -1;
        if (this.runner) {
            this.doRun();
        }
    };
    RunOnceScheduler.prototype.doRun = function () {
        if (this.runner) {
            this.runner();
        }
    };
    return RunOnceScheduler;
}());
exports.RunOnceScheduler = RunOnceScheduler;
