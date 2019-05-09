$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới sản phẩm
     * */
    bindEventOpenAddProduct();
    /**
     * Lấy tất cả danh sách sản phẩm
     * */
    GetAllProduct();

  //  Refresh();


  
});

/**
 * Lấy tất cả danh sách sản phẩm
 * */
var tblProduct;
function GetAllProduct() {
    if (tblProduct) {
        tblProduct.destroy();
        $('#tbdProduct').empty();
    }
          tblProduct = $('table#tblProduct').DataTable({
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
 * Sự kiện mở popup thêm mới sản phẩm
 * */
function bindEventOpenAddProduct() {
    $("#modalAdd").click(function (e) {
        e.preventDefault();
        var itemCfAddProduct = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Thêm mới sản phẩm',
            type: 'blue',
            columnClass: 'x-large',
            content: '' +
                '<div class="row no-margin"><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Mã sản phẩm</label>' +
                '<input type="text" id="txtContactPhone" placeholder="Nhập mã sản phẩm" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Tên sản phẩm</label>' +
                '<input type="text" id="txtNameProduct" placeholder="Nhập tên sản phẩm" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Loại sản phẩm</label>' +
                '<select id="ddlType" placeholder="Nhập loại sản phẩm" class="form-control input-sm" /></select></div>' +
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
                '<label>Thuế sản phẩm</label>' +
                '<select id="ddlThue" placeholder="Chọn thuế" class="form-control input-sm select2"/><option value=""></option></select>' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><div class="form-group">' +
                '<label>Phương thức tính thuế</label>' +
                '<select id="ddlThue" placeholder="Chọn phương thức" class="form-control input-sm select2"/><option value=""></option></select>' +
                '</div></div><div class="col-ld-3 col-md-4 col-xs-12"><div class="form-group">' +
                '<label>Ảnh sản phẩm</label>' +
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
                    btnClass: 'btn-blue btn-add-Product',
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






                        return false;
                    }
                },
                cancel: {
                    text: 'Hủy',
                    keys: ['esc'],
                    action: function () {
                    }
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



    //$("#AddProduct").click(function () {
    //    var compa = new Object();
    //    compa.Product = $("input[id$='txtNameProduct']").val();
    //    compa.IPServerDB = $("input[id$='txtIPServerName']").val();
    //    compa.ServerNameDB = $("input[id$='txtServerNameDB']").val();
    //    compa.UserNameDB = $("input[id$='txtNameLoginDB']").val();
    //    compa.PassDB = $("input[id$='txtPassLoginDB']").val();
    //    compa.NumberAgent = $("input[id$='txtNumberAgent']").val();
    //    compa.Status = $("#chkStatus").is(":checked");
    //    compa.Note = $("input[id$='txtNote']").val();
    //    compa.Icon = $("input[id$='txtIcon']").val();
    //    $.ajax({
    //        type: "POST",
    //        url: "/api/Product/AddProduct",
    //        dataType: "json",
    //        data: compa
    //        , success: function (msg) {
    //            console.log(msg.value);
    //            if (msg.value == "ok") {
    //                alert("thêm mới thành công");
    //            }
    //            Refresh();
    //            GetAllProduct();
    //        }
    //        , complete: function () {
    //        }
    //    });
    //});




}

/**
 * Kiểm tra nhập liệu thông tin sản phẩm
 * @param {any} item Product
 * @returns {any} true/false
 */
function validateInputProduct(item) {
    if (item.ProductCode && item.ProductCode.length !== 5) {
        $.alert({
            title: 'Cảnh báo!',
            type: 'red',
            icon: 'fa fa-warning',
            content: '<code>Mã định danh sản phẩm yêu cầu 5 ký tự.</code>'
        });
        return false;
    }
    if (!item.ProductName || !item.DBServer || !item.ProductCode ||
        !item.UserNumber || !item.Note || !item.VoiceServer || !item.ContactPhone ||
        !item.ContactName || item.ContactEmail) {
        $.alert({
            title: 'Cảnh báo!',
            type: 'red',
            icon: 'fa fa-warning',
            content: '<code>Yêu cầu nhập đầy đủ thông tin.</code>'
        });
        return false;
    }
    return true;
}

/**
 * Lấy các thông tin sản phẩm nhập vào
 * @param {any} $control item
 * @returns {any} item Product
 */
function getProductInput($control) {
    var compa = new Object();
    compa.ProductName = $control.$content.find('#txtNameProduct').val();
    compa.ProductEmail = $control.$content.find('#txtContactEmail').val();
    compa.ContactName = $control.$content.find('#txtContactName').val();
    compa.ContactPhone = $control.$content.find('#txtContactPhone').val();
    compa.DBServer = $control.$content.find('#txtIPServerName').val();
    compa.ProductCode = $control.$content.find('#txtProductCode').val().toUpperCase();
    compa.UserNumber = $control.$content.find('#txtNumberAgent').val();
    compa.Status = $control.$content.find('#chkStatus').is(":checked");
    compa.Note = $control.$content.find('#txtNote').val();
    compa.VoiceServer = $control.$content.find('#txtVoiceServer').val();
    return compa;
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