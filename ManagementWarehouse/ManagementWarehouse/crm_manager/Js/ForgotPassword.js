$(function () {
    $('input.username').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            var userName = $('input.username').val();
            if (!userName || userName.trim() === '') return;
            /**
             * Lấy code quên mật khẩu
             */
            GetCode(userName);
        }
    });
    $('button.username').click(function (e) {
        e.preventDefault();
        var userName = $('input.username').val();
        if (!userName || userName.trim() === '') return;
        GetCode(userName);
    });

    $('input.code, input.pw, input.npw').change(function (e) {
        e.preventDefault();
        $('.sp-code-helper').hide();
    });

    $('input.code, input.pw, input.npw').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $('.sp-code-helper').hide();
            var uuid = $('button.code').attr('uuid');
            var code = $('input.code').val();
            var pw = $('input.pw').val();
            var npw = $('input.npw').val();
            if (!validateInput(uuid, code, pw, npw)) return;
            Recovery(uuid, code, npw);
        }
    });
    $('button.code').click(function (e) {
        e.preventDefault();
        $('.sp-code-helper').hide();
        var uuid = $('button.code').attr('uuid');
        var code = $('input.code').val();
        var pw = $('input.pw').val();
        var npw = $('input.npw').val();
        if (!validateInput(uuid, code, pw, npw)) return;
        Recovery(uuid, code, npw);
    });

});

/**
 * Ẩn/Hiện biểu tượng xử lý code
 * @param {any} item item
 */
function showHideHandlingCode(item) {
    if (item) $('button.code').html('<i class="fa fa-spin fa-spinner text-muted"></i>');
    else $('button.code').html('<i class="fa fa-arrow-right text-muted"></i>');
}

/**
 * Ẩn/Hiện biểu tượng xử lý username
 * @param {any} item item
 */
function showHideHandlingUser(item) {
    if (item) $('button.username').html('<i class="fa fa-spin fa-spinner text-muted"></i>');
    else $('button.username').html('<i class="fa fa-arrow-right text-muted"></i>');
}

/**
 * kiểm tra thông tin nhật vào
 * @param {any} uuid item
 * @param {any} code item
 * @param {any} pw item
 * @param {any} npw item
 * @returns {any} item item
 */
function validateInput(uuid, code, pw, npw) {
    if (!uuid || uuid.trim() === '' || !code || code.trim() === '' ||
        !pw || pw.trim() === '' || !npw || npw.trim() === '') {
        $('.sp-code-helper').html('Yêu cầu nhật đủ thông tin.').show();
        return false;
    }

    if (pw !== npw) {
        $('.sp-code-helper').html('Mật khẩu không khớp.').show();
        return false;
    }
    return true;
}

/**
 * Lấy code quên mật khẩu
 * @param {any} item username
 */
function GetCode(item) {
    showHideHandlingUser(true);
    $.ajax({
        type: 'GET',
        url: '/api/ForgotPassword/GetCode?UserName=' + item
    }).done(function (msg) {
        $('button.code').attr('uuid', msg.responseValue.UserID);
        $('.lockscreen-name').html('<code>' + item) + '</code>';
        $('.number-one').remove();
        $('.code-panel').show('slow');
        showHideHandlingUser(false);
    }).fail(function () {
        showHideHandlingUser(false);
    });
}

/**
 * Thay đổi mật khẩu theo code
 * @param {any} uuid item
 * @param {any} code item
 * @param {any} pw item
 */
function Recovery(uuid, code, pw) {
    showHideHandlingCode(true);
    $.ajax({
        type: 'GET',
        url: '/api/ForgotPassword/Recovery?UserID=' + uuid + '&Code=' + code + '&NewPassword=' + pw
    }).done(function (msg) {
        if (msg.value && msg.value.length > 0) {
            showHideHandlingCode(false);
            $('code.sp-code-helper').html(msg.value[0]).show();
        } else {
            $.confirm({
                type: 'green',
                title: '<i class="fa fa-info-circle fa-lg text-green"></i> Thông báo',
                content: '<code>Thay đổi mật khẩu thành công.</code>',
                buttons: {
                    OK: {
                        text: 'Đăng nhập',
                        btnClass: 'btn-blue',
                        keys: ['enter', 'shift'],
                        action: function () {
                            location.href = "/";
                        }
                    }
                }
            });
        }
    }).fail(function (msg) {
        showHideHandlingCode(false);
    });
}

