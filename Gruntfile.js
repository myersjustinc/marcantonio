/*global module:false*/
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\\n' + '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        concat: {
            dist: {
                src: [
                    '<%= meta.banner %>',
                    'src/marcantonio.core.js',
                    'src/marcantonio.Drawing.js',
                    'src/marcantonio.View.js',
                    'src/marcantonio.Area.js',
                    'src/**/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            dist: {
                src: ['<%= meta.banner %>', '<%= concat.dist.dest %>'],
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            files: '<%= jshint.files %>',
            tasks: 'jshint qunit'
        },
        jshint: {
            files: [
                'Gruntfile.js',
                'src/**/*.js',
                'test/**/*.js'
            ],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            }
        }
    });
    
    // Default task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-css');
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'qunit']);
};