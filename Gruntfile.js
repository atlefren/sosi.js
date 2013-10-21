module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [
                    "src/cli_header.js",
                    "src/class_system.js",
                    "src/datatypes.js",
                    "src/util.js",
                    "src/head.js",
                    "src/geometry.js",
                    "src/feature.js",
                    "src/dumpers.js",
                    "src/parser.js",
                    "src/cli.js"
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        jshint: {
            files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
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
        buster: {
            test: {
                server: {
                    port: 1112
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['buster', 'default']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-buster');


    grunt.registerTask('default', ['concat', 'uglify']);

};
