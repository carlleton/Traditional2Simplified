const { convert } = require('./data')
const { promisify } = require('util');
const { resolve } = require('path');

const fs = require('fs');
const readdir = promisify(fs.readdir);
const rename = promisify(fs.rename);
const stat = promisify(fs.stat);

var sourcefolder = 'source' // 源地址
var newfolder = 'translate' //转换后的地址
var ignores = ['.git'] // 忽略的文件，全称来判断
var translates = ['.md', '.txt'] // 需要转换的文件，扩展名

sourcefolder = __dirname + '/' + sourcefolder
newfolder = __dirname + '/' + newfolder

async function getFiles(dir, subdir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (filename) => {
    const res = resolve(dir, filename);
    const folder = subdir + '/' + filename
    let isdirectory =  (await stat(res)).isDirectory()
    if (ignores.indexOf(filename) > -1) {
      return folder + ',忽略'
    }
    if (isdirectory) {
      await fs.mkdir(newfolder + folder,0777, function (err) {
        if (err) {
          console.log('创建目录' + folder, '失败')
        } else {
          console.log('创建目录' + folder, '成功')
        }
      })
      return getFiles(res, folder)
    }
    var file = folder
    var ext = file.substr(file.lastIndexOf('.'))
    if (translates.indexOf(ext) > -1) {
      await traditionlize(sourcefolder + file, newfolder + file)
    } else {
      copy(sourcefolder + file, newfolder + file)
    }
    return folder
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

// 翻译
async function traditionlize(fileName, newfile) {
  console.log('readfile', fileName)
  var data = (await fs.readFileSync(fileName)).toString()

  var str = convert(0, data)

  fs.writeFile(newfile, str, function(err, result) {
    if (err) {
      console.error(err);
    } else {
      console.log("繁体转为简体文件成功", newfile);
    }
  })
}

// copy
function copy( _src, _dst ){
    // 创建读取流
    var readable = fs.createReadStream( _src );
    // 创建写入流
    var writable = fs.createWriteStream( _dst ); 
    // 通过管道来传输流
    readable.pipe( writable );
};

getFiles(sourcefolder, '')
  .then((files) => {
    //console.log(files)
  })
  .catch(e => console.error(e))
