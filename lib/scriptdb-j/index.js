const fs = require('fs');

class ScriptDB {
    constructor() {
        this.data = {};
    }

    target(jsonPath) {
        this.data = this.load(jsonPath);
        return this;
    }

    load(jsonPath) {
        try {
            const data = fs.readFileSync(jsonPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }

    write(keyPath, value) {
        const keys = keyPath.split('\\');
        let current = this.data;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }

        const lastKey = keys[keys.length - 1];
        current[lastKey] = value;
    }

    save() {
        try {
            const jsonData = JSON.stringify(this.data, null, 4);
            fs.writeFileSync('data.json', jsonData, 'utf-8');
            console.log("Data saved successfully.");
        } catch (error) {
            console.error("Error saving data:", error);
        }
    }

    delete(keyPath) {
        if (keyPath === '$') {
            this.data = {}; // すべて削除
            this.save();
        } else if (keyPath.startsWith('$')) {
            const realKey = keyPath.substring(1);
            delete this.data[realKey]; // 特定のキーのみ削除
            this.save();
        } else {
            const keys = keyPath.split('\\');
            let current = this.data;

            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    return; // Key path doesn't exist
                }
                current = current[keys[i]];
            }

            const lastKey = keys[keys.length - 1];
            delete current[lastKey];
            this.save();
        }
    }

    array(arrayName, ...values) {
        if (!this.data[arrayName]) {
            this.data[arrayName] = [];
        }
        this.data[arrayName] = this.data[arrayName].concat(values);
    }

    karray(arrayName, ...keyValuePairs) {
        if (!this.data[arrayName]) {
            this.data[arrayName] = [];
        }

        const obj = {};
        for (let i = 0; i < keyValuePairs.length; i++) {
            const [key, value] = keyValuePairs[i];
            obj[key] = value;
        }

        this.data[arrayName].push(obj);

        console.log(JSON.stringify(this.data, null, 4)); // 途中経過を表示
    }

    add() {
        this.save(); // 追加: データを保存して上書きしない
    }

    loadValue(keyPath) {
        const keys = keyPath.split('\\');
        let current = this.data;

        for (let i = 0; i < keys.length; i++) {
            if (!current[keys[i]]) {
                return undefined; // Key path doesn't exist
            }
            current = current[keys[i]];
        }

        return current;
    }

    loadAll() {
        console.log(JSON.stringify(this.data, null, 4)); // 途中経過を表示
    }
}

module.exports = ScriptDB;
