# layer
自己写的一个简单的弹框插件，可以自动以模拟alert、confirm等常见弹框
#主要借口有两个
open：
  mylayer = TGUI.layer.open(settings);
close:
  TGUI.layer.close(mylayer);
#settings配置说明
  settings = {
    "position":[left,top], //位置：值为数字
    "title":"信息", //弹框标题
    "dragable":true, //是否可以拖拽
    "button":{
        "showBtn":true, //是否显示按钮
        "btns":[{
            "valueStr":"确定", //按钮文字
            "callback": func,  //点击按钮触发事件
            "className":className //按钮class
        }]
    },
    "area":[xpos, ypos], //弹出框宽高：值为数字
    "content":htmlstr // 内容 html字符串
}
