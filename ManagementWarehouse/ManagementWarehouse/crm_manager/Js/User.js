$(document).ready(function () {
    GetListUser();
    AddNewUser();
    var user_id;

    $("#btnUpdate").click(function () {
        var obj = new Object();
        obj.UserName = $("input[id$='txtUserLogin']").val();
        obj.FullName = $("input[id$='txtFullName']").val();
        obj.Email = $("input[id$='txtEmail']").val();
        obj.Id = userId;
        if (obj.UserName === "") { toastr.info("Nhập tên đăng nhập", "Thông báo"); return; }
        if (obj.FullName === "") { toastr.info("Nhập họ tên", "Thông báo"); return; }
        $.ajax({
            type: "POST",
            url: "/api/Users/UpdateUser",
            dataType: "json",
            data: obj,
            success: function (msg) {
                console.log(msg);
                if (msg.value.status === "exits") {
                    toastr.warning("Tên đăng nhập đã tồn tại", "Thông báo"); return;
                } else if (msg.value.status === "ok") {
                    toastr.success("Cập nhật thành công", "Thông báo");
                    GetListUser();
                } else {
                    toastr.warning("Tiến trình bị lỗi", "Cảnh báo");
                }
                Refresh();
            }
        });
    });

    //Lấy file mẫu
    $('#btTemp').click(function () {
        window.location.href = '/Content/filesUpload/TemplateImportUser.xlsx';
    });
    $("#btnImport").click(function () {
        $(".import-data-panel").show();
    });
    $("#btnCancle").click(function () {
        $(".import-data-panel").hide();
        $('#fileupload').val('');
    });
    $('tbody').on('click', 'span.editUser', function (e) {
        $(".add").hide();
        $(".update").show();
        $(".pass").hide();
        var $this = $(this);
        userId = $this.attr('UserId');
        $.ajax({
            type: "POST",
            url: "/api/Users/GetUserId?UserId=" + userId + "",
            dataType: "json"
            , success: function (msg) {
                var html = "";
                console.log(msg);
                var item = msg.value[0];
                item = cleanObject(item);
                $("input[id$='txtUserLogin']").val(item.UserName);
                $("input[id$='txtPass']").val(item.PasswordHash);
                $("input[id$='txtRePass']").val(item.PasswordHash);
                $("input[id$='txtEmail']").val(item.Email);
                $("input[id$='txtAgentNumber']").val(item.UserName);
                $("input[id$='txtCCHost']").val(item.CC_Host);
                $("input[id$='txtFullName']").val(item.FullName);
                $("input[id$='txtCCQueue']").val(item.CC_Queue);
                $("input[id$='txtCCTrunk']").val(item.CC_Trunk);
                $("input[id$='txtCCAgent']").val(item.CC_Agent);
                $("input[id$='txtCCPass']").val(item.CC_Pass);
            }
            , complete: function (data) {
            }
        });

    });

    $('#btUpLoad').click(function (e) {
        e.preventDefault();
        if ($('#fileupload').val() === '') return;
        var filesupload = new FormData();
        filesupload.append('file', $('#fileupload')[0].files[0]);
        $.ajax({
            method: 'POST',
            url: "/api/Users/ImportUser",
            contentType: false,
            processData: false,
            data: filesupload,
            success: function (msg) {
                if (msg.status === "ok") {
                    toastr.success("Import thành công " + msg.value.valueSucc + " data. \n Lỗi " + msg.value.valueErr + " data ", "Thông báo");
                }
                else toastr.warning("Import bị lỗi. Ktra lại file upload", "Thông báo");
            },
            error: function (response) {
                toastr.warning("Tiến trình bị lỗi", "Thông báo");
            },
            complete: function (response) {

                // mylop.stop();
                $('#fileupload').val('');
            }

        });

    });
    //Lưu quyền
    $("#SaveRole").click(function () {
        $.ajax({
            type: "POST",
            url: "/api/Users/DeleteRoleByUser?UserId=" + user_id + "",
            dataType: "json"
            , success: function (msg) {
                console.log("hello111");
                $("#lstRole > div>span>input").each(function (index, row) {
                    var roleId = $(row).attr('roleId');
                    var userId = $(row).attr('userId');
                    var nameRole = $(row).attr('namerole');
                    var IsActive = $("#chk" + nameRole).is(':checked') ? "true" : "false";
                    if (IsActive === "true") {
                        $.ajax({
                            type: "POST",
                            url: "/api/Users/UpdateRoleByUser?UserId=" + userId + "&RoleId=" + roleId + "",
                            dataType: "json",
                            success: function (msg) {
                                console.log(msg);
                            },
                            complete: function (data) {
                            }
                        });
                    }
                });
                toastr.success("Cập nhật thành công", "Thông báo");
                $('#modalSetRole').modal('hide');
            }
            , complete: function (data) {
            }
        });

    });
    //Thiết lập quyền
    $('tbody').on('click', 'a.setRole', function (e) {
        var $this = $(this);
        var id = $this.attr('uid');
        user_id = id;
        $('#modalSetRole').modal('show');
        $("#lstRole").html('');
        $.ajax({
            type: "POST",
            url: "/api/Users/GetRoleByUser?userId=" + id + "",
            dataType: "json",
            success: function (msg) {
                var html = "";
                var item = msg.value;
                for (var i = 0; i < item.length; i++) {
                    html = " <div class='checkbox'><span class='checkbox checkbox-success' style='margin-top: 0px; margin-bottom: 0px'><input  id='chk" + item[i].Name + "' class='styled' type='checkbox'  userId='" + id + "' nameRole='" + item[i].Name + "' roleId='" + item[i].Id + "''><label for='chkIsShow'>" + item[i].Name + "</label></span></div>";
                    $("#lstRole").append(html);
                    var active = item[i].IsActive === "true" ? true : false;
                    $('#chk' + item[i].Name + '').prop('checked', active);
                }
            },
            complete: function (data) {
            }
        });

    });
    //Khóa tài khoản
    $('tbody').on('click', 'i.isLockUser', function (e) {
        e.preventDefault();
        var $this = $(this);
        var id = $this.attr('uid');
        var check = $this.attr('check');
        var mess = "Xác nhận khóa tài khoản?";
        if (check === "true") mess = "Xác nhận mở tài khoản?";
        var r = confirm(mess);
        if (!r) return;
        $.ajax({
            type: "POST",
            url: "/api/Users/IsLockUser?UserId=" + id + "&check=" + check + "",
            success: function (msg) {
                toastr.success("Cập nhật thành công", "Thông báo");
                GetListUser();
            }
        });
    });
});
function AddNewUser() {

    $("#btnAdd").click(function () {
        $.confirm({
            // boxWidth: '100px',
            title: 'Thêm tài khoản mới',
            type: 'blue',
            content: '' + '<form action="" class="formName">' +
                '<div  class="form-group">' +
                '<label>Họ và tên</label>' +
                '<input type="text" id="txtName" placeholder="Nhập họ tên" class="name form-control" required />' +
                '<label>Email</label>' +
                '<input type="text" id="txtEmail" placeholder="Email" class="name form-control" required />' +
                '<label>Tên đăng nhập </label>' +
                '<input type="text" id="txtUserName" placeholder="Tên đăng nhập" class="name form-control" required />' +
                '<label>Mật Khẩu</label>' +
                '<input type="password" id="txtPass" placeholder="Mật Khẩu" class="name form-control" required />' +
                '<label>Nhập lại mật Khẩu</label>' +
                '<input type="password" id="txtRePass" placeholder="Nhập lại mật khẩu" class="name form-control" required />' +
                '</div>' +
                '</form>',
            buttons: {
                formSubmit: {
                    text: 'Thêm',
                    btnClass: 'btn-blue',
                    action: function () {
                        var obj = new Object();
                        obj.FullName = this.$content.find('#txtName').val();
                        obj.UserName = this.$content.find('#txtUserName').val();
                        var pass = this.$content.find('#txtPass').val();
                        var repass = this.$content.find('#txtRePass').val();
                        obj.Email = this.$content.find('#txtEmail').val();
                        if (!obj.FullName) { toastr.info("Bạn chưa nhập Họ tên", "Thông báo"); return false; }
                        if (!obj.UserName) {
                            toastr.info("Nhập tên đăng nhập", "Thông báo"); return false;
                        }
                        else if(!validateUsername(obj.UserName)) {
                            toastr.info("Tên đăng nhập chỉ được có chữ,số và đấu gạch dưới", "Thông báo"); return false;
                        }
                       
                        if (!obj.Email) { toastr.info("Bạn chưa nhập Email", "Thông báo"); return false; }
                        else {
                            if (!validateEmail(obj.Email)) { toastr.info("Email của bạn không chính xác", "Thông báo"); return false; }
                        }
                           
                        if (!pass) { toastr.info("Bạn chưa nhập mật khẩu", "Thông báo"); }
                        else
                            if (!repass) { toastr.info("Bạn chưa nhập lại mật khẩu", "Thông báo"); return false; }
                        else
                                if (pass !== repass) {
                                    toastr.info("Mật khẩu không trùng khớp", "Thông báo");
                                    this.$content.find('#txtPass').val('');
                                    this.$content.find('#txtRePass').val('');

                                    return false;
                                }
                                else {

                                    obj.PasswordHash = pass;
                                    if (!ValidatePass(obj.PasswordHash)) {
                                        toastr.info("MK phải có ít nhất 6 kí tự gồm ít nhất 1 chữ in,chữ thường và số", "Thông báo");

                                        this.$content.find('#txtPass').val('');
                                        this.$content.find('#txtRePass').val('');
                                        return false
                                    }
                                    else {
                                $.ajax({

                                type: "POST",
                                url: "/api/Users/AddUsers",
                                data: obj,
                                success: function () {
                                    toastr.success("Thêm mới thành công", "Thông báo");
                                    GetListUser();
                                    Refresh();
                                }
                            });
                            }
                            
                        }
                    }
                },
                cancel: {
                    text: 'Thoát',
                }
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventdefault();
                    jc.$$formsubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });

}
function ft_drawTable() {
    jQuery(".editDataUser").each(function () {
        var tmp = jQuery(this).html();
        tmp = jQuery.trim(tmp);
        if (tmp === '') {
            jQuery(this).html(".:Thêm:.");
        }
    });

    jQuery(".editDataUser").each(function () {
        var obj = jQuery(this);
        obj.editable({
            onSubmit: function (content) {
                content.current = content.current.trim();
                content.previous = content.previous.trim();
                if (content.current !== content.previous) {
                    var text = "Xác nhận cập nhật: <b>" + content.previous + "</b> <i class='fa fa-arrow-right'></i> <b>" + content.current + "</b> ?";
                    $.confirm({
                        type: 'red',
                        title: '<i class="fa fa-question-circle"></i> Yêu cầu xác nhận.',
                        content: text,
                        buttons: {
                            Hủy: function () {
                                obj.html(content.previous);
                            },
                            confirm: {
                                text: 'Đồng ý',
                                btnClass: 'btn-blue',
                                keys: ['enter', 'shift'],
                                action: function () {
                                    obj.html("<i class='fa fa-spin fa-refresh text-green'></i>");
                                    jQuery.ajax({
                                        type: "POST",
                                        url: "/api/Users/EditUser?data=" + content.current + "&userId=" + obj.attr('uid') + "&type=" + obj.attr('type') + "",

                                        contentType: "application/json; charset=utf-8",
                                        dataType: "json",

                                        success: function (msg) {
                                            if (msg.d === 'err-login') {
                                                alert('Vui lòng đăng nhập lại.');
                                                location.reload();
                                            } else {
                                                toastr.success("Cập nhật thành công", "Thông báo");
                                                GetListUser();
                                                return true;
                                            }
                                        },
                                        error: function () {
                                            obj.html(content.previous);
                                            return false;
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }, type: 'text',
            onEdit: function (dataInput) {
                $($(this).children()[0]).css('form-control input-sm');
            }
        });
    });
}

function Refresh() {
    $(".import-data-panel").hide();
    $(".add").show();
    $(".pass").show();
    $(".update").hide();
    $("input[id$='txtUserLogin']").val('');
    $("input[id$='txtPass']").val('');
    $("input[id$='txtRePass']").val('');
    $("input[id$='txtEmail']").val('');
    $("input[id$='txtFullName']").val('');
}

/**
 * Lấy danh sách tài khoản
 * */
var tblUser;
var userId;
function GetListUser() {
    Refresh();
    var obj = new Object();
    if (tblUser) {
        tblUser.destroy();
        $('#tbdUser').empty();
    }
    obj.UserName = $("input[id$='txtUserLogin']").val();
    obj.Email = $("input[id$='txtEmail']").val();
    obj.FullName = $("input[id$='txtFullName']").val();
    $("#tbdUser").html('');
    $.ajax({
        type: "POST",
        url: "/api/Users/GetListUser",
        dataType: "json",
        data: obj,
        success: function (msg) {
            var html = "";
            var item = msg.value;

            for (var i = 0; i < item.length; i++) {
                item[i] = cleanObject(item[i]);
                html += "<tr><td>" + (i + 1) + "</td>";
                html += "<td><div class='editDataUser' type='FullName' uid='" + item[i].UserId + "'>" + item[i].FullName + "</div></td>";
                html += "<td>" + item[i].UserName + "</td>";
                html += "<td><div class='editDataUser' type='Email' uid='" + item[i].UserId + "'>" + item[i].Email + "</div></td>";
                html += "<td><a title='Thiết Lập Quyền' class='setRole mp-pointer-st' uid='" + item[i].UserId + "'><i class='fa fa-gears text-blue fa-lg'></i></a>&nbsp;&nbsp;";
                if (item[i].LockoutEnabled) html += "<a href='#' title='Bật/tắt user' class='mp-pointer-st'><i class='fa fa-toggle-off fa-lg isLockUser' alt='Bật/Tắt User' check='true' uid='" + item[i].UserId + "'></i></a>&nbsp;&nbsp;</td></tr>";
                else html += "<a class='mp-pointer-st' href='#' title='Bật/tắt user'><i class='fa fa-toggle-on fa-lg isLockUser mp-pointer-st' alt='Bật/Tắt User' check='false' uid='" + item[i].UserId + "'></i></a>&nbsp;&nbsp;</td></tr>";
            }

            $("#tbdUser").append(html);
            tblUser = $('table#tblUser').DataTable({
                "bFilter": true,
                "bLengthChange": false,
                "searching": true,
                "bInfo": false,
                "bAutoWidth": false,
                "iDisplayLength": 10
            });
            ft_drawTable();
        }
    });
}
//Validate Pass
function ValidatePass(pass) {
    // at least one number, one lowercase and one uppercase letter
    // at least six characters
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(pass);
}
//validate Email
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
//validate Username
function validateUsername(username) {
    re = /^\w+$/;
    return re.test(username);
}