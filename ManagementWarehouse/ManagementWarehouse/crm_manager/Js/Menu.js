$(function () {
    /**
     * Lấy thông tin menu cha của hệ thống hiện tại
     */
    GetAllMenuParent();
    /**
     * Sự kiện chọn menu cha hệ thống hiện tại
     * */
    bindEventSelectMenuParentSys();
});

function ResetAll() {
    $('#txtMenuName').val('');
    $('#txtMenuUrl').val('');
    $('#txtNote').val('');
    $('#ddlMenu').val('');
    $('#txtIndex').val('');
    $('#hidMenuID').val('');
}

function Edit(item) {
    var menuid = $(item).attr('id');
    $('#hidMenuID').val(menuid);
    var type = $(item).attr('type');
    if (type === "1") {
        $('#btnUpdate').show();
        $('#btnAdd').hide();
        var nhommenu = $(item).attr('nhommenu');
        var tenmenu = $(item).attr('nameItem');
        var menuUrl = $(item).attr('menuUrl');
        var ghichu = $(item).attr('note');
        var vitri = $(item).attr('orderindex');
        var active = $(item).attr('isActive') === "true" ? true : false;
        $('#ddlMenu').val(nhommenu);
        $('#txtMenuName').val(tenmenu);
        $('#txtMenuUrl').val(menuUrl);
        $('#txtNote').val(ghichu);
        $('#txtIndex').val(vitri);
        $('input#chkEnable').prop('checked', active);
        $('#ddlCompany').val($(item).attr('company')).trigger('change.select2');
    }
    else if (type === "2") {
        $.confirm({
            title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
            content: 'Đồng ý xóa menu: <code>' + $($($(item).parent().parent()[0])).children('td')[1].innerHTML + '</code> ?',
            type: 'red',
            buttons: {
                confirm:
                {
                    text: "Xác nhận",
                    btnClass: "btn-blue",
                    action: function () {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "/api/Menu/DeleteMenu?menuId=" + menuid,
                            dataType: "json",
                            success: function (msg) {
                                if (msg.value === 'ok') {
                                    if (tblMenus) {
                                        tblMenus.destroy();
                                        tblMenus = undefined;
                                    }
                                    $('tbody#tbdListMenu').empty();
                                    GetMenuChildByParentId($('#ddlMenu').val(), $('#ddlCompany').val());
                                }
                                else console.log(msg);
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

function Insert() {
    var nhommenu = $('#ddlMenu').val();
    var tenmenu = $('#txtMenuName').val();
    var menuUrl = $('#txtMenuUrl').val();
    var active = $('#chkEnable').is(':checked') ? "1" : "0";
    var ghichu = $('#txtNote').val();
    var vitri = $('#txtIndex').val();

    var obj = new Object();
    obj.ParentId = nhommenu;
    obj.MenuName = tenmenu;
    obj.MenuUrl = menuUrl;
    obj.OrderIndex = vitri;
    obj.Note = ghichu;
    obj.IsEnable = active;
    obj.IDCompany = $('#ddlCompany').val();

    if (nhommenu === "null" || nhommenu === "") {
        toastr.warning("Yêu cầu nhập nhóm menu", "Cảnh báo");
        return;
    }

    if (obj.IDCompany === '') {
        toastr.warning("Yêu cầu chọn công ty", "Cảnh báo");
        return;
    }

    if (tenmenu === "") {
        toastr.warning("Yêu cầu nhập tên menu", "Cảnh báo");
        return;
    }
    if (menuUrl === "") {
        toastr.warning("Yêu cầu nhập đường dẫn", "Cảnh báo");
        return;
    }
    if (vitri === "") {
        toastr.warning("Yêu cầu nhập vị trí", "Cảnh báo");
        return;
    }

    $.confirm({
        title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
        content: 'Đồng ý thêm mới thông tin menu: <code>' + obj.MenuName + '</code>?',
        type: 'red',
        buttons: {
            confirm:
            {
                text: "Xác nhận",
                btnClass: "btn-blue",
                action: function () {
                    $.ajax({
                        type: "POST",
                        url: "/api/Menu/AddMenu",
                        data: obj,
                        dataType: "json",
                        success: function (msg) {
                            if (msg.value) {
                                if (msg.value === 'exits') {
                                    toastr.warning("Tên hoặc vị trí đã tồn tại.", "Cảnh báo");
                                    return;
                                } else if (msg.value === 'ok') {
                                    toastr.info("Thêm mới thành công.", "Thông báo");
                                    ResetAll();
                                    $('#btnUpdate').hide();
                                    $('#btnAdd').show();
                                }
                            }
                        }
                    });
                }
            },
            cancel: {
                text: "Hủy bỏ",
                btnClass: "btn-default",
                action: function () {
                }
            }
        }
    });
}

function Update() {
    var nhommenu = $('#ddlMenu').val();
    var tenmenu = $('#txtMenuName').val();
    var menuUrl = $('#txtMenuUrl').val();
    var active = $('#chkEnable').is(':checked');
    var ghichu = $('#txtNote').val();
    var vitri = $('#txtIndex').val();
    var menuId = $('#hidMenuID').val();
    var idCompany = $('#ddlCompany').val();
    if (tenmenu === "") {
        toastr.warning("Yêu cầu nhập thông tin tên menu", "Cảnh báo");
        return;
    }
    if (idCompany === "") {
        toastr.warning("Yêu cầu chọn công ty", "Cảnh báo");
        return;
    }
    if (menuUrl === "") {
        toastr.warning("Yêu cầu nhập thông tin đường dẫn menu", "Cảnh báo");
        return;
    }
    if (vitri === "") {
        toastr.warning("Yêu cầu nhập vị trí hiển thị của menu", "Cảnh báo");
        return;
    }

    var obj = new Object();
    obj.MenuId = menuId;
    obj.MenuName = tenmenu;
    obj.MenuUrl = menuUrl;
    obj.OrderIndex = vitri;
    obj.Note = ghichu;
    obj.IsEnable = active;
    obj.ParentId = nhommenu;
    obj.IDCompany = idCompany;

    $.confirm({
        title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
        content: 'Đồng ý cập nhật thông tin menu: <code>' + obj.MenuName + '</code>',
        type: 'red',
        buttons: {
            confirm:
            {
                text: "Xác nhận",
                btnClass: "btn-blue",
                action: function () {
                    $.ajax({
                        type: "POST",
                        url: "/api/menu/UpdateMenu",
                        data: obj,
                        dataType: "json",
                        success: function (msg) {
                            console.log(msg);
                            var objdata = msg.value;
                            if (objdata === 'exits') {
                                toastr.warning("Tên hoặc vị trí đã tồn tại.", "Cảnh báo");
                                return;
                            }
                            else if (objdata === 'notfound') {
                                toastr.warning("Không tìm thấy thông tin menu.", "Cảnh báo");
                                return;
                            }
                            else if (objdata === 'ok') {
                                toastr.info("Cập nhật thành công.", "Thông báo");
                                ResetAll();
                                $('#ddlMenu').val(nhommenu).trigger('change');
                                $('#btnUpdate').hide();
                                $('#btnAdd').show();
                            }
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

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 45 && charCode != 47 && charCode != 32 && charCode != 58 && charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

//------------------------------TAB Menu hệ thống-----------------------/
/**
 * Lấy thông tin menu cha của hệ thống hiện tại
 * @param {any} item công ty
 */
function GetAllMenuParent() {
    $('#ddlSysMenu').html('<option value="">-Chọn-</option>');
    $.ajax({
        type: "GET",
        url: "/api/menu/GetAllMenuParent",
        dataType: "json",
        success: function (msg) {
            var objdata = msg.valueMenu;
            if (objdata) {
                for (var i = 0; i < objdata.length; i++) {
                    $('#ddlSysMenu').append('<option value="' + objdata[i].MenuId + '">' + objdata[i].MenuName + '</option>');
                }
            }
        }
    });
}

/**
 * Sự kiện chọn menu cha hệ thống hiện tại
 * */
function bindEventSelectMenuParentSys() {
    $('#ddlSysMenu').change(function (e) {
        e.preventDefault();
        var $this = $(this);
        var value = $this.val();

        if (tblSysMenus) {
            tblSysMenus.destroy();
            tblSysMenus = undefined;
        }
        $('tbody#tbdSysMenu').empty();
        if (value !== '') GetMenuChildByParentId(value);
    });
}

/**
 * Lấy thông tin menu theo menu cha hiện tại
 * @param {any} item item
 */
var tblSysMenus;
function GetMenuChildByParentId(item) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/api/menu/GetMenuChildByParentId?parentId=" + item,
        dataType: "json",
        success: function (msg) {
            if (msg.value) {
                bindDataGridSys(msg.value);
                tblSysMenus = $('table#tblSysMenu').DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "pageLength": 8
                });
            }

        }
    });
}

/**
 * Bind dữ liệu vào lưới sys menu
 * @param {any} item data
 */
function bindDataGridSys(item) {
    for (var i = 0; i < item.length; i++) {
        var htm = "<tr>";
        htm += "<td>" + (i + 1) + "</td>";
        htm += "<td>" + item[i].MenuName + "</td>";
        htm += "<td>" + item[i].MenuUrl + "</td>";
        htm += "<td>" + item[i].OrderIndex + "</td>";
        htm += "<td>" + item[i].ParentName + "</td>";
        htm += item[i].IsEnable ? "<td><span class='badge bg-blue'>Hoạt động</span></td>" :
            "<td><span class='badge'>Tạm dừng</span></td>";
        htm += "<td><i class='fa fa-edit fa-lg text-info mp-pointer-st' id='" + item[i].MenuId +
            "' nhommenu='" + item[i].ParentId + "' nameItem='" + item[i].MenuName + "' ";
        htm += "menuUrl='" + item[i].MenuUrl + "' orderindex='" + item[i].OrderIndex +
            "' note='" + item[i].Note + "' isActive='" + item[i].IsEnable + "'";
        htm += "tooltip='Sửa' type='1' onclick='SysEdit(this)' />";
        htm += "<i style='margin-left:5px;' type='2' onclick='SysEdit(this)' " +
            "class='fa fa-trash-o fa-lg text-red mp-pointer-st' id='" + item[i].MenuId + "' tooltip='Xóa' /></td>";
        htm += "</tr>";
        $('#tbdSysMenu').append(htm);
    }
}


function SysResetAll() {
    $('#txtSysMenuName').val('');
    $('#txtSysMenuUrl').val('');
    $('#txtSysNote').val('');
    $('#ddlSysMenu').val('');
    $('#txtSysIndex').val('');
    $('#hidSysMenuID').val('');
}

function SysEdit(item) {
    var menuid = $(item).attr('id');
    $('#hidSysMenuID').val(menuid);
    var type = $(item).attr('type');
    if (type === "1") {
        $('#btnSysUpdate').show();
        $('#btnSysAdd').hide();
        var nhommenu = $(item).attr('nhommenu');
        var tenmenu = $(item).attr('nameItem');
        var menuUrl = $(item).attr('menuUrl');
        var ghichu = $(item).attr('note');
        var vitri = $(item).attr('orderindex');
        var active = $(item).attr('isActive') === "true" ? true : false;
        $('#ddlSysMenu').val(nhommenu);
        $('#txtSysMenuName').val(tenmenu);
        $('#txtSysMenuUrl').val(menuUrl);
        $('#txtSysNote').val(ghichu);
        $('#txtSysIndex').val(vitri);
        $('input#chkSysEnable').prop('checked', active);
    }
    else if (type === "2") {
        $.confirm({
            title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
            content: 'Đồng ý xóa menu: <code>' + $($($(item).parent().parent()[0])).children('td')[1].innerHTML + '</code> ?',
            type: 'red',
            buttons: {
                confirm:
                {
                    text: "Xác nhận",
                    btnClass: "btn-blue",
                    action: function () {
                        $.ajax({
                            type: "POST",
                            contentType: "application/json",
                            url: "/api/Menu/DeleteMenu?menuId=" + menuid,
                            dataType: "json",
                            success: function (msg) {
                                if (msg.value === 'ok') {
                                    if (tblSysMenus) {
                                        tblSysMenus.destroy();
                                        tblSysMenus = undefined;
                                    }
                                    $('tbody#tbdSysMenu').empty();
                                    GetMenuChildByParentId($('#ddlSysMenu').val());
                                }
                                else console.log(msg);
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

function SysInsert() {
    var nhommenu = $('#ddlSysMenu').val();
    var tenmenu = $('#txtSysMenuName').val();
    var menuUrl = $('#txtSysMenuUrl').val();
    var active = $('#chkSysEnable').is(':checked') ? "1" : "0";
    var ghichu = $('#txtSysNote').val();
    var vitri = $('#txtSysIndex').val();

    var obj = new Object();
    obj.ParentId = nhommenu;
    obj.MenuName = tenmenu;
    obj.MenuUrl = menuUrl;
    obj.OrderIndex = vitri;
    obj.Note = ghichu;
    obj.IsEnable = active;

    if (nhommenu === "null" || nhommenu === "") {
        toastr.warning("Yêu cầu nhập nhóm menu", "Cảnh báo");
        return;
    }

    if (obj.IDCompany === '') {
        toastr.warning("Yêu cầu chọn công ty", "Cảnh báo");
        return;
    }

    if (tenmenu === "") {
        toastr.warning("Yêu cầu nhập tên menu", "Cảnh báo");
        return;
    }
    if (menuUrl === "") {
        toastr.warning("Yêu cầu nhập đường dẫn", "Cảnh báo");
        return;
    }
    if (vitri === "") {
        toastr.warning("Yêu cầu nhập vị trí", "Cảnh báo");
        return;
    }

    $.confirm({
        title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
        content: 'Đồng ý thêm mới thông tin menu: <code>' + obj.MenuName + '</code>?',
        type: 'red',
        buttons: {
            confirm:
            {
                text: "Xác nhận",
                btnClass: "btn-blue",
                action: function () {
                    $.ajax({
                        type: "POST",
                        url: "/api/Menu/AddSysMenu",
                        data: obj,
                        dataType: "json",
                        success: function (msg) {
                            if (msg.value) {
                                if (msg.value === 'exits') {
                                    toastr.warning("Tên hoặc vị trí đã tồn tại.", "Cảnh báo");
                                    return;
                                } else if (msg.value === 'ok') {
                                    toastr.info("Thêm mới thành công.", "Thông báo");
                                    SysResetAll();
                                    $('#btnSysUpdate').hide();
                                    $('#btnSysAdd').show();
                                }
                            }
                        }
                    });
                }
            },
            cancel: {
                text: "Hủy bỏ",
                btnClass: "btn-default",
                action: function () {
                }
            }
        }
    });
}

function SysUpdate() {
    var nhommenu = $('#ddlSysMenu').val();
    var tenmenu = $('#txtSysMenuName').val();
    var menuUrl = $('#txtSysMenuUrl').val();
    var active = $('#chkSysEnable').is(':checked');
    var ghichu = $('#txtNote').val();
    var vitri = $('#txtSysIndex').val();
    var menuId = $('#hidSysMenuID').val();
    if (tenmenu === "") {
        toastr.warning("Yêu cầu nhập thông tin tên menu", "Cảnh báo");
        return;
    }
    if (menuUrl === "") {
        toastr.warning("Yêu cầu nhập thông tin đường dẫn menu", "Cảnh báo");
        return;
    }
    if (vitri === "") {
        toastr.warning("Yêu cầu nhập vị trí hiển thị của menu", "Cảnh báo");
        return;
    }

    var obj = new Object();
    obj.MenuId = menuId;
    obj.MenuName = tenmenu;
    obj.MenuUrl = menuUrl;
    obj.OrderIndex = vitri;
    obj.Note = ghichu;
    obj.IsEnable = active;
    obj.ParentId = nhommenu;

    $.confirm({
        title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
        content: 'Đồng ý cập nhật menu: <code>' + obj.MenuName + '</code>',
        type: 'red',
        buttons: {
            confirm:
            {
                text: "Xác nhận",
                btnClass: "btn-blue",
                action: function () {
                    $.ajax({
                        type: "POST",
                        url: "/api/menu/UpdateMenu",
                        data: obj,
                        dataType: "json",
                        success: function (msg) {
                            console.log(msg);
                            var objdata = msg.value;
                            if (objdata === 'exits') {
                                toastr.warning("Tên hoặc vị trí đã tồn tại.", "Cảnh báo");
                                return;
                            }
                            else if (objdata === 'notfound') {
                                toastr.warning("Không tìm thấy thông tin menu.", "Cảnh báo");
                                return;
                            }
                            else if (objdata === 'ok') {
                                toastr.info("Cập nhật thành công.", "Thông báo");
                                ResetAll();
                                $('#ddlSysMenu').val(nhommenu).trigger('change');
                                $('#btnSysUpdate').hide();
                                $('#btnSysAdd').show();
                            }
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
