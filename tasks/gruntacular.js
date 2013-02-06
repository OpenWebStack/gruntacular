var runner = require('testacular').runner;
var server = require('testacular').server;

module.exports = function(grunt) {
  grunt.registerMultiTask('testacular', 'run testacular.', function() {
    var done = this.async();
    if (this.data.configFile) {
      var self = this;
      var files = grunt.file.expand(this.data.configFile);
      grunt.util.async.reduce(
	files,
	true,
	function(memo, file, cb) {
	  self.data.configFile = grunt.template.process(file);
	  execute(self.data, self.flags, function(ret) {
	      cb(undefined, memo && ret);
	  });
	},
	function(err, result) {
	  done(result);
	}
      );
    } else {
      execute(this.data, this.flags, done);
    }
  });
};

var execute = function(data, flags, cb) {
  //support `testacular run`, useful for grunt watch
  if (flags.run) {
    runner.run(data, finished.bind(cb));
    return;
  }

  server.start(data, finished.bind(cb));
};

function finished(code){ return this(code === 0); }