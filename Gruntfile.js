module.exports = function(grunt) {

    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
        require('load-grunt-tasks')(grunt);
        require('time-grunt')(grunt);

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        shell: {
          jekyllServe: {
            command: "jekyll serve --config _config-dev.yml"
          },
          jekyllBuild: {
            command: "jekyll build --config _config-dev.yml"
          }
        },
        uglify: {
          global: {
            files: {
              "js/scripts.min.js": ["js/scripts.js"],
              "js/vendor.min.js": ["js/vendor/*.js"]
            }
          }
        },
        imagemin: {
          dynamic: {
            files: [{
              expand: true,
              cwd: 'images/',
              src: ['**/*.{png,jpg,gif,svg}'],
              dest: 'images/'
            }]
          }
        },
        sass: {
          global: {
            options: {
              style: "compressed"
            },
            files: {
              "css/main-unprefixed.css": "scss/main.scss"
            }
          }
        },
        autoprefixer: {
           dist: {
               files: {
                   'css/main.css': 'css/main-unprefixed.css'
               }
           }
       },
       criticalcss: {
           custom: {
               options: {
                   url: "http://127.0.0.1:4000/",
                   width: 1200,
                   height: 900,
                   outputfile: "_includes/critical.css",
                   filename: "_site/css/main.css", // Using path.resolve( path.join( ... ) ) is a good idea here
                   buffer: 800*1024,
                   ignoreConsole: false
               }
           }
       },
       watch: {
         options: {
           livereload: true
         },
         site: {
           files: ["*.html", "_layouts/*.html", "_posts/*.md", "_projects/*.md", "_includes/*.html"],
           tasks: ["shell:jekyllBuild"]
         },
         js: {
           files: ["js/*.js", "!js/scripts.min.js", "!js/vendor.min.js"],
           tasks: ["uglify", "shell:jekyllBuild"]
         },
         css: {
           files: ["scss/*.scss"],
           tasks: ["sass", "autoprefixer", "shell:jekyllBuild"]
         }
       },
       concurrent: {
           dev: ['shell:jekyllServe', 'watch'],
           options: {
               logConcurrentOutput: true
           }
       }
    });


    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask("default", ["shell:jekyllBuild", "concurrent:dev"]);
    grunt.registerTask("production", ["sass", "uglify", "autoprefixer", "criticalcss", "imagemin", "shell:jekyllBuild"]);






};
