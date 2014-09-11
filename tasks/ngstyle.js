'use strict';

/**
 * tabHandler service - allows it to register callbacks which
 * are called in case the selected tab is changed
 */
function tabHandlerService () {
  /*jshint -W004 */
  var tabHandlerService = {};
  /*jshint +W004 */

  var requiredFunctions = ['enterView', 'leaveView', 'focus'],
      handler = {}, //store handlers
      defaultHandler;

  var verifyTabObject = function(tabObject){
    var getType = {};

    requiredFunctions.forEach(function(item){
      if (typeof tabObject[item] === 'undefined'){
        throw 'tabHandlerService tabObject error: ' + item +
          ' function is not defined, but mandatory.';
      }

      if (getType.toString.call(tabObject[item]) !== '[object Function]'){
        throw 'tabHandlerService tabObject error: ' + item +
          ' is available, but not a function';
      }
    });
    return true;
  };

  tabHandlerService.addDefault = function(tabObject){
    if (verifyTabObject(tabObject)){
      defaultHandler = tabObject;
    }
  };

  tabHandlerService.register = function(name, tabObject){
    tabObject = tabObject || defaultHandler;
    if (verifyTabObject(tabObject)){
      handler[name] = tabObject;
    }
  };

  tabHandlerService.get = function(name){
    if (typeof handler[name] === 'undefined'){
      return defaultHandler;
    } else {
      return handler[name];
    }
  };
  return tabHandlerService;
}

/**
 * module definition
 */
angular
  .module('tabHandlerService', [])
  .factory('tabHandler', tabHandlerService);
