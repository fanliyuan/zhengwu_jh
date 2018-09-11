/**
 * 作者 ：yhzzy
 *
 * 日期 ：2018/06/28
 *
 * 描述 ：自动生成模板文件demo
 */
let fs = require('fs');
let basepath = 'src/components/';
let writesPath = ['src/pages/', 'src/router/', 'src/config/'];
let moment = require('moment');
let cptName = process.argv.splice(2)[0];
let path = cptName.split('/');
let name = path[path.length - 1];
let writes = [`${name}.vue`, `${name}.js`, `${name}.js`];
let reads = [`${basepath}cptTemp/cptTemp.vue`, `${basepath}cptTemp/cptTemp.js`, `${basepath}cptTemp/cptTempConfig.js`];
let file = [];
let author = require('os').homedir().split('\\').pop();
let newWPath = '';

//检测是否存在文件夹
let exists = function (wPath) {
    newWPath = wPath;
    return new Promise((res, rej) => {
        (async function () {
            for (let a of path) {
                fs.existsSync(newWPath + a) ? newWPath = `${newWPath}${a}/` : await mkdir(a);
            }
            res(newWPath);
        })()
    })
};
//建立文件夹
let mkdir = function (a) {
  return new Promise((res, rej) => {
    fs.mkdir(newWPath + a, (err) => {
      if (err) rej(err);
      newWPath = `${newWPath}${a}/`;
      res(newWPath);
    });
  })
};
//读取模板文件内容，并替换为目标组件
let readFile = function (i) {
  return new Promise((res) => {
    file = [];
    let text = fs.readFileSync(reads[i]).toString();
    text = text.replace(/time/g, moment().format('YYYY/MM/DD'))
      .replace(/demo/g, name)
      .replace(/Demo/g, name.substring(0, 1).toUpperCase() + name.substring(1))
      .replace(/author/g, author);
    file.push(text);
    res(file);
  })
};
//生成文件，并填入之前读取的文件内容
let writeFile = function (file, i) {
  return new Promise((res, rej) => {
    (async function () {
      await fs.writeFile(`${newWPath}${writes[i]}`, file, (err) => {
        if (err) rej(err)
      })
      res('succ');
    })()
  })
};
async function creatCpt() {
  try {
    for (let i = 0, len = writesPath.length; i < len; i++) {
      await exists(writesPath[i]);
      await readFile(i);
      await writeFile(await readFile(i), i);
    }
    return console.log(`Successfully created ${name} component`)
  }
  catch (err) {
    console.error(err);
  }
}
creatCpt();
