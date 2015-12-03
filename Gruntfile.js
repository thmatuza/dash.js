module.exports = function (grunt) {
    require('time-grunt')(grunt);

    // Project configuration.
    grunt.initConfig({
        clean: {
            build: ['build/temp'],
            dist: ['dist/*']
        },
        jshint: {
            src: {
                src: ['src/**/*.js', 'Gruntfile.js'],
                options: {
                    jshintrc: '.jshintrc'
                }
            }
        },
        concat: {
            all: {
                src: ['build/temp/MediaPlayer.js', './externals/*.js'],
                dest: 'build/temp/Dash.all.js',
            },
        },
        uglify: {
            options: {
                sourceMap: true,
                sourceMapIn: 'build/temp/Dash.all.js.map',
                sourceMapRoot: './src/',
                preserveComments: 'some',
                mangle: true,
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true
                }
            },
            build: {
                files: {
                    'build/temp/dash.min.js': 'build/temp/MediaPlayer.js',
                    'build/temp/dash.all.min.js': 'build/temp/Dash.all.js'
                }
            },

            debug: {
                options: {
                    beautify: true,
                    compress: false,
                    mangle: false,
                    sourceMap: true,
                    sourceMapIn: 'build/temp/Dash.all.js.map',
                    sourceMapRoot: './src/',
                },
                files: {
                    'build/temp/dash.debug.js': 'build/temp/Dash.all.js'
                }
            }
        },
        watch: {
            default: {
                files: ['src/**/*', 'Gruntfile.js'],
                tasks: 'dev'
            }
        },
        copy: {
            dist: {
                expand: true,
                cwd: 'build/temp/',
                src: ['dash.min.js', 'dash.min.js.map',
                      'dash.all.min.js', 'dash.all.min.js.map',
                      'dash.debug.js', 'dash.debug.js.map'],
                dest: 'dist/',
                filter: 'isFile'
            }
        },
        exorcise: {
            build: {
                options: {},
                files: {
                    'build/temp/MediaPlayer.js.map': ['build/temp/MediaPlayer.js'],
                    'build/temp/Dash.all.js.map': ['build/temp/Dash.all.js']
                }
            }
        },
        browserify: {
            build: {
                files: {
                    'build/temp/MediaPlayer.js': ['src/streaming/MediaPlayer.js']
                },
                options: {
                    browserifyOptions: {
                        debug: true,
                        standalone: 'MediaPlayer'
                    },
                    plugin: [
                      ['browserify-derequire']
                    ],
                    transform: ['babelify']
                }
            },
            watch: {
                files: {
                    'build/temp/MediaPlayer.js': ['src/js/MediaPlayer.js']
                },
                options: {
                    watch: true,
                    keepAlive: true,
                    browserifyOptions: {
                        standalone: 'MediaPlayer'
                    },
                    transform: ['babelify'],
                    plugin: [
                      ['browserify-derequire']
                    ]
                }
            }
        },
        jasmine: {
            tests: {
                src: [
                    'build/temp/Dash.js',
                    './externals/*.js'
                ],
                options: {
                    host: 'http://127.0.0.1:8000',
                    keepRunner: true,
                    outfile: 'build/temp/_SpecRunner.html',
                    helpers: [
                      'test/js/utils/Helpers.js',
                      'test/js/utils/SpecHelper.js',
                      'test/js/utils/ObjectsHelper.js',
                      'test/js/utils/MPDHelper.js',
                      'test/js/utils/VOHelper.js'
                    ],
                    specs: [
                      'test/js/dash/TimelineConverterSpec.js',
                      'test/js/dash/DashHandlerSpec.js',
                      'test/js/dash/RepresentationControllerSpec.js',
                      'test/js/streaming/MediaPlayerSpec.js',
                      'test/js/streaming/FragmentControllerSpec.js',
                      'test/js/streaming/FragmentModelSpec.js',
                      'test/js/streaming/AbrControllerSpec.js'
                    ],
                    vendor: [
                      './externals/*.js'
                    ],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: './reports/coverage.json',
                        report: './reports/coverage',
                        files: './build/temp/Dash.js'
                    },
                    junit: {
                        path: grunt.option('jsunit-path'),
                        consolidate: true
                    }
                }
            }
        },
        connect: {
            default_options: {},
            dev: {
                options: {
                    port: 9999,
                    keepalive: true
                }
            }
        },
        jsdoc: {
            dist: {
                options: {
                    destination: 'docs/jsdocs',
                    configure: 'build/jsdoc/jsdoc_conf.json'
                }
            }
        }
    });

    // load all the npm grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', [
      'clean:build',
      //'jshint', //TODO: lots of failures heres
      'browserify:build',
      'concat:all'
    ]);

    grunt.registerTask('minimize', [
      'exorcise',
      'uglify'
    ]);

    grunt.registerTask('dist', [
      'clean:dist',
      'build',
      'minimize',
      'copy:dist'
    ]);

    //grunt.registerTask('test', [
    //  'connect:default_options',
    //  'jasmine'
    //]);

    // Default task.
    //grunt.registerTask('default', [
    //  'dist',
    //  'test',
    //  'jsdoc'
    //]);

    //grunt.registerTask('watch', [
    //  'browserify:watch'
    //]);
};