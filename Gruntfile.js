module.exports = function(grunt) {

  // Load S3 plugin
  grunt.loadNpmTasks('grunt-aws');

  // Static Webserver
  grunt.loadNpmTasks('grunt-contrib-connect');


  // grunt.loadNpmTasks('grunt-contrib-compress');
  // grunt.loadNpmTasks('grunt-contrib-compass');
  // grunt.loadNpmTasks('grunt-browser-sync');

  // load tasks
  [
      'grunt-contrib-jshint',
      'grunt-contrib-qunit',
      'grunt-contrib-watch',
      'grunt-contrib-clean',
      'grunt-contrib-copy',
      'grunt-contrib-concat',
      'grunt-contrib-uglify',
      'grunt-contrib-cssmin',
      'grunt-contrib-sass',
      'grunt-contrib-coffee',
      'grunt-contrib-jst',
      'grunt-assemble',
      'grunt-usemin',
      'grunt-filerev'
  ].forEach(function(task) { grunt.loadNpmTasks(task); });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    aws: grunt.file.readJSON('.aws.json'),

    // validate JS files using jshint (great for catching simple bugs)
    jshint: {
        files: ['gruntfile.js', 'src/js/*.js'],
        options: {
            // options here to override JSHint defaults
            globals: {
                jQuery: true,
                console: true,
                module: true,
                document: true
            }
        }
    },

    // clean up the `dist/` directory, i.e., delete files
    clean: {
        dist: {
            src: [
                'dist/*',
                '!dist/*.pkg.*.js',
                'dist/css/*',
                'dist/images/*',
                'dist/pdf/*',
                'dist/docs/*'
            ]
        }
    },

    // compile LESS files in `src/less/` into CSS files
    sass: {
        dist: {
            options: {
              style: 'expanded'
            },
            files: [
                {
                    src: 'dist/scss/application.css.scss',
                    dest: 'dist/application.css',
                    ext: '.css'
                }
            ]
        }
    },

    jst: {
      compile: {
        files: {
          'dist/templates/templates.js': ['src/templates/*.html', 'src/templates/*/*.html']
        }
      }
    },

    concat: {
      scss: {
        src: ['src/scss/*.scss'],
        dest: 'dist/scss/application.css.scss',
      },
      js: {
        src: ['dist/templates/templates.js',
          'src/js/plugins/1_jquery_files/*.js', 'src/js/plugins/jquery-file-upload/*.js',
          'src/js/plugins/*.js', 'src/js/*.js'],
        dest: 'dist/application.js',
      },
      angularjs: {
        src: ['src/js/angular/angular.js','src/js/angular/angular-sanitize.js'],
        dest: 'dist/angular.js',
      }
    },

    assemble: {
      options: {
        flatten: true,
      },
      pages: {
        src: ['src/*.html'],
        dest: 'dist/'
      }
    },

    // copy over `src/` files to `dist/`
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src/',
          dest: 'dist/',
          src: [
            'pdf/*',
            'docs/*',
            'images/**',
          ],
          filter: 'isFile'
        }]
      }
    },


    // prep call for usemin (target all html files)
    useminPrepare: {
        html: [
            'dist/*.html'
        ]
    },

    // final call for usemin (target all html files)
    usemin: {
        html: [
            'dist/*.html'
        ],
        options: {
            dirs: ['dist/']
        }
    },

    // revision a specific set of static files, this can be
    // extended to do more files and images too
    filerev: {
        files: {
            src: [
                'dist/*.pkg.css',
                'dist/*.pkg.js'
            ]
        }
    },

    // watch command to auto-compile files that have changed
    watch: {
        html: {
            files: ['src/*.html', 'src/layouts/*.html', 'src/templates/*.html'],
            tasks: ['jshint', 'clean', 'concat:scss', 'sass', 'jst', 'concat:js', 'concat:angularjs', 'assemble', 'copy:dist', 'useminPrepare', 'concat:generated', 'uglify', 'cssmin', 'filerev']
        },
        js: {
            files: ['src/**/*.js'],
            tasks: ['jshint', 'clean', 'concat:scss', 'sass', 'jst', 'concat:js', 'concat:angularjs', 'assemble', 'copy:dist', 'useminPrepare', 'concat:generated', 'uglify', 'cssmin', 'filerev']
        },
        sass: {
            files: ['src/**/*.scss'],
            tasks: ['jshint', 'clean', 'concat:scss', 'sass', 'jst', 'concat:js', 'concat:angularjs', 'assemble', 'copy:dist', 'useminPrepare', 'concat:generated', 'uglify', 'cssmin', 'filerev']
        },
    },

    s3: {
      options: {
        bucket: "<%= aws.bucket %>",
        region: "<%= aws.region %>",
        sslEnabled: false
      },
      build: {
        cwd: "dist",
        src: "**"
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: "dist",
//          keepalive: true
        }
      }
    }
  });

//  grunt.registerTask('default', ['compass:dev', 'browserSync', 'watch']);
//  grunt.registerTask('prod', ['compass:prod']);

  // run tests
  grunt.registerTask('test', ['jshint', 'qunit']);

  // like watch, but build stuff at start too!
  grunt.registerTask('dev', ['sass', 'watch']);

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'clean', 'concat:scss', 'sass', 'jst', 'concat:js', 'concat:angularjs', 'assemble', 'copy:dist',
                                 'useminPrepare',
                                 'concat:generated',
                                 'uglify', 'cssmin',
                                 'filerev',
                                 'usemin', 'connect','watch']);
//  grunt.registerTask("default", ["connect"]);

};
