"use strict";

exports.__esModule = true;
exports.default = exports.ValueArray = exports.Database = void 0;

var _nodeEvents = _interopRequireDefault(require("node:events"));

var _fs = _interopRequireDefault(require("./fs.cjs"));

var _nodePath = require("node:path");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}

function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError(
      "Cannot initialize the same private elements twice on an object"
    );
  }
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}

function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError(
      "attempted to " + action + " private field on non-instance"
    );
  }
  return privateMap.get(receiver);
}

function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}

async function resolveJSONFile(path) {
  const e = await _fs.default.exists(path);
  let json = {
    data: []
  };

  if (e) {
    const content = await _fs.default.readFile(path, {
      encoding: "utf8"
    });

    if (content) {
      json = JSON.parse(content);
    }
  } else {
    await _fs.default.writeFile(path, JSON.stringify(json));
  }

  return Promise.resolve(json);
}

class ValueArray extends Array {
  toSet() {
    return new Set(this);
  }

  clone() {
    return Object.assign(Object.create(this), this);
  }

  normalize() {
    const newArray = new ValueArray();

    for (const item of this) {
      if (newArray.findWhere(item)) {
        continue;
      } else {
        newArray.push(item);
      }
    }

    this.splice(0, this.length);

    for (const [K, V] of Object.entries(newArray)) {
      this[K] = V;
    }

    return this;
  }

  findWhereAndDelete(query) {
    const item = this.findWhere(query);

    if (!item) {
      return null;
    }

    const index = this.indexOf(item);
    this.splice(index, 1);
    return item;
  }

  update(index, updatedValue, options) {
    var _options;

    options = Object.assign(
      {
        force: false,
        replace: true
      },
      (_options = options) !== null && _options !== void 0 ? _options : {}
    );
    let item = this[index];
    const typeOfItem = typeof item;

    if (["number", "string", "boolean"].includes(typeOfItem)) {
      if (typeof updatedValue !== typeOfItem && options.force) {
        this[index] = updatedValue;
        return true;
      } else {
        return false;
      }
    } else if (typeOfItem === "object" && typeof updatedValue === "object") {
      for (const key of Object.keys(updatedValue)) {
        const i = item[key];
        const u = updatedValue[key];

        if (
          (i && typeof i !== typeof u && options.force && options.replace) ||
          (i && typeof i === typeof u && options.replace)
        ) {
          if (typeof i === "object" && typeof u === "object") {
            item[key] = Object.assign(i, u);
          } else {
            item[key] = u;
          }
        } else {
          continue;
        }
      }

      this[index] = item;
      return true;
    } else {
      return false;
    }
  }

  findWhereAndUpdate(query, updatedValue, updateOptions) {
    const value = this.findWhere(query);

    if (!value) {
      return;
    } else {
      const index = this.indexOf(value);
      this.update(index, updatedValue, updateOptions);
      return this.at(index);
    }
  }

  findWhere(query) {
    const typeOf = typeof query;
    return this.filter((v) => typeof v === typeOf).find((v) => {
      function resolve(q = query, v_ = v) {
        if (typeof q !== "object" && typeof v_ !== "object") {
          return q === v_;
        } else if (v_ && typeof v_ === "object") {
          const queryEntries = Object.entries(q);

          for (const [K, V] of queryEntries) {
            const value = v_[K];
            const typeOfV = typeof V;

            if (typeof value === typeOfV) {
              if (
                typeof value === "object" &&
                typeOfV === "object" &&
                value !== V
              ) {
                return resolve(V, value);
              }

              return value === V;
            }
          }
        } else {
          return false;
        }
      }

      return resolve();
    });
  }
}

exports.ValueArray = ValueArray;

var _humanReadable = /*#__PURE__*/ new WeakMap();

var _path = /*#__PURE__*/ new WeakMap();

var _throwIfError = /*#__PURE__*/ new WeakMap();

var _loaded = /*#__PURE__*/ new WeakMap();

