(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!*********************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var objectKeys = ['qy', 'env', 'error', 'version', 'lanDebug', 'cloud', 'serviceMarket', 'router', 'worklet', '__webpack_require_UNI_MP_PLUGIN__'];
var singlePageDisableKey = ['lanDebug', 'router', 'worklet'];
var target = typeof globalThis !== 'undefined' ? globalThis : function () {
  return this;
}();
var key = ['w', 'x'].join('');
var oldWx = target[key];
var launchOption = oldWx.getLaunchOptionsSync ? oldWx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof oldWx[key] === 'function';
}
function initWx() {
  var newWx = {};
  for (var _key in oldWx) {
    if (isWxKey(_key)) {
      // TODO wrapper function
      newWx[_key] = oldWx[_key];
    }
  }
  return newWx;
}
target[key] = initWx();
var _default = target[key];
exports.default = _default;

/***/ }),
/* 2 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApp = createApp;
exports.createComponent = createComponent;
exports.createPage = createPage;
exports.createPlugin = createPlugin;
exports.createSubpackageApp = createSubpackageApp;
exports.default = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _construct2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/construct */ 15));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _uniI18n = __webpack_require__(/*! @dcloudio/uni-i18n */ 22);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var realAtob;
var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== 'function') {
  realAtob = function realAtob(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, '');
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }

    // Adding the padding if missing, for semplicity
    str += '=='.slice(2 - (str.length & 3));
    var bitmap;
    var result = '';
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length;) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  // 注意atob只能在全局对象上调用，例如：`const Base64 = {atob};Base64.atob('xxxx')`是错误的用法
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
function getCurrentUserInfo() {
  var token = wx.getStorageSync('uni_id_token') || '';
  var tokenArr = token.split('.');
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  var userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error('获取当前用户信息出错，详细错误信息为：' + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1000;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(Vue) {
  Vue.prototype.uniIDHasRole = function (roleId) {
    var _getCurrentUserInfo = getCurrentUserInfo(),
      role = _getCurrentUserInfo.role;
    return role.indexOf(roleId) > -1;
  };
  Vue.prototype.uniIDHasPermission = function (permissionId) {
    var _getCurrentUserInfo2 = getCurrentUserInfo(),
      permission = _getCurrentUserInfo2.permission;
    return this.uniIDHasRole('admin') || permission.indexOf(permissionId) > -1;
  };
  Vue.prototype.uniIDTokenValid = function () {
    var _getCurrentUserInfo3 = getCurrentUserInfo(),
      tokenExpired = _getCurrentUserInfo3.tokenExpired;
    return tokenExpired > Date.now();
  };
}
var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isFn(fn) {
  return typeof fn === 'function';
}
function isStr(str) {
  return typeof str === 'string';
}
function isObject(obj) {
  return obj !== null && (0, _typeof2.default)(obj) === 'object';
}
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
function noop() {}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});
function sortObject(obj) {
  var sortObj = {};
  if (isPlainObject(obj)) {
    Object.keys(obj).sort().forEach(function (key) {
      sortObj[key] = obj[key];
    });
  }
  return !Object.keys(sortObj) ? obj : sortObj;
}
var HOOKS = ['invoke', 'success', 'fail', 'complete', 'returnValue'];
var globalInterceptors = {};
var scopedInterceptors = {};
function mergeHook(parentVal, childVal) {
  var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}
function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}
function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}
function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}
function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}
function wrapperHook(hook, params) {
  return function (data) {
    return hook(data, params) || data;
  };
}
function isPromise(obj) {
  return !!obj && ((0, _typeof2.default)(obj) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
function queue(hooks, data, params) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      var res = hook(data, params);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {}
        };
      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    }
  };
}
function wrapperOptions(interceptor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res, options).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options) {
  for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    params[_key - 3] = arguments[_key];
  }
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        // 重新访问 getApiInterceptorHooks, 允许 invoke 中再次调用 addInterceptor,removeInterceptor
        return api.apply(void 0, [wrapperOptions(getApiInterceptorHooks(method), options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}
var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return new Promise(function (resolve, reject) {
      res.then(function (res) {
        if (res[0]) {
          reject(res[0]);
        } else {
          resolve(res[1]);
        }
      });
    });
  }
};
var SYNC_API_RE = /^\$|Window$|WindowStyle$|sendHostEvent|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getLocale|setLocale|invokePushCallback|getWindowInfo|getDeviceInfo|getAppBaseInfo|getSystemSetting|getAppAuthorizeSetting|initUTS|requireUTS|registerUTS/;
var CONTEXT_API_RE = /^create|Manager$/;

// Context例外情况
var CONTEXT_API_RE_EXC = ['createBLEConnection'];

// 同步例外情况
var ASYNC_API = ['createBLEConnection', 'createPushMessage'];
var CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}
function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).catch(function (err) {
    return [err];
  });
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}

/* eslint-disable no-extend-native */
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    var promise = this.constructor;
    return this.then(function (value) {
      return promise.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return promise.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };
}
function promisify(name, api) {
  if (!shouldPromise(name) || !isFn(api)) {
    return api;
  }
  return function promiseApi() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      params[_key2 - 1] = arguments[_key2];
    }
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject
      })].concat(params));
    })));
  };
}
var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;
function checkDeviceWidth() {
  var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
    platform = _wx$getSystemInfoSync.platform,
    pixelRatio = _wx$getSystemInfoSync.pixelRatio,
    windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}
function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}
var LOCALE_ZH_HANS = 'zh-Hans';
var LOCALE_ZH_HANT = 'zh-Hant';
var LOCALE_EN = 'en';
var LOCALE_FR = 'fr';
var LOCALE_ES = 'es';
var messages = {};
var locale;
{
  locale = normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN;
}
function initI18nMessages() {
  if (!isEnableLocale()) {
    return;
  }
  var localeKeys = Object.keys(__uniConfig.locales);
  if (localeKeys.length) {
    localeKeys.forEach(function (locale) {
      var curMessages = messages[locale];
      var userMessages = __uniConfig.locales[locale];
      if (curMessages) {
        Object.assign(curMessages, userMessages);
      } else {
        messages[locale] = userMessages;
      }
    });
  }
}
initI18nMessages();
var i18n = (0, _uniI18n.initVueI18n)(locale, {});
var t = i18n.t;
var i18nMixin = i18n.mixin = {
  beforeCreate: function beforeCreate() {
    var _this = this;
    var unwatch = i18n.i18n.watchLocale(function () {
      _this.$forceUpdate();
    });
    this.$once('hook:beforeDestroy', function () {
      unwatch();
    });
  },
  methods: {
    $$t: function $$t(key, values) {
      return t(key, values);
    }
  }
};
var setLocale = i18n.setLocale;
var getLocale = i18n.getLocale;
function initAppLocale(Vue, appVm, locale) {
  var state = Vue.observable({
    locale: locale || i18n.getLocale()
  });
  var localeWatchers = [];
  appVm.$watchLocale = function (fn) {
    localeWatchers.push(fn);
  };
  Object.defineProperty(appVm, '$locale', {
    get: function get() {
      return state.locale;
    },
    set: function set(v) {
      state.locale = v;
      localeWatchers.forEach(function (watch) {
        return watch(v);
      });
    }
  });
}
function isEnableLocale() {
  return typeof __uniConfig !== 'undefined' && __uniConfig.locales && !!Object.keys(__uniConfig.locales).length;
}
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === 'chinese') {
    // 支付宝
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
  if (lang) {
    return lang;
  }
}
// export function initI18n() {
//   const localeKeys = Object.keys(__uniConfig.locales || {})
//   if (localeKeys.length) {
//     localeKeys.forEach((locale) =>
//       i18n.add(locale, __uniConfig.locales[locale])
//     )
//   }
// }

function getLocale$1() {
  // 优先使用 $locale
  if (isFn(getApp)) {
    var app = getApp({
      allowDefault: true
    });
    if (app && app.$vm) {
      return app.$vm.$locale;
    }
  }
  return normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN;
}
function setLocale$1(locale) {
  var app = isFn(getApp) ? getApp() : false;
  if (!app) {
    return false;
  }
  var oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach(function (fn) {
      return fn({
        locale: locale
      });
    });
    return true;
  }
  return false;
}
var onLocaleChangeCallbacks = [];
function onLocaleChange(fn) {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
}
if (typeof global !== 'undefined') {
  global.getLocale = getLocale$1;
}
var interceptors = {
  promiseInterceptor: promiseInterceptor
};
var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  getLocale: getLocale$1,
  setLocale: setLocale$1,
  onLocaleChange: onLocaleChange,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor,
  interceptors: interceptors
});
function findExistsPageIndex(url) {
  var pages = getCurrentPages();
  var len = pages.length;
  while (len--) {
    var page = pages[len];
    if (page.$page && page.$page.fullPath === url) {
      return len;
    }
  }
  return -1;
}
var redirectTo = {
  name: function name(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.delta) {
      return 'navigateBack';
    }
    return 'redirectTo';
  },
  args: function args(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.url) {
      var existsPageIndex = findExistsPageIndex(fromArgs.url);
      if (existsPageIndex !== -1) {
        var delta = getCurrentPages().length - 1 - existsPageIndex;
        if (delta > 0) {
          fromArgs.delta = delta;
        }
      }
    }
  }
};
var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(function (item, index) {
        return index < currentIndex ? item !== urls[currentIndex] : true;
      });
    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
var UUID_KEY = '__DC_STAT_UUID';
var deviceId;
function useDeviceId(result) {
  deviceId = deviceId || wx.getStorageSync(UUID_KEY);
  if (!deviceId) {
    deviceId = Date.now() + '' + Math.floor(Math.random() * 1e7);
    wx.setStorage({
      key: UUID_KEY,
      data: deviceId
    });
  }
  result.deviceId = deviceId;
}
function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.screenHeight - safeArea.bottom
    };
  }
}
function populateParameters(result) {
  var _result$brand = result.brand,
    brand = _result$brand === void 0 ? '' : _result$brand,
    _result$model = result.model,
    model = _result$model === void 0 ? '' : _result$model,
    _result$system = result.system,
    system = _result$system === void 0 ? '' : _result$system,
    _result$language = result.language,
    language = _result$language === void 0 ? '' : _result$language,
    theme = result.theme,
    version = result.version,
    platform = result.platform,
    fontSizeSetting = result.fontSizeSetting,
    SDKVersion = result.SDKVersion,
    pixelRatio = result.pixelRatio,
    deviceOrientation = result.deviceOrientation;
  // const isQuickApp = "mp-weixin".indexOf('quickapp-webview') !== -1

  var extraParam = {};

  // osName osVersion
  var osName = '';
  var osVersion = '';
  {
    osName = system.split(' ')[0] || '';
    osVersion = system.split(' ')[1] || '';
  }
  var hostVersion = version;

  // deviceType
  var deviceType = getGetDeviceType(result, model);

  // deviceModel
  var deviceBrand = getDeviceBrand(brand);

  // hostName
  var _hostName = getHostName(result);

  // deviceOrientation
  var _deviceOrientation = deviceOrientation; // 仅 微信 百度 支持

  // devicePixelRatio
  var _devicePixelRatio = pixelRatio;

  // SDKVersion
  var _SDKVersion = SDKVersion;

  // hostLanguage
  var hostLanguage = language.replace(/_/g, '-');

  // wx.getAccountInfoSync

  var parameters = {
    appId: "__UNI__06F2FAF",
    appName: "diancan-user",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "4.29",
    uniRuntimeVersion: "4.29",
    uniPlatform: undefined || "mp-weixin",
    deviceBrand: deviceBrand,
    deviceModel: model,
    deviceType: deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName: osName.toLocaleLowerCase(),
    osVersion: osVersion,
    hostTheme: theme,
    hostVersion: hostVersion,
    hostLanguage: hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: undefined,
    osTheme: undefined,
    ua: undefined,
    hostPackageName: undefined,
    browserName: undefined,
    browserVersion: undefined
  };
  Object.assign(result, parameters, extraParam);
}
function getGetDeviceType(result, model) {
  var deviceType = result.deviceType || 'phone';
  {
    var deviceTypeMaps = {
      ipad: 'pad',
      windows: 'pc',
      mac: 'pc'
    };
    var deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    var _model = model.toLocaleLowerCase();
    for (var index = 0; index < deviceTypeMapsKeys.length; index++) {
      var _m = deviceTypeMapsKeys[index];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  var deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = brand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale$1 ? getLocale$1() : defaultLanguage;
}
function getHostName(result) {
  var _platform = 'WeChat';
  var _hostName = result.hostName || _platform; // mp-jd
  {
    if (result.environment) {
      _hostName = result.environment;
    } else if (result.host && result.host.env) {
      _hostName = result.host.env;
    }
  }
  return _hostName;
}
var getSystemInfo = {
  returnValue: function returnValue(result) {
    useDeviceId(result);
    addSafeAreaInsets(result);
    populateParameters(result);
  }
};
var showActionSheet = {
  args: function args(fromArgs) {
    if ((0, _typeof2.default)(fromArgs) === 'object') {
      fromArgs.alertText = fromArgs.title;
    }
  }
};
var getAppBaseInfo = {
  returnValue: function returnValue(result) {
    var _result = result,
      version = _result.version,
      language = _result.language,
      SDKVersion = _result.SDKVersion,
      theme = _result.theme;
    var _hostName = getHostName(result);
    var hostLanguage = language.replace('_', '-');
    result = sortObject(Object.assign(result, {
      appId: "__UNI__06F2FAF",
      appName: "diancan-user",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      hostVersion: version,
      hostLanguage: hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme
    }));
  }
};
var getDeviceInfo = {
  returnValue: function returnValue(result) {
    var _result2 = result,
      brand = _result2.brand,
      model = _result2.model;
    var deviceType = getGetDeviceType(result, model);
    var deviceBrand = getDeviceBrand(brand);
    useDeviceId(result);
    result = sortObject(Object.assign(result, {
      deviceType: deviceType,
      deviceBrand: deviceBrand,
      deviceModel: model
    }));
  }
};
var getWindowInfo = {
  returnValue: function returnValue(result) {
    addSafeAreaInsets(result);
    result = sortObject(Object.assign(result, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
var getAppAuthorizeSetting = {
  returnValue: function returnValue(result) {
    var locationReducedAccuracy = result.locationReducedAccuracy;
    result.locationAccuracy = 'unsupported';
    if (locationReducedAccuracy === true) {
      result.locationAccuracy = 'reduced';
    } else if (locationReducedAccuracy === false) {
      result.locationAccuracy = 'full';
    }
  }
};

// import navigateTo from 'uni-helpers/navigate-to'

var compressImage = {
  args: function args(fromArgs) {
    // https://developers.weixin.qq.com/community/develop/doc/000c08940c865011298e0a43256800?highLine=compressHeight
    if (fromArgs.compressedHeight && !fromArgs.compressHeight) {
      fromArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !fromArgs.compressWidth) {
      fromArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = {
  redirectTo: redirectTo,
  // navigateTo,  // 由于在微信开发者工具的页面参数，会显示__id__参数，因此暂时关闭mp-weixin对于navigateTo的AOP
  previewImage: previewImage,
  getSystemInfo: getSystemInfo,
  getSystemInfoSync: getSystemInfo,
  showActionSheet: showActionSheet,
  getAppBaseInfo: getAppBaseInfo,
  getDeviceInfo: getDeviceInfo,
  getWindowInfo: getWindowInfo,
  getAppAuthorizeSetting: getAppAuthorizeSetting,
  compressImage: compressImage
};
var todos = ['vibrate', 'preloadPage', 'unPreloadPage', 'loadSubPackage'];
var canIUses = [];
var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];
function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}
function processArgs(methodName, fromArgs) {
  var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {
    // 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {
          // 不支持的参数
          console.warn("The '".concat(methodName, "' method of platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support option '").concat(key, "'"));
        } else if (isStr(keyOption)) {
          // 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {
          // {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        if (isFn(fromArgs[key])) {
          toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
        }
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}
function processReturnValue(methodName, res, returnValue) {
  var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {
    // 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}
function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {
      // 暂不支持的 api
      return function () {
        console.error("Platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support '".concat(methodName, "'."));
      };
    }
    return function (arg1, arg2) {
      // 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      if (isFn(options.name)) {
        methodName = options.name(arg1);
      } else if (isStr(options.name)) {
        methodName = options.name;
      }
      var returnValue = wx[methodName].apply(wx, args);
      if (isSyncApi(methodName)) {
        // 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}
var todoApis = Object.create(null);
var TODOS = ['onTabBarMidButtonTap', 'subscribePush', 'unsubscribePush', 'onPush', 'offPush', 'share'];
function createTodoApi(name) {
  return function todoApi(_ref) {
    var fail = _ref.fail,
      complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail method '").concat(name, "' not supported")
    };
    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}
TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});
var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin']
};
function getProvider(_ref2) {
  var service = _ref2.service,
    success = _ref2.success,
    fail = _ref2.fail,
    complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service]
    };
    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail service not found'
    };
    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}
var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider
});
var getEmitter = function () {
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();
function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}
function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}
var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit
});

/**
 * 框架内 try-catch
 */
/**
 * 开发者 try-catch
 */
function tryCatch(fn) {
  return function () {
    try {
      return fn.apply(fn, arguments);
    } catch (e) {
      // TODO
      console.error(e);
    }
  };
}
function getApiCallbacks(params) {
  var apiCallbacks = {};
  for (var name in params) {
    var param = params[name];
    if (isFn(param)) {
      apiCallbacks[name] = tryCatch(param);
      delete params[name];
    }
  }
  return apiCallbacks;
}
var cid;
var cidErrMsg;
var enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e) {}
  return message;
}
function invokePushCallback(args) {
  if (args.type === 'enabled') {
    enabled = true;
  } else if (args.type === 'clientId') {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === 'pushMsg') {
    var message = {
      type: 'receive',
      data: normalizePushMessage(args.message)
    };
    for (var i = 0; i < onPushMessageCallbacks.length; i++) {
      var callback = onPushMessageCallbacks[i];
      callback(message);
      // 该消息已被阻止
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === 'click') {
    onPushMessageCallbacks.forEach(function (callback) {
      callback({
        type: 'click',
        data: normalizePushMessage(args.message)
      });
    });
  }
}
var getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid, errMsg) {
  getPushCidCallbacks.forEach(function (callback) {
    callback(cid, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
function getPushClientId(args) {
  if (!isPlainObject(args)) {
    args = {};
  }
  var _getApiCallbacks = getApiCallbacks(args),
    success = _getApiCallbacks.success,
    fail = _getApiCallbacks.fail,
    complete = _getApiCallbacks.complete;
  var hasSuccess = isFn(success);
  var hasFail = isFn(fail);
  var hasComplete = isFn(complete);
  Promise.resolve().then(function () {
    if (typeof enabled === 'undefined') {
      enabled = false;
      cid = '';
      cidErrMsg = 'uniPush is not enabled';
    }
    getPushCidCallbacks.push(function (cid, errMsg) {
      var res;
      if (cid) {
        res = {
          errMsg: 'getPushClientId:ok',
          cid: cid
        };
        hasSuccess && success(res);
      } else {
        res = {
          errMsg: 'getPushClientId:fail' + (errMsg ? ' ' + errMsg : '')
        };
        hasFail && fail(res);
      }
      hasComplete && complete(res);
    });
    if (typeof cid !== 'undefined') {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
}
var onPushMessageCallbacks = [];
// 不使用 defineOnApi 实现，是因为 defineOnApi 依赖 UniServiceJSBridge ，该对象目前在小程序上未提供，故简单实现
var onPushMessage = function onPushMessage(fn) {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
var offPushMessage = function offPushMessage(fn) {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    var index = onPushMessageCallbacks.indexOf(fn);
    if (index > -1) {
      onPushMessageCallbacks.splice(index, 1);
    }
  }
};
var baseInfo = wx.getAppBaseInfo && wx.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx.getSystemInfoSync();
}
var host = baseInfo ? baseInfo.host : null;
var shareVideoMessage = host && host.env === 'SAAASDK' ? wx.miniapp.shareVideoMessage : wx.shareVideoMessage;
var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shareVideoMessage: shareVideoMessage,
  getPushClientId: getPushClientId,
  onPushMessage: onPushMessage,
  offPushMessage: offPushMessage,
  invokePushCallback: invokePushCallback
});
var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];
function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function initBehavior(options) {
  return Behavior(options);
}
function isPage() {
  return !!this.route;
}
function initRelation(detail) {
  this.triggerEvent('__l', detail);
}
function selectAllComponents(mpInstance, selector, $refs) {
  var components = mpInstance.selectAllComponents(selector) || [];
  components.forEach(function (component) {
    var ref = component.dataset.ref;
    $refs[ref] = component.$vm || toSkip(component);
    {
      if (component.dataset.vueGeneric === 'scoped') {
        component.selectAllComponents('.scoped-ref').forEach(function (scopedComponent) {
          selectAllComponents(scopedComponent, selector, $refs);
        });
      }
    }
  });
}
function syncRefs(refs, newRefs) {
  var oldKeys = (0, _construct2.default)(Set, (0, _toConsumableArray2.default)(Object.keys(refs)));
  var newKeys = Object.keys(newRefs);
  newKeys.forEach(function (key) {
    var oldValue = refs[key];
    var newValue = newRefs[key];
    if (Array.isArray(oldValue) && Array.isArray(newValue) && oldValue.length === newValue.length && newValue.every(function (value) {
      return oldValue.includes(value);
    })) {
      return;
    }
    refs[key] = newValue;
    oldKeys.delete(key);
  });
  oldKeys.forEach(function (key) {
    delete refs[key];
  });
  return refs;
}
function initRefs(vm) {
  var mpInstance = vm.$scope;
  var refs = {};
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      selectAllComponents(mpInstance, '.vue-ref', $refs);
      // TODO 暂不考虑 for 中的 scoped
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for') || [];
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || toSkip(component));
      });
      return syncRefs(refs, $refs);
    }
  });
}
function handleLink(event) {
  var _ref3 = event.detail || event.value,
    vuePid = _ref3.vuePid,
    vueOptions = _ref3.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  vueOptions.parent = parentVm;
}
function markMPComponent(component) {
  // 在 Vue 中标记为小程序组件
  var IS_MP = '__v_isMPComponent';
  Object.defineProperty(component, IS_MP, {
    configurable: true,
    enumerable: false,
    value: true
  });
  return component;
}
function toSkip(obj) {
  var OB = '__ob__';
  var SKIP = '__v_skip';
  if (isObject(obj) && Object.isExtensible(obj)) {
    // 避免被 @vue/composition-api 观测
    Object.defineProperty(obj, OB, {
      configurable: true,
      enumerable: false,
      value: (0, _defineProperty2.default)({}, SKIP, true)
    });
  }
  return obj;
}
var WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach(function (name) {
      var matches = name.match(WORKLET_RE);
      if (matches) {
        var workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
var MPPage = Page;
var MPComponent = Component;
var customizeRE = /:/g;
var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});
function initTriggerEvent(mpInstance) {
  var oldTriggerEvent = mpInstance.triggerEvent;
  var newTriggerEvent = function newTriggerEvent(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    // 事件名统一转驼峰格式，仅处理：当前组件为 vue 组件、当前组件为 vue 组件子组件
    if (this.$vm || this.dataset && this.dataset.comType) {
      event = customize(event);
    } else {
      // 针对微信/QQ小程序单独补充驼峰格式事件，以兼容历史项目
      var newEvent = customize(event);
      if (newEvent !== event) {
        oldTriggerEvent.apply(this, [newEvent].concat(args));
      }
    }
    return oldTriggerEvent.apply(this, [event].concat(args));
  };
  try {
    // 京东小程序 triggerEvent 为只读
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initHook(name, options, isComponent) {
  var oldHook = options[name];
  options[name] = function () {
    markMPComponent(this);
    initTriggerEvent(this);
    if (oldHook) {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return oldHook.apply(this, args);
    }
  };
}
if (!MPPage.__$wrappered) {
  MPPage.__$wrappered = true;
  Page = function Page() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('onLoad', options);
    return MPPage(options);
  };
  Page.after = MPPage.after;
  Component = function Component() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('created', options);
    return MPComponent(options);
  };
}
var PAGE_EVENT_HOOKS = ['onPullDownRefresh', 'onReachBottom', 'onAddToFavorites', 'onShareTimeline', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap'];
function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}
function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }
  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }
  vueOptions = vueOptions.default || vueOptions;
  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super && vueOptions.super.options && Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }
  if (isFn(vueOptions[hook]) || Array.isArray(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {
      return hasHook(hook, mixin);
    });
  }
}
function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}
function initUnknownHooks(mpOptions, vueOptions) {
  var excludes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  findHooks(vueOptions).forEach(function (hook) {
    return initHook$1(mpOptions, hook, excludes);
  });
}
function findHooks(vueOptions) {
  var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (vueOptions) {
    Object.keys(vueOptions).forEach(function (name) {
      if (name.indexOf('on') === 0 && isFn(vueOptions[name])) {
        hooks.push(name);
      }
    });
  }
  return hooks;
}
function initHook$1(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function (args) {
      return this.$vm && this.$vm.__call_hook(hook, args);
    };
  }
}
function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  vueOptions = VueComponent.options;
  return [VueComponent, vueOptions];
}
function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}
function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;
  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}
function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};
  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"diancan-user","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }
  if (!isPlainObject(data)) {
    data = {};
  }
  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });
  return data;
}
var PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions.behaviors;
  var vueExtends = vueOptions.extends;
  var vueMixins = vueOptions.mixins;
  var vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps.name = {
            type: String,
            default: ''
          };
          vueProps.value = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ''
          };
        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(initBehavior({
      properties: initProperties(vueExtends.props, true)
    }));
  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(initBehavior({
          properties: initProperties(vueMixin.props, true)
        }));
      }
    });
  }
  return behaviors;
}
function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function initProperties(props) {
  var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var options = arguments.length > 3 ? arguments[3] : undefined;
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: ''
    };
    {
      if (options.virtualHost) {
        properties.virtualHostStyle = {
          type: null,
          value: ''
        };
        properties.virtualHostClass = {
          type: null,
          value: ''
        };
      }
    }
    // scopedSlotsCompiler auto
    properties.scopedSlotsCompiler = {
      type: String,
      value: ''
    };
    properties.vueSlots = {
      // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots
        });
      }
    };
  }
  if (Array.isArray(props)) {
    // ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key)
      };
    });
  } else if (isPlainObject(props)) {
    // {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {
        // title:{type:String,default:''}
        var value = opts.default;
        if (isFn(value)) {
          value = value();
        }
        opts.type = parsePropType(key, opts.type);
        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key)
        };
      } else {
        // content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key)
        };
      }
    });
  }
  return properties;
}
function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}
  event.stopPropagation = noop;
  event.preventDefault = noop;
  event.target = event.target || {};
  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }
  if (hasOwn(event, 'markerId')) {
    event.detail = (0, _typeof2.default)(event.detail) === 'object' ? event.detail : {};
    event.detail.markerId = event.markerId;
  }
  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }
  return event;
}
function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {
      // ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];
      var vFor;
      if (Number.isInteger(dataPath)) {
        vFor = dataPath;
      } else if (!dataPath) {
        vFor = context;
      } else if (typeof dataPath === 'string' && dataPath) {
        if (dataPath.indexOf('#s#') === 0) {
          vFor = dataPath.substr(3);
        } else {
          vFor = vm.__get_value(dataPath, context);
        }
      }
      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }
      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}
function processEventExtra(vm, extra, event, __args__) {
  var extraObj = {};
  if (Array.isArray(extra) && extra.length) {
    /**
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *'test'
     */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {
          // model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {
            // $event
            extraObj['$' + index] = event;
          } else if (dataPath === 'arguments') {
            extraObj['$' + index] = event.detail ? event.detail.__args__ || __args__ : __args__;
          } else if (dataPath.indexOf('$event.') === 0) {
            // $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }
  return extraObj;
}
function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}
function processEventArgs(vm, event) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var isCustom = arguments.length > 4 ? arguments[4] : undefined;
  var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象

  // fixed 用户直接触发 mpInstance.triggerEvent
  var __args__ = isPlainObject(event.detail) ? event.detail.__args__ || [event.detail] : [event.detail];
  if (isCustom) {
    // 自定义事件
    isCustomMPEvent = event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {
      // 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return __args__;
    }
  }
  var extraObj = processEventExtra(vm, extra, event, __args__);
  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {
        // input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(__args__[0]);
        } else {
          // wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });
  return ret;
}
var ONCE = '~';
var CUSTOM = '^';
function isMatchEventType(eventType, optType) {
  return eventType === optType || optType === 'regionchange' && (eventType === 'begin' || eventType === 'end');
}
function getContextVm(vm) {
  var $parent = vm.$parent;
  // 父组件是 scoped slots 或者其他自定义组件时继续查找
  while ($parent && $parent.$parent && ($parent.$options.generic || $parent.$parent.$options.generic || $parent.$scope._$vuePid)) {
    $parent = $parent.$parent;
  }
  return $parent && $parent.$parent;
}
function handleEvent(event) {
  var _this2 = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn('事件信息不存在');
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn('事件信息不存在');
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;
  var ret = [];
  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];
    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;
    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this2.$vm;
          if (handlerCtx.$options.generic) {
            // mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = getContextVm(handlerCtx) || handlerCtx;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx, processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName));
            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            var _type = _this2.$vm.mpType === 'page' ? 'Page' : 'Component';
            var path = _this2.route || _this2.is;
            throw new Error("".concat(_type, " \"").concat(path, "\" does not have a method \"").concat(methodName, "\""));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          var params = processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName);
          params = Array.isArray(params) ? params : [];
          // 参数尾部增加原始事件对象用于复杂表达式内获取额外数据
          if (/=\s*\S+\.eventParams\s*\|\|\s*\S+\[['"]event-params['"]\]/.test(handler.toString())) {
            // eslint-disable-next-line no-sparse-arrays
            params = params.concat([,,,,,,,,,, event]);
          }
          ret.push(handler.apply(handlerCtx, params));
        }
      });
    }
  });
  if (eventType === 'input' && ret.length === 1 && typeof ret[0] !== 'undefined') {
    return ret[0];
  }
}
var eventChannels = {};
function getEventChannel(id) {
  var eventChannel = eventChannels[id];
  delete eventChannels[id];
  return eventChannel;
}
var hooks = ['onShow', 'onHide', 'onError', 'onPageNotFound', 'onThemeChange', 'onUnhandledRejection'];
function initEventChannel() {
  _vue.default.prototype.getOpenerEventChannel = function () {
    // 微信小程序使用自身getOpenerEventChannel
    {
      return this.$scope.getOpenerEventChannel();
    }
  };
  var callHook = _vue.default.prototype.__call_hook;
  _vue.default.prototype.__call_hook = function (hook, args) {
    if (hook === 'onLoad' && args && args.__id__) {
      this.__eventChannel__ = getEventChannel(args.__id__);
      delete args.__id__;
    }
    return callHook.call(this, hook, args);
  };
}
function initScopedSlotsParams() {
  var center = {};
  var parents = {};
  function currentId(fn) {
    var vueIds = this.$options.propsData.vueId;
    if (vueIds) {
      var vueId = vueIds.split(',')[0];
      fn(vueId);
    }
  }
  _vue.default.prototype.$hasSSP = function (vueId) {
    var slot = center[vueId];
    if (!slot) {
      parents[vueId] = this;
      this.$on('hook:destroyed', function () {
        delete parents[vueId];
      });
    }
    return slot;
  };
  _vue.default.prototype.$getSSP = function (vueId, name, needAll) {
    var slot = center[vueId];
    if (slot) {
      var params = slot[name] || [];
      if (needAll) {
        return params;
      }
      return params[0];
    }
  };
  _vue.default.prototype.$setSSP = function (name, value) {
    var index = 0;
    currentId.call(this, function (vueId) {
      var slot = center[vueId];
      var params = slot[name] = slot[name] || [];
      params.push(value);
      index = params.length - 1;
    });
    return index;
  };
  _vue.default.prototype.$initSSP = function () {
    currentId.call(this, function (vueId) {
      center[vueId] = {};
    });
  };
  _vue.default.prototype.$callSSP = function () {
    currentId.call(this, function (vueId) {
      if (parents[vueId]) {
        parents[vueId].$forceUpdate();
      }
    });
  };
  _vue.default.mixin({
    destroyed: function destroyed() {
      var propsData = this.$options.propsData;
      var vueId = propsData && propsData.vueId;
      if (vueId) {
        delete center[vueId];
        delete parents[vueId];
      }
    }
  });
}
function parseBaseApp(vm, _ref4) {
  var mocks = _ref4.mocks,
    initRefs = _ref4.initRefs;
  initEventChannel();
  {
    initScopedSlotsParams();
  }
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }
  uniIdMixin(_vue.default);
  _vue.default.prototype.mpHost = "mp-weixin";
  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }
      this.mpType = this.$options.mpType;
      this.$mp = (0, _defineProperty2.default)({
        data: {}
      }, this.mpType, this.$options.mpInstance);
      this.$scope = this.$options.mpInstance;
      delete this.$options.mpType;
      delete this.$options.mpInstance;
      if (this.mpType === 'page' && typeof getApp === 'function') {
        // hack vue-i18n
        var app = getApp();
        if (app.$vm && app.$vm.$i18n) {
          this._i18n = app.$vm.$i18n;
        }
      }
      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    }
  });
  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {
        // 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (wx.canIUse && !wx.canIUse('nextTick')) {
          // 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }
      this.$vm = vm;
      this.$vm.$mp = {
        app: this
      };
      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;
      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);
      this.$vm.__call_hook('onLaunch', args);
    }
  };

  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }
  initAppLocale(_vue.default, vm, normalizeLocale(wx.getSystemInfoSync().language) || LOCALE_EN);
  initHooks(appOptions, hooks);
  initUnknownHooks(appOptions, vm.$options);
  return appOptions;
}
function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs
  });
}
function createApp(vm) {
  App(parseApp(vm));
  return vm;
}
var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function encodeReserveReplacer(c) {
  return '%' + c.charCodeAt(0).toString(16);
};
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function encode(str) {
  return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
};
function stringifyQuery(obj) {
  var encodeStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : encode;
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];
    if (val === undefined) {
      return '';
    }
    if (val === null) {
      return encodeStr(key);
    }
    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return;
        }
        if (val2 === null) {
          result.push(encodeStr(key));
        } else {
          result.push(encodeStr(key) + '=' + encodeStr(val2));
        }
      });
      return result.join('&');
    }
    return encodeStr(key) + '=' + encodeStr(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : null;
  return res ? "?".concat(res) : '';
}
function parseBaseComponent(vueComponentOptions) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    isPage = _ref5.isPage,
    initRelation = _ref5.initRelation;
  var needVueOptions = arguments.length > 2 ? arguments[2] : undefined;
  var _initVueComponent = initVueComponent(_vue.default, vueComponentOptions),
    _initVueComponent2 = (0, _slicedToArray2.default)(_initVueComponent, 2),
    VueComponent = _initVueComponent2[0],
    vueOptions = _initVueComponent2[1];
  var options = _objectSpread({
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true
  }, vueOptions.options || {});
  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin'].options) {
      Object.assign(options, vueOptions['mp-weixin'].options);
    }
  }
  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file, options),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;
        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties
        };
        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options
        });

        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      }
    },
    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      }
    },
    methods: {
      __l: handleLink,
      __e: handleEvent
    }
  };
  // externalClasses
  if (vueOptions.externalClasses) {
    componentOptions.externalClasses = vueOptions.externalClasses;
  }
  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }
  if (needVueOptions) {
    return [componentOptions, vueOptions, VueComponent];
  }
  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}
function parseComponent(vueComponentOptions, needVueOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation
  }, needVueOptions);
}
var hooks$1 = ['onShow', 'onHide', 'onUnload'];
hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);
function parseBasePage(vuePageOptions) {
  var _parseComponent = parseComponent(vuePageOptions, true),
    _parseComponent2 = (0, _slicedToArray2.default)(_parseComponent, 2),
    pageOptions = _parseComponent2[0],
    vueOptions = _parseComponent2[1];
  initHooks(pageOptions.methods, hooks$1, vueOptions);
  pageOptions.methods.onLoad = function (query) {
    this.options = query;
    var copyQuery = Object.assign({}, query);
    delete copyQuery.__id__;
    this.$page = {
      fullPath: '/' + (this.route || this.is) + stringifyQuery(copyQuery)
    };
    this.$vm.$mp.query = query; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', query);
  };
  {
    initUnknownHooks(pageOptions.methods, vuePageOptions, ['onReady']);
  }
  {
    initWorkletMethods(pageOptions.methods, vueOptions.methods);
  }
  return pageOptions;
}
function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions);
}
function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}
function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}
function createSubpackageApp(vm) {
  var appOptions = parseApp(vm);
  var app = getApp({
    allowDefault: true
  });
  vm.$scope = app;
  var globalData = app.globalData;
  if (globalData) {
    Object.keys(appOptions.globalData).forEach(function (name) {
      if (!hasOwn(globalData, name)) {
        globalData[name] = appOptions.globalData[name];
      }
    });
  }
  Object.keys(appOptions).forEach(function (name) {
    if (!hasOwn(app, name)) {
      app[name] = appOptions[name];
    }
  });
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
function createPlugin(vm) {
  var appOptions = parseApp(vm);
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});
canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name : canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});
var uni = {};
if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (hasOwn(target, name)) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    }
  });
} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });
  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, extraApi[name]);
    });
  }
  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });
  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });
  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}
wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;
wx.createSubpackageApp = createSubpackageApp;
wx.createPlugin = createPlugin;
var uni$1 = uni;
var _default = uni$1;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 5 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles.js */ 6);
var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit.js */ 7);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableRest = __webpack_require__(/*! ./nonIterableRest.js */ 10);
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 6 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 7 */
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) {
        ;
      }
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 9 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 10 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 11 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 12 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPropertyKey.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
var toPrimitive = __webpack_require__(/*! ./toPrimitive.js */ 14);
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 13 */
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 14 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPrimitive.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 15 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/construct.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ 16);
var isNativeReflectConstruct = __webpack_require__(/*! ./isNativeReflectConstruct.js */ 17);
function _construct(t, e, r) {
  if (isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && setPrototypeOf(p, r.prototype), p;
}
module.exports = _construct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 16 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 17 */
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (module.exports = _isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
}
module.exports = _isNativeReflectConstruct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 18 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles.js */ 19);
var iterableToArray = __webpack_require__(/*! ./iterableToArray.js */ 20);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread.js */ 21);
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 19 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 20 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 21 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 22 */
/*!*************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-i18n/dist/uni-i18n.es.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOCALE_ZH_HANT = exports.LOCALE_ZH_HANS = exports.LOCALE_FR = exports.LOCALE_ES = exports.LOCALE_EN = exports.I18n = exports.Formatter = void 0;
exports.compileI18nJsonStr = compileI18nJsonStr;
exports.hasI18nJson = hasI18nJson;
exports.initVueI18n = initVueI18n;
exports.isI18nStr = isI18nStr;
exports.isString = void 0;
exports.normalizeLocale = normalizeLocale;
exports.parseI18nJson = parseI18nJson;
exports.resolveLocale = resolveLocale;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var isObject = function isObject(val) {
  return val !== null && (0, _typeof2.default)(val) === 'object';
};
var defaultDelimiters = ['{', '}'];
var BaseFormatter = /*#__PURE__*/function () {
  function BaseFormatter() {
    (0, _classCallCheck2.default)(this, BaseFormatter);
    this._caches = Object.create(null);
  }
  (0, _createClass2.default)(BaseFormatter, [{
    key: "interpolate",
    value: function interpolate(message, values) {
      var delimiters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultDelimiters;
      if (!values) {
        return [message];
      }
      var tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }]);
  return BaseFormatter;
}();
exports.Formatter = BaseFormatter;
var RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
var RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
function parse(format, _ref) {
  var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
    startDelimiter = _ref2[0],
    endDelimiter = _ref2[1];
  var tokens = [];
  var position = 0;
  var text = '';
  while (position < format.length) {
    var char = format[position++];
    if (char === startDelimiter) {
      if (text) {
        tokens.push({
          type: 'text',
          value: text
        });
      }
      text = '';
      var sub = '';
      char = format[position++];
      while (char !== undefined && char !== endDelimiter) {
        sub += char;
        char = format[position++];
      }
      var isClosed = char === endDelimiter;
      var type = RE_TOKEN_LIST_VALUE.test(sub) ? 'list' : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? 'named' : 'unknown';
      tokens.push({
        value: sub,
        type: type
      });
    }
    //  else if (char === '%') {
    //   // when found rails i18n syntax, skip text capture
    //   if (format[position] !== '{') {
    //     text += char
    //   }
    // }
    else {
      text += char;
    }
  }
  text && tokens.push({
    type: 'text',
    value: text
  });
  return tokens;
}
function compile(tokens, values) {
  var compiled = [];
  var index = 0;
  var mode = Array.isArray(values) ? 'list' : isObject(values) ? 'named' : 'unknown';
  if (mode === 'unknown') {
    return compiled;
  }
  while (index < tokens.length) {
    var token = tokens[index];
    switch (token.type) {
      case 'text':
        compiled.push(token.value);
        break;
      case 'list':
        compiled.push(values[parseInt(token.value, 10)]);
        break;
      case 'named':
        if (mode === 'named') {
          compiled.push(values[token.value]);
        } else {
          if (true) {
            console.warn("Type of token '".concat(token.type, "' and format of value '").concat(mode, "' don't match!"));
          }
        }
        break;
      case 'unknown':
        if (true) {
          console.warn("Detect 'unknown' type of token!");
        }
        break;
    }
    index++;
  }
  return compiled;
}
var LOCALE_ZH_HANS = 'zh-Hans';
exports.LOCALE_ZH_HANS = LOCALE_ZH_HANS;
var LOCALE_ZH_HANT = 'zh-Hant';
exports.LOCALE_ZH_HANT = LOCALE_ZH_HANT;
var LOCALE_EN = 'en';
exports.LOCALE_EN = LOCALE_EN;
var LOCALE_FR = 'fr';
exports.LOCALE_FR = LOCALE_FR;
var LOCALE_ES = 'es';
exports.LOCALE_ES = LOCALE_ES;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = function hasOwn(val, key) {
  return hasOwnProperty.call(val, key);
};
var defaultFormatter = new BaseFormatter();
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === 'chinese') {
    // 支付宝
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales = Object.keys(messages);
  }
  var lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
var I18n = /*#__PURE__*/function () {
  function I18n(_ref3) {
    var locale = _ref3.locale,
      fallbackLocale = _ref3.fallbackLocale,
      messages = _ref3.messages,
      watcher = _ref3.watcher,
      formater = _ref3.formater;
    (0, _classCallCheck2.default)(this, I18n);
    this.locale = LOCALE_EN;
    this.fallbackLocale = LOCALE_EN;
    this.message = {};
    this.messages = {};
    this.watchers = [];
    if (fallbackLocale) {
      this.fallbackLocale = fallbackLocale;
    }
    this.formater = formater || defaultFormatter;
    this.messages = messages || {};
    this.setLocale(locale || LOCALE_EN);
    if (watcher) {
      this.watchLocale(watcher);
    }
  }
  (0, _createClass2.default)(I18n, [{
    key: "setLocale",
    value: function setLocale(locale) {
      var _this = this;
      var oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        // 可能初始化时不存在
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      // 仅发生变化时，通知
      if (oldLocale !== this.locale) {
        this.watchers.forEach(function (watcher) {
          watcher(_this.locale, oldLocale);
        });
      }
    }
  }, {
    key: "getLocale",
    value: function getLocale() {
      return this.locale;
    }
  }, {
    key: "watchLocale",
    value: function watchLocale(fn) {
      var _this2 = this;
      var index = this.watchers.push(fn) - 1;
      return function () {
        _this2.watchers.splice(index, 1);
      };
    }
  }, {
    key: "add",
    value: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach(function (key) {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
  }, {
    key: "f",
    value: function f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join('');
    }
  }, {
    key: "t",
    value: function t(key, locale, values) {
      var message = this.message;
      if (typeof locale === 'string') {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn("Cannot translate the value of keypath ".concat(key, ". Use the value of keypath as default."));
        return key;
      }
      return this.formater.interpolate(message[key], values).join('');
    }
  }]);
  return I18n;
}();
exports.I18n = I18n;
function watchAppLocale(appVm, i18n) {
  // 需要保证 watch 的触发在组件渲染之前
  if (appVm.$watchLocale) {
    // vue2
    appVm.$watchLocale(function (newLocale) {
      i18n.setLocale(newLocale);
    });
  } else {
    appVm.$watch(function () {
      return appVm.$locale;
    }, function (newLocale) {
      i18n.setLocale(newLocale);
    });
  }
}
function getDefaultLocale() {
  if (typeof uni !== 'undefined' && uni.getLocale) {
    return uni.getLocale();
  }
  // 小程序平台，uni 和 uni-i18n 互相引用，导致访问不到 uni，故在 global 上挂了 getLocale
  if (typeof global !== 'undefined' && global.getLocale) {
    return global.getLocale();
  }
  return LOCALE_EN;
}
function initVueI18n(locale) {
  var messages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fallbackLocale = arguments.length > 2 ? arguments[2] : undefined;
  var watcher = arguments.length > 3 ? arguments[3] : undefined;
  // 兼容旧版本入参
  if (typeof locale !== 'string') {
    var _ref4 = [messages, locale];
    locale = _ref4[0];
    messages = _ref4[1];
  }
  if (typeof locale !== 'string') {
    // 因为小程序平台，uni-i18n 和 uni 互相引用，导致此时访问 uni 时，为 undefined
    locale = getDefaultLocale();
  }
  if (typeof fallbackLocale !== 'string') {
    fallbackLocale = typeof __uniConfig !== 'undefined' && __uniConfig.fallbackLocale || LOCALE_EN;
  }
  var i18n = new I18n({
    locale: locale,
    fallbackLocale: fallbackLocale,
    messages: messages,
    watcher: watcher
  });
  var _t = function t(key, values) {
    if (typeof getApp !== 'function') {
      // app view
      /* eslint-disable no-func-assign */
      _t = function t(key, values) {
        return i18n.t(key, values);
      };
    } else {
      var isWatchedAppLocale = false;
      _t = function t(key, values) {
        var appVm = getApp().$vm;
        // 可能$vm还不存在，比如在支付宝小程序中，组件定义较早，在props的default里使用了t()函数（如uni-goods-nav），此时app还未初始化
        // options: {
        // 	type: Array,
        // 	default () {
        // 		return [{
        // 			icon: 'shop',
        // 			text: t("uni-goods-nav.options.shop"),
        // 		}, {
        // 			icon: 'cart',
        // 			text: t("uni-goods-nav.options.cart")
        // 		}]
        // 	}
        // },
        if (appVm) {
          // 触发响应式
          appVm.$locale;
          if (!isWatchedAppLocale) {
            isWatchedAppLocale = true;
            watchAppLocale(appVm, i18n);
          }
        }
        return i18n.t(key, values);
      };
    }
    return _t(key, values);
  };
  return {
    i18n: i18n,
    f: function f(message, values, delimiters) {
      return i18n.f(message, values, delimiters);
    },
    t: function t(key, values) {
      return _t(key, values);
    },
    add: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return i18n.add(locale, message, override);
    },
    watch: function watch(fn) {
      return i18n.watchLocale(fn);
    },
    getLocale: function getLocale() {
      return i18n.getLocale();
    },
    setLocale: function setLocale(newLocale) {
      return i18n.setLocale(newLocale);
    }
  };
}
var isString = function isString(val) {
  return typeof val === 'string';
};
exports.isString = isString;
var formater;
function hasI18nJson(jsonObj, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  return walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        return true;
      }
    } else {
      return hasI18nJson(value, delimiters);
    }
  });
}
function parseI18nJson(jsonObj, values, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        jsonObj[key] = compileStr(value, values, delimiters);
      }
    } else {
      parseI18nJson(value, values, delimiters);
    }
  });
  return jsonObj;
}
function compileI18nJsonStr(jsonStr, _ref5) {
  var locale = _ref5.locale,
    locales = _ref5.locales,
    delimiters = _ref5.delimiters;
  if (!isI18nStr(jsonStr, delimiters)) {
    return jsonStr;
  }
  if (!formater) {
    formater = new BaseFormatter();
  }
  var localeValues = [];
  Object.keys(locales).forEach(function (name) {
    if (name !== locale) {
      localeValues.push({
        locale: name,
        values: locales[name]
      });
    }
  });
  localeValues.unshift({
    locale: locale,
    values: locales[locale]
  });
  try {
    return JSON.stringify(compileJsonObj(JSON.parse(jsonStr), localeValues, delimiters), null, 2);
  } catch (e) {}
  return jsonStr;
}
function isI18nStr(value, delimiters) {
  return value.indexOf(delimiters[0]) > -1;
}
function compileStr(value, values, delimiters) {
  return formater.interpolate(value, values, delimiters).join('');
}
function compileValue(jsonObj, key, localeValues, delimiters) {
  var value = jsonObj[key];
  if (isString(value)) {
    // 存在国际化
    if (isI18nStr(value, delimiters)) {
      jsonObj[key] = compileStr(value, localeValues[0].values, delimiters);
      if (localeValues.length > 1) {
        // 格式化国际化语言
        var valueLocales = jsonObj[key + 'Locales'] = {};
        localeValues.forEach(function (localValue) {
          valueLocales[localValue.locale] = compileStr(value, localValue.values, delimiters);
        });
      }
    }
  } else {
    compileJsonObj(value, localeValues, delimiters);
  }
}
function compileJsonObj(jsonObj, localeValues, delimiters) {
  walkJsonObj(jsonObj, function (jsonObj, key) {
    compileValue(jsonObj, key, localeValues, delimiters);
  });
  return jsonObj;
}
function walkJsonObj(jsonObj, walk) {
  if (Array.isArray(jsonObj)) {
    for (var i = 0; i < jsonObj.length; i++) {
      if (walk(jsonObj, i)) {
        return true;
      }
    }
  } else if (isObject(jsonObj)) {
    for (var key in jsonObj) {
      if (walk(jsonObj, key)) {
        return true;
      }
    }
  }
  return false;
}
function resolveLocale(locales) {
  return function (locale) {
    if (!locale) {
      return locale;
    }
    locale = normalizeLocale(locale) || locale;
    return resolveLocaleChain(locale).find(function (locale) {
      return locales.indexOf(locale) > -1;
    });
  };
}
function resolveLocaleChain(locale) {
  var chain = [];
  var tokens = locale.split('-');
  while (tokens.length) {
    chain.push(tokens.join('-'));
    tokens.pop();
  }
  return chain;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 23 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 24 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 25 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2023 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      if (vm.$options && vm.$options.__file) { // fixed by xxxxxx
        return ('') + vm.$options.__file
      }
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm && vm.$options.name !== 'PageBody') {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        !vm.$options.isReserved && tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
  Dep.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
  Dep.target = Dep.SharedObject.target;
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue &&
    !value.__v_isMPComponent
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i, i++)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu' || vm.mpHost === 'mp-kuaishou' || vm.mpHost === 'mp-xhs'){//百度、快手、小红书 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    !vm._$fallback && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    !vm._$fallback && initProvide(vm); // resolve provide after data/props
    !vm._$fallback && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
var NULLTYPE = '[object Null]';
var UNDEFINEDTYPE = '[object Undefined]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function nullOrUndefined(currentType, preType) {
    if(
        (currentType === NULLTYPE || currentType === UNDEFINEDTYPE) && 
        (preType === NULLTYPE || preType === UNDEFINEDTYPE)
    ) {
        return false
    }
    return true
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue !== pre[key] && nullOrUndefined(currentType, preType)) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"diancan-user","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"diancan-user","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"diancan-user","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function clearInstance(key, value) {
  // 简易去除 Vue 和小程序组件实例
  if (value) {
    if (value._isVue || value.__v_isMPComponent) {
      return {}
    }
  }
  return value
}

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);

  // vue-composition-api
  var compositionApiState = vm.__composition_api_state__ || vm.__secret_vfa_state__;
  var rawBindings = compositionApiState && compositionApiState.rawBindings;
  if (rawBindings) {
    Object.keys(rawBindings).forEach(function (key) {
      ret[key] = vm[key];
    });
  }

  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret, clearInstance))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = this.$shouldDiffData === false ? data : diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"diancan-user","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  !vm._$fallback && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err, vm, info) {
    Vue.util.warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    console.error(err);
    /* eslint-disable no-undef */
    var app = typeof getApp === 'function' && getApp();
    if (app && app.onError) {
      app.onError(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      var triggerEvent = this.$scope['_triggerEvent'] || this.$scope['triggerEvent'];
      if (triggerEvent) {
        try {
          triggerEvent.call(this.$scope, event, {
            __args__: toArray(arguments, 1)
          });
        } catch (error) {

        }
      }
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0, l = val; i < l; i++) {
        // 第一个参数暂时仍和小程序一致
        ret[i] = iteratee(i, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onPageNotFound',
    'onThemeChange',
    'onError',
    'onUnhandledRejection',
    //Page
    'onInit',
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onAddToFavorites',
    'onShareTimeline',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    'onUploadDouyinVideo',
    'onNFCReadMessage',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 26 */
/*!************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/pages.json ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    if (!options.components) {
      options.components = {}
    }
    var hasOwn = Object.prototype.hasOwnProperty
    for (var name in components) {
      if (hasOwn.call(components, name) && !hasOwn.call(options.components, name)) {
        options.components[name] = components[name]
      }
    }
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    if(typeof renderjs.beforeCreate === 'function'){
			renderjs.beforeCreate = [renderjs.beforeCreate]
		}
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 33 */
/*!***************************************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/node_modules/goeasy/goeasy.esm.min.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, wx, process, global, Buffer) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 40));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ 42));
var _get2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/get */ 43));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 46));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _inherits2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/inherits */ 47));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ 48));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ 45));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e27) { throw _e27; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e28) { didErr = true; err = _e28; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var e, t;
!function (e) {
  e.UNIAPP = "uniapp", e.REACT_NATIVE = "rn", e.COCOS = "cocos", e.UNKNOWN = "unknown";
}(e || (e = {}));
var s = /*#__PURE__*/function () {
  function s() {
    var _this$methods;
    (0, _classCallCheck2.default)(this, s);
    this.framework = null, this.methods = (_this$methods = {}, (0, _defineProperty2.default)(_this$methods, e.UNIAPP, this.isUniApp), (0, _defineProperty2.default)(_this$methods, e.REACT_NATIVE, this.isReactNative), (0, _defineProperty2.default)(_this$methods, e.COCOS, this.isCocos), _this$methods);
    var t = this.methods,
      _s2 = Object.keys(t);
    for (var _i2 = 0, _s3 = _s2; _i2 < _s3.length; _i2++) {
      var _e2 = _s3[_i2];
      if ((0, t[_e2])()) {
        this.framework = _e2;
        break;
      }
    }
    this.framework = this.framework || e.UNKNOWN, this.framework;
  }
  (0, _createClass2.default)(s, [{
    key: "isUniApp",
    value: function isUniApp() {
      try {
        return "function" == typeof uni.getSystemInfoSync;
      } catch (e) {
        return !1;
      }
    }
  }, {
    key: "isReactNative",
    value: function isReactNative() {
      try {
        return "object" == (typeof navigator === "undefined" ? "undefined" : (0, _typeof2.default)(navigator)) && "ReactNative" === navigator.product;
      } catch (e) {
        return !1;
      }
    }
  }, {
    key: "isTaro",
    value: function isTaro() {
      try {
        return void 0 !== Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"diancan-user","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).TARO_ENV;
      } catch (e) {
        return !1;
      }
    }
  }, {
    key: "isCocos",
    value: function isCocos() {
      try {
        return void 0 !== cc.sys.localStorage;
      } catch (e) {
        return !1;
      }
    }
  }], [{
    key: "currentFramework",
    value: function currentFramework() {
      return this.instance || (this.instance = new s()), this.instance.framework;
    }
  }]);
  return s;
}();
var i = /*#__PURE__*/function () {
  function i() {
    (0, _classCallCheck2.default)(this, i);
  }
  (0, _createClass2.default)(i, null, [{
    key: "init",
    value: function init(t) {
      s.currentFramework() === e.REACT_NATIVE && (this.validate(t), this.platform = t.platform, this.asyncStorage = t.asyncStorage);
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!e) throw new Error("'reactNativeOptions' is missing when calling GoEasy.getInstance()");
      if (!e.platform) throw new Error("'platform' is missing in GoEasy 'reactNativeOptions'");
      if (!e.asyncStorage) throw new Error("'asyncStorage' is missing in GoEasy 'reactNativeOptions'");
    }
  }]);
  return i;
}();
!function (e) {
  e.DISCONNECTED = "disconnected", e.DISCONNECTING = "disconnecting", e.CONNECTING = "connecting", e.CONNECTED = "connected", e.RECONNECTING = "reconnecting", e.RECONNECTED = "reconnected", e.EXPIRED_RECONNECTED = "reconnected", e.CONNECT_FAILED = "connect_failed";
}(t || (t = {}));
var n = "2.13.8";
var o, r;
!function (e) {
  e.PRIVATE = "private", e.GROUP = "group", e.SYSTEM = "system", e.CS = "cs";
}(o || (o = {})), function (e) {
  e.NEW = "new", e.SENDING = "sending", e.SUCCESS = "success", e.FAIL = "fail";
}(r || (r = {}));
var a = /*#__PURE__*/(0, _createClass2.default)(function a() {
  (0, _classCallCheck2.default)(this, a);
});
var c = /*#__PURE__*/(0, _createClass2.default)(function c(e, t) {
  (0, _classCallCheck2.default)(this, c);
  this.id = e, this.data = t;
});
var u = new ( /*#__PURE__*/function () {
  function _class() {
    (0, _classCallCheck2.default)(this, _class);
  }
  (0, _createClass2.default)(_class, [{
    key: "isDef",
    value: function isDef(e) {
      return !this.isUndef(e);
    }
  }, {
    key: "isUndef",
    value: function isUndef(e) {
      return null == e;
    }
  }, {
    key: "isPrimitive",
    value: function isPrimitive(e) {
      return "string" == typeof e || "number" == typeof e || "symbol" == (0, _typeof2.default)(e) || "boolean" == typeof e;
    }
  }, {
    key: "isObject",
    value: function isObject(e) {
      return null !== e && "object" == (0, _typeof2.default)(e);
    }
  }, {
    key: "isPlainObject",
    value: function isPlainObject(e) {
      return "[object Object]" === Object.prototype.toString.call(e);
    }
  }, {
    key: "isRegExp",
    value: function isRegExp(e) {
      return "[object RegExp]" === Object.prototype.toString.call(e);
    }
  }, {
    key: "isValidArrayIndex",
    value: function isValidArrayIndex(e) {
      var t = parseFloat(String(e));
      return t >= 0 && Math.floor(t) === t && isFinite(e);
    }
  }, {
    key: "isString",
    value: function isString(e) {
      return "string" == typeof e;
    }
  }, {
    key: "isNumber",
    value: function isNumber(e) {
      return "number" == typeof e;
    }
  }, {
    key: "isStringOrNumber",
    value: function isStringOrNumber(e) {
      return this.isString(e) || this.isNumber(e);
    }
  }, {
    key: "isArray",
    value: function isArray(e) {
      return "[object Array]" === Object.prototype.toString.call(e);
    }
  }, {
    key: "isEmpty",
    value: function isEmpty(e) {
      return this.isArray(e) ? 0 === e.length : this.isObject(e) ? !this.isDef(e) : !this.isNumber(e) && (this.isString(e) ? "" === e.trim() : !this.isDef(e));
    }
  }, {
    key: "isNative",
    value: function isNative(e) {
      return "function" == typeof e && /native code/.test(e.toString());
    }
  }, {
    key: "isFunction",
    value: function isFunction(e) {
      return "function" == typeof e;
    }
  }, {
    key: "isBoolean",
    value: function isBoolean(e) {
      return "boolean" == typeof e;
    }
  }, {
    key: "isTrue",
    value: function isTrue(e) {
      return !0 === e;
    }
  }, {
    key: "isFalse",
    value: function isFalse(e) {
      return !1 === e;
    }
  }, {
    key: "isNull",
    value: function isNull(e) {
      return null === e;
    }
  }]);
  return _class;
}())();
var l;
!function (e) {
  e.MP_WX = "mp-wx", e.MP_WGAME = "mp-wgame", e.MP_BYTE = "mp-byte", e.MP_BAIDU = "mp-baidu", e.MP_ALI = "mp-ali", e.BROWSER = "browser", e.NODE = "node", e.UNI_IOS = "uni-ios", e.UNI_ANDROID = "uni-android", e.COCOS_IOS = "cocos-ios", e.COCOS_ANDROID = "cocos-android", e.RN_IOS = "rn-ios", e.RN_ANDROID = "rn-android", e.UNKNOWN = "unknown";
}(l || (l = {}));
var d = /*#__PURE__*/function () {
  function d() {
    var _this$methods2;
    (0, _classCallCheck2.default)(this, d);
    this.platform = null, this.methods = (_this$methods2 = {}, (0, _defineProperty2.default)(_this$methods2, l.BROWSER, this.isBrowser), (0, _defineProperty2.default)(_this$methods2, l.MP_WX, this.isMPWX), (0, _defineProperty2.default)(_this$methods2, l.MP_WGAME, this.isMPWeGame), (0, _defineProperty2.default)(_this$methods2, l.MP_BYTE, this.isMPByte), (0, _defineProperty2.default)(_this$methods2, l.MP_BAIDU, this.isMPBaidu), (0, _defineProperty2.default)(_this$methods2, l.MP_ALI, this.isMPAli), (0, _defineProperty2.default)(_this$methods2, l.NODE, this.isNode), (0, _defineProperty2.default)(_this$methods2, l.UNI_IOS, this.isUniAppIOS), (0, _defineProperty2.default)(_this$methods2, l.UNI_ANDROID, this.isUniAppAndroid), (0, _defineProperty2.default)(_this$methods2, l.COCOS_IOS, this.isCocosIOS), (0, _defineProperty2.default)(_this$methods2, l.COCOS_ANDROID, this.isCocosAndroid), (0, _defineProperty2.default)(_this$methods2, l.RN_IOS, this.isRNiOS), (0, _defineProperty2.default)(_this$methods2, l.RN_ANDROID, this.isRNAndroid), _this$methods2);
    var e = this.methods,
      t = Object.keys(e);
    for (var _i3 = 0, _t2 = t; _i3 < _t2.length; _i3++) {
      var _s4 = _t2[_i3];
      if ((0, e[_s4])()) {
        this.platform = _s4;
        break;
      }
    }
    this.platform = this.platform || l.UNKNOWN, this.platform;
  }
  (0, _createClass2.default)(d, [{
    key: "isBrowser",
    value: function isBrowser() {
      return "undefined" != typeof navigator && "Taro" !== navigator.product && "ReactNative" !== navigator.product && "undefined" == typeof GameGlobal && ("undefined" == typeof cc || null !== cc.sys.browserType) && "undefined" == typeof my && "undefined" == typeof tt && "undefined" == typeof swan;
    }
  }, {
    key: "isMPWX",
    value: function isMPWX() {
      return "object" == (typeof wx === "undefined" ? "undefined" : (0, _typeof2.default)(wx)) && "function" == typeof wx.getSystemInfoSync && "undefined" == typeof WebSocket && "undefined" == typeof XMLHttpRequest && "undefined" == typeof plus && "undefined" == typeof tt;
    }
  }, {
    key: "isMPWeGame",
    value: function isMPWeGame() {
      return "object" == (typeof GameGlobal === "undefined" ? "undefined" : (0, _typeof2.default)(GameGlobal));
    }
  }, {
    key: "isMPByte",
    value: function isMPByte() {
      return "object" == (typeof tt === "undefined" ? "undefined" : (0, _typeof2.default)(tt)) && "function" == typeof tt.getSystemInfoSync;
    }
  }, {
    key: "isMPBaidu",
    value: function isMPBaidu() {
      return "object" == (typeof swan === "undefined" ? "undefined" : (0, _typeof2.default)(swan)) && "function" == typeof swan.getSystemInfoSync;
    }
  }, {
    key: "isMPAli",
    value: function isMPAli() {
      return "object" == (typeof my === "undefined" ? "undefined" : (0, _typeof2.default)(my)) && "function" == typeof my.getSystemInfoSync;
    }
  }, {
    key: "isNode",
    value: function isNode() {
      try {
        return "node" === process.release.name;
      } catch (e) {
        return !1;
      }
    }
  }, {
    key: "isUniAppIOS",
    value: function isUniAppIOS() {
      try {
        return "ios" === uni.getSystemInfoSync().platform && "app" === uni.getSystemInfoSync().uniPlatform;
      } catch (e) {
        return !1;
      }
    }
  }, {
    key: "isUniAppAndroid",
    value: function isUniAppAndroid() {
      try {
        return "android" === uni.getSystemInfoSync().platform && "app" === uni.getSystemInfoSync().uniPlatform;
      } catch (e) {
        return !1;
      }
    }
  }, {
    key: "isCocosIOS",
    value: function isCocosIOS() {
      try {
        return "iOS" === cc.sys.os;
      } catch (e) {
        return !1;
      }
    }
  }, {
    key: "isCocosAndroid",
    value: function isCocosAndroid() {
      try {
        return "Android" === cc.sys.os;
      } catch (e) {
        return !1;
      }
    }
  }, {
    key: "isRNiOS",
    value: function isRNiOS() {
      try {
        return "ios" === i.platform.OS;
      } catch (e) {
        return !1;
      }
    }
  }, {
    key: "isRNAndroid",
    value: function isRNAndroid() {
      try {
        return "android" === i.platform.OS;
      } catch (e) {
        return !1;
      }
    }
  }], [{
    key: "currentPlatform",
    value: function currentPlatform() {
      return this.instance || (this.instance = new d()), d.instance.platform;
    }
  }]);
  return d;
}();
var h = /*#__PURE__*/(0, _createClass2.default)(function h() {
  (0, _classCallCheck2.default)(this, h);
});
h.type = l, h.current = d.currentPlatform();
var p = /*#__PURE__*/function () {
  function p() {
    (0, _classCallCheck2.default)(this, p);
  }
  (0, _createClass2.default)(p, [{
    key: "onFrontend",
    value: function onFrontend(e) {
      this.onFrontendCallback = e;
    }
  }]);
  return p;
}();
var m = /*#__PURE__*/function (_p) {
  (0, _inherits2.default)(m, _p);
  var _super = _createSuper(m);
  function m() {
    var _this;
    (0, _classCallCheck2.default)(this, m);
    _this = _super.apply(this, arguments), _this.runningBackend = !1;
    return _this;
  }
  (0, _createClass2.default)(m, [{
    key: "startCheck",
    value: function startCheck() {
      var _this2 = this;
      "object" == (typeof plus === "undefined" ? "undefined" : (0, _typeof2.default)(plus)) && (plus.globalEvent.addEventListener("resume", function () {
        _this2.runningBackend = !1, _this2.runningBackend, _this2.onFrontendCallback && _this2.onFrontendCallback();
      }, !1), plus.globalEvent.addEventListener("pause", function () {
        _this2.runningBackend = !0, _this2.runningBackend;
      }, !1));
    }
  }, {
    key: "isBackend",
    value: function isBackend() {
      return this.runningBackend;
    }
  }, {
    key: "support",
    value: function support() {
      var e = d.currentPlatform();
      return [l.UNI_IOS, l.UNI_ANDROID].includes(e);
    }
  }]);
  return m;
}(p);
var f = /*#__PURE__*/function (_p2) {
  (0, _inherits2.default)(f, _p2);
  var _super2 = _createSuper(f);
  function f() {
    var _this3;
    (0, _classCallCheck2.default)(this, f);
    _this3 = _super2.apply(this, arguments), _this3.runningBackend = !1;
    return _this3;
  }
  (0, _createClass2.default)(f, [{
    key: "startCheck",
    value: function startCheck() {
      var _this4 = this;
      wx.onAppShow(function () {
        _this4.runningBackend = !1;
      }), wx.onAppHide(function () {
        _this4.runningBackend = !0;
      });
    }
  }, {
    key: "isBackend",
    value: function isBackend() {
      return this.runningBackend;
    }
  }, {
    key: "support",
    value: function support() {
      return d.currentPlatform() === l.MP_WX;
    }
  }]);
  return f;
}(p);
var g = new ( /*#__PURE__*/function () {
  function _class2() {
    var _this5 = this;
    (0, _classCallCheck2.default)(this, _class2);
    [new m(), new f()].forEach(function (e) {
      if (e.support()) return _this5.checker = e, void _this5.checker.startCheck();
    });
  }
  (0, _createClass2.default)(_class2, [{
    key: "isBackend",
    value: function isBackend() {
      return this.checker && this.checker.isBackend();
    }
  }, {
    key: "onFrontend",
    value: function onFrontend(e) {
      this.checker.onFrontend(e);
    }
  }]);
  return _class2;
}())();
var y,
  S,
  E = Object.freeze({
    __proto__: null,
    runStatus: g
  });
!function (e) {
  e.authorize = "authorize", e.manualDisconnect = "manualDisconnect", e.subscribe = "subscribe", e.unsubscribe = "unsubscribe", e.publish = "publish", e.ack = "ack", e.historyMessages = "historyMessages", e.hereNow = "hereNow", e.hereNowByUserIds = "hereNowByUserIds", e.PUBSUB_PRESENCE_SUBSCRIBE = "PUBSUB_PRESENCE_SUBSCRIBE", e.PUBSUB_PRESENCE_UNSUBSCRIBE = "PUBSUB_PRESENCE_UNSUBSCRIBE", e.PUBSUB_PRESENCE_HERENOW = "PUBSUB_PRESENCE_HERENOW", e.imLastConversations = "imLastConversations", e.markPrivateMessageAsRead = "markPrivateMessageAsRead", e.markGroupMessageAsRead = "markGroupMessageAsRead", e.imGroupOnlineCount = "imGroupOnlineCount", e.imHereNow = "imHereNow", e.imGroupHereNow = "imGroupHereNow", e.publishIM = "publishIM", e.subscribeUserPresence = "subscribeUserPresence", e.unsubscribeUserPresence = "unsubscribeUserPresence", e.subscribeGroupPresence = "subscribeGroupPresence", e.unsubscribeGroupPresence = "unsubscribeGroupPresence", e.removeConversation = "removeConversation", e.topConversation = "topConversation", e.imData = "imData", e.subscribeGroups = "subscribeGroups", e.unsubscribeGroup = "unsubscribeGroup", e.IM_DELETE_MESSAGE = "IM_DELETE_MESSAGE", e.IM_HISTORY = "IM_HISTORY", e.IM_HISTORY_CHANGE = "IM_HISTORY_CHANGE", e.IM_RECALL_MESSAGE = "IM_RECALL_MESSAGE", e.IM_MARK_AS_READ = "IM_MARK_AS_READ", e.CS_PENDING_CONVERSATION = "CS_PENDING_CONVERSATION", e.CS_ACCEPT = "CS_ACCEPT", e.CS_END = "CS_END", e.CS_TRANSFER = "CS_TRANSFER", e.CS_AGENTS = "CS_AGENTS", e.CS_CUSTOMER_STATUS = "CS_CUSTOMER_STATUS", e.CS_MY_TEAMS = "CS_MY_TEAMS", e.CS_ONLINE = "CS_ONLINE", e.CS_OFFLINE = "CS_OFFLINE", e.CS_LIVE_SESSION = "CS_LIVE_SESSION", e.CS_QUIT_LIVE = "CS_QUIT_LIVE", e.SET_IOS_BADGE = "SET_IOS_BADGE", e.MD_CMD = "MD_CMD";
}(y || (y = {})), function (e) {
  e[e.connect = 3e3] = "connect", e[e.reconnectionDelayMax = 3e3] = "reconnectionDelayMax", e[e.commonQuerySingle = 2500] = "commonQuerySingle", e[e.commonQueryTotal = 12e3] = "commonQueryTotal", e[e.commonRequestSingle = 1700] = "commonRequestSingle", e[e.commonRequestTotal = 12e3] = "commonRequestTotal", e[e.commonInfiniteSingle = 1700] = "commonInfiniteSingle", e[e.commonInfiniteTotal = 864e5] = "commonInfiniteTotal";
}(S || (S = {}));
var v = /*#__PURE__*/function () {
  function v() {
    (0, _classCallCheck2.default)(this, v);
  }
  (0, _createClass2.default)(v, null, [{
    key: "onSuccess",
    value: function onSuccess(e, t) {
      u.isFunction(e.onSuccess) && e.onSuccess(t);
    }
  }, {
    key: "onFailed",
    value: function onFailed(e, t) {
      if (!u.isObject(e) || !u.isFunction(e.onFailed)) throw t;
      e.onFailed(t);
    }
  }]);
  return v;
}();
function b(e, t, s, i) {
  return new (s || (s = Promise))(function (n, o) {
    function r(e) {
      try {
        c(i.next(e));
      } catch (e) {
        o(e);
      }
    }
    function a(e) {
      try {
        c(i.throw(e));
      } catch (e) {
        o(e);
      }
    }
    function c(e) {
      var t;
      e.done ? n(e.value) : (t = e.value, t instanceof s ? t : new s(function (e) {
        e(t);
      })).then(r, a);
    }
    c((i = i.apply(e, t || [])).next());
  });
}
"function" == typeof SuppressedError && SuppressedError;
var C = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
function w(e) {
  if (e.__esModule) return e;
  var t = Object.defineProperty({}, "__esModule", {
    value: !0
  });
  return Object.keys(e).forEach(function (s) {
    var i = Object.getOwnPropertyDescriptor(e, s);
    Object.defineProperty(t, s, i.get ? i : {
      enumerable: !0,
      get: function get() {
        return e[s];
      }
    });
  }), t;
}
var M = {
  exports: {}
};
!function (e) {
  function t(e) {
    if (e) return function (e) {
      for (var s in t.prototype) {
        e[s] = t.prototype[s];
      }
      return e;
    }(e);
  }
  M.exports = t, t.prototype.on = t.prototype.addEventListener = function (e, t) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t), this;
  }, t.prototype.once = function (e, t) {
    function s() {
      this.off(e, s), t.apply(this, arguments);
    }
    return s.fn = t, this.on(e, s), this;
  }, t.prototype.off = t.prototype.removeListener = t.prototype.removeAllListeners = t.prototype.removeEventListener = function (e, t) {
    if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
    var s,
      i = this._callbacks["$" + e];
    if (!i) return this;
    if (1 == arguments.length) return delete this._callbacks["$" + e], this;
    for (var n = 0; n < i.length; n++) {
      if ((s = i[n]) === t || s.fn === t) {
        i.splice(n, 1);
        break;
      }
    }
    return this;
  }, t.prototype.emit = function (e) {
    this._callbacks = this._callbacks || {};
    var t = [].slice.call(arguments, 1),
      s = this._callbacks["$" + e];
    if (s) for (var i = 0, n = (s = s.slice(0)).length; i < n; ++i) {
      s[i].apply(this, t);
    }
    return this;
  }, t.prototype.listeners = function (e) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + e] || [];
  }, t.prototype.hasListeners = function (e) {
    return !!this.listeners(e).length;
  };
}();
var I = M.exports,
  N = {
    exports: {}
  },
  T = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto);
if (T) {
  var O = new Uint8Array(16);
  N.exports = function () {
    return T(O), O;
  };
} else {
  var A = new Array(16);
  N.exports = function () {
    for (var e, t = 0; t < 16; t++) {
      0 == (3 & t) && (e = 4294967296 * Math.random()), A[t] = e >>> ((3 & t) << 3) & 255;
    }
    return A;
  };
}
for (var R = [], k = 0; k < 256; ++k) {
  R[k] = (k + 256).toString(16).substr(1);
}
var P,
  _,
  D = function D(e, t) {
    var s = t || 0,
      i = R;
    return [i[e[s++]], i[e[s++]], i[e[s++]], i[e[s++]], "-", i[e[s++]], i[e[s++]], "-", i[e[s++]], i[e[s++]], "-", i[e[s++]], i[e[s++]], "-", i[e[s++]], i[e[s++]], i[e[s++]], i[e[s++]], i[e[s++]], i[e[s++]]].join("");
  },
  x = N.exports,
  U = D,
  F = 0,
  G = 0;
var L = function L(e, t, s) {
    var i = t && s || 0,
      n = t || [],
      o = (e = e || {}).node || P,
      r = void 0 !== e.clockseq ? e.clockseq : _;
    if (null == o || null == r) {
      var a = x();
      null == o && (o = P = [1 | a[0], a[1], a[2], a[3], a[4], a[5]]), null == r && (r = _ = 16383 & (a[6] << 8 | a[7]));
    }
    var c = void 0 !== e.msecs ? e.msecs : new Date().getTime(),
      u = void 0 !== e.nsecs ? e.nsecs : G + 1,
      l = c - F + (u - G) / 1e4;
    if (l < 0 && void 0 === e.clockseq && (r = r + 1 & 16383), (l < 0 || c > F) && void 0 === e.nsecs && (u = 0), u >= 1e4) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    F = c, G = u, _ = r;
    var d = (1e4 * (268435455 & (c += 122192928e5)) + u) % 4294967296;
    n[i++] = d >>> 24 & 255, n[i++] = d >>> 16 & 255, n[i++] = d >>> 8 & 255, n[i++] = 255 & d;
    var h = c / 4294967296 * 1e4 & 268435455;
    n[i++] = h >>> 8 & 255, n[i++] = 255 & h, n[i++] = h >>> 24 & 15 | 16, n[i++] = h >>> 16 & 255, n[i++] = r >>> 8 | 128, n[i++] = 255 & r;
    for (var p = 0; p < 6; ++p) {
      n[i + p] = o[p];
    }
    return t || U(n);
  },
  B = N.exports,
  q = D;
var j = function j(e, t, s) {
    var i = t && s || 0;
    "string" == typeof e && (t = "binary" === e ? new Array(16) : null, e = null);
    var n = (e = e || {}).random || (e.rng || B)();
    if (n[6] = 15 & n[6] | 64, n[8] = 63 & n[8] | 128, t) for (var o = 0; o < 16; ++o) {
      t[i + o] = n[o];
    }
    return t || q(n);
  },
  V = L,
  H = j,
  z = H;
z.v1 = V, z.v4 = H;
var W = z;
var J = /*#__PURE__*/function () {
  function J() {
    (0, _classCallCheck2.default)(this, J);
  }
  (0, _createClass2.default)(J, [{
    key: "support",
    value: function support() {
      return !0;
    }
  }, {
    key: "getParams",
    value: function getParams() {
      return this.params;
    }
  }, {
    key: "setData",
    value: function setData(e) {
      this.active = e.a, this.data = e.d;
    }
  }, {
    key: "preConnect",
    value: function preConnect(e) {}
  }, {
    key: "postConnect",
    value: function postConnect() {}
  }]);
  return J;
}();
var X = /*#__PURE__*/function () {
  function X() {
    (0, _classCallCheck2.default)(this, X);
  }
  (0, _createClass2.default)(X, null, [{
    key: "initModule",
    value: function initModule(e) {
      e.support() && this.modules.set(e.name, e);
    }
  }, {
    key: "getParams",
    value: function getParams() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var e, _iterator, _step, _step$value, _t3, _s5;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                e = {};
                _iterator = _createForOfIteratorHelper(this.modules);
                _context.prev = 2;
                _iterator.s();
              case 4:
                if ((_step = _iterator.n()).done) {
                  _context.next = 14;
                  break;
                }
                _step$value = (0, _slicedToArray2.default)(_step.value, 2), _t3 = _step$value[0], _s5 = _step$value[1];
                _context.next = 8;
                return _s5.getParams();
              case 8:
                _context.t0 = _context.sent;
                if (_context.t0) {
                  _context.next = 11;
                  break;
                }
                _context.t0 = null;
              case 11:
                e[_t3] = _context.t0;
              case 12:
                _context.next = 4;
                break;
              case 14:
                _context.next = 19;
                break;
              case 16:
                _context.prev = 16;
                _context.t1 = _context["catch"](2);
                _iterator.e(_context.t1);
              case 19:
                _context.prev = 19;
                _iterator.f();
                return _context.finish(19);
              case 22:
                return _context.abrupt("return", e);
              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 16, 19, 22]]);
      }));
    }
  }, {
    key: "setDatas",
    value: function setDatas(e) {
      var _this6 = this;
      Object.keys(e).forEach(function (t) {
        _this6.modules.get(t).setData(e[t]);
      });
    }
  }, {
    key: "preConnect",
    value: function preConnect(e) {
      this.modules.forEach(function (t, s) {
        t.preConnect(e);
      });
    }
  }, {
    key: "postConnect",
    value: function postConnect() {
      this.modules.forEach(function (e, t) {
        e.postConnect();
      });
    }
  }]);
  return X;
}();
X.Module = J, X.modules = new Map();
var $ = I;
var Q = /*#__PURE__*/function () {
  function Q() {
    (0, _classCallCheck2.default)(this, Q);
    this.emitter = new $();
  }
  (0, _createClass2.default)(Q, [{
    key: "on",
    value: function on(e, t) {
      return this.emitter.on(e, t), this;
    }
  }, {
    key: "once",
    value: function once(e, t) {
      return this.emitter.once(e, t), this;
    }
  }, {
    key: "off",
    value: function off(e, t) {
      return this.emitter.off(e, t), this;
    }
  }, {
    key: "fire",
    value: function fire(e, t) {
      return this.emitter.emit(e, t), this;
    }
  }]);
  return Q;
}();
var Y = /*#__PURE__*/function () {
  function Y() {
    (0, _classCallCheck2.default)(this, Y);
    this.eventDriver = new Q();
  }
  (0, _createClass2.default)(Y, [{
    key: "on",
    value: function on(e, t) {
      this.eventDriver.on(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      this.eventDriver.off(e, t);
    }
  }, {
    key: "fire",
    value: function fire(e, t) {
      this.eventDriver.fire(e, t);
    }
  }]);
  return Y;
}();
var K = new ( /*#__PURE__*/function () {
  function _class3() {
    (0, _classCallCheck2.default)(this, _class3);
  }
  (0, _createClass2.default)(_class3, [{
    key: "isDef",
    value: function isDef(e) {
      return !this.isUndef(e);
    }
  }, {
    key: "isUndef",
    value: function isUndef(e) {
      return null == e;
    }
  }, {
    key: "isPrimitive",
    value: function isPrimitive(e) {
      return "string" == typeof e || "number" == typeof e || "symbol" == (0, _typeof2.default)(e) || "boolean" == typeof e;
    }
  }, {
    key: "isObject",
    value: function isObject(e) {
      return null !== e && "object" == (0, _typeof2.default)(e);
    }
  }, {
    key: "isPlainObject",
    value: function isPlainObject(e) {
      return "[object Object]" === Object.prototype.toString.call(e);
    }
  }, {
    key: "isRegExp",
    value: function isRegExp(e) {
      return "[object RegExp]" === Object.prototype.toString.call(e);
    }
  }, {
    key: "isValidArrayIndex",
    value: function isValidArrayIndex(e) {
      var t = parseFloat(String(e));
      return t >= 0 && Math.floor(t) === t && isFinite(e);
    }
  }, {
    key: "isString",
    value: function isString(e) {
      return "string" == typeof e;
    }
  }, {
    key: "isNumber",
    value: function isNumber(e) {
      return "number" == typeof e;
    }
  }, {
    key: "isStringOrNumber",
    value: function isStringOrNumber(e) {
      return this.isString(e) || this.isNumber(e);
    }
  }, {
    key: "isArray",
    value: function isArray(e) {
      return "[object Array]" === Object.prototype.toString.call(e);
    }
  }, {
    key: "isEmpty",
    value: function isEmpty(e) {
      return this.isArray(e) ? 0 === e.length : this.isObject(e) ? !this.isDef(e) : !this.isNumber(e) && (this.isString(e) ? "" === e.trim() : !this.isDef(e));
    }
  }, {
    key: "isNative",
    value: function isNative(e) {
      return "function" == typeof e && /native code/.test(e.toString());
    }
  }, {
    key: "isFunction",
    value: function isFunction(e) {
      return "function" == typeof e;
    }
  }, {
    key: "isBoolean",
    value: function isBoolean(e) {
      return "boolean" == typeof e;
    }
  }, {
    key: "isTrue",
    value: function isTrue(e) {
      return !0 === e;
    }
  }, {
    key: "isFalse",
    value: function isFalse(e) {
      return !1 === e;
    }
  }, {
    key: "isNull",
    value: function isNull(e) {
      return null === e;
    }
  }]);
  return _class3;
}())();
var Z = I;
var ee = /*#__PURE__*/function () {
  function ee() {
    (0, _classCallCheck2.default)(this, ee);
    this.emitter = new Z();
  }
  (0, _createClass2.default)(ee, [{
    key: "on",
    value: function on(e, t) {
      if (!K.isString(e)) throw Error("event require a string.");
      if (!K.isFunction(t)) throw Error("callback must be a function");
      this.emitter.on(e, t);
    }
  }, {
    key: "fire",
    value: function fire(e, t) {
      this.emitter.emit(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      this.emitter.off(e, t);
    }
  }]);
  return ee;
}();
var te = /*#__PURE__*/function () {
  function te() {
    (0, _classCallCheck2.default)(this, te);
  }
  (0, _createClass2.default)(te, null, [{
    key: "init",
    value: function init(e, t, s, i, n, o) {
      this.Socket = e, this.N = t, this.Member = s, this.v = i, this.Platform = n, this.GModules = o;
    }
  }]);
  return te;
}();
var se = W;
var ie = /*#__PURE__*/function () {
  function ie() {
    (0, _classCallCheck2.default)(this, ie);
  }
  (0, _createClass2.default)(ie, null, [{
    key: "get",
    value: function get() {
      return se.v1().replace(/-/g, "");
    }
  }]);
  return ie;
}();
var ne, oe;
(oe = ne || (ne = {})).WRITE = "WRITE", oe.READ = "READ", oe.NONE = "NONE";
var re = /*#__PURE__*/function () {
  function re(e) {
    var _this7 = this;
    (0, _classCallCheck2.default)(this, re);
    this.permission = ne.NONE, this.singleTimeout = 0, this.totalTimeout = 0, this.startTime = 0, this.complete = !1, this.retried = 0, this.unique = !1, this.uuid = ie.get(), this.name = e.name, this.params = e.params, this.permission = e.permission, this.totalTimeout = e.totalTimeout, this.singleTimeout = e.singleTimeout, e.unique && (this.unique = e.unique), this.success = function (t) {
      _this7.complete || (_this7.end(), e.success(t));
    }, this.fail = function (t) {
      _this7.complete || (_this7.end(), e.fail(t));
    };
  }
  (0, _createClass2.default)(re, [{
    key: "start",
    value: function start() {
      this.startTime = Date.now(), this.initAutoTimeout();
    }
  }, {
    key: "end",
    value: function end() {
      this.complete = !0, clearTimeout(this.timeoutHandler);
    }
  }, {
    key: "initAutoTimeout",
    value: function initAutoTimeout() {
      var _this8 = this;
      this.timeoutHandler = setTimeout(function () {
        _this8.complete || _this8.fail({
          resultCode: 408,
          content: "Host unreachable or timeout"
        });
      }, this.totalTimeout);
    }
  }]);
  return re;
}();
var ae = /*#__PURE__*/function (_J) {
  (0, _inherits2.default)(ae, _J);
  var _super3 = _createSuper(ae);
  function ae() {
    (0, _classCallCheck2.default)(this, ae);
    return _super3.apply(this, arguments);
  }
  (0, _createClass2.default)(ae, [{
    key: "preConnect",
    value: function preConnect(e) {
      this.wxmpId = e.wxmpId;
    }
  }, {
    key: "getParams",
    value: function getParams() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.params = this.params || {}, this.regIdPromise)) {
                  _context2.next = 10;
                  break;
                }
                _context2.prev = 1;
                _context2.next = 4;
                return this.regIdPromise;
              case 4:
                this.params.regId = _context2.sent;
                _context2.next = 10;
                break;
              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](1);
                console.warn("Failed to register the Manufacturers Push service:" + JSON.stringify(_context2.t0));
              case 10:
                return _context2.abrupt("return", (this.params.wxmpId = this.wxmpId, this.params));
              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 7]]);
      }));
    }
  }], [{
    key: "init",
    value: function init() {
      return this.module = new ae(), this.module.name = this.GN_MODULE_NAME, this.module;
    }
  }, {
    key: "setRegId",
    value: function setRegId(e, t) {
      if (e) {
        this.module.regIdPromise = e;
        var _s6 = t;
        this.module.params = {
          v: {
            npv: _s6
          }
        };
      }
    }
  }]);
  return ae;
}(J);
ae.GN_MODULE_NAME = "GN";
var ce = /*#__PURE__*/function () {
  function ce() {
    (0, _classCallCheck2.default)(this, ce);
  }
  (0, _createClass2.default)(ce, null, [{
    key: "init",
    value: function init(e) {
      this.allowNotification = !0 === e;
      var t = ae.init();
      X.initModule(t), this.supportAppNotification() && (this.uniappPlugin = uni.requireNativePlugin("GoEasy-Uniapp"), this.uniappPlugin ? (this.regIdPromise = this.askRegId(), this.v = this.uniappPlugin.v(), ae.setRegId(this.regIdPromise, this.v)) : console.warn("No GoEasy-Uniapp Native Plugin."), this.setClientBadge(0));
    }
  }, {
    key: "addAssembler",
    value: function addAssembler(e) {
      this.payloadAssemblers.push(e);
    }
  }, {
    key: "assemblePayload",
    value: function assemblePayload(e) {
      var t = this.payloadAssemblers.find(function (t) {
        return t.support(e);
      });
      return t ? t.assemble(e) : e;
    }
  }, {
    key: "createLocalNotification",
    value: function createLocalNotification(e, t, s, i, n) {
      g.isBackend() && (s.g = 1, "undefined" != typeof plus && (i ? (this.uniappPlugin && this.uniappPlugin.playSound(i), plus.push.createMessage(t, JSON.stringify(s), {
        title: e,
        sound: "none"
      })) : plus.push.createMessage(t, JSON.stringify(s), {
        title: e
      }), "+1" === n && this.setClientBadge(ce.badge + 1)));
    }
  }, {
    key: "setBadge",
    value: function setBadge(e) {
      var _this9 = this;
      if (!Number.isInteger(e.badge) || e.badge < 0) v.onFailed(e, "badge must be an integer greater than or equal to 0.");else if (ce.supportAppNotification()) if (this.uniappPlugin && d.currentPlatform() === l.UNI_IOS) {
        var _t4 = new re({
          name: y.SET_IOS_BADGE,
          params: {
            badge: e.badge
          },
          unique: !0,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          permission: ne.WRITE,
          success: function success() {
            v.onSuccess(e), _this9.setClientBadge(e.badge);
          },
          fail: function fail(t) {
            v.onFailed(e, t.content);
          }
        });
        te.Socket.e(_t4);
      } else v.onSuccess(e), this.setClientBadge(e.badge);
    }
  }, {
    key: "setClientBadge",
    value: function setClientBadge(e) {
      "vivo" !== plus.device.vendor && (ce.badge = e, plus.runtime.setBadgeNumber(e));
    }
  }, {
    key: "askRegId",
    value: function askRegId() {
      var _this10 = this;
      var e = null,
        t = 0;
      var s = function s() {
        return new Promise(function (i, n) {
          _this10.uniappPlugin.regId(function (e) {
            i(e);
          }, function (i) {
            if (!(1e6 === i.data.code && t <= 10)) return clearTimeout(e), n(i);
            e = setTimeout(function () {
              t++, _this10.regIdPromise = s();
            }, 3500);
          });
        });
      };
      return s();
    }
  }, {
    key: "getRegIdPromise",
    value: function getRegIdPromise() {
      return this.regIdPromise;
    }
  }, {
    key: "supportAppNotification",
    value: function supportAppNotification() {
      var e = d.currentPlatform();
      return this.allowNotification && (e === l.UNI_ANDROID || e === l.UNI_IOS);
    }
  }, {
    key: "listenPlusClickNotification",
    value: function listenPlusClickNotification() {
      var _this11 = this;
      plus.push.addEventListener("click", function (e) {
        try {
          if (e) {
            var _t5 = "string" == typeof e.payload ? JSON.parse(e.payload) : e.payload;
            if (_this11.availableIntent(_t5)) {
              var _e3 = _this11.assemblePayload(_t5);
              plus.push.clear(), _this11.onClickNotificationCallback(_e3);
            }
          }
        } catch (e) {}
      });
    }
  }, {
    key: "availableIntent",
    value: function availableIntent(e) {
      return e && Object.keys(e).length && e.g && 1 === parseInt(e.g);
    }
  }, {
    key: "getIntentData",
    value: function getIntentData() {
      var _this12 = this;
      this.uniappPlugin.getIntentData(function (e) {
        if (!_this12.availableIntent(e)) return;
        var t = _this12.assemblePayload(e);
        var s = d.currentPlatform();
        plus.push.clear(), s === l.UNI_ANDROID && _this12.uniappPlugin.clearAll(), _this12.onClickNotificationCallback(t);
      });
    }
  }, {
    key: "listenClick",
    value: function listenClick() {
      var _this13 = this;
      this.listenPlusClickNotification();
      var e = d.currentPlatform();
      this.uniappPlugin && e === l.UNI_ANDROID && (this.getIntentData(), g.onFrontend(function () {
        _this13.getIntentData();
      }));
    }
  }, {
    key: "onClickNotification",
    value: function onClickNotification(e) {
      if (ce.supportAppNotification()) {
        if (!u.isFunction(e)) throw new Error("The arguments must be a function.");
        null === this.onClickNotificationCallback ? (this.onClickNotificationCallback = e, this.listenClick()) : console.warn("The onClickNotification event has been listened on. Please do not listen to it more than once.");
      } else console.warn("The current environment doesn't support or allowNotification is false.");
    }
  }]);
  return ce;
}();
function ue() {}
ce.uniappPlugin = null, ce.v = null, ce.regIdPromise = null, ce.onClickNotificationCallback = null, ce.payloadAssemblers = new Array();
var le = new ( /*#__PURE__*/function () {
  function _class4() {
    (0, _classCallCheck2.default)(this, _class4);
  }
  (0, _createClass2.default)(_class4, [{
    key: "validateId",
    value: function validateId(e, t) {
      if (u.isEmpty(e)) throw {
        code: 400,
        content: " ".concat(t, " is required.")
      };
      if (!u.isString(e)) throw {
        code: 400,
        content: "TypeError: ".concat(t, " require string.")
      };
    }
  }, {
    key: "validateIdArray",
    value: function validateIdArray(e, t) {
      if (!Array.isArray(e) || 0 === e.length) throw {
        code: 400,
        content: "TypeError: ".concat(t, " require array.")
      };
      if (e.length > 100) throw {
        code: 400,
        content: "".concat(t, " is over max length 100.")
      };
      for (var _s7 = 0; _s7 < e.length; _s7++) {
        if (!u.isStringOrNumber(e[_s7])) throw {
          code: 400,
          content: "TypeError: ".concat(t, " item require string or number.")
        };
        if (u.isNumber(e[_s7]) && (e[_s7] = e[_s7].toString()), 0 == e[_s7].length) throw {
          code: 400,
          content: "".concat(t, " has empty item.")
        };
      }
      if (Array.from(new Set(e)).length < e.length) throw {
        code: 400,
        content: "Duplicate element in ".concat(t)
      };
    }
  }, {
    key: "validateChannel",
    value: function validateChannel(e, t) {
      if (u.isEmpty(e)) throw {
        code: 400,
        content: " ".concat(t, " is required.")
      };
      if (!u.isStringOrNumber(e)) throw {
        code: 400,
        content: "TypeError: ".concat(t, " require string or number.")
      };
    }
  }, {
    key: "validateChannelArray",
    value: function validateChannelArray(e, t) {
      this.validateIdArray(e, t);
    }
  }, {
    key: "validateChannelAndChannels",
    value: function validateChannelAndChannels(e, t) {
      var s = !u.isEmpty(e),
        i = !u.isEmpty(t);
      if (!s && !i) throw {
        code: 400,
        content: "channel is required."
      };
      if (s && i) throw {
        code: 400,
        content: "subscribe to either channel or channels, not both."
      };
      s && this.validateChannel(e, "channel"), i && this.validateChannelArray(t, "channels");
    }
  }, {
    key: "validateCallbackOptions",
    value: function validateCallbackOptions(e) {
      if (!u.isObject(e)) throw {
        code: 400,
        content: "bad parameters"
      };
    }
  }, {
    key: "validateNotification",
    value: function validateNotification(e) {
      function t(e, t, s) {
        if (!(u.isString(e[t]) && e[t].length <= s)) throw {
          code: 400,
          content: "notification.".concat(t, " must be a string of no more than ").concat(s, " characters")
        };
      }
      function s(e, t, s, i) {
        var n = e[t];
        if (u.isObject(n) && u.isDef(n[s])) {
          var _e4 = {
              code: 400,
              content: "notification.vendorOptions.".concat(t, ".").concat(s, " require a ").concat(i, "}")
            },
            _o2 = n[s];
          if ("string" === i && !u.isString(_o2)) throw _e4;
          if ("number" === i && !u.isNumber(_o2)) throw _e4;
        }
      }
      if (!u.isObject(e)) throw {
        code: 400,
        content: "TypeError: notification requires an object."
      };
      {
        if (t(e, "title", 32), t(e, "body", 50), u.isDef(e.sound) && !u.isString(e.sound)) throw {
          code: 400,
          content: "notification.sound must be a string"
        };
        if (u.isDef(e.badge) && !u.isString(e.badge)) throw {
          code: 400,
          content: "notification.badge must be a string"
        };
        e.badge = e.badge || "0";
        var _i4 = e.vendorOptions;
        u.isObject(_i4) && (s(_i4, "huawei", "category", "string"), s(_i4, "xiaomi", "channel_id", "string"), s(_i4, "oppo", "channel_id", "string"), s(_i4, "vivo", "classification", "number"), s(_i4, "vivo", "category", "string"));
      }
    }
  }, {
    key: "validateValIsEmpty",
    value: function validateValIsEmpty(e, t) {
      if (u.isUndef(e) || u.isEmpty(e)) throw {
        code: 400,
        content: "".concat(t, " is empty")
      };
    }
  }, {
    key: "validateWXMPTemplateMsg",
    value: function validateWXMPTemplateMsg(e) {
      if (u.isObject(e)) {
        if (!u.isString(e.template_id)) throw {
          code: 400,
          content: "template_id must be string."
        };
        if (!u.isEmpty(e.url) && !u.isString(e.url)) throw {
          code: 400,
          content: "url must be string"
        };
        if (!(u.isEmpty(e.miniprogram) || u.isString(e.miniprogram.appid) && u.isString(e.miniprogram.pagepath))) throw {
          code: 400,
          content: "miniprogram.appid and miniprogram.pagepath must be strings."
        };
        if (!u.isObject(e.data)) throw {
          code: 400,
          content: "data requires an object."
        };
      } else if (u.isPrimitive(e)) throw {
        code: 400,
        content: "wxmpTemplateMsg must be an object."
      };
    }
  }, {
    key: "validateObject",
    value: function validateObject(e, t) {
      if (u.isUndef(e) || !u.isObject(e)) throw {
        code: 400,
        content: t + " must be an object."
      };
    }
  }, {
    key: "validateString",
    value: function validateString(e, t) {
      if (u.isUndef(e) || !u.isString(e)) throw {
        code: 400,
        content: t + " must be a string."
      };
    }
  }]);
  return _class4;
}())();
function de(e) {
  if (null === e || "object" != (0, _typeof2.default)(e) || "isActiveClone" in e) return e;
  var t = e instanceof Array ? [] : {};
  for (var _s8 in e) {
    "object" == (0, _typeof2.default)(e[_s8]) ? t[_s8] = de(e[_s8]) : t[_s8] = e[_s8];
  }
  return t;
}
var he = /*#__PURE__*/function () {
  function he() {
    (0, _classCallCheck2.default)(this, he);
  }
  (0, _createClass2.default)(he, [{
    key: "publish",
    value: function publish(e) {
      u.isFunction(e.onFailed) || (e.onFailed = ue), u.isFunction(e.onSuccess) || (e.onSuccess = ue), this.validate(e), e.channel = e.channel.toString();
      var t = {
        channel: e.channel,
        content: e.message,
        nt: e.notification,
        at: e.accessToken,
        guid: ie.get(),
        q: e.qos
      };
      e.wxmpTemplateMsg && (t.wxmpTemplateMsg = de(e.wxmpTemplateMsg), t.wxmpTemplateMsg.data = JSON.stringify(t.wxmpTemplateMsg.data));
      var s = new re({
        name: y.publish,
        params: t,
        unique: !0,
        singleTimeout: S.commonRequestSingle,
        totalTimeout: S.commonRequestTotal,
        permission: ne.WRITE,
        success: function success(t) {
          e.onSuccess({
            code: 200,
            content: "ok"
          });
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode,
            content: t.content
          });
        }
      });
      te.Socket.e(s);
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (le.validateChannel(e.channel, "channel"), u.isEmpty(e.message)) throw {
        code: 400,
        content: "message is required."
      };
      if (!u.isString(e.message)) throw {
        code: 400,
        content: "TypeError: message requires string."
      };
      if (e.message.length > 1e4) throw {
        code: 400,
        content: "Message over max length 10000."
      };
      if (e.qos && !(e.qos in [0, 1])) throw {
        code: 400,
        content: "Qos must be 0 or 1."
      };
      e.wxmpTemplateMsg && le.validateWXMPTemplateMsg(e.wxmpTemplateMsg), u.isDef(e.notification) && le.validateNotification(e.notification);
    }
  }]);
  return he;
}();
var pe = /*#__PURE__*/(0, _createClass2.default)(function pe(e) {
  (0, _classCallCheck2.default)(this, pe);
  if (this.options = e, this.channels = e.channels || [e.channel], !u.isEmpty(e.channel)) {
    var _t6 = e.channel.toString();
    this.channels = [_t6];
  }
  u.isEmpty(e.channels) || (this.channels = e.channels.toString().split(","));
});
var me, fe, ge;
!function (e) {
  e.message = "message", e.imMessage = "imMessage", e.userPresence = "userPresence", e.groupPresence = "groupPresence", e.PS_PRESENCE_EVENT = "PS_PRESENCE_EVENT", e.IM_MSG_READ = "IM_MSG_READ", e.IM_MSG_DELETED = "IM_MSG_DELETED", e.IM_MSG_RECALLED = "IM_MSG_RECALLED", e.CS_ONLINE_CHANGED = "CS_ONLINE_CHANGED";
}(me || (me = {})), function (e) {
  e.CONNECTED = "CONNECTED", e.RECONNECTED = "RECONNECTED", e.DISCONNECTED = "DISCONNECTED", e.LOST = "LOST", e.EXPIRED_RECONNECTED = "EXPIRED_RECONNECTED", e.NEW_MESSAGE = "NEW_MESSAGE", e.CONNECTING = "CONNECTING";
}(fe || (fe = {}));
var ye = /*#__PURE__*/function () {
  function ye() {
    (0, _classCallCheck2.default)(this, ye);
    this.subscriptions = [], te.Socket.onMessage(me.message, this.onNewMessage.bind(this)), te.Socket.on(fe.EXPIRED_RECONNECTED, this.expiredResubscribe.bind(this)), te.Socket.on(fe.RECONNECTED, this.resubscribePresenceChannel.bind(this));
  }
  (0, _createClass2.default)(ye, [{
    key: "expiredResubscribe",
    value: function expiredResubscribe() {
      var _this14 = this;
      this.subscriptions.forEach(function (e) {
        _this14.doSubscribe(e, !1);
      });
    }
  }, {
    key: "resubscribePresenceChannel",
    value: function resubscribePresenceChannel() {
      var _this15 = this;
      this.subscriptions.forEach(function (e) {
        var t = e.options;
        t.presence && t.presence.enable && _this15.doSubscribe(e, !0);
      });
    }
  }, {
    key: "onNewMessage",
    value: function onNewMessage(e) {
      if (e.n.indexOf("_presence") > -1) return;
      e.a && te.Socket.sendAck("ack", {
        i: e.i,
        c: e.n
      });
      var t = {
        time: e.t,
        channel: e.n,
        content: e.c
      };
      this.createNotification(e), this.findSubscriptionByChannel(t.channel).options.onMessage(t);
    }
  }, {
    key: "createNotification",
    value: function createNotification(e) {
      var t = te.N.supportAppNotification();
      if (!u.isObject(e.nt) || !t) return;
      var s = {
        ch: e.n,
        ctt: e.c
      };
      te.N.createLocalNotification(e.nt.t, e.nt.c, s, e.nt.sound, e.nt.badge);
    }
  }, {
    key: "subscribe",
    value: function subscribe(e) {
      var _this16 = this;
      if (le.validateChannelAndChannels(e.channel, e.channels), u.isDef(e.presence)) {
        var _t7 = e.presence.enable;
        if (!u.isBoolean(_t7)) throw {
          code: 400,
          content: "Subscription failed. presence.enable must be a boolean"
        };
        if (_t7 && !te.Socket.user().id) throw {
          code: 400,
          content: "Subscription failed. If presence is enable, the id must be specified when calling the connect method"
        };
      }
      var t = new pe(e);
      this.doSubscribe(t, !1).then(function () {
        _this16.subscriptions.push(t), v.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }).catch(function (t) {
        v.onFailed(e, {
          code: t.resultCode,
          content: t.content
        });
      });
    }
  }, {
    key: "doSubscribe",
    value: function doSubscribe(e, t) {
      var s = e.options;
      return new Promise(function (i, n) {
        var o = new re({
          name: y.subscribe,
          permission: ne.READ,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          params: {
            channels: e.channels,
            accessToken: s.accessToken,
            presence: s.presence,
            resubscribe: t
          },
          success: function success() {
            i();
          },
          fail: function fail(e) {
            n(e);
          }
        });
        te.Socket.e(o);
      });
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(e) {
      var _this17 = this;
      le.validateChannel(e.channel, "channel"), e.channel = e.channel.toString();
      var t = this.findSubscriptionByChannel(e.channel);
      if (!t) return void e.onFailed({
        code: 400,
        content: "channel[" + e.channel + "] is not subscribed"
      });
      var s = new re({
        name: y.unsubscribe,
        params: {
          channel: e.channel,
          presence: t.options.presence
        },
        permission: ne.READ,
        singleTimeout: S.commonRequestSingle,
        totalTimeout: S.commonRequestTotal,
        success: function success() {
          e.onSuccess({
            code: 200,
            content: "ok"
          }), _this17.removeChannel(e.channel);
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode,
            content: t.content
          });
        }
      });
      te.Socket.e(s);
    }
  }, {
    key: "removeChannel",
    value: function removeChannel(e) {
      for (var _t8 = this.subscriptions.length - 1; _t8 >= 0; _t8--) {
        var _s9 = this.subscriptions[_t8].channels,
          _i5 = _s9.indexOf(e);
        if (_i5 > -1) {
          _s9.splice(_i5, 1), 0 === _s9.length && this.subscriptions.splice(_t8, 1);
          break;
        }
      }
    }
  }, {
    key: "findSubscriptionByChannel",
    value: function findSubscriptionByChannel(e) {
      var t = !1,
        s = null;
      for (var _i6 = this.subscriptions.length - 1; _i6 >= 0; _i6--) {
        var _n2 = this.subscriptions[_i6].channels;
        for (var _o3 = 0; _o3 < _n2.length; _o3++) {
          if (_n2[_o3] == e) {
            t = !0, s = this.subscriptions[_i6];
            break;
          }
        }
        if (t) break;
      }
      return s;
    }
  }]);
  return ye;
}();
var Se = /*#__PURE__*/function () {
  function Se() {
    (0, _classCallCheck2.default)(this, Se);
  }
  (0, _createClass2.default)(Se, [{
    key: "get",
    value: function get(e) {
      u.isFunction(e.onSuccess) || (e.onSuccess = ue), u.isFunction(e.onFailed) || (e.onFailed = ue), le.validateChannel(e.channel, "channel"), e.channel = e.channel.toString();
      var t = new re({
        name: y.historyMessages,
        permission: ne.READ,
        params: e,
        singleTimeout: S.commonQuerySingle,
        totalTimeout: S.commonQueryTotal,
        success: function success(t) {
          e.onSuccess({
            code: t.resultCode || t.code || 200,
            content: t.content
          });
        },
        fail: function fail(t) {
          e.onFailed({
            code: t.resultCode || t.code,
            content: t.content
          });
        }
      });
      te.Socket.e(t);
    }
  }]);
  return Se;
}();
var Ee = /*#__PURE__*/function () {
  function Ee() {
    var _this18 = this;
    (0, _classCallCheck2.default)(this, Ee);
    this.channelPresenceMap = new Map(), this.onPresenceEvent = function (e) {
      var t = _this18.channelPresenceMap.get(e.channel);
      null == t || t.onPresence(e);
    }, this.expireAllChannelPresences = function () {
      _this18.channelPresenceMap.forEach(function (e, t) {
        e.expire();
      });
    }, this.resubscribe = function () {
      _this18.channelPresenceMap.forEach(function (e, t) {
        e.subscribed() && e.doSubscribe();
      });
    }, te.Socket.on(fe.LOST, this.expireAllChannelPresences), te.Socket.on(fe.RECONNECTED, this.resubscribe), te.Socket.onMessage(me.PS_PRESENCE_EVENT, this.onPresenceEvent);
  }
  (0, _createClass2.default)(Ee, [{
    key: "hereNow",
    value: function hereNow(e) {
      le.validateChannel(e.channel, "channel");
      var t,
        s = this.channelPresenceMap.get(e.channel.toString());
      s && s.queryPromise ? (e.limit && e.limit > s.membersLimit && s.doQuery(e.limit), t = s.queryPromise) : t = be(e.channel, e.limit), t.then(function (t) {
        e.onSuccess(t);
      }).catch(function (t) {
        e.onFailed(t);
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(e) {
      if (le.validateChannel(e.channel, "channel"), u.isUndef(e.onPresence) || !u.isFunction(e.onPresence)) throw {
        code: 400,
        content: "Subscription Presence failed. onPresence callback function is required"
      };
      var t = e.channel.toString(),
        s = this.channelPresenceMap.get(t);
      s || (s = new ve(t), this.channelPresenceMap.set(t, s)), s.subscribe(e);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(e) {
      var _this19 = this;
      le.validateChannel(e.channel, "channel");
      var t = e.channel.toString();
      if (this.channelPresenceMap.get(t)) {
        var _s10 = new re({
          name: y.PUBSUB_PRESENCE_UNSUBSCRIBE,
          permission: ne.READ,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          params: {
            channel: t
          },
          success: function success(s) {
            _this19.channelPresenceMap.delete(t), e.onSuccess();
          },
          fail: function fail(t) {
            e.onFailed(t);
          }
        });
        te.Socket.e(_s10);
      } else e.onSuccess();
    }
  }]);
  return Ee;
}();
var ve = /*#__PURE__*/function () {
  function ve(e) {
    (0, _classCallCheck2.default)(this, ve);
    this.membersLimit = 10, this.queried = !1, this.channel = e;
  }
  (0, _createClass2.default)(ve, [{
    key: "onPresence",
    value: function onPresence(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.queried) {
                  _context3.next = 4;
                  break;
                }
                this.update(e);
                _context3.next = 6;
                break;
              case 4:
                _context3.next = 6;
                return this.queryPromise;
              case 6:
                this.on({
                  channel: this.channel,
                  action: e.action,
                  member: e.member,
                  time: e.time,
                  amount: this.amount,
                  members: this.membersByLimit()
                });
              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
    }
  }, {
    key: "membersByLimit",
    value: function membersByLimit() {
      return this.members.slice(0, this.membersLimit);
    }
  }, {
    key: "subscribe",
    value: function subscribe(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(e.membersLimit && (this.membersLimit = Math.min(e.membersLimit, 300)), !this.subscribed())) {
                  _context4.next = 9;
                  break;
                }
                _context4.prev = 1;
                _context4.next = 4;
                return this.doSubscribe();
              case 4:
                _context4.next = 9;
                break;
              case 6:
                _context4.prev = 6;
                _context4.t0 = _context4["catch"](1);
                return _context4.abrupt("return", void e.onFailed(_context4.t0));
              case 9:
                this.on = e.onPresence, e.onSuccess();
              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 6]]);
      }));
    }
  }, {
    key: "doSubscribe",
    value: function doSubscribe() {
      var _this20 = this;
      return this.doQuery(this.membersLimit), new Promise(function (e, t) {
        var s = new re({
          name: y.PUBSUB_PRESENCE_SUBSCRIBE,
          permission: ne.READ,
          params: {
            channel: _this20.channel
          },
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          success: function success(t) {
            e();
          },
          fail: function fail(e) {
            t(e);
          }
        });
        te.Socket.e(s);
      });
    }
  }, {
    key: "doQuery",
    value: function doQuery(e) {
      var _this21 = this;
      this.queryPromise = be(this.channel, e), this.queryPromise.then(function (e) {
        _this21.members = e.content.members, _this21.amount = e.content.amount, _this21.queried = !0;
      }).catch(function (e) {
        throw e;
      });
    }
  }, {
    key: "update",
    value: function update(e) {
      if (["join", "back"].includes(e.action)) this.members.unshift(e.member);else if (["leave", "timeout"].includes(e.action)) {
        var _t9 = this.members.findIndex(function (t) {
          return t.id === e.member.id;
        });
        _t9 > -1 && this.members.splice(_t9, 1);
      }
      this.amount = e.amount;
    }
  }, {
    key: "expire",
    value: function expire() {
      this.queried = !1, this.queryPromise = null;
    }
  }, {
    key: "subscribed",
    value: function subscribed() {
      return void 0 !== this.on;
    }
  }]);
  return ve;
}();
function be(e, t) {
  return t || (t = 10), new Promise(function (s, i) {
    var n = {
        channel: e,
        limit: t
      },
      o = new re({
        name: y.PUBSUB_PRESENCE_HERENOW,
        permission: ne.READ,
        params: n,
        singleTimeout: S.commonQuerySingle,
        totalTimeout: S.commonQueryTotal,
        success: function success(e) {
          s(e);
        },
        fail: function fail(e) {
          i(e);
        }
      });
    te.Socket.e(o);
  });
}
var Ce = /*#__PURE__*/function () {
  function Ce() {
    (0, _classCallCheck2.default)(this, Ce);
    this.publisher = new he(), this.subscriber = new ye(), this.presence2 = new Ee(), this.histories = new Se();
  }
  (0, _createClass2.default)(Ce, [{
    key: "publish",
    value: function publish(e) {
      this.publisher.publish(e);
    }
  }, {
    key: "subscribe",
    value: function subscribe(e) {
      this.subscriber.subscribe(e);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(e) {
      this.subscriber.unsubscribe(e);
    }
  }, {
    key: "subscribePresence",
    value: function subscribePresence(e) {
      this.presence2.subscribe(e);
    }
  }, {
    key: "unsubscribePresence",
    value: function unsubscribePresence(e) {
      this.presence2.unsubscribe(e);
    }
  }, {
    key: "history",
    value: function history(e) {
      this.histories.get(e);
    }
  }, {
    key: "hereNow",
    value: function hereNow(e) {
      this.presence2.hereNow(e);
    }
  }], [{
    key: "init",
    value: function init() {
      this.instance = new Ce();
    }
  }]);
  return Ce;
}();
var we = /*#__PURE__*/function (_J2) {
  (0, _inherits2.default)(we, _J2);
  var _super4 = _createSuper(we);
  function we() {
    (0, _classCallCheck2.default)(this, we);
    return _super4.apply(this, arguments);
  }
  (0, _createClass2.default)(we, [{
    key: "postConnect",
    value: function postConnect() {
      Ce.init();
    }
  }], [{
    key: "init",
    value: function init() {
      return this.module = new we(), this.module.name = this.GWS_MODULE_NAME, this.initGN(), this.module;
    }
  }, {
    key: "initGN",
    value: function initGN() {
      ce.addAssembler(new ( /*#__PURE__*/function () {
        function _class5() {
          (0, _classCallCheck2.default)(this, _class5);
        }
        (0, _createClass2.default)(_class5, [{
          key: "assemble",
          value: function assemble(e) {
            return {
              channel: e.ch,
              content: e.ctt
            };
          }
        }, {
          key: "support",
          value: function support(e) {
            return !!e.ch;
          }
        }]);
        return _class5;
      }())());
    }
  }, {
    key: "check",
    value: function check() {
      if (!this.module) throw {
        code: 400,
        content: "PubSub not initialized. Please include 'PUBSUB' in the 'modules' during GoEasy initialization."
      };
    }
  }]);
  return we;
}(J);
we.GWS_MODULE_NAME = "GWS";
var Me = /*#__PURE__*/(0, _createClass2.default)(function Me() {
  (0, _classCallCheck2.default)(this, Me);
});
!function (e) {
  e.aliYun = "ALI", e.qiNiu = "QN", e.tencent = "TX", e.s3 = "S3";
}(ge || (ge = {}));
var Ie = new ( /*#__PURE__*/function (_Me) {
  (0, _inherits2.default)(_class6, _Me);
  var _super5 = _createSuper(_class6);
  function _class6() {
    (0, _classCallCheck2.default)(this, _class6);
    return _super5.call(this);
  }
  (0, _createClass2.default)(_class6, [{
    key: "upload",
    value: function upload(e, t) {
      var _this22 = this;
      try {
        return e.storageLocation === ge.s3 ? this.uploadToS3(e, t) : (delete e.parameters.fileRes, new Promise(function (s, i) {
          uni.uploadFile({
            url: e.host,
            filePath: _this22.getTempFilePath(e),
            name: "file",
            formData: e.parameters,
            success: function success(e) {
              200 === e.statusCode ? s() : i({
                code: e.statusCode,
                content: e.errMsg
              });
            },
            fail: function fail(e) {
              i({
                code: 500,
                content: e.errMsg
              });
            }
          }).onProgressUpdate(function (e) {
            t && t(e);
          });
        }));
      } catch (e) {
        return new Promise(function (t, s) {
          s({
            code: 500,
            content: e
          });
        });
      }
    }
  }, {
    key: "getTempFilePath",
    value: function getTempFilePath(e) {
      var t = e.file;
      return t.tempFilePath || t.fullPath || t.path;
    }
  }, {
    key: "uploadToS3",
    value: function uploadToS3(e, t) {
      var _this23 = this;
      return new Promise(function (t, s) {
        return b(_this23, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee5() {
          var i;
          return _regenerator.default.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.next = 2;
                  return this.fileToArrayBuffer(e);
                case 2:
                  i = _context5.sent;
                  uni.request({
                    url: e.url,
                    method: "PUT",
                    header: e.headers,
                    data: i,
                    success: function success(i) {
                      200 === i.statusCode ? (e.storageLocation === ge.s3 && (e.url = e.url.split("?")[0]), t()) : s({
                        code: i.statusCode,
                        content: i.errMsg
                      });
                    },
                    fail: function fail(e) {
                      s({
                        code: 500,
                        content: e.errMsg
                      });
                    }
                  });
                case 4:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, this);
        }));
      });
    }
  }, {
    key: "fileToArrayBuffer",
    value: function fileToArrayBuffer(e) {
      var _this24 = this;
      return new Promise(function (t, s) {
        var i = _this24.getTempFilePath(e);
        if ("undefined" != typeof plus) plus.io.resolveLocalFileSystemURL(i, function (e) {
          e.file(function (e) {
            var i = new plus.io.FileReader();
            i.onloadend = function (e) {
              var s = uni.base64ToArrayBuffer(e.target.result.split(",")[1]);
              t(s);
            }, i.onerror = function (e) {
              s(e);
            }, i.readAsDataURL(e);
          });
        }, function (e) {
          s("Resolve file URL failed: " + e.message);
        });else if ("undefined" != typeof FileReader) {
          var _i7 = new FileReader();
          _i7.onload = function () {
            t(_i7.result);
          }, _i7.onerror = function (e) {
            s(e);
          }, _i7.readAsArrayBuffer(e.file);
        } else if ("object" == (typeof wx === "undefined" ? "undefined" : (0, _typeof2.default)(wx)) && wx.canIUse("getFileSystemManager")) try {
          var _e5 = wx.getFileSystemManager().readFileSync(i);
          t(_e5);
        } catch (e) {
          s(e);
        }
      });
    }
  }]);
  return _class6;
}(Me))();
var Ne = new ( /*#__PURE__*/function (_Me2) {
  (0, _inherits2.default)(_class7, _Me2);
  var _super6 = _createSuper(_class7);
  function _class7() {
    (0, _classCallCheck2.default)(this, _class7);
    return _super6.apply(this, arguments);
  }
  (0, _createClass2.default)(_class7, [{
    key: "upload",
    value: function upload(e, t) {
      var _this25 = this;
      try {
        return e.storageLocation === ge.s3 ? this.uploadToS3(e, t) : new Promise(function (s, i) {
          wx.uploadFile({
            url: e.host,
            filePath: _this25.getTempFilePath(e),
            name: "file",
            formData: e.parameters,
            success: function success(e) {
              200 === e.statusCode ? s() : i({
                code: e.statusCode,
                content: e.errMsg
              });
            },
            fail: function fail(e) {
              i({
                code: 500,
                content: e.errMsg
              });
            }
          }).onProgressUpdate(function (e) {
            t && t(e);
          });
        });
      } catch (e) {
        return new Promise(function (t, s) {
          s({
            code: 500,
            content: e
          });
        });
      }
    }
  }, {
    key: "getTempFilePath",
    value: function getTempFilePath(e) {
      var t = e.file || e.fileRes;
      return t.path || t.tempFilePath;
    }
  }, {
    key: "uploadToS3",
    value: function uploadToS3(e, t) {
      var _this26 = this;
      return new Promise(function (t, s) {
        return b(_this26, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee6() {
          var i;
          return _regenerator.default.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return this.fileToArrayBuffer(this.getTempFilePath(e));
                case 2:
                  i = _context6.sent;
                  wx.request({
                    url: e.url,
                    method: "PUT",
                    header: e.headers,
                    data: i,
                    success: function success(i) {
                      200 === i.statusCode ? (e.storageLocation === ge.s3 && (e.url = e.url.split("?")[0]), t()) : s({
                        code: i.statusCode,
                        content: i.errMsg
                      });
                    },
                    fail: function fail(e) {
                      s({
                        code: 500,
                        content: e.errMsg
                      });
                    }
                  });
                case 4:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, this);
        }));
      });
    }
  }, {
    key: "fileToArrayBuffer",
    value: function fileToArrayBuffer(e) {
      return new Promise(function (t, s) {
        try {
          var _s11 = wx.getFileSystemManager();
          t(_s11.readFileSync(e));
        } catch (e) {
          s(e);
        }
      });
    }
  }]);
  return _class7;
}(Me))();
var Te = new ( /*#__PURE__*/function (_Me3) {
  (0, _inherits2.default)(_class8, _Me3);
  var _super7 = _createSuper(_class8);
  function _class8() {
    (0, _classCallCheck2.default)(this, _class8);
    return _super7.call(this);
  }
  (0, _createClass2.default)(_class8, [{
    key: "upload",
    value: function upload(e, t) {
      return new Promise(function (s, i) {
        try {
          var _n3 = new XMLHttpRequest(),
            _o4 = e.storageLocation === ge.s3,
            _r = _o4 ? "PUT" : "POST",
            _a = _o4 ? e.url : e.host;
          _n3.open(_r, _a, !0);
          for (var _t10 in e.headers) {
            _n3.setRequestHeader(_t10, e.headers[_t10]);
          }
          _n3.upload.onprogress = function (e) {
            t && t(e);
          }, _n3.upload.onloadstart = function (e) {
            t && t(e);
          }, _n3.upload.onloadend = function (e) {
            t && t(e);
          };
          var _c = new FormData();
          for (var _t11 in e.parameters) {
            "fileRes" == _t11 ? _c.append("file", e.parameters[_t11]) : _c.append(_t11, e.parameters[_t11]);
          }
          var _u = _o4 ? e.file : _c;
          _n3.send(_u), _n3.onreadystatechange = function () {
            4 == _n3.readyState && (_n3.status >= 200 && _n3.status < 300 || 304 == _n3.status ? (_o4 && (e.url = e.url.split("?")[0]), s()) : i({
              code: _n3.status,
              content: _n3.responseText
            }));
          };
        } catch (e) {
          i({
            code: 500,
            content: e
          });
        }
      });
    }
  }, {
    key: "fileToArrayBuffer",
    value: function fileToArrayBuffer(e) {
      return new Promise(function (t, s) {
        var i = new FileReader();
        i.onload = function () {
          t(i.result);
        }, i.onerror = function (e) {
          s(e);
        }, i.readAsArrayBuffer(e);
      });
    }
  }]);
  return _class8;
}(Me))();
var Oe = new ( /*#__PURE__*/function (_Me4) {
  (0, _inherits2.default)(_class9, _Me4);
  var _super8 = _createSuper(_class9);
  function _class9() {
    (0, _classCallCheck2.default)(this, _class9);
    return _super8.apply(this, arguments);
  }
  (0, _createClass2.default)(_class9, [{
    key: "upload",
    value: function upload(e, t) {
      var _this27 = this;
      try {
        return e.storageLocation === ge.s3 ? this.uploadToS3(e, t) : (delete e.parameters.fileRes, new Promise(function (s, i) {
          my.uploadFile({
            url: e.host,
            filePath: _this27.getTempFilePath(e),
            fileType: "image",
            name: "file",
            formData: e.parameters,
            success: function success(e) {
              200 === e.statusCode ? s() : i({
                code: e.statusCode,
                content: e.errMsg
              });
            },
            fail: function fail(e) {
              i({
                code: 500,
                content: e.errMsg
              });
            }
          }).onProgressUpdate(function (e) {
            t && t(e);
          });
        }));
      } catch (e) {
        return new Promise(function (t, s) {
          s({
            code: 500,
            content: e
          });
        });
      }
    }
  }, {
    key: "getTempFilePath",
    value: function getTempFilePath(e) {
      var t = e.file;
      return t.path || t.tempFilePath;
    }
  }, {
    key: "uploadToS3",
    value: function uploadToS3(e, t) {
      var _this28 = this;
      return new Promise(function (t, s) {
        return b(_this28, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee7() {
          var i;
          return _regenerator.default.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  _context7.next = 2;
                  return this.fileToArrayBuffer(this.getTempFilePath(e));
                case 2:
                  i = _context7.sent;
                  my.request({
                    url: e.url,
                    method: "PUT",
                    header: e.headers,
                    data: i,
                    success: function success(i) {
                      200 === i.statusCode ? (e.storageLocation === ge.s3 && (e.url = e.url.split("?")[0]), t()) : s({
                        code: i.statusCode,
                        content: i.errMsg
                      });
                    },
                    fail: function fail(e) {
                      s({
                        code: 500,
                        content: e.errMsg
                      });
                    }
                  });
                case 4:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, this);
        }));
      });
    }
  }, {
    key: "fileToArrayBuffer",
    value: function fileToArrayBuffer(e) {
      return new Promise(function (t, s) {
        my.getFileSystemManager().readFile({
          filePath: e,
          success: function success(e) {
            t(e.data);
          },
          fail: function fail(e) {
            s(e);
          }
        });
      });
    }
  }]);
  return _class9;
}(Me))();
var Ae = new ( /*#__PURE__*/function (_Me5) {
  (0, _inherits2.default)(_class10, _Me5);
  var _super9 = _createSuper(_class10);
  function _class10() {
    (0, _classCallCheck2.default)(this, _class10);
    return _super9.apply(this, arguments);
  }
  (0, _createClass2.default)(_class10, [{
    key: "upload",
    value: function upload(e, t) {
      var _this29 = this;
      try {
        return e.storageLocation === ge.s3 ? this.uploadToS3(e, t) : (delete e.parameters.fileRes, new Promise(function (s, i) {
          swan.uploadFile({
            url: e.host,
            filePath: _this29.getTempFilePath(e),
            name: "file",
            formData: e.parameters,
            success: function success(e) {
              200 === e.statusCode ? s() : i({
                code: e.statusCode,
                content: e.errMsg
              });
            },
            fail: function fail(e) {
              i({
                code: 500,
                content: e.errMsg
              });
            }
          }).onProgressUpdate(function (e) {
            t && t(e);
          });
        }));
      } catch (e) {
        return new Promise(function (t, s) {
          s({
            code: 500,
            content: e
          });
        });
      }
    }
  }, {
    key: "getTempFilePath",
    value: function getTempFilePath(e) {
      var t = e.file;
      return t.path || t.tempFilePath;
    }
  }, {
    key: "uploadToS3",
    value: function uploadToS3(e, t) {
      var _this30 = this;
      return new Promise(function (t, s) {
        return b(_this30, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee8() {
          var i;
          return _regenerator.default.wrap(function _callee8$(_context8) {
            while (1) {
              switch (_context8.prev = _context8.next) {
                case 0:
                  _context8.next = 2;
                  return this.fileToArrayBuffer(this.getTempFilePath(e));
                case 2:
                  i = _context8.sent;
                  swan.request({
                    url: e.url,
                    method: "PUT",
                    header: e.headers,
                    data: i,
                    success: function success(i) {
                      200 === i.statusCode ? (e.storageLocation === ge.s3 && (e.url = e.url.split("?")[0]), t()) : s({
                        code: i.statusCode,
                        content: i.errMsg
                      });
                    },
                    fail: function fail(e) {
                      s({
                        code: 500,
                        content: e.errMsg
                      });
                    }
                  });
                case 4:
                case "end":
                  return _context8.stop();
              }
            }
          }, _callee8, this);
        }));
      });
    }
  }, {
    key: "fileToArrayBuffer",
    value: function fileToArrayBuffer(e) {
      return new Promise(function (t, s) {
        swan.getFileSystemManager().readFile({
          filePath: e,
          success: function success(e) {
            t(e.data);
          },
          fail: function fail(e) {
            s(e);
          }
        });
      });
    }
  }]);
  return _class10;
}(Me))();
var Re = /*#__PURE__*/(0, _createClass2.default)(function Re(e, t, s) {
  (0, _classCallCheck2.default)(this, Re);
  this.storageLocation = e, this.url = t, this.name = s;
});
var ke = new ( /*#__PURE__*/function () {
  function _class11() {
    var _this$uploader;
    (0, _classCallCheck2.default)(this, _class11);
    this.uploader = (_this$uploader = {}, (0, _defineProperty2.default)(_this$uploader, e.UNIAPP, Ie), (0, _defineProperty2.default)(_this$uploader, l.MP_WX, Ne), (0, _defineProperty2.default)(_this$uploader, l.BROWSER, Te), (0, _defineProperty2.default)(_this$uploader, l.MP_ALI, Oe), (0, _defineProperty2.default)(_this$uploader, l.MP_BAIDU, Ae), (0, _defineProperty2.default)(_this$uploader, e.REACT_NATIVE, Te), (0, _defineProperty2.default)(_this$uploader, l.MP_BYTE, Ne), _this$uploader);
  }
  (0, _createClass2.default)(_class11, [{
    key: "upload",
    value: function upload(t, i) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var n, o, r, a;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                n = s.currentFramework(), o = d.currentPlatform(), r = n === e.UNKNOWN ? o : n;
                a = this.uploader[r];
                _context9.next = 4;
                return a.upload(t, i);
              case 4:
                return _context9.abrupt("return", new Re(t.storageLocation, t.url, t.newFileName));
              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));
    }
  }]);
  return _class11;
}())();
var Pe = /*#__PURE__*/function () {
  function Pe() {
    (0, _classCallCheck2.default)(this, Pe);
  }
  (0, _createClass2.default)(Pe, [{
    key: "resolve",
    value: function resolve(e) {
      return new Promise(function (t, s) {
        var i = new re({
          name: "uploadToken",
          params: {
            filename: e
          },
          permission: ne.WRITE,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          fail: function fail(e) {
            s(e.content);
          },
          success: function success(e) {
            200 === e.code ? t(e.content) : s(e.content);
          }
        });
        te.Socket.e(i);
      });
    }
  }]);
  return Pe;
}();
var _e = /*#__PURE__*/(0, _createClass2.default)(function _e(e, t, s, i, n, o, r) {
  (0, _classCallCheck2.default)(this, _e);
  this.storageLocation = e, this.host = t, this.headers = s, this.parameters = i, this.file = n, this.newFileName = o, this.url = r;
});
var De = /*#__PURE__*/function () {
  function De() {
    (0, _classCallCheck2.default)(this, De);
  }
  (0, _createClass2.default)(De, [{
    key: "newFileName",
    value: function newFileName(e) {
      return e && e.newFilename || "";
    }
  }]);
  return De;
}();
var xe = new ( /*#__PURE__*/function (_De) {
  (0, _inherits2.default)(_class12, _De);
  var _super10 = _createSuper(_class12);
  function _class12() {
    (0, _classCallCheck2.default)(this, _class12);
    return _super10.call(this);
  }
  (0, _createClass2.default)(_class12, [{
    key: "url",
    value: function url(e) {
      return e.host + "/" + e.dir + "/" + this.newFileName(e);
    }
  }, {
    key: "build",
    value: function build(e, t, s) {
      var i,
        n = this.newFileName(e);
      return i = {
        key: e.dir + "/" + n,
        OSSAccessKeyId: e.accessKeyId,
        policy: e.policy,
        signature: e.signature,
        success_action_status: "200",
        fileRes: t
      }, s && (i = {
        key: e.dir + "/" + n,
        OSSAccessKeyId: e.accessKeyId,
        policy: e.policy,
        signature: e.signature,
        success_action_status: "200",
        "Content-Disposition": "attachment;filename=" + t.name,
        fileRes: t
      }), new _e(ge.aliYun, e.host, null, i, t, n, this.url(e));
    }
  }]);
  return _class12;
}(De))();
var Ue = new ( /*#__PURE__*/function (_De2) {
  (0, _inherits2.default)(_class13, _De2);
  var _super11 = _createSuper(_class13);
  function _class13() {
    (0, _classCallCheck2.default)(this, _class13);
    return _super11.call(this);
  }
  (0, _createClass2.default)(_class13, [{
    key: "url",
    value: function url(e) {
      return e.host + "/" + e.key;
    }
  }, {
    key: "build",
    value: function build(e, t, s) {
      var i = {
        "q-sign-algorithm": e.qSignAlgorithm,
        "q-ak": e.qAk,
        "q-key-time": e.qKeyTime,
        "q-signature": e.qSignature,
        policy: e.policy,
        "x-cos-security-token": e.xCosSecurityToken,
        success_action_status: "200",
        key: e.key,
        fileRes: t
      };
      return s && (i = {
        "q-sign-algorithm": e.qSignAlgorithm,
        "q-ak": e.qAk,
        "q-key-time": e.qKeyTime,
        "q-signature": e.qSignature,
        policy: e.policy,
        "x-cos-security-token": e.xCosSecurityToken,
        success_action_status: "200",
        key: e.key,
        "Content-Disposition": "attachment;filename=".concat(t.name),
        fileRes: t
      }), new _e(ge.tencent, e.host, null, i, t, e.key, this.url(e));
    }
  }]);
  return _class13;
}(De))();
var Fe = new ( /*#__PURE__*/function (_De3) {
  (0, _inherits2.default)(_class14, _De3);
  var _super12 = _createSuper(_class14);
  function _class14() {
    (0, _classCallCheck2.default)(this, _class14);
    return _super12.call(this);
  }
  (0, _createClass2.default)(_class14, [{
    key: "url",
    value: function url(e) {
      return e.uploadUrl;
    }
  }, {
    key: "build",
    value: function build(e, t, s) {
      var i = {
        file: t
      };
      return new _e(ge.s3, null, {
        "Content-Type": "application/octet-stream"
      }, i, t, t.name, this.url(e));
    }
  }]);
  return _class14;
}(De))();
var Ge = /*#__PURE__*/function () {
  function Ge() {
    (0, _classCallCheck2.default)(this, Ge);
    this.uploadTokenResolver = new Pe();
  }
  (0, _createClass2.default)(Ge, [{
    key: "builder",
    value: function builder(e) {
      if (e === ge.aliYun) return xe;
      if (e === ge.tencent) return Ue;
      if (e === ge.s3) return Fe;
      throw new Error("Only Ali OSS and Tencent COS are supported, unknown storage location:" + e);
    }
  }, {
    key: "build",
    value: function build(e, t, s) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee10() {
        var _i8, _n4;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _context10.next = 3;
                return this.uploadTokenResolver.resolve(t);
              case 3:
                _i8 = _context10.sent;
                _n4 = this.builder(_i8.vendor).build(_i8, e, s);
                return _context10.abrupt("return", Promise.resolve(_n4));
              case 8:
                _context10.prev = 8;
                _context10.t0 = _context10["catch"](0);
                return _context10.abrupt("return", Promise.reject(_context10.t0));
              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[0, 8]]);
      }));
    }
  }]);
  return Ge;
}();
var Le = /*#__PURE__*/function () {
  function Le() {
    (0, _classCallCheck2.default)(this, Le);
    this.requestBuilder = new Ge(), this.fileUploader = ke;
  }
  (0, _createClass2.default)(Le, [{
    key: "upload",
    value: function upload(e, t, s, i) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee11() {
        var _n5;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _context11.next = 3;
                return this.requestBuilder.build(e, t, i);
              case 3:
                _n5 = _context11.sent;
                return _context11.abrupt("return", this.fileUploader.upload(_n5, s));
              case 7:
                _context11.prev = 7;
                _context11.t0 = _context11["catch"](0);
                return _context11.abrupt("return", Promise.reject(_context11.t0));
              case 10:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 7]]);
      }));
    }
  }]);
  return Le;
}();
var Be, qe, je, Ve;
!function (e) {
  e.MESSAGE_SENDING = "IM_INTERNAL_MESSAGE_SENDING", e.MESSAGE_SEND_SUCCESS = "IM_INTERNAL_MESSAGE_SEND_SUCCESS", e.MESSAGE_SEND_FAILED = "IM_INTERNAL_MESSAGE_SEND_FAILED", e.MESSAGE_RECEIVED = "IM_INTERNAL_MESSAGE_RECEIVED", e.MESSAGE_RECALLED = "IM_INTERNAL_MESSAGE_RECALLED", e.MAX_MESSAGE_CHANGED = "IM_INTERNAL_MAX_MESSAGE_CHANGED", e.MAX_MESSAGE_DELETED = "IM_INTERNAL_MAX_MESSAGE_DELETED", e.UNREAD_AMOUNT_CHANGED = "IM_INTERNAL_UNREAD_MESSAGE_CHANGED", e.CS_ONLINE_SUCCESS = "CS_ONLINE_SUCCESS", e.CS_OFFLINE_SUCCESS = "CS_OFFLINE_SUCCESS", e.CS_ACCEPTED = "CS_ACCEPTED", e.CS_ENDED = "CS_ENDED", e.CS_TRANSFER = "CS_TRANSFER", e.CS_AGENT_MESSAGE_RECEIVED = "CS_AGENT_MESSAGE_RECEIVED";
}(Be || (Be = {}));
var He = /*#__PURE__*/function () {
  function He() {
    (0, _classCallCheck2.default)(this, He);
  }
  (0, _createClass2.default)(He, [{
    key: "clearUseLessAttribute",
    value: function clearUseLessAttribute() {
      delete this.buildOptions;
    }
  }, {
    key: "isOtherSent",
    value: function isOtherSent() {
      return this.senderId !== te.Socket.user().id;
    }
  }, {
    key: "getToData",
    value: function getToData() {
      return this.buildOptions.createOptions.to.data;
    }
  }]);
  return He;
}();
var ze = /*#__PURE__*/(0, _createClass2.default)(function ze() {
  (0, _classCallCheck2.default)(this, ze);
});
!function (e) {
  e.TEXT = "text", e.IMAGE = "image", e.FILE = "file", e.VIDEO = "video", e.AUDIO = "audio";
}(qe || (qe = {}));
var We = /*#__PURE__*/function (_ze) {
  (0, _inherits2.default)(We, _ze);
  var _super13 = _createSuper(We);
  function We() {
    var _this31;
    (0, _classCallCheck2.default)(this, We);
    _this31 = _super13.apply(this, arguments), _this31.goEasyUploader = new Le();
    return _this31;
  }
  (0, _createClass2.default)(We, [{
    key: "improve",
    value: function improve(e) {
      var _this32 = this;
      var t = e.message;
      return new Promise(function (e, s) {
        var i,
          n,
          o = t.buildOptions.createOptions;
        t.type === qe.VIDEO ? (n = t.payload, i = n.video.name) : (n = t.payload, i = n.name), _this32.goEasyUploader.upload(o.file, i, o.onProgress, t.type === qe.FILE).then(function (s) {
          s.storageLocation !== ge.s3 && (s.url = encodeURI(s.url)), _this32.setPayload(s, t), e();
        }).catch(function (e) {
          s(e);
        });
      });
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      t.payload.url = e.url;
    }
  }]);
  return We;
}(ze);
var Je = /*#__PURE__*/function (_We) {
  (0, _inherits2.default)(Je, _We);
  var _super14 = _createSuper(Je);
  function Je() {
    (0, _classCallCheck2.default)(this, Je);
    return _super14.apply(this, arguments);
  }
  (0, _createClass2.default)(Je, [{
    key: "setPayload",
    value: function setPayload(e, t) {
      var s,
        i = t.payload;
      switch (i.video.url = e.url, i.video.name = e.name, i.thumbnail.height > 200 && (i.thumbnail.height = 200, i.thumbnail.width = 200 * i.video.width / i.video.height), e.storageLocation) {
        case ge.aliYun:
          s = "?x-oss-process=video/snapshot,t_0000,f_jpg,h_" + i.thumbnail.height + ",m_fast,ar_auto";
          break;
        case ge.tencent:
          s = "?ci-process=snapshot&time=1&format=jpg&height=" + i.thumbnail.height;
          break;
        case ge.s3:
          s = "?process=video&height=" + i.thumbnail.height;
          break;
        default:
          throw new Error("Only Ali OSS and Tencent COS are supported, unknown storage location:" + e.storageLocation);
      }
      i.thumbnail.url = e.url + s;
    }
  }]);
  return Je;
}(We);
var Xe = /*#__PURE__*/function (_We2) {
  (0, _inherits2.default)(Xe, _We2);
  var _super15 = _createSuper(Xe);
  function Xe() {
    (0, _classCallCheck2.default)(this, Xe);
    return _super15.apply(this, arguments);
  }
  (0, _createClass2.default)(Xe, [{
    key: "setPayload",
    value: function setPayload(e, t) {
      var s,
        i = t.payload;
      i.url = e.url;
      var n = i.height > 200 ? 200 : i.height;
      switch (e.storageLocation) {
        case ge.aliYun:
          s = "?x-oss-process=image/resize,m_lfit,h_" + n;
          break;
        case ge.tencent:
          s = "?imageMogr2/thumbnail/x".concat(n);
          break;
        case ge.s3:
          s = "?process=image&height=".concat(n);
          break;
        default:
          throw new Error("Only Ali OSS and Tencent COS are supported, unknown storage location:" + e.storageLocation);
      }
      i.thumbnail = e.url + s;
    }
  }]);
  return Xe;
}(We);
var $e = /*#__PURE__*/function () {
  function $e() {
    var _this$improvers;
    (0, _classCallCheck2.default)(this, $e);
    this.improvers = (_this$improvers = {}, (0, _defineProperty2.default)(_this$improvers, qe.FILE, new We()), (0, _defineProperty2.default)(_this$improvers, qe.AUDIO, new We()), (0, _defineProperty2.default)(_this$improvers, qe.IMAGE, new Xe()), (0, _defineProperty2.default)(_this$improvers, qe.VIDEO, new Je()), _this$improvers);
  }
  (0, _createClass2.default)($e, [{
    key: "improve",
    value: function improve(e) {
      var t = this.improvers[e.message.type];
      if (t) try {
        return t.improve(e);
      } catch (e) {
        return Promise.reject(e);
      }
      return Promise.resolve();
    }
  }]);
  return $e;
}();
var Qe = /*#__PURE__*/function (_Y) {
  (0, _inherits2.default)(Qe, _Y);
  var _super16 = _createSuper(Qe);
  function Qe() {
    (0, _classCallCheck2.default)(this, Qe);
    return _super16.apply(this, arguments);
  }
  (0, _createClass2.default)(Qe, null, [{
    key: "init",
    value: function init() {
      this.i = new Qe();
    }
  }]);
  return Qe;
}(Y);
var Ye = /*#__PURE__*/function () {
  function Ye(e, t, s, i, n) {
    (0, _classCallCheck2.default)(this, Ye);
    this.validate(e), this.mt = e.type, this.to = t.id.toString(), this.d = JSON.stringify(t.data), this.p = JSON.stringify(e.payload), s && (this.nt = s), n && (this.at = n), i && (this.wxmpTemplateMsg = de(i), this.wxmpTemplateMsg.data = JSON.stringify(this.wxmpTemplateMsg.data));
    var r = t.type;
    if (this.t = r, r === o.CS) {
      var _t12 = e;
      this.tid = _t12.teamId;
    }
    this.guid = e.messageId;
  }
  (0, _createClass2.default)(Ye, [{
    key: "validate",
    value: function validate(e) {
      if (e.type === qe.TEXT) {
        if (JSON.stringify(e.payload).length > 3072) throw Error("message-length limit 3kb");
      }
    }
  }]);
  return Ye;
}();
var Ke = /*#__PURE__*/function () {
  function Ke() {
    (0, _classCallCheck2.default)(this, Ke);
    this.payloadImprover = new $e();
  }
  (0, _createClass2.default)(Ke, [{
    key: "send",
    value: function send(e) {
      var _this33 = this;
      this.validate(e);
      var t = e.message,
        s = e.accessToken,
        i = t.buildOptions,
        n = i.createOptions,
        o = n.notification,
        a = n.wxmpTemplateMsg,
        c = n.to;
      c.data || (c.data = {}), t.status = r.SENDING;
      var u = i.complete,
        l = this.payloadImprover.improve(e);
      Promise.all([u, l]).then(function () {
        return b(_this33, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee12() {
          var _e6;
          return _regenerator.default.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  if (!n.beforeSend) {
                    _context12.next = 4;
                    break;
                  }
                  _e6 = JSON.parse(JSON.stringify(t));
                  _context12.next = 4;
                  return n.beforeSend(_e6);
                case 4:
                  this.doSend(t, c, o, a, s, e);
                case 5:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, this);
        }));
      }).catch(function (s) {
        t.status = r.FAIL, v.onFailed(e, {
          code: s && s.code || 400,
          content: s && s.content || s
        });
      });
    }
  }, {
    key: "doSend",
    value: function doSend(e, t, s, i, n, a) {
      var c = new Ye(e, t, s, i, n);
      Qe.i.fire(Be.MESSAGE_SENDING, e);
      var u = new re({
        name: y.publishIM,
        params: c,
        unique: !0,
        permission: ne.WRITE,
        singleTimeout: S.commonRequestSingle,
        totalTimeout: S.commonRequestTotal,
        fail: function fail(t) {
          e.status = r.FAIL, Qe.i.fire(Be.MESSAGE_SEND_FAILED, e), v.onFailed(a, {
            code: t.resultCode,
            content: t.content
          });
        },
        success: function success(t) {
          if (e.status = r.SUCCESS, e.timestamp = t.content.timestamp, e.messageId = JSON.stringify(t.content.id), e.scene() === o.CS) {
            var _s12 = e;
            _s12.customerId() !== te.Socket.user().id && (_s12.sessionId = t.content.sessionId);
          }
          e.clearUseLessAttribute(), Qe.i.fire(Be.MESSAGE_SEND_SUCCESS, e), v.onSuccess(a, e);
        }
      });
      te.Socket.e(u);
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.message;
      if (!(t instanceof He)) throw new Error("it is invalid message");
      if (t.status !== r.NEW) throw new Error("Please create a new message, a message can only be sent once");
    }
  }]);
  return Ke;
}();
var Ze = /*#__PURE__*/function () {
  function Ze() {
    (0, _classCallCheck2.default)(this, Ze);
  }
  (0, _createClass2.default)(Ze, [{
    key: "insert",
    value: function insert(e, t) {
      var s = this.binarySearch(e, t);
      if (s >= 0) e.splice(s, 1, t);else {
        var _i9 = -s - 1;
        e.splice(_i9, 0, t);
      }
    }
  }, {
    key: "binarySearch",
    value: function binarySearch(e, t) {
      var s = 0,
        i = e.length - 1;
      for (; s <= i;) {
        var _n6 = i + s >> 1,
          _o5 = this.compare(t, e[_n6]);
        if (_o5 > 0) s = _n6 + 1;else {
          if (!(_o5 < 0)) return _n6;
          i = _n6 - 1;
        }
      }
      return -s - 1;
    }
  }]);
  return Ze;
}();
var et = /*#__PURE__*/function () {
  function et(e) {
    (0, _classCallCheck2.default)(this, et);
    this.messages = new Array(), this.allLoaded = !1, this.target = e;
  }
  (0, _createClass2.default)(et, [{
    key: "all",
    value: function all() {
      return this.messages;
    }
  }, {
    key: "sliceOverLengthMessages",
    value: function sliceOverLengthMessages() {
      this.messages.length > et.CACHE_MAX_LENGTH && (this.messages = this.messages.slice(-et.CACHE_MAX_LENGTH), !0 === this.allLoaded && (this.allLoaded = !1));
    }
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage() {
      return this.messages[this.messages.length - 1];
    }
  }, {
    key: "loadLocalMessages",
    value: function loadLocalMessages(e, t) {
      var s = [],
        i = this.messages.length;
      if (t) {
        if (i > 0) {
          var _n7 = this.messages[0].timestamp,
            _o6 = this.messages[i - 1].timestamp;
          if (t >= _n7 && t <= _o6) for (var _n8 = i - 1; _n8 >= 0; _n8--) {
            var _i10 = this.messages[_n8];
            if (_i10.timestamp < t) {
              if (!(s.length < e)) break;
              s.unshift(_i10);
            }
          }
        }
      } else s = this.messages.slice(-e);
      return s;
    }
  }, {
    key: "cacheServerMessages",
    value: function cacheServerMessages(e, t) {
      var _this34 = this;
      var s = this.messages[0];
      this.messages.length < et.CACHE_MAX_LENGTH && (!e.lastTimestamp || this.messages.length > 0 && s.timestamp === e.lastTimestamp) && (t.forEach(function (e) {
        et.sortedInserter.insert(_this34.messages, e);
      }), t.length < e.limit && (this.allLoaded = !0));
    }
  }, {
    key: "findMessageByTime",
    value: function findMessageByTime(e) {
      return this.messages.find(function (t) {
        return e === t.timestamp;
      });
    }
  }, {
    key: "findMessagesByTimes",
    value: function findMessagesByTimes(e) {
      var _this35 = this;
      var t = [];
      return e.forEach(function (e) {
        var s = _this35.findMessageByTime(e);
        u.isDef(s) && t.push(s);
      }), t;
    }
  }, {
    key: "existsMessage",
    value: function existsMessage(e) {
      return this.findMessageIndexById(e) > -1;
    }
  }, {
    key: "findMessageIndexById",
    value: function findMessageIndexById(e) {
      return this.messages.findIndex(function (t) {
        return e === t.messageId;
      });
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(e) {
      var t = this.findMessageIndexById(e);
      t >= 0 && this.messages.splice(t, 1);
    }
  }, {
    key: "recallMessage",
    value: function recallMessage(e) {
      var _this36 = this;
      return e.times.map(function (e) {
        return _this36.findMessageByTime(e);
      }).filter(function (e) {
        return u.isDef(e);
      }).map(function (t) {
        return t.recalled = !0, t.recaller = e.recaller, t;
      });
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return 0 === this.messages.length;
    }
  }, {
    key: "deleteMessages",
    value: function deleteMessages(e) {
      var _this37 = this;
      e.forEach(function (e) {
        _this37.deleteMessage(e.messageId);
      });
    }
  }, {
    key: "saveMessage",
    value: function saveMessage(e) {
      et.sortedInserter.insert(this.messages, e), this.sliceOverLengthMessages();
    }
  }, {
    key: "maxSuccessMessageTime",
    value: function maxSuccessMessageTime() {
      for (var _e7 = this.messages.length - 1; _e7 >= 0; _e7--) {
        if (this.messages[_e7].status === r.SUCCESS) return this.messages[_e7].timestamp;
      }
      return 0;
    }
  }, {
    key: "minTime",
    value: function minTime() {
      return this.isEmpty() ? 0 : this.messages[0].timestamp;
    }
  }, {
    key: "correctPosition",
    value: function correctPosition(e) {
      this.deleteMessage(e.messageId), this.saveMessage(e);
    }
  }]);
  return et;
}();
et.CACHE_MAX_LENGTH = 200, et.sortedInserter = new ( /*#__PURE__*/function (_Ze) {
  (0, _inherits2.default)(_class15, _Ze);
  var _super17 = _createSuper(_class15);
  function _class15() {
    (0, _classCallCheck2.default)(this, _class15);
    return _super17.apply(this, arguments);
  }
  (0, _createClass2.default)(_class15, [{
    key: "compare",
    value: function compare(e, t) {
      var s = e.timestamp - t.timestamp;
      return s > 0 ? 1 : 0 === s ? 0 : -1;
    }
  }]);
  return _class15;
}(Ze))();
var st = /*#__PURE__*/function () {
  function st(e, t, s) {
    (0, _classCallCheck2.default)(this, st);
    this.scene = e, this.id = t, u.isDef(s) && (this.teamId = s);
  }
  (0, _createClass2.default)(st, [{
    key: "toString",
    value: function toString() {
      return o.PRIVATE === this.scene || o.GROUP === this.scene ? this.scene + "#" + this.id : this.scene + "#" + this.id + "#" + this.teamId;
    }
  }, {
    key: "customerId",
    value: function customerId() {
      if (o.CS === this.scene) return this.id === this.teamId ? te.Socket.user().id : this.id;
    }
  }], [{
    key: "byScene",
    value: function byScene(e, t, s) {
      return new st(e, t, s);
    }
  }, {
    key: "byIMMessage",
    value: function byIMMessage(e) {
      var t,
        s,
        i = e.scene();
      if (i === o.PRIVATE) {
        var _t13 = e.senderId,
          _i11 = e.targetId();
        s = te.Socket.user().id === _t13 ? _i11 : _t13;
      } else if (i === o.GROUP) s = e.targetId();else {
        if (i !== o.CS) throw {
          code: 400,
          content: "scene ".concat(i, " not exists")
        };
        s = e.targetId(), t = e.teamId;
      }
      return new st(i, s, t);
    }
  }, {
    key: "byMessageReadRemoteEvent",
    value: function byMessageReadRemoteEvent(e) {
      var t,
        s = e.scene,
        i = e.targetId,
        n = e.markerId,
        r = e.teamId;
      return s === o.PRIVATE ? t = te.Socket.user().id === n ? i : n : s === o.GROUP ? t = i : s === o.CS && (t = i === r ? n === te.Socket.user().id ? r : n : n === te.Socket.user().id ? i : r), new st(s, t, r);
    }
  }, {
    key: "byIMMessageDeletedEvent",
    value: function byIMMessageDeletedEvent(e) {
      var t = e.scene,
        s = e.deleterId;
      if (t === o.PRIVATE) {
        var _i12 = te.Socket.user().id === s ? e.targetId : s;
        return new st(t, _i12);
      }
      if (t === o.GROUP) return new st(t, e.targetId);
    }
  }, {
    key: "byConversationDTO",
    value: function byConversationDTO(e) {
      var t = e.lastMessage;
      return this.byIMMessage(t);
    }
  }, {
    key: "byConversationId",
    value: function byConversationId(e, t) {
      var s;
      if (e === o.PRIVATE) {
        var _e8 = t.split(":", 2);
        s = _e8[0] === te.Socket.user().id ? _e8[1] : _e8[0];
      } else s = t;
      return new st(e, s);
    }
  }]);
  return st;
}();
var it = /*#__PURE__*/(0, _createClass2.default)(function it(e) {
  var _this38 = this;
  (0, _classCallCheck2.default)(this, it);
  this.times = new Array();
  var t = e[0],
    s = st.byIMMessage(t);
  this.scene = s.scene, this.targetId = s.id, e.forEach(function (e) {
    e.status === r.SUCCESS && _this38.times.push(e.timestamp);
  }), this.times.sort(function (e, t) {
    return e < t ? -1 : e == t ? 0 : 1;
  });
});
var nt = /*#__PURE__*/function () {
  function nt() {
    (0, _classCallCheck2.default)(this, nt);
  }
  (0, _createClass2.default)(nt, null, [{
    key: "deleteServerMessages",
    value: function deleteServerMessages(e) {
      var t = new it(e);
      return t.times.length < 0 ? Promise.resolve() : new Promise(function (e, s) {
        var i = new re({
          name: y.IM_DELETE_MESSAGE,
          params: t,
          permission: ne.WRITE,
          singleTimeout: S.commonQuerySingle,
          totalTimeout: S.commonQueryTotal,
          success: function success(t) {
            200 === t.code ? e(t) : s(t);
          },
          fail: function fail(e) {
            s(e);
          }
        });
        te.Socket.e(i);
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.messages;
      for (var _e9 = 0; _e9 < t.length; _e9++) {
        var _s13 = t[_e9];
        if (_s13.status === r.SENDING) throw {
          code: 400,
          content: "message[" + _e9 + "] is '" + _s13.status + "' and cannot be deleted"
        };
      }
    }
  }]);
  return nt;
}();
var ot = /*#__PURE__*/(0, _createClass2.default)(function ot(e, t, s, i, n) {
  (0, _classCallCheck2.default)(this, ot);
  this.scene = e, this.id = t, this.after = s, this.min = i, this.teamId = n;
});
var rt = /*#__PURE__*/(0, _createClass2.default)(function rt(e, t, s, i) {
  (0, _classCallCheck2.default)(this, rt);
  this.id = e, this.scene = t, this.lastTimestamp = s, this.teamId = i;
});
var at = /*#__PURE__*/function (_He) {
  (0, _inherits2.default)(at, _He);
  var _super18 = _createSuper(at);
  function at() {
    var _this39;
    (0, _classCallCheck2.default)(this, at);
    _this39 = _super18.apply(this, arguments), _this39.read = !1;
    return _this39;
  }
  (0, _createClass2.default)(at, [{
    key: "scene",
    value: function scene() {
      return o.PRIVATE;
    }
  }, {
    key: "targetId",
    value: function targetId() {
      return this.receiverId;
    }
  }]);
  return at;
}(He);
var ct = /*#__PURE__*/function (_He2) {
  (0, _inherits2.default)(ct, _He2);
  var _super19 = _createSuper(ct);
  function ct() {
    (0, _classCallCheck2.default)(this, ct);
    return _super19.apply(this, arguments);
  }
  (0, _createClass2.default)(ct, [{
    key: "scene",
    value: function scene() {
      return o.GROUP;
    }
  }, {
    key: "targetId",
    value: function targetId() {
      return this.groupId;
    }
  }]);
  return ct;
}(He);
var ut = /*#__PURE__*/function (_He3) {
  (0, _inherits2.default)(ut, _He3);
  var _super20 = _createSuper(ut);
  function ut() {
    var _this40;
    (0, _classCallCheck2.default)(this, ut);
    _this40 = _super20.apply(this, arguments), _this40.accepted = !1;
    return _this40;
  }
  (0, _createClass2.default)(ut, [{
    key: "scene",
    value: function scene() {
      return o.CS;
    }
  }, {
    key: "targetId",
    value: function targetId() {
      return te.Socket.user().id === this.customerId() ? this.teamId : this.customerId();
    }
  }, {
    key: "sendByCustomer",
    value: function sendByCustomer() {
      return this.to === this.teamId;
    }
  }, {
    key: "customerId",
    value: function customerId() {
      return this.sendByCustomer() ? this.senderId : this.to;
    }
  }, {
    key: "isOtherSent",
    value: function isOtherSent() {
      return te.Socket.user().id === this.customerId() ? this.senderId !== te.Socket.user().id : this.senderId === this.customerId();
    }
  }]);
  return ut;
}(He);
!function (e) {
  e.ACCEPT = "CS_ACCEPT", e.END = "CS_END", e.TRANSFER = "CS_TRANSFER";
}(je || (je = {}));
var lt = /*#__PURE__*/function () {
  function lt() {
    (0, _classCallCheck2.default)(this, lt);
  }
  (0, _createClass2.default)(lt, [{
    key: "build",
    value: function build(e) {
      var t,
        s = e.t;
      s === o.PRIVATE ? (t = new at(), t.read = !1, t.receiverId = e.r) : s === o.GROUP ? (t = new ct(), t.groupId = e.r, t.senderData = e.d ? JSON.parse(e.d) : {}) : s === o.CS && (t = new ut(), t.to = e.r, t.teamId = e.tid, t.senderData = e.d ? JSON.parse(e.d) : {}, t.accepted = e.accepted, t.customerId() !== te.Socket.user().id && (t.sessionId = e.sessionId)), t.senderId = e.s, t.messageId = e.i, t.timestamp = e.ts, t.type = e.mt;
      var i = e.p;
      if (u.isDef(i)) if (s === o.CS && t.type === je.TRANSFER) {
        var _e10 = JSON.parse(i);
        _e10.transferTo.data = JSON.parse(_e10.transferTo.data), t.payload = _e10;
      } else t.payload = JSON.parse(i);
      var n = e.rc;
      return u.isDef(n) && !0 === n ? (t.recalled = n, t.recaller = e.recaller) : t.recalled = !1, t.status = r.SUCCESS, t;
    }
  }]);
  return lt;
}();
var dt = /*#__PURE__*/function () {
  function dt() {
    (0, _classCallCheck2.default)(this, dt);
    this.builder = new lt();
  }
  (0, _createClass2.default)(dt, [{
    key: "sync",
    value: function sync(e, t, s, i, n) {
      var o = new ot(e, t, s, i, n);
      return new Promise(function (e, t) {
        var s = new re({
          name: y.IM_HISTORY_CHANGE,
          params: o,
          permission: ne.READ,
          singleTimeout: S.commonQuerySingle,
          totalTimeout: S.commonQueryTotal,
          fail: function fail(e) {
            t(e);
          },
          success: function success(t) {
            var s = t.content;
            e(s);
          }
        });
        te.Socket.e(s);
      });
    }
  }, {
    key: "loadServerMessages",
    value: function loadServerMessages(e, t) {
      var _this41 = this;
      return new Promise(function (s, i) {
        var n = new re({
          name: y.IM_HISTORY,
          params: t,
          permission: ne.READ,
          singleTimeout: S.commonQuerySingle,
          totalTimeout: S.commonQueryTotal,
          fail: function fail(e) {
            i(e);
          },
          success: function success(t) {
            var i = t.content;
            i.messages = _this41.convertServerMessages(e, i.messages), s(i);
          }
        });
        te.Socket.e(n);
      });
    }
  }, {
    key: "convertServerMessages",
    value: function convertServerMessages(e, t) {
      var _this42 = this;
      var s = [],
        i = e.scene,
        n = e.id;
      return t.forEach(function (t) {
        if (t.t = i, o.PRIVATE === i) t.r = t.s === te.Socket.user().id ? n : te.Socket.user().id;else if (o.GROUP === i) t.r = n;else if (o.CS === i) {
          var _s14 = e.customerId(),
            _i13 = e.teamId;
          _s14 === te.Socket.user().id ? t.r = _i13 : t.r = _s14;
        }
        var r = _this42.builder.build(t);
        s.push(r);
      }), s;
    }
  }, {
    key: "updateServerOffsets",
    value: function updateServerOffsets(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee13() {
        var s;
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                s = new rt(t.id, t.scene, e, t.teamId);
                return _context13.abrupt("return", new Promise(function (e, t) {
                  var i = new re({
                    name: y.IM_MARK_AS_READ,
                    params: s,
                    permission: ne.WRITE,
                    singleTimeout: S.commonRequestSingle,
                    totalTimeout: S.commonRequestTotal,
                    success: function success(t) {
                      e(t);
                    },
                    fail: function fail(e) {
                      t(e);
                    }
                  });
                  te.Socket.e(i);
                }));
              case 2:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));
    }
  }]);
  return dt;
}();
dt.instance = new dt();
var ht = /*#__PURE__*/function () {
  function ht() {
    (0, _classCallCheck2.default)(this, ht);
    this.offsetMap = new Map(), this.markingTime = 0, this.userId = te.Socket.user().id;
  }
  (0, _createClass2.default)(ht, [{
    key: "updateOffset",
    value: function updateOffset(e, t) {
      var s = this.offsetMap.get(e);
      return u.isDef(s) ? t > s && (this.offsetMap.set(e, t), !0) : (this.offsetMap.set(e, t), !0);
    }
  }, {
    key: "updateUserOffsets",
    value: function updateUserOffsets(e) {
      var _this43 = this;
      e.forEach(function (e) {
        var t = e.userId,
          s = e.offset;
        _this43.updateOffset(t, s);
      });
    }
  }, {
    key: "updateMyOffset",
    value: function updateMyOffset(e) {
      return this.updateOffset(this.userId, e);
    }
  }, {
    key: "myOffset",
    value: function myOffset() {
      return this.getOffset(this.userId);
    }
  }, {
    key: "getOffset",
    value: function getOffset(e) {
      var t = this.offsetMap.get(e);
      return t || 0;
    }
  }]);
  return ht;
}();
var pt = /*#__PURE__*/(0, _createClass2.default)(function pt(e, t, s, i, n) {
  (0, _classCallCheck2.default)(this, pt);
  this.id = e, this.scene = t, this.lastTimestamp = s, this.limit = i, this.teamId = n;
});
var mt = /*#__PURE__*/function () {
  function mt(e) {
    (0, _classCallCheck2.default)(this, mt);
    this.history = e;
  }
  (0, _createClass2.default)(mt, [{
    key: "pre",
    value: function pre() {
      this.oldLastMessage = this.history.getMaxMessage(), this.oldUnreadAmount = this.history.unreadAmount(), this.oldLastMessage && (this.oldLastMessageRecalled = this.oldLastMessage.recalled, this.oldLastMessageRead = this.oldLastMessage.read, this.oldLastMessageStatus = this.oldLastMessage.status);
    }
  }, {
    key: "post",
    value: function post() {
      var e,
        t,
        s,
        i = this.history.unreadAmount(),
        n = this.history.getMaxMessage();
      n && (s = n.status, e = n.read, t = n.recalled);
      var o = this.history.target;
      this.oldLastMessage !== n || this.oldLastMessageRead !== e || this.oldLastMessageRecalled !== t || this.oldLastMessageStatus !== s ? n ? Qe.i.fire(Be.MAX_MESSAGE_CHANGED, n) : Qe.i.fire(Be.MAX_MESSAGE_DELETED, o) : this.oldUnreadAmount !== i && Qe.i.fire(Be.UNREAD_AMOUNT_CHANGED, o);
    }
  }]);
  return mt;
}();
var ft = /*#__PURE__*/(0, _createClass2.default)(function ft(e, t, s, i) {
  (0, _classCallCheck2.default)(this, ft);
  this.scene = e, this.conversationId = t, this.recaller = s, this.times = i;
});
var gt = /*#__PURE__*/function () {
  function gt() {
    (0, _classCallCheck2.default)(this, gt);
  }
  (0, _createClass2.default)(gt, null, [{
    key: "init",
    value: function init() {
      this.eventCenter = new ee();
    }
  }, {
    key: "on",
    value: function on(e, t) {
      this.eventCenter.on(e, t);
    }
  }, {
    key: "fire",
    value: function fire(e, t) {
      this.eventCenter.fire(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      this.eventCenter.off(e, t);
    }
  }]);
  return gt;
}();
!function (e) {
  e.PRIVATE_MESSAGE_RECEIVED = "PRIVATE_MESSAGE_RECEIVED", e.GROUP_MESSAGE_RECEIVED = "GROUP_MESSAGE_RECEIVED", e.SYSTEM_MESSAGE_RECEIVED = "SYSTEM_MESSAGE_RECEIVED", e.CONVERSATIONS_UPDATED = "CONVERSATIONS_UPDATED", e.USER_PRESENCE = "USER_PRESENCE", e.GROUP_PRESENCE = "GROUP_PRESENCE", e.MESSAGE_DELETED = "MESSAGE_DELETED", e.MESSAGE_READ = "MESSAGE_READ", e.MESSAGE_RECALLED = "MESSAGE_RECALLED", e.CS_MESSAGE_RECEIVED = "CS_MESSAGE_RECEIVED", e.PENDING_CONVERSATIONS_UPDATED = "PENDING_CONVERSATIONS_UPDATED";
}(Ve || (Ve = {}));
var yt = /*#__PURE__*/function () {
  function yt(e) {
    (0, _classCallCheck2.default)(this, yt);
    this.expiredTime = 0, this.remoteHistory = dt.instance, this.target = e, this.userOffsets = new ht(), this.messageCache = new et(e);
  }
  (0, _createClass2.default)(yt, [{
    key: "initMaxMessageAndOffsets",
    value: function initMaxMessageAndOffsets(e, t) {
      var _this44 = this;
      this.existsMessage(e) || (this.messageCache.saveMessage(e), t.forEach(function (e) {
        _this44.markLocalMessagesRead(_this44.messageCache.all(), e.userId, e.offset, !1);
      }));
    }
  }, {
    key: "existsMessage",
    value: function existsMessage(e) {
      return this.messageCache.existsMessage(e.messageId);
    }
  }, {
    key: "loadHistory",
    value: function loadHistory(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee14() {
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.t0 = this.expiredTime > 0 && !this.messageCache.isEmpty();
                if (!_context14.t0) {
                  _context14.next = 4;
                  break;
                }
                _context14.next = 4;
                return this.updateByServerChange();
              case 4:
                u.isUndef(t) ? t = 10 : t > 30 && (t = 30);
                _context14.next = 7;
                return this.loadServerMessages(e, t);
              case 7:
                return _context14.abrupt("return", _context14.sent);
              case 8:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));
    }
  }, {
    key: "loadServerMessages",
    value: function loadServerMessages(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee15() {
        var _this45 = this;
        var s, _i14, _n9, _o7, _r2, _a2;
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                s = this.messageCache.loadLocalMessages(t, e);
                if (!(!1 === this.messageCache.allLoaded && s.length !== t)) {
                  _context15.next = 10;
                  break;
                }
                _i14 = t - s.length;
                _n9 = s[0] ? s[0].timestamp : e;
                _o7 = new pt(this.target.id.toString(), this.target.scene, _n9, _i14, this.target.teamId);
                _context15.next = 7;
                return this.remoteHistory.loadServerMessages(this.target, _o7);
              case 7:
                _r2 = _context15.sent;
                _a2 = _r2.messages;
                s = _a2.concat(s), this.messageCache.cacheServerMessages(_o7, _a2), _r2.userOffsets.forEach(function (e) {
                  _this45.userOffsets.updateOffset(e.userId, e.offset);
                }), this.userOffsets.offsetMap.forEach(function (e, t) {
                  _this45.markLocalMessagesRead(_a2, t, e, !1);
                });
              case 10:
                return _context15.abrupt("return", s);
              case 11:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));
    }
  }, {
    key: "deleteMessages",
    value: function deleteMessages(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee17() {
        var _this46 = this;
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return this.aopUnreadAmountMaxMessage(function () {
                  return b(_this46, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee16() {
                    var t;
                    return _regenerator.default.wrap(function _callee16$(_context16) {
                      while (1) {
                        switch (_context16.prev = _context16.next) {
                          case 0:
                            t = e.messages;
                            _context16.next = 3;
                            return nt.deleteServerMessages(t);
                          case 3:
                            this.messageCache.deleteMessages(t);
                            v.onSuccess(e);
                          case 5:
                          case "end":
                            return _context16.stop();
                        }
                      }
                    }, _callee16, this);
                  }));
                });
              case 2:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));
    }
  }, {
    key: "syncDeletedMessage",
    value: function syncDeletedMessage(e, t) {
      var _this47 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this47.doSyncDeletedMessage(e, t);
      });
    }
  }, {
    key: "doSyncDeletedMessage",
    value: function doSyncDeletedMessage(e, t) {
      if (e === te.Socket.user().id) {
        var _e11 = this.messageCache.findMessagesByTimes(t);
        this.messageCache.deleteMessages(_e11), _e11.length > 0 && gt.fire(Ve.MESSAGE_DELETED, _e11);
      }
    }
  }, {
    key: "recallMessages",
    value: function recallMessages(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee19() {
        var _this48 = this;
        return _regenerator.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return this.aopUnreadAmountMaxMessage(function () {
                  return b(_this48, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee18() {
                    return _regenerator.default.wrap(function _callee18$(_context18) {
                      while (1) {
                        switch (_context18.prev = _context18.next) {
                          case 0:
                            this.doRecall(e);
                          case 1:
                          case "end":
                            return _context18.stop();
                        }
                      }
                    }, _callee18, this);
                  }));
                });
              case 2:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));
    }
  }, {
    key: "doRecall",
    value: function doRecall(e) {
      var t = this.messageCache.recallMessage(e);
      t.length > 0 && gt.fire(Ve.MESSAGE_RECALLED, t);
    }
  }, {
    key: "expire",
    value: function expire() {
      this.messageCache.isEmpty() || (this.expiredTime = this.messageCache.maxSuccessMessageTime());
    }
  }, {
    key: "updateByServerChange",
    value: function updateByServerChange() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee21() {
        var _this49 = this;
        return _regenerator.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return this.aopUnreadAmountMaxMessage(function () {
                  return b(_this49, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee20() {
                    var _this50 = this;
                    var e, t, s;
                    return _regenerator.default.wrap(function _callee20$(_context20) {
                      while (1) {
                        switch (_context20.prev = _context20.next) {
                          case 0:
                            _context20.next = 2;
                            return this.remoteHistory.sync(this.target.scene, this.target.id, this.expiredTime, this.messageCache.minTime(), this.target.teamId);
                          case 2:
                            e = _context20.sent;
                            e.userOffsets.forEach(function (e) {
                              _this50.markLocalMessagesRead(_this50.messageCache.all(), e.userId, e.offset, !0);
                            });
                            t = e.deletedMessageTimes;
                            t.length > 0 && this.doSyncDeletedMessage(te.Socket.user().id, t);
                            s = e.recalledMessages;
                            s.length > 0 && s.forEach(function (e) {
                              var t = new ft(_this50.target.scene, _this50.target.id, e.recaller, e.times);
                              _this50.doRecall(t);
                            }), this.expiredTime = 0;
                          case 8:
                          case "end":
                            return _context20.stop();
                        }
                      }
                    }, _callee20, this);
                  }));
                });
              case 2:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));
    }
  }, {
    key: "markRead",
    value: function markRead() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee23() {
        var _this51 = this;
        return _regenerator.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return this.aopUnreadAmountMaxMessage(function () {
                  return b(_this51, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee22() {
                    var e;
                    return _regenerator.default.wrap(function _callee22$(_context22) {
                      while (1) {
                        switch (_context22.prev = _context22.next) {
                          case 0:
                            e = this.messageCache.maxSuccessMessageTime();
                            _context22.t0 = e > this.userOffsets.myOffset();
                            if (!_context22.t0) {
                              _context22.next = 7;
                              break;
                            }
                            this.userOffsets.markingTime = e;
                            _context22.next = 6;
                            return this.remoteHistory.updateServerOffsets(e, this.target);
                          case 6:
                            e === this.userOffsets.markingTime && this.markLocalMessagesRead(this.messageCache.all(), te.Socket.user().id, e, !0);
                          case 7:
                          case "end":
                            return _context22.stop();
                        }
                      }
                    }, _callee22, this);
                  }));
                });
              case 2:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));
    }
  }, {
    key: "syncMarkedMessage",
    value: function syncMarkedMessage(e) {
      var _this52 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this52.markLocalMessagesRead(_this52.messageCache.all(), e.markerId, e.time, !0);
      });
    }
  }, {
    key: "onMessageSending",
    value: function onMessageSending(e) {
      var _this53 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this53.messageCache.saveMessage(e);
      });
    }
  }, {
    key: "onMessageSendSuccess",
    value: function onMessageSendSuccess(e) {
      var _this54 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this54.messageCache.correctPosition(e), _this54.markLocalMessagesRead(_this54.messageCache.all(), te.Socket.user().id, e.timestamp, !0);
      });
    }
  }, {
    key: "onMessageSendFailed",
    value: function onMessageSendFailed(e) {
      this.getMaxMessage() === e && Qe.i.fire(Be.MAX_MESSAGE_CHANGED, e);
    }
  }, {
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      var _this55 = this;
      this.aopUnreadAmountMaxMessage(function () {
        _this55.messageCache.saveMessage(e), _this55.markLocalMessagesRead(_this55.messageCache.all(), e.senderId, e.timestamp, !0);
      });
    }
  }, {
    key: "aopUnreadAmountMaxMessage",
    value: function aopUnreadAmountMaxMessage(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee24() {
        var _t14;
        return _regenerator.default.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.prev = 0;
                _t14 = new mt(this);
                _t14.pre();
                _context24.next = 5;
                return e();
              case 5:
                _t14.post();
                _context24.next = 11;
                break;
              case 8:
                _context24.prev = 8;
                _context24.t0 = _context24["catch"](0);
                v.onFailed(t, _context24.t0);
              case 11:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this, [[0, 8]]);
      }));
    }
  }, {
    key: "markLocalMessagesRead",
    value: function markLocalMessagesRead(e, t, s, i) {
      if (this.userOffsets.updateOffset(t, s), this.isOtherUserId(t)) {
        var _t15 = this.markMySentRead(e, s);
        i && _t15.length > 0 && gt.fire(Ve.MESSAGE_READ, _t15);
      } else t === te.Socket.user().id && this.markOthersSentRead(e, s);
    }
  }, {
    key: "markOthersSentRead",
    value: function markOthersSentRead(e, t) {
      if (this.target.scene === o.PRIVATE) for (var _s15 = e.length - 1; _s15 >= 0; _s15--) {
        var _i15 = e[_s15];
        if (_i15.isOtherSent() && _i15.timestamp <= t) {
          if (_i15.read) break;
          _i15.read = !0;
        }
      }
    }
  }, {
    key: "markMySentRead",
    value: function markMySentRead(e, t) {
      var s = new Array();
      if (this.target.scene === o.PRIVATE) for (var _i16 = e.length - 1; _i16 >= 0; _i16--) {
        var _n10 = e[_i16];
        if (!_n10.isOtherSent() && _n10.timestamp <= t && _n10.status === r.SUCCESS) {
          if (_n10.read) break;
          _n10.read = !0, s.push(_n10);
        }
      }
      return s;
    }
  }, {
    key: "isOtherUserId",
    value: function isOtherUserId(e) {
      if (this.target.scene === o.CS) {
        var _t16 = this.target.customerId();
        return te.Socket.user().id === _t16 ? e !== te.Socket.user().id : e === _t16;
      }
      return e !== te.Socket.user().id;
    }
  }, {
    key: "unreadAmount",
    value: function unreadAmount(e) {
      var t = 0,
        s = this.userOffsets.myOffset(),
        i = this.messageCache.all();
      var _iterator2 = _createForOfIteratorHelper(i),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _e12 = _step2.value;
          _e12.isOtherSent() && !1 === _e12.recalled && _e12.timestamp > s && (t += 1);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return t;
    }
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage(e) {
      return this.messageCache.getMaxMessage();
    }
  }, {
    key: "maxTime",
    value: function maxTime(e) {
      var t = this.getMaxMessage();
      return u.isDef(t) ? t.timestamp : 0;
    }
  }]);
  return yt;
}();
var St = /*#__PURE__*/(0, _createClass2.default)(function St(e, t) {
  (0, _classCallCheck2.default)(this, St);
  this.teamId = e, this.customerId = t;
});
var Et = /*#__PURE__*/(0, _createClass2.default)(function Et() {
  (0, _classCallCheck2.default)(this, Et);
});
var vt = /*#__PURE__*/(0, _createClass2.default)(function vt(e, t, s) {
  (0, _classCallCheck2.default)(this, vt);
  this.teamId = e, this.teamData = JSON.stringify(t), this.agentData = JSON.stringify(s);
});
var bt = /*#__PURE__*/(0, _createClass2.default)(function bt(e) {
  (0, _classCallCheck2.default)(this, bt);
  this.teamId = e;
});
var Ct = /*#__PURE__*/(0, _createClass2.default)(function Ct(e) {
  (0, _classCallCheck2.default)(this, Ct);
  this.teamId = e;
});
var wt = {
    exports: {}
  },
  Mt = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
  It = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
  Nt = function Nt(e) {
    var t = e,
      s = e.indexOf("["),
      i = e.indexOf("]");
    -1 != s && -1 != i && (e = e.substring(0, s) + e.substring(s, i).replace(/:/g, ";") + e.substring(i, e.length));
    for (var n = Mt.exec(e || ""), o = {}, r = 14; r--;) {
      o[It[r]] = n[r] || "";
    }
    return -1 != s && -1 != i && (o.source = t, o.host = o.host.substring(1, o.host.length - 1).replace(/;/g, ":"), o.authority = o.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), o.ipv6uri = !0), o;
  },
  Tt = {
    exports: {}
  },
  Ot = {
    exports: {}
  },
  At = 1e3,
  Rt = 60 * At,
  kt = 60 * Rt,
  Pt = 24 * kt,
  _t = 365.25 * Pt,
  Dt = function Dt(e, t) {
    t = t || {};
    var s = (0, _typeof2.default)(e);
    if ("string" === s && e.length > 0) return function (e) {
      if (e = String(e), e.length > 100) return;
      var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);
      if (!t) return;
      var s = parseFloat(t[1]);
      switch ((t[2] || "ms").toLowerCase()) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return s * _t;
        case "days":
        case "day":
        case "d":
          return s * Pt;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return s * kt;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return s * Rt;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return s * At;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return s;
        default:
          return;
      }
    }(e);
    if ("number" === s && !1 === isNaN(e)) return t.long ? function (e) {
      return xt(e, Pt, "day") || xt(e, kt, "hour") || xt(e, Rt, "minute") || xt(e, At, "second") || e + " ms";
    }(e) : function (e) {
      if (e >= Pt) return Math.round(e / Pt) + "d";
      if (e >= kt) return Math.round(e / kt) + "h";
      if (e >= Rt) return Math.round(e / Rt) + "m";
      if (e >= At) return Math.round(e / At) + "s";
      return e + "ms";
    }(e);
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
  };
function xt(e, t, s) {
  if (!(e < t)) return e < 1.5 * t ? Math.floor(e / t) + " " + s : Math.ceil(e / t) + " " + s + "s";
}
!function (e, t) {
  function s(e) {
    var s;
    function n() {
      if (n.enabled) {
        var e = n,
          i = +new Date(),
          o = i - (s || i);
        e.diff = o, e.prev = s, e.curr = i, s = i;
        for (var r = new Array(arguments.length), a = 0; a < r.length; a++) {
          r[a] = arguments[a];
        }
        r[0] = t.coerce(r[0]), "string" != typeof r[0] && r.unshift("%O");
        var c = 0;
        r[0] = r[0].replace(/%([a-zA-Z%])/g, function (s, i) {
          if ("%%" === s) return s;
          c++;
          var n = t.formatters[i];
          if ("function" == typeof n) {
            var o = r[c];
            s = n.call(e, o), r.splice(c, 1), c--;
          }
          return s;
        }), t.formatArgs.call(e, r), (n.log || t.log || console.log.bind(console)).apply(e, r);
      }
    }
    return n.namespace = e, n.enabled = t.enabled(e), n.useColors = t.useColors(), n.color = function (e) {
      var s,
        i = 0;
      for (s in e) {
        i = (i << 5) - i + e.charCodeAt(s), i |= 0;
      }
      return t.colors[Math.abs(i) % t.colors.length];
    }(e), n.destroy = i, "function" == typeof t.init && t.init(n), t.instances.push(n), n;
  }
  function i() {
    var e = t.instances.indexOf(this);
    return -1 !== e && (t.instances.splice(e, 1), !0);
  }
  (t = Ot.exports = s.debug = s.default = s).coerce = function (e) {
    return e instanceof Error ? e.stack || e.message : e;
  }, t.disable = function () {
    t.enable("");
  }, t.enable = function (e) {
    var s;
    t.save(e), t.names = [], t.skips = [];
    var i = ("string" == typeof e ? e : "").split(/[\s,]+/),
      n = i.length;
    for (s = 0; s < n; s++) {
      i[s] && ("-" === (e = i[s].replace(/\*/g, ".*?"))[0] ? t.skips.push(new RegExp("^" + e.substr(1) + "$")) : t.names.push(new RegExp("^" + e + "$")));
    }
    for (s = 0; s < t.instances.length; s++) {
      var o = t.instances[s];
      o.enabled = t.enabled(o.namespace);
    }
  }, t.enabled = function (e) {
    if ("*" === e[e.length - 1]) return !0;
    var s, i;
    for (s = 0, i = t.skips.length; s < i; s++) {
      if (t.skips[s].test(e)) return !1;
    }
    for (s = 0, i = t.names.length; s < i; s++) {
      if (t.names[s].test(e)) return !0;
    }
    return !1;
  }, t.humanize = Dt, t.instances = [], t.names = [], t.skips = [], t.formatters = {};
}(0, Ot.exports), function (e, t) {
  function s() {
    var e;
    try {
      e = t.storage.debug;
    } catch (e) {}
    return !e && "undefined" != typeof process && "env" in process && (e = Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"diancan-user","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).DEBUG), e;
  }
  (t = e.exports = Ot.exports).log = function () {
    return "object" == (typeof console === "undefined" ? "undefined" : (0, _typeof2.default)(console)) && console.log && Function.prototype.apply.call(console.log, console, arguments);
  }, t.formatArgs = function (e) {
    var s = this.useColors;
    if (e[0] = (s ? "%c" : "") + this.namespace + (s ? " %c" : " ") + e[0] + (s ? "%c " : " ") + "+" + t.humanize(this.diff), !s) return;
    var i = "color: " + this.color;
    e.splice(1, 0, i, "color: inherit");
    var n = 0,
      o = 0;
    e[0].replace(/%[a-zA-Z%]/g, function (e) {
      "%%" !== e && (n++, "%c" === e && (o = n));
    }), e.splice(o, 0, i);
  }, t.save = function (e) {
    try {
      null == e ? t.storage.removeItem("debug") : t.storage.debug = e;
    } catch (e) {}
  }, t.load = s, t.useColors = function () {
    if ("undefined" != typeof window && window.process && "renderer" === window.process.type) return !0;
    if ("undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
    return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }, t.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function () {
    try {
      return window.localStorage;
    } catch (e) {}
  }(), t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"], t.formatters.j = function (e) {
    try {
      return JSON.stringify(e);
    } catch (e) {
      return "[UnexpectedJSONParseError]: " + e.message;
    }
  }, t.enable(s());
}(Tt, Tt.exports);
var Ut = Nt,
  Ft = Tt.exports("socket.io-client:url"),
  Gt = function Gt(e, t) {
    var s = e;
    t = t || "undefined" != typeof location && location, null == e && (e = t.protocol + "//" + t.host);
    "string" == typeof e && ("/" === e.charAt(0) && (e = "/" === e.charAt(1) ? t.protocol + e : t.host + e), /^(https?|wss?):\/\//.test(e) || (Ft("protocol-less url %s", e), e = void 0 !== t ? t.protocol + "//" + e : "https://" + e), Ft("parse %s", e), s = Ut(e));
    s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443"));
    s.path = s.path || "/";
    var i = -1 !== s.host.indexOf(":") ? "[" + s.host + "]" : s.host;
    return s.id = s.protocol + "://" + i + ":" + s.port, s.href = s.protocol + "://" + i + (t && t.port === s.port ? "" : ":" + s.port), s;
  };
var Lt = {},
  Bt = {}.toString,
  qt = Array.isArray || function (e) {
    return "[object Array]" == Bt.call(e);
  };
!function (e) {
  Tt.exports("socket.io-parser");
  var t = M.exports,
    s = qt;
  function i() {}
  e.protocol = 4, e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"], e.CONNECT = 0, e.DISCONNECT = 1, e.EVENT = 2, e.ACK = 3, e.ERROR = 4, e.BINARY_EVENT = 5, e.BINARY_ACK = 6, e.Encoder = i, e.Decoder = o;
  var n = e.ERROR + '"encode error"';
  function o() {
    this.reconstructor = null;
  }
  function r(t) {
    return {
      type: e.ERROR,
      data: "parser error: " + t
    };
  }
  i.prototype.encode = function (t, s) {
    var i = function (t) {
      var s = "" + t.type;
      e.BINARY_EVENT !== t.type && e.BINARY_ACK !== t.type || (s += t.attachments + "-");
      t.nsp && "/" !== t.nsp && (s += t.nsp + ",");
      null != t.id && (s += t.id);
      if (null != t.data) {
        var i = function (e) {
          try {
            return JSON.stringify(e);
          } catch (e) {
            return !1;
          }
        }(t.data);
        if (!1 === i) return n;
        s += i;
      }
      return s;
    }(t);
    s([i]);
  }, t(o.prototype), o.prototype.add = function (t) {
    var i;
    if ("string" != typeof t) throw new Error("Unknown type: " + t);
    i = function (t) {
      var i = 0,
        n = {
          type: Number(t.charAt(0))
        };
      if (null == e.types[n.type]) return r("unknown packet type " + n.type);
      if (e.BINARY_EVENT === n.type || e.BINARY_ACK === n.type) {
        for (var o = ""; "-" !== t.charAt(++i) && (o += t.charAt(i), i != t.length);) {
          ;
        }
        if (o != Number(o) || "-" !== t.charAt(i)) throw new Error("Illegal attachments");
        n.attachments = Number(o);
      }
      if ("/" === t.charAt(i + 1)) for (n.nsp = ""; ++i;) {
        if ("," === (c = t.charAt(i))) break;
        if (n.nsp += c, i === t.length) break;
      } else n.nsp = "/";
      var a = t.charAt(i + 1);
      if ("" !== a && Number(a) == a) {
        for (n.id = ""; ++i;) {
          var c;
          if (null == (c = t.charAt(i)) || Number(c) != c) {
            --i;
            break;
          }
          if (n.id += t.charAt(i), i === t.length) break;
        }
        n.id = Number(n.id);
      }
      if (t.charAt(++i)) {
        var u = function (e) {
          try {
            return JSON.parse(e);
          } catch (e) {
            return !1;
          }
        }(t.substr(i));
        if (!(!1 !== u && (n.type === e.ERROR || s(u)))) return r("invalid payload");
        n.data = u;
      }
      return n;
    }(t), this.emit("decoded", i);
  }, o.prototype.destroy = function () {
    this.reconstructor && this.reconstructor.finishedReconstruction();
  };
}(Lt);
var jt = {
    exports: {}
  },
  Vt = {},
  Ht = {},
  zt = Object.keys || function (e) {
    var t = [],
      s = Object.prototype.hasOwnProperty;
    for (var i in e) {
      s.call(e, i) && t.push(i);
    }
    return t;
  },
  Wt = qt,
  Jt = Object.prototype.toString,
  Xt = "function" == typeof Blob || "undefined" != typeof Blob && "[object BlobConstructor]" === Jt.call(Blob),
  $t = "function" == typeof File || "undefined" != typeof File && "[object FileConstructor]" === Jt.call(File),
  Qt = function e(t) {
    if (!t || "object" != (0, _typeof2.default)(t)) return !1;
    if (Wt(t)) {
      for (var s = 0, i = t.length; s < i; s++) {
        if (e(t[s])) return !0;
      }
      return !1;
    }
    if ("function" == typeof Buffer && Buffer.isBuffer && Buffer.isBuffer(t) || "function" == typeof ArrayBuffer && t instanceof ArrayBuffer || Xt && t instanceof Blob || $t && t instanceof File) return !0;
    if (t.toJSON && "function" == typeof t.toJSON && 1 === arguments.length) return e(t.toJSON(), !0);
    for (var n in t) {
      if (Object.prototype.hasOwnProperty.call(t, n) && e(t[n])) return !0;
    }
    return !1;
  };
var Yt = function Yt(e, t, s) {
  var i = !1;
  return s = s || Kt, n.count = e, 0 === e ? t() : n;
  function n(e, o) {
    if (n.count <= 0) throw new Error("after called too many times");
    --n.count, e ? (i = !0, t(e), t = s) : 0 !== n.count || i || t(null, o);
  }
};
function Kt() {}
var Zt,
  es,
  ts,
  ss = String.fromCharCode;
function is(e) {
  for (var t, s, i = [], n = 0, o = e.length; n < o;) {
    (t = e.charCodeAt(n++)) >= 55296 && t <= 56319 && n < o ? 56320 == (64512 & (s = e.charCodeAt(n++))) ? i.push(((1023 & t) << 10) + (1023 & s) + 65536) : (i.push(t), n--) : i.push(t);
  }
  return i;
}
function ns(e, t) {
  if (e >= 55296 && e <= 57343) {
    if (t) throw Error("Lone surrogate U+" + e.toString(16).toUpperCase() + " is not a scalar value");
    return !1;
  }
  return !0;
}
function os(e, t) {
  return ss(e >> t & 63 | 128);
}
function rs(e, t) {
  if (0 == (4294967168 & e)) return ss(e);
  var s = "";
  return 0 == (4294965248 & e) ? s = ss(e >> 6 & 31 | 192) : 0 == (4294901760 & e) ? (ns(e, t) || (e = 65533), s = ss(e >> 12 & 15 | 224), s += os(e, 6)) : 0 == (4292870144 & e) && (s = ss(e >> 18 & 7 | 240), s += os(e, 12), s += os(e, 6)), s += ss(63 & e | 128);
}
function as() {
  if (ts >= es) throw Error("Invalid byte index");
  var e = 255 & Zt[ts];
  if (ts++, 128 == (192 & e)) return 63 & e;
  throw Error("Invalid continuation byte");
}
function cs(e) {
  var t, s;
  if (ts > es) throw Error("Invalid byte index");
  if (ts == es) return !1;
  if (t = 255 & Zt[ts], ts++, 0 == (128 & t)) return t;
  if (192 == (224 & t)) {
    if ((s = (31 & t) << 6 | as()) >= 128) return s;
    throw Error("Invalid continuation byte");
  }
  if (224 == (240 & t)) {
    if ((s = (15 & t) << 12 | as() << 6 | as()) >= 2048) return ns(s, e) ? s : 65533;
    throw Error("Invalid continuation byte");
  }
  if (240 == (248 & t) && (s = (7 & t) << 18 | as() << 12 | as() << 6 | as()) >= 65536 && s <= 1114111) return s;
  throw Error("Invalid UTF-8 detected");
}
var us = {
    version: "2.1.2",
    encode: function encode(e, t) {
      for (var s = !1 !== (t = t || {}).strict, i = is(e), n = i.length, o = -1, r = ""; ++o < n;) {
        r += rs(i[o], s);
      }
      return r;
    },
    decode: function decode(e, t) {
      var s = !1 !== (t = t || {}).strict;
      Zt = is(e), es = Zt.length, ts = 0;
      for (var i, n = []; !1 !== (i = cs(s));) {
        n.push(i);
      }
      return function (e) {
        for (var t, s = e.length, i = -1, n = ""; ++i < s;) {
          (t = e[i]) > 65535 && (n += ss((t -= 65536) >>> 10 & 1023 | 55296), t = 56320 | 1023 & t), n += ss(t);
        }
        return n;
      }(n);
    }
  },
  ls = void 0 !== ls ? ls : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder && MozBlobBuilder,
  ds = function () {
    try {
      return 2 === new Blob(["hi"]).size;
    } catch (e) {
      return !1;
    }
  }(),
  hs = ds && function () {
    try {
      return 2 === new Blob([new Uint8Array([1, 2])]).size;
    } catch (e) {
      return !1;
    }
  }(),
  ps = ls && ls.prototype.append && ls.prototype.getBlob;
function ms(e) {
  return e.map(function (e) {
    if (e.buffer instanceof ArrayBuffer) {
      var t = e.buffer;
      if (e.byteLength !== t.byteLength) {
        var s = new Uint8Array(e.byteLength);
        s.set(new Uint8Array(t, e.byteOffset, e.byteLength)), t = s.buffer;
      }
      return t;
    }
    return e;
  });
}
function fs(e, t) {
  t = t || {};
  var s = new ls();
  return ms(e).forEach(function (e) {
    s.append(e);
  }), t.type ? s.getBlob(t.type) : s.getBlob();
}
function gs(e, t) {
  return new Blob(ms(e), t || {});
}
"undefined" != typeof Blob && (fs.prototype = Blob.prototype, gs.prototype = Blob.prototype);
var ys = ds ? hs ? Blob : gs : ps ? fs : void 0;
!function (e) {
  var t = zt,
    s = Qt,
    i = Yt,
    n = us;
  "undefined" != typeof navigator && /Android/i.test(navigator.userAgent), "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent), e.protocol = 3;
  var o = e.packets = {
      open: 0,
      close: 1,
      ping: 2,
      pong: 3,
      message: 4,
      upgrade: 5,
      noop: 6
    },
    r = t(o),
    a = {
      type: "error",
      data: "parser error"
    },
    c = ys;
  e.encodePacket = function (e, t, s, i) {
    "function" == typeof t && (i = t, t = !1), "function" == typeof s && (i = s, s = null), void 0 === e.data || e.data.buffer || e.data;
    var r = o[e.type];
    return void 0 !== e.data && (r += s ? n.encode(String(e.data), {
      strict: !1
    }) : String(e.data)), i("" + r);
  }, e.decodePacket = function (e, t, s) {
    if (void 0 === e) return a;
    if ("string" == typeof e) {
      if (s && !1 === (e = function (e) {
        try {
          e = n.decode(e, {
            strict: !1
          });
        } catch (e) {
          return !1;
        }
        return e;
      }(e))) return a;
      var i = e.charAt(0);
      return Number(i) == i && r[i] ? e.length > 1 ? {
        type: r[i],
        data: e.substring(1)
      } : {
        type: r[i]
      } : a;
    }
    i = new Uint8Array(e)[0];
    var o = sliceBuffer(e, 1);
    return c && "blob" === t && (o = new c([o])), {
      type: r[i],
      data: o
    };
  }, e.encodePayload = function (t, n, o) {
    "function" == typeof n && (o = n, n = null);
    var r = s(t);
    if (!t.length) return o("0:");
    !function (e, t, s) {
      for (var n = new Array(e.length), o = i(e.length, s), r = function r(e, s, i) {
          t(s, function (t, s) {
            n[e] = s, i(t, n);
          });
        }, a = 0; a < e.length; a++) {
        r(a, e[a], o);
      }
    }(t, function (t, s) {
      e.encodePacket(t, !!r && n, !0, function (e) {
        s(null, function (e) {
          return e.length + ":" + e;
        }(e));
      });
    }, function (e, t) {
      return o(t.join(""));
    });
  }, e.decodePayload = function (t, s, i) {
    var n;
    if ("function" == typeof s && (i = s, s = null), "" === t) return i(a, 0, 1);
    for (var o, r, c = "", u = 0, l = t.length; u < l; u++) {
      var d = t.charAt(u);
      if (":" === d) {
        if ("" === c || c != (o = Number(c))) return i(a, 0, 1);
        if (c != (r = t.substr(u + 1, o)).length) return i(a, 0, 1);
        if (r.length) {
          if (n = e.decodePacket(r, s, !0), a.type === n.type && a.data === n.data) return i(a, 0, 1);
          if (!1 === i(n, u + o, l)) return;
        }
        u += o, c = "";
      } else c += d;
    }
    return "" !== c ? i(a, 0, 1) : void 0;
  };
}(Ht);
var Ss = Ht,
  Es = vs;
function vs(e) {
  this.path = e.path, this.hostname = e.hostname, this.port = e.port, this.secure = e.secure, this.query = e.query, this.timestampParam = e.timestampParam, this.timestampRequests = e.timestampRequests, this.readyState = "", this.agent = e.agent || !1, this.socket = e.socket, this.enablesXDR = e.enablesXDR, this.pfx = e.pfx, this.key = e.key, this.passphrase = e.passphrase, this.cert = e.cert, this.ca = e.ca, this.ciphers = e.ciphers, this.rejectUnauthorized = e.rejectUnauthorized, this.forceNode = e.forceNode, this.isReactNative = e.isReactNative, this.extraHeaders = e.extraHeaders, this.localAddress = e.localAddress;
}
(0, M.exports)(vs.prototype), vs.prototype.onError = function (e, t) {
  var s = new Error(e);
  return s.type = "TransportError", s.description = t, this.emit("error", s), this;
}, vs.prototype.open = function () {
  return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this;
}, vs.prototype.close = function () {
  return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this;
}, vs.prototype.send = function (e) {
  if ("open" !== this.readyState) throw new Error("Transport not open");
  this.write(e);
}, vs.prototype.onOpen = function () {
  this.readyState = "open", this.writable = !0, this.emit("open");
}, vs.prototype.onData = function (e) {
  var t = Ss.decodePacket(e, this.socket.binaryType);
  this.onPacket(t);
}, vs.prototype.onPacket = function (e) {
  this.emit("packet", e);
}, vs.prototype.onClose = function () {
  this.readyState = "closed", this.emit("close");
};
var bs,
  Cs = {
    encode: function encode(e) {
      var t = "";
      for (var s in e) {
        e.hasOwnProperty(s) && (t.length && (t += "&"), t += encodeURIComponent(s) + "=" + encodeURIComponent(e[s]));
      }
      return t;
    },
    decode: function decode(e) {
      for (var t = {}, s = e.split("&"), i = 0, n = s.length; i < n; i++) {
        var o = s[i].split("=");
        t[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
      }
      return t;
    }
  },
  ws = function ws(e, t) {
    var s = function s() {};
    s.prototype = t.prototype, e.prototype = new s(), e.prototype.constructor = e;
  },
  Ms = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),
  Is = 64,
  Ns = {},
  Ts = 0,
  Os = 0;
function As(e) {
  var t = "";
  do {
    t = Ms[e % Is] + t, e = Math.floor(e / Is);
  } while (e > 0);
  return t;
}
function Rs() {
  var e = As(+new Date());
  return e !== bs ? (Ts = 0, bs = e) : e + "." + As(Ts++);
}
for (; Os < Is; Os++) {
  Ns[Ms[Os]] = Os;
}
Rs.encode = As, Rs.decode = function (e) {
  var t = 0;
  for (Os = 0; Os < e.length; Os++) {
    t = t * Is + Ns[e.charAt(Os)];
  }
  return t;
};
var ks = Rs,
  Ps = {
    exports: {}
  };
try {
  Ps.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
} catch (e) {
  Ps.exports = !1;
}
var _s = Ps.exports,
  Ds = function Ds(e) {
    var t = e.xdomain,
      s = e.xscheme,
      i = e.enablesXDR;
    try {
      if ("undefined" != typeof XMLHttpRequest && (!t || _s)) return new XMLHttpRequest();
    } catch (e) {}
    try {
      if ("undefined" != typeof XDomainRequest && !s && i) return new XDomainRequest();
    } catch (e) {}
    if (!t) try {
      return new self[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch (e) {}
  },
  xs = Es,
  Us = Cs,
  Fs = Ht,
  Gs = ws,
  Ls = ks,
  Bs = Tt.exports("engine.io-client:polling"),
  qs = Vs,
  js = null != new Ds({
    xdomain: !1
  }).responseType;
function Vs(e) {
  var t = e && e.forceBase64;
  js && !t || (this.supportsBinary = !1), xs.call(this, e);
}
Gs(Vs, xs), Vs.prototype.name = "polling", Vs.prototype.doOpen = function () {
  this.poll();
}, Vs.prototype.pause = function (e) {
  var t = this;
  function s() {
    Bs("paused"), t.readyState = "paused", e();
  }
  if (this.readyState = "pausing", this.polling || !this.writable) {
    var i = 0;
    this.polling && (Bs("we are currently polling - waiting to pause"), i++, this.once("pollComplete", function () {
      Bs("pre-pause polling complete"), --i || s();
    })), this.writable || (Bs("we are currently writing - waiting to pause"), i++, this.once("drain", function () {
      Bs("pre-pause writing complete"), --i || s();
    }));
  } else s();
}, Vs.prototype.poll = function () {
  Bs("polling"), this.polling = !0, this.doPoll(), this.emit("poll");
}, Vs.prototype.onData = function (e) {
  var t = this;
  Bs("polling got data %s", e);
  Fs.decodePayload(e, this.socket.binaryType, function (e, s, i) {
    if ("opening" === t.readyState && t.onOpen(), "close" === e.type) return t.onClose(), !1;
    t.onPacket(e);
  }), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState ? this.poll() : Bs('ignoring poll - transport state "%s"', this.readyState));
}, Vs.prototype.doClose = function () {
  var e = this;
  function t() {
    Bs("writing close packet"), e.write([{
      type: "close"
    }]);
  }
  "open" === this.readyState ? (Bs("transport open - closing"), t()) : (Bs("transport not open - deferring close"), this.once("open", t));
}, Vs.prototype.write = function (e) {
  var t = this;
  this.writable = !1;
  var s = function s() {
    t.writable = !0, t.emit("drain");
  };
  Fs.encodePayload(e, this.supportsBinary, function (e) {
    t.doWrite(e, s);
  });
}, Vs.prototype.uri = function () {
  var e = this.query || {},
    t = this.secure ? "https" : "http",
    s = "";
  return !1 !== this.timestampRequests && (e[this.timestampParam] = Ls()), this.supportsBinary || e.sid || (e.b64 = 1), e = Us.encode(e), this.port && ("https" === t && 443 !== Number(this.port) || "http" === t && 80 !== Number(this.port)) && (s = ":" + this.port), e.length && (e = "?" + e), t + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + s + this.path + e;
};
var Hs,
  zs = qs,
  Ws = Ys,
  Js = /\n/g,
  Xs = /\\n/g;
function $s() {}
function Qs() {
  return "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== C ? C : {};
}
function Ys(e) {
  if (zs.call(this, e), this.query = this.query || {}, !Hs) {
    var t = Qs();
    Hs = t.___eio = t.___eio || [];
  }
  this.index = Hs.length;
  var s = this;
  Hs.push(function (e) {
    s.onData(e);
  }), this.query.j = this.index, "function" == typeof addEventListener && addEventListener("beforeunload", function () {
    s.script && (s.script.onerror = $s);
  }, !1);
}
ws(Ys, zs), Ys.prototype.supportsBinary = !1, Ys.prototype.doClose = function () {
  this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), zs.prototype.doClose.call(this);
}, Ys.prototype.doPoll = function () {
  var e = this,
    t = document.createElement("script");
  this.script && (this.script.parentNode.removeChild(this.script), this.script = null), t.async = !0, t.src = this.uri(), t.onerror = function (t) {
    e.onError("jsonp poll error", t);
  };
  var s = document.getElementsByTagName("script")[0];
  s ? s.parentNode.insertBefore(t, s) : (document.head || document.body).appendChild(t), this.script = t, "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout(function () {
    var e = document.createElement("iframe");
    document.body.appendChild(e), document.body.removeChild(e);
  }, 100);
}, Ys.prototype.doWrite = function (e, t) {
  var s = this;
  if (!this.form) {
    var i,
      n = document.createElement("form"),
      o = document.createElement("textarea"),
      r = this.iframeId = "eio_iframe_" + this.index;
    n.className = "socketio", n.style.position = "absolute", n.style.top = "-1000px", n.style.left = "-1000px", n.target = r, n.method = "POST", n.setAttribute("accept-charset", "utf-8"), o.name = "d", n.appendChild(o), document.body.appendChild(n), this.form = n, this.area = o;
  }
  function a() {
    c(), t();
  }
  function c() {
    if (s.iframe) try {
      s.form.removeChild(s.iframe);
    } catch (e) {
      s.onError("jsonp polling iframe removal error", e);
    }
    try {
      var e = '<iframe src="javascript:0" name="' + s.iframeId + '">';
      i = document.createElement(e);
    } catch (e) {
      (i = document.createElement("iframe")).name = s.iframeId, i.src = "javascript:0";
    }
    i.id = s.iframeId, s.form.appendChild(i), s.iframe = i;
  }
  this.form.action = this.uri(), c(), e = e.replace(Xs, "\\\n"), this.area.value = e.replace(Js, "\\n");
  try {
    this.form.submit();
  } catch (e) {}
  this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
    "complete" === s.iframe.readyState && a();
  } : this.iframe.onload = a;
};
var Ks,
  Zs,
  ei = Es,
  ti = Ht,
  si = Cs,
  ii = ws,
  ni = ks,
  oi = Tt.exports("engine.io-client:websocket");
("undefined" == typeof uni && "undefined" == typeof wx && "undefined" == typeof my && "undefined" == typeof swan || "undefined" != typeof WebSocket) && ("undefined" != typeof WebSocket ? Ks = WebSocket : "undefined" != typeof self && (Ks = self.WebSocket || self.MozWebSocket));
var ri = Ks || Zs;
("undefined" == typeof uni && "undefined" == typeof wx && "undefined" == typeof my && "undefined" == typeof swan || "undefined" != typeof WebSocket) && "undefined" == typeof GameGlobal || (ri = function ri(e) {
  var t = this;
  if (t.onopen = function () {}, t.onclose = function () {}, t.onmessage = function (e) {}, t.onerror = function (e) {}, "object" == (typeof tt === "undefined" ? "undefined" : (0, _typeof2.default)(tt)) && tt.getSystemInfo) {
    var _s16 = tt.connectSocket({
      url: e
    });
    t.send = function (e) {
      _s16.send({
        data: e
      });
    }, t.close = function () {
      _s16.close();
    }, _s16.onOpen(function () {
      t.onopen();
    }), _s16.onError(function (e) {
      t.onerror(e);
    }), _s16.onMessage(function (e) {
      t.onmessage(e);
    }), _s16.onClose(function () {
      t.onclose();
    });
  } else if ("undefined" != typeof my) my.connectSocket({
    url: e
  }), t.send = function (e) {
    my.sendSocketMessage({
      data: e
    });
  }, t.close = function (e) {
    my.closeSocket();
  }, my.onSocketOpen(function (e) {
    t.onopen();
  }), my.onSocketError(function (e) {
    t.onerror(e);
  }), my.onSocketMessage(function (e) {
    t.onmessage(e);
  }), my.onSocketClose(function (e) {
    t.onclose(e);
  });else if ("undefined" != typeof swan) swan.connectSocket({
    url: e
  }), t.send = function (e) {
    swan.sendSocketMessage({
      data: e
    });
  }, t.close = function (e) {
    swan.closeSocket();
  }, swan.onSocketOpen(function (e) {
    t.onopen();
  }), swan.onSocketError(function (e) {
    t.onerror(e);
  }), swan.onSocketMessage(function (e) {
    t.onmessage(e);
  }), swan.onSocketClose(function (e) {
    t.onclose(e);
  });else if ("undefined" != typeof uni) {
    var s = uni.connectSocket({
      url: e,
      complete: function complete() {}
    });
    t.send = function (e) {
      s.send({
        data: e
      });
    }, t.close = function () {
      s.close();
    }, s.onOpen(function (e) {
      t.onopen();
    }), s.onError(function (e) {
      t.onerror(e);
    }), s.onMessage(function (e) {
      t.onmessage(e);
    }), s.onClose(function (e) {
      t.onclose();
    });
  } else {
    var i = wx.connectSocket({
      url: e
    });
    t.send = function (e) {
      i.send({
        data: e
      });
    }, t.close = function (e) {
      i.close({
        code: 1e3
      });
    }, i.onOpen(function () {
      t.onopen();
    }), i.onError(function (e) {
      t.onerror(e);
    }), i.onMessage(function (e) {
      t.onmessage(e);
    }), i.onClose(function (e) {
      t.onclose(e);
    });
  }
});
var ai = ci;
function ci(e) {
  e && e.forceBase64 && (this.supportsBinary = !1), ("undefined" == typeof uni && "undefined" == typeof wx && "undefined" == typeof my && "undefined" == typeof swan || "undefined" != typeof WebSocket) && (this.perMessageDeflate = e.perMessageDeflate, this.usingBrowserWebSocket = Ks && !e.forceNode, this.protocols = e.protocols, this.usingBrowserWebSocket || (ri = Zs)), ei.call(this, e);
}
ii(ci, ei), ci.prototype.name = "websocket", ci.prototype.supportsBinary = !1, ci.prototype.doOpen = function () {
  var _this56 = this;
  if (this.check()) {
    var e,
      t,
      s = this.uri();
    if (("undefined" == typeof uni && "undefined" == typeof wx && "undefined" == typeof my && "undefined" == typeof swan || "undefined" != typeof WebSocket) && (e = this.protocols), (t = "undefined" == typeof uni && "undefined" == typeof wx && "undefined" == typeof my && "undefined" == typeof swan || "undefined" != typeof WebSocket ? {
      agent: this.agent,
      perMessageDeflate: this.perMessageDeflate
    } : {
      agent: this.agent
    }).pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, "object" == (typeof navigator === "undefined" ? "undefined" : (0, _typeof2.default)(navigator)) && "ReactNative" === navigator.product && (t = {}), this.extraHeaders && (t.headers = this.extraHeaders), this.localAddress && (t.localAddress = this.localAddress), "undefined" != typeof cc && "Windows" === cc.sys.os) cc.resources.load("cacert", function (e, t) {
      var i = t.nativeUrl;
      _this56.ws = new ri(s, [], i), _this56.ws.binaryType = "arraybuffer", _this56.addEventListeners();
    });else {
      try {
        "undefined" == typeof uni && "undefined" == typeof wx && "undefined" == typeof my && "undefined" == typeof swan || "undefined" != typeof WebSocket ? this.ws = this.usingBrowserWebSocket && !this.isReactNative ? e ? new ri(s, e) : new ri(s) : new ri(s, e, t) : this.ws = new ri(s);
      } catch (e) {
        return this.emit("error", e);
      }
      void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners();
    }
  }
}, ci.prototype.addEventListeners = function () {
  var e = this;
  this.ws.onopen = function () {
    e.onOpen();
  }, this.ws.onclose = function () {
    e.onClose();
  }, this.ws.onmessage = function (t) {
    e.onData(t.data);
  }, this.ws.onerror = function (t) {
    e.onError("websocket error", t);
  };
}, ci.prototype.write = function (e) {
  var t = this;
  this.writable = !1;
  for (var s = e.length, i = 0, n = s; i < n; i++) {
    !function (e) {
      ti.encodePacket(e, t.supportsBinary, function (i) {
        if ("undefined" == typeof uni && "undefined" == typeof wx && "undefined" == typeof my && "undefined" == typeof swan || "undefined" != typeof WebSocket) {
          if (!t.usingBrowserWebSocket) {
            var n = {};
            if (e.options && (n.compress = e.options.compress), t.perMessageDeflate) ("string" == typeof i ? Buffer.byteLength(i) : i.length) < t.perMessageDeflate.threshold && (n.compress = !1);
          }
          try {
            t.usingBrowserWebSocket ? t.ws.send(i) : t.ws.send(i, n);
          } catch (e) {
            oi("websocket closed before onclose event");
          }
        } else try {
          t.ws.send(i);
        } catch (e) {
          oi("websocket closed before onclose event");
        }
        --s || o();
      });
    }(e[i]);
  }
  function o() {
    t.emit("flush"), setTimeout(function () {
      t.writable = !0, t.emit("drain");
    }, 0);
  }
}, ci.prototype.onClose = function () {
  ei.prototype.onClose.call(this);
}, ci.prototype.doClose = function () {
  void 0 !== this.ws && this.ws.close();
}, ci.prototype.uri = function () {
  var e = this.query || {},
    t = this.secure ? "wss" : "ws",
    s = "";
  return this.port && ("wss" === t && 443 !== Number(this.port) || "ws" === t && 80 !== Number(this.port)) && (s = ":" + this.port), this.timestampRequests && (e[this.timestampParam] = ni()), this.supportsBinary || (e.b64 = 1), (e = si.encode(e)).length && (e = "?" + e), t + "://" + (-1 !== this.hostname.indexOf(":") ? "[" + this.hostname + "]" : this.hostname) + s + this.path + e;
}, ci.prototype.check = function () {
  return !(!ri || "__initialize" in ri && this.name === ci.prototype.name);
};
var ui = Ws,
  li = ai;
Vt.polling = function (e) {
  var t = !1,
    s = !1;
  if (e.jsonp, "undefined" != typeof location) {
    var i = "https:" === location.protocol,
      n = location.port;
    n || (n = i ? 443 : 80), t = e.hostname !== location.hostname || n !== e.port, s = e.secure !== i;
  }
  return e.xdomain = t, e.xscheme = s, new ui(e);
}, Vt.websocket = li;
var di = [].indexOf,
  hi = function hi(e, t) {
    if (di) return e.indexOf(t);
    for (var s = 0; s < e.length; ++s) {
      if (e[s] === t) return s;
    }
    return -1;
  },
  pi = Vt,
  mi = M.exports,
  fi = Tt.exports("engine.io-client:socket"),
  gi = hi,
  yi = Ht,
  Si = Nt,
  Ei = Cs,
  vi = bi;
function bi(e, t) {
  if (!(this instanceof bi)) return new bi(e, t);
  t = t || {}, e && "object" == (0, _typeof2.default)(e) && (t = e, e = null), e ? (e = Si(e), t.hostname = e.host, t.secure = "https" === e.protocol || "wss" === e.protocol, t.port = e.port, e.query && (t.query = e.query)) : t.host && (t.hostname = Si(t.host).host), this.secure = null != t.secure ? t.secure : "undefined" != typeof location && "https:" === location.protocol, t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.agent = t.agent || !1, this.hostname = t.hostname || ("undefined" != typeof location ? location.hostname : "localhost"), this.port = t.port || ("undefined" != typeof location && location.port ? location.port : this.secure ? 443 : 80), this.query = t.query || {}, "string" == typeof this.query && (this.query = Ei.decode(this.query)), this.upgrade = !1 !== t.upgrade, this.path = (t.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!t.forceJSONP, this.jsonp = !1 !== t.jsonp, this.forceBase64 = !!t.forceBase64, this.enablesXDR = !!t.enablesXDR, this.timestampParam = t.timestampParam || "t", this.timestampRequests = t.timestampRequests, this.transports = t.transports || ["polling", "websocket"], this.transportOptions = t.transportOptions || {}, this.readyState = "", this.writeBuffer = [], this.prevBufferLen = 0, this.policyPort = t.policyPort || 843, this.rememberUpgrade = t.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = t.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== t.perMessageDeflate && (t.perMessageDeflate || {}), !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), this.pfx = t.pfx || null, this.key = t.key || null, this.passphrase = t.passphrase || null, this.cert = t.cert || null, this.ca = t.ca || null, this.ciphers = t.ciphers || null, this.rejectUnauthorized = void 0 === t.rejectUnauthorized || t.rejectUnauthorized, this.forceNode = !!t.forceNode, this.isReactNative = "undefined" != typeof navigator && "string" == typeof navigator.product && "reactnative" === navigator.product.toLowerCase(), ("undefined" == typeof self || this.isReactNative) && (t.extraHeaders && Object.keys(t.extraHeaders).length > 0 && (this.extraHeaders = t.extraHeaders), t.localAddress && (this.localAddress = t.localAddress)), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingIntervalTimer = null, this.pingTimeoutTimer = null, this.open();
}
bi.priorWebsocketSuccess = !1, mi(bi.prototype), bi.protocol = yi.protocol, bi.Socket = bi, bi.Transport = Es, bi.transports = Vt, bi.parser = Ht, bi.prototype.createTransport = function (e) {
  fi('creating transport "%s"', e);
  var t = function (e) {
    var t = {};
    for (var s in e) {
      e.hasOwnProperty(s) && (t[s] = e[s]);
    }
    return t;
  }(this.query);
  t.EIO = yi.protocol, t.transport = e;
  var s = this.transportOptions[e] || {};
  return this.id && (t.sid = this.id), new pi[e]({
    query: t,
    socket: this,
    agent: s.agent || this.agent,
    hostname: s.hostname || this.hostname,
    port: s.port || this.port,
    secure: s.secure || this.secure,
    path: s.path || this.path,
    forceJSONP: s.forceJSONP || this.forceJSONP,
    jsonp: s.jsonp || this.jsonp,
    forceBase64: s.forceBase64 || this.forceBase64,
    enablesXDR: s.enablesXDR || this.enablesXDR,
    timestampRequests: s.timestampRequests || this.timestampRequests,
    timestampParam: s.timestampParam || this.timestampParam,
    policyPort: s.policyPort || this.policyPort,
    pfx: s.pfx || this.pfx,
    key: s.key || this.key,
    passphrase: s.passphrase || this.passphrase,
    cert: s.cert || this.cert,
    ca: s.ca || this.ca,
    ciphers: s.ciphers || this.ciphers,
    rejectUnauthorized: s.rejectUnauthorized || this.rejectUnauthorized,
    perMessageDeflate: s.perMessageDeflate || this.perMessageDeflate,
    extraHeaders: s.extraHeaders || this.extraHeaders,
    forceNode: s.forceNode || this.forceNode,
    localAddress: s.localAddress || this.localAddress,
    requestTimeout: s.requestTimeout || this.requestTimeout,
    protocols: s.protocols || void 0,
    isReactNative: this.isReactNative
  });
}, bi.prototype.open = function () {
  var e;
  if (this.rememberUpgrade && bi.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) e = "websocket";else {
    if (0 === this.transports.length) {
      var t = this;
      return void setTimeout(function () {
        t.emit("error", "No transports available");
      }, 0);
    }
    e = this.transports[0];
  }
  this.readyState = "opening";
  try {
    e = this.createTransport(e);
  } catch (e) {
    return this.transports.shift(), void this.open();
  }
  e.open(), this.setTransport(e);
}, bi.prototype.setTransport = function (e) {
  fi("setting transport %s", e.name);
  var t = this;
  this.transport && (fi("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = e, e.on("drain", function () {
    t.onDrain();
  }).on("packet", function (e) {
    t.onPacket(e);
  }).on("error", function (e) {
    t.onError(e);
  }).on("close", function () {
    t.onClose("transport close");
  });
}, bi.prototype.probe = function (e) {
  fi('probing transport "%s"', e);
  var t = this.createTransport(e, {
      probe: 1
    }),
    s = !1,
    i = this;
  function n() {
    if (i.onlyBinaryUpgrades) {
      var n = !this.supportsBinary && i.transport.supportsBinary;
      s = s || n;
    }
    s || (fi('probe transport "%s" opened', e), t.send([{
      type: "ping",
      data: "probe"
    }]), t.once("packet", function (n) {
      if (!s) if ("pong" === n.type && "probe" === n.data) {
        if (fi('probe transport "%s" pong', e), i.upgrading = !0, i.emit("upgrading", t), !t) return;
        bi.priorWebsocketSuccess = "websocket" === t.name, fi('pausing current transport "%s"', i.transport.name), i.transport.pause(function () {
          s || "closed" !== i.readyState && (fi("changing transport and sending upgrade packet"), l(), i.setTransport(t), t.send([{
            type: "upgrade"
          }]), i.emit("upgrade", t), t = null, i.upgrading = !1, i.flush());
        });
      } else {
        fi('probe transport "%s" failed', e);
        var o = new Error("probe error");
        o.transport = t.name, i.emit("upgradeError", o);
      }
    }));
  }
  function o() {
    s || (s = !0, l(), t.close(), t = null);
  }
  function r(s) {
    var n = new Error("probe error: " + s);
    n.transport = t.name, o(), fi('probe transport "%s" failed because of error: %s', e, s), i.emit("upgradeError", n);
  }
  function a() {
    r("transport closed");
  }
  function c() {
    r("socket closed");
  }
  function u(e) {
    t && e.name !== t.name && (fi('"%s" works - aborting "%s"', e.name, t.name), o());
  }
  function l() {
    t.removeListener("open", n), t.removeListener("error", r), t.removeListener("close", a), i.removeListener("close", c), i.removeListener("upgrading", u);
  }
  bi.priorWebsocketSuccess = !1, t.once("open", n), t.once("error", r), t.once("close", a), this.once("close", c), this.once("upgrading", u), t.open();
}, bi.prototype.onOpen = function () {
  if (fi("socket open"), this.readyState = "open", bi.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
    fi("starting upgrade probes");
    for (var e = 0, t = this.upgrades.length; e < t; e++) {
      this.probe(this.upgrades[e]);
    }
  }
}, bi.prototype.onPacket = function (e) {
  if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (fi('socket receive: type "%s", data "%s"', e.type, e.data), this.emit("packet", e), this.emit("heartbeat"), e.type) {
    case "open":
      this.onHandshake(JSON.parse(e.data));
      break;
    case "pong":
      this.setPing(), this.emit("pong");
      break;
    case "error":
      var t = new Error("server error");
      t.code = e.data, this.onError(t);
      break;
    case "message":
      this.emit("data", e.data), this.emit("message", e.data);
  } else fi('packet received with socket readyState "%s"', this.readyState);
}, bi.prototype.onHandshake = function (e) {
  this.emit("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this.upgrades = this.filterUpgrades(e.upgrades), this.pingInterval = e.pingInterval, this.pingTimeout = e.pingTimeout, this.onOpen(), "closed" !== this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat));
}, bi.prototype.onHeartbeat = function (e) {
  clearTimeout(this.pingTimeoutTimer);
  var t = this;
  t.pingTimeoutTimer = setTimeout(function () {
    "closed" !== t.readyState && t.onClose("ping timeout");
  }, e || t.pingInterval + t.pingTimeout);
}, bi.prototype.setPing = function () {
  var e = this;
  clearTimeout(e.pingIntervalTimer), e.pingIntervalTimer = setTimeout(function () {
    fi("writing ping packet - expecting pong within %sms", e.pingTimeout), e.ping(), e.onHeartbeat(e.pingTimeout);
  }, e.pingInterval);
}, bi.prototype.ping = function () {
  var e = this;
  this.sendPacket("ping", function () {
    e.emit("ping");
  });
}, bi.prototype.onDrain = function () {
  this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush();
}, bi.prototype.flush = function () {
  "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (fi("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"));
}, bi.prototype.write = bi.prototype.send = function (e, t, s) {
  return this.sendPacket("message", e, t, s), this;
}, bi.prototype.sendPacket = function (e, t, s, i) {
  if ("function" == typeof t && (i = t, t = void 0), "function" == typeof s && (i = s, s = null), "closing" !== this.readyState && "closed" !== this.readyState) {
    (s = s || {}).compress = !1 !== s.compress;
    var n = {
      type: e,
      data: t,
      options: s
    };
    this.emit("packetCreate", n), this.writeBuffer.push(n), i && this.once("flush", i), this.flush();
  }
}, bi.prototype.close = function () {
  if ("opening" === this.readyState || "open" === this.readyState) {
    this.readyState = "closing";
    var e = this;
    this.writeBuffer.length ? this.once("drain", function () {
      this.upgrading ? i() : t();
    }) : this.upgrading ? i() : t();
  }
  function t() {
    e.onClose("forced close"), fi("socket closing - telling transport to close"), e.transport.close();
  }
  function s() {
    e.removeListener("upgrade", s), e.removeListener("upgradeError", s), t();
  }
  function i() {
    e.once("upgrade", s), e.once("upgradeError", s);
  }
  return this;
}, bi.prototype.onError = function (e) {
  fi("socket error %j", e), bi.priorWebsocketSuccess = !1, this.emit("error", e), this.onClose("transport error", e);
}, bi.prototype.onClose = function (e, t) {
  if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
    fi('socket close with reason: "%s"', e);
    clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", e, t), this.writeBuffer = [], this.prevBufferLen = 0;
  }
}, bi.prototype.filterUpgrades = function (e) {
  for (var t = [], s = 0, i = e.length; s < i; s++) {
    ~gi(this.transports, e[s]) && t.push(e[s]);
  }
  return t;
}, jt.exports = vi, jt.exports.parser = Ht;
var Ci = {
    exports: {}
  },
  wi = function wi(e, t) {
    for (var s = [], i = (t = t || 0) || 0; i < e.length; i++) {
      s[i - t] = e[i];
    }
    return s;
  };
var Mi = function Mi(e, t, s) {
  return e.on(t, s), {
    destroy: function destroy() {
      e.removeListener(t, s);
    }
  };
};
var Ii = [].slice,
  Ni = function Ni(e, t) {
    if ("string" == typeof t && (t = e[t]), "function" != typeof t) throw new Error("bind() requires a function");
    var s = Ii.call(arguments, 2);
    return function () {
      return t.apply(e, s.concat(Ii.call(arguments)));
    };
  };
!function (e, t) {
  var s = Lt,
    i = M.exports,
    n = wi,
    o = Mi,
    r = Ni,
    a = (Tt.exports("socket.io-client:socket"), Cs),
    c = Qt;
  e.exports = d;
  var u = {
      connect: 1,
      connect_error: 1,
      connect_timeout: 1,
      connecting: 1,
      disconnect: 1,
      error: 1,
      reconnect: 1,
      reconnect_attempt: 1,
      reconnect_failed: 1,
      reconnect_error: 1,
      reconnecting: 1,
      ping: 1,
      pong: 1
    },
    l = i.prototype.emit;
  function d(e, t, s) {
    this.io = e, this.nsp = t, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0, this.flags = {}, s && s.query && (this.query = s.query), this.io.autoConnect && this.open();
  }
  i(d.prototype), d.prototype.subEvents = function () {
    if (!this.subs) {
      var e = this.io;
      this.subs = [o(e, "open", r(this, "onopen")), o(e, "packet", r(this, "onpacket")), o(e, "close", r(this, "onclose"))];
    }
  }, d.prototype.open = d.prototype.connect = function () {
    return this.connected || (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), this.emit("connecting")), this;
  }, d.prototype.send = function () {
    var e = n(arguments);
    return e.unshift("message"), this.emit.apply(this, e), this;
  }, d.prototype.emit = function (e) {
    if (u.hasOwnProperty(e)) return l.apply(this, arguments), this;
    var t = n(arguments),
      i = {
        type: (void 0 !== this.flags.binary ? this.flags.binary : c(t)) ? s.BINARY_EVENT : s.EVENT,
        data: t,
        options: {}
      };
    return i.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof t[t.length - 1] && (this.ids, this.acks[this.ids] = t.pop(), i.id = this.ids++), this.connected ? this.packet(i) : this.sendBuffer.push(i), this.flags = {}, this;
  }, d.prototype.packet = function (e) {
    e.nsp = this.nsp, this.io.packet(e);
  }, d.prototype.onopen = function () {
    if ("/" !== this.nsp) if (this.query) {
      var e = "object" == (0, _typeof2.default)(this.query) ? a.encode(this.query) : this.query;
      this.packet({
        type: s.CONNECT,
        query: e
      });
    } else this.packet({
      type: s.CONNECT
    });
  }, d.prototype.onclose = function (e) {
    this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", e);
  }, d.prototype.onpacket = function (e) {
    var t = e.nsp === this.nsp,
      i = e.type === s.ERROR && "/" === e.nsp;
    if (t || i) switch (e.type) {
      case s.CONNECT:
        this.onconnect();
        break;
      case s.EVENT:
      case s.BINARY_EVENT:
        this.onevent(e);
        break;
      case s.ACK:
      case s.BINARY_ACK:
        this.onack(e);
        break;
      case s.DISCONNECT:
        this.ondisconnect();
        break;
      case s.ERROR:
        this.emit("error", e.data);
    }
  }, d.prototype.onevent = function (e) {
    var t = e.data || [];
    null != e.id && t.push(this.ack(e.id)), this.connected ? l.apply(this, t) : this.receiveBuffer.push(t);
  }, d.prototype.ack = function (e) {
    var t = this,
      i = !1;
    return function () {
      if (!i) {
        i = !0;
        var o = n(arguments);
        t.packet({
          type: c(o) ? s.BINARY_ACK : s.ACK,
          id: e,
          data: o
        });
      }
    };
  }, d.prototype.onack = function (e) {
    var t = this.acks[e.id];
    "function" == typeof t ? (e.id, e.data, t.apply(this, e.data), delete this.acks[e.id]) : e.id;
  }, d.prototype.onconnect = function () {
    this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered();
  }, d.prototype.emitBuffered = function () {
    var e;
    for (e = 0; e < this.receiveBuffer.length; e++) {
      l.apply(this, this.receiveBuffer[e]);
    }
    for (this.receiveBuffer = [], e = 0; e < this.sendBuffer.length; e++) {
      this.packet(this.sendBuffer[e]);
    }
    this.sendBuffer = [];
  }, d.prototype.ondisconnect = function () {
    this.nsp, this.destroy(), this.onclose("io server disconnect");
  }, d.prototype.destroy = function () {
    if (this.subs) {
      for (var e = 0; e < this.subs.length; e++) {
        this.subs[e].destroy();
      }
      this.subs = null;
    }
    this.io.destroy(this);
  }, d.prototype.close = d.prototype.disconnect = function () {
    return this.connected && (this.nsp, this.packet({
      type: s.DISCONNECT
    })), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }, d.prototype.compress = function (e) {
    return this.flags.compress = e, this;
  }, d.prototype.binary = function (e) {
    return this.flags.binary = e, this;
  };
}(Ci);
var Ti = Oi;
function Oi(e) {
  e = e || {}, this.ms = e.min || 100, this.max = e.max || 1e4, this.factor = e.factor || 2, this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0, this.attempts = 0;
}
Oi.prototype.duration = function () {
  var e = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var t = Math.random(),
      s = Math.floor(t * this.jitter * e);
    e = 0 == (1 & Math.floor(10 * t)) ? e - s : e + s;
  }
  return 0 | Math.min(e, this.max);
}, Oi.prototype.reset = function () {
  this.attempts = 0;
}, Oi.prototype.setMin = function (e) {
  this.ms = e;
}, Oi.prototype.setMax = function (e) {
  this.max = e;
}, Oi.prototype.setJitter = function (e) {
  this.jitter = e;
};
var Ai = /*#__PURE__*/function () {
  function Ai() {
    (0, _classCallCheck2.default)(this, Ai);
  }
  (0, _createClass2.default)(Ai, null, [{
    key: "init",
    value: function init(e, t, s) {
      this.host = e, (void 0 !== t && !1 === t || !0 === s) && (this.https = !1);
    }
  }, {
    key: "isMP",
    value: function isMP() {
      return [l.MP_WX, l.MP_ALI, l.MP_BYTE, l.MP_WGAME, l.MP_BAIDU].includes(d.currentPlatform());
    }
  }, {
    key: "uri",
    value: function uri() {
      var e = "http";
      return this.https && (e += "s"), e + "://" + this.index() + this.host;
    }
  }, {
    key: "index",
    value: function index() {
      return 0 == this.i ? this.i = Math.floor(Math.random() * (this.max - 1) + 1) : this.i = this.i % this.max + 1, this.i;
    }
  }]);
  return Ai;
}();
Ai.i = 0, Ai.max = 5, Ai.https = !0;
var Ri = w(Object.freeze({
    __proto__: null,
    URIResolver: Ai
  })),
  ki = w(E),
  Pi = jt.exports,
  _i = Ci.exports,
  Di = M.exports,
  xi = Lt,
  Ui = Mi,
  Fi = Ni,
  Gi = (Tt.exports("socket.io-client:manager"), hi),
  Li = Ti;
var Bi = Ri.URIResolver;
var qi = ki.runStatus,
  ji = Object.prototype.hasOwnProperty,
  Vi = Hi;
function Hi(e, t) {
  if (!(this instanceof Hi)) return new Hi(e, t);
  e && "object" == (0, _typeof2.default)(e) && (t = e, e = void 0), (t = t || {}).path = t.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = t, this.reconnection(!1 !== t.reconnection), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor(t.randomizationFactor || .5), this.backoff = new Li({
    min: this.reconnectionDelay(),
    max: this.reconnectionDelayMax(),
    jitter: this.randomizationFactor()
  }), this.timeout(null == t.timeout ? 2e4 : t.timeout), this.readyState = "closed", this.uri = e, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [];
  var s = t.parser || xi;
  this.encoder = new s.Encoder(), this.decoder = new s.Decoder(), this.autoConnect = !1 !== t.autoConnect, this.autoConnect && this.open();
}
Hi.prototype.emitAll = function () {
  for (var e in this.emit.apply(this, arguments), this.nsps) {
    ji.call(this.nsps, e) && this.nsps[e].emit.apply(this.nsps[e], arguments);
  }
}, Hi.prototype.updateSocketIds = function () {
  for (var e in this.nsps) {
    ji.call(this.nsps, e) && (this.nsps[e].id = this.generateId(e));
  }
}, Hi.prototype.generateId = function (e) {
  return ("/" === e ? "" : e + "#") + this.engine.id;
}, Di(Hi.prototype), Hi.prototype.reconnection = function (e) {
  return arguments.length ? (this._reconnection = !!e, this) : this._reconnection;
}, Hi.prototype.reconnectionAttempts = function (e) {
  return arguments.length ? (this._reconnectionAttempts = e, this) : this._reconnectionAttempts;
}, Hi.prototype.reconnectionDelay = function (e) {
  return arguments.length ? (this._reconnectionDelay = e, this.backoff && this.backoff.setMin(e), this) : this._reconnectionDelay;
}, Hi.prototype.randomizationFactor = function (e) {
  return arguments.length ? (this._randomizationFactor = e, this.backoff && this.backoff.setJitter(e), this) : this._randomizationFactor;
}, Hi.prototype.reconnectionDelayMax = function (e) {
  return arguments.length ? (this._reconnectionDelayMax = e, this.backoff && this.backoff.setMax(e), this) : this._reconnectionDelayMax;
}, Hi.prototype.timeout = function (e) {
  return arguments.length ? (this._timeout = e, this) : this._timeout;
}, Hi.prototype.maybeReconnectOnOpen = function () {
  !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
}, Hi.prototype.open = Hi.prototype.connect = function (e, t) {
  if (this.readyState, ~this.readyState.indexOf("open")) return this;
  this.uri, this.engine = Pi(this.uri, this.opts);
  var s = this.engine,
    i = this;
  this.readyState = "opening", this.skipReconnect = !1;
  var n = Ui(s, "open", function () {
      i.onopen(), e && e();
    }),
    o = Ui(s, "error", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee25(t) {
        var s;
        return _regenerator.default.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                if (i.uri = Bi.uri(), i.cleanup(), i.readyState = "closed", i.emitAll("connect_error", t), e) {
                  s = new Error("Connection error");
                  s.data = t, e(s);
                } else i.maybeReconnectOnOpen();
              case 1:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  if (!1 !== this._timeout) {
    var r = this._timeout,
      a = setTimeout(function () {
        n.destroy(), s.close(), s.emit("error", "timeout"), i.emitAll("connect_timeout", r);
      }, r);
    this.subs.push({
      destroy: function destroy() {
        clearTimeout(a);
      }
    });
  }
  return this.subs.push(n), this.subs.push(o), this;
}, Hi.prototype.onopen = function () {
  this.cleanup(), this.readyState = "open", this.emit("open");
  var e = this.engine;
  this.subs.push(Ui(e, "data", Fi(this, "ondata"))), this.subs.push(Ui(e, "ping", Fi(this, "onping"))), this.subs.push(Ui(e, "pong", Fi(this, "onpong"))), this.subs.push(Ui(e, "error", Fi(this, "onerror"))), this.subs.push(Ui(e, "close", Fi(this, "onclose"))), this.subs.push(Ui(this.decoder, "decoded", Fi(this, "ondecoded")));
}, Hi.prototype.onping = function () {
  this.lastPing = new Date(), this.emitAll("ping");
}, Hi.prototype.onpong = function () {
  this.emitAll("pong", new Date() - this.lastPing);
}, Hi.prototype.ondata = function (e) {
  this.decoder.add(e);
}, Hi.prototype.ondecoded = function (e) {
  this.emit("packet", e);
}, Hi.prototype.onerror = function (e) {
  this.emitAll("error", e);
}, Hi.prototype.socket = function (e, t) {
  var s = this.nsps[e];
  if (!s) {
    s = new _i(this, e, t), this.nsps[e] = s;
    var i = this;
    s.on("connecting", n), s.on("connect", function () {
      s.id = i.generateId(e);
    }), this.autoConnect && n();
  }
  function n() {
    ~Gi(i.connecting, s) || i.connecting.push(s);
  }
  return s;
}, Hi.prototype.destroy = function (e) {
  var t = Gi(this.connecting, e);
  ~t && this.connecting.splice(t, 1), this.connecting.length || this.close();
}, Hi.prototype.packet = function (e) {
  var t = this;
  e.query && 0 === e.type && (e.nsp += "?" + e.query), t.encoding ? t.packetBuffer.push(e) : (t.encoding = !0, this.encoder.encode(e, function (s) {
    for (var i = 0; i < s.length; i++) {
      t.engine.write(s[i], e.options);
    }
    t.encoding = !1, t.processPacketQueue();
  }));
}, Hi.prototype.processPacketQueue = function () {
  if (this.packetBuffer.length > 0 && !this.encoding) {
    var e = this.packetBuffer.shift();
    this.packet(e);
  }
}, Hi.prototype.cleanup = function () {
  for (var e = this.subs.length, t = 0; t < e; t++) {
    this.subs.shift().destroy();
  }
  this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy();
}, Hi.prototype.close = Hi.prototype.disconnect = function () {
  this.skipReconnect = !0, this.reconnecting = !1, "opening" === this.readyState && this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close();
}, Hi.prototype.onclose = function (e) {
  this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", e), this._reconnection && !this.skipReconnect && this.reconnect();
}, Hi.prototype.reconnect = function () {
  if (qi.isBackend(), this.reconnecting || this.skipReconnect) return this;
  var e = this;
  if (this.backoff.attempts >= this._reconnectionAttempts) this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;else {
    var t = this.backoff.duration();
    this.reconnecting = !0;
    var s = setTimeout(function () {
      if (qi.isBackend()) return e.reconnecting = !1, e.reconnect(), void e.emitAll("reconnect_error", "Uniapp running backend, skipped reconnect...");
      e.skipReconnect || (e.emitAll("reconnect_attempt", e.backoff.attempts), e.emitAll("reconnecting", e.backoff.attempts), e.skipReconnect || e.open(function (t) {
        t ? (e.reconnecting = !1, e.reconnect(), e.emitAll("reconnect_error", t.data)) : e.onreconnect();
      }));
    }, t);
    this.subs.push({
      destroy: function destroy() {
        clearTimeout(s);
      }
    });
  }
}, Hi.prototype.onreconnect = function () {
  var e = this.backoff.attempts;
  this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", e);
}, function (e, t) {
  var s = Gt,
    i = Lt,
    n = Vi;
  Tt.exports("socket.io-client");
  e.exports = t = r;
  var o = t.managers = {};
  function r(e, t) {
    "object" == (0, _typeof2.default)(e) && (t = e, e = void 0), t = t || {};
    var i,
      r = s(e),
      a = r.source,
      c = r.id,
      u = r.path,
      l = o[c] && u in o[c].nsps;
    return t.forceNew || t["force new connection"] || !1 === t.multiplex || l ? i = n(a, t) : (o[c] || (o[c] = n(a, t)), i = o[c]), r.query && !t.query && (t.query = r.query), i.socket(r.path, t);
  }
  t.protocol = i.protocol, t.connect = r, t.Manager = Vi, t.Socket = Ci.exports;
}(wt, wt.exports);
var zi = wt.exports;
var Wi = /*#__PURE__*/function () {
  function Wi() {
    (0, _classCallCheck2.default)(this, Wi);
    this.io = zi, this.status = t.DISCONNECTED, this.permissions = [ne.NONE], this.connectedObservers = [], this.disconnectedObservers = [];
  }
  (0, _createClass2.default)(Wi, [{
    key: "connect",
    value: function connect() {
      this.status = t.CONNECTING;
    }
  }, {
    key: "socketio",
    value: function socketio() {
      return this.io;
    }
  }, {
    key: "on",
    value: function on(e, t) {
      this.io.on(e, t);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.io.disconnect();
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      return this.status;
    }
  }, {
    key: "addConnectedObserver",
    value: function addConnectedObserver(e) {
      u.isFunction(e) && this.connectedObservers.push(e);
    }
  }, {
    key: "addDisconnectedObserver",
    value: function addDisconnectedObserver(e) {
      u.isFunction(e) && this.disconnectedObservers.push(e);
    }
  }, {
    key: "notify",
    value: function notify(e, t) {
      for (var _s17 = 0; _s17 < e.length; _s17++) {
        e[_s17](t);
      }
    }
  }]);
  return Wi;
}();
var Ji = /*#__PURE__*/function (_Wi) {
  (0, _inherits2.default)(Ji, _Wi);
  var _super21 = _createSuper(Ji);
  function Ji(e) {
    var _this57;
    (0, _classCallCheck2.default)(this, Ji);
    _this57 = _super21.call(this), _this57.reconnectingObservers = [], _this57.addReconnectingObserver(e.onReconnecting), _this57.addDisconnectedObserver(e.onDisconnected);
    return _this57;
  }
  (0, _createClass2.default)(Ji, [{
    key: "connect",
    value: function connect(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Ji.prototype), "connect", this).call(this), this.io = this.io.connect(e.uri, e.opts), this.initListener();
    }
  }, {
    key: "initListener",
    value: function initListener() {
      var _this58 = this;
      this.io.on("connect", function () {
        _this58.status = t.CONNECTED, _this58.notify(_this58.connectedObservers);
      }), this.io.on("reconnecting", function (e) {
        _this58.status = t.CONNECTING, _this58.notify(_this58.reconnectingObservers, e);
      }), this.io.on("disconnect", function () {
        _this58.status = t.DISCONNECTED, _this58.notify(_this58.disconnectedObservers);
      }), this.io.on("connect_error", function (e) {});
    }
  }, {
    key: "addReconnectingObserver",
    value: function addReconnectingObserver(e) {
      this.reconnectingObservers.push(e);
    }
  }]);
  return Ji;
}(Wi);
var Xi = /*#__PURE__*/function () {
  function Xi() {
    (0, _classCallCheck2.default)(this, Xi);
  }
  (0, _createClass2.default)(Xi, null, [{
    key: "get",
    value: function get(e) {
      var t = encodeURIComponent(e) + "=",
        s = document.cookie.split("; ");
      var _iterator3 = _createForOfIteratorHelper(s),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _e13 = _step3.value;
          if (_e13.startsWith(t)) return decodeURIComponent(_e13.substring(t.length));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return null;
    }
  }, {
    key: "set",
    value: function set(e, t, s, i) {
      var n = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "/";
      var o = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : !1;
      var r = encodeURIComponent(e) + "=" + encodeURIComponent(t);
      s instanceof Date && (r += "; expires=" + s.toGMTString()), n && (r += "; path=" + n), i && (r += "; domain=" + i), o && (r += "; secure"), document.cookie = r;
    }
  }, {
    key: "remove",
    value: function remove(e, t) {
      var s = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "/";
      var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : !1;
      Xi.set(e, "", new Date(0), t, s, i);
    }
  }]);
  return Xi;
}();
var $i = /*#__PURE__*/function () {
  function $i() {
    (0, _classCallCheck2.default)(this, $i);
  }
  (0, _createClass2.default)($i, [{
    key: "asyncGet",
    value: function asyncGet(e) {
      var t = this.get(e);
      return Promise.resolve(t);
    }
  }, {
    key: "asyncPut",
    value: function asyncPut(e, t) {
      return this.put(e, t), Promise.resolve();
    }
  }, {
    key: "get",
    value: function get(e) {
      var t = this.doGet(e);
      return t = JSON.parse(t), t;
    }
  }, {
    key: "put",
    value: function put(e, t) {
      this.doPut(e, JSON.stringify(t));
    }
  }]);
  return $i;
}();
var Qi = /*#__PURE__*/function (_$i) {
  (0, _inherits2.default)(Qi, _$i);
  var _super22 = _createSuper(Qi);
  function Qi() {
    var _this59;
    (0, _classCallCheck2.default)(this, Qi);
    _this59 = _super22.call(this), _this59.domain = null;
    _this59.domain = "undefined" != typeof location && /^(?:[A-za-z0-9-]+\.)+[A-za-z]{2,4}(?:[\/\?#][\/=\?%\-&~`@[\]\':+!\.#\w]*)?$/.test(location.host) ? location.host.split(".").slice(-2).join(".") : null;
    return _this59;
  }
  (0, _createClass2.default)(Qi, [{
    key: "doGet",
    value: function doGet(e) {
      return Xi.get(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      var s = new Date(2030, 12, 31, 0, 0, 0, 0),
        i = this.domain;
      Xi.set(e, t, s, i);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      var t = this.domain;
      Xi.remove(e, t);
    }
  }, {
    key: "support",
    value: function support() {
      return "undefined" != typeof navigator && !0 === navigator.cookieEnabled;
    }
  }]);
  return Qi;
}($i);
var Yi = /*#__PURE__*/function (_$i2) {
  (0, _inherits2.default)(Yi, _$i2);
  var _super23 = _createSuper(Yi);
  function Yi() {
    (0, _classCallCheck2.default)(this, Yi);
    return _super23.apply(this, arguments);
  }
  (0, _createClass2.default)(Yi, [{
    key: "doGet",
    value: function doGet(e) {
      return localStorage.getItem(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      localStorage.setItem(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      localStorage.removeItem(e);
    }
  }, {
    key: "support",
    value: function support() {
      return !("undefined" != typeof GameGlobal || "undefined" == typeof localStorage || !localStorage.setItem);
    }
  }]);
  return Yi;
}($i);
var Ki = /*#__PURE__*/function (_$i3) {
  (0, _inherits2.default)(Ki, _$i3);
  var _super24 = _createSuper(Ki);
  function Ki() {
    (0, _classCallCheck2.default)(this, Ki);
    return _super24.apply(this, arguments);
  }
  (0, _createClass2.default)(Ki, [{
    key: "doGet",
    value: function doGet(e) {
      return uni.getStorageSync(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      uni.setStorageSync(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      uni.removeStorageSync(e);
    }
  }, {
    key: "support",
    value: function support() {
      return !("object" != (typeof uni === "undefined" ? "undefined" : (0, _typeof2.default)(uni)) || !uni.getStorageSync);
    }
  }]);
  return Ki;
}($i);
var Zi = /*#__PURE__*/function (_$i4) {
  (0, _inherits2.default)(Zi, _$i4);
  var _super25 = _createSuper(Zi);
  function Zi() {
    (0, _classCallCheck2.default)(this, Zi);
    return _super25.apply(this, arguments);
  }
  (0, _createClass2.default)(Zi, [{
    key: "doGet",
    value: function doGet(e) {
      return cc.sys.localStorage.getItem(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      cc.sys.localStorage.setItem(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      cc.sys.localStorage.removeItem(e);
    }
  }, {
    key: "support",
    value: function support() {
      return "undefined" != typeof cc && void 0 !== cc.sys.localStorage;
    }
  }]);
  return Zi;
}($i);
var en = /*#__PURE__*/function (_$i5) {
  (0, _inherits2.default)(en, _$i5);
  var _super26 = _createSuper(en);
  function en() {
    (0, _classCallCheck2.default)(this, en);
    return _super26.apply(this, arguments);
  }
  (0, _createClass2.default)(en, [{
    key: "doGet",
    value: function doGet(e) {
      return wx.getStorageSync(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      wx.setStorageSync(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      wx.removeStorageSync(e);
    }
  }, {
    key: "support",
    value: function support() {
      return !("object" != (typeof wx === "undefined" ? "undefined" : (0, _typeof2.default)(wx)) || !wx.getStorageSync || "undefined" != typeof tt);
    }
  }]);
  return en;
}($i);
var tn = /*#__PURE__*/function (_$i6) {
  (0, _inherits2.default)(tn, _$i6);
  var _super27 = _createSuper(tn);
  function tn() {
    (0, _classCallCheck2.default)(this, tn);
    return _super27.apply(this, arguments);
  }
  (0, _createClass2.default)(tn, [{
    key: "asyncGet",
    value: function asyncGet(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee26() {
        var t;
        return _regenerator.default.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.next = 2;
                return i.asyncStorage.getItem(e);
              case 2:
                t = _context26.sent;
                return _context26.abrupt("return", JSON.parse(t));
              case 4:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26);
      }));
    }
  }, {
    key: "asyncPut",
    value: function asyncPut(e, t) {
      return i.asyncStorage.setItem(e, JSON.stringify(t));
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      throw new Error("Method not implemented.");
    }
  }, {
    key: "remove",
    value: function remove(e) {
      i.asyncStorage.removeItem(e);
    }
  }, {
    key: "support",
    value: function support() {
      return s.currentFramework() === e.REACT_NATIVE;
    }
  }, {
    key: "doGet",
    value: function doGet(e) {
      throw new Error("Method not implemented.");
    }
  }]);
  return tn;
}($i);
var sn = /*#__PURE__*/function (_$i7) {
  (0, _inherits2.default)(sn, _$i7);
  var _super28 = _createSuper(sn);
  function sn() {
    (0, _classCallCheck2.default)(this, sn);
    return _super28.apply(this, arguments);
  }
  (0, _createClass2.default)(sn, [{
    key: "doGet",
    value: function doGet(e) {
      var t = my.getStorageSync({
        key: e
      }).data || null;
      return "string" == typeof JSON.parse(t) ? JSON.parse(t) : t;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      my.setStorageSync({
        key: e,
        data: JSON.stringify(t)
      });
    }
  }, {
    key: "remove",
    value: function remove(e) {
      my.removeStorageSync({
        key: e
      });
    }
  }, {
    key: "support",
    value: function support() {
      return !("undefined" == typeof my || !my.getStorageSync);
    }
  }]);
  return sn;
}($i);
var nn = /*#__PURE__*/function (_$i8) {
  (0, _inherits2.default)(nn, _$i8);
  var _super29 = _createSuper(nn);
  function nn() {
    (0, _classCallCheck2.default)(this, nn);
    return _super29.apply(this, arguments);
  }
  (0, _createClass2.default)(nn, [{
    key: "doGet",
    value: function doGet(e) {
      return tt.getStorageSync(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      tt.setStorageSync(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      tt.removeStorageSync(e);
    }
  }, {
    key: "support",
    value: function support() {
      return !("object" != (typeof tt === "undefined" ? "undefined" : (0, _typeof2.default)(tt)) || !tt.getStorageSync);
    }
  }]);
  return nn;
}($i);
var on = /*#__PURE__*/function (_$i9) {
  (0, _inherits2.default)(on, _$i9);
  var _super30 = _createSuper(on);
  function on() {
    (0, _classCallCheck2.default)(this, on);
    return _super30.apply(this, arguments);
  }
  (0, _createClass2.default)(on, [{
    key: "doGet",
    value: function doGet(e) {
      return swan.getStorageSync(e) || null;
    }
  }, {
    key: "doPut",
    value: function doPut(e, t) {
      swan.setStorageSync(e, t);
    }
  }, {
    key: "remove",
    value: function remove(e) {
      swan.removeStorageSync(e);
    }
  }, {
    key: "support",
    value: function support() {
      return !("undefined" == typeof swan || !swan.getStorageSync);
    }
  }]);
  return on;
}($i);
var rn = /*#__PURE__*/function () {
  function rn() {
    (0, _classCallCheck2.default)(this, rn);
    this.supportedStorage = null;
    var e = rn.storages;
    e.push(new Ki()), e.push(new Zi()), e.push(new Yi()), e.push(new en()), e.push(new tn()), e.push(new sn()), e.push(new on()), e.push(new nn()), e.push(new Qi()), this.dispatch(), this.supportedStorage;
  }
  (0, _createClass2.default)(rn, [{
    key: "dispatch",
    value: function dispatch() {
      var _iterator4 = _createForOfIteratorHelper(rn.storages),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _e14 = _step4.value;
          if (_e14.support()) {
            this.supportedStorage = _e14;
            break;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }], [{
    key: "localStorage",
    value: function localStorage() {
      return this.instance.supportedStorage;
    }
  }]);
  return rn;
}();
rn.storages = new Array(), rn.instance = new rn();
var an = /*#__PURE__*/function () {
  function an() {
    (0, _classCallCheck2.default)(this, an);
  }
  (0, _createClass2.default)(an, null, [{
    key: "get",
    value: function get() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee27() {
        var e, t;
        return _regenerator.default.wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                t = rn.localStorage();
                _context27.t0 = null !== t;
                if (!_context27.t0) {
                  _context27.next = 6;
                  break;
                }
                _context27.next = 5;
                return t.asyncGet(an.SM_KEY);
              case 5:
                e = _context27.sent;
              case 6:
                return _context27.abrupt("return", e);
              case 7:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27);
      }));
    }
  }, {
    key: "put",
    value: function put(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee28() {
        var t, s;
        return _regenerator.default.wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                t = rn.localStorage();
                s = e.sm;
                null !== t && s && t.asyncPut(an.SM_KEY, s);
              case 3:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28);
      }));
    }
  }]);
  return an;
}();
an.SM_KEY = "GE-SM";
var cn = /*#__PURE__*/function () {
  function cn() {
    (0, _classCallCheck2.default)(this, cn);
  }
  (0, _createClass2.default)(cn, null, [{
    key: "e",
    value: function e(_e15, t) {
      function s(e) {
        return function (e) {
          return e >= 32 && e <= 126;
        }(e) ? String.fromCharCode(function (e) {
          var s = e + t;
          return s > 126 ? s - 126 + 32 : s;
        }(e)) : String.fromCharCode(e);
      }
      var i = "";
      for (var _t17 = 0; _t17 < _e15.length; _t17++) {
        i += s(_e15.charCodeAt(_t17));
      }
      return i;
    }
  }]);
  return cn;
}();
var un = /*#__PURE__*/function () {
  function un() {
    (0, _classCallCheck2.default)(this, un);
  }
  (0, _createClass2.default)(un, null, [{
    key: "initRNUniqueId",
    value: function initRNUniqueId() {
      if (s.currentFramework() === e.REACT_NATIVE) {
        var _e16 = i.platform,
          _t18 = _e16.constants,
          _s18 = {
            os: _e16.OS
          };
        return "android" === _s18.os ? _s18.f = _t18.Fingerprint : _s18.v = _e16.Version, JSON.stringify(_s18);
      }
      return null;
    }
  }, {
    key: "initPlusDeviceId",
    value: function initPlusDeviceId() {
      return new Promise(function (e, t) {
        "undefined" != typeof plus ? plus.device.getInfo({
          success: function success(t) {
            e(t.uuid);
          },
          fail: function fail(e) {
            t(e);
          }
        }) : e(null);
      });
    }
  }, {
    key: "getVideoCard",
    value: function getVideoCard() {
      var e;
      if (d.currentPlatform() === l.BROWSER && "undefined" != typeof document) {
        var _t19 = document.createElement("canvas"),
          _s19 = null !== (e = _t19.getContext("webgl")) && void 0 !== e ? e : _t19.getContext("experimental-webgl");
        if (_s19 && "getExtension" in _s19) {
          var _e17 = 0,
            _t20 = 0;
          if (navigator.userAgent.indexOf("Firefox") > -1) _t20 = _s19.VENDOR, _e17 = _s19.RENDERER;else {
            var _i18 = _s19.getExtension("WEBGL_debug_renderer_info");
            if (!_i18) return null;
            _t20 = _i18.UNMASKED_VENDOR_WEBGL, _e17 = _i18.UNMASKED_RENDERER_WEBGL;
          }
          var _i17 = {
            vendor: (_s19.getParameter(_t20) || "").toString(),
            renderer: (_s19.getParameter(_e17) || "").toString()
          };
          return JSON.stringify(_i17);
        }
      }
      return null;
    }
  }, {
    key: "z",
    value: function z() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee29() {
        var e;
        return _regenerator.default.wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                e = {
                  p: d.currentPlatform(),
                  f: s.currentFramework(),
                  vc: this.getVideoCard(),
                  rfp: this.initRNUniqueId()
                };
                return _context29.abrupt("return", cn.e(JSON.stringify(e), 5));
              case 2:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));
    }
  }]);
  return un;
}();
var ln = /*#__PURE__*/function () {
  function ln(e) {
    (0, _classCallCheck2.default)(this, ln);
    this.rocketsBuffer = new Set(), this.socket = e, this.socket.addConnectedObserver(this.onSocketConnected.bind(this));
  }
  (0, _createClass2.default)(ln, [{
    key: "emit",
    value: function emit(e) {
      this.socket.status !== t.DISCONNECTED ? (e.start(), this.doEmit(e)) : e.fail({
        resultCode: "409",
        content: "Please connect first"
      });
    }
  }, {
    key: "doEmit",
    value: function doEmit(e) {
      var _this60 = this;
      if (!e.complete) if (this.socket.status !== t.CONNECT_FAILED) {
        if (this.isConnected()) {
          if (this.hasPermission(e)) {
            var _t21 = setTimeout(function () {
              _this60.doEmit(e);
            }, e.singleTimeout);
            e.unique && (e.params.retried = e.retried), this.socket.socketio().emit(e.name, e.params, function (s) {
              clearTimeout(_t21), 200 === s.resultCode || 200 == s.code ? e.success(s) : e.fail(s);
            }), e.retried++;
          } else e.fail({
            resultCode: 401,
            content: "No permission"
          });
        } else this.isConnecting() && this.rocketsBuffer.add(e);
      } else e.fail({
        resultCode: 408,
        content: "Failed to connect GoEasy."
      });
    }
  }, {
    key: "hasPermission",
    value: function hasPermission(e) {
      return !!this.socket.permissions.find(function (t) {
        return t === e.permission;
      });
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      return [t.CONNECTED, t.RECONNECTED, t.EXPIRED_RECONNECTED, t.DISCONNECTING].includes(this.socket.status);
    }
  }, {
    key: "isConnecting",
    value: function isConnecting() {
      return [t.CONNECTING, t.RECONNECTING].includes(this.socket.status);
    }
  }, {
    key: "onSocketConnected",
    value: function onSocketConnected() {
      this.emitBuffer();
    }
  }, {
    key: "emitBuffer",
    value: function emitBuffer() {
      var _this61 = this;
      Array.from(this.rocketsBuffer).forEach(function (e) {
        _this61.rocketsBuffer.delete(e), _this61.doEmit(e);
      });
    }
  }]);
  return ln;
}();
var dn = /*#__PURE__*/function (_Y2) {
  (0, _inherits2.default)(dn, _Y2);
  var _super31 = _createSuper(dn);
  function dn() {
    (0, _classCallCheck2.default)(this, dn);
    return _super31.apply(this, arguments);
  }
  (0, _createClass2.default)(dn, null, [{
    key: "init",
    value: function init() {
      dn.i = new dn();
    }
  }, {
    key: "fire",
    value: function fire(e, t) {
      this.i.fire(e, t);
    }
  }, {
    key: "on",
    value: function on(e, t) {
      this.i.on(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      this.i.off(e, t);
    }
  }]);
  return dn;
}(Y);
var hn = /*#__PURE__*/function (_Wi2) {
  (0, _inherits2.default)(hn, _Wi2);
  var _super32 = _createSuper(hn);
  function hn(e, t) {
    var _this62;
    (0, _classCallCheck2.default)(this, hn);
    _this62 = _super32.call(this), _this62.ioSocket = null, _this62.sid = null, _this62.anonymous = !1, _this62.userId = null, _this62.artifactVersion = n, _this62.vname = null, _this62.uri = null, _this62.ioOpts = null, _this62.reconnectingTimes = 0, _this62.messageObservers = new Map(), _this62.connectFailedObservers = [], _this62.connectingObservers = [], _this62.expiredReconnectedObservers = [], _this62.options = e, _this62.ioSocket = new Ji({
      onDisconnected: _this62.onIoDisconnected.bind((0, _assertThisInitialized2.default)(_this62)),
      onReconnecting: _this62.onIoReconnecting.bind((0, _assertThisInitialized2.default)(_this62))
    }), _this62.ioSocketEmitter = new ln(_this62.ioSocket), _this62.ioSocket.addConnectedObserver(_this62.onIoReconnected.bind((0, _assertThisInitialized2.default)(_this62))), _this62.initOptions(t), _this62.connect();
    return _this62;
  }
  (0, _createClass2.default)(hn, [{
    key: "initUserId",
    value: function initUserId() {
      var e = this.connectOptions.id;
      u.isEmpty(e) ? this.anonymous = !0 : this.userId = e.toString();
    }
  }, {
    key: "socketio",
    value: function socketio() {
      return this.ioSocket.socketio();
    }
  }, {
    key: "extendOptions",
    value: function extendOptions() {
      var e = this.connectOptions;
      if (u.isNull(e.data) || u.isDef(e.data) && !u.isObject(e.data)) throw {
        code: 400,
        content: "TypeError: data requires an object."
      };
      if ((u.isDef(e.data) ? String(e.data).length : 0) > 300 && u.isObject(e) && u.isFunction(e.onFailed)) throw {
        code: 400,
        content: "user.data-length limit 300 byte."
      };
      if (u.isObject(e.wxmpId)) {
        if (u.isEmpty(e.wxmpId.appid)) throw {
          code: 400,
          content: "wxmpId.appid is required."
        };
        if (u.isEmpty(e.wxmpId.openid)) throw {
          code: 400,
          content: "wxmpId.openid is required. requires string."
        };
      } else if (u.isPrimitive(e.wxmpId)) throw {
        code: 400,
        content: "TypeError: wxmpId requires an object."
      };
    }
  }, {
    key: "initUriAndOpts",
    value: function initUriAndOpts() {
      var e = this.options;
      Ai.init(e.host, e.forceTLS, e.supportOldBrowser), this.uri = Ai.uri();
      var t = ["websocket"];
      !0 === e.supportOldBrowser && t.push("polling"), this.ioOpts = {
        transports: t,
        timeout: S.connect,
        reconnectionDelayMax: S.reconnectionDelayMax
      };
    }
  }, {
    key: "onIoReconnected",
    value: function onIoReconnected() {
      this.status === t.RECONNECTING && this.authorize();
    }
  }, {
    key: "sendAck",
    value: function sendAck(e, t) {
      this.ioSocket.io.emit(e, t);
    }
  }, {
    key: "initOptions",
    value: function initOptions(e) {
      this.connectOptions = e, this.addConnectedObserver(e.onSuccess), this.addConnectFailedObserver(e.onFailed), this.addConnectingObserver(e.onProgress), this.initUserId();
    }
  }, {
    key: "connect",
    value: function connect() {
      this.initUriAndOpts(), this.extendOptions(), (0, _get2.default)((0, _getPrototypeOf2.default)(hn.prototype), "connect", this).call(this), this.onConnecting(), this.ioSocket.connect({
        uri: this.uri,
        opts: this.ioOpts
      }), this.authorize();
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      var _this63 = this;
      return new Promise(function (e, s) {
        _this63.status = t.DISCONNECTING;
        var i = function i() {
          _this63.ioSocket.disconnect(), _this63.status = t.DISCONNECTED, dn.fire(fe.DISCONNECTED), e();
        };
        var n = X.modules.get("GN");
        if (n && (n.params.regId || _this63.connectOptions.wxmpId)) {
          var _e18 = function _e18(e) {
              s(e);
            },
            _t22 = new re({
              name: y.manualDisconnect,
              params: {},
              permission: ne.READ,
              singleTimeout: S.commonRequestSingle,
              totalTimeout: S.commonRequestTotal,
              fail: _e18,
              success: i
            });
          te.Socket.e(_t22);
        } else i();
      });
    }
  }, {
    key: "authorize",
    value: function authorize() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee30() {
        var _this64 = this;
        var e, t, s;
        return _regenerator.default.wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                e = this.connectOptions;
                _context30.t0 = this.options.appkey;
                _context30.t1 = this.userId;
                _context30.t2 = JSON.stringify(e.data);
                _context30.t3 = e.otp;
                _context30.t4 = this.artifactVersion;
                _context30.t5 = this.sid;
                _context30.next = 9;
                return X.getParams();
              case 9:
                _context30.t6 = _context30.sent;
                _context30.t7 = this.anonymous;
                _context30.next = 13;
                return un.z();
              case 13:
                _context30.t8 = _context30.sent;
                _context30.next = 16;
                return an.get();
              case 16:
                _context30.t9 = _context30.sent;
                _context30.t10 = {
                  n: this.vname,
                  v: this.artifactVersion
                };
                t = {
                  appkey: _context30.t0,
                  userId: _context30.t1,
                  userData: _context30.t2,
                  otp: _context30.t3,
                  artifactVersion: _context30.t4,
                  sid: _context30.t5,
                  mP: _context30.t6,
                  a: _context30.t7,
                  z: _context30.t8,
                  sm: _context30.t9,
                  c: _context30.t10
                };
                JSON.stringify(t);
                s = new re({
                  name: y.authorize,
                  params: t,
                  permission: ne.NONE,
                  singleTimeout: S.commonInfiniteSingle,
                  totalTimeout: S.commonInfiniteTotal,
                  success: function success(e) {
                    _this64.onAuthorizeSuccess(e);
                  },
                  fail: function fail(e) {
                    _this64.onAuthorizeFailed(e);
                  }
                });
                this.ioSocketEmitter.emit(s);
              case 22:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));
    }
  }, {
    key: "onConnecting",
    value: function onConnecting() {
      dn.fire(fe.CONNECTING, this.reconnectingTimes), this.notify(this.connectingObservers, this.reconnectingTimes);
    }
  }, {
    key: "onIoReconnecting",
    value: function onIoReconnecting() {
      this.reconnectingTimes++, this.status == t.CONNECTED || this.status == t.EXPIRED_RECONNECTED || this.status == t.RECONNECTING ? this.status = t.RECONNECTING : this.status = t.CONNECTING, this.onConnecting();
    }
  }, {
    key: "onIoDisconnected",
    value: function onIoDisconnected() {
      this.status !== t.DISCONNECTING && (this.status = t.RECONNECTING, dn.fire(fe.LOST), this.notify(this.disconnectedObservers));
    }
  }, {
    key: "onAuthorizeSuccess",
    value: function onAuthorizeSuccess(e) {
      if (an.put(e), X.setDatas(e.mD), this.status === t.RECONNECTING) {
        this.sid !== e.sid ? (this.status = t.EXPIRED_RECONNECTED, this.sid = e.sid, dn.fire(fe.EXPIRED_RECONNECTED), this.notify(this.expiredReconnectedObservers)) : (this.status = t.RECONNECTED, dn.fire(fe.RECONNECTED));
      } else this.status = t.CONNECTED, this.sid = e.sid;
      e.enablePublish && (this.permissions.find(function (e) {
        return e == ne.WRITE;
      }) || this.permissions.push(ne.WRITE)), e.enableSubscribe && (this.permissions.find(function (e) {
        return e == ne.READ;
      }) || this.permissions.push(ne.READ)), this.reconnectingTimes = 0, dn.fire(fe.CONNECTED), this.notify(this.connectedObservers);
    }
  }, {
    key: "onAuthorizeFailed",
    value: function onAuthorizeFailed(e) {
      this.ioSocket.disconnect(), this.status = t.CONNECT_FAILED;
      var s = {
        code: e.resultCode || 408,
        content: e.content || "Host unreachable or timeout"
      };
      this.notify(this.connectFailedObservers, s);
    }
  }, {
    key: "addConnectingObserver",
    value: function addConnectingObserver(e) {
      u.isFunction(e) && this.connectingObservers.push(e);
    }
  }, {
    key: "addConnectFailedObserver",
    value: function addConnectFailedObserver(e) {
      u.isFunction(e) && this.connectFailedObservers.push(e);
    }
  }, {
    key: "addExpiredReconnectedObserver",
    value: function addExpiredReconnectedObserver(e) {
      u.isFunction(e) && this.expiredReconnectedObservers.push(e);
    }
  }, {
    key: "onMessage",
    value: function onMessage(e, t) {
      this.ioSocket.io._callbacks.hasOwnProperty("$" + e) || this.ioSocket.io.on(e, t);
    }
  }, {
    key: "user",
    value: function user() {
      var e = this.connectOptions;
      return e ? {
        id: e.id,
        data: e.data
      } : null;
    }
  }]);
  return hn;
}(Wi);
var pn = /*#__PURE__*/function () {
  function pn(e) {
    (0, _classCallCheck2.default)(this, pn);
    this.guidList = [], this.socket = e;
  }
  (0, _createClass2.default)(pn, [{
    key: "offMessage",
    value: function offMessage(e, t) {
      dn.off(fe.NEW_MESSAGE + "_" + e, t);
    }
  }, {
    key: "onMessage",
    value: function onMessage(e, t) {
      var _this65 = this;
      dn.on(fe.NEW_MESSAGE + "_" + e, t), this.socket.onMessage(e, function (t) {
        _this65.fire(e, t);
      });
    }
  }, {
    key: "fire",
    value: function fire(e, t) {
      var s = this.filter(t);
      s && dn.fire(fe.NEW_MESSAGE + "_" + e, s);
    }
  }, {
    key: "filter",
    value: function filter(e) {
      if ("string" == typeof e && (e = JSON.parse(e)), e.i) {
        if (this.guidList.findIndex(function (t) {
          return t === e.i;
        }) > -1) return;
        this.guidList.unshift(e.i), this.guidList.length > 300 && this.guidList.pop();
      }
      return e;
    }
  }]);
  return pn;
}();
var mn = /*#__PURE__*/function () {
  function mn(e) {
    (0, _classCallCheck2.default)(this, mn);
    this.goeasyOptions = e;
  }
  (0, _createClass2.default)(mn, null, [{
    key: "init",
    value: function init(e) {
      this.i = new mn(e);
    }
  }, {
    key: "connect",
    value: function connect(e, s) {
      if (this.status() !== t.DISCONNECTED && u.isObject(e) && u.isFunction(e.onFailed)) return void e.onFailed({
        code: 408,
        content: "It is already connected, don't try again until disconnect() is called. "
      });
      this.confirmUserIdAndData(e), dn.init();
      var i = this.i;
      X.preConnect(e), i.socket = new hn(i.goeasyOptions, e), i.socket.vname = s, i.emitter = new ln(i.socket), i.messageListener = new pn(i.socket), X.postConnect();
    }
  }, {
    key: "confirmUserIdAndData",
    value: function confirmUserIdAndData(e) {
      if (X.modules.get("GIM")) le.validateId(e.id, "id"), le.validateObject(e.data, "data");else if ("string" == typeof e.id && e.id.length > 60) throw {
        code: 400,
        content: "id over max length 60"
      };
    }
  }, {
    key: "e",
    value: function e(_e19) {
      this.i.emitter.emit(_e19);
    }
  }, {
    key: "sendAck",
    value: function sendAck(e, t) {
      this.i.socket.sendAck(e, t);
    }
  }, {
    key: "status",
    value: function status() {
      return this.i && this.i.socket ? this.i.socket.getStatus() : t.DISCONNECTED;
    }
  }, {
    key: "on",
    value: function on(e, t) {
      dn.on(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      dn.off(e, t);
    }
  }, {
    key: "offMessage",
    value: function offMessage(e, t) {
      this.i.messageListener.offMessage(e, t);
    }
  }, {
    key: "onMessage",
    value: function onMessage(e, t) {
      this.i.messageListener.onMessage(e, t);
    }
  }, {
    key: "disconnect",
    value: function disconnect(e) {
      this.i.socket.disconnect().then(function () {
        v.onSuccess(e);
      }).catch(function (t) {
        v.onFailed(e, t);
      });
    }
  }, {
    key: "user",
    value: function user() {
      return this.i.socket.user();
    }
  }]);
  return mn;
}();
mn.EVENT = fe;
var fn = /*#__PURE__*/function () {
  function fn() {
    var _this66 = this;
    (0, _classCallCheck2.default)(this, fn);
    this.synchronized = !0, this.onlineChanged = function (e) {
      e.online ? _this66.teamIds.add(e.teamId) : _this66.teamIds.delete(e.teamId);
    }, this.onDisconnected = function () {
      _this66.queryMyTeamPromise = null, _this66.teamIds = null;
    }, this.onConnected = function () {
      _this66.synchronized && (_this66.queryMyTeamPromise = _this66.queryTeams());
    }, mn.on(mn.EVENT.LOST, this.onDisconnected), mn.on(mn.EVENT.RECONNECTED, this.onConnected), mn.onMessage(me.CS_ONLINE_CHANGED, this.onlineChanged);
  }
  (0, _createClass2.default)(fn, [{
    key: "queryTeams",
    value: function queryTeams() {
      var _this67 = this;
      return this.queryMyTeamPromise || (this.queryMyTeamPromise = new Promise(function (e, t) {
        var s = new re({
          name: y.CS_MY_TEAMS,
          params: {},
          permission: ne.READ,
          singleTimeout: S.commonQuerySingle,
          totalTimeout: S.commonQueryTotal,
          fail: function fail(e) {
            t(e);
          },
          success: function success(t) {
            _this67.teamIds = new Set(t.content), _this67.synchronized = !0, e(_this67.teamIds);
          }
        });
        te.Socket.e(s);
      })), this.queryMyTeamPromise;
    }
  }, {
    key: "myTeams",
    value: function myTeams() {
      if (this.synchronized && this.queryMyTeamPromise) return this.teamIds;
      throw "please query team first.";
    }
  }, {
    key: "isOnline",
    value: function isOnline(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee31() {
        return _regenerator.default.wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.next = 2;
                return this.queryTeams();
              case 2:
                v.onSuccess(t, this.teamIds.has(e));
              case 3:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));
    }
  }, {
    key: "online",
    value: function online(e, t) {
      var _this68 = this;
      if (!u.isObject(t.agentData) || !u.isObject(t.teamData)) throw {
        code: 400,
        content: "agentData and teamData require an object"
      };
      var s = new vt(e, t.teamData, t.agentData),
        i = new re({
          name: y.CS_ONLINE,
          params: s,
          permission: ne.WRITE,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          fail: function fail(e) {
            v.onFailed(t, e);
          },
          success: function success(s) {
            _this68.teamIds.add(e), v.onSuccess(t), Qe.i.fire(Be.CS_ONLINE_SUCCESS);
          }
        });
      te.Socket.e(i);
    }
  }, {
    key: "offline",
    value: function offline(e, t) {
      var _this69 = this;
      var s = new bt(e),
        i = new re({
          name: y.CS_OFFLINE,
          params: s,
          permission: ne.WRITE,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          fail: function fail(e) {
            v.onFailed(t, e);
          },
          success: function success(s) {
            _this69.teamIds.delete(e), v.onSuccess(t), Qe.i.fire(Be.CS_OFFLINE_SUCCESS);
          }
        });
      te.Socket.e(i);
    }
  }, {
    key: "agents",
    value: function agents(e, t) {
      var s = new Ct(e),
        i = new re({
          name: y.CS_AGENTS,
          params: s,
          permission: ne.READ,
          singleTimeout: S.commonQuerySingle,
          totalTimeout: S.commonQueryTotal,
          fail: function fail(e) {
            v.onFailed(t, e);
          },
          success: function success(e) {
            e.content.forEach(function (e) {
              e.data = JSON.parse(e.data);
            }), v.onSuccess(t, e);
          }
        });
      te.Socket.e(i);
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return fn.instance || (fn.instance = new fn()), fn.instance;
    }
  }]);
  return fn;
}();
var gn = /*#__PURE__*/function () {
  function gn(e) {
    (0, _classCallCheck2.default)(this, gn);
    this.onMessageReceived = function (e) {
      var t = gn.session;
      if (e.scene() === o.CS && t.liveOptions) {
        var _s20 = e,
          _i19 = t.liveOptions.customerId;
        t.teamId === _s20.teamId && _s20.customerId() === _i19 && (t.tryUpdateStatus(_s20), t.liveOptions.onNewMessage(_s20));
      }
    }, this.teamId = e, Qe.i.on(Be.CS_AGENT_MESSAGE_RECEIVED, this.onMessageReceived), Qe.i.on(Be.CS_ACCEPTED, this.onMessageReceived), Qe.i.on(Be.CS_ENDED, this.onMessageReceived), Qe.i.on(Be.CS_TRANSFER, this.onMessageReceived), mn.on(fe.DISCONNECTED, gn.destroy);
  }
  (0, _createClass2.default)(gn, [{
    key: "customerId",
    value: function customerId() {
      return this.liveOptions.customerId;
    }
  }, {
    key: "tryUpdateStatus",
    value: function tryUpdateStatus(e) {
      if ("FREE" !== this.status.status && this.status.sessionId > e.sessionId) return;
      var t;
      switch (e.type) {
        case je.ACCEPT:
          t = new Et(), t.status = "ACCEPTED", t.start = e.payload.sessionStart, t.sessionId = e.sessionId, t.agent = new c(e.senderId, e.senderData);
          break;
        case je.END:
          t = new Et(), t.status = "FREE";
          break;
        case je.TRANSFER:
          t = new Et(), t.status = "ACCEPTED", t.start = e.payload.sessionStart, t.sessionId = e.sessionId, t.agent = e.payload.transferTo;
          break;
        default:
          "FREE" === this.status.status && (t = new Et(), t.status = "PENDING", t.start = e.timestamp, t.sessionId = e.sessionId);
      }
      t && (this.status = t, this.liveOptions.onStatusUpdated(t));
    }
  }], [{
    key: "live",
    value: function live(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee32() {
        var _this70 = this;
        var s, i, n;
        return _regenerator.default.wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                s = t.customerId;
                le.validateId(s, "customerId");
                i = new St(e, s);
                _context32.next = 5;
                return fn.getInstance().queryTeams();
              case 5:
                n = new re({
                  name: y.CS_LIVE_SESSION,
                  params: i,
                  permission: ne.WRITE,
                  singleTimeout: S.commonRequestSingle,
                  totalTimeout: S.commonRequestTotal,
                  fail: function fail(e) {
                    v.onFailed(t, e);
                  },
                  success: function success(s) {
                    gn.destroy(), _this70.session = new gn(e), _this70.session.liveOptions = t;
                    var i = s.content.customerStatus;
                    "ACCEPTED" === i.status && (i.agent.data = JSON.parse(i.agent.data)), _this70.session.status = i, _this70.session.liveOptions.onStatusUpdated(_this70.session.status), v.onSuccess(t);
                  }
                });
                te.Socket.e(n);
              case 7:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32);
      }));
    }
  }, {
    key: "isMyCustomer",
    value: function isMyCustomer(e) {
      var t = gn.session;
      if (t && t.teamId === e.teamId && t.customerId() === e.customerId()) {
        var _s21 = fn.getInstance().myTeams(),
          _i20 = t.status.agent;
        return _s21.has(e.teamId) && (!_i20 || _i20.id === te.Socket.user().id);
      }
      return !0;
    }
  }, {
    key: "isMyMessage",
    value: function isMyMessage(e) {
      var t = st.byIMMessage(e);
      return e.type === je.TRANSFER && e.payload.transferTo.id === te.Socket.user().id || this.isMyCustomer(t);
    }
  }, {
    key: "quit",
    value: function quit(e) {
      var t = gn.session;
      if (t) {
        var _s22 = t.liveOptions.customerId;
        le.validateId(_s22, "customerId");
        var _i21 = new St(t.teamId, _s22),
          _n11 = new re({
            name: y.CS_QUIT_LIVE,
            params: _i21,
            permission: ne.WRITE,
            singleTimeout: S.commonRequestSingle,
            totalTimeout: S.commonRequestTotal,
            fail: function fail(t) {
              v.onFailed(e, t);
            },
            success: function success(t) {
              gn.destroy(), v.onSuccess(e);
            }
          });
        te.Socket.e(_n11);
      }
    }
  }]);
  return gn;
}();
gn.destroy = function () {
  var e = gn.session;
  e && (Qe.i.off(Be.CS_AGENT_MESSAGE_RECEIVED, e.onMessageReceived), Qe.i.off(Be.CS_ACCEPTED, e.onMessageReceived), Qe.i.off(Be.CS_ENDED, e.onMessageReceived), Qe.i.off(Be.CS_TRANSFER, e.onMessageReceived), mn.off(fe.DISCONNECTED, gn.destroy), gn.session = null);
};
var yn = /*#__PURE__*/function (_yt) {
  (0, _inherits2.default)(yn, _yt);
  var _super33 = _createSuper(yn);
  function yn(e) {
    var _this71;
    (0, _classCallCheck2.default)(this, yn);
    _this71 = _super33.call(this, e), _this71.unread = 0, _this71.markingAmount = 0;
    return _this71;
  }
  (0, _createClass2.default)(yn, [{
    key: "loadHistory",
    value: function loadHistory(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee33() {
        return _regenerator.default.wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                u.isUndef(t) ? t = 10 : t > 30 && (t = 30);
                _context33.next = 3;
                return this.loadServerMessages(e, t);
              case 3:
                return _context33.abrupt("return", _context33.sent);
              case 4:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));
    }
  }, {
    key: "loadServerMessages",
    value: function loadServerMessages(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee34() {
        var _this72 = this;
        var s, i;
        return _regenerator.default.wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                s = new pt(this.target.id.toString(), this.target.scene, e, t, this.target.teamId);
                _context34.next = 3;
                return this.remoteHistory.loadServerMessages(this.target, s);
              case 3:
                i = _context34.sent;
                return _context34.abrupt("return", (i.userOffsets.forEach(function (e) {
                  _this72.userOffsets.updateOffset(e.userId, e.offset);
                }), i.messages));
              case 5:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));
    }
  }, {
    key: "deleteMessages",
    value: function deleteMessages(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee35() {
        return _regenerator.default.wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                v.onFailed(e, "Delete CS message is not supported yet");
              case 1:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35);
      }));
    }
  }, {
    key: "initMaxMessageAndOffsets",
    value: function initMaxMessageAndOffsets(e, t) {
      var _this73 = this;
      t.forEach(function (e) {
        _this73.userOffsets.updateOffset(e.userId, e.offset);
      }), (u.isUndef(this.acceptedMaxMessage) || this.acceptedMaxMessage.timestamp < e.timestamp) && this.increaseUnreadAmount(e), this.saveAcceptedMessage(e);
    }
  }, {
    key: "initPendingMaxMessageAndOffsets",
    value: function initPendingMaxMessageAndOffsets(e, t) {
      var _this74 = this;
      t.forEach(function (e) {
        _this74.userOffsets.updateOffset(e.userId, e.offset);
      }), this.savePendingMessage(e);
    }
  }, {
    key: "savePendingMessage",
    value: function savePendingMessage(e) {
      this.pendingMaxMessage ? this.pendingMaxMessage.timestamp < e.timestamp && (this.pendingMaxMessage = e) : this.pendingMaxMessage = e;
    }
  }, {
    key: "saveAcceptedMessage",
    value: function saveAcceptedMessage(e) {
      this.acceptedMaxMessage ? this.acceptedMaxMessage.timestamp < e.timestamp && (this.acceptedMaxMessage = e) : this.acceptedMaxMessage = e;
    }
  }, {
    key: "onMessageSending",
    value: function onMessageSending(e) {
      this.saveAcceptedMessage(e), Qe.i.fire(Be.MAX_MESSAGE_CHANGED, e);
    }
  }, {
    key: "onMessageSendSuccess",
    value: function onMessageSendSuccess(e) {
      this.saveAcceptedMessage(e), this.userOffsets.updateOffset(e.senderId, e.timestamp), this.acceptedMaxMessage === e && Qe.i.fire(Be.MAX_MESSAGE_CHANGED, e);
    }
  }, {
    key: "onMessageSendFailed",
    value: function onMessageSendFailed(e) {
      this.acceptedMaxMessage === e && Qe.i.fire(Be.MAX_MESSAGE_CHANGED, e);
    }
  }, {
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      gn.isMyMessage(e) && (!e.accepted || e.senderId !== te.Socket.user().id && e.type === je.ACCEPT ? this.savePendingMessage(e) : this.saveAcceptedMessage(e), this.userOffsets.updateOffset(e.senderId, e.timestamp), this.increaseUnreadAmount(e), Qe.i.fire(Be.MAX_MESSAGE_CHANGED, e));
    }
  }, {
    key: "increaseUnreadAmount",
    value: function increaseUnreadAmount(e) {
      if (e.sendByCustomer() || e.type === je.TRANSFER && e.senderId !== te.Socket.user().id) {
        this.userOffsets.myOffset() < e.timestamp && e.accepted && (this.unread += 1);
      }
    }
  }, {
    key: "markRead",
    value: function markRead() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee36() {
        var e;
        return _regenerator.default.wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                e = this.maxAcceptedMessageTime();
                _context36.t0 = gn.isMyCustomer(this.target) && this.preMark(e);
                if (!_context36.t0) {
                  _context36.next = 6;
                  break;
                }
                _context36.next = 5;
                return this.remoteHistory.updateServerOffsets(e, this.target);
              case 5:
                this.postMark(e);
              case 6:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));
    }
  }, {
    key: "preMark",
    value: function preMark(e) {
      var t = this.userOffsets.myOffset();
      return e > this.userOffsets.markingTime && e > t && (this.userOffsets.markingTime = e, this.markingAmount = this.unread, !0);
    }
  }, {
    key: "postMark",
    value: function postMark(e) {
      e === this.userOffsets.markingTime && (this.unread -= this.markingAmount, this.markingAmount = 0, this.userOffsets.updateOffset(te.Socket.user().id, e), Qe.i.fire(Be.UNREAD_AMOUNT_CHANGED, this.target));
    }
  }, {
    key: "syncMarkedMessage",
    value: function syncMarkedMessage(e) {}
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage(e) {
      return e ? this.acceptedMaxMessage : this.pendingMaxMessage;
    }
  }, {
    key: "unreadAmount",
    value: function unreadAmount(e) {
      return e ? this.unread : 0;
    }
  }, {
    key: "existsMessage",
    value: function existsMessage(e) {
      return this.acceptedMaxMessage && this.acceptedMaxMessage.messageId === e.messageId || this.pendingMaxMessage && this.pendingMaxMessage.messageId === e.messageId;
    }
  }, {
    key: "maxAcceptedMessageTime",
    value: function maxAcceptedMessageTime() {
      return this.acceptedMaxMessage ? this.acceptedMaxMessage.timestamp : 0;
    }
  }, {
    key: "maxTime",
    value: function maxTime(e) {
      var t = this.getMaxMessage(e);
      return t ? t.timestamp : 0;
    }
  }]);
  return yn;
}(yt);
var Sn = /*#__PURE__*/function (_yt2) {
  (0, _inherits2.default)(Sn, _yt2);
  var _super34 = _createSuper(Sn);
  function Sn(e) {
    (0, _classCallCheck2.default)(this, Sn);
    return _super34.call(this, e);
  }
  (0, _createClass2.default)(Sn, [{
    key: "deleteMessages",
    value: function deleteMessages(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee37() {
        return _regenerator.default.wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                v.onFailed(e, "Delete CS message is not supported yet");
              case 1:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37);
      }));
    }
  }]);
  return Sn;
}(yt);
var En = /*#__PURE__*/function () {
  function En() {
    (0, _classCallCheck2.default)(this, En);
  }
  (0, _createClass2.default)(En, null, [{
    key: "validateMessageArray",
    value: function validateMessageArray(e) {
      if (!u.isArray(e) || u.isEmpty(e)) throw {
        code: 400,
        content: "messages requires non empty array"
      };
      if (e.length > 20) throw {
        code: 400,
        content: "The maximum number of messages is 20"
      };
      var t = st.byIMMessage(e[0]);
      for (var _s23 = 0; _s23 < e.length; _s23++) {
        var _i22 = e[_s23];
        if (!(_i22 instanceof He)) throw {
          code: 400,
          content: "message[" + _s23 + "] is not a correct message"
        };
        if (_s23 > 0) {
          var _e20 = st.byIMMessage(_i22);
          if (_e20.scene !== t.scene || _e20.id !== t.id) throw {
            code: 400,
            content: "each message must be from the same friend or group"
          };
        }
      }
    }
  }]);
  return En;
}();
var vn = /*#__PURE__*/function () {
  function vn() {
    var _this75 = this;
    (0, _classCallCheck2.default)(this, vn);
    this.map = new Map(), this.onMessageSending = function (e) {
      var t = st.byIMMessage(e);
      _this75.findOrCreateHistory(t).onMessageSending(e);
    }, this.onMessageSendSuccess = function (e) {
      var t = st.byIMMessage(e);
      _this75.findHistory(t).onMessageSendSuccess(e);
    }, this.onMessageSendFailed = function (e) {
      var t = st.byIMMessage(e);
      _this75.findHistory(t).onMessageSendFailed(e);
    }, this.onMessageReceived = function (e) {
      var t = st.byIMMessage(e);
      _this75.findOrCreateHistory(t).onMessageReceived(e);
    }, this.onRemoteMarkRead = function (e) {
      var t = st.byMessageReadRemoteEvent(e),
        s = _this75.findHistory(t);
      s && s.syncMarkedMessage(e);
    }, this.onRemoteMessageDeleted = function (e) {
      var t = st.byIMMessageDeletedEvent(e),
        s = _this75.findHistory(t);
      s && s.syncDeletedMessage(e.deleterId, e.times);
    }, this.onMessageRecalled = function (e) {
      var t = st.byConversationId(e.scene, e.conversationId),
        s = _this75.findHistory(t);
      s && s.recallMessages(e);
    }, this.onDisconnected = function () {
      _this75.map.forEach(function (e, t) {
        e.expire();
      });
    }, this.destroy = function () {}, this.initialListeners();
  }
  (0, _createClass2.default)(vn, [{
    key: "initialListeners",
    value: function initialListeners() {
      Qe.i.on(Be.MESSAGE_SENDING, this.onMessageSending), Qe.i.on(Be.MESSAGE_SEND_SUCCESS, this.onMessageSendSuccess), Qe.i.on(Be.MESSAGE_SEND_FAILED, this.onMessageSendFailed), Qe.i.on(Be.MESSAGE_RECEIVED, this.onMessageReceived), Qe.i.on(Be.CS_AGENT_MESSAGE_RECEIVED, this.onMessageReceived), Qe.i.on(Be.CS_ACCEPTED, this.onMessageReceived), Qe.i.on(Be.CS_ENDED, this.onMessageReceived), Qe.i.on(Be.CS_TRANSFER, this.onMessageReceived), Qe.i.on(Be.MESSAGE_RECALLED, this.onMessageRecalled), mn.onMessage(me.IM_MSG_READ, this.onRemoteMarkRead), mn.onMessage(me.IM_MSG_DELETED, this.onRemoteMessageDeleted), mn.on(mn.EVENT.LOST, this.onDisconnected);
    }
  }, {
    key: "loadHistory",
    value: function loadHistory(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee38() {
        var s, i, n;
        return _regenerator.default.wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                s = this.queryToTarget(e, t);
                i = this.findOrCreateHistory(s);
                _context38.next = 4;
                return i.loadHistory(e.lastTimestamp, e.limit);
              case 4:
                n = _context38.sent;
                v.onSuccess(e, {
                  code: 200,
                  content: n
                });
              case 6:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38, this);
      }));
    }
  }, {
    key: "queryToTarget",
    value: function queryToTarget(e, t) {
      if (u.isDef(e.userId)) return new st(o.PRIVATE, e.userId);
      if (u.isDef(e.groupId)) return new st(o.GROUP, e.groupId);
      if (u.isDef(e.type)) {
        if (!Object.values(o).includes(e.type)) throw new Error("incorrect type, must be: " + Object.values(o));
        if (u.isUndef(e.id)) throw new Error("If type is not empty, id is required.");
        return o.CS == e.type && u.isUndef(t) && (t = e.id), new st(e.type, e.id, t);
      }
      throw new Error("incorrect query options.");
    }
  }, {
    key: "privateMarkAsRead",
    value: function privateMarkAsRead(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee39() {
        var t;
        return _regenerator.default.wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                if (!u.isUndef(e.userId)) {
                  _context39.next = 2;
                  break;
                }
                throw new Error("userId could not be empty.");
              case 2:
                t = st.byScene(o.PRIVATE, e.userId);
                _context39.next = 5;
                return this.markAsRead(t, e);
              case 5:
              case "end":
                return _context39.stop();
            }
          }
        }, _callee39, this);
      }));
    }
  }, {
    key: "groupMarkAsRead",
    value: function groupMarkAsRead(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee40() {
        var t;
        return _regenerator.default.wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                if (!u.isUndef(e.groupId)) {
                  _context40.next = 2;
                  break;
                }
                throw new Error("groupId could not be empty.");
              case 2:
                t = st.byScene(o.GROUP, e.groupId);
                _context40.next = 5;
                return this.markAsRead(t, e);
              case 5:
              case "end":
                return _context40.stop();
            }
          }
        }, _callee40, this);
      }));
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee41() {
        var s;
        return _regenerator.default.wrap(function _callee41$(_context41) {
          while (1) {
            switch (_context41.prev = _context41.next) {
              case 0:
                if (!u.isUndef(e.id)) {
                  _context41.next = 2;
                  break;
                }
                throw new Error("id could not be empty.");
              case 2:
                if (Object.values(o).includes(e.type)) {
                  _context41.next = 4;
                  break;
                }
                throw new Error("incorrect type, must be: " + Object.values(o));
              case 4:
                o.CS == e.type && u.isUndef(t) && (t = e.id);
                s = st.byScene(e.type, e.id, t);
                _context41.next = 8;
                return this.markAsRead(s, e);
              case 8:
              case "end":
                return _context41.stop();
            }
          }
        }, _callee41, this);
      }));
    }
  }, {
    key: "markAsRead",
    value: function markAsRead(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee42() {
        var s;
        return _regenerator.default.wrap(function _callee42$(_context42) {
          while (1) {
            switch (_context42.prev = _context42.next) {
              case 0:
                s = this.findHistory(e);
                _context42.t0 = s;
                if (!_context42.t0) {
                  _context42.next = 5;
                  break;
                }
                _context42.next = 5;
                return s.markRead();
              case 5:
                v.onSuccess(t);
              case 6:
              case "end":
                return _context42.stop();
            }
          }
        }, _callee42, this);
      }));
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee43() {
        var t, s, i;
        return _regenerator.default.wrap(function _callee43$(_context43) {
          while (1) {
            switch (_context43.prev = _context43.next) {
              case 0:
                this.validateMessageArray(e.messages), nt.validate(e);
                t = e.messages[0], s = st.byIMMessage(t), i = this.findHistory(s);
                if (i) {
                  _context43.next = 4;
                  break;
                }
                throw {
                  code: 400,
                  content: "No message that could be deleted"
                };
              case 4:
                _context43.next = 6;
                return i.deleteMessages(e);
              case 6:
              case "end":
                return _context43.stop();
            }
          }
        }, _callee43, this);
      }));
    }
  }, {
    key: "findOrCreateHistory",
    value: function findOrCreateHistory(e) {
      var t = this.findHistory(e);
      return t || (t = e.scene === o.CS ? te.Socket.user().id === e.customerId() ? new Sn(e) : new yn(e) : new yt(e), this.map.set(e.toString(), t), t);
    }
  }, {
    key: "findHistory",
    value: function findHistory(e) {
      return this.map.get(e.toString());
    }
  }, {
    key: "validateMessageArray",
    value: function validateMessageArray(e) {
      En.validateMessageArray(e);
    }
  }], [{
    key: "init",
    value: function init() {
      return vn.instance = new vn(), vn.instance;
    }
  }, {
    key: "get",
    value: function get(e) {
      return vn.instance.findOrCreateHistory(e);
    }
  }]);
  return vn;
}();
var bn = /*#__PURE__*/function () {
  function bn(e) {
    (0, _classCallCheck2.default)(this, bn);
    this.top = !1, this.data = null, this.dataLoaded = !1, this.target = e;
  }
  (0, _createClass2.default)(bn, [{
    key: "toDto",
    value: function toDto() {
      var e = this.target.scene,
        t = this.target.id,
        s = new a();
      return e === o.PRIVATE ? s.userId = t : e === o.GROUP ? s.groupId = t : e === o.CS && (s.id = this.target.teamId), s.type = e, s.lastMessage = this.getMaxMessage(), s.unread = this.getUnreadAmount(), s.top = this.top, s.data = this.data, s;
    }
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage() {
      return vn.get(this.target).getMaxMessage();
    }
  }, {
    key: "getUnreadAmount",
    value: function getUnreadAmount() {
      return vn.get(this.target).unreadAmount();
    }
  }, {
    key: "maxMessageTime",
    value: function maxMessageTime() {
      return vn.get(this.target).maxTime();
    }
  }]);
  return bn;
}();
var Cn = /*#__PURE__*/function (_bn) {
  (0, _inherits2.default)(Cn, _bn);
  var _super35 = _createSuper(Cn);
  function Cn(e) {
    var _this76;
    (0, _classCallCheck2.default)(this, Cn);
    _this76 = _super35.call(this, e), _this76.accepted = !1;
    return _this76;
  }
  (0, _createClass2.default)(Cn, [{
    key: "toDto",
    value: function toDto() {
      var e = new a(),
        t = this.target.scene,
        s = this.target.id,
        i = this.target.teamId;
      return e.id = s, e.teamId = i, e.type = t, e.lastMessage = this.getMaxMessage(), e.unread = this.getUnreadAmount(), e.top = this.top, e.data = this.data, e.ended = this.isEnded(), e;
    }
  }, {
    key: "isEnded",
    value: function isEnded() {
      var e = this.getMaxMessage(),
        t = e.type,
        s = e.payload;
      return t === je.END || t === je.TRANSFER && s.transferTo.id !== te.Socket.user().id;
    }
  }, {
    key: "getMaxMessage",
    value: function getMaxMessage() {
      return vn.get(this.target).getMaxMessage(this.accepted);
    }
  }, {
    key: "getUnreadAmount",
    value: function getUnreadAmount() {
      return vn.get(this.target).unreadAmount(this.accepted);
    }
  }, {
    key: "maxMessageTime",
    value: function maxMessageTime() {
      return vn.get(this.target).maxTime(this.accepted);
    }
  }]);
  return Cn;
}(bn);
var wn = /*#__PURE__*/(0, _createClass2.default)(function wn(e, t, s, i) {
  (0, _classCallCheck2.default)(this, wn);
  this.type = e, this.top = t, this.targetId = s, this.teamId = i;
});
var Mn = /*#__PURE__*/(0, _createClass2.default)(function Mn(e, t, s) {
  (0, _classCallCheck2.default)(this, Mn);
  this.type = e, this.targetId = t, this.teamId = s;
});
var In = /*#__PURE__*/(0, _createClass2.default)(function In(e, t, s) {
  (0, _classCallCheck2.default)(this, In);
  this.type = e, this.targetId = t, this.teamId = s;
});
var Nn = /*#__PURE__*/function () {
  function Nn() {
    (0, _classCallCheck2.default)(this, Nn);
  }
  (0, _createClass2.default)(Nn, [{
    key: "top",
    value: function top(e, t) {
      var s = new wn(e.scene, t, e.id, e.teamId);
      return new Promise(function (e, t) {
        var i = new re({
          name: y.topConversation,
          params: s,
          permission: ne.WRITE,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          success: function success(s) {
            200 === s.code ? e(s) : t(s);
          },
          fail: function fail(e) {
            t(e);
          }
        });
        te.Socket.e(i);
      });
    }
  }, {
    key: "remove",
    value: function remove(e) {
      var t = new Mn(e.scene, e.id, e.teamId);
      return new Promise(function (e, s) {
        var i = new re({
          name: y.removeConversation,
          params: t,
          permission: ne.WRITE,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          success: function success(t) {
            200 == t.code ? e(t) : s(t);
          },
          fail: function fail(e) {
            s(e);
          }
        });
        te.Socket.e(i);
      });
    }
  }, {
    key: "query",
    value: function query(e) {
      var _this77 = this;
      return new Promise(function (t, s) {
        var i = new re({
          name: e,
          params: {},
          permission: ne.READ,
          singleTimeout: S.commonQuerySingle,
          totalTimeout: S.commonQueryTotal,
          fail: function fail(e) {
            s(e);
          },
          success: function success(e) {
            return b(_this77, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee44() {
              return _regenerator.default.wrap(function _callee44$(_context44) {
                while (1) {
                  switch (_context44.prev = _context44.next) {
                    case 0:
                      t(e);
                    case 1:
                    case "end":
                      return _context44.stop();
                  }
                }
              }, _callee44);
            }));
          }
        });
        te.Socket.e(i);
      });
    }
  }, {
    key: "loadData",
    value: function loadData(e) {
      var t = new In(e.scene, e.id, e.teamId);
      return new Promise(function (e, s) {
        var i = new re({
          name: y.imData,
          params: t,
          permission: ne.READ,
          singleTimeout: S.commonQuerySingle,
          totalTimeout: S.commonQueryTotal,
          success: function success(t) {
            var s = JSON.parse(t.content);
            e(s);
          },
          fail: function fail(e) {
            s(e);
          }
        });
        te.Socket.e(i);
      });
    }
  }]);
  return Nn;
}();
Nn.instance = new Nn();
var Tn = /*#__PURE__*/function () {
  function Tn() {
    (0, _classCallCheck2.default)(this, Tn);
    this.list = new Array(), this.builder = new lt(), this.remoteConversations = Nn.instance, this.synchronized = !1, Qe.i.on(Be.MAX_MESSAGE_CHANGED, this.onMaxMessageChanged.bind(this)), Qe.i.on(Be.UNREAD_AMOUNT_CHANGED, this.onUnreadMessageChanged.bind(this)), Qe.i.on(Be.MAX_MESSAGE_DELETED, this.onMaxMessageDeleted.bind(this));
  }
  (0, _createClass2.default)(Tn, [{
    key: "onUnreadMessageChanged",
    value: function onUnreadMessageChanged(e) {
      this.findConversation(e) && this.fireUpdated();
    }
  }, {
    key: "fireUpdated",
    value: function fireUpdated() {
      var e = this.loadLocalConversations(),
        t = this.getUpdatedEventName();
      gt.fire(t, {
        unreadTotal: e.content.unreadTotal,
        conversations: e.content.conversations
      });
    }
  }, {
    key: "getUpdatedEventName",
    value: function getUpdatedEventName() {
      return Ve.CONVERSATIONS_UPDATED;
    }
  }, {
    key: "latestConversations",
    value: function latestConversations(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee45() {
        var t;
        return _regenerator.default.wrap(function _callee45$(_context45) {
          while (1) {
            switch (_context45.prev = _context45.next) {
              case 0:
                _context45.t0 = this.synchronized;
                if (_context45.t0) {
                  _context45.next = 4;
                  break;
                }
                _context45.next = 4;
                return this.loadServerConversations();
              case 4:
                t = this.loadLocalConversations();
                v.onSuccess(e, t);
              case 6:
              case "end":
                return _context45.stop();
            }
          }
        }, _callee45, this);
      }));
    }
  }, {
    key: "loadServerConversations",
    value: function loadServerConversations() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee46() {
        var e, t;
        return _regenerator.default.wrap(function _callee46$(_context46) {
          while (1) {
            switch (_context46.prev = _context46.next) {
              case 0:
                e = this.rocketName();
                _context46.next = 3;
                return this.remoteConversations.query(e);
              case 3:
                t = _context46.sent;
                this.convertAbbrConversation(t.content), this.synchronized = !0;
              case 5:
              case "end":
                return _context46.stop();
            }
          }
        }, _callee46, this);
      }));
    }
  }, {
    key: "rocketName",
    value: function rocketName() {
      return y.imLastConversations;
    }
  }, {
    key: "convertAbbrConversation",
    value: function convertAbbrConversation(e) {
      var t = e;
      var _iterator5 = _createForOfIteratorHelper(t),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _e21 = _step5.value;
          var _t23 = _e21.t,
            _s24 = _e21.top,
            _i23 = _e21.d ? JSON.parse(_e21.d) : {},
            _n12 = _e21.userOffsets;
          _e21.lmsg.t = _t23;
          var _o8 = _e21.lmsg,
            _r3 = this.builder.build(_o8),
            _a3 = st.byIMMessage(_r3),
            _c2 = this.findConversation(_a3);
          u.isUndef(_c2) ? (_c2 = this.buildByAbbr(_e21, _r3), this.insertOne(_c2)) : (_c2.top = _s24, _c2.data = _i23), vn.get(_a3).initMaxMessageAndOffsets(_r3, _n12), this.correctPosition(_c2);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "onMaxMessageDeleted",
    value: function onMaxMessageDeleted(e) {
      this.removeConversation(e);
    }
  }, {
    key: "onMaxMessageChanged",
    value: function onMaxMessageChanged(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee47() {
        var _t24;
        return _regenerator.default.wrap(function _callee47$(_context47) {
          while (1) {
            switch (_context47.prev = _context47.next) {
              case 0:
                if (!(e.scene() === o.CS)) {
                  _context47.next = 4;
                  break;
                }
                _t24 = e;
                if (!(te.Socket.user().id != _t24.customerId() && (!1 === _t24.accepted || _t24.type === je.ACCEPT && _t24.senderId != te.Socket.user().id))) {
                  _context47.next = 4;
                  break;
                }
                return _context47.abrupt("return");
              case 4:
                _context47.next = 6;
                return this.saveOrUpdateConversation(e);
              case 6:
              case "end":
                return _context47.stop();
            }
          }
        }, _callee47, this);
      }));
    }
  }, {
    key: "saveOrUpdateConversation",
    value: function saveOrUpdateConversation(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee48() {
        var t, s, i;
        return _regenerator.default.wrap(function _callee48$(_context48) {
          while (1) {
            switch (_context48.prev = _context48.next) {
              case 0:
                t = e.status, s = st.byIMMessage(e), i = this.findConversation(s);
                _context48.t0 = u.isUndef(i) && t !== r.FAIL;
                if (!_context48.t0) {
                  _context48.next = 11;
                  break;
                }
                i = this.buildByMessage(e);
                this.insertOne(i);
                _context48.t1 = t === r.SUCCESS;
                if (!_context48.t1) {
                  _context48.next = 11;
                  break;
                }
                _context48.next = 9;
                return this.remoteConversations.loadData(s);
              case 9:
                i.data = _context48.sent;
                i.dataLoaded = !0;
              case 11:
                t === r.SENDING && (i.data = e.getToData(), i.dataLoaded = !0);
                i && i.dataLoaded && (this.correctPosition(i), this.fireUpdated());
              case 13:
              case "end":
                return _context48.stop();
            }
          }
        }, _callee48, this);
      }));
    }
  }, {
    key: "loadLocalConversations",
    value: function loadLocalConversations() {
      var e = 0,
        t = new Array();
      var _iterator6 = _createForOfIteratorHelper(this.list),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _s25 = _step6.value;
          if (_s25.dataLoaded && _s25.getMaxMessage()) {
            e += _s25.getUnreadAmount();
            var _i24 = _s25.toDto();
            t.push(_i24);
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      return {
        code: 200,
        content: {
          unreadTotal: e,
          conversations: t
        }
      };
    }
  }, {
    key: "findConversationIndex",
    value: function findConversationIndex(e) {
      return this.list.findIndex(function (t) {
        return e.toString() === t.target.toString();
      });
    }
  }, {
    key: "findConversation",
    value: function findConversation(e) {
      var t = this.findConversationIndex(e);
      return this.list[t];
    }
  }, {
    key: "removeLocalConversation",
    value: function removeLocalConversation(e) {
      var t = this.findConversationIndex(e.target);
      this.list.splice(t, 1);
    }
  }, {
    key: "insertOne",
    value: function insertOne(e) {
      Tn.sortedInserter.insert(this.list, e), this.list.length > Tn.CONVERSATIONS_MAX_LENGTH && (this.list = this.list.slice(0, Tn.CONVERSATIONS_MAX_LENGTH));
    }
  }, {
    key: "correctPosition",
    value: function correctPosition(e) {
      this.removeLocalConversation(e), this.insertOne(e);
    }
  }, {
    key: "removeConversation",
    value: function removeConversation(e) {
      var t = this.findConversation(e);
      t && (this.removeLocalConversation(t), this.fireUpdated());
    }
  }, {
    key: "top",
    value: function top(e, t, s) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee49() {
        var i;
        return _regenerator.default.wrap(function _callee49$(_context49) {
          while (1) {
            switch (_context49.prev = _context49.next) {
              case 0:
                if (u.isBoolean(t)) {
                  _context49.next = 2;
                  break;
                }
                throw new Error("top must be boolean.");
              case 2:
                i = this.findConversation(e);
                if (i) {
                  _context49.next = 5;
                  break;
                }
                throw new Error("conversation does not exist.");
              case 5:
                _context49.t0 = i.top != t;
                if (!_context49.t0) {
                  _context49.next = 11;
                  break;
                }
                _context49.next = 9;
                return this.remoteConversations.top(e, t);
              case 9:
                i.top = t;
                this.correctPosition(i);
              case 11:
                this.fireUpdated();
                v.onSuccess(s);
              case 13:
              case "end":
                return _context49.stop();
            }
          }
        }, _callee49, this);
      }));
    }
  }, {
    key: "remove",
    value: function remove(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee50() {
        var s;
        return _regenerator.default.wrap(function _callee50$(_context50) {
          while (1) {
            switch (_context50.prev = _context50.next) {
              case 0:
                s = this.findConversation(e);
                if (s) {
                  _context50.next = 3;
                  break;
                }
                throw new Error("conversation does not exist.");
              case 3:
                if (!(s instanceof Cn && !s.isEnded())) {
                  _context50.next = 5;
                  break;
                }
                throw new Error("CS conversation can only be deleted after it ends");
              case 5:
                _context50.next = 7;
                return this.remoteConversations.remove(e);
              case 7:
                this.removeLocalConversation(s);
                this.fireUpdated();
                v.onSuccess(t);
              case 10:
              case "end":
                return _context50.stop();
            }
          }
        }, _callee50, this);
      }));
    }
  }, {
    key: "buildByAbbr",
    value: function buildByAbbr(e, t) {
      var s,
        i = st.byIMMessage(t);
      if (e.t === o.CS) {
        var _e22 = t;
        te.Socket.user().id === _e22.customerId() ? s = new bn(i) : (s = new Cn(i), s.accepted = _e22.accepted);
      } else s = new bn(i);
      return s.dataLoaded = !0, s.top = e.top, s.data = e.d ? JSON.parse(e.d) : {}, s;
    }
  }, {
    key: "buildByMessage",
    value: function buildByMessage(e) {
      var t,
        s = st.byIMMessage(e);
      if (e.scene() === o.CS) {
        var _i25 = e;
        te.Socket.user().id === _i25.customerId() ? t = new bn(s) : (t = new Cn(s), t.accepted = _i25.accepted);
      } else t = new bn(s);
      return t;
    }
  }]);
  return Tn;
}();
Tn.CONVERSATIONS_MAX_LENGTH = 200, Tn.sortedInserter = new ( /*#__PURE__*/function (_Ze2) {
  (0, _inherits2.default)(_class16, _Ze2);
  var _super36 = _createSuper(_class16);
  function _class16() {
    (0, _classCallCheck2.default)(this, _class16);
    return _super36.apply(this, arguments);
  }
  (0, _createClass2.default)(_class16, [{
    key: "compare",
    value: function compare(e, t) {
      var s;
      if (e.top == t.top) {
        var _i26 = e.maxMessageTime();
        s = t.maxMessageTime() - _i26;
      } else s = e.top ? -1 : 1;
      return 0 === s ? 0 : s > 0 ? 1 : -1;
    }
  }]);
  return _class16;
}(Ze))();
var On = /*#__PURE__*/function (_J3) {
  (0, _inherits2.default)(On, _J3);
  var _super37 = _createSuper(On);
  function On() {
    (0, _classCallCheck2.default)(this, On);
    return _super37.apply(this, arguments);
  }
  (0, _createClass2.default)(On, [{
    key: "postConnect",
    value: function postConnect() {
      Po.init();
    }
  }], [{
    key: "init",
    value: function init() {
      return this.module = new On(), this.module.name = this.GIM_MODULE_NAME, this.initGN(), this.module;
    }
  }, {
    key: "initGN",
    value: function initGN() {
      ce.addAssembler(new ( /*#__PURE__*/function () {
        function _class17() {
          (0, _classCallCheck2.default)(this, _class17);
        }
        (0, _createClass2.default)(_class17, [{
          key: "assemble",
          value: function assemble(e) {
            var t = {
              messageId: e.id,
              timestamp: e.tm,
              type: e.t,
              senderId: e.sid,
              toType: e.tt
            };
            return e.tt === o.GROUP && (t.groupId = e.gid), t;
          }
        }, {
          key: "support",
          value: function support(e) {
            return !!e.sid;
          }
        }]);
        return _class17;
      }())());
    }
  }, {
    key: "check",
    value: function check() {
      if (!this.module) throw {
        code: 400,
        content: "IM not initialized. Please include 'IM' in the 'modules' during GoEasy initialization."
      };
    }
  }]);
  return On;
}(J);
On.GIM_MODULE_NAME = "GIM";
var An = /*#__PURE__*/function (_Tn) {
  (0, _inherits2.default)(An, _Tn);
  var _super38 = _createSuper(An);
  function An() {
    var _this78;
    (0, _classCallCheck2.default)(this, An);
    _this78 = _super38.call(this), _this78.expired = !1, Qe.i.on(Be.CS_ONLINE_SUCCESS, _this78.onCSOnlineSuccess.bind((0, _assertThisInitialized2.default)(_this78))), Qe.i.on(Be.CS_OFFLINE_SUCCESS, _this78.onCSOfflineSuccess.bind((0, _assertThisInitialized2.default)(_this78))), mn.on(mn.EVENT.LOST, _this78.onDisconnected.bind((0, _assertThisInitialized2.default)(_this78))), mn.on(mn.EVENT.RECONNECTED, _this78.onConnected.bind((0, _assertThisInitialized2.default)(_this78)));
    return _this78;
  }
  (0, _createClass2.default)(An, [{
    key: "onMaxMessageChanged",
    value: function onMaxMessageChanged(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee51() {
        var _t25, _t26;
        return _regenerator.default.wrap(function _callee51$(_context51) {
          while (1) {
            switch (_context51.prev = _context51.next) {
              case 0:
                if (!(e.scene() === o.CS)) {
                  _context51.next = 10;
                  break;
                }
                _t25 = e;
                if (!(_t25.customerId() != te.Socket.user().id && (!1 === _t25.accepted || _t25.type === je.ACCEPT))) {
                  _context51.next = 10;
                  break;
                }
                if (!(je.ACCEPT === e.type)) {
                  _context51.next = 8;
                  break;
                }
                _t26 = st.byIMMessage(e);
                this.removeConversation(_t26);
                _context51.next = 10;
                break;
              case 8:
                _context51.next = 10;
                return this.saveOrUpdateConversation(e);
              case 10:
              case "end":
                return _context51.stop();
            }
          }
        }, _callee51, this);
      }));
    }
  }, {
    key: "latestConversations",
    value: function latestConversations(e) {
      var _this79 = this;
      var t = Object.create(null, {
        latestConversations: {
          get: function get() {
            return (0, _get2.default)((0, _getPrototypeOf2.default)(An.prototype), "latestConversations", _this79);
          }
        }
      });
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee52() {
        var s;
        return _regenerator.default.wrap(function _callee52$(_context52) {
          while (1) {
            switch (_context52.prev = _context52.next) {
              case 0:
                s = this.synchronized;
                _context52.next = 3;
                return t.latestConversations.call(this, e);
              case 3:
                this.list.length > 0 && !s && this.fireUpdated();
              case 4:
              case "end":
                return _context52.stop();
            }
          }
        }, _callee52, this);
      }));
    }
  }, {
    key: "onUnreadMessageChanged",
    value: function onUnreadMessageChanged(e) {}
  }, {
    key: "onCSOnlineSuccess",
    value: function onCSOnlineSuccess() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee53() {
        return _regenerator.default.wrap(function _callee53$(_context53) {
          while (1) {
            switch (_context53.prev = _context53.next) {
              case 0:
                _context53.next = 2;
                return this.loadServerConversations();
              case 2:
                this.fireUpdated();
              case 3:
              case "end":
                return _context53.stop();
            }
          }
        }, _callee53, this);
      }));
    }
  }, {
    key: "onCSOfflineSuccess",
    value: function onCSOfflineSuccess() {
      this.list = [], this.fireUpdated();
    }
  }, {
    key: "getUpdatedEventName",
    value: function getUpdatedEventName() {
      return Ve.PENDING_CONVERSATIONS_UPDATED;
    }
  }, {
    key: "rocketName",
    value: function rocketName() {
      return y.CS_PENDING_CONVERSATION;
    }
  }, {
    key: "convertAbbrConversation",
    value: function convertAbbrConversation(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee54() {
        var t, _iterator7, _step7, _e23, _t27, _s26, _i27, _n13, _r4, _a4, _c3;
        return _regenerator.default.wrap(function _callee54$(_context54) {
          while (1) {
            switch (_context54.prev = _context54.next) {
              case 0:
                t = e;
                _iterator7 = _createForOfIteratorHelper(t);
                try {
                  for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                    _e23 = _step7.value;
                    _e23.lastMessage.t = o.CS;
                    _t27 = _e23.customerData, _s26 = _e23.lastMessage, _i27 = _e23.userOffsets, _n13 = _t27 ? JSON.parse(_t27) : {}, _r4 = this.builder.build(_s26), _a4 = st.byIMMessage(_r4), _c3 = this.findConversation(_a4);
                    u.isUndef(_c3) && (_c3 = new Cn(_a4), _c3.accepted = _r4.accepted, _c3.dataLoaded = !0, this.insertOne(_c3)), _c3.top = !1, _c3.data = _n13, vn.get(_a4).initPendingMaxMessageAndOffsets(_r4, _i27), this.correctPosition(_c3);
                  }
                } catch (err) {
                  _iterator7.e(err);
                } finally {
                  _iterator7.f();
                }
              case 3:
              case "end":
                return _context54.stop();
            }
          }
        }, _callee54, this);
      }));
    }
  }, {
    key: "onDisconnected",
    value: function onDisconnected() {
      this.expired = !0;
    }
  }, {
    key: "onConnected",
    value: function onConnected() {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee55() {
        return _regenerator.default.wrap(function _callee55$(_context55) {
          while (1) {
            switch (_context55.prev = _context55.next) {
              case 0:
                _context55.t0 = this.expired && On.module && On.module.active;
                if (!_context55.t0) {
                  _context55.next = 7;
                  break;
                }
                this.expired = !1;
                this.list = [];
                _context55.next = 6;
                return this.loadServerConversations();
              case 6:
                this.fireUpdated();
              case 7:
              case "end":
                return _context55.stop();
            }
          }
        }, _callee55, this);
      }));
    }
  }]);
  return An;
}(Tn);
var Rn = /*#__PURE__*/function () {
  function Rn() {
    (0, _classCallCheck2.default)(this, Rn);
    this.conversations = new Tn(), this.pendingConversations = new An();
  }
  (0, _createClass2.default)(Rn, [{
    key: "latestConversations",
    value: function latestConversations(e) {
      this.conversations.latestConversations(e);
    }
  }, {
    key: "latestPendingConversations",
    value: function latestPendingConversations(e) {
      this.pendingConversations.latestConversations(e);
    }
  }, {
    key: "topPrivateConversation",
    value: function topPrivateConversation(e) {
      var t = st.byScene(o.PRIVATE, e.userId);
      this.conversations.top(t, e.top, e);
    }
  }, {
    key: "topGroupConversation",
    value: function topGroupConversation(e) {
      var t = st.byScene(o.GROUP, e.groupId);
      this.conversations.top(t, e.top, e);
    }
  }, {
    key: "topConversation",
    value: function topConversation(e) {
      var t = e.conversation;
      this.validateConversationDTO(t);
      var s = st.byConversationDTO(t);
      this.conversations.top(s, e.top, e);
    }
  }, {
    key: "removePrivateConversation",
    value: function removePrivateConversation(e) {
      var t = st.byScene(o.PRIVATE, e.userId);
      this.conversations.remove(t, e);
    }
  }, {
    key: "removeGroupConversation",
    value: function removeGroupConversation(e) {
      var t = st.byScene(o.GROUP, e.groupId);
      this.conversations.remove(t, e);
    }
  }, {
    key: "removeConversation",
    value: function removeConversation(e) {
      var t = e.conversation;
      this.validateConversationDTO(t);
      var s = st.byConversationDTO(t);
      this.conversations.remove(s, e);
    }
  }, {
    key: "validateConversationDTO",
    value: function validateConversationDTO(e) {
      if (!(e instanceof a)) throw new Error("Incorrect conversation object.");
      {
        var _t28 = e.lastMessage;
        if (_t28 instanceof ut && _t28.customerId() !== te.Socket.user().id && !1 === _t28.accepted) throw new Error("pending conversation cannot be topped or removed.");
      }
    }
  }]);
  return Rn;
}();
var kn = /*#__PURE__*/function () {
  function kn() {
    (0, _classCallCheck2.default)(this, kn);
    this.builder = new lt(), te.Socket.onMessage(me.imMessage, this.onMessageReceived.bind(this));
  }
  (0, _createClass2.default)(kn, [{
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      if (e.t !== o.CS) {
        var _t29 = this.builder.build(e);
        this.sendAck(_t29);
        var _s27 = st.byIMMessage(_t29),
          _i28 = _s27.scene;
        vn.get(_s27).existsMessage(_t29) || (this.createNotification(e), Qe.i.fire(Be.MESSAGE_RECEIVED, _t29), _i28 === o.PRIVATE ? gt.fire(Ve.PRIVATE_MESSAGE_RECEIVED, _t29) : _i28 === o.GROUP && gt.fire(Ve.GROUP_MESSAGE_RECEIVED, _t29));
      }
    }
  }, {
    key: "sendAck",
    value: function sendAck(e) {
      te.Socket.sendAck("imAck", {
        publishGuid: e.messageId
      });
    }
  }, {
    key: "createNotification",
    value: function createNotification(e) {
      var t = te.N.supportAppNotification();
      if (!u.isObject(e.nt) || e.s === te.Socket.user().id || !t) return;
      var s = {
        id: e.i,
        tm: e.ts,
        t: e.mt,
        sid: e.s,
        tt: e.t
      };
      s.tt === o.GROUP && (s.gid = e.r), te.N.createLocalNotification(e.nt.t, e.nt.c, s, e.nt.sound, e.nt.badge);
    }
  }]);
  return kn;
}();
var Pn = /*#__PURE__*/function () {
  function Pn() {
    (0, _classCallCheck2.default)(this, Pn);
    this.subscribedGroups = [], te.Socket.on(fe.EXPIRED_RECONNECTED, this.expiredResubscribeGroups.bind(this));
  }
  (0, _createClass2.default)(Pn, [{
    key: "expiredResubscribeGroups",
    value: function expiredResubscribeGroups() {
      var _this80 = this;
      this.subscribedGroups.forEach(function (e) {
        return b(_this80, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee56() {
          return _regenerator.default.wrap(function _callee56$(_context56) {
            while (1) {
              switch (_context56.prev = _context56.next) {
                case 0:
                  _context56.next = 2;
                  return this.doSubscribeGroup(e);
                case 2:
                case "end":
                  return _context56.stop();
              }
            }
          }, _callee56, this);
        }));
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(e) {
      var _this81 = this;
      var t = e.groupIds;
      le.validateIdArray(t, "groupIds");
      var s = new _n(t, e.accessToken);
      this.doSubscribeGroup(s).then(function () {
        _this81.subscribedGroups.push(s), v.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }).catch(function (t) {
        v.onFailed(e, {
          code: t.resultCode || 408,
          content: t.content || "Failed to subscribe group message"
        });
      });
    }
  }, {
    key: "doSubscribeGroup",
    value: function doSubscribeGroup(e) {
      return new Promise(function (t, s) {
        var i = e.groupIds.toString().split(","),
          n = new re({
            name: y.subscribeGroups,
            params: {
              groupIds: i,
              at: e.accessToken
            },
            permission: ne.WRITE,
            singleTimeout: S.commonRequestSingle,
            totalTimeout: S.commonRequestTotal,
            success: function success() {
              t();
            },
            fail: function fail(e) {
              s(e);
            }
          });
        te.Socket.e(n);
      });
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(e) {
      var _this82 = this;
      le.validateId(e.groupId, "groupId"), e.groupId = e.groupId.toString();
      var t = new re({
        name: y.unsubscribeGroup,
        params: {
          groupId: e.groupId
        },
        permission: ne.READ,
        singleTimeout: S.commonRequestSingle,
        totalTimeout: S.commonRequestTotal,
        success: function success() {
          _this82.deleteSubscriptionByGroupId(e.groupId), v.onSuccess(e, {
            code: 200,
            content: "ok"
          });
        },
        fail: function fail(t) {
          v.onFailed(e, {
            code: t.resultCode || 408,
            content: t.content || "Failed to unsubscribe group message"
          });
        }
      });
      te.Socket.e(t);
    }
  }, {
    key: "deleteSubscriptionByGroupId",
    value: function deleteSubscriptionByGroupId(e) {
      this.subscribedGroups = this.subscribedGroups.filter(function (t) {
        var s = t.groupIds.findIndex(function (t) {
          return t == e;
        });
        return s > -1 && t.groupIds.splice(s, 1), t.groupIds.length > 0;
      });
    }
  }]);
  return Pn;
}();
var _n = /*#__PURE__*/(0, _createClass2.default)(function _n(e, t) {
  (0, _classCallCheck2.default)(this, _n);
  this.groupIds = e, this.accessToken = t;
});
var Dn = /*#__PURE__*/function () {
  function Dn() {
    (0, _classCallCheck2.default)(this, Dn);
    this.newMessageReceived = function (e) {
      var t = null;
      e.c && (t = JSON.parse(e.c)), t && t.events && t.events.map(function (e) {
        var s = e.userData ? JSON.parse(e.userData) : {},
          i = {
            time: e.time,
            action: e.action,
            groupOnlineCount: t.userAmount,
            groupId: t.groupId,
            id: e.userId,
            data: s
          };
        gt.fire(Ve.GROUP_PRESENCE, i);
      });
    }, mn.onMessage(me.groupPresence, this.newMessageReceived);
  }
  (0, _createClass2.default)(Dn, [{
    key: "presence",
    value: function presence(e) {
      le.validateIdArray(e.groupIds, "groupIds"), e.groupIds.toString().split(",");
      var t = {
        groupIds: e.groupIds
      };
      this.emitRocket(y.subscribeGroupPresence, t, function () {
        v.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }, function (t) {
        v.onFailed(e, {
          code: t.code || 408,
          content: t.content || "Failed to subscribe group message"
        });
      }, S.commonRequestSingle, S.commonRequestTotal);
    }
  }, {
    key: "unPresence",
    value: function unPresence(e) {
      le.validateId(e.groupId, "groupId"), e.groupId = e.groupId.toString();
      var t = {
        groupId: e.groupId
      };
      this.emitRocket(y.unsubscribeGroupPresence, t, function () {
        v.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }, function (t) {
        v.onFailed(e, {
          code: t.code || 408,
          content: t.content || "Failed to unsubscribe presence"
        });
      }, S.commonRequestSingle, S.commonRequestTotal);
    }
  }, {
    key: "emitRocket",
    value: function emitRocket(e, t, s, i, n, o) {
      var r = new re({
        name: e,
        params: t,
        singleTimeout: n,
        totalTimeout: o,
        permission: ne.WRITE,
        success: s,
        fail: i
      });
      te.Socket.e(r);
    }
  }]);
  return Dn;
}();
var xn = /*#__PURE__*/function () {
  function xn() {
    (0, _classCallCheck2.default)(this, xn);
  }
  (0, _createClass2.default)(xn, [{
    key: "get",
    value: function get(e) {
      le.validateId(e.groupId, "groupId"), e.groupId = e.groupId.toString();
      var t = new re({
        name: y.imGroupOnlineCount,
        params: {
          groupId: e.groupId
        },
        permission: ne.READ,
        singleTimeout: S.commonQuerySingle,
        totalTimeout: S.commonQueryTotal,
        fail: function fail(t) {
          v.onFailed(e, t || {
            code: 408,
            content: "Failed to query online group users"
          });
        },
        success: function success(t) {
          200 == t.code ? v.onSuccess(e, t) : v.onFailed(e, t);
        }
      });
      te.Socket.e(t);
    }
  }]);
  return xn;
}();
var Un = /*#__PURE__*/function () {
  function Un() {
    (0, _classCallCheck2.default)(this, Un);
  }
  (0, _createClass2.default)(Un, [{
    key: "doHereNow",
    value: function doHereNow(e, t, s) {
      var i = new re({
        name: e,
        params: t,
        permission: ne.READ,
        singleTimeout: S.commonQuerySingle,
        totalTimeout: S.commonQueryTotal,
        fail: function fail(e) {
          v.onFailed(s, e);
        },
        success: function success(e) {
          var t = e.content;
          e.content = t.map(function (e) {
            var t = e.userData ? JSON.parse(e.userData) : {};
            return {
              id: e.userId,
              data: t
            };
          }), v.onSuccess(s, e);
        }
      });
      te.Socket.e(i);
    }
  }]);
  return Un;
}();
var Fn = /*#__PURE__*/function (_Un) {
  (0, _inherits2.default)(Fn, _Un);
  var _super39 = _createSuper(Fn);
  function Fn() {
    (0, _classCallCheck2.default)(this, Fn);
    return _super39.apply(this, arguments);
  }
  (0, _createClass2.default)(Fn, [{
    key: "hereNow",
    value: function hereNow(e) {
      le.validateId(e.groupId, "groupId"), e.groupId = e.groupId.toString();
      var t = {
        groupId: e.groupId
      };
      this.doHereNow(y.imGroupHereNow, t, e);
    }
  }]);
  return Fn;
}(Un);
var Gn = /*#__PURE__*/function () {
  function Gn() {
    (0, _classCallCheck2.default)(this, Gn);
    this.newMessageReceived = function (e) {
      var t = [];
      e.c && (t = JSON.parse(e.c).events || []), t.map(function (e) {
        var t = e.userData ? JSON.parse(e.userData) : {},
          s = {
            time: e.time,
            action: e.action,
            id: e.userId,
            data: t
          };
        gt.fire(Ve.USER_PRESENCE, s);
      });
    }, mn.onMessage(me.userPresence, this.newMessageReceived);
  }
  (0, _createClass2.default)(Gn, [{
    key: "presence",
    value: function presence(e) {
      le.validateIdArray(e.userIds, "userIds"), e.userIds.toString().split(",");
      var t = {
        userIds: e.userIds
      };
      this.emitRocket(y.subscribeUserPresence, t, function () {
        v.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }, function (t) {
        v.onFailed(e, {
          code: t.code || 408,
          content: t.content || "Failed to subscribe group message"
        });
      }, S.commonRequestSingle, S.commonRequestTotal);
    }
  }, {
    key: "unPresence",
    value: function unPresence(e) {
      le.validateId(e.userId, "userId"), e.userId = e.userId.toString();
      var t = {
        userId: e.userId
      };
      this.emitRocket(y.unsubscribeUserPresence, t, function () {
        v.onSuccess(e, {
          code: 200,
          content: "ok"
        });
      }, function (t) {
        v.onFailed(e, {
          code: t.code || 408,
          content: t.content || "Failed to unsubscribe presence"
        });
      }, S.commonRequestSingle, S.commonRequestTotal);
    }
  }, {
    key: "emitRocket",
    value: function emitRocket(e, t, s, i, n, o) {
      var r = new re({
        name: e,
        params: t,
        singleTimeout: n,
        totalTimeout: o,
        permission: ne.WRITE,
        success: s,
        fail: i
      });
      te.Socket.e(r);
    }
  }]);
  return Gn;
}();
var Ln = /*#__PURE__*/function (_Un2) {
  (0, _inherits2.default)(Ln, _Un2);
  var _super40 = _createSuper(Ln);
  function Ln() {
    (0, _classCallCheck2.default)(this, Ln);
    return _super40.apply(this, arguments);
  }
  (0, _createClass2.default)(Ln, [{
    key: "hereNow",
    value: function hereNow(e) {
      var t = e.userIds;
      le.validateIdArray(t, "userIds"), t.toString().split(","), this.doHereNow(y.imHereNow, e, e);
    }
  }]);
  return Ln;
}(Un);
var Bn = new ( /*#__PURE__*/function () {
  function _class18() {
    (0, _classCallCheck2.default)(this, _class18);
  }
  (0, _createClass2.default)(_class18, [{
    key: "fileExtension",
    value: function fileExtension(e, t) {
      if (u.isString(e)) try {
        var _s28 = e.split(t);
        return _s28[_s28.length - 1];
      } catch (e) {
        throw Error(e);
      }
    }
  }]);
  return _class18;
}())();
var qn = /*#__PURE__*/(0, _createClass2.default)(function qn() {
  (0, _classCallCheck2.default)(this, qn);
});
var jn = /*#__PURE__*/function (_qn) {
  (0, _inherits2.default)(jn, _qn);
  var _super41 = _createSuper(jn);
  function jn() {
    var _this83;
    (0, _classCallCheck2.default)(this, jn);
    _this83 = _super41.apply(this, arguments), _this83.contentType = "", _this83.name = "", _this83.size = 0, _this83.url = "";
    return _this83;
  }
  return (0, _createClass2.default)(jn);
}(qn);
var Vn = /*#__PURE__*/function (_jn) {
  (0, _inherits2.default)(Vn, _jn);
  var _super42 = _createSuper(Vn);
  function Vn() {
    var _this84;
    (0, _classCallCheck2.default)(this, Vn);
    _this84 = _super42.apply(this, arguments), _this84.width = 0, _this84.height = 0;
    return _this84;
  }
  return (0, _createClass2.default)(Vn);
}(jn);
var Hn = /*#__PURE__*/function () {
  function Hn() {
    (0, _classCallCheck2.default)(this, Hn);
  }
  (0, _createClass2.default)(Hn, [{
    key: "build",
    value: function build(e) {
      this.validate(e.createOptions);
      var t = this.create();
      return this.setPayload(e, t), t;
    }
  }]);
  return Hn;
}();
var zn = /*#__PURE__*/function (_Hn) {
  (0, _inherits2.default)(zn, _Hn);
  var _super43 = _createSuper(zn);
  function zn() {
    (0, _classCallCheck2.default)(this, zn);
    return _super43.apply(this, arguments);
  }
  (0, _createClass2.default)(zn, [{
    key: "create",
    value: function create() {
      return new jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file;
      s.url = i.path, s.name = i.name, s.size = i.size, s.contentType = i.type, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!u.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return zn;
}(Hn);
var Wn = /*#__PURE__*/function (_zn) {
  (0, _inherits2.default)(Wn, _zn);
  var _super44 = _createSuper(Wn);
  function Wn() {
    (0, _classCallCheck2.default)(this, Wn);
    return _super44.apply(this, arguments);
  }
  (0, _createClass2.default)(Wn, [{
    key: "create",
    value: function create() {
      return new Vn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Wn.prototype), "setPayload", this).call(this, e, t);
      var s = e.createOptions.file,
        i = t,
        n = s.path || s.tempFilePath,
        o = u.isEmpty(s.name) || void 0 === s.name ? n : s.name;
      i.name = "wx-image." + Bn.fileExtension(o, "."), i.contentType = "image/" + Bn.fileExtension(o, "."), i.url = n, i.size = s.size, e.complete = new Promise(function (e, t) {
        wx.getImageInfo({
          src: i.url,
          success: function success(t) {
            i.width = t.width, i.height = t.height, e();
          },
          fail: function fail(e) {
            t(e);
          }
        });
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Wn.prototype), "validate", this).call(this, e);
    }
  }]);
  return Wn;
}(zn);
var Jn = /*#__PURE__*/function (_jn2) {
  (0, _inherits2.default)(Jn, _jn2);
  var _super45 = _createSuper(Jn);
  function Jn() {
    var _this85;
    (0, _classCallCheck2.default)(this, Jn);
    _this85 = _super45.apply(this, arguments), _this85.duration = 0;
    return _this85;
  }
  return (0, _createClass2.default)(Jn);
}(jn);
var Xn = /*#__PURE__*/function (_zn2) {
  (0, _inherits2.default)(Xn, _zn2);
  var _super46 = _createSuper(Xn);
  function Xn() {
    (0, _classCallCheck2.default)(this, Xn);
    return _super46.apply(this, arguments);
  }
  (0, _createClass2.default)(Xn, [{
    key: "create",
    value: function create() {
      return new Jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Xn.prototype), "setPayload", this).call(this, e, t);
      var s = e.createOptions.file,
        i = t,
        n = s.tempFilePath,
        o = u.isEmpty(s.name) || null == s.name ? n : s.name,
        r = s.duration,
        a = s.fileSize;
      i.url = n, i.size = a, i.duration = r / 1e3, i.name = "wx-audio." + Bn.fileExtension(o, "."), i.contentType = "audio/" + Bn.fileExtension(o, "."), e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Xn.prototype), "validate", this).call(this, e);
    }
  }]);
  return Xn;
}(zn);
var $n = /*#__PURE__*/function (_qn2) {
  (0, _inherits2.default)($n, _qn2);
  var _super47 = _createSuper($n);
  function $n() {
    var _this86;
    (0, _classCallCheck2.default)(this, $n);
    _this86 = _super47.apply(this, arguments), _this86.text = "";
    return _this86;
  }
  return (0, _createClass2.default)($n);
}(qn);
var Qn = /*#__PURE__*/function (_Hn2) {
  (0, _inherits2.default)(Qn, _Hn2);
  var _super48 = _createSuper(Qn);
  function Qn() {
    (0, _classCallCheck2.default)(this, Qn);
    return _super48.apply(this, arguments);
  }
  (0, _createClass2.default)(Qn, [{
    key: "create",
    value: function create() {
      return new $n();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions;
      s.text = i.text, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (u.isEmpty(e.text)) throw {
        code: 400,
        content: "text is empty"
      };
      if (!u.isString(e.text)) throw {
        code: 400,
        content: "TypeError: text requires string."
      };
      if ("" === e.text.trim()) throw {
        code: 400,
        content: "text is empty"
      };
      if (e.text.length > 2500) throw {
        code: 400,
        content: "Message text over max length 2500"
      };
    }
  }]);
  return Qn;
}(Hn);
var Yn = /*#__PURE__*/function (_qn3) {
  (0, _inherits2.default)(Yn, _qn3);
  var _super49 = _createSuper(Yn);
  function Yn() {
    var _this87;
    (0, _classCallCheck2.default)(this, Yn);
    _this87 = _super49.apply(this, arguments), _this87.video = new Zn(), _this87.thumbnail = new Kn();
    return _this87;
  }
  return (0, _createClass2.default)(Yn);
}(qn);
var Kn = /*#__PURE__*/function () {
  function Kn() {
    (0, _classCallCheck2.default)(this, Kn);
    this.name = "", this.url = "", this.width = 0, this.height = 0, this.contentType = "";
  }
  (0, _createClass2.default)(Kn, [{
    key: "initURL",
    value: function initURL(e) {
      d.currentPlatform() === l.BROWSER && this.htmlUrl(e);
    }
  }, {
    key: "htmlUrl",
    value: function htmlUrl(e) {
      var t = document.createElement("canvas");
      t.width = e.videoWidth, t.height = e.videoHeight, t.getContext("2d").drawImage(e, 0, 0, t.width, t.height), this.url = t.toDataURL("image/png");
    }
  }]);
  return Kn;
}();
var Zn = /*#__PURE__*/(0, _createClass2.default)(function Zn() {
  (0, _classCallCheck2.default)(this, Zn);
  this.name = "", this.url = "", this.width = 0, this.height = 0, this.contentType = "", this.size = 0, this.duration = 0;
});
var eo = /*#__PURE__*/function (_Hn3) {
  (0, _inherits2.default)(eo, _Hn3);
  var _super50 = _createSuper(eo);
  function eo() {
    (0, _classCallCheck2.default)(this, eo);
    return _super50.apply(this, arguments);
  }
  (0, _createClass2.default)(eo, [{
    key: "create",
    value: function create() {
      return new Yn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions.file,
        i = t,
        n = i.video,
        o = i.thumbnail,
        r = s.duration,
        a = s.height,
        c = s.size,
        l = s.tempFilePath,
        d = s.thumbTempFilePath,
        h = s.width,
        _s$name = s.name,
        p = _s$name === void 0 ? "" : _s$name,
        m = u.isEmpty(p) ? l : p;
      n.contentType = "video/" + Bn.fileExtension(m, "."), n.name = "wx-video." + Bn.fileExtension(m, "."), n.url = l, n.width = o.width = h, n.height = o.height = a, n.size = c, n.duration = r, o.url = d, o.contentType = "image/jpg", o.name = "wx-thumbnail.jpg", e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!u.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return eo;
}(Hn);
var to = /*#__PURE__*/function (_Hn4) {
  (0, _inherits2.default)(to, _Hn4);
  var _super51 = _createSuper(to);
  function to() {
    (0, _classCallCheck2.default)(this, to);
    return _super51.apply(this, arguments);
  }
  (0, _createClass2.default)(to, [{
    key: "create",
    value: function create() {
      return new jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file;
      s.url = i.fullPath || i.path, s.name = i.name, s.size = i.size, s.contentType = i.type, i.type, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!u.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return to;
}(Hn);
var so = /*#__PURE__*/function (_to) {
  (0, _inherits2.default)(so, _to);
  var _super52 = _createSuper(so);
  function so() {
    (0, _classCallCheck2.default)(this, so);
    return _super52.apply(this, arguments);
  }
  (0, _createClass2.default)(so, [{
    key: "create",
    value: function create() {
      return new Vn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file;
      s.url = i.path, s.size = i.size;
      var n = u.isEmpty(i.name) || void 0 === i.name ? i.path : i.name;
      s.contentType = "image/" + Bn.fileExtension(n, "."), s.name = "uni-image." + Bn.fileExtension(n, "."), e.complete = new Promise(function (e, t) {
        uni.getImageInfo({
          src: i.path,
          success: function success(t) {
            s.width = t.width, s.height = t.height, e();
          },
          fail: function fail(e) {
            t(e);
          }
        });
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(so.prototype), "validate", this).call(this, e);
    }
  }]);
  return so;
}(to);
var io = /*#__PURE__*/function (_to2) {
  (0, _inherits2.default)(io, _to2);
  var _super53 = _createSuper(io);
  function io() {
    (0, _classCallCheck2.default)(this, io);
    return _super53.apply(this, arguments);
  }
  (0, _createClass2.default)(io, [{
    key: "create",
    value: function create() {
      return new Jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions,
        i = t,
        n = s.file,
        o = n.tempFilePath,
        r = u.isEmpty(n.name) || null == n.name ? o : n.name;
      i.url = o, i.name = "uni-audio." + Bn.fileExtension(r, "."), i.contentType = "audio/" + Bn.fileExtension(r, "."), e.complete = new Promise(function (e, t) {
        uni.getFileInfo({
          filePath: o,
          success: function success(n) {
            var r = n.size;
            if (i.size = r, 0 === r) e();else if (u.isDef(s.file.duration)) i.duration = s.file.duration / 1e3, e();else {
              var _s29 = uni.createInnerAudioContext();
              _s29.src = o, _s29.onCanplay(function (n) {
                n.errCode ? (_s29.destroy(), t(n)) : (i.duration = _s29.duration, _s29.destroy(), e());
              }), _s29.onError(function (i) {
                _s29.destroy(), -99 === i.errCode ? e() : t(i);
              });
            }
          },
          fail: function fail(e) {
            t(e);
          }
        });
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(io.prototype), "validate", this).call(this, e);
    }
  }]);
  return io;
}(to);
var no = /*#__PURE__*/function (_Hn5) {
  (0, _inherits2.default)(no, _Hn5);
  var _super54 = _createSuper(no);
  function no() {
    (0, _classCallCheck2.default)(this, no);
    return _super54.apply(this, arguments);
  }
  (0, _createClass2.default)(no, [{
    key: "create",
    value: function create() {
      return new Yn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions.file,
        i = t,
        n = i.video,
        o = i.thumbnail,
        r = s.duration,
        a = s.height,
        c = s.size,
        l = s.tempFilePath,
        d = s.width,
        _s$name2 = s.name,
        h = _s$name2 === void 0 ? "" : _s$name2,
        p = u.isEmpty(h) ? l : h;
      n.size = c, n.width = d, n.height = a, n.url = l, n.duration = r, n.contentType = "video/" + Bn.fileExtension(p, "."), n.name = "uni-video." + Bn.fileExtension(p, "."), o.url = l, o.height = 200, o.width = Number((n.width * o.height / n.height).toFixed(0)), o.contentType = "image/jpg", o.name = "uni-thumbnail.jpg", e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!u.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return no;
}(Hn);
var oo = /*#__PURE__*/function (_Hn6) {
  (0, _inherits2.default)(oo, _Hn6);
  var _super55 = _createSuper(oo);
  function oo() {
    (0, _classCallCheck2.default)(this, oo);
    return _super55.apply(this, arguments);
  }
  (0, _createClass2.default)(oo, [{
    key: "create",
    value: function create() {
      return new jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file,
        n = window.URL || window.webkitURL;
      s.url = n.createObjectURL(i), s.name = i.name, s.size = i.size, s.contentType = i.type, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!(e.file instanceof File)) throw Error("wrong file type.");
      if (0 == e.file.size) throw Error("File size is 0.");
      if (e.file.size > 524288e3) throw Error("message-length limit 30mib");
    }
  }]);
  return oo;
}(Hn);
var ro = /*#__PURE__*/function (_oo) {
  (0, _inherits2.default)(ro, _oo);
  var _super56 = _createSuper(ro);
  function ro() {
    (0, _classCallCheck2.default)(this, ro);
    return _super56.apply(this, arguments);
  }
  (0, _createClass2.default)(ro, [{
    key: "create",
    value: function create() {
      return new Vn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(ro.prototype), "setPayload", this).call(this, e, t);
      var s = e.createOptions.file,
        i = t,
        n = window.URL || window.webkitURL,
        o = new Image();
      o.src = n.createObjectURL(s), e.complete = new Promise(function (e, t) {
        o.onload = function () {
          i.width = o.width, i.height = o.height, n.revokeObjectURL(o.src), e();
        }, o.onerror = function (e) {
          n.revokeObjectURL(o.src), t(e);
        };
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(ro.prototype), "validate", this).call(this, e);
      var t = ["gif", "jpg", "png", "jpeg"];
      if (!t.find(function (t) {
        return t === e.file.type.split("/")[1].toLowerCase();
      })) throw Error("Only " + t.join(",") + " is supported image.");
    }
  }]);
  return ro;
}(oo);
var ao = /*#__PURE__*/function (_oo2) {
  (0, _inherits2.default)(ao, _oo2);
  var _super57 = _createSuper(ao);
  function ao() {
    (0, _classCallCheck2.default)(this, ao);
    return _super57.apply(this, arguments);
  }
  (0, _createClass2.default)(ao, [{
    key: "create",
    value: function create() {
      return new Jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(ao.prototype), "setPayload", this).call(this, e, t);
      var s = e.createOptions.file,
        i = t,
        n = window.URL || window.webkitURL,
        o = document.createElement("audio");
      o.src = n.createObjectURL(s), e.complete = new Promise(function (e, t) {
        o.onloadedmetadata = function () {
          i.duration = o.duration, n.revokeObjectURL(o.src), e();
        }, o.onerror = function (e) {
          n.revokeObjectURL(o.src), t(e);
        };
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(ao.prototype), "validate", this).call(this, e);
      var t = ["mp3", "ogg", "wav", "wma", "ape", "acc", "mpeg"];
      if (!t.find(function (t) {
        return t === e.file.type.split("/")[1].toLowerCase();
      })) throw Error("Only " + t.join(",") + " is supported audio.");
    }
  }]);
  return ao;
}(oo);
var co = /*#__PURE__*/function (_Hn7) {
  (0, _inherits2.default)(co, _Hn7);
  var _super58 = _createSuper(co);
  function co() {
    (0, _classCallCheck2.default)(this, co);
    return _super58.apply(this, arguments);
  }
  (0, _createClass2.default)(co, [{
    key: "create",
    value: function create() {
      return new Yn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var _this88 = this;
      var s = e.createOptions.file,
        i = t,
        n = i.video,
        o = i.thumbnail,
        r = window.URL || window.webkitURL,
        a = document.createElement("video");
      a.src = r.createObjectURL(s), n.size = s.size, n.name = s.name, n.contentType = s.type, n.url = a.src, o.name = s.name, o.contentType = "image/jpg", e.complete = new Promise(function (e, t) {
        a.onloadedmetadata = function () {
          n.duration = a.duration, n.width = a.videoWidth, n.height = a.videoHeight, o.width = a.videoWidth, o.height = a.videoHeight, o.url = _this88.getThumbnailUrl(a), r.revokeObjectURL(a.src), e();
        }, a.onerror = function (e) {
          r.revokeObjectURL(a.src), t(e);
        };
      });
    }
  }, {
    key: "getThumbnailUrl",
    value: function getThumbnailUrl(e) {
      var t = document.createElement("canvas");
      return t.width = e.videoWidth, t.height = e.videoHeight, t.getContext("2d").drawImage(e, 0, 0, t.width, t.height), t.toDataURL("image/png");
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!(e.file instanceof File)) throw Error("wrong file type.");
      if (0 == e.file.size) throw Error("File size is 0.");
      if (e.file.size > 31457280) throw Error("message-length limit 30mib");
      var t = ["avi", "mov", "rmvb", "rm", "flv", "mp4", "3gp", "quicktime"];
      if (!t.find(function (t) {
        return t === e.file.type.split("/")[1].toLowerCase();
      })) throw Error("Only " + t.join(",") + " is supported video.");
    }
  }]);
  return co;
}(Hn);
var uo = /*#__PURE__*/function (_Hn8) {
  (0, _inherits2.default)(uo, _Hn8);
  var _super59 = _createSuper(uo);
  function uo() {
    (0, _classCallCheck2.default)(this, uo);
    return _super59.apply(this, arguments);
  }
  (0, _createClass2.default)(uo, [{
    key: "create",
    value: function create() {
      return new Yn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions.file,
        i = t,
        n = i.video,
        o = i.thumbnail,
        r = s.duration,
        a = s.height,
        c = s.size,
        u = s.tempFilePath,
        l = s.tempVideoThumbPath,
        d = s.width;
      n.size = c, n.width = d, n.height = a, n.url = u, n.duration = r, n.contentType = "video/mp4", n.name = "ali-video.mp4", o.url = l, o.height = 200, o.width = Number((n.width * o.height / n.height).toFixed(0)), o.contentType = "image/jpg", o.name = "ali-thumbnail.jpg", e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!u.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return uo;
}(Hn);
var lo = /*#__PURE__*/function (_Hn9) {
  (0, _inherits2.default)(lo, _Hn9);
  var _super60 = _createSuper(lo);
  function lo() {
    (0, _classCallCheck2.default)(this, lo);
    return _super60.apply(this, arguments);
  }
  (0, _createClass2.default)(lo, [{
    key: "create",
    value: function create() {
      return new jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      e.complete = Promise.reject("Alipay not support file message.");
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!u.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return lo;
}(Hn);
var ho = /*#__PURE__*/function (_lo) {
  (0, _inherits2.default)(ho, _lo);
  var _super61 = _createSuper(ho);
  function ho() {
    (0, _classCallCheck2.default)(this, ho);
    return _super61.apply(this, arguments);
  }
  (0, _createClass2.default)(ho, [{
    key: "create",
    value: function create() {
      return new Vn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file;
      s.url = i.path, s.size = i.size, e.complete = new Promise(function (e, t) {
        my.getImageInfo({
          src: i.path,
          success: function success(t) {
            s.width = t.width, s.height = t.height, s.contentType = "image/" + t.type, s.name = "ali-image." + t.type, e();
          },
          fail: function fail(e) {
            t(e);
          }
        });
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(ho.prototype), "validate", this).call(this, e);
    }
  }]);
  return ho;
}(lo);
var po = /*#__PURE__*/function (_lo2) {
  (0, _inherits2.default)(po, _lo2);
  var _super62 = _createSuper(po);
  function po() {
    (0, _classCallCheck2.default)(this, po);
    return _super62.apply(this, arguments);
  }
  (0, _createClass2.default)(po, [{
    key: "create",
    value: function create() {
      return new Jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file,
        n = i.tempFilePath;
      s.url = n, s.name = "ali-audio." + Bn.fileExtension(n, "."), s.contentType = "audio/" + Bn.fileExtension(n, "."), s.duration = i.duration, s.size = i.fileSize, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(po.prototype), "validate", this).call(this, e);
    }
  }]);
  return po;
}(lo);
var mo = /*#__PURE__*/function (_Hn10) {
  (0, _inherits2.default)(mo, _Hn10);
  var _super63 = _createSuper(mo);
  function mo() {
    (0, _classCallCheck2.default)(this, mo);
    return _super63.apply(this, arguments);
  }
  (0, _createClass2.default)(mo, [{
    key: "create",
    value: function create() {
      return new Yn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions.file,
        i = t,
        n = i.video,
        o = i.thumbnail,
        r = s.duration,
        a = s.height,
        c = s.size,
        u = s.tempFilePath,
        l = s.thumbTempFilePath,
        d = s.width;
      n.size = c, n.width = d, n.height = a, n.url = u, n.duration = r, n.contentType = "video/" + Bn.fileExtension(u, "."), n.name = "baidu-video." + Bn.fileExtension(u, "."), o.url = l, o.height = 200, o.width = Number((n.width * o.height / n.height).toFixed(0)), o.contentType = "image/" + Bn.fileExtension(l, "."), o.name = "baidu-thumbnail." + Bn.fileExtension(u, "."), e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!u.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return mo;
}(Hn);
var fo = /*#__PURE__*/function (_Hn11) {
  (0, _inherits2.default)(fo, _Hn11);
  var _super64 = _createSuper(fo);
  function fo() {
    (0, _classCallCheck2.default)(this, fo);
    return _super64.apply(this, arguments);
  }
  (0, _createClass2.default)(fo, [{
    key: "create",
    value: function create() {
      return new jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      e.complete = Promise.reject("Baidu app not support file message.");
    }
  }, {
    key: "validate",
    value: function validate(e) {}
  }]);
  return fo;
}(Hn);
var go = /*#__PURE__*/function (_fo) {
  (0, _inherits2.default)(go, _fo);
  var _super65 = _createSuper(go);
  function go() {
    (0, _classCallCheck2.default)(this, go);
    return _super65.apply(this, arguments);
  }
  (0, _createClass2.default)(go, [{
    key: "create",
    value: function create() {
      return new Jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file,
        n = i.tempFilePath;
      s.url = n, s.name = "baidu-audio." + Bn.fileExtension(n, "."), s.contentType = "audio/" + Bn.fileExtension(n, "."), s.duration = i.duration / 1e3, s.size = i.fileSize, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(go.prototype), "validate", this).call(this, e);
    }
  }]);
  return go;
}(fo);
var yo = /*#__PURE__*/function (_fo2) {
  (0, _inherits2.default)(yo, _fo2);
  var _super66 = _createSuper(yo);
  function yo() {
    (0, _classCallCheck2.default)(this, yo);
    return _super66.apply(this, arguments);
  }
  (0, _createClass2.default)(yo, [{
    key: "create",
    value: function create() {
      return new Vn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file;
      s.url = i.path, s.size = i.size, e.complete = new Promise(function (e, t) {
        swan.getImageInfo({
          src: i.path,
          success: function success(t) {
            s.width = t.width, s.height = t.height, s.contentType = "image/" + t.type, s.name = "baidu-image." + t.type, e();
          },
          fail: function fail(e) {
            t(e);
          }
        });
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(yo.prototype), "validate", this).call(this, e);
    }
  }]);
  return yo;
}(fo);
var So = /*#__PURE__*/function (_Hn12) {
  (0, _inherits2.default)(So, _Hn12);
  var _super67 = _createSuper(So);
  function So() {
    (0, _classCallCheck2.default)(this, So);
    return _super67.apply(this, arguments);
  }
  (0, _createClass2.default)(So, [{
    key: "create",
    value: function create() {
      return new jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file;
      var n = i.uri,
        o = i.type,
        r = i.size,
        a = i.name;
      s.url = decodeURIComponent(n), s.name = a, s.size = r, s.contentType = o, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!u.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return So;
}(Hn);
var Eo = /*#__PURE__*/function (_So) {
  (0, _inherits2.default)(Eo, _So);
  var _super68 = _createSuper(Eo);
  function Eo() {
    (0, _classCallCheck2.default)(this, Eo);
    return _super68.apply(this, arguments);
  }
  (0, _createClass2.default)(Eo, [{
    key: "create",
    value: function create() {
      return new Vn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = t,
        i = e.createOptions.file;
      var n = i.uri,
        o = i.fileSize,
        r = i.type,
        a = i.fileName,
        c = i.width,
        u = i.height;
      s.url = n, s.size = o, s.contentType = r, s.name = a, s.width = c, s.height = u, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(Eo.prototype), "validate", this).call(this, e);
    }
  }]);
  return Eo;
}(So);
var vo = /*#__PURE__*/function (_Hn13) {
  (0, _inherits2.default)(vo, _Hn13);
  var _super69 = _createSuper(vo);
  function vo() {
    (0, _classCallCheck2.default)(this, vo);
    return _super69.apply(this, arguments);
  }
  (0, _createClass2.default)(vo, [{
    key: "create",
    value: function create() {
      return new Yn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions.file;
      var i = t,
        n = i.video,
        o = i.thumbnail,
        r = s.uri,
        a = s.type,
        c = s.fileSize,
        u = s.fileName,
        l = s.duration,
        d = s.height,
        h = s.width;
      n.size = c, n.width = h, n.height = d, n.url = r, n.duration = l, n.contentType = a, n.name = u, o.url = r, o.name = "rn-thumbnail.jpg", o.height = 200, o.width = Number((n.width * o.height / n.height).toFixed(0)), o.contentType = "image/jpg", e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      if (!u.isObject(e)) throw Error("it is an empty message.");
      if (!u.isDef(e.file)) throw Error("file is empty.");
    }
  }]);
  return vo;
}(Hn);
var bo = /*#__PURE__*/function (_So2) {
  (0, _inherits2.default)(bo, _So2);
  var _super70 = _createSuper(bo);
  function bo() {
    (0, _classCallCheck2.default)(this, bo);
    return _super70.apply(this, arguments);
  }
  (0, _createClass2.default)(bo, [{
    key: "create",
    value: function create() {
      return new Jn();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions,
        i = t,
        n = s.file;
      var o = n.uri,
        r = n.name,
        a = n.duration,
        c = n.size;
      i.url = o, i.duration = Number((a / 1e3).toFixed(2)), i.size = c, i.name = r || "rn-audio." + Bn.fileExtension(o, "."), i.contentType = "audio/" + Bn.fileExtension(o, "."), s.file = {
        uri: o,
        type: i.contentType,
        name: i.name
      }, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      (0, _get2.default)((0, _getPrototypeOf2.default)(bo.prototype), "validate", this).call(this, e);
    }
  }]);
  return bo;
}(So);
var Co = /*#__PURE__*/function (_qn4) {
  (0, _inherits2.default)(Co, _qn4);
  var _super71 = _createSuper(Co);
  function Co() {
    (0, _classCallCheck2.default)(this, Co);
    return _super71.apply(this, arguments);
  }
  return (0, _createClass2.default)(Co);
}(qn);
var wo = /*#__PURE__*/function (_Hn14) {
  (0, _inherits2.default)(wo, _Hn14);
  var _super72 = _createSuper(wo);
  function wo() {
    (0, _classCallCheck2.default)(this, wo);
    return _super72.apply(this, arguments);
  }
  (0, _createClass2.default)(wo, [{
    key: "create",
    value: function create() {
      return new Co();
    }
  }, {
    key: "setPayload",
    value: function setPayload(e, t) {
      var s = e.createOptions;
      t.payload = s.payload, e.complete = Promise.resolve();
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.type,
        s = e.payload;
      if (u.isEmpty(t)) throw Error("type is empty.");
      if (!u.isString(t)) throw Error("type require a string");
      if (u.isEmpty(s)) throw Error("payload is empty.");
      if (!u.isPlainObject(s) && !u.isStringOrNumber(s)) throw Error("payload require object | string | number.");
    }
  }]);
  return wo;
}(Hn);
var Mo = /*#__PURE__*/(0, _createClass2.default)(function Mo(e, t) {
  (0, _classCallCheck2.default)(this, Mo);
  this.type = e, this.createOptions = t;
});
var Io = /*#__PURE__*/function () {
  function Io() {
    var _this$payloadBuilders;
    (0, _classCallCheck2.default)(this, Io);
    this.framework = s.currentFramework(), this.platform = d.currentPlatform(), this.payloadBuilders = (_this$payloadBuilders = {}, (0, _defineProperty2.default)(_this$payloadBuilders, e.UNIAPP, {
      image: new so(),
      file: new to(),
      audio: new io(),
      video: new no(),
      text: new Qn()
    }), (0, _defineProperty2.default)(_this$payloadBuilders, l.MP_WX, {
      image: new Wn(),
      file: new zn(),
      audio: new Xn(),
      video: new eo(),
      text: new Qn()
    }), (0, _defineProperty2.default)(_this$payloadBuilders, l.BROWSER, {
      image: new ro(),
      file: new oo(),
      audio: new ao(),
      video: new co(),
      text: new Qn()
    }), (0, _defineProperty2.default)(_this$payloadBuilders, l.MP_ALI, {
      image: new ho(),
      file: new lo(),
      audio: new po(),
      video: new uo(),
      text: new Qn()
    }), (0, _defineProperty2.default)(_this$payloadBuilders, l.MP_BAIDU, {
      image: new yo(),
      file: new fo(),
      audio: new go(),
      video: new mo(),
      text: new Qn()
    }), (0, _defineProperty2.default)(_this$payloadBuilders, e.REACT_NATIVE, {
      image: new Eo(),
      file: new So(),
      audio: new bo(),
      video: new vo(),
      text: new Qn()
    }), (0, _defineProperty2.default)(_this$payloadBuilders, l.MP_BYTE, {
      image: new Wn(),
      file: new zn(),
      audio: new Xn(),
      video: new eo(),
      text: new Qn()
    }), _this$payloadBuilders);
  }
  (0, _createClass2.default)(Io, [{
    key: "buildMessage",
    value: function buildMessage(t, s) {
      var i = this.framework === e.UNKNOWN ? this.platform : this.framework;
      var n = this.payloadBuilders[i][t],
        o = new Mo(t, s);
      if (n) {
        var _e24 = n.build(o);
        o.payload = _e24;
      } else {
        var _e25 = new wo().build(o);
        o.payload = _e25.payload;
      }
      var r = this.build(o);
      return o.complete.then(function () {
        v.onSuccess(s, r);
      }).catch(function (e) {
        v.onFailed(s, e);
      }), r;
    }
  }, {
    key: "build",
    value: function build(e) {
      var t,
        s = e.type,
        i = e.payload,
        n = e.createOptions,
        a = n.to,
        c = a.type;
      return this.validate(n), c === o.GROUP ? (t = new ct(), t.groupId = a.id.toString(), t.senderData = te.Socket.user().data) : c === o.PRIVATE ? (t = new at(), t.read = !1, t.receiverId = a.id.toString()) : c === o.CS && (t = new ut(), t.to = a.id.toString(), t.teamId = a.id.toString(), t.senderData = te.Socket.user().data), t.senderId = te.Socket.user().id, t.messageId = ie.get(), t.payload = i, t.timestamp = Date.now(), t.type = s, t.recalled = !1, t.status = r.NEW, t.buildOptions = e, t;
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.to;
      if (!t) throw new Error("message require property to.");
      if (!u.isObject(t)) throw new Error("TypeError: to requires an object.");
      if (!u.isObject(t.data)) throw new Error("TypeError: to.data requires an object.");
      if (!t.type || t.type !== o.GROUP && t.type !== o.PRIVATE && t.type !== o.CS) throw new Error("message require property to.type");
      if (le.validateId(t.id, "to.id"), te.Socket.user().id === t.id) throw new Error("to.id can not be the same as your id.");
      u.isDef(e.notification) && le.validateNotification(e.notification), e.wxmpTemplateMsg && le.validateWXMPTemplateMsg(e.wxmpTemplateMsg);
    }
  }]);
  return Io;
}();
var No = /*#__PURE__*/function (_kn) {
  (0, _inherits2.default)(No, _kn);
  var _super73 = _createSuper(No);
  function No() {
    (0, _classCallCheck2.default)(this, No);
    return _super73.apply(this, arguments);
  }
  (0, _createClass2.default)(No, [{
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      var _this89 = this;
      if (e.t === o.CS) {
        var _t30 = this.builder.build(e);
        this.sendAck(_t30);
        var _s30 = st.byIMMessage(_t30);
        if (!vn.get(_s30).existsMessage(_t30)) {
          if (_t30.customerId() === te.Socket.user().id) this.createNotification(e), Qe.i.fire(Be.MESSAGE_RECEIVED, _t30), gt.fire(Ve.CS_MESSAGE_RECEIVED, _t30);else {
            fn.getInstance().queryTeams().then(function () {
              gn.isMyMessage(_t30) && _this89.createNotification(e), Qe.i.fire(Be.CS_AGENT_MESSAGE_RECEIVED, _t30);
            });
          }
        }
      }
    }
  }]);
  return No;
}(kn);
var To = /*#__PURE__*/(0, _createClass2.default)(function To(e) {
  var _this90 = this;
  (0, _classCallCheck2.default)(this, To);
  this.times = new Array();
  var t = e[0],
    s = st.byIMMessage(t);
  this.scene = s.scene, this.targetId = s.id, e.forEach(function (e) {
    _this90.times.push(e.timestamp);
  }), this.times.sort(function (e, t) {
    return e < t ? -1 : e == t ? 0 : 1;
  });
});
var Oo = /*#__PURE__*/function () {
  function Oo() {
    (0, _classCallCheck2.default)(this, Oo);
    this.onRemoteRecalled = function (e) {
      Qe.i.fire(Be.MESSAGE_RECALLED, e);
    }, mn.onMessage(me.IM_MSG_RECALLED, this.onRemoteRecalled);
  }
  (0, _createClass2.default)(Oo, [{
    key: "recallMessage",
    value: function recallMessage(e) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee57() {
        var t, s, i, n, o, r, a;
        return _regenerator.default.wrap(function _callee57$(_context57) {
          while (1) {
            switch (_context57.prev = _context57.next) {
              case 0:
                En.validateMessageArray(e.messages), this.validate(e);
                t = e.messages;
                _context57.next = 4;
                return this.recallServerMessages(t);
              case 4:
                s = t[0], i = s.scene(), n = this.toConversationId(i, s.senderId, s.targetId()), o = {
                  id: te.Socket.user().id,
                  data: te.Socket.user().data
                }, r = t.map(function (e) {
                  return e.timestamp;
                }), a = new ft(i, n, o, r);
                Qe.i.fire(Be.MESSAGE_RECALLED, a), v.onSuccess(e);
              case 6:
              case "end":
                return _context57.stop();
            }
          }
        }, _callee57, this);
      }));
    }
  }, {
    key: "toConversationId",
    value: function toConversationId(e, t, s) {
      if (o.PRIVATE === e) return function (e, t) {
        return e.localeCompare(t) > 0 ? "".concat(e, ":").concat(t) : "".concat(t, ":").concat(e);
      }(t, s);
      if (o.GROUP === e) return s;
      throw {
        code: 400,
        content: "scene: ".concat(e, " not support")
      };
    }
  }, {
    key: "recallServerMessages",
    value: function recallServerMessages(e) {
      var t = new To(e);
      return 0 === t.times.length ? Promise.resolve() : new Promise(function (e, s) {
        var i = new re({
          name: y.IM_RECALL_MESSAGE,
          params: t,
          permission: ne.WRITE,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          fail: function fail(e) {
            s(e);
          },
          success: function success(t) {
            200 === t.code ? e(t) : s(t);
          }
        });
        te.Socket.e(i);
      });
    }
  }, {
    key: "validate",
    value: function validate(e) {
      var t = e.messages;
      for (var _e26 = 0; _e26 < t.length; _e26++) {
        var _s31 = t[_e26];
        if (_s31.scene() === o.CS) throw {
          code: 400,
          content: "Recall CS message is not supported yet."
        };
        if (_s31.status !== r.SUCCESS) throw {
          code: 400,
          content: "message[" + _e26 + "] is '" + _s31.status + "' and cannot be recalled"
        };
        if (_s31.recalled) throw {
          code: 400,
          content: "message[" + _e26 + "] has been recalled"
        };
        if (_s31.senderId !== te.Socket.user().id) throw {
          code: 400,
          content: "it is not allowed to recall messages sent by others"
        };
      }
    }
  }]);
  return Oo;
}();
var Ao = /*#__PURE__*/function () {
  function Ao() {
    (0, _classCallCheck2.default)(this, Ao);
    this.map = new Map();
  }
  (0, _createClass2.default)(Ao, [{
    key: "getData",
    value: function getData(e) {
      return this.map.get(e);
    }
  }, {
    key: "setData",
    value: function setData(e, t) {
      this.map.set(e, t);
    }
  }]);
  return Ao;
}();
var Ro = /*#__PURE__*/function () {
  function Ro() {
    (0, _classCallCheck2.default)(this, Ro);
    this.dataCache = new Ao();
  }
  (0, _createClass2.default)(Ro, [{
    key: "getData",
    value: function getData() {
      for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
        e[_key] = arguments[_key];
      }
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee58() {
        var _this91 = this;
        var t, s;
        return _regenerator.default.wrap(function _callee58$(_context58) {
          while (1) {
            switch (_context58.prev = _context58.next) {
              case 0:
                t = [], s = new Map();
                e.forEach(function (e) {
                  var i = _this91.dataCache.getData(e);
                  i ? s.set(e, i) : t.push(e);
                });
                _context58.t0 = 0 === t.length;
                if (_context58.t0) {
                  _context58.next = 7;
                  break;
                }
                _context58.next = 6;
                return this.fetchData.apply(this, t);
              case 6:
                _context58.sent.forEach(function (e, t) {
                  _this91.dataCache.setData(t, e), s.set(t, e);
                });
              case 7:
                return _context58.abrupt("return", Promise.resolve(s));
              case 8:
              case "end":
                return _context58.stop();
            }
          }
        }, _callee58, this);
      }));
    }
  }, {
    key: "fetchData",
    value: function fetchData() {
      for (var _len2 = arguments.length, e = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        e[_key2] = arguments[_key2];
      }
      return new Promise(function (t, s) {
        var i = new re({
          name: y.MD_CMD,
          permission: ne.READ,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          params: {
            name: "GET",
            data: {
              ids: e
            }
          },
          success: function success(e) {
            if (200 === e.code) {
              var _s32 = new Map();
              e.content.forEach(function (e) {
                _s32.set(e.id, e.data);
              }), t(_s32);
            } else s(e);
          },
          fail: function fail(e) {
            s(e);
          }
        });
        te.Socket.e(i);
      });
    }
  }, {
    key: "setData",
    value: function setData(e, t) {
      this.dataCache.setData(e, t);
    }
  }], [{
    key: "init",
    value: function init() {
      this.i = new Ro();
    }
  }]);
  return Ro;
}();
var ko = /*#__PURE__*/function () {
  function ko() {
    (0, _classCallCheck2.default)(this, ko);
    Qe.i.on(Be.MESSAGE_RECEIVED, this.onMessageReceived), Qe.i.on(Be.MESSAGE_SENDING, this.onMessageSending);
  }
  (0, _createClass2.default)(ko, [{
    key: "onMessageSending",
    value: function onMessageSending(e) {
      var t = st.byIMMessage(e);
      t.scene === o.PRIVATE && Ro.i.setData(t.id, e.getToData());
    }
  }, {
    key: "onMessageReceived",
    value: function onMessageReceived(e) {
      if (st.byIMMessage(e).scene === o.GROUP) {
        var _t31 = e;
        Ro.i.setData(_t31.senderId, _t31.senderData);
      }
    }
  }]);
  return ko;
}();
var Po = /*#__PURE__*/function () {
  function Po() {
    (0, _classCallCheck2.default)(this, Po);
    this._iMReceiver = new kn(), this.csMessageReceiver = new No(), this.memberDataUpdator = new ko(), this._userHereNow = new Ln(), this.goEasyUploader = new Le(), this._groupHereNow = new Fn(), this._groupOnlineCount = new xn(), this.groupMessageSubscriber = new Pn(), this.messageBuilder = new Io(), this.messageSender = new Ke(), this.recaller = new Oo(), this._groupPresenceSubscriber = new Dn(), this._userPresenceSubscriber = new Gn(), this.conversations = new Rn(), this.histories = vn.init();
  }
  (0, _createClass2.default)(Po, [{
    key: "validateModules",
    value: function validateModules() {
      if (mn.status() === t.DISCONNECTED) throw Error("Please call connect() first.");
      On.check();
    }
  }, {
    key: "catch",
    value: function _catch(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee59() {
        return _regenerator.default.wrap(function _callee59$(_context59) {
          while (1) {
            switch (_context59.prev = _context59.next) {
              case 0:
                _context59.prev = 0;
                this.validateModules();
                le.validateCallbackOptions(t);
                _context59.next = 5;
                return e();
              case 5:
                _context59.next = 10;
                break;
              case 7:
                _context59.prev = 7;
                _context59.t0 = _context59["catch"](0);
                v.onFailed(t, _context59.t0);
              case 10:
              case "end":
                return _context59.stop();
            }
          }
        }, _callee59, this, [[0, 7]]);
      }));
    }
  }, {
    key: "on",
    value: function on(e, t) {
      gt.on(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      gt.off(e, t);
    }
  }, {
    key: "createTextMessage",
    value: function createTextMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(qe.TEXT, e);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(qe.IMAGE, e);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(qe.FILE, e);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(qe.AUDIO, e);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(qe.VIDEO, e);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e) {
      return this.validateModules(), this.messageBuilder.buildMessage(e.type, e);
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(e) {
      var _this92 = this;
      this.catch(function () {
        _this92.messageSender.send(e);
      }, e);
    }
  }, {
    key: "recallMessage",
    value: function recallMessage(e) {
      var _this93 = this;
      this.catch(function () {
        _this93.recaller.recallMessage(e);
      }, e);
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(e) {
      var _this94 = this;
      this.catch(function () {
        _this94.histories.deleteMessage(e);
      }, e);
    }
  }, {
    key: "markGroupMessageAsRead",
    value: function markGroupMessageAsRead(e) {
      var _this95 = this;
      this.catch(function () {
        return b(_this95, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee60() {
          return _regenerator.default.wrap(function _callee60$(_context60) {
            while (1) {
              switch (_context60.prev = _context60.next) {
                case 0:
                  _context60.next = 2;
                  return this.histories.groupMarkAsRead(e);
                case 2:
                case "end":
                  return _context60.stop();
              }
            }
          }, _callee60, this);
        }));
      }, e);
    }
  }, {
    key: "markPrivateMessageAsRead",
    value: function markPrivateMessageAsRead(e) {
      var _this96 = this;
      this.catch(function () {
        return b(_this96, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee61() {
          return _regenerator.default.wrap(function _callee61$(_context61) {
            while (1) {
              switch (_context61.prev = _context61.next) {
                case 0:
                  _context61.next = 2;
                  return this.histories.privateMarkAsRead(e);
                case 2:
                case "end":
                  return _context61.stop();
              }
            }
          }, _callee61, this);
        }));
      }, e);
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e, t) {
      var _this97 = this;
      this.catch(function () {
        return b(_this97, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee62() {
          return _regenerator.default.wrap(function _callee62$(_context62) {
            while (1) {
              switch (_context62.prev = _context62.next) {
                case 0:
                  _context62.next = 2;
                  return this.histories.markMessageAsRead(e, t);
                case 2:
                case "end":
                  return _context62.stop();
              }
            }
          }, _callee62, this);
        }));
      }, e);
    }
  }, {
    key: "latestConversations",
    value: function latestConversations(e) {
      this.validateModules(), this.conversations.latestConversations(e);
    }
  }, {
    key: "removePrivateConversation",
    value: function removePrivateConversation(e) {
      var _this98 = this;
      this.catch(function () {
        return _this98.conversations.removePrivateConversation(e);
      }, e);
    }
  }, {
    key: "removeGroupConversation",
    value: function removeGroupConversation(e) {
      var _this99 = this;
      this.catch(function () {
        return _this99.conversations.removeGroupConversation(e);
      }, e);
    }
  }, {
    key: "topPrivateConversation",
    value: function topPrivateConversation(e) {
      var _this100 = this;
      this.catch(function () {
        return _this100.conversations.topPrivateConversation(e);
      }, e);
    }
  }, {
    key: "topGroupConversation",
    value: function topGroupConversation(e) {
      var _this101 = this;
      this.catch(function () {
        return _this101.conversations.topGroupConversation(e);
      }, e);
    }
  }, {
    key: "history",
    value: function history(e, t) {
      var _this102 = this;
      this.catch(function () {
        _this102.histories.loadHistory(e, t);
      }, e);
    }
  }, {
    key: "subscribeUserPresence",
    value: function subscribeUserPresence(e) {
      var _this103 = this;
      this.catch(function () {
        return _this103._userPresenceSubscriber.presence(e);
      }, e);
    }
  }, {
    key: "unsubscribeUserPresence",
    value: function unsubscribeUserPresence(e) {
      var _this104 = this;
      this.catch(function () {
        return _this104._userPresenceSubscriber.unPresence(e);
      }, e);
    }
  }, {
    key: "hereNow",
    value: function hereNow(e) {
      var _this105 = this;
      this.catch(function () {
        return _this105._userHereNow.hereNow(e);
      }, e);
    }
  }, {
    key: "subscribeGroup",
    value: function subscribeGroup(e) {
      var _this106 = this;
      this.catch(function () {
        return _this106.groupMessageSubscriber.subscribe(e);
      }, e);
    }
  }, {
    key: "unsubscribeGroup",
    value: function unsubscribeGroup(e) {
      var _this107 = this;
      this.catch(function () {
        return _this107.groupMessageSubscriber.unsubscribe(e);
      }, e);
    }
  }, {
    key: "subscribeGroupPresence",
    value: function subscribeGroupPresence(e) {
      var _this108 = this;
      this.catch(function () {
        return _this108._groupPresenceSubscriber.presence(e);
      }, e);
    }
  }, {
    key: "unsubscribeGroupPresence",
    value: function unsubscribeGroupPresence(e) {
      var _this109 = this;
      this.catch(function () {
        return _this109._groupPresenceSubscriber.unPresence(e);
      }, e);
    }
  }, {
    key: "groupHereNow",
    value: function groupHereNow(e) {
      var _this110 = this;
      this.catch(function () {
        return _this110._groupHereNow.hereNow(e);
      }, e);
    }
  }, {
    key: "groupOnlineCount",
    value: function groupOnlineCount(e) {
      var _this111 = this;
      this.catch(function () {
        return _this111._groupOnlineCount.get(e);
      }, e);
    }
  }, {
    key: "latestPendingConversations",
    value: function latestPendingConversations(e) {
      this.validateModules(), this.conversations.latestPendingConversations(e);
    }
  }, {
    key: "topConversation",
    value: function topConversation(e) {
      this.validateModules(), this.conversations.topConversation(e);
    }
  }, {
    key: "removeConversation",
    value: function removeConversation(e) {
      this.validateModules(), this.conversations.removeConversation(e);
    }
  }], [{
    key: "init",
    value: function init() {
      Qe.init(), gt.init(), Po.instance = new Po();
    }
  }, {
    key: "i",
    value: function i() {
      if (Po.instance) return Po.instance;
      throw Error("Please connect first.");
    }
  }]);
  return Po;
}();
var _o = /*#__PURE__*/(0, _createClass2.default)(function _o(e, t) {
  (0, _classCallCheck2.default)(this, _o);
  this.customerId = e, this.teamId = t;
});
var Do = /*#__PURE__*/(0, _createClass2.default)(function Do(e, t) {
  (0, _classCallCheck2.default)(this, Do);
  this.teamId = e;
  var s = new c(t.id.toString(), JSON.stringify(t.data));
  this.customer = s;
});
var xo = /*#__PURE__*/(0, _createClass2.default)(function xo(e, t, s) {
  (0, _classCallCheck2.default)(this, xo);
  this.customerId = e, this.teamId = t, this.agentId = s;
});
var Uo = /*#__PURE__*/(0, _createClass2.default)(function Uo(e, t) {
  (0, _classCallCheck2.default)(this, Uo);
  this.customerId = e, this.teamId = t;
});
var Fo = /*#__PURE__*/function () {
  function Fo(e) {
    (0, _classCallCheck2.default)(this, Fo);
    this.builder = new lt(), this.teamId = e;
  }
  (0, _createClass2.default)(Fo, [{
    key: "accept",
    value: function accept(e, t) {
      var _this112 = this;
      var s = t.customer;
      if (u.isUndef(s)) throw {
        code: 400,
        content: "customer is required."
      };
      le.validateId(s.id, "customer.id");
      var i = s.data;
      if (u.isUndef(i) || !u.isObject(i)) throw {
        code: 400,
        content: "customer data must be non-empty object."
      };
      var n = new Do(e, s),
        o = new re({
          name: y.CS_ACCEPT,
          params: n,
          permission: ne.WRITE,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          fail: function fail(e) {
            v.onFailed(t, e);
          },
          success: function success(e) {
            var s = _this112.builder.build(e.content.message);
            Qe.i.fire(Be.CS_ACCEPTED, s), v.onSuccess(t);
          }
        });
      te.Socket.e(o);
    }
  }, {
    key: "end",
    value: function end(e, t) {
      var _this113 = this;
      le.validateId(t.id, "id");
      var s = t.id.toString(),
        i = new Uo(s, e),
        n = new re({
          name: y.CS_END,
          params: i,
          permission: ne.WRITE,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          fail: function fail(e) {
            v.onFailed(t, e);
          },
          success: function success(e) {
            var s = _this113.builder.build(e.content.message);
            Qe.i.fire(Be.CS_ENDED, s), v.onSuccess(t);
          }
        });
      te.Socket.e(n);
    }
  }, {
    key: "queryCustomerStatus",
    value: function queryCustomerStatus(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee63() {
        var s;
        return _regenerator.default.wrap(function _callee63$(_context63) {
          while (1) {
            switch (_context63.prev = _context63.next) {
              case 0:
                le.validateId(t.id, "id");
                _context63.next = 3;
                return this.doCustomerStatus(e, t.id);
              case 3:
                s = _context63.sent;
                this.activeCustomerStatus = s, this.activeCustomerStatusOptions = t, v.onSuccess(t, s);
              case 5:
              case "end":
                return _context63.stop();
            }
          }
        }, _callee63, this);
      }));
    }
  }, {
    key: "doCustomerStatus",
    value: function doCustomerStatus(e, t) {
      var s = t.toString(),
        i = new _o(s, e);
      return new Promise(function (e, t) {
        var s = new re({
          name: y.CS_CUSTOMER_STATUS,
          params: i,
          permission: ne.READ,
          singleTimeout: S.commonQuerySingle,
          totalTimeout: S.commonQueryTotal,
          fail: function fail(e) {
            t(e);
          },
          success: function success(t) {
            var s = t.content;
            s.agent && (s.agent.data = JSON.parse(s.agent.data)), e(s);
          }
        });
        te.Socket.e(s);
      });
    }
  }, {
    key: "transfer",
    value: function transfer(e, t) {
      var _this114 = this;
      le.validateId(t.customerId, "customerId"), le.validateId(t.agentId, "agentId");
      var s = t.customerId.toString(),
        i = t.agentId.toString(),
        n = new xo(s, e, i),
        o = new re({
          name: y.CS_TRANSFER,
          params: n,
          permission: ne.WRITE,
          singleTimeout: S.commonRequestSingle,
          totalTimeout: S.commonRequestTotal,
          fail: function fail(e) {
            v.onFailed(t, e);
          },
          success: function success(e) {
            var s = _this114.builder.build(e.content.message);
            Qe.i.fire(Be.CS_TRANSFER, s), v.onSuccess(t);
          }
        });
      te.Socket.e(o);
    }
  }]);
  return Fo;
}();
var Go = /*#__PURE__*/function () {
  function Go() {
    (0, _classCallCheck2.default)(this, Go);
  }
  (0, _createClass2.default)(Go, [{
    key: "createTextMessage",
    value: function createTextMessage(e, t) {
      var s = Po.i().createTextMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e, t) {
      var s = Po.i().createImageMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e, t) {
      var s = Po.i().createFileMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e, t) {
      var s = Po.i().createAudioMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e, t) {
      var s = Po.i().createVideoMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e, t) {
      var s = Po.i().createCustomMessage(t);
      this.extendProps(e, s);
    }
  }, {
    key: "extendProps",
    value: function extendProps(e, t) {
      if (t.scene() === o.CS) {
        var _s33 = t;
        _s33.teamId = e, _s33.accepted = !0;
      }
    }
  }]);
  return Go;
}();
var Lo = /*#__PURE__*/function () {
  function Lo(e) {
    (0, _classCallCheck2.default)(this, Lo);
    this.teamId = e, this.agentStatus = fn.getInstance(), this.conversationHandler = new Fo(e), this.messageCreator = new Go();
  }
  (0, _createClass2.default)(Lo, [{
    key: "catch",
    value: function _catch(e, t) {
      return b(this, void 0, void 0, /*#__PURE__*/_regenerator.default.mark(function _callee64() {
        return _regenerator.default.wrap(function _callee64$(_context64) {
          while (1) {
            switch (_context64.prev = _context64.next) {
              case 0:
                _context64.prev = 0;
                le.validateCallbackOptions(t);
                _context64.next = 4;
                return e();
              case 4:
                _context64.next = 9;
                break;
              case 6:
                _context64.prev = 6;
                _context64.t0 = _context64["catch"](0);
                v.onFailed(t, _context64.t0);
              case 9:
              case "end":
                return _context64.stop();
            }
          }
        }, _callee64, null, [[0, 6]]);
      }));
    }
  }, {
    key: "isOnline",
    value: function isOnline(e) {
      var _this115 = this;
      this.catch(function () {
        _this115.agentStatus.isOnline(_this115.teamId, e);
      }, e);
    }
  }, {
    key: "online",
    value: function online(e) {
      var _this116 = this;
      this.catch(function () {
        _this116.agentStatus.online(_this116.teamId, e);
      }, e);
    }
  }, {
    key: "offline",
    value: function offline(e) {
      var _this117 = this;
      this.catch(function () {
        _this117.agentStatus.offline(_this117.teamId, e);
      }, e);
    }
  }, {
    key: "customerStatus",
    value: function customerStatus(e) {
      var _this118 = this;
      this.catch(function () {
        _this118.conversationHandler.queryCustomerStatus(_this118.teamId, e);
      }, e);
    }
  }, {
    key: "accept",
    value: function accept(e) {
      var _this119 = this;
      this.catch(function () {
        _this119.conversationHandler.accept(_this119.teamId, e);
      }, e);
    }
  }, {
    key: "end",
    value: function end(e) {
      var _this120 = this;
      this.catch(function () {
        _this120.conversationHandler.end(_this120.teamId, e);
      }, e);
    }
  }, {
    key: "history",
    value: function history(e) {
      Po.i().history(e, this.teamId);
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e) {
      Po.i().markMessageAsRead(e, this.teamId);
    }
  }, {
    key: "createTextMessage",
    value: function createTextMessage(e) {
      this.messageCreator.createTextMessage(this.teamId, e);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e) {
      this.messageCreator.createImageMessage(this.teamId, e);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e) {
      this.messageCreator.createFileMessage(this.teamId, e);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e) {
      this.messageCreator.createAudioMessage(this.teamId, e);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e) {
      this.messageCreator.createVideoMessage(this.teamId, e);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e) {
      this.messageCreator.createCustomMessage(this.teamId, e);
    }
  }, {
    key: "transfer",
    value: function transfer(e) {
      var _this121 = this;
      this.catch(function () {
        _this121.conversationHandler.transfer(_this121.teamId, e);
      }, e);
    }
  }, {
    key: "agents",
    value: function agents(e) {
      var _this122 = this;
      this.catch(function () {
        _this122.agentStatus.agents(_this122.teamId, e);
      }, e);
    }
  }, {
    key: "liveSession",
    value: function liveSession(e) {
      var _this123 = this;
      this.catch(function () {
        gn.live(_this123.teamId, e);
      }, e);
    }
  }, {
    key: "quitLiveSession",
    value: function quitLiveSession(e) {
      this.catch(function () {
        gn.quit(e);
      }, e);
    }
  }, {
    key: "listenCustomer",
    value: function listenCustomer(e) {
      var _this124 = this;
      var t = {
        customerId: e.id,
        onNewMessage: e.onNewMessage,
        onStatusUpdated: e.onStatusUpdated,
        onFailed: e.onFailed,
        onSuccess: e.onSuccess
      };
      this.catch(function () {
        gn.live(_this124.teamId, t);
      }, e);
    }
  }, {
    key: "cancelListenCustomer",
    value: function cancelListenCustomer(e) {
      this.catch(function () {
        gn.quit(e);
      }, e);
    }
  }]);
  return Lo;
}();
var Bo = /*#__PURE__*/function () {
  function Bo() {
    (0, _classCallCheck2.default)(this, Bo);
  }
  (0, _createClass2.default)(Bo, null, [{
    key: "team",
    value: function team(e) {
      le.validateId(e, "teamId");
      var t = this.teams.get(e);
      return t || (t = new Lo(e.toString()), this.teams.set(e.toString(), t)), t;
    }
  }]);
  return Bo;
}();
Bo.teams = new Map();
var qo = /*#__PURE__*/function () {
  function qo(e) {
    (0, _classCallCheck2.default)(this, qo);
    this.id = e;
  }
  (0, _createClass2.default)(qo, [{
    key: "isOnline",
    value: function isOnline(e) {
      Bo.team(this.id).isOnline(e);
    }
  }, {
    key: "online",
    value: function online(e) {
      Bo.team(this.id).online(e);
    }
  }, {
    key: "offline",
    value: function offline(e) {
      Bo.team(this.id).offline(e);
    }
  }, {
    key: "customerStatus",
    value: function customerStatus(e) {
      Bo.team(this.id).customerStatus(e);
    }
  }, {
    key: "accept",
    value: function accept(e) {
      Bo.team(this.id).accept(e);
    }
  }, {
    key: "end",
    value: function end(e) {
      Bo.team(this.id).end(e);
    }
  }, {
    key: "history",
    value: function history(e) {
      Bo.team(this.id).history(e);
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e) {
      Bo.team(this.id).markMessageAsRead(e);
    }
  }, {
    key: "createTextMessage",
    value: function createTextMessage(e) {
      Bo.team(this.id).createTextMessage(e);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e) {
      Bo.team(this.id).createImageMessage(e);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e) {
      Bo.team(this.id).createFileMessage(e);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e) {
      Bo.team(this.id).createAudioMessage(e);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e) {
      Bo.team(this.id).createVideoMessage(e);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e) {
      Bo.team(this.id).createCustomMessage(e);
    }
  }, {
    key: "transfer",
    value: function transfer(e) {
      Bo.team(this.id).transfer(e);
    }
  }, {
    key: "agents",
    value: function agents(e) {
      Bo.team(this.id).agents(e);
    }
  }, {
    key: "liveSession",
    value: function liveSession(e) {
      Bo.team(this.id).liveSession(e);
    }
  }, {
    key: "quitLiveSession",
    value: function quitLiveSession(e) {
      Bo.team(this.id).quitLiveSession(e);
    }
  }, {
    key: "listenCustomer",
    value: function listenCustomer(e) {
      Bo.team(this.id).listenCustomer(e);
    }
  }, {
    key: "cancelListenCustomer",
    value: function cancelListenCustomer(e) {
      Bo.team(this.id).cancelListenCustomer(e);
    }
  }]);
  return qo;
}();
var jo = /*#__PURE__*/function () {
  function jo() {
    (0, _classCallCheck2.default)(this, jo);
  }
  (0, _createClass2.default)(jo, null, [{
    key: "getInstance",
    value: function getInstance(e) {
      return this.init(e), jo;
    }
  }, {
    key: "init",
    value: function init(e) {
      if (this.getConnectionStatus() !== t.DISCONNECTED) throw new Error("Initialization failed. Please disconnect and try again.");
      this.validateOptions(e), i.init(e.reactNativeOptions), this.options = e, mn.init(e), e.allowNotification && ce.init(e.allowNotification), e.modules && (e.modules.includes("PUBSUB") && X.initModule(we.init()), e.modules.includes("IM") && X.initModule(On.init())), Ro.init(), te.init(mn, ce, Ro, n, h, X);
    }
  }, {
    key: "setBadge",
    value: function setBadge(e) {
      ce.setBadge(e);
    }
  }, {
    key: "connect",
    value: function connect(e) {
      mn.connect(e, "JS");
    }
  }, {
    key: "disconnect",
    value: function disconnect(e) {
      mn.disconnect(e);
    }
  }, {
    key: "getConnectionStatus",
    value: function getConnectionStatus() {
      return mn.status();
    }
  }, {
    key: "validateOptions",
    value: function validateOptions(e) {
      var t = "";
      if (!u.isObject(e)) throw t = "options is require an object.", Error(t);
      if (!u.isPrimitive(e.appkey) || 0 == e.appkey.length) throw t = "Invalid options:'appkey' is empty.", Error(t);
      if (!u.isPrimitive(e.host) || 0 == e.host.length) throw t = "Invalid options:'host' is empty.", Error(t);
      if (!u.isArray(e.modules)) throw t = "Invalid options: 'modules' must be nonempty array", Error(t);
      e.modules = e.modules.map(function (e) {
        return e.toUpperCase();
      });
    }
  }, {
    key: "onClickNotification",
    value: function onClickNotification(e) {
      ce.onClickNotification(e);
    }
  }, {
    key: "c",
    value: function c(e) {
      e.init(te.Socket, te.N, te.Member, te.v, te.Platform, X);
    }
  }]);
  return jo;
}();
exports.default = jo;
jo.version = n, jo.IM_EVENT = Ve, jo.IM_SCENE = o, jo.im = /*#__PURE__*/function () {
  function _class19() {
    (0, _classCallCheck2.default)(this, _class19);
  }
  (0, _createClass2.default)(_class19, null, [{
    key: "on",
    value: function on(e, t) {
      Po.i().on(e, t);
    }
  }, {
    key: "off",
    value: function off(e, t) {
      Po.i().off(e, t);
    }
  }, {
    key: "createTextMessage",
    value: function createTextMessage(e) {
      return Po.i().createTextMessage(e);
    }
  }, {
    key: "createImageMessage",
    value: function createImageMessage(e) {
      return Po.i().createImageMessage(e);
    }
  }, {
    key: "createFileMessage",
    value: function createFileMessage(e) {
      return Po.i().createFileMessage(e);
    }
  }, {
    key: "createAudioMessage",
    value: function createAudioMessage(e) {
      return Po.i().createAudioMessage(e);
    }
  }, {
    key: "createVideoMessage",
    value: function createVideoMessage(e) {
      return Po.i().createVideoMessage(e);
    }
  }, {
    key: "createCustomMessage",
    value: function createCustomMessage(e) {
      return Po.i().createCustomMessage(e);
    }
  }, {
    key: "sendMessage",
    value: function sendMessage(e) {
      Po.i().sendMessage(e);
    }
  }, {
    key: "recallMessage",
    value: function recallMessage(e) {
      Po.i().recallMessage(e);
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(e) {
      Po.i().deleteMessage(e);
    }
  }, {
    key: "markGroupMessageAsRead",
    value: function markGroupMessageAsRead(e) {
      Po.i().markGroupMessageAsRead(e);
    }
  }, {
    key: "markPrivateMessageAsRead",
    value: function markPrivateMessageAsRead(e) {
      Po.i().markPrivateMessageAsRead(e);
    }
  }, {
    key: "latestConversations",
    value: function latestConversations(e) {
      Po.i().latestConversations(e);
    }
  }, {
    key: "removePrivateConversation",
    value: function removePrivateConversation(e) {
      Po.i().removePrivateConversation(e);
    }
  }, {
    key: "removeGroupConversation",
    value: function removeGroupConversation(e) {
      Po.i().removeGroupConversation(e);
    }
  }, {
    key: "topPrivateConversation",
    value: function topPrivateConversation(e) {
      Po.i().topPrivateConversation(e);
    }
  }, {
    key: "topGroupConversation",
    value: function topGroupConversation(e) {
      Po.i().topGroupConversation(e);
    }
  }, {
    key: "history",
    value: function history(e) {
      Po.i().history(e);
    }
  }, {
    key: "subscribeUserPresence",
    value: function subscribeUserPresence(e) {
      Po.i().subscribeUserPresence(e);
    }
  }, {
    key: "unsubscribeUserPresence",
    value: function unsubscribeUserPresence(e) {
      Po.i().unsubscribeUserPresence(e);
    }
  }, {
    key: "hereNow",
    value: function hereNow(e) {
      Po.i().hereNow(e);
    }
  }, {
    key: "subscribeGroup",
    value: function subscribeGroup(e) {
      Po.i().subscribeGroup(e);
    }
  }, {
    key: "unsubscribeGroup",
    value: function unsubscribeGroup(e) {
      Po.i().unsubscribeGroup(e);
    }
  }, {
    key: "subscribeGroupPresence",
    value: function subscribeGroupPresence(e) {
      Po.i().subscribeGroupPresence(e);
    }
  }, {
    key: "unsubscribeGroupPresence",
    value: function unsubscribeGroupPresence(e) {
      Po.i().unsubscribeGroupPresence(e);
    }
  }, {
    key: "groupHereNow",
    value: function groupHereNow(e) {
      Po.i().groupHereNow(e);
    }
  }, {
    key: "groupOnlineCount",
    value: function groupOnlineCount(e) {
      Po.i().groupOnlineCount(e);
    }
  }, {
    key: "markMessageAsRead",
    value: function markMessageAsRead(e) {
      Po.i().markMessageAsRead(e);
    }
  }, {
    key: "csteam",
    value: function csteam(e) {
      return new qo(e);
    }
  }, {
    key: "pendingConversations",
    value: function pendingConversations(e) {
      Po.i().latestPendingConversations(e);
    }
  }, {
    key: "topConversation",
    value: function topConversation(e) {
      Po.i().topConversation(e);
    }
  }, {
    key: "removeConversation",
    value: function removeConversation(e) {
      Po.i().removeConversation(e);
    }
  }]);
  return _class19;
}(), jo.pubsub = /*#__PURE__*/function () {
  function _class20() {
    (0, _classCallCheck2.default)(this, _class20);
  }
  (0, _createClass2.default)(_class20, null, [{
    key: "publish",
    value: function publish(e) {
      this.catch(function () {
        Ce.instance.publish(e);
      }, e);
    }
  }, {
    key: "subscribe",
    value: function subscribe(e) {
      this.catch(function () {
        Ce.instance.subscribe(e);
      }, e);
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(e) {
      this.catch(function () {
        Ce.instance.unsubscribe(e);
      }, e);
    }
  }, {
    key: "subscribePresence",
    value: function subscribePresence(e) {
      this.catch(function () {
        Ce.instance.subscribePresence(e);
      }, e);
    }
  }, {
    key: "unsubscribePresence",
    value: function unsubscribePresence(e) {
      this.catch(function () {
        Ce.instance.unsubscribePresence(e);
      }, e);
    }
  }, {
    key: "history",
    value: function history(e) {
      this.catch(function () {
        Ce.instance.history(e);
      }, e);
    }
  }, {
    key: "hereNow",
    value: function hereNow(e) {
      this.catch(function () {
        Ce.instance.hereNow(e);
      }, e);
    }
  }, {
    key: "catch",
    value: function _catch(e, s) {
      try {
        if (we.check(), [t.DISCONNECTED, t.DISCONNECTING, t.CONNECT_FAILED].includes(te.Socket.status())) throw new Error("Please call connect() first.");
        e();
      } catch (e) {
        v.onFailed(s, e);
      }
    }
  }]);
  return _class20;
}();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./../../../../../../test0/HBuilderX/plugins/uniapp-cli/node_modules/node-libs-browser/mock/process.js */ 34), __webpack_require__(/*! ./../../../../../../test0/HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/global.js */ 3), __webpack_require__(/*! ./../../../../../../test0/HBuilderX/plugins/uniapp-cli/node_modules/buffer/index.js */ 36).Buffer))

/***/ }),
/* 34 */
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    setTimeout(function () {
        fn.apply(null, args);
    }, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ 35);
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),
/* 35 */
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ 34)))

/***/ }),
/* 36 */
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ 37)
var ieee754 = __webpack_require__(/*! ieee754 */ 38)
var isArray = __webpack_require__(/*! isarray */ 39)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ 3)))

/***/ }),
/* 37 */
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 38 */
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 39 */
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 40 */
/*!************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/@babel/runtime/regenerator/index.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! @babel/runtime/helpers/regeneratorRuntime */ 41)();
module.exports = runtime;

/***/ }),
/* 41 */
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) {
              if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            }
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) {
      r.push(n);
    }
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) {
        "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
      }
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 42 */
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/assertThisInitialized.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 43 */
/*!****************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/get.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var superPropBase = __webpack_require__(/*! ./superPropBase.js */ 44);
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
  return _get.apply(this, arguments);
}
module.exports = _get, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 44 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/superPropBase.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var getPrototypeOf = __webpack_require__(/*! ./getPrototypeOf.js */ 45);
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
module.exports = _superPropBase, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 45 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/getPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 46 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 47 */
/*!*********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/inherits.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ 16);
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 48 */
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
var assertThisInitialized = __webpack_require__(/*! ./assertThisInitialized.js */ 42);
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 49 */
/*!******************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/style/animat.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ }),
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */
/*!**********************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/utils/requestUtil.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, wx) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestUtil = exports.getBaseUrl = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// 同时发送异步代码的次数
var ajaxTimes = 0;

// 定义公共的url
var baseUrl = "http://localhost:80";
/**
 * 返回baseUrl
 */
var getBaseUrl = function getBaseUrl() {
  return baseUrl;
};

/**
 * 后端请求工具类
 * @param {*} params 请求参数
 */
exports.getBaseUrl = getBaseUrl;
var requestUtil = function requestUtil(params) {
  var header = _objectSpread({}, params.header);

  // 拼接header 带上token
  header["token"] = uni.getStorageSync("token");
  ajaxTimes++;

  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });
  console.log('发起请求:', {
    url: baseUrl + params.url,
    method: params.method,
    data: params.data
  });
  return new Promise(function (resolve, reject) {
    wx.request(_objectSpread(_objectSpread({}, params), {}, {
      header: header,
      url: baseUrl + params.url,
      success: function success(result) {
        console.log('请求成功:', result);
        if (result.statusCode === 200) {
          resolve(result.data);
        } else {
          uni.showToast({
            icon: 'error',
            title: '服务器响应错误',
            duration: 2000
          });
          reject(new Error('服务器响应错误: ' + result.statusCode));
        }
      },
      fail: function fail(err) {
        console.error('请求失败:', err);
        uni.showToast({
          icon: 'error',
          title: err.errMsg || '请求失败',
          duration: 2000
        });
        reject(err);
      },
      complete: function complete() {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //  关闭正在等待的图标
          wx.hideLoading();
        }
      }
    }));
  });
};
exports.requestUtil = requestUtil;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"]))

/***/ }),
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */
/*!****************************************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/node_modules/e-commerce_price/index.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var Price = function Price(price) {
  var num = parseFloat(price.toFixed(10));
  var s = num.toString();
  var rs = s.indexOf('.');

  // 没有小数点时：
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
};
module.exports = Price;

/***/ }),
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */
/*!******************************************************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/node_modules/@dcloudio/uni-ui/lib/uni-popup/popup.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  data: function data() {
    return {};
  },
  created: function created() {
    this.popup = this.getParent();
  },
  methods: {
    /**
     * 获取父元素实例
     */
    getParent: function getParent() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'uniPopup';
      var parent = this.$parent;
      var parentName = parent.$options.name;
      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent) return false;
        parentName = parent.$options.name;
      }
      return parent;
    }
  }
};
exports.default = _default;

/***/ }),
/* 97 */
/*!***********************************************************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/node_modules/@dcloudio/uni-ui/lib/uni-popup/i18n/index.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _en = _interopRequireDefault(__webpack_require__(/*! ./en.json */ 98));
var _zhHans = _interopRequireDefault(__webpack_require__(/*! ./zh-Hans.json */ 99));
var _zhHant = _interopRequireDefault(__webpack_require__(/*! ./zh-Hant.json */ 100));
var _default = {
  en: _en.default,
  'zh-Hans': _zhHans.default,
  'zh-Hant': _zhHant.default
};
exports.default = _default;

/***/ }),
/* 98 */
/*!**********************************************************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/node_modules/@dcloudio/uni-ui/lib/uni-popup/i18n/en.json ***!
  \**********************************************************************************************/
/*! exports provided: uni-popup.cancel, uni-popup.ok, uni-popup.placeholder, uni-popup.title, uni-popup.shareTitle, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"uni-popup.cancel\":\"cancel\",\"uni-popup.ok\":\"ok\",\"uni-popup.placeholder\":\"pleace enter\",\"uni-popup.title\":\"Hint\",\"uni-popup.shareTitle\":\"Share to\"}");

/***/ }),
/* 99 */
/*!***************************************************************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/node_modules/@dcloudio/uni-ui/lib/uni-popup/i18n/zh-Hans.json ***!
  \***************************************************************************************************/
/*! exports provided: uni-popup.cancel, uni-popup.ok, uni-popup.placeholder, uni-popup.title, uni-popup.shareTitle, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"uni-popup.cancel\":\"取消\",\"uni-popup.ok\":\"确定\",\"uni-popup.placeholder\":\"请输入\",\"uni-popup.title\":\"提示\",\"uni-popup.shareTitle\":\"分享到\"}");

/***/ }),
/* 100 */
/*!***************************************************************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/node_modules/@dcloudio/uni-ui/lib/uni-popup/i18n/zh-Hant.json ***!
  \***************************************************************************************************/
/*! exports provided: uni-popup.cancel, uni-popup.ok, uni-popup.placeholder, uni-popup.title, uni-popup.shareTitle, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"uni-popup.cancel\":\"取消\",\"uni-popup.ok\":\"確定\",\"uni-popup.placeholder\":\"請輸入\",\"uni-popup.title\":\"提示\",\"uni-popup.shareTitle\":\"分享到\"}");

/***/ }),
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */
/*!*********************************************************************************************************!*\
  !*** D:/test/smdc/Uni/diancan-user/node_modules/@dcloudio/uni-ui/lib/uni-transition/createAnimation.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnimation = createAnimation;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// const defaultOption = {
// 	duration: 300,
// 	timingFunction: 'linear',
// 	delay: 0,
// 	transformOrigin: '50% 50% 0'
// }
var MPAnimation = /*#__PURE__*/function () {
  function MPAnimation(options, _this) {
    (0, _classCallCheck2.default)(this, MPAnimation);
    this.options = options;
    // 在iOS10+QQ小程序平台下，传给原生的对象一定是个普通对象而不是Proxy对象，否则会报parameter should be Object instead of ProxyObject的错误
    this.animation = uni.createAnimation(_objectSpread({}, options));
    this.currentStepAnimates = {};
    this.next = 0;
    this.$ = _this;
  }
  (0, _createClass2.default)(MPAnimation, [{
    key: "_nvuePushAnimates",
    value: function _nvuePushAnimates(type, args) {
      var aniObj = this.currentStepAnimates[this.next];
      var styles = {};
      if (!aniObj) {
        styles = {
          styles: {},
          config: {}
        };
      } else {
        styles = aniObj;
      }
      if (animateTypes1.includes(type)) {
        if (!styles.styles.transform) {
          styles.styles.transform = '';
        }
        var unit = '';
        if (type === 'rotate') {
          unit = 'deg';
        }
        styles.styles.transform += "".concat(type, "(").concat(args + unit, ") ");
      } else {
        styles.styles[type] = "".concat(args);
      }
      this.currentStepAnimates[this.next] = styles;
    }
  }, {
    key: "_animateRun",
    value: function _animateRun() {
      var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var ref = this.$.$refs['ani'].ref;
      if (!ref) return;
      return new Promise(function (resolve, reject) {
        nvueAnimation.transition(ref, _objectSpread({
          styles: styles
        }, config), function (res) {
          resolve();
        });
      });
    }
  }, {
    key: "_nvueNextAnimate",
    value: function _nvueNextAnimate(animates) {
      var _this2 = this;
      var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var fn = arguments.length > 2 ? arguments[2] : undefined;
      var obj = animates[step];
      if (obj) {
        var styles = obj.styles,
          config = obj.config;
        this._animateRun(styles, config).then(function () {
          step += 1;
          _this2._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === 'function' && fn();
        this.isEnd = true;
      }
    }
  }, {
    key: "step",
    value: function step() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.animation.step(config);
      return this;
    }
  }, {
    key: "run",
    value: function run(fn) {
      this.$.animationData = this.animation.export();
      this.$.timer = setTimeout(function () {
        typeof fn === 'function' && fn();
      }, this.$.durationTime);
    }
  }]);
  return MPAnimation;
}();
var animateTypes1 = ['matrix', 'matrix3d', 'rotate', 'rotate3d', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scale3d', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'translate', 'translate3d', 'translateX', 'translateY', 'translateZ'];
var animateTypes2 = ['opacity', 'backgroundColor'];
var animateTypes3 = ['width', 'height', 'left', 'right', 'top', 'bottom'];
animateTypes1.concat(animateTypes2, animateTypes3).forEach(function (type) {
  MPAnimation.prototype[type] = function () {
    var _this$animation;
    (_this$animation = this.animation)[type].apply(_this$animation, arguments);
    return this;
  };
});
function createAnimation(option, _this) {
  if (!_this) return;
  clearTimeout(_this.timer);
  return new MPAnimation(option, _this);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map