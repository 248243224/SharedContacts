﻿
var BMapLib = window.BMapLib = BMapLib || {};

(function () {

    var AreaRestriction =

        BMapLib.AreaRestriction = function () {
        }

    var _isRestricted = false;
    var _map = null;


    var _bounds = null;

    AreaRestriction.setBounds = function (map, bounds) {
        if (!map ||
            !bounds ||
            !(bounds instanceof BMap.Bounds)) {
            throw "请检查传入参数值的合法性";
            return false;
        }

        if (_isRestricted) {
            this.clearBounds();
        }
        _map = map;
        _bounds = bounds;

        _map.addEventListener("moveend", this._mapMoveendEvent);
        _isRestricted = true;
        return true;
    };

    AreaRestriction._mapMoveendEvent = function (e) {
        if (_bounds.containsBounds(_map.getBounds())) {
            return;
        }

        var curBounds = _map.getBounds(),
            curBoundsSW = curBounds.getSouthWest(),
            curBoundsNE = curBounds.getNorthEast(),
            _boundsSW = _bounds.getSouthWest(),
            _boundsNE = _bounds.getNorthEast();

        var boundary = { n: 0, e: 0, s: 0, w: 0 };

        boundary.n = (curBoundsNE.lat < _boundsNE.lat) ?
            curBoundsNE.lat :
            _boundsNE.lat;

        boundary.e = (curBoundsNE.lng < _boundsNE.lng) ?
            curBoundsNE.lng :
            _boundsNE.lng;

        boundary.s = (curBoundsSW.lat < _boundsSW.lat) ?
            _boundsSW.lat :
            curBoundsSW.lat;

        boundary.w = (curBoundsSW.lng < _boundsSW.lng) ?
            _boundsSW.lng :
            curBoundsSW.lng;

        var center = new BMap.Point(boundary.w + (boundary.e - boundary.w) / 2,
            boundary.s + (boundary.n - boundary.s) / 2);
        setTimeout(function () {
            _map.panTo(center, { noAnimation: "no" });
        }, 1);
    };

    AreaRestriction.clearBounds = function () {
        if (!_isRestricted) {
            return;
        }
        _map.removeEventListener("moveend", this._mapMoveendEvent);
        _isRestricted = false;
    };

})();