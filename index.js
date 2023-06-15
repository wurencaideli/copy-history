/** 
 * 操作粘贴板
 */
const clipboardy = require('clipboardy');
const dayjs = require('dayjs');
const colors = require('colors');

console.log(colors.cyan('以下是您粘贴板的历史列表'));
console.log(' ');

/** 复制的数据历史列表 */
const dataList = [];
const timeSpace = 30;
function takeData(){
    let res = '';
    try {
        res = clipboardy.readSync();
    } catch {
        res = '';
    }
    if(!res) return;
    if(dataList[0] && (res === dataList[0].content)) return;
    const data = {
        initData:new Date().getTime(),
        content:res,
    };
    data.dateString = dayjs(data.initData).format("YYYY-MM-DD HH:mm:ss");
    dataList.unshift(data);
    if(dataList.length > 3) {
        dataList.pop();
    }
    console.log(colors.rainbow(`${data.dateString}`),':',`${data.content}`);
}
setInterval(()=>{
    takeData();
},timeSpace);