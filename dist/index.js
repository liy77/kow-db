import EventEmitter from "node:events";
import fs from "./fs.js";
import { resolve as resolvePath } from "node:path";
async function resolveJSONFile(path) {
    const e = await fs.exists(path);
    let json = {
        data: []
    };
    if (e) {
        const content = await fs.readFile(path, {
            encoding: "utf8"
        });
        if (content) {
            json = JSON.parse(content);
        }
    }
    else {
        await fs.writeFile(path, JSON.stringify(json));
    }
    return Promise.resolve(json);
}
export class ValueArray extends Array {
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
            }
            else {
                newArray.push(item);
            }
        }
        this.splice(0, this.length);
        for (const [K, V] of Object.entries(newArray)) {
            this[K] = V;
        }
        ;
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
        options = Object.assign({
            force: false,
            replace: true
        }, options ?? {});
        let item = this[index];
        const typeOfItem = typeof item;
        if (["number", "string", "boolean"].includes(typeOfItem)) {
            if (typeof updatedValue !== typeOfItem && options.force) {
                this[index] = updatedValue;
                return true;
            }
            else {
                return false;
            }
        }
        else if (typeOfItem === "object" && typeof updatedValue === "object") {
            for (const key of Object.keys(updatedValue)) {
                const i = item[key];
                const u = updatedValue[key];
                if ((i && typeof i !== typeof u && options.force && options.replace) || (i && typeof i === typeof u && options.replace)) {
                    if (typeof i === "object" && typeof u === "object") {
                        item[key] = Object.assign(i, u);
                    }
                    else {
                        item[key] = u;
                    }
                }
                else {
                    continue;
                }
            }
            this[index] = item;
            return true;
        }
        else {
            return false;
        }
    }
    findWhereAndUpdate(query, updatedValue, updateOptions) {
        const value = this.findWhere(query);
        if (!value) {
            return;
        }
        else {
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
                }
                else if (v_ && typeof v_ === "object") {
                    const queryEntries = Object.entries(q);
                    for (const [K, V] of queryEntries) {
                        const value = v_[K];
                        const typeOfV = typeof V;
                        if (typeof value === typeOfV) {
                            if (typeof value === "object" && typeOfV === "object" && value !== V) {
                                return resolve(V, value);
                            }
                            return value === V;
                        }
                    }
                }
                else {
                    return false;
                }
            }
            return resolve();
        });
    }
}
export class Database extends EventEmitter {
    #humanReadable;
    #path;
    #throwIfError;
    #loaded = false;
    #json;
    constructor(options) {
        super();
        if (typeof options !== "object" || !options.path) {
            throw new Error("Missing path in options");
        }
        options = Object.assign({
            humanReadable: false,
            throwIfError: true
        }, options);
        this.#humanReadable = !!options.humanReadable;
        this.#throwIfError = !!options.throwIfError;
        this.#path = resolvePath(options.path);
    }
    /**
     * Load's database
     */
    async load() {
        this.#json = await resolveJSONFile(this.#path);
        this.#loaded = true;
        this.emit("load", this.#json);
    }
    /**
     * Creates data in database
     */
    createData(name, type) {
        this._checkLoad();
        this.#json.data.push({
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
        return !!this.json.data.findWhereAndDelete({ name });
    }
    get json() {
        if (!this.#loaded) {
            return {
                data: new ValueArray()
            };
        }
        const json = this.#json;
        json.data = new ValueArray(...json.data.map((v) => {
            v.values = new ValueArray(...v.values);
            return v;
        }));
        return json;
    }
    remove(query, dataName, save = false) {
        this._checkLoad();
        const deleted = !!this.json.data.findWhere({ name: dataName }).values.findWhereAndDelete(query);
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
        let data = this.json.data.findWhere({ name: dataName });
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
            if (this.#throwIfError) {
                throw err;
            }
            else {
                this.emit("error", err);
            }
            return false;
        }
        else {
            const index = this.json.data.indexOf(data);
            data.values.push(value);
            this.json.data[index] = data;
            if (save) {
                return new Promise(async (res) => {
                    await this.save();
                    res(true);
                });
            }
            else {
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
            await fs.writeFile(this.#path, JSON.stringify(this.#json, null, this.#humanReadable ? 4 : 0));
            return true;
        }
        catch (err) {
            if (this.#throwIfError) {
                throw err;
            }
            else {
                this.emit("error", err);
            }
            return false;
        }
    }
    _checkLoad() {
        if (!this.#loaded) {
            throw new Error("Database not loaded, please load Database first");
        }
        else {
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
export default Database;
