module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      build: ["./dist"],
      postbuild: ["./src/**/*.js", "./src/**/*.map"],
      postbuildDist: ["./src/**/*.js", "./src/**/*.map", "./dist/**/*.map"]
    },
    exec: {
      build: {
        command: "npm run build"
      },
      run: {
        command: "npm run start"
      },
      debug: {
        command: "npm run buildAndDebug"
      }
    },
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: "./src",
            src: ["**/*", "!**/*.ts", "!**/test", "!**/*.map"],
            dest: "./dist"
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-exec");
  grunt.loadNpmTasks("grunt-contrib-clean");

  grunt.registerTask("build", "Compila los archivos de NODE", [
    "clean:build",
    "dirtybuild"
  ]);

  grunt.registerTask("dirtybuild", "Compila los archivos de NODE", [
    "exec:build",
    "copy:build",
    "clean:postbuild"
  ]);

  grunt.registerTask("run", "corre los archivos de NODE", [
    "build",
    "exec:run"
  ]);
  grunt.registerTask("debug", "corre los archivos en debug de NODE", [
    "exec:build",
    "exec:debug"
  ]);
  grunt.registerTask("dist", "corre los archivos de NODE", [
    "clean:build",
    "exec:views",
    "dirtybuild",
    "clean:postbuildDist",
    "exec:run"
  ]);
  grunt.registerTask("dirtydist", "corre los archivos de NODE", [
    "dirtybuild",
    "exec:run"
  ]);
  grunt.registerTask("default", "run es predeterminado", ["run"]);
};
