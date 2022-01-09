import EventEmitter from "node:events";
import fs from "./fs.js";
import { resolve as resolvePath } from "node:path";

interface json {
    [x: string]: unknown
}

type DatabaseJson = json & { 
    data: Array<{
        name: string, 
        type: unknown, 
        values: Array<unknown> 
    }>
}

type DatabaseJsonCustom = json & { 
    data: ValueArray<{
        name: string, 
        type: unknown, 
        values: ValueArray<unknown> 
    }>
}
    
async function resolveJSONFile (path: string): Promise<DatabaseJson> {
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

    return json;
}

export interface DatabaseOptions {
    humanReadable?: boolean;
    path: string;
    throwIfError?: boolean;
}

export type Query =
    | string
    | boolean 
    | number 
    | json;

export interface UpdateOptions {
    replace?: boolean;
    force?: boolean;
}

export class ValueArray<T extends unknown> extends Array<T> {
    public toSet (): Set<T> {
        return new Set<T>(this);
    }

    public clone (): ValueArray<T> {
        return Object.assign(Object.create(this), this);
    }

    public normalize(): this {
        const newArray = new ValueArray<T>();

        for (const item of this) {
            if (newArray.findWhere(item as Query)) {
                continue;
            }
            else {
                newArray.push(item)
            }
        }

        this.splice(0, this.length);

        for (const [K, V] of Object.entries(newArray)) {
            this[K] = V;
        };

        return this;
    }

    public findWhereAndDelete (query: Query): T {
        const item = this.findWhere(query);
        
        if (!item) {
            return null;
        }

        const index = this.indexOf(item);
        this.splice(index, 1);
        return item;
    }

    public update (index: number, updatedValue: T, options?: UpdateOptions): boolean {
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

    public findWhereAndUpdate (query: Query, updatedValue: T, updateOptions?: UpdateOptions): T {
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

    public findWhere (query: Query): T {
        const typeOf = typeof query;

        return this.filter((v) => typeof v === typeOf).find((v) => {
            function resolve (q = query, v_ = v) {
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
    readonly #humanReadable: boolean;
    readonly #path: string;
    readonly #throwIfError: boolean;
    #loaded = false;
    #json!: DatabaseJson;

    constructor (options: DatabaseOptions) {
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
    public async load (): Promise<void> {
        this.#json = await resolveJSONFile(this.#path);
        this.#loaded = true;
        this.emit("load", this.#json);
    }

    /**
     * Creates data in database
     */
    public createData (name: string, type: "object" | "string" | "boolean" | "number"): this {
        this._checkLoad();

        this.json.data.push({
            name,
            type,
            values: new ValueArray()
        });

        return this;
    }

    /**
     * Delete data in database
     */
    public deleteData (name: string) {
        this._checkLoad();
        return !!this.json.data.findWhereAndDelete({ name });
    }

    get json (): DatabaseJsonCustom {
        if (!this.#loaded) {
            return {
                data: new ValueArray()
            };
        }

        const json = this.#json as DatabaseJsonCustom;
        json.data = new ValueArray<{
            name: string,
            type: unknown,
            values: ValueArray<unknown>
        }>(...json.data.map((v) => {
            v.values = new ValueArray(...v.values);
            return v;
        }));

        return json;
    }

    /**
     * Removes value in specified data
     */
    public remove (query: Query, dataName: string, save: false): boolean
    public remove (query: Query, dataName: string, save: true): Promise<boolean>
    public remove (query: Query, dataName: string, save = false): Promise<boolean> | boolean {
        this._checkLoad();
        const deleted = !!this.json.data.findWhere({ 
            name: dataName
         }).values.findWhereAndDelete(query);

        if (save) {
            return new Promise(async (res) => {
                await this.save();
                res(deleted);
            })
        }

        return deleted;
    } 

    /**
     * Add value in specified data
     */
    public add (value: unknown, dataName: string, save: false): boolean
    public add (value: unknown, dataName: string, save: true): Promise<boolean>
    public add (value: unknown, dataName: string, save = false): boolean | Promise<boolean> {
        this._checkLoad();

        let data = this.json.data.findWhere({ 
            name: dataName 
        });

        if (!data) {
            data = {
                name: dataName,
                type: typeof value,
                values: new ValueArray()
            }

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
                })
            }
            else {
                return true;
            }
        }
    }

    /**
     * Control json database
     */
    public control<T> (fn: (json: DatabaseJsonCustom) => T): T {
        this._checkLoad();
        return fn(this.json);
    }

    /**
     * Save database json
     */
    public async save (): Promise<boolean> {
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

    private _checkLoad (): void {
        if (!this.#loaded) {
            throw new Error("Database not loaded, please load Database first");
        }
        else {
            return;
        }
    }

    public on (eventName: string | symbol, listener: (...args: any[]) => void): this
    public on (eventName: "load", listener: () => void): this
    public on (eventName: "error", listener: (error: Error) => void): this
    public on (eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.on(eventName, listener);
    }

    public once (eventName: string | symbol, listener: (...args: any[]) => void): this
    public once (eventName: "load", listener: () => void): this
    public once (eventName: "error", listener: (error: Error) => void): this
    public once (eventName: string | symbol, listener: (...args: any[]) => void): this {
        return super.once(eventName, listener);
    }
}

export default Database;