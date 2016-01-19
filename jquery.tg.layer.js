;window.TGUI = {};

(function($, TGUI) {
    "use strict";
    var doc = window.document,
        win = $(window),
        defaults = {
            "title": "信息",
            "area": [580, "auto"],
            "button": {
                "showBtn": true
            },
            "shade": false
        },

        layIndex = 0,

        //常用字符串
        doms = ["tgLayer", "tg-ly-title"];

    var layer = {
        version: "1.0",
        open: function(opntions) {
            var layer = new layerClass(opntions);
            return layer.layIndex;
        },
        close: function(layerId) {
            lpt.closeLayer(layerId);
        }
    }

    var layerClass = function(opntions) {
        var _this = this;
        _this.layIndex = ++layIndex;
        _this.settings = $.extend({}, defaults, opntions);
        _this.init();
    }

    var lpt = layerClass.prototype;

    lpt.init = function() {
        var settings = this.settings || {},
            dragable = settings.dragable || false;

        //创建模板
        this.createVessel();

        //初始化按钮
        this.initLayerBtns();

        //宽高和位置
        this.layerOffset();

        if (dragable) {
            this.$layerFragment.find(".tg-ly-title").css({
                "cursor": "move"
            });
            this.layerDragable();
        }

    }

    lpt.createVessel = function() {

        var that = this,
            settings = this.settings;

        var layerHtmlTmpl = ['<div class="tgly-m-wraper" id="' + doms[0] + this.layIndex + '">',
            settings.shade ? '<div class="tg-ly-mask">遮罩层</div>' : '',
            '   <div class="tg-ly-main">',
            '       <div class="tg-ly-title">',
            '           <i class="tg-ly-close">x</i>',
            '           <div class="tg-lyt-word" id="tglyWord">' + (settings.title ? settings.title : '信息') + '</div>',
            '       </div>',
            '       <div class="tg-ly-content" id="tglyContent">',
                        settings.content ? settings.content : "",
            '       </div>',
            '       <div class="tg-ly-footer" id="tglyFooter">',
            '       </div>',
            '   </div>',
            '</div>'
        ].join("");

        this.$layerFragment = $(layerHtmlTmpl);
        this.$layerFragment.on("click", ".tg-ly-close", function() {
            that.closeLayer();
            return false;
        });

        this.$layerFragment.on("mousedown", ".tg-ly-close", function() {
            return false;
        });
    }

    lpt.initLayerBtns = function() {
        var that = this,
            settings = this.settings,
            button = settings.button || {},
            btns = button && button.btns,
            btnsLen = (btns && btns.length) || 0,
            i = 0,
            btnElement, $btnElement,
            $layer = this.$layerFragment;

        if (button.showBtn) {
            if (btnsLen) {
                for (; i < btnsLen; i++) {
                    btnElement = btns[i];
                    $btnElement = $('<button class="' + btnElement.className + ' tg-ly-btn">' + btnElement.valueStr + '</button>');
                    $btnElement.click(btnElement.callback || function() {});
                }
            } else {
                $btnElement = $('<button class="ok-btn tg-ly-btn">确定</button>');
                $btnElement.click(function() {
                    that.closeLayer();
                });
            }
            $layer.find("#tglyFooter").append($btnElement);
        }
    }

    lpt.layerOffset = function() {
        var settings = this.settings,
            $layer = this.$layerFragment,
            winHeight = win.height(),
            winWidth = win.width(),
            xpos, ypos,
            x_area, y_area,
            area = [],
            position = settings.position || [],
            $tgLyMain = $layer.find(".tg-ly-main");

        area[0] = parseInt(settings.area[0]) || 580;
        area[1] = parseInt(settings.area[1]) || "auto";

        $tgLyMain.css({
            "width": area[0],
            "height": area[1]
        });

        $(doc.body).append($layer);

        x_area = parseInt($tgLyMain.outerWidth()) || 580;
        y_area = parseInt($tgLyMain.outerHeight()) || 400;

        xpos = (position[0] !== undefined ? position[0] : (winWidth - x_area) / 2);
        ypos = (position[1] !== undefined ? position[1] : (winHeight - y_area) / 2);

        xpos = (xpos > 0 ? xpos : 0);
        ypos = (ypos > 0 ? ypos : 0);

        $tgLyMain.css({
            "left": xpos,
            "top": ypos
        });
    }

    lpt.closeLayer = function(layerId) {

        var layerId = doms[0] + (layerId || this.layIndex);

        $("#" + layerId).remove();
    }

    lpt.layerDragable = function() {
        var that = this,
            $layer = this.$layerFragment,
            xpos = 0,
            ypos = 0,
            $dragElem,
            $tgLtMain = $layer.find(".tg-ly-main");

        $layer.on("mousedown", ".tg-ly-title", function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $title = $layer.find(".tg-ly-title"),
                offset = $title.offset(),
                mainOffset = $tgLtMain.offset(),
                mainHeight, mainWidth, mainLeft, mainTop;

            var titleTop = offset.top || 0;
            var titleLeft = offset.left || 0;

            xpos = e.clientX - titleLeft;
            ypos = e.clientY - titleTop;

            mainHeight = $tgLtMain.outerHeight();
            mainWidth = $tgLtMain.outerWidth();
            mainLeft = mainOffset.left;
            mainTop = mainOffset.top;

            $dragElem = $('<div id="layui-layer-moves" class="layui-layer-moves" style="height:' + mainHeight + 'px;width:' + mainWidth + 'px;left:' + mainLeft + 'px;top:' + mainTop + 'px";></div>');
            $(doc.body).append($dragElem);

            $(doc).on("mousemove.layer", layerMove).on("mouseup.layer", layerUp);
        });

        function layerUp(e) {

            $(doc).off("mousemove.layer", layerMove).off("mouseup.layer", layerUp);

            $layer.find(".tg-ly-main").css({
                "left": (e.clientX - xpos),
                "top": (e.clientY - ypos)
            });

            $dragElem.remove();
        }

        function layerMove(e) {
            $dragElem.css({
                "left": (e.clientX - xpos),
                "top": (e.clientY - ypos)
            });
        }

    }

    TGUI.layer = layer;

})(jQuery, TGUI)
