
$(function () { SearchAgent(); });

var SearchAgent = function (ifind) {
    $("#tbdAgent").html('');

    var post1 = new Object();
    post1.AgentNumber = 'a';
    post1.UserName = 'post1';
    $.ajax({
        type: 'POST',
        url: '/api/values/SearchAgent',
        dataType: 'json',
        //headers: headers,
        data: post1,
        success: function (msg) {
            var objdata = $.parseJSON(msg.d);
            pagingRole(objdata);
            $('table#tblAgent').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false
            });
        },
        complete: function () {
        }
    });
};

function ResetPassword(item) {
    var UserName = $(item).attr('userName');
    if (confirm('Xác nhận thay đổi mật khẩu?')) {
        $.ajax({
            type: "POST",
            url: "/crm_manager/Services/RoleService.asmx/ResetPassword",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{userName:'" + UserName + "'}",
            success: function (msg) {
                if (msg.d !== "") {
                    alert("Mật khẩu mới là : " + msg.d);
                } else {
                    alert("Mật khẩu không thể thay đổi hoặc chưa có quyền truy cập");
                }
            },
            error: function () {
                alert("Không Reset được mật khẩu!");
                return false;
            },
            complete: function () {
            }
        });
    }

}

function IsApproved(item) {
    var UserId = $(item).attr('UserId');
    var value = $(item).attr('value');
    var cf = confirm('Xác nhận mở khóa tài khoản?');
    if (!cf) return;
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/crm_manager/Services/RoleService.asmx/Unlock',
        data: '{UserId:"' + UserId + '",value:"' + value + '"}',
        dataType: "json",
        success: function (msg) {
            location.reload();
        },
        error: function () {
            alert("Error!"); return;
        }
    });
}

function pagingRole(item) {
    $('#tbdAgent').html('');
    for (var i = 0; i < item.length; i++) {
        if (item[i] != null) {
            var Reset = '<i class="fa fa-key text-yellow fa-lg" userName="' + item[i].UserName + '" onclick="ResetPassword(this);" title="Reset Mật Khẩu" />';
            var enable = '';
            if (item[i].IsApproved == 'True') {
                enable = '<a href="#" title="Bật/tắt user">';
                enable += '<i class="fa fa-user text-green fa-lg" UserId=' + item[i].UserId + ' onclick="IsApproved(this);"';
                enable += 'value=' + item[i].IsApproved + '></i ></a > ';
            } else {
                enable = '<a href="#" title="Bật/tắt user">';
                enable += '<i class="fa fa-user-times text-red fa-lg" UserId=' + item[i].UserId + ' onclick="IsApproved(this);"';
                enable += 'value = ' + item[i].IsApproved + '></i></a>';
            }
            var Permission = '<a href="/crm_oms/Member/Permission.aspx?userName=' + item[i].UserName + '" title="Thiết Lập Quyền">';
            Permission += '<i class="fa fa-gears text-blue fa-lg"></i></a>';
            var deleteAgent = '<img title="Xóa thành viên" src="/Content/dist/images/button/remove_user.png" />';
            var html = "<tr><td>" + (i + 1) + "</td>";
            html += "<td><span class='badge bg-green'><a class='text-white' href='/crm_manager/Pages/ChangeCustomerInfo.aspx?userName=" +
                item[i].UserName + "' target='_blank'>" + item[i].UserName + "</a></span></td>";
            html += "<td>" + item[i].UserDepartmentStr + "</td>";
            html += "<td>" + item[i].FullName + "</td><td>" + item[i].AgentNumber + "</td>";
            html += "<td>" + Permission + '    ' + Reset + '    ' + enable + "</td>";
            $('#tbdAgent').append(html);
        }
    }
}