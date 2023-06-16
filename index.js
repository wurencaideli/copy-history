/** 
 * 操作粘贴板
 */
const clipboardy = require('clipboardy');
const dayjs = require('dayjs');
const colors = require('colors');
const makeDir = require('make-dir');
const fs = require('fs');
const path = require('path');

console.log(colors.cyan('以下是您粘贴板的历史列表'));
console.log(' ');

/** 复制的数据历史列表 */
const dataList = [];
const timeSpace = 130;
const maxLength = 300;
function takeData(){
    let res = '';
    try {
        res = clipboardy.readSync();
    } catch {
        res = '';
    }
    if(!res) return;
    // if(dataList[0] && (res === dataList[0].content)) return;
    if(dataList.slice(0,5).find(item=>{
        // 与其中有的则不记录
        return item.content === res;
    })) return;
    const data = {
        initData:new Date().getTime(),
        content:res,
    };
    data.dateString = dayjs(data.initData).format("YYYY-MM-DD HH:mm:ss");
    dataList.unshift(data);
    if(dataList.length > maxLength) {
        dataList.pop();
    }
    console.log(colors.rainbow(`${data.dateString}`));
    console.log(`${data.content}`);
    saveData();
}
/** 
 * 将数据存起来
 * 按照程序启动时的分钟记录
 *  */
const dayIns = dayjs(new Date());
async function saveData(){
    let path_ = path.join(
        __dirname,
        'data-files',
        String(dayIns.year()),
        String(dayIns.month()),
        String(dayIns.date()),
    );
    await makeDir(path_);
    fs.writeFileSync(
        path.join(path_,`${dayIns.hour()}点${dayIns.minute()}分.txt`),
        dataList.map(item=>{
            return `${item.dateString}\n${item.content}`;
        }).join('\n\n'), 
        "utf8",
    );
}
setInterval(()=>{
    takeData();
},timeSpace);
takeData();