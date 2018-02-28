
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

        setTimeout(function () {
            _map.panTo(curLocation, { noAnimation: "no" });
            DeviceEvent.Toast("只显示附近一公里");
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