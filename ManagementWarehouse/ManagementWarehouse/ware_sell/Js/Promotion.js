$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm thẻ giảm giá
     * */
    bindEventOpenAddPromotion();
    /**
     * Lấy tất cả danh sách sản phẩm
     * */
    GetAllPromotion();

    //  Refresh();



});

/**
 * Lấy tất cả danh sách sản phẩm
 * */
var tblPromotion;
function GetAllPromotion() {
    if (tblPromotion) {
        tblPromotion.destroy();
        $('#tbdPromotion').empty();
    }
    tblPromotion = $('table#tblPromotion').DataTable({
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
 * Sự kiện mở popup thêm thẻ giảm giá
 * */
function bindEventOpenAddPromotion() {
    $("#modalAdd").click(function (e) {
        e.preventDefault();
        var itemCfAddPromotion = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Thêm thẻ giảm giá',
            type: 'blue',
            columnClass: 'medium',
            content: '' +
                '<div class="row no-margin"><div class="col-lg-6 col-md-6 col-sm-12">' +
                '<div class="form-group"><label>Số thẻ</label>' +
                '<input type="text" id="txtCardNumber" placeholder="Nhập số thẻ" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-6 col-md-6 col-sm-12">' +
                '<div class="form-group"><label>Giá trị</label>' +
                '<input type="text" id="txtValue" placeholder="Nhập giá trị" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-6 col-md-6 col-sm-12">' +
                '<div class="form-group"><label>Khách hàng</label>' +
                '<select id="ddlCustomer" placeholder="Chọn khách hàng" class="form-control input-sm select2" /></select></div>' +
                '</div><div class="col-lg-6 col-md-6 col-sm-12">' +
                '<div class="form-group"><label>Ngày hết hạn</label>' +
                '<input type="text" placeholder="dd/MM/yyyy" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-6 col-md-6 col-sm-12"><span class="checkbox checkbox-success styleCheckBoxMenu">' +
                '<input id="chkExpense" class= "styled" type="checkbox">' +
                '<label for="chkExpense">Thêm chi phí</label>' +
            '</span></div></div></div></div>',
            buttons: {
                formSubmit: {
                    text: 'Lưu thông tin',
                    btnClass: 'btn-blue btn-add-Promotion',
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
