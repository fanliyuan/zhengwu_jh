/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/28
 *
 * 描述 ：自动生成模板文件demo
 */

let fs = require('fs');
let moment = require('moment');
let author = require('os').homedir().split('\\').pop();
console.log(require('fs'))

class createFiles {
  constructor(data) {
    let vm = this;
    let basepath = 'src/components/';
    let writesPath = ['src/pages/', 'src/router/', 'src/config/'];
    let reads = [`${basepath}cptTemp/cptTemp.vue`, `${basepath}cptTemp/cptTemp.js`, `${basepath}cptTemp/cptTempConfig.js`];
    let file = [];
    let newWPath = '';
    vm.data = data;
    vm.basepath = basepath;
    vm.writesPath = writesPath;
    vm.reads = reads;
    vm.file = file;
    vm.newWPath = newWPath;
    vm.author = author;
  }

  exists (wPath) {
    let vm = this;
    vm.newWPath = wPath;
    return new Promise((res, rej) => {
      (async function () {
        for (let a of vm.path) {
          fs.existsSync(vm.newWPath + a) ? vm.newWPath = `${vm.newWPath}${a}/` : await vm.mkdir(a);
        }
        res(vm.newWPath);
      })()
    })
  }

  mkdir (a) {
    let vm = this;
    return new Promise((res, rej) => {
      fs.mkdir(vm.newWPath + a, (err) => {
        if (err) rej(err);
        vm.newWPath = `${vm.newWPath}${a}/`;
        res(vm.newWPath);
      });
    })
  }

  readFile (i) {
    let vm = this;
    return new Promise((res) => {
      vm.file = [];
      let text = fs.readFileSync(vm.reads[i]).toString();
      text = text.replace(/time/g, moment().format('YYYY/MM/DD'))
        .replace(/demo/g, vm.name)
        .replace(/Demo/g, vm.name.substring(0, 1).toUpperCase() + vm.name.substring(1))
        .replace(/author/g, author);
      vm.file.push(text);
      res(vm.file);
    })
  }

  writeFile () {
    let vm = this;
    return new Promise((res, rej) => {
      (async function () {
        await fs.writeFile(`${vm.newWPath}${vm.writes[i]}`, vm.file, (err) => {
          if (err) rej(err)
        })
        res('succ');
      })()
    })
  }

  async creatCpt (filePath, fileName) {
    let vm = this;
    vm.path = (filePath || '').split('/');
    vm.name = fileName;
    vm.writes = [`${fileName}.vue`, `${fileName}.js`, `${fileName}.js`];
    console.log(vm)
    try {
      for (let i = 0, len = vm.writesPath.length; i < len; i++) {
        await vm.exists(vm.writesPath[i]);
        await vm.readFile(i);
        await vm.writeFile(await vm.readFile(i), i);
      }
      return console.log(`Successfully created ${name} component`)
    }
    catch (err) {
      console.error(err);
    }
  }
}

export default (data) => {
  return new createFiles(data);
}

