#!/usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const commander = require('commander')
const exec = require('child_process').exec

const pkg = require('../package.json')
const {inquirerFn, downloadFn} = require('../lib/init')

commander.version(pkg.version, '-v,--version')//.option('-b,--bbb', 'bbb desc')

// commander.on('option:bbb', function () {
//   console.log('Examples:222')
// })
commander.command('init <dirname>').description(pkg.description).option('-f, --force', 'forcible init dirname').action((dirname, cmd) => {
  // 命令init触发时的回掉函数
  if (cmd.force) {
    exec(`rm -rf ${dirname}`)
  } else if (fs.existsSync(dirname)) {
    return console.log(chalk.red(`dirname ${dirname} is exist`))
  }
  inquirerFn().then(answers => {
    downloadFn(answers, dirname)
  })
})

// 如果输入没有注册的命令,输出帮助提示
commander.arguments('<other>').action(cmd => {
  commander.outputHelp()
  console.log(' ')
  console.log(chalk.red(`error: unknown option '${cmd}'`))
})
commander.parse(process.argv)

// 如果没写参数,输出帮助提示
if (!process.argv.slice(2).length) {
  commander.outputHelp()
}