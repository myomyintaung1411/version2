const { sys } = cc;
import { md5 } from "./md5";
const PREVIEW = cc.env
import { aesDecrypt,aesEncrypt } from "./EncryptUtil";
const SqlUtil = (function () {
    let _key = null;
    let _iv = null;
    let _userId = '';
    let _userKeys = null;

    function init(key, iv, userId = null) {
        _key = md5(key);
        _iv = md5(iv);
        _userId = userId || '';
    }

    function set(key, value) {
        if (key === null) {
            console.error("存储的key不能为空");
            return;
        }
        if (!PREVIEW) {
            key = md5(key);
        }
        if (value === null) {
            console.warn("存储的值为空，则直接移除该存储");
            remove(key);
            return;
        }
        if (typeof value === 'function') {
            console.error("储存的值不能为方法");
            return;
        }
        if (typeof value === 'object') {
            try {
                value = JSON.stringify(value);
            } catch (e) {
                console.error(`解析失败，str=${value}`);
                return;
            }
        } else if (typeof value === 'number') {
            value = value + "";
        }
        if (!PREVIEW && _key !== null && _iv !== null) {
            try {
                value = aesEncrypt(value, _key, _iv);
            } catch (e) {
                value = null;
            }
        }
        sys.localStorage.setItem(key, value);
    }

    function get(key, defaultValue) {
        if (key === null) {
            console.error("存储的key不能为空");
            return;
        }
        if (!PREVIEW) {
            key = md5(key);
        }
        let str = sys.localStorage.getItem(key);
        if (str !== null && str !== '' && !PREVIEW && _key !== null && _iv !== null) {
            try {
                str = aesDecrypt(str, _key, _iv);
            } catch (e) {
                str = null;
            }
        }
        if (defaultValue === undefined || typeof defaultValue === 'string') {
            return str;
        }
        if (str === null) {
            return defaultValue;
        }
        if (typeof defaultValue === 'number') {
            return Number(str) || 0;
        }
        if (typeof defaultValue === 'boolean') {
            return str === "true";
        }
        if (typeof defaultValue === 'object') {
            try {
                return JSON.parse(str);
            } catch (e) {
                console.error("解析数据失败,str=" + str);
                return defaultValue;
            }
        }
        return str;
    }

    function remove(key) {
        if (key === null) {
            console.error("存储的key不能为空");
            return;
        }
        if (!PREVIEW) {
            key = md5(key);
        }
        sys.localStorage.removeItem(key);
    }

    function clear() {
        sys.localStorage.clear();
    }

    function setUserData(key, value) {
        addUserKey(key);
        set(_userId + key, value);
    }

    function getUserData(key, defaultValue) {
        return get(_userId + key, defaultValue);
    }

    function removeUserData(key) {
        remove(_userId + key);
    }

    function cleanUserData() {
        let userKeys = get('user_save_keys', []);
        for (let i = 0; i < userKeys.length; i++) {
            remove(_userId + userKeys[i]);
        }
    }

    function addUserKey(key) {
        if (!_userKeys) {
            _userKeys = get('user_storage_key', []);
        }
        if (_userKeys.indexOf(key) === -1) {
            _userKeys.push(key);
            set('user_storage_key', _userKeys);
        }
    }

    return {
        init,
        set,
        get,
        remove,
        clear,
        setUserData,
        getUserData,
        removeUserData,
        cleanUserData
    };
})();

module.exports = SqlUtil;
