#! /usr/bin/env node

const { program } = require('commander')

// 配置信息
const options = {
  '-d --directory <dir> ': {
    'description': 'directory',
    'example': '  rename -d D:\\doc'
  },
  '-r --replace <dir>': {
    'description': 'replace file name content',
    'example': "  rename -r '【海量资源：666java.com】'"
  },
  '-c --content <dir>': {
    'description': 'replace with something, default value is empty',
    'example': "  rename -c '$E'"
  }
}

const formatConfig = (configs, cb) => {
  Object.entries(configs).forEach(([key, val]) => {
    cb(key, val)
  })
}

// 打印出 Options
formatConfig(options, (cmd, val) => {
  program.option(cmd, val.description)
})

// 打印出 Examples
program.on('--help', () => {
  console.log('Examples: ')
  formatConfig(options, (cmd, val) => {
    console.log(val.example)
  })
})

// 改名
program.name('rename')

// 版本号
const version = require('../package.json').version
program.version(version)

const cmdConfig = program.parse(process.argv)
// 处理命令中有空格带来的问题
const argv = process.argv
const first = argv.findIndex(item => item === '-d')
const next = argv.findIndex(item => item === '-r' || item === '-c')
let realDir = ''
if (next > first) {
  const newArr = argv.slice(first+1, next)
  realDir = newArr.join(' ')
}
const oValue = cmdConfig._optionValues
if (realDir) {
  oValue.directory = realDir
}
if (oValue) {
  // $E: 表示为空
  oValue.content = oValue.content === '$E' ? '' : oValue.content
}

const Start = require('../main.js')
new Start(cmdConfig).start() // 开始执行程序
