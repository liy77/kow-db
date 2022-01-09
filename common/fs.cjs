"use strict";

exports.__esModule = true;
exports.default = void 0;
exports.exists = exists;

var _nodeFs = require("node:fs");

/**
 * Test whether or not the given path exists by checking with the file system.
 * @param path
 * @returns {Promise<boolean>}
 */
async function exists(path) {
  try {
    await _nodeFs.promises.access(path, _nodeFs.constants.W_OK);
    return true;
  } catch {
    return Promise.resolve(false);
  }
}

var _default = { ..._nodeFs.promises, exists };
exports.default = _default;
