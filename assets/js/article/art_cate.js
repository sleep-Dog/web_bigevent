$(function() {
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;
    //获取文章列表
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr);
            }
        });
    }
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });
    //通过代理形式绑定事件,适应动态添加的元素
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('新增分类失败！')
                }
                initArtCateList();
                layer.msg('新增成功');
                layer.close(indexAdd);
            }
        });
    });
    var indexEdit = null;
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        //console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        })
    });
    //通过代理的形式，未修改分类的表单绑定submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('更新分类数据失败！')
                }

                layer.msg('更新数据成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        });
    });
    //删除
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        //提示用户是否要删除
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        layer.msg('删除数据失败');
                    }
                    layer.msg('删除数据成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })

        });
    })
})