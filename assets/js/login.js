$(function() {
    // 点击注册按钮，隐藏登录页面，显示注册页面
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();

    });
    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repwd: function(value) {
                var pwd = $('.reg-box [name=password]').val();
                if (pwd !== value) {
                    return '两次密码不一致！'
                }
            }
        })
        //监听注册表单的事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post("/api/reguser", data, function(res) {
            if (res.status != 0) return layer.msg(res.message);
            layer.msg('注册成功，请登录');
            //执行后模拟人为点击
            $('#link_login').click();

        })
    });
    //监听登录事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            //快速获取表单数据方法
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) return layer.msg('登录失败！，用户名或密码错误');
                layer.msg('登录成功');
                //将登录成功得到的 token字符串，保存到localStorage中
                //console.log(res.token);
                localStorage.setItem('token', res.token);
                //跳转页面
                location.href = '/index.html';
            }
        });
    });
})