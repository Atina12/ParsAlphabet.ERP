var localStorageMethod = (() => {

    return {
        setObject: (objectName, objectValue) => {
            window.localStorage.setItem(objectName, objectValue);
        },

        getObject: (objectName) => {
            let object = window.localStorage.getItem(objectName);
            return object;
        },

        removeObject: (objectName) => {
            window.localStorage.removeItem(objectName);
        },

        getObjectNameByIndex: (index) => {
            let objectKey = window.localStorage.key(index);
            return objectKey;
        }
    }
})();


var setData = (objectName, objectValue) => { };