# 基于Layui实现的地区选择器，最大支持4级联动

#### HTML
```HTML
<div class="layui-form-item" id="area-picker"></div>
```

#### JS
```JS
areaPicker.set({
    provList: data.province,
    cityList: data.city,
    distList: data.district,
    streList: data.street,
}).render({
    elem: '#area-picker',
    data: {
        provId: 11,
        cityId: 179,
        distId: 2177,
        streId: 15951,
    },
    level: 4,
    label: '地址',
    width: 200,
    form: {
        provName: 'province',
        cityName: 'city',
        distName: 'district',
        streName: 'street',
    },
    callback: function(result) {
        console.log(result);
    }
});
```

#### 完整示例
请直接查看index.html源码
