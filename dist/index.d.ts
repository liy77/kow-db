/// <reference types="node" />
import EventEmitter from "node:events";
interface json {
    [x: string]: unknown;
}
declare type DatabaseJsonCustom = json & {
    data: ValueArray<{
        name: string;
        type: unknown;
        values: ValueArray<unknown>;
    }>;
};
export interface DatabaseOptions {
    humanReadable?: boolean;
    path: string;
    throwIfError?: boolean;
}
export declare type Query = string | boolean | number | json;
export interface UpdateOptions {
    replace?: boolean;
    force?: boolean;
}
export declare class ValueArray<T extends unknown> extends Array<T> {
    toSet(): Set<T>;
    clone(): ValueArray<T>;
    normalize(): this;
    findWhereAndDelete(query: Query): T;
    update(index: number, updatedValue: T, options?: UpdateOptions): boolean;
    findWhereAndUpdate(query: Query, updatedValue: T, updateOptions?: UpdateOptions): T;
    findWhere(query: Query): T;
}
export declare class Database extends EventEmitter {
    #private;
    constructor(options: DatabaseOptions);
    /**
     * Load's database
     */
    load(): Promise<void>;
    /**
     * Creates data in database
     */
    createData(name: string, type: "object" | "string" | "boolean" | "number"): this;
    /**
     * Delete data in database
     */
    deleteData(name: string): boolean;
    get json(): DatabaseJsonCustom;
    /**
     * Removes value in specified data
     */
    remove(query: Query, dataName: string, save: false): boolean;
    remove(query: Query, dataName: string, save: true): Promise<boolean>;
    /**
     * Add value in specified data
     */
    add(value: unknown, dataName: string, save: false): boolean;
    add(value: unknown, dataName: string, save: true): Promise<boolean>;
    /**
     * Control json database
     */
    control<T>(fn: (json: DatabaseJsonCustom) => T): T;
    /**
     * Save database json
     */
    save(): Promise<boolean>;
    private _checkLoad;
    on(eventName: string | symbol, listener: (...args: any[]) => void): this;
    on(eventName: "load", listener: () => void): this;
    on(eventName: "error", listener: (error: Error) => void): this;
    once(eventName: string | symbol, listener: (...args: any[]) => void): this;
    once(eventName: "load", listener: () => void): this;
    once(eventName: "error", listener: (error: Error) => void): this;
}
export default Database;