var _json = /*#__PURE__*/ new WeakMap();

class Database extends _nodeEvents.default {
  constructor(options) {
    super();

    _classPrivateFieldInitSpec(this, _humanReadable, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _path, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _throwIfError, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _loaded, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _json, {
      writable: true,
      value: void 0
    });

    if (typeof options !== "object" || !options.path) {
      throw new Error("Missing path in options");
    }

    options = Object.assign(
      {
        humanReadable: false,
        throwIfError: true
      },
      options
    );

    _classPrivateFieldSet(this, _humanReadable, !!options.humanReadable);

    _classPrivateFieldSet(this, _throwIfError, !!options.throwIfError);

    _classPrivateFieldSet(this, _path, (0, _nodePath.resolve)(options.path));
  }
  /**
   * Load's database
   */

  async load() {
    _classPrivateFieldSet(
      this,
      _json,
      await resolveJSONFile(_classPrivateFieldGet(this, _path))
    );

    _classPrivateFieldSet(this, _loaded, true);

    this.emit("load", _classPrivateFieldGet(this, _json));
  }
  /**
   * Creates data in database
   */

  createData(name, type) {
    this._checkLoad();

    _classPrivateFieldGet(this, _json).data.push({
      name,
      type,
      values: []
    });

    return this;
  }
  /**
   * Delete data in database
   */

  deleteData(name) {
    this._checkLoad();

    return !!this.json.data.findWhereAndDelete({
      name
    });
  }

  get json() {
    if (!_classPrivateFieldGet(this, _loaded)) {
      return {
        data: new ValueArray()
      };
    }

    const json = _classPrivateFieldGet(this, _json);

    json.data = new ValueArray(
      ...json.data.map((v) => {
        v.values = new ValueArray(...v.values);
        return v;
      })
    );
    return json;
  }

  remove(query, dataName, save = false) {
    this._checkLoad();

    const deleted = !!this.json.data
      .findWhere({
        name: dataName
      })
      .values.findWhereAndDelete(query);

    if (save) {
      return new Promise(async (res) => {
        await this.save();
        res(deleted);
      });
    }

    return deleted;
  }

  add(value, dataName, save = false) {
    this._checkLoad();

    let data = this.json.data.findWhere({
      name: dataName
    });

    if (!data) {
      data = {
        name: dataName,
        type: typeof value,
        values: new ValueArray()
      };
      this.json.data.push(data);
    }

    const dataType = data.type;

    if (typeof value !== dataType) {
      const err = new TypeError(`The type of value is not a ${dataType}`);

      if (_classPrivateFieldGet(this, _throwIfError)) {
        throw err;
      } else {
        this.emit("error", err);
      }

      return false;
    } else {
      const index = this.json.data.indexOf(data);
      data.values.push(value);
      this.json.data[index] = data;

      if (save) {
        return new Promise(async (res) => {
          await this.save();
          res(true);
        });
      } else {
        return true;
      }
    }
  }
  /**
   * Control json database
   */

  control(fn) {
    this._checkLoad();

    return fn(this.json);
  }
  /**
   * Save database json
   */

  async save() {
    try {
      await _fs.default.writeFile(
        _classPrivateFieldGet(this, _path),
        JSON.stringify(
          _classPrivateFieldGet(this, _json),
          null,
          _classPrivateFieldGet(this, _humanReadable) ? 4 : 0
        )
      );
      return true;
    } catch (err) {
      if (_classPrivateFieldGet(this, _throwIfError)) {
        throw err;
      } else {
        this.emit("error", err);
      }

      return false;
    }
  }

  _checkLoad() {
    if (!_classPrivateFieldGet(this, _loaded)) {
      throw new Error("Database not loaded, please load Database first");
    } else {
      return;
    }
  }

  on(eventName, listener) {
    return super.on(eventName, listener);
  }

  once(eventName, listener) {
    return super.once(eventName, listener);
  }
}

exports.Database = Database;
var _default = Database;
exports.default = _default;
