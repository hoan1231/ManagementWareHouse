$(document).ready(function () {
    //-----------------------TAB Quyền hệ thống-----------------------/
    /**
     * Lấy tất cả quyền hệ thống
     */
    LoadRole();
    /**
     * Sự kiện tạo lại lưới danh sách quyền
     * */
    $('table#tblSysRole').on('draw.dt', function (e) {
        /**
         * Sự kiện chọn thiết lập trên lưới danh sách quyền hệ thống
         * */
        bindSysEventSetupRole4Menu();
        /**
         * Sự kiện chọn xem danh sách user thuộc quyền trên lưới danh sách quyền hệ thống
         * */
        bindSysEventShowUserInRole();
        /**
         * Cập nhật tên quyền công ty hệ thống
         * */
        bindEventEditSysRoleName();

    });
    /**
     * Sự kiện chọn Nhóm module hệ thống
     **/
    bindSysEventGetMenuChildByMenuIDAndRoleID();
    /**
     * Sự kiện thêm quyền hệ thống
     * */
    bindEventSysAddRole();
    /**
     * Sự kiện cập nhật quyền trong menu
     * */
    bindSysEventUpdateRoleInMenu();

    //-----------------------END: TAB Quyền hệ thống-----------------------/
});

/**
 * Load comboxbox module hệ thống
 * @param {any} item item
 */
function bindSysAllModules(item) {
    for (var i = 0; i < item.length; i++) {
        $('select[id$="ddlSysModules"]').append('<option value="' + item[i].MenuId + '">' + item[i].MenuName + '</option>');
        $('select[id$="ddSyslModules"]').select2();
    }
}

/**
 * Sự kiện chọn Nhóm module
 **/
function bindEventGetMenuChildByMenuIDAndRoleID() {
    $('#ddlModules').change(function (e) {
        e.preventDefault();
        var $this = $(this);
        $('code.lbUpdateHelper').hide();
        if (tblMenuInRole) {
            tblMenuInRole.clear().destroy();
            $('#tblMenu th').removeAttr('class tabindex aria-controls rowspan colspan aria-label aria-sort');
            $('#tbdMenu').empty();
            tblMenuInRole = undefined;
        }

        var valueSelect = $this.val();
        var roleId = $this.attr('roleid');
        var companyId = $('#ddlCompany').val();
        if (companyId === '') return;
        if (valueSelect && roleId) {
            $.ajax({
                type: "POST",
                url: '/api/Role/GetCompanyMenuChild?MenuId=' + valueSelect + '&RoleId=' + roleId + '&CompanyId=' + companyId,
                dataType: "json",
                success: function (msg) {
                    if (msg.value) {
                        bindDataToGridModuleMenu(msg.value);
                        tblMenuInRole = $('table#tblMenu').DataTable({
                            lengthChange: false,
                            info: false,
                            columnDefs: [{
                                orderable: false,
                                className: 'select-checkbox',
                                targets: 3,
                                title: 'Chọn tất cả'
                            }],
                            select: {
                                style: 'os',
                                selector: 'td:last-child'
                            }
                        });

                        $("th.select-checkbox").unbind('click');
                        $("th.select-checkbox").click(function () {
                            if ($("th.select-checkbox").hasClass("selected")) {
                                tblMenuInRole.rows().deselect();
                                $("th.select-checkbox").removeClass("selected");
                            } else {
                                tblMenuInRole.rows().select();
                                $("th.select-checkbox").addClass("selected");
                            }
                        });
                        tblMenuInRole.on("select deselect", function () {
                            if (tblMenuInRole.rows({
                                selected: true
                            }).count() !== tblMenuInRole.rows().count()) {
                                $("th.select-checkbox").removeClass("selected");
                            } else {
                                $("th.select-checkbox").addClass("selected");
                            }
                        });
                    }
                }
            });
        }
    });

}

/**
 * Sự kiện cập nhật quyền trong menu
 * */
function bindEventUpdateRoleInMenu() {
    $('#btnUpdate').click(function (e) {
        e.preventDefault();
        var $this = $(this);

        if (tblMenuInRole) {
            var allRows = tblMenuInRole.row().data();
            if (allRows && allRows.length > 0) {
                var objs = new Object();
                objs.RoleID = $('#ddlModules').attr('roleid');
                objs.MenuParentID = $('#ddlModules').val();
                objs.LstMenuID = [];
                var selectRows = tblMenuInRole.rows('.selected').data();
                if (selectRows && selectRows.length > 0) {
                    $.each(selectRows, function (idx, val) {
                        objs.LstMenuID.push(val[0]);
                    });
                }

                $.confirm({
                    title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
                    content: 'Đồng ý cập nhật thông tin quyền: <code>' + $('code.SysroleName').html() + '</code>',
                    type: 'red',
                    buttons: {
                        confirm:
                        {
                            text: "Xác nhận",
                            btnClass: "btn-blue",
                            action: function (e) {
                                var itemDisableds = [$this];
                                var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                                mylop.start();
                                $.ajax({
                                    type: 'POST',
                                    url: '/api/Role/UpdateRoleInMenu',
                                    dataType: 'json',
                                    data: objs,
                                    success: function (msg) {
                                        if (msg.value !== 'ok') console.log(msg.value);
                                        else $('code.lbUpdateHelper').html('Cập nhật thành công.').show();
                                    }, complete: function () {
                                        mylop.stop();
                                    }
                                });
                            }
                        },
                        cancel: {
                            text: "Hủy bỏ",
                            btnClass: "btn-default",
                            action: function (e) {
                            }
                        }
                    }
                });
            }
        }
    });
}

/**
 * Load dữ menu lên lưới phần quyền menu công ty
 * @param {any} item item
 */
function bindDataToGridModuleMenu(item) {
    for (var i = 0; i < item.length; i++) {
        var chkIsAll = '';
        if (item[i].IsAll) chkIsAll = 'selected';
        var html = "<tr class='" + chkIsAll + "' idHid='" + item[i].MenuId + "' idMenuRole='" + item[i].Id + "'>";
        html += "<td style='display:none'>" + item[i].MenuId + "</td>";
        html += "<td style='display:none'>" + item[i].Id + "</td>";
        html += "<td>" + item[i].MenuName + "</td><td></td></tr>";
        $('#tbdMenu').append(html);
    }
}

/**
 * Sự kiện chọn xem danh sách user thuộc quyền trên lưới danh sách quyền công ty
 * */
function bindEventShowUserInRole() {
    $('table#tblRole td > i.fa-book').click(function (e) {
        e.preventDefault();
        if (tblUserInRole) {
            tblUserInRole.clear().destroy();
            $('#tblMenu th').removeAttr('class tabindex aria-controls rowspan colspan aria-label aria-sort');
            $('#tbdUserInRole').empty();
        }
        var $this = $(this);
        var roleID = $this.attr('roleid');
        var roleName = $this.attr('rolename');
        if (roleID && roleName) {
            $('code.SysroleName').html(roleName);
            $('.box-setup-role').hide();
            $('.box-view-user-in-role, code.SysroleName').show();

            var itemDisableds = [$this];
            var mylop = new myMpLoopAttr($this, $this.attr('class'), itemDisableds);
            mylop.start();
            $.ajax({
                type: 'POST',
                url: '/api/Role/GetUsersInRole?roleID=' + roleID,
                dataType: 'json',
                success: function (msg) {

                    if (msg.value) {
                        //Bind dữ liệu lên lưới quyền user
                        bindDataUserInRoleToGrid(msg.value);
                    }
                    tblUserInRole = $('table#tblUserInRole').DataTable({
                        "paging": true,
                        "lengthChange": false,
                        "searching": true,
                        "ordering": true,
                        "info": true,
                        "autoWidth": false
                    });
                },
                complete: function () {
                    mylop.stop();
                }
            });
        }
    });
}

/**
 * Bind dữ liệu lên lưới quyền user công ty
 * @param {any} item data
 */
function bindDataUserInRoleToGrid(item) {
    for (var i = 0; i < item.length; i++) {
        var html = "<tr><td>" + (i + 1) + "</td>";
        html += "<td>" + item[i].UserName + "</td>";
        html += "<td>" + item[i].FullName + "</td>";
        html += "<td>" + item[i].AgentNumber + "</td>";
        html += "</tr>";
        $('#tbdUserInRole').append(html);
    }
}



/**
 * Load tất cả quyền hệ thống lên lưới
 * @param {any} item item
 */
function bindSysAllRoles(item) {
    for (var i = 0; i < item.length; i++) {
        var Detail = "<i class='fa fa-book fa-lg fa-lg mp-pointer-st text-info' alt='Chi tiết' title='Chi tiết' RoleId='" + item[i].RoleID +
            "' rolename='" + item[i].RoleName + "'></i>";
        var enable = '';
        if (item[i].IsEnable) {
            enable += '<i class="fa fa-toggle-on fa-lg mp-pointer-st text-info" title="Bật/tắt user" alt="Bật/Tắt User"';
            enable += 'RoleId=' + item[i].RoleID + ' onclick="IsApproved(this);" value="true"></i>';
        } else {
            enable += '<i class="fa fa-toggle-off mp-pointer-st text-info fa-lg" title="Bật/tắt user" alt="Bật/Tắt User" RoleId=' + item[i].RoleID +
                ' onclick="IsApproved(this);" value="false"</i>';
        }
        var Permission = '<i class="fa fa-gears fa-lg mp-pointer-st text-info" roleid="' + item[i].RoleID +
            '" rolename="' + item[i].RoleName + '" alt="Thiết Lập Quyền"></i>';
        var html = "<tr><td>" + (i + 1) + "</td>";
        html += "<td class='edit-sys-role-name' uuid='" + item[i].RoleID + "'>" + item[i].RoleName + "</td>";
        html += "<td>" + item[i].counts + "</td>";
        html += "<td>" + Detail + " " + Permission + " " + enable + "</td>";
        html += "</tr>";
        $('#tbdSysRole').append(html);
    }
}

/**
 * Bật tắt quyền công ty
 * @param {any} item item
 */
function IsApproved(item) {
    var RoleId = $(item).attr('RoleId');
    var value = $(item).attr('value');
    $.confirm({
        title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
        content: 'Đồng ý cập nhật thông tin ?',
        type: 'red',
        buttons: {
            confirm:
            {
                text: "Xác nhận",
                btnClass: "btn-blue",
                action: function () {
                    $.ajax({
                        type: "POST",
                        url: '/api/Role/ApprovedRole?roleID=' + RoleId + '&check=' + value,
                        dataType: "json",
                        success: function (msg) {
                            if (msg.value === 'ok') {
                                $(item).attr('value', value === 'true' ? 'false' : 'true');
                                if (value === 'true')
                                    $(item).attr('class', 'fa fa-toggle-off fa-lg mp-pointer-st text-info');
                                else
                                    $(item).attr('class', 'fa fa-toggle-on fa-lg mp-pointer-st text-info');
                            } else console.log(msg);
                        }
                    });
                }
            },
            cancel: {
                text: "Hủy bỏ",
                btnClass: "btn-default",
                action: function (e) {
                }
            }
        }
    });
}

/**
* Sự kiện nhập tên quyền
* */
function bindEventInputRoleName() {
    $('#txtRoleName').change(function (e) {
        e.preventDefault();
        $('code.lbAddHelper').hide();
    });
}


//-----------------------TAB Quyền hệ thống-----------------------/

var tblSysRoles; var tblSysUserInRole; var tblSysMenuInRole;
/**
 * Lấy tất cả quyền hệ thống
 */
function LoadRole() {
    $.ajax({
        type: 'GET',
        url: '/api/Role/GetAllRoles',
        dataType: 'json',
        success: function (msg) {
            console.log(msg);
            if (msg.roles) {
                if (tblSysRoles) {
                    tblSysRoles.destroy();
                    tblSysRoles = undefined;
                    $('tbody#tbdSysRole').empty();
                }

                bindSysAllRoles(msg.roles);
                tblSysRoles = $('table#tblSysRole').DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "pageLength": 15
                });
            }
            //=====================
            if (msg.modules) bindSysAllModules(msg.modules);
        }
    });
}

/**
 * Sự kiện chọn thiết lập trên lưới danh sách quyền hệ thống
 * */
function bindSysEventSetupRole4Menu() {
    $('table#tblSysRole td > i.fa-gears').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var roleID = $this.attr('roleid');
        var roleName = $this.attr('rolename');
        $('code.lbSysUpdateHelper').hide();
        if (roleID && roleName) {
            $('#ddlSysModules').attr('roleid', roleID);
            $('button#btnSysUpdate').attr('roleName', roleName);
            $('code.SysroleName').html(roleName);
            $('.sys-box-view-user-in-role').hide();
            $('.sys-box-setup-role, code.SysroleName').show();
            $('#ddlSysModules').val('').trigger('change.select2');
            if (tblSysMenuInRole) {
                tblSysMenuInRole.clear().destroy();
                $('#tblSysMenu th').removeAttr('class tabindex aria-controls rowspan colspan aria-label aria-sort');
                $('#tbdSysMenu').empty();
                tblSysMenuInRole = undefined;
            }
        }
    });
}

/**
 * Sự kiện chọn xem danh sách user thuộc quyền trên lưới danh sách quyền hệ thống
 * */
function bindSysEventShowUserInRole() {
    $('table#tblSysRole td > i.fa-book').click(function (e) {
        e.preventDefault();
        if (tblSysUserInRole) {
            tblSysUserInRole.clear().destroy();
            $('#tblSysMenu th').removeAttr('class tabindex aria-controls rowspan colspan aria-label aria-sort');
            $('#tbdSysUserInRole').empty();
        }
        var $this = $(this);
        var roleID = $this.attr('roleid');
        var roleName = $this.attr('rolename');
        if (roleID && roleName) {
            $('code.SysroleName').html(roleName);
            $('.sys-box-setup-role').hide();
            $('.sys-box-view-user-in-role, code.SysroleName').show();

            var itemDisableds = [$this];
            var mylop = new myMpLoopAttr($this, $this.attr('class'), itemDisableds);
            mylop.start();
            $.ajax({
                type: 'POST',
                url: '/api/Role/GetUsersInRole?roleID=' + roleID,
                dataType: 'json',
                success: function (msg) {

                    if (msg.value) {
                        //Bind dữ liệu lên lưới quyền user hệ thống
                        bindSysDataUserInRoleToGrid(msg.value);
                    }
                    tblSysUserInRole = $('table#tblSysUserInRole').DataTable({
                        "paging": true,
                        "lengthChange": false,
                        "searching": true,
                        "ordering": true,
                        "info": true,
                        "autoWidth": false
                    });
                },
                complete: function () {
                    mylop.stop();
                }
            });
        }
    });
}

/**
 * Bind dữ liệu lên lưới quyền user hệ thống
 * @param {any} item data
 */
function bindSysDataUserInRoleToGrid(item) {
    for (var i = 0; i < item.length; i++) {
        var html = "<tr><td>" + (i + 1) + "</td>";
        html += "<td>" + item[i].UserName + "</td>";
        html += "<td>" + item[i].FullName + "</td>";
        html += "<td>" + item[i].AgentNumber + "</td>";
        html += "</tr>";
        $('#tbdSysUserInRole').append(html);
    }
}

/**
 * Sự kiện chọn Nhóm module
 **/
function bindSysEventGetMenuChildByMenuIDAndRoleID() {
    $('#ddlSysModules').change(function (e) {
        e.preventDefault();
        var $this = $(this);
        $('code.lbSysUpdateHelper').hide();
        if (tblSysMenuInRole) {
            tblSysMenuInRole.clear().destroy();
            $('#tblSysMenu th').removeAttr('class tabindex aria-controls rowspan colspan aria-label aria-sort');
            $('#tbdSysMenu').empty();
            tblSysMenuInRole = undefined;
        }

        var valueSelect = $this.val();
        var roleId = $this.attr('roleid');
        if (valueSelect && roleId) {
            $.ajax({
                type: "POST",
                url: '/api/Role/GetMenuChild?MenuId=' + valueSelect + '&RoleId=' + roleId,
                dataType: "json",
                success: function (msg) {
                    if (msg.value) {
                        bindSysDataToGridModuleMenu(msg.value);
                        tblSysMenuInRole = $('table#tblSysMenu').DataTable({
                            lengthChange: false,
                            info: false,
                            columnDefs: [{
                                orderable: false,
                                className: 'select-checkbox',
                                targets: 3,
                                title: 'Chọn tất cả'
                            }],
                            select: {
                                style: 'os',
                                selector: 'td:last-child'
                            }
                        });

                        $("th.select-checkbox").unbind('click');
                        $("th.select-checkbox").click(function () {
                            if ($("th.select-checkbox").hasClass("selected")) {
                                tblSysMenuInRole.rows().deselect();
                                $("th.select-checkbox").removeClass("selected");
                            } else {
                                tblSysMenuInRole.rows().select();
                                $("th.select-checkbox").addClass("selected");
                            }
                        });
                        tblSysMenuInRole.on("select deselect", function () {
                            if (tblSysMenuInRole.rows({
                                selected: true
                            }).count() !== tblSysMenuInRole.rows().count()) {
                                $("th.select-checkbox").removeClass("selected");
                            } else {
                                $("th.select-checkbox").addClass("selected");
                            }
                        });
                    }
                }
            });
        }
    });
}

/**
 * Load dữ menu lên lưới phần quyền menu hệ thống
 * @param {any} item item
 */
function bindSysDataToGridModuleMenu(item) {
    for (var i = 0; i < item.length; i++) {
        var chkIsAll = '';
        if (item[i].IsAll) chkIsAll = 'selected';
        var html = "<tr class='" + chkIsAll + "' idHid='" + item[i].MenuId + "' idMenuRole='" + item[i].Id + "'>";
        html += "<td style='display:none'>" + item[i].MenuId + "</td>";
        html += "<td style='display:none'>" + item[i].Id + "</td>";
        html += "<td>" + item[i].MenuName + "</td><td></td></tr>";
        $('#tbdSysMenu').append(html);
    }
}

/**
 * Sự kiện thêm quyền hệ thống
 * */
