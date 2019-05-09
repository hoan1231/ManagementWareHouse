$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới chi phí
     * */
    bindEventOpenAddExpenses();
    /**
     * Lấy tất cả danh sách chi phí
     * */
    GetAllExpenses();
});

/**
 * Lấy tất cả danh sách chi phí
 * */
var tblExpenses;
function GetAllExpenses() {
    if (tblExpenses) {
        tblExpenses.destroy();
        $('#tbdExpenses').empty();
    }
    tblExpenses = $('table#tblExpenses').DataTable({
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
 * Sự kiện mở popup thêm mới chi phí
 * */
function bindEventOpenAddExpenses() {
    $("#modalAdd").click(function (e) {
        e.preventDefault();
        var itemCfAddExpenses = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Thêm mới chi phí',
            type: 'blue',
            columnClass: 'x-small',
            content: '' +
                '<div class="row no-margin"><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Ngày</label>' +
                '<input type="text" id="txtContactPhone" placeholder="Nhập ngày" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Số tham chiếu</label>' +
                '<input type="text" id="txtNameExpenses" placeholder="Nhập số tham chiếu" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Danh mục</label>' +
                '<select id="ddlType" placeholder="Chọn danh mục" class="form-control input-sm select2"><option value="">--Chọn--</option></select></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Kho hàng</label>' +
                '<select id="ddlType" placeholder="Chọn kho hàng" class="form-control input-sm select2"><option value="">--Chọn--</option></select></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Tài liệu đính kèm</label>' +
                '<input type="file" id="txtFile" placeholder="Chọn file" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Số lượng</label>' +
                '<input type="text" id="txtNameExpenses" placeholder="Nhập số lượng" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-6 col-md-6 col-sm-12">' +
                '<div class="form-group"><label>Ghi chú</label>' +
                '<textarea id="txtNote" row="12" placeholder="Nội dung ghi chú" class= "form-control input-sm" /></div>' +
                '</div></form></div></div>',
            buttons: {
                formSubmit: {
                    text: 'Thêm ghi chú',
                    btnClass: 'btn-blue btn-add-Expenses',
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
}