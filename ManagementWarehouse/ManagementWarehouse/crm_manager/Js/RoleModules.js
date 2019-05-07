$(document).ready(function () {
    $("select[id*='ddlModules']").change(function () {
        var module = $('select[id$="ddlModules"]').val();
        var RoleName = $('input[id$="hidRoleName"]').val();
        LoadMenu(module, RoleName);
    });

    $("#btnUpdate").click(function () {
        var roleId = $("input[id$='hidRoleId']").val();
        var roleName = $('input[id$="hidRoleName"]').val();
        if (roleId != "") {
            $("#tbdMenu > tr").each(function (index, row) {
                var id = $(row).attr('idMenuRole');
                var MenuId = $(row).attr('idHid');
                var IsShow = ($(row).find('#chkIsShow').is(':checked')) ? true : false;
                var IsAdd = ($(row).find('#chkIsAdd').is(':checked')) ? true : false;
                var IsEdit = ($(row).find('#chkIsEdit').is(':checked')) ? true : false;
                var IsDelete = ($(row).find('#chkIsDelete').is(':checked')) ? true : false;
                var IsEnable = ($(row).find('#chkIsEnable').is(':checked')) ? true : false;
                var IsAll = ($(row).find('#chkIsAll').is(':checked')) ? true : false;
                $.ajax({
                    type: "POST",
                    url: "/crm_oms/Survey/Webservices/GetInfo.asmx/Insert",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: '{Id:"' + id + '",RoleId:"' + roleId + '",RoleName:"' + roleName + '",MenuId:"' + MenuId + '",IsShow:"' + IsShow + '",IsAdd:"' + IsAdd + '",IsEdit:"' + IsEdit + '",IsDelete:"' + IsDelete + '",IsEnable:"' + IsEnable + '",IsAll:"' + IsAll + '"}',
                    complete: function (data) {
                    }
                });
            });
        }
        $.alert({
            title: 'Thông báo',
            content: 'Cập nhật thành công',
            type: 'red'
        });
        alert('');
    });
});
/*Check all change*/
function checkAll(ele) {
    if ($(ele).is(':checked')) {
        $(ele).parent().parent().parent().children().find("input[type='checkbox']").each(function () {
            if ($(ele).attr("id") != $(this).attr("id")) {
                $(this).prop('checked', true);
            }
        })
    }
    else {
        $(ele).parent().parent().parent().children().find("input[type='checkbox']").each(function () {
            if ($(ele).attr("id") != $(this).attr("id")) {
                $(this).prop('checked', false);
            }
        })
    }
}
//Xóa menu trong phân quyền
function DeleteMenu(item) {
    var id = $(item).attr('Id');
    var MenuId = $(item).attr('MenuId');
    if (confirm("Bạn có chắc muốn xóa menu quyền này ?")) {
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/crm_oms/Survey/Webservices/GetInfo.asmx/DeleteMenuRole",
            data: "{Id:'" + id + "'}",
            dataType: "json",
            success: function (msg) {
                alert("Xóa thành công!");
                LoadMenu(MenuId);
            },
            error: function () {
                alert("Error!"); return;
            }
        });
    }
}

function Pager(tableName, itemsPerPage, lstItem, type) {
    this.tableName = tableName;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = 0;
    this.inited = false;
    this.listItem = lstItem;
    this.typePage = Number(type);

    this.showRecords = function (from, to) {
        if (this.typePage == 1) { pagingSurvey(this.listItem, from, to); }
    }

    this.showPage = function (pageNumber) {
        if (!this.inited) {
            alert("not inited");
            return;
        }
        this.currentPage = pageNumber;
        var from = (pageNumber - 1) * itemsPerPage;
        var to = from + itemsPerPage;
        this.showRecords(from, to);
    }

    this.prev = function (item1) {
        if (this.currentPage > 1) {
            this.showPage(Number(this.currentPage - 1));
            item1.value = this.currentPage;
        }
    }

    this.next = function (item1) {
        if (this.currentPage < this.pages) {
            this.showPage(Number(this.currentPage) + 1);
            item1.value = this.currentPage;
        }
    }

    this.init = function () {
        var records = (this.listItem.length);
        this.pages = Math.ceil(records / itemsPerPage);
        this.inited = true;
    }

    this.showPageNav = function (pagerName, positionId) {
        if (!this.inited) {
            alert("not inited");
            return;
        }
        var element = document.getElementById(positionId);
        var uuid = 'select_' + positionId;
        var pagerHtml = '<button type="button" onclick="' + pagerName + '.prev(' + uuid.toString() + ');"';
        pagerHtml += 'class="btn btn-primary">&#171 Prev</button>';
        pagerHtml += "<select id='select_" + positionId + "' class='btn input-sm pg-normal'";
        pagerHtml += " style='border: 1px solid #8F9394;' onchange='" + pagerName + ".selectChangePage(" + pagerName + ", this);'>";
        for (var page = 1; page <= this.pages; page++)
            pagerHtml += "<option value='" + page + "'>" + page + "</option>";
        pagerHtml += "</select><button type='button' onclick='" + pagerName + ".next(" + uuid.toString() + ");'";
        pagerHtml += "class='btn btn-primary' >Next &#187</button>";
        element.innerHTML = pagerHtml;
    }

    this.selectChangePage = function (item1, item2) {
        item1.showPage($(item2).val());
    }
};
//cuongpv --21/07/2017 Phan trang

function pagingSurvey(item, from, to) {
    $('#tbdMenu').html('');
    for (var i = 0; i < item.length; i++) {
        if (i >= from && i < to) {
            if (item[i] != null) {
                var chkIsShow = (item[i].IsShow == 'True') ?
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox"  id="chkIsShow" checked /><label for="chkIsShow"></label></span>' :
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox"  id="chkIsShow" /><label for="chkIsShow1"></label></span>';
                var chkIsAdd = (item[i].IsAdd == 'True') ?
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox"  id="chkIsAdd" checked /><label for="chkIsAdd"></label></span>' :
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox"  id="chkIsAdd" /><label for="chkIsAdd1"></label></span>';
                var chkIsEdit = (item[i].IsEdit == 'True') ?
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox"  id="chkIsEdit" checked /><label for="chkIsEdit"></label></span>' :
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox"  id="chkIsEdit" /><label for="chkIsEdit1"></label></span>';
                var chkIsDelete = (item[i].IsDelete == 'True') ?
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox" id="chkIsDelete" checked /><label for="chkIsDelete"></label></span>' :
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox" id="chkIsDelete" /><label for="chkIsDelete1"></label></span>';
                var chkIsEnable = (item[i].IsEnable == 'True') ?
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox" id="chkIsEnable" checked /><label for="chkIsEnable"></label></span>' :
                    '<span class="checkbox checkbox-success" style="margin-top:0px; margin-bottom:0px"><input type="checkbox" id="chkIsEnable"  /><label for="chkIsEnable1"></label></span>';
                var chkIsAll = '';
                if (item[i].IsShow == 'True' && item[i].IsAdd == 'True' && item[i].IsEdit == 'True' && item[i].IsDelete == 'True' && item[i].IsEnable == 'True') {
                    chkIsAll = '<span class="checkbox checkbox-danger" style="margin-top:0px; margin-bottom:0px">';
                    chkIsAll += '<input id="chkIsAll" onchange="checkAll(this)" type="checkbox" checked/>';
                    chkIsAll += '<label for="chkIsAll1"></label></span>';
                    //chkIsAll = '<input type="checkbox" id="chkIsAll" onchange="checkAll(this)" checked/>';
                }
                else if (item[i].IsShow == 'false' || item[i].IsAdd == 'false' || item[i].IsEdit == 'false' || item[i].IsDelete == 'false' || item[i].IsEnable == 'false') {
                    chkIsAll = '<span class="checkbox checkbox-danger" style="margin-top:0px; margin-bottom:0px">';
                    chkIsAll += '<input id="chkIsAll" onchange="checkAll(this)" type="checkbox">';
                    chkIsAll += '<label for="chkIsAll1"></label></span>';
                    //chkIsAll = '<input type="checkbox" id="chkIsAll" onchange="checkAll(this)"/>';
                }
                else {
                    chkIsAll = '<span class="checkbox checkbox-danger" style="margin-top:0px; margin-bottom:0px">';
                    chkIsAll += '<input id="chkIsAll" onchange="checkAll(this)" type="checkbox">';
                    chkIsAll += '<label for="chkIsAll1"></label></span>';
                    //chkIsAll = '<input type="checkbox" id="chkIsAll" onchange="checkAll(this)"/>';
                }
                var html = "<tr idHid='" + item[i].MenuId + "' idMenuRole='" + item[i].Id + "'><td>" + item[i].MenuName + "</td>";
                html += "<td>" + chkIsShow + "</td>";
                html += "<td>" + chkIsAdd + "</td>";
                html += "<td>" + chkIsEdit + "</td>";
                html += "<td>" + chkIsDelete + "</td>";
                html += "<td>" + chkIsEnable + "</td>";
                html += "<td>" + chkIsAll + "</td>";
                html += "</tr>";

                //============
                $('#tbdMenu').append(html);
            }
        }
    }
};


function LoadMenu(menuId, roleName) {
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/crm_oms/Survey/Webservices/GetInfo.asmx/LoadMenuChild",
        data: '{MenuId:"' + menuId + '",RoleName:"' + roleName + '"}',
        dataType: "json",
        success: function (msg) {
            var objdata = $.parseJSON(msg.d);
            if (objdata != null) {
                //---Phan trang
                pageMarked = new Pager('tblMenu', 10, objdata, 1);
                pageMarked.init();
                pageMarked.showPageNav('pageMarked', 'pageMarked');
                pageMarked.showPage(1);

                //=====================
                $('#jaxloading').remove();
            }
            else {
                $('#tbdMenu').html('');
                $('#pageMarked').html('');
                //alert("Không có dữ liệu!");
                return;
            }
        },
        error: function () {
            alert("Không có dữ liệu!");
            return false;
        },
        complete: function () {
            $('#jaxloading').remove();
        }
    });
}