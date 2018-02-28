function _pair_array_t(keyCompFunc) {
    this._keys = new Array();
    this._vals = new Array();

    this._comp = function (k1, k2) {
        return (k1 == k2);
    }
    this.npos = -1; // DONOT change this  

    if (keyCompFunc != null)
        this._comp = keyCompFunc;

    this.insert = function (key, value) {
        for (var i = 0; i < this._keys.length; i++) {
            if (this._comp(this._keys[i], key)) {
                this._vals[i] = value;
                return;
            }
        }
        this._keys.push(key);
        this._vals.push(value);
    }

    this.size = function () {
        return this._keys.length;
    }

    this.find = function (key) {
        for (var i = 0; i < this._keys.length; i++) {
            if (this._comp(this._keys[i], key)) {
                return i;
            }
        }
        return this.npos;
    }

    this.getKey = function (i) {
        return this._keys[i];
    }

    this.getVal = function (i) {
        return this._vals[i];
    }

    this.erase = function (key) {
        var at = this.find(key);
        if (at != this.npos) {
            this._keys.splice(at, 1);
            this._vals.splice(at, 1);
            return true;
        }
        return false;
    }

    this.clear = function () {
        this._keys.splice(0);
        this._vals.splice(0);
    }
}  