//使用new function创建的是对象
export const read=function(e){
  wx.getFileSystemManager().readFile({
    // filePath:"/asset/cy_csv.csv",
    filePath:"/asset/敏感词库大全.txt",
    encoding:"utf-8",
    success: function (res) {
      console.log(res)
      // const content = res.data.replace(/”/g,"").replace(/\"/g,"_");
      // const temp = content.split(/[\n]/);
      // const stemp=[];
      // temp.forEach(function(e){
      //   const a=e.replace(/ _/,"!").replace(/_ /,"!").split(/!/g);
      //   stemp.push(a);
      // });
      // console.log(stemp);
    },
    fail: function (res) {
      console.log(res.errMsg);
    }
  });
  // console.log(wx.getFileSystemManager());
}
// export default read

// module.exports={
//   read:read
// }