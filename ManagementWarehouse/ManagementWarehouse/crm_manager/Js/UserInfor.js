$(function () {
    InitDesign();
    /**
     * Kiểm tra nhập vào email
     * */
    validateInputEmail();
    /**
     * Lấy thông tin user
     * */
    GetUserInfor();
    /**
     * Cập nhật thông tin cá nhân
     * */
    bindEventUpdateInfor();
    /**
     * Thay đổi mật khẩu
     * */
    bindEventChangePassword();
});

function InitDesign() {
    $('section.content-header').html('<h1><i class="fa fa-folder-open-o"></i>  Thông tin cá nhân<small></small></h1>');
}


/**
 * Lấy thông tin user
 * */
function GetUserInfor() {
    $.ajax({
        method: 'GET',
        url: '/api/MNG/UserInfor/Get',
        dataType: 'json',
        success: function (msg) {
            if (msg.value) {
                $('#txtFullname').val(msg.value.Fullname);
                $('#txtEmail').val(msg.value.Email);
                $('#txtPhone').val(msg.value.Phonenumber);
                $('#lbRoles').html(msg.value.Roles);
            }
        }
    });
}

/**
 * Kiểm tra nhập vào email
 * */
function validateInputEmail() {
    $('#txtEmail').change(function (e) {
        e.preventDefault();
        var $this = $(this);
        var value = $this.val();
        if (!isEmail(value)) {
            toastr.warning('Sai định dạng email.', 'Cảnh báo');
            $this.val('');
        }
    });

}

/**
 * Kiểm tra định dạng email
 * @param {any} email item
 * @returns {any} value true/false
 */
function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

/**
 * Cập nhật thông tin cá nhân
 * */
function bindEventUpdateInfor() {
    $('#btnReceive').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var objInfo = new Object();
        objInfo.Fullname = $('#txtFullname').val().trim();
        objInfo.Email = $('#txtEmail').val().trim();
        objInfo.Phonenumber = $('#txtPhone').val().trim();
        if (objInfo.Fullname === '' || objInfo.Email === '' || objInfo.Phonenumber === '') {
            toastr.warning('Yêu cầu nhập đủ thông tin.', 'Cảnh báo');
            return;
        }

        if (!isEmail(objInfo.Email)) {
            toastr.warning('Sai định dạng email.', 'Cảnh báo');
            return;
        }

        $.confirm({
            title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
            content: 'Đồng ý cập nhật thông tin?',
            type: 'red',
            buttons: {
                confirm:
                {
                    text: "Xác nhận",
                    btnClass: "btn-blue",
                    keys: ['enter'],
                    action: function () {
                        var itemDisableds = [$this];
                        var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                        mylop.start();
                        $.ajax({
                            method: 'POST',
                            url: '/api/MNG/UserInfor/UpdateInfor',
                            dataType: 'json',
                            data: objInfo,
                            success: function (msg) {
                                toastr.success('Lưu thông tin thành công.', 'Thông báo');
                            },
                            complete: function (msg) {
                                mylop.stop();
                            }
                        });
                    }
                },
                cancel: {
                    text: "Hủy bỏ",
                    btnClass: "btn-default",
                    keys: ['esc'],
                    action: function () {
                    }
                }
            }
        });
    });
}

/**
 * Thay đổi mật khẩu
 * */
function bindEventChangePassword() {
    $('#btnChange').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var objInfo = new Object();
        objInfo.OldPass = $('#txtOldPass').val().trim();
        objInfo.NewPass = $('#txtNewPass').val().trim();
        objInfo.ReNewPass = $('#txtReNewPass').val().trim();
        if (objInfo.OldPass === '' || objInfo.NewPass === '' || objInfo.ReNewPass === '') {
            toastr.warning('Yêu cầu nhập đủ thông tin.', 'Cảnh báo');
            return;
        }

        $.confirm({
            title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
            content: 'Đồng ý thay đổi mật khẩu?',
            type: 'red',
            buttons: {
                confirm:
                {
                    text: "Xác nhận",
                    btnClass: "btn-blue",
                    keys: ['enter'],
                    action: function () {
                        var itemDisableds = [$this];
                        var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                        mylop.start();
                        $.ajax({
                            method: 'POST',
                            url: '/api/MNG/UserInfor/ChangePassword',
                            dataType: 'json',
                            data: objInfo,
                            success: function (msg) {
                                toastr.success('Đổi mật khẩu thành công.', 'Thông báo');
                            },
                            complete: function (msg) {
                                mylop.stop();
                            }
                        });
                    }
                },
                cancel: {
                    text: "Hủy bỏ",
                    btnClass: "btn-default",
                    keys: ['esc'],
                    action: function () {
                    }
                }
            }
        });
    });
}