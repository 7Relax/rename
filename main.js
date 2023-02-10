const fs = require('fs').promises
const path = require('path')

function mergeConfig(config) {
  return {
    directory: process.cwd(), // 文件目录
    replace: '', // 需要替换的内容
    content: '', // 替换为的内容
    ...config,
    ...config._optionValues
  }
}

class Start {
  constructor(config) {
    this.config = mergeConfig(config)
    console.log('directory', this.config.directory)
    console.log('replace', this.config.replace)
    console.log('content', this.config.content)
  }
  async start() {
    // 判断参数
    if (!this.config.replace) {
      return console.log('请输入需要替换的内容')
    }
    try {
      // 绝对路径
      const absPath = this.config.directory
      // 获取目录及文件信息
      const statObj = await fs.stat(absPath)
      if (statObj.isDirectory()) {
        // 处理
        this.handle(absPath)
      }
    } catch (error) {
      console.log('请输入正确的路径 >> ', error)
    }
  }
  async handle(absPath) {
    // 遍历目录得到文件
    const files = await fs.readdir(absPath)
    files && files.forEach(async fileName => {
      const oldPath = path.resolve(absPath, fileName)
      const statObj = await fs.stat(oldPath)
      if (statObj.isFile()) {
        // 替换为的传入的内容
        let newStr = fileName.replace(this.config.replace, this.config.content)
        // 拿到文件扩展名，如 .mp4
        const extname = path.extname(newStr)
        // 获取到文件名（除去.扩展名）
        const name = path.basename(newStr, extname)
        // 额外处理
        let str = this.extra(name)
        // 找到第一个点. 替换为空格
        const reg = /[\d]{2}\./
        if (!str && name.search(reg) !== -1) {
          str = name.replace(/\./, ' ')
        }
        newStr = str ? (str + extname) : newStr
        if (fileName !== newStr) {
          console.log('newStr =', newStr)
          const newPath = path.resolve(absPath, newStr)
          fs.rename(oldPath, newPath, (err) => {
            throw err
          })
        }
      } else {
        this.handle(oldPath)
      }
    })
  }
  // 额外处理
  extra(name) {
    const reg = /(\.[\d]{2}\s)|(\smp4)/
    let str = null
    if (name.search(reg) !== -1) {
      str = name.replace(reg, ' ').trim()
    }
    return str
  }
}

module.exports = Start
