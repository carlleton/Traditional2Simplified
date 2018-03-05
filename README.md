# Traditional2Simplified
繁体转简体，转换一个目录下的.md和.txt文件

## Usage
1. 设置`index.js`文件
```
var sourcefolder = 'reactjs101' // 源地址
var newfolder = 'translate' //转换后的地址
var ignores = ['.git'] // 忽略的文件，全称来判断
var translates = ['.md', '.txt'] // 需要转换的文件，扩展名
```
2. 运行
```
## 开始
yarn # or npm install
## 运行
node index.js
```

## 参考：
* http://www.qqxiuzi.cn/jfzh.htm
* http://www.aies.cn
