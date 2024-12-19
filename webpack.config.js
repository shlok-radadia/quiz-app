const path = require('path')

module.exports = [
  {
    mode: 'development',
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist/main'),
      filename: 'script.js'
    },
    watch: true
  },
  {
    mode: 'development',
    entry: './src/login.js',
    output: {
      path: path.resolve(__dirname, 'dist/login'),
      filename: 'script.js'
    },
    watch: true
  },
  {
    mode: 'development',
    entry: './src/signup.js',
    output: {
      path: path.resolve(__dirname, 'dist/signup'),
      filename: 'script.js'
    },
    watch: true
  },
  {
    mode: 'development',
    entry: './src/home.js',
    output: {
      path: path.resolve(__dirname, 'dist/app/home'),
      filename: 'script.js'
    },
    watch: true
  },
  {
    mode: 'development',
    entry: './src/profile.js',
    output: {
      path: path.resolve(__dirname, 'dist/app/profile'),
      filename: 'script.js'
    },
    watch: true
  },
  {
    mode: 'development',
    entry: './src/quiz_create.js',
    output: {
      path: path.resolve(__dirname, 'dist/app/quiz_create'),
      filename: 'script.js'
    },
    watch: true
  }
]