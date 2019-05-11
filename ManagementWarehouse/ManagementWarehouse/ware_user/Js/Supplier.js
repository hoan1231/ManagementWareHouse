﻿$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới nhà cung cấp
     * */
    bindEventOpenAddSupplier();
    /**
     * Lấy tất cả danh sách nhà cung cấp
     * */
    GetAllSupplier();

  //  Refresh();


  
});

/**
 * Lấy tất cả danh sách nhà cung cấp
 * */
var tblSupplier;
function GetAllSupplier() {
    if (tblSupplier) {
        tblSupplier.destroy();
        $('#tbdSupplier').empty();
    }
          tblSupplier = $('table#tblSupplier').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "pageLength": 10
            });
}

/**
 * Sự kiện mở popup thêm mới nhà cung cấp
 * */
function bindEventOpenAddSupplier() {
    $("#modalAdd").click(function (e) {
        e.preventDefault();
        var itemCfAddSupplier = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Thêm mới nhà cung cấp',
            type: 'blue',
            columnClass: 'x-large',
            content: '' +
                '<div class="row no-margin"><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Mã nhà cung cấp</label>' +
                '<input type="text" id="txtContactPhone" placeholder="Nhập mã nhà cung cấp" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Tên nhà cung cấp</label>' +
                '<input type="text" id="txtNameSupplier" placeholder="Nhập tên nhà cung cấp" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Loại nhà cung cấp</label>' +
                '<select id="ddlType" placeholder="Nhập loại nhà cung cấp" class="form-control input-sm" /></select></div>' +
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
                '<label>Thuế nhà cung cấp</label>' +
                '<select id="ddlThue" placeholder="Chọn thuế" class="form-control input-sm select2"/><option value=""></option></select>' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><div class="form-group">' +
                '<label>Phương thức tính thuế</label>' +
                '<select id="ddlThue" placeholder="Chọn phương thức" class="form-control input-sm select2"/><option value=""></option></select>' +
                '</div></div><div class="col-ld-3 col-md-4 col-xs-12"><div class="form-group">' +
                '<label>Ảnh nhà cung cấp</label>' +
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
                    btnClass: 'btn-blue btn-add-Supplier',
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

/**
 * Định dạng date time dd/MM/yyyy HH:mm:ss
 * @param {any} date item
 * @return {any} item dd/MM/yyyy HH:mm:ss
 */
function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + date.getSeconds();
    return date.getDate() + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear() + "  " + strTime;
}