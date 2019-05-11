$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới báo giá
     * */
    bindEventOpenAddPromotion();
    /**
     * Lấy tất cả danh sách báo giá
     * */
    GetAllPromotion();

  //  Refresh();
    OpenModalListPromotion();


  
});

/**
 * Lấy tất cả danh sách báo giá
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
 * Sự kiện mở popup thêm mới khuyến mại
 * */
function bindEventOpenAddPromotion() {
    $(".configPromotion").click(function (e) {
        e.preventDefault();
        var itemCfAddProduct = $.confirm({
            title: '<i class="fa-credit-card text-green"></i> Thêm mới khuyến mại',
            type: 'blue',
            columnClass: 'large',
            content: '' +
                '<div class="row no-margin">' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Tên sản phẩm</label><input type="text" id="txtProduct" class="form-control input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Loại khuyến mại</label> <select id="ddlTypePromotion" style="width:100%;" class="form-control select2"><option value="OneToOne">Tặng kèm sản phẩm</option><option value="VAT">Giảm(%)</option></select></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Sản phẩm khuyến mại</label> <select id="ddlProductPromotion" style="width:100%;" class="form-control select2"><option value="">--Chọn--</option><option value="111">Sữa rửa mặt</option></select></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Số lượng khuyến mại SP gốc</label><input type="text" id="txtNumber" class="form-control input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Số lượng SP khuyến mại</label><input type="text" id="txtNumberPromotion" class="form-control input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Từ ngày</label><input type="text" id="txtTo" class="form-control input-datepicker input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label> Đến ngày</label><input type="text" id="txtFrom" class="form-control input-datepicker input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6"><div class="form-group">' +
                '<label></label><span class="checkbox checkbox-success">' +
                '<input style="cursor: pointer" id="chkStatus" class="styled" type="checkbox" />' +
                '<label for="chkStatus">Hoạt động</label>' +
                '</span></div></div></div></div></div>',
            buttons: {
                formSubmit: {
                    text: 'Thêm mới',
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

function OpenModalListPromotion() {
    $("#modaListPromotion").click(function () {
        $(".listPromotion").show();
        $(".Promotion").hide();
    })
}









