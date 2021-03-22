$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义美化时间的过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date);

        var y = padZero(t.getFullYear());
        var m = padZero(t.getMonth() + 1);
        var d = padZero(t.getDay());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + 'ss';
    };
    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    //定义个查询的参数对象，将来请求数据的时候
    //需要将参数对象请求提交到服务器
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    };
    initTable();
    initCate();
    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(response) {
                console.log(response);
                if (response.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var htmlStr = template('tpl-table', response);
                //console.log(htmlStr);
                $('tbody').html(htmlStr);
                //调用渲染分页方法
                renderPage(response.total);
            }
        });
    }
    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                var htmlStr = template('tpl-cate', res);
                //console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //位筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });
    //定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的页面值，触发jump回调
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        });
    };
    //通过代理的形式为删除按钮绑定点击事件处理函数
    $('body').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功');
                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余数据
                    //如果没有剩余的数据了，则让页码值-1
                    //再重新调用initTable方法
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    layer.close(index);
                }
            })

        });
    });
})