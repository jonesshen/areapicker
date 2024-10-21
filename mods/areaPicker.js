/*!
 * 地区联动选择 1.0.3
 * MIT license
 * https://gitee.com/jonesshen/areapicker
 * https://github.com/jonesshen/areapicker
 */

layui.define(['form', 'laytpl'], function(exports) {
    "use strict";

    var $ = layui.jquery,
        form = layui.form,
        laytpl = layui.laytpl,
        // 模板
        TPL_LABEL = '<div class="layui-form-label">{{-d.label}}</div>',
        TPL_SELECT = '<div class="layui-input-inline {{-d.selector}}" style="{{-d.style}}"><select name="{{-d.name}}"></select></div>',
        // 字符常量
        ELEM_PROV = '.layui-areapicker-prov',
        ELEM_CITY = '.layui-areapicker-city',
        ELEM_DIST = '.layui-areapicker-dist',
        ELEM_STRE = '.layui-areapicker-stre',
        MOD_NAME = 'areaPicker',
        // 外部接口
        areaPicker = {
            index: 0,
            data: {
                provId: 1,
                cityId: 37,
                distId: 567,
                streId: 0,
                provList: [],
                cityList: [],
                distList: [],
                streList: []
            },
            set: function(options) {
                var that = this;
                that.data = $.extend({}, that.data, options);
                return that;
            },
            render: function(options) {
                return new Class(options);
            }
        };

    // 构造器
    function Class(options) {
        var that = this;
        options = options || {};
        options.data = $.extend({}, areaPicker.data, options.data);
        that.index = ++areaPicker.index;
        that.config = $.extend({}, that.config, options);
        that.render();
    }

    // 索引
    Class.prototype.index = 0;

    // 默认配置
    Class.prototype.config = {
        elem: '#area-picker',
        data: {},
        level: 3,
        label: '地址',
        width: 200,
        form: {
            provName: 'province',
            cityName: 'city',
            distName: 'district',
            streName: 'street',
        },
        callback: function(result) {}
    };

    // 渲染
    Class.prototype.render = function() {
        var that = this;
        that.config.elem = $(that.config.elem);
        that.config.level = intval(that.config.level);
        if (that.config.elem.length) {
            switch (that.config.level) {
                case 1:
                    renderA.call(that);
                    break;
                case 2:
                    renderB.call(that);
                    break;
                case 3:
                    renderC.call(that);
                    break;
                case 4:
                    renderD.call(that);
                    break;
            }
        }
    };

    function renderA() {
        var that = this,
            options = that.config,
            style = 'display:none;width:' + options.width + 'px;';
        // 初始化DOM
        var html = laytpl(TPL_LABEL).render({label: options.label}) +
            laytpl(TPL_SELECT).render({selector: ELEM_PROV.slice(1), style: style, name: options.form.provName});
        options.elem.html(html);
        // 添加过滤器
        var provElem = options.elem.find(ELEM_PROV + '>select'),
            provFilter = 'layui-areapicker-prov-' + that.index;
        provElem.attr('lay-filter', provFilter);
        // 1级
        provElem.html(getTpl(getData(options.data.provList, 0), options.data.provId)).parent(ELEM_PROV).show();
        // 回调
        if (typeof options.callback == 'function') {
            options.callback({
                provId: intval(options.data.provId)
            });
        }
        // 更新渲染
        form.render('select');
        // 监听
        form.on('select(' + provFilter + ')', function(data) {
            // 1级
            options.data.provId = intval(data.value);
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId)
                });
            }
        });
    }

    function renderB() {
        var that = this,
            options = that.config,
            style = 'display:none;width:' + options.width + 'px;';
        // 初始化DOM
        var html = laytpl(TPL_LABEL).render({label: options.label}) +
            laytpl(TPL_SELECT).render({selector: ELEM_PROV.slice(1), style: style, name: options.form.provName}) +
            laytpl(TPL_SELECT).render({selector: ELEM_CITY.slice(1), style: style, name: options.form.cityName});
        options.elem.html(html);
        // 添加过滤器
        var provElem = options.elem.find(ELEM_PROV + '>select'),
            cityElem = options.elem.find(ELEM_CITY + '>select'),
            provFilter = 'layui-areapicker-prov-' + that.index,
            cityFilter = 'layui-areapicker-city-' + that.index;
        provElem.attr('lay-filter', provFilter);
        cityElem.attr('lay-filter', cityFilter);
        // 1级
        provElem.html(getTpl(getData(options.data.provList, 0), options.data.provId)).parent(ELEM_PROV).show();
        // 2级
        var cityList = getData(options.data.cityList, options.data.provId);
        if (cityList.length > 0) {
            cityElem.html(getTpl(cityList, options.data.cityId)).parent(ELEM_CITY).show();
        } else {
            cityElem.html('').parent(ELEM_CITY).hide();
        }
        // 回调
        if (typeof options.callback == 'function') {
            options.callback({
                provId: intval(options.data.provId),
                cityId: intval(options.data.cityId)
            });
        }
        // 更新渲染
        form.render('select');
        // 监听
        form.on('select(' + provFilter + ')', function(data) {
            // 1级
            options.data.provId = intval(data.value);
            // 2级
            var cityList = getData(options.data.cityList, options.data.provId);
            if (cityList.length > 0) {
                cityElem.html(getTpl(cityList, 0)).parent(ELEM_CITY).show();
            } else {
                cityElem.html('').parent(ELEM_CITY).hide();
            }
            options.data.cityId = intval(cityElem.val());
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId),
                    cityId: intval(options.data.cityId)
                });
            }
            // 更新渲染
            form.render('select');
        });
        form.on('select(' + cityFilter + ')', function(data) {
            // 2级
            options.data.cityId = intval(data.value);
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId),
                    cityId: intval(options.data.cityId)
                });
            }
        });
    }

    function renderC() {
        var that = this,
            options = that.config,
            style = 'display:none;width:' + options.width + 'px;';
        // 初始化DOM
        var html = laytpl(TPL_LABEL).render({label: options.label}) +
            laytpl(TPL_SELECT).render({selector: ELEM_PROV.slice(1), style: style, name: options.form.provName}) +
            laytpl(TPL_SELECT).render({selector: ELEM_CITY.slice(1), style: style, name: options.form.cityName}) +
            laytpl(TPL_SELECT).render({selector: ELEM_DIST.slice(1), style: style, name: options.form.distName});
        options.elem.html(html);
        // 添加过滤器
        var provElem = options.elem.find(ELEM_PROV + '>select'),
            cityElem = options.elem.find(ELEM_CITY + '>select'),
            distElem = options.elem.find(ELEM_DIST + '>select'),
            provFilter = 'layui-areapicker-prov-' + that.index,
            cityFilter = 'layui-areapicker-city-' + that.index,
            distFilter = 'layui-areapicker-dist-' + that.index;
        provElem.attr('lay-filter', provFilter);
        cityElem.attr('lay-filter', cityFilter);
        distElem.attr('lay-filter', distFilter);
        // 1级
        provElem.html(getTpl(getData(options.data.provList, 0), options.data.provId)).parent(ELEM_PROV).show();
        // 2级
        var cityList = getData(options.data.cityList, options.data.provId);
        if (cityList.length > 0) {
            cityElem.html(getTpl(cityList, options.data.cityId)).parent(ELEM_CITY).show();
        } else {
            cityElem.html('').parent(ELEM_CITY).hide();
        }
        // 3级
        var distList = getData(options.data.distList, options.data.cityId);
        if (distList.length > 0) {
            distElem.html(getTpl(distList, options.data.distId)).parent(ELEM_DIST).show();
        } else {
            distElem.html('').parent(ELEM_DIST).hide();
        }
        // 回调
        if (typeof options.callback == 'function') {
            options.callback({
                provId: intval(options.data.provId),
                cityId: intval(options.data.cityId),
                distId: intval(options.data.distId)
            });
        }
        // 更新渲染
        form.render('select');
        // 监听
        form.on('select(' + provFilter + ')', function(data) {
            // 1级
            options.data.provId = intval(data.value);
            // 2级
            var cityList = getData(options.data.cityList, options.data.provId);
            if (cityList.length > 0) {
                cityElem.html(getTpl(cityList, 0)).parent(ELEM_CITY).show();
            } else {
                cityElem.html('').parent(ELEM_CITY).hide();
            }
            options.data.cityId = intval(cityElem.val());
            // 3级
            var distList = getData(options.data.distList, options.data.cityId);
            if (distList.length > 0) {
                distElem.html(getTpl(distList, 0)).parent(ELEM_DIST).show();
            } else {
                distElem.html('').parent(ELEM_DIST).hide();
            }
            options.data.distId = intval(distElem.val());
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId),
                    cityId: intval(options.data.cityId),
                    distId: intval(options.data.distId)
                });
            }
            // 更新渲染
            form.render('select');
        });
        form.on('select(' + cityFilter + ')', function(data) {
            // 2级
            options.data.cityId = intval(data.value);
            // 3级
            var distList = getData(options.data.distList, options.data.cityId);
            if (distList.length > 0) {
                distElem.html(getTpl(distList, 0)).parent(ELEM_DIST).show();
            } else {
                distElem.html('').parent(ELEM_DIST).hide();
            }
            options.data.distId = intval(distElem.val());
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId),
                    cityId: intval(options.data.cityId),
                    distId: intval(options.data.distId)
                });
            }
            // 更新渲染
            form.render('select');
        });
        form.on('select(' + distFilter + ')', function(data) {
            // 3级
            options.data.distId = intval(data.value);
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId),
                    cityId: intval(options.data.cityId),
                    distId: intval(options.data.distId)
                });
            }
        });
    }

    function renderD() {
        var that = this,
            options = that.config,
            style = 'display:none;width:' + options.width + 'px;';
        // 初始化DOM
        var html = laytpl(TPL_LABEL).render({label: options.label}) +
            laytpl(TPL_SELECT).render({selector: ELEM_PROV.slice(1), style: style, name: options.form.provName}) +
            laytpl(TPL_SELECT).render({selector: ELEM_CITY.slice(1), style: style, name: options.form.cityName}) +
            laytpl(TPL_SELECT).render({selector: ELEM_DIST.slice(1), style: style, name: options.form.distName}) +
            laytpl(TPL_SELECT).render({selector: ELEM_STRE.slice(1), style: style, name: options.form.streName});
        options.elem.html(html);
        // 添加过滤器
        var provElem = options.elem.find(ELEM_PROV + '>select'),
            cityElem = options.elem.find(ELEM_CITY + '>select'),
            distElem = options.elem.find(ELEM_DIST + '>select'),
            streElem = options.elem.find(ELEM_STRE + '>select'),
            provFilter = 'layui-areapicker-prov-' + that.index,
            cityFilter = 'layui-areapicker-city-' + that.index,
            distFilter = 'layui-areapicker-dist-' + that.index,
            streFilter = 'layui-areapicker-stre-' + that.index;
        provElem.attr('lay-filter', provFilter);
        cityElem.attr('lay-filter', cityFilter);
        distElem.attr('lay-filter', distFilter);
        streElem.attr('lay-filter', streFilter);
        // 1级
        provElem.html(getTpl(getData(options.data.provList, 0), options.data.provId)).parent(ELEM_PROV).show();
        // 2级
        var cityList = getData(options.data.cityList, options.data.provId);
        if (cityList.length > 0) {
            cityElem.html(getTpl(cityList, options.data.cityId)).parent(ELEM_CITY).show();
        } else {
            cityElem.html('').parent(ELEM_CITY).hide();
        }
        // 3级
        var distList = getData(options.data.distList, options.data.cityId);
        if (distList.length > 0) {
            distElem.html(getTpl(distList, options.data.distId)).parent(ELEM_DIST).show();
        } else {
            distElem.html('').parent(ELEM_DIST).hide();
        }
        // 4级
        var streList = getData(options.data.streList, options.data.distId);
        if (streList.length > 0) {
            streElem.html(getTpl(streList, options.data.streId)).parent(ELEM_STRE).show();
        } else {
            streElem.html('').parent(ELEM_STRE).hide();
        }
        // 回调
        if (typeof options.callback == 'function') {
            options.callback({
                provId: intval(options.data.provId),
                cityId: intval(options.data.cityId),
                distId: intval(options.data.distId),
                streId: intval(options.data.streId)
            });
        }
        // 更新渲染
        form.render('select');
        // 监听
        form.on('select(' + provFilter + ')', function(data) {
            // 1级
            options.data.provId = intval(data.value);
            // 2级
            var cityList = getData(options.data.cityList, options.data.provId);
            if (cityList.length > 0) {
                cityElem.html(getTpl(cityList, 0)).parent(ELEM_CITY).show();
            } else {
                cityElem.html('').parent(ELEM_CITY).hide();
            }
            options.data.cityId = intval(cityElem.val());
            // 3级
            var distList = getData(options.data.distList, options.data.cityId);
            if (distList.length > 0) {
                distElem.html(getTpl(distList, 0)).parent(ELEM_DIST).show();
            } else {
                distElem.html('').parent(ELEM_DIST).hide();
            }
            options.data.distId = intval(distElem.val());
            // 4级
            var streList = getData(options.data.streList, options.data.distId);
            if (streList.length > 0) {
                streElem.html(getTpl(streList, 0)).parent(ELEM_STRE).show();
            } else {
                streElem.html('').parent(ELEM_STRE).hide();
            }
            options.data.streId = intval(streElem.val());
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId),
                    cityId: intval(options.data.cityId),
                    distId: intval(options.data.distId),
                    streId: intval(options.data.streId)
                });
            }
            // 更新渲染
            form.render('select');
        });
        form.on('select(' + cityFilter + ')', function(data) {
            // 2级
            options.data.cityId = intval(data.value);
            // 3级
            var distList = getData(options.data.distList, options.data.cityId);
            if (distList.length > 0) {
                distElem.html(getTpl(distList, 0)).parent(ELEM_DIST).show();
            } else {
                distElem.html('').parent(ELEM_DIST).hide();
            }
            options.data.distId = intval(distElem.val());
            // 4级
            var streList = getData(options.data.streList, options.data.distId);
            if (streList.length > 0) {
                streElem.html(getTpl(streList, 0)).parent(ELEM_STRE).show();
            } else {
                streElem.html('').parent(ELEM_STRE).hide();
            }
            options.data.streId = intval(streElem.val());
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId),
                    cityId: intval(options.data.cityId),
                    distId: intval(options.data.distId),
                    streId: intval(options.data.streId)
                });
            }
            // 更新渲染
            form.render('select');
        });
        form.on('select(' + distFilter + ')', function(data) {
            // 3级
            options.data.distId = intval(data.value);
            // 4级
            var streList = getData(options.data.streList, options.data.distId);
            if (streList.length > 0) {
                streElem.html(getTpl(streList, 0)).parent(ELEM_STRE).show();
            } else {
                streElem.html('').parent(ELEM_STRE).hide();
            }
            options.data.streId = intval(streElem.val());
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId),
                    cityId: intval(options.data.cityId),
                    distId: intval(options.data.distId),
                    streId: intval(options.data.streId)
                });
            }
            // 更新渲染
            form.render('select');
        });
        form.on('select(' + streFilter + ')', function(data) {
            // 4级
            options.data.streId = intval(data.value);
            // 回调
            if (typeof options.callback == 'function') {
                options.callback({
                    provId: intval(options.data.provId),
                    cityId: intval(options.data.cityId),
                    distId: intval(options.data.distId),
                    streId: intval(options.data.streId)
                });
            }
        });
    }

    function getData(data, parentId) {
        var result = [];
        parentId = intval(parentId);
        $.each(data, function(index, value) {
            if (intval(value.parentId) === parentId) {
                result.push(value);
            }
        });
        return result;
    }

    function getTpl(data, currentId) {
        var tpl = '';
        currentId = intval(currentId);
        $.each(data, function(index, value) {
            value.id = intval(value.id);
            tpl += '<option value="' + value.id + '"' + (value.id === currentId ? ' selected' : '') + '>' + value.value + '</option>';
        });
        return tpl;
    }

    function intval(s) {
        var n = parseInt(s);
        return isNaN(n) ? 0 : n;
    }

    // 暴露接口
    exports(MOD_NAME, areaPicker);
});
