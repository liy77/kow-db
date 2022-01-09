/// <reference types="node" />
import { promises as fs, PathLike } from "node:fs";
/**
 * Test whether or not the given path exists by checking with the file system.
 * @param path
 * @returns {Promise<boolean>}
 */
export declare function exists(path: PathLike): Promise<boolean>;
declare const _default: {
    exists: typeof exists;
    access(path: PathLike, mode?: number): Promise<void>;
    copyFile(src: PathLike, dest: PathLike, mode?: number): Promise<void>;
    open(path: PathLike, flags: string | number, mode?: import("fs").Mode): Promise<fs.FileHandle>;
    rename(oldPath: PathLike, newPath: PathLike): Promise<void>;
    truncate(path: PathLike, len?: number): Promise<void>;
    rmdir(path: PathLike, options?: import("fs").RmDirOptions): Promise<void>;
    rm(path: PathLike, options?: import("fs").RmOptions): Promise<void>;
    mkdir(path: PathLike, options: import("fs").MakeDirectoryOptions & {
        recursive: true;
    }): Promise<string>;
    mkdir(path: PathLike, options?: import("fs").Mode | (import("fs").MakeDirectoryOptions & {
        recursive?: false;
    })): Promise<void>;
    mkdir(path: PathLike, options?: import("fs").Mode | import("fs").MakeDirectoryOptions): Promise<string>;
    readdir(path: PathLike, options?: BufferEncoding | (import("fs").ObjectEncodingOptions & {
        withFileTypes?: false;
    })): Promise<string[]>;
    readdir(path: PathLike, options: "buffer" | {
        encoding: "buffer";
        withFileTypes?: false;
    }): Promise<Buffer[]>;
    readdir(path: PathLike, options?: BufferEncoding | (import("fs").ObjectEncodingOptions & {
        withFileTypes?: false;
    })): Promise<string[] | Buffer[]>;
    readdir(path: PathLike, options: import("fs").ObjectEncodingOptions & {
        withFileTypes: true;
    }): Promise<import("fs").Dirent[]>;
    readlink(path: PathLike, options?: BufferEncoding | import("fs").ObjectEncodingOptions): Promise<string>;
    readlink(path: PathLike, options: import("fs").BufferEncodingOption): Promise<Buffer>;
    readlink(path: PathLike, options?: string | import("fs").ObjectEncodingOptions): Promise<string | Buffer>;
    symlink(target: PathLike, path: PathLike, type?: string): Promise<void>;
    lstat(path: PathLike, opts?: import("fs").StatOptions & {
        bigint?: false;
    }): Promise<import("fs").Stats>;
    lstat(path: PathLike, opts: import("fs").StatOptions & {
        bigint: true;
    }): Promise<import("fs").BigIntStats>;
    lstat(path: PathLike, opts?: import("fs").StatOptions): Promise<import("fs").Stats | import("fs").BigIntStats>;
    stat(path: PathLike, opts?: import("fs").StatOptions & {
        bigint?: false;
    }): Promise<import("fs").Stats>;
    stat(path: PathLike, opts: import("fs").StatOptions & {
        bigint: true;
    }): Promise<import("fs").BigIntStats>;
    stat(path: PathLike, opts?: import("fs").StatOptions): Promise<import("fs").Stats | import("fs").BigIntStats>;
    link(existingPath: PathLike, newPath: PathLike): Promise<void>;
    unlink(path: PathLike): Promise<void>;
    chmod(path: PathLike, mode: import("fs").Mode): Promise<void>;
    lchmod(path: PathLike, mode: import("fs").Mode): Promise<void>;
    lchown(path: PathLike, uid: number, gid: number): Promise<void>;
    lutimes(path: PathLike, atime: string | number | Date, mtime: string | number | Date): Promise<void>;
    chown(path: PathLike, uid: number, gid: number): Promise<void>;
    utimes(path: PathLike, atime: string | number | Date, mtime: string | number | Date): Promise<void>;
    realpath(path: PathLike, options?: BufferEncoding | import("fs").ObjectEncodingOptions): Promise<string>;
    realpath(path: PathLike, options: import("fs").BufferEncodingOption): Promise<Buffer>;
    realpath(path: PathLike, options?: BufferEncoding | import("fs").ObjectEncodingOptions): Promise<string | Buffer>;
    mkdtemp(prefix: string, options?: BufferEncoding | import("fs").ObjectEncodingOptions): Promise<string>;
    mkdtemp(prefix: string, options: import("fs").BufferEncodingOption): Promise<Buffer>;
    mkdtemp(prefix: string, options?: BufferEncoding | import("fs").ObjectEncodingOptions): Promise<string | Buffer>;
    writeFile(file: PathLike | fs.FileHandle, data: string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView> | import("stream").Stream, options?: BufferEncoding | (import("fs").ObjectEncodingOptions & {
        mode?: import("fs").Mode;
        flag?: import("fs").OpenMode;
    } & import("events").Abortable)): Promise<void>;
    appendFile(path: PathLike | fs.FileHandle, data: string | Uint8Array, options?: BufferEncoding | (import("fs").ObjectEncodingOptions & fs.FlagAndOpenMode)): Promise<void>;
    readFile(path: PathLike | fs.FileHandle, options?: {
        encoding?: null;
        flag?: import("fs").OpenMode;
    } & import("events").Abortable): Promise<Buffer>;
    readFile(path: PathLike | fs.FileHandle, options: ({
        encoding: BufferEncoding;
        flag?: import("fs").OpenMode;
    } & import("events").Abortable) | BufferEncoding): Promise<string>;
    readFile(path: PathLike | fs.FileHandle, options?: BufferEncoding | (import("fs").ObjectEncodingOptions & import("events").Abortable & {
        flag?: import("fs").OpenMode;
    })): Promise<string | Buffer>;
    opendir(path: PathLike, options?: import("fs").OpenDirOptions): Promise<import("fs").Dir>;
    watch(filename: PathLike, options: "buffer" | (import("fs").WatchOptions & {
        encoding: "buffer";
    })): AsyncIterable<fs.FileChangeInfo<Buffer>>;
    watch(filename: PathLike, options?: BufferEncoding | import("fs").WatchOptions): AsyncIterable<fs.FileChangeInfo<string>>;
    watch(filename: PathLike, options: string | import("fs").WatchOptions): AsyncIterable<fs.FileChangeInfo<Buffer>> | AsyncIterable<fs.FileChangeInfo<string>>;
    cp(source: string, destination: string, opts?: import("fs").CopyOptions): Promise<void>;
};
export default _default;
