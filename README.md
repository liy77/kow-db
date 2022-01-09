# Welcome
Click [here](#help) to jump to help table.

## Installation
Using yarn:

```bash
yarn add kow-db
```

Using npm:

```bash
npm install kow-db
```


## How to import
Using esm:
```js
import KowDB from "kow-db";
```

Using commonjs:
```js
const KowDB = import("kow-db").then((db) => db.default);
// This method returns a promise
```

# Kow DB
Fast promise json database.

## Methods


### Database~load
load database

Returns: 

```ts
Promise<void>
```
Usage

```js
await db.load();
``` 

### Database~save
Save values in database json

Returns: 

```ts
Promise<boolean>
```
Usage

```js
await db.save();
``` 

### Database~add
Add value to specified data

Returns: 

```ts
Promise<boolean> | boolean
```
Usage

```js
db.add("some stuff", "data name"); // No save

await db.add("some stuff", "data name", true); // Save, returns promise
``` 

### Database~remove
Add value to specified data

Returns: 

```ts
Promise<boolean> | boolean
```
Usage

```js
db.remove({ id: 1234 }, "data name"); // No save

await db.remove({ id: 1234 }, "data name", true); // Save, returns promise
``` 

### Database~createData
Creates data

Returns: 

```ts
Database
```
Usage

```js
db.createData("data name", "data type");
``` 

### Database~deleteData
Deletes data

Returns: 

```ts
Database
```
Usage

```js
db.deleteData("data name");
``` 

### Database~control
Control data and returns a value

Returns: 

```ts
T
```
Usage

```js
db.control((json) => {
    const value = json.data.findWhere({
        name: "users"
    }).values.findWhere({
        id: 630493603575103519
    });

    return value;
}); // { name: "snowie", id: 630493603575103519 }
``` 

## Example
```js
import KowDB from "kow-db";

const db = new KowDB({
    path: "./example.json",
    humanReadable: true
});

db.load().then(async () => {
    db.create("test", "object");

    db.add({
        id: 1234,
        value: "test"
    }, "test");

    db.control((json) => json.data.findWhere({ 
        name: "test" 
    }).values.findWhere({
        id: 1234
    })) // { id: 1234, name: "test" }

    await db.save();
})
```

# ValueArray
Custom array created for database

## Methods
Methods includes normal array methods


### ValueArray~findWhere
Find value in array and return it

Returns:

```ts
T
```
Usage:

```js
va.findWhere({ id: 1234 });
```

### ValueArray~findWhereAndDelete
Find value in array delete it

Returns:

```ts
T
```
Usage:

```js
va.findWhereAndDelete({ id: 1234 });
```

### ValueArray~findWhereAndUpdate
Find value in array and update it

Returns:

```ts
T
```
Usage:

```js
va.findWhereAndUpdate({ id: 1234 }, { name: "snow" });
```

### ValueArray~update
Update value in array

Returns:

```ts
boolean
```
Usage:

```js
va.update(0, { name: "snow" });
```

### ValueArray~normalize
Removes repeated items in array

Returns:

```ts
ValueArray
```
Usage:

```js
va.normalize();
```

### ValueArray~clone
Clone value array and return clone

Returns:

```ts
ValueArray
```
Usage:

```js
va.clone();
```

### ValueArray~toSet
Transform value array in set and returns it

Returns:

```ts
Set<T>
```
Usage:

```js
va.toSet();
```

## Example
```js
import { ValueArray } from "kow-db";

const va = new ValueArray(...[{
    id: 1234,
    name: "leo"
}, {
    id: 5678,
    name: "snowie"
}]);

va.findWhere({
    id: 5678
}) // { name: "snowie", id: 1234 }
```

# Help
- [Welcome](#welcome)
  - [Installation](#installation)
  - [How to import](#how-to-import)
- [Kow DB](#kow-db)
  - [Methods](#methods)
    - [Database~load](#databaseload)
    - [Database~save](#databasesave)
    - [Database~add](#databaseadd)
    - [Database~remove](#databaseremove)
    - [Database~createData](#databasecreatedata)
    - [Database~deleteData](#databasedeletedata)
    - [Database~control](#databasecontrol)
  - [Example](#example)
- [ValueArray](#valuearray)
  - [Methods](#methods-1)
    - [ValueArray~findWhere](#valuearrayfindwhere)
    - [ValueArray~findWhereAndDelete](#valuearrayfindwhereanddelete)
    - [ValueArray~findWhereAndUpdate](#valuearrayfindwhereandupdate)
    - [ValueArray~update](#valuearrayupdate)
    - [ValueArray~normalize](#valuearraynormalize)
    - [ValueArray~clone](#valuearrayclone)
    - [ValueArray~toSet](#valuearraytoset)
  - [Example](#example-1)
- [Help](#help)