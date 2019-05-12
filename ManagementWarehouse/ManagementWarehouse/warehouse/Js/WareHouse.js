$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới điều chỉnh
     * */
    bindEventOpenAddWarehouse();
    /**
     * Lấy tất cả danh sách điều chỉnh
     * */
    GetAllWarehouse();
    bindEventOpenDetailProduct();

  //  Refresh();


  
});

/**
 * Lấy tất cả danh sách điều chỉnh
 * */
var tblWarehouse;
function GetAllWarehouse() {
    if (tblWarehouse) {
        tblWarehouse.destroy();
        $('#tbdWarehouse').empty();
    }
          tblWarehouse = $('table#tblWarehouse').DataTable({
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
 * Sự kiện mở popup thêm mới điều chỉnh
 * */
function bindEventOpenAddWarehouse() {
    $("#modalAdd").click(function (e) {
        e.preventDefault();
        var itemCfAddWarehouse = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Thêm mới điều chỉnh',
            type: 'blue',
            columnClass: 'x-large',
            content: '' +
                '<div class="row no-margin"><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Ngày</label>' +
                '<input type="text" id="txtContactPhone" placeholder="Nhập ngày" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Số tham chiếu</label>' +
                '<input type="text" id="txtNameWarehouse" placeholder="Nhập số tham chiếu" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Kho hàng</label>' +
                '<select id="ddlType" placeholder="Chọn kho hàng" class="form-control input-sm select2"><option value="">--Chọn--</option></select></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Tài liệu đính kèm</label>' +
                '<input type="file" id="txtContactPhone" placeholder="Chọn file" class="form-control input-sm" /></div>' +
                '</div> <div class="form-group">' +
                '<label for="add_item"> Thêm sản phẩm</label> <input type="text" placeholder="Thêm mục" id="txtAdd" class="form-control input-sm" /></div>' +
                '<form class="bv-form">' +
                '<div class="controls table-controls">' +
                    '<table id="tblBarCode" class="table table-bordered table-hover">' +
                        '<thead><tr class="success">'+
                '<th>Tên sản phẩm (Mã sản phẩm)</th><th>Số lượng</th><th class="text-center" style="width:30px;">' +
                                '<i class="fa fa-trash-o" style="opacity:0.5; filter:alpha(opacity=50);"></i></th>' +
                '</tr></thead><tbody></tbody></table> </div><div class="col-lg-6 col-md-6 col-sm-12">' +
                '<div class="form-group"><label>Ghi chú</label>' +
                '<textarea id="txtNote" row="12" placeholder="Nội dung ghi chú" class= "form-control input-sm" /></div>' +
                '</div></form></div></div>',
            buttons: {
                formSubmit: {
                    text: 'Gửi',
                    btnClass: 'btn-blue btn-add-Warehouse',
                    action: function () {
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



    //$("#AddWarehouse").click(function () {
    //    var compa = new Object();
    //    compa.Warehouse = $("input[id$='txtNameWarehouse']").val();
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
    //        url: "/api/Warehouse/AddWarehouse",
    //        dataType: "json",
    //        data: compa
    //        , success: function (msg) {
    //            console.log(msg.value);
    //            if (msg.value == "ok") {
    //                alert("thêm mới thành công");
    //            }
    //            Refresh();
    //            GetAllWarehouse();
    //        }
    //        , complete: function () {
    //        }
    //    });
    //});




}

function bindEventOpenDetailProduct() {
    $(".modalDetail").click(function (e) {
        e.preventDefault();
        var itemCfAddProduct = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Chi tiết sản phẩm',
            type: 'blue',
            columnClass: 'x-large',
            content: '' +
                '<div class="row"><div class="col-ld-5 col-md-5 col-sm 12"><div class="row"> <img src="/Content/dist/img/anhdefault.png" alt="Sữa rửa mặt 1" class= "img-responsive img-thumbnail">' +
                ' <div class="form-group" style="margin-left:3%;"><table class="table table-bordered table-hover"> <tr class="success"><th>Tên kho hàng</th><th>Số lượng kho hàng</th></tr><tr><td>Kho hàng 1</td><td>120</td></tr></table></div></div></div> <div class="col-ld-7 col-md-7 col-sm 12"><div class="row no-margin">' +
                '<table class="table table-borderless table-striped table-right-left"><tbody>' +
                '<tr> <td colspan="2" style="background-color:#FFF;"></td></tr>' +
                '<tr><td style = "width:30%;"> Barcode &amp; QRcode</td > ' +
                '<td style = "width:70%;" > <img src="/Content/dist/img/code.png" alt="s001" class="bcimg">' +
                '<img src="/Content/dist/img/qr_code.jpeg" class="qrimg" style="width: 18%;"></td>' +
                '</tr>' +
                '<tr> <td>Loại</td> <td>Tiêu chuẩn</td></tr > ' +
                '<tr> <td>Tên</td> <td>Sữa rửa mặt 1</td></tr > ' +
                '<tr><td>Mã</td><td>s001</td></tr>' +
                '<tr><td>brand</td><td></td></tr>' +
                '<tr><td>Danh mục</td><td>Category 1</td></tr>' +
                '<tr><td>Nhãn hiệu</td><td>nivea</td></tr>' +
                '<tr><td>Đơn vị tính</td><td>Đơn vị 1 (01)</td></tr>' +
                '<tr><td>Giá</td><td>195000</td></tr>' +
                '<tr><td>Thuế suất</td><td>No Tax</td></tr>' +
                '<tr><td>Phương thức tính thuế</td><td>Không bao gồm</td></tr>' +
                '<tr><td>Số lượng nhập cảnh báo</td><td>25</td></tr>' +
                '</tbody></table>' +
                '</div></div></div></div></div>',
            buttons: {
                formSubmit: {
                    text: 'Sửa',
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
    });
}