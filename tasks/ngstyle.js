'use strict';

//var ngmin = require('ngmin');

module.exports = function (grunt) {

  grunt.registerMultiTask('ngstyle', 'Checks AngularJS Styleguide', function () {

    var NG_MODULES = {
      controller: {
        uppercase: true,
        nameEqualFunction: true,
        suffix: 'Ctrl'
      },
      factory: {
        uppercase: false,
        suffix: 'Factory'
      },
      service: {
        uppercase: false,
        suffix: 'Service'
      },
      filter: {
        uppercase: false,
        suffix: 'Filter'
      },
      directive: {
        uppercase: false,
        suffix: 'Directive'
      },
      config: {
        uppercase: false,
        suffix: 'Config'
      }
    };

    var files = this.filesSrc;

    var totalNumError = 0;

    files.forEach(function (file) {
      //console.log(file.src);
      var numError = 0;

      function logError(text){
        if (numError === 0){
          grunt.log.writeln('\n'+file + ': Lines: ' + contents.length);
        }
        grunt.log.errorlns(text);
        numError++;
        totalNumError++;
      }

      var keywords = {
        'angular.': -1,
        '.module' :-1,
        '.factory': -1
      };
      var content = grunt.file.read(file);
      var contents = content.split('\n');
      
      //loop all lines
      for (var i = 0, ii=contents.length; i<ii; i+=1){
        //check for position of module definitions
        for (var x in keywords){
          var searchString = contents[i].replace(/('.*')/ig,'').replace(/ /ig,'');
          var keywordPosition = searchString.indexOf(x);

          if (keywordPosition> -1 && i > keywords[x]){
            keywords[x] = i;
          }
        }

        //check for naming convention
        var testString = contents[i].replace(/ /ig,'');
        var re = /([^\.]*)\('(\w*)',[ ]*(\w*)\)/i;
        var found = testString.match(re);
        if (found){
          var ngType = found[1];
          var ngName = found[2];
          var ngFunc = found[3];
          if (ngType in NG_MODULES){
            var rules = NG_MODULES[ngType];
            var printLine = false;
            //console.log('Found', ngType, ngName, ngFunc);
            //uppercase rule
            if (rules.uppercase && ngFunc[0] !== ngFunc[0].toUpperCase()){
              logError('Funktion name "' + ngFunc+ '" should be uppercase.');
              printLine = true;
            }
            //name should equal function
            if (rules.nameEqualFunction){
              if (ngName !== ngFunc){
                logError('Funktion name "' + ngFunc+ '" should equal registered ' +
                  ngType + ' name "' + ngName + '".');
              }
            } else {
            //composite rule
              if (ngFunc !== ngName + (rules.suffix || '')){
                 logError('Funktion name "' + ngFunc+ '" should be "' +
                   ngName + rules.suffix + '".');
              }
            }
            //suffix rule
            if (rules.suffix){
              if (ngFunc.indexOf(rules.suffix) < 0){
                logError('Funktion name "' + ngFunc+ '" should have suffix ' +
                  '"' + rules.suffix + '".');
              }
            }
          }

          //factories must return themself:
          if (ngType === 'factory'){
            var returnStatement = 'return ' + ngName + ';';
            found = content.search(new RegExp(returnStatement, 'gm'));
            if (found < 0){
              logError('Factory ' + ngName + 
                ' should return object of same name: "' + returnStatement + '"');
            }
          }

          //print line in case  
          if (printLine){
            logError(i + ': ' + contents[i]);
          }
        }
      }

      //
      if (keywords['angular.']>-1){
        ['.module', '.factory'].forEach(function(keyword){
          if (keywords[keyword] > -1 && 
             (keywords[keyword] < keywords['angular.'])){
            logError('"' + keyword+ '" module definition should be on end of file.');
            logError(keywords[keyword] + ': ' + contents[keywords[keyword]]);
          }
        });
      }


      
    });

    if (totalNumError > 0){
      grunt.log.errorlns('');
      grunt.log.errorlns('Style Exceptions found: ' + totalNumError);
    }

  });
};
