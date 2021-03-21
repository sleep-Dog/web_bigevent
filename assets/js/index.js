$(function() {
    getUserInfo();
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        //弹出提示消息框
        //eg1
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function(index) {
            //do something
            //清空token
            localStorage.removeItem('token');
            //跳转初始化页面
            location.href = '/login.html';
            layer.close(index);
        });

    })
});

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers: { Authorization: localStorage.getItem('token') },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        complete: function(res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //强制清空token
                localStorage.removeItem('token');
                //强制跳转到登录页面
                location.href = '/login.html';
            }
        }
    })
}
//渲染用户头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}