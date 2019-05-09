﻿$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới đơn nhập hàng
     * */
    bindEventOpenAddImport();
    /**
     * Lấy tất cả danh sách đơn nhập hàng
     * */
    GetAllImport();

    //  Refresh();
    /**
     * Sự kiện thêm chi phí
     * */

    ChangeCheckboxExpense();

});

/**
 * Lấy tất cả danh sách đơn nhập hàng
 * */
var tblImport;
function GetAllImport() {
    if (tblImport) {
        tblImport.destroy();
        $('#tbdImport').empty();
    }
    tblImport = $('table#tblImport').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "pageLength": 10
    });
}


function ChangeCheckboxExpense() {
    $("#chkExpense").change(function () {
        var active = $('#chkExpense').is(':checked') ? "1" : "0";
        if (active == "1") $("#showExpense").show();
        else $("#showExpense").hide();
    });
}

/**
 * Sự kiện mở popup thêm mới đơn nhập hàng
 * */
function bindEventOpenAddImport() {
    $("#modalAdd").click(function (e) {
        e.preventDefault();
        var itemCfAddImport = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Thêm mới đơn nhập hàng',
            type: 'blue',
            columnClass: 'x-large',
            content: '' +
                '<div class="row no-margin"><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Mã đơn nhập hàng</label>' +
                '<input type="text" id="txtContactPhone" placeholder="Nhập mã đơn nhập hàng" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Tên đơn nhập hàng</label>' +
                '<input type="text" id="txtNameImport" placeholder="Nhập tên đơn nhập hàng" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Loại đơn nhập hàng</label>' +
                '<select id="ddlType" placeholder="Nhập loại đơn nhập hàng" class="form-control input-sm" /></select></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Mã vạch</label>' +
                '<select id="ddlKytu" placeholder="Nhập mã vạch" class="form-control input-sm" /></select></div>' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Nhãn hiệu</label>' +
                '<select id="ddlbranch" placeholder="Chọn nhãn hiệu" class="form-control input-sm select2"/><option value=""></option></select></div>' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Danh mục</label>' +
                '<select id="ddlCategory" placeholder="Chọn danh mục" class="form-control input-sm select2"/><option value=""></option></select></div>' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Đơn vị tính</label>' +
                '<select id="ddlbranch" placeholder="Chọn đơn vị tính" class="form-control input-sm select2"/><option value=""></option></select></div>' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Nhà cung cấp</label>' +
                '<select id="ddlNCC" placeholder="Chọn nhà cung cấp" class="form-control input-sm select2"/><option value=""></option></select></div>' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Email</label>' +
                '<input type="text" id="txtGiaNhap" placeholder="Giá nhập" class="form-control input-sm" /></div>' +
                '</div></div><div class="row no-margin"><div class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><div class="form-group">' +
                '<label>Giá bán</label>' +
                '<input type="text" id="txtGiaban" placeholder="Nhập giá bán" class="form-control input-sm" />' +
                '</div></div> <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">' +
                '<div class="form-group"><label>Số lượng</label>' +
                '<input type="text" id="txtNumberAgent" placeholder="Nhập số lượng" class="form-control input-sm" />' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><div class="form-group">' +
                '<label>Thuế đơn nhập hàng</label>' +
                '<select id="ddlThue" placeholder="Chọn thuế" class="form-control input-sm select2"/><option value=""></option></select>' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><div class="form-group">' +
                '<label>Phương thức tính thuế</label>' +
                '<select id="ddlThue" placeholder="Chọn phương thức" class="form-control input-sm select2"/><option value=""></option></select>' +
                '</div></div><div class="col-ld-3 col-md-4 col-xs-12"><div class="form-group">' +
                '<label>Ảnh đơn nhập hàng</label>' +
                '<input type="text" id="txtImage" placeholder="Nhập ảnh" class="form-control input-sm" />' +
                '</div></div><div class="col-md-2"><div class="form-group">' +
                '<label>Promotion</label><span class="checkbox checkbox-success">' +
                '<input style="cursor: pointer" id="chkStatus" class="styled" type="checkbox"/>' +
                '<label for="chkStatus">Promotion</label>' +
                '</span></div></div></div></div><div class="col-md-12">' +
                '<div class="form-group"><label>Ghi chú</label>' +
                '<textarea id="txtNote" row="3" placeholder="Nội dung ghi chú" class="form-control input-sm" />' +
                '</div></div></div>',
            buttons: {
                formSubmit: {
                    text: 'Lưu thông tin',
                    btnClass: 'btn-blue btn-add-Import',
                    action: function () {

                        return false;
                    }
                },
                cancel: function () {
                    text: 'Đóng'
                }
            },
            onContentReady: function () {
                // bind to events
                var jc = this;
                this.$content.find('form').on('submit', function (e) {
                    // if the user submits the form by pressing enter in the field.
                    e.preventDefault();
                    jc.$$formSubmit.trigger('click'); // reference the button and click it
                });
            }
        });
    });
}