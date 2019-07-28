const inquirer = require('inquirer')
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk')
const download = require('download-git-repo')

exports.inquirerFn = function () {
  return inquirer.prompt([
    // {
    //   type: 'list',
    //   name: 'frame',
    //   message: '请选择开发用的脚手架:',
    //   choices: ['react', 'vue'],
    // },
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称:',
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入项目简介:',
    },
  ])
}

const spinner = ora('loading...')

/**
 * 从github上下载已有的模版
 * @param answers 命令行收集到的交互信息
 * @param dirname 最终生成的项目名
 */
exports.downloadFn = function (answers, dirname) {
  const {frame, name = dirname, description = dirname} = answers
  // 从github上找了两个star比较多的脚手架模版,一个react,一个vue
  let url = 'duyinghua/egg-ssr'
  spinner.start()
  download(url, dirname, {clone: false}, (err) => {
    if (err) {
      spinner.stop() // 关闭loading动效
      console.log(chalk.red('download template failed'))
      console.log(err)
    } else {
      spinner.stop() // 关闭loading动效
      console.log(chalk.green('download template success'))
      // 重写package中的name、description等项目信息
      const pkg = process.cwd() + `/${dirname}/package.json`
      const content = JSON.parse(fs.readFileSync(pkg, 'utf8'))

      content.name = name
      content.description = description
      const result = JSON.stringify(content, null, '\t')
      fs.writeFileSync(pkg, result)
    }
  })
}


