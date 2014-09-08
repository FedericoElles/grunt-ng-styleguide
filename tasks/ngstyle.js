'use strict';

//var ngmin = require('ngmin');

module.exports = function (grunt) {

  grunt.registerMultiTask('ngstyle', 'Checks AngularJS Styleguide', function () {

    //grunt.log.writeln('ngstyle ' + grunt.log.wordlist(this.files.map(function (file) {
    //  return file.src;
    //})));
    var files = this.filesSrc;

    files.forEach(function (file) {
      //console.log(file.src);

      var keywords = {
        'angular.': -1,
        '.module' :-1,
        '.factory': -1
      };
      var content = grunt.file.read(file);
      var contents = content.split('\n');
      grunt.log.writeln(file + ': Lines: ' + contents.length);
      for (var i = 0, ii=contents.length; i<ii; i+=1){
        for (var x in keywords){
          var searchString = contents[i].replace(/('.*')/ig,'').replace(/ /ig,'');
          var keywordPosition = searchString.indexOf(x);

          if (keywordPosition> -1 && i > keywords[x]){
            keywords[x] = i;
          }
        }
      }

      //
      if (keywords['angular.']>-1){
        ['.module', '.factory'].forEach(function(keyword){
          if (keywords[keyword] > -1 && 
             (keywords[keyword] < keywords['angular.'])){
            grunt.log.errorlns('ERR> "' + keyword+ '" module definition should be on end of file.');
            console.log(keywords);
          }
        });

        //if (keywords['.factory'] > -1 && (keywords['.factory'] < keywords['angular.']) || 
        //    keywords['.module'] > -1 && (keywords['.module'] < keywords['angular.'])){
        //  grunt.log.errorlns('ERR> Module definition should be on end of file;');
        //  console.log(keywords);
        // }
      }


      
    });

  });
};
