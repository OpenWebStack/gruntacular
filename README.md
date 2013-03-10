#gruntacular
Grunt plugin for [Testacular](http://vojtajina.github.com/testacular/)
NOTE: this plugin requires Grunt 0.4.x

##Getting Started
From the same directory as your project's Gruntfile and package.json, install this plugin with the following command:

`npm install gruntacular --save-dev`

Once that's done, add this line to your project's Gruntfile:

```js
grunt.loadNpmTasks('gruntacular');
```

##Config
Inside your `Gruntfile.js` file, add a section named *testacular*, containing any number of configurations for running testacular. The only required option is the path to the [testacular config file](https://github.com/vojtajina/testacular/wiki/Configuration-File-Overview). Here's a simple example:

```js
testacular: {
  unit: {
    configFile: 'testacular.conf.js'
  }
}
```

You can override any of the config file's settings directly:

```js
testacular: {
  unit: {
    configFile: 'testacular.conf.js',
    runnerPort: 9999,
    singleRun: true,
    browsers: ['PhantomJS']
  }
}
```

##Sharing Configs
If you have multiple targets, it may be helpful to share common configuration settings between them. Gruntacular supports this by using the `options` property:

```js
testacular: {
  options: {
    configFile: 'testacular.conf.js',
    runnerPort: 9999,
    browsers: ['Chrome', 'Firefox']
  },
  continuous: {
    singleRun: true
    browsers: ['PhantomJS']
  },
  dev: {
    reporters: 'dots'
  }
}
```

In this example the `continuous` and `dev` targets will both use the `configFile` and `runnerPort` specified in the `options`. But the `continuous` target will override the browser setting to use PhantomJS, and also run as a singleRun. The `dev` target will simply change the reporter to dots.

##Running tests
There are three ways to run your tests with testacular:

###Testacular Server with Auto Runs on File Change
Setting the `autoWatch` option to true will instruct testacular to start a server and watch for changes to files, running tests automatically:

```js
testacular: {
  unit: {
    configFile: 'testacular.conf.js',
    autoWatch: true
  }
}
```
Now run `$ grunt testacular`

However, usually Grunt projects watch many types of files using [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch), so this option isn't preferred. 

###Testacular Server with Grunt Watch
Config testacular like usual (without the autoWatch option):

```js
testacular: {
  unit: {
    configFile: 'testacular.conf.js'
  }
}
```

Config your `watch` task to run the testacular task with the `:run` flag. For example:

```js
watch: {
  //run unit tests with testacular (server needs to be already running)
  testacular: {
    files: ['app/js/**/*.js', 'test/browser/**/*.js'],
    tasks: ['testacular:unit:run'] //NOTE the :run flag
  }
},
```

In one terminal window start the testacular server by running `$ grunt testacular`. In another terminal window start grunt watch by running `$ grunt watch`. Now when grunt watch detects a change to one of those files, it will run the testacular tests using the already running testacular server. This is the preferred method for development. Note that when tests fail in this mode, gruntacular will intentionally **not** fail, so that your watch task will continue running.

###Single Run
Keeping a browser window & testacular server running during development is productive, but not a good solution for build processes. For that reason testacular provides a "continuous integration" mode, which will launch the specified browser(s), run the tests, and close the browser(s). It also supports running tests in [PhantomJS](http://phantomjs.org/), a headless webkit browser which is great for running tests as part of a build. To run tests in continous integration mode just add the `singleRun` option:

```js
testacular: {
  unit: {
    configFile: 'config/testacular.conf.js',
  },
  //continuous integration mode: run tests once in PhantomJS browser.
  continuous: {
    configFile: 'config/testacular.conf.js',
    singleRun: true,
    browsers: ['PhantomJS']
  },
}
```

The build would then run `grunt testacular:continuous` to start PhantomJS, run tests, and close PhantomJS.

##License
MIT License