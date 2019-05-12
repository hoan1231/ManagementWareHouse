$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới báo giá
     * */
    bindEventOpenAddTax();
    /**
     * Lấy tất cả danh sách báo giá
     * */
    GetAllTax();

  //  Refresh();
    OpenModalListTax();
  
});

/**
 * Lấy tất cả danh sách báo giá
 * */
var tblTax;
function GetAllTax() {
    if (tblTax) {
        tblTax.destroy();
        $('#tbdTax').empty();
    }
          tblTax = $('table#tblTax').DataTable({
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
function bindEventOpenAddTax() {
    $(".modalAddTax").click(function (e) {
        e.preventDefault();
        var itemCfAddTax = $.confirm({
            title: '<i class="fa-credit-card text-green"></i> Thêm mới thuế suất',
            type: 'blue',
            columnClass: 'large',
            content: '' +
                '<div class="row no-margin">' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Tên thuế suất</label><input type="text" id="txtTax" class="form-control input-sm" /></div></div>' +
               '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Mã thuế suất</label><input type="text" id="txtNumber" class="form-control input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Giá trị</label><input type="text" id="txtNumberTax" class="form-control input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Loại thuế suất</label> <select id="ddlTypeTax" style="width:100%;" class="form-control select2"><option value="">--Chọn--</option><option value="">Tỷ lệ phần trăm</option></select></div></div>' +
              '</div></div></div>',
            buttons: {
                formSubmit: {
                    text: 'Thêm mới',
                    btnClass: 'btn-blue btn-add-Tax',
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
    $(".modalEditFax").click(function (e) {
        e.preventDefault();
        var itemCfUpdateTax = $.confirm({
            title: '<i class="fa-credit-card text-green"></i> Chỉnh sửa thuế suất',
            type: 'blue',
            columnClass: 'large',
            content: '' +
                '<div class="row no-margin">' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Tên thuế suất</label><input type="text" id="txtTax" class="form-control input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Mã thuế suất</label><input type="text" id="txtNumber" class="form-control input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Giá trị</label><input type="text" id="txtNumberTax" class="form-control input-sm" /></div></div>' +
                '<div class="col-lg-4 col-md-6 col-sm-12"><div class="form-group"><label>Loại thuế suất</label> <select id="ddlTypeTax" style="width:100%;" class="form-control select2"><option value="">--Chọn--</option><option value="">Tỷ lệ phần trăm</option></select></div></div>' +
                '</div></div></div>',
            buttons: {
                formSubmit: {
                    text: 'Cập nhật',
                    btnClass: 'btn-blue btn-add-Tax',
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

function OpenModalListTax() {
    $("#modaListTax").click(function () {
        $(".listTax").show();
        $(".Tax").hide();
    })
}









