$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới sản phẩm
     * */
    bindEventOpenAddProduct();
    /**
     * /**
     * Sự kiện mở popup xem chi tiết sản phẩm
     * */
    bindEventOpenDetailProduct();
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
    });
}

function bindEventOpenDetailProduct() {
    $("#modalDetail").click(function (e) {
        e.preventDefault();
        var itemCfAddProduct = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Chi tiết sản phẩm',
            type: 'blue',
            columnClass: 'x-large',
            content: '' +
                '<div class="row"><div class="col-ld-5 col-md-5 col-sm 12"><div class="row"> <img src="/Content/dist/img/anhdefault.png" alt="Sữa rửa mặt 1" class= "img-responsive img-thumbnail">'+
                ' <div class="form-group" style="margin-left:3%;"><table class="table table-bordered table-hover"> <tr class="success"><th>Tên kho hàng</th><th>Số lượng kho hàng</th></tr><tr><td>Kho hàng 1</td><td>120</td></tr></table></div></div></div> <div class="col-ld-7 col-md-7 col-sm 12"><div class="row no-margin">' +
                '<table class="table table-borderless table-striped table-right-left"><tbody>'+
                '<tr> <td colspan="2" style="background-color:#FFF;"></td></tr>'+
                '<tr><td style = "width:30%;"> Barcode &amp; QRcode</td > '+
            '<td style = "width:70%;" > <img src="/Content/dist/img/code.png" alt="s001" class="bcimg">'+
                                        '<img src="/Content/dist/img/qr_code.jpeg" class="qrimg" style="width: 18%;"></td>'+
                                                    '</tr>'+
                          '<tr> <td>Loại</td> <td>Tiêu chuẩn</td></tr > '+
                          '<tr> <td>Tên</td> <td>Sữa rửa mặt 1</td></tr > '+
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