function bindEventSysAddRole() {
    $('#btnSysAddRole').click(function (e) {
        e.preventDefault();
        $('code.lbSysAddHelper').hide();
        var $this = $(this);
        var roleName = $("input[id$='txtSysRoleName']").val();
        if (roleName) {
            $.confirm({
                title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
                content: 'Đồng ý thêm mới quyền: <code>' + roleName + '</code>?',
                type: 'red',
                buttons: {
                    confirm:
                    {
                        text: "Xác nhận",
                        btnClass: "btn-blue",
                        action: function () {
                            var itemDisableds = [$this];
                            var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                            mylop.start();
                            $.ajax({
                                type: 'POST',
                                url: '/api/Role/AddSysRole?roleName=' + roleName,
                                dataType: 'json',
                                success: function (msg) {
                                    if (msg.value === 'ok') {
                                        $('code.lbSysAddHelper').addClass('text-green').html('Thêm mới thành công.').show();
                                        LoadSysRole();
                                    } else if (msg.value === 'exits')
                                        $('code.lbSysAddHelper').removeClass('text-green').html('Tên quyền đã tồn tại.').show();
                                    else console.log(msg);
                                }, complete: function () {
                                    mylop.stop();
                                }
                            });
                        }
                    },
                    cancel: {
                        text: "Hủy bỏ",
                        btnClass: "btn-default",
                        action: function (e) {
                        }
                    }
                }
            });
        }
    });
}

/**
 * Sự kiện cập nhật quyền trong menu
 * */
function bindSysEventUpdateRoleInMenu() {
    $('#btnSysUpdate').click(function (e) {
        e.preventDefault();
        var $this = $(this);

        if (tblSysMenuInRole) {
            var allRows = tblSysMenuInRole.row().data();
            if (allRows && allRows.length > 0) {
                var objs = new Object();
                objs.RoleID = $('#ddlSysModules').attr('roleid');
                objs.MenuParentID = $('#ddlSysModules').val();
                objs.LstMenuID = [];
                var selectRows = tblSysMenuInRole.rows('.selected').data();
                if (selectRows && selectRows.length > 0) {
                    $.each(selectRows, function (idx, val) {
                        objs.LstMenuID.push(val[0]);
                    });
                }

                $.confirm({
                    title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
                    content: 'Đồng ý cập nhật thông tin quyền: <code>' + $this.attr('rolename') + '</code>',
                    type: 'red',
                    buttons: {
                        confirm:
                        {
                            text: "Xác nhận",
                            btnClass: "btn-blue",
                            action: function (e) {
                                var itemDisableds = [$this];
                                var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                                mylop.start();
                                $.ajax({
                                    type: 'POST',
                                    url: '/api/Role/UpdateRoleInMenu',
                                    dataType: 'json',
                                    data: objs,
                                    success: function (msg) {
                                        if (msg.value !== 'ok') console.log(msg.value);
                                        else $('code.lbSysUpdateHelper').html('Cập nhật thành công.').show();
                                    }, complete: function () {
                                        mylop.stop();
                                    }
                                });
                            }
                        },
                        cancel: {
                            text: "Hủy bỏ",
                            btnClass: "btn-default",
                            action: function (e) {
                            }
                        }
                    }
                });
            }
        }
    });
}

/**
 * Cập nhật tên quyền công ty hệ thống
 * */
function bindEventEditSysRoleName() {
    $("#tbdSysRole .edit-sys-role-name").each(function () {
        var obj = jQuery(this);
        obj.editable({
            onSubmit: function (content) {
                content.current = content.current.trim();
                content.previous = content.previous.trim();
                if (!content.current || content.current === '') {
                    obj.html(content.previous);
                    return;
                }

                if (content.current !== content.previous) {
                    var text = "Xác nhận cập nhật: <code><b>" + content.previous + "</b> <i class='fa fa-arrow-right'></i> <b>" +
                        content.current + "</b></code> ?";
                    $.confirm({
                        type: 'red',
                        title: '<i class="fa fa-question-circle text-red"></i> Yêu cầu xác nhận.',
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
                                        url: "/api/Role/EditSysRoleName?name=" + content.current + "&roleId=" + obj.attr('uuid'),
                                        dataType: "json",
                                        success: function (msg) {
                                            if (msg.value === 'ok') {
                                                obj.html(content.current);
                                                return true;
                                            } else {
                                                obj.html(content.previous);
                                                console.log(msg);
                                                return false;
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
            onEdit: function () {
                $($(this).children()[0]).css('form-control input-sm');
            }
        });
    });
}

//-----------------------END: TAB Quyền hệ thống-----------------------/




