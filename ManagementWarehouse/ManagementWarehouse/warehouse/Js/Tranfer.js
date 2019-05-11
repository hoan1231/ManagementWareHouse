$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới điều chỉnh
     * */
    bindEventOpenAddAjustment();
    /**
     * Lấy tất cả danh sách điều chỉnh
     * */
    GetAllAjustment();

  //  Refresh();


  
});

/**
 * Lấy tất cả danh sách điều chỉnh
 * */
var tblAjustment;
function GetAllAjustment() {
    if (tblAjustment) {
        tblAjustment.destroy();
        $('#tbdAjustment').empty();
    }
          tblAjustment = $('table#tblAjustment').DataTable({
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
function bindEventOpenAddAjustment() {
    $("#modalAdd").click(function (e) {
        e.preventDefault();
        var itemCfAddAjustment = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Thêm mới điều chỉnh',
            type: 'blue',
            columnClass: 'x-large',
            content: '' +
                '<div class="row no-margin"><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Ngày</label>' +
                '<input type="text" id="txtContactPhone" placeholder="Nhập ngày" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Số tham chiếu</label>' +
                '<input type="text" id="txtNameAjustment" placeholder="Nhập số tham chiếu" class="form-control input-sm" /></div>' +
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
                    btnClass: 'btn-blue btn-add-Ajustment',
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



    //$("#AddAjustment").click(function () {
    //    var compa = new Object();
    //    compa.Ajustment = $("input[id$='txtNameAjustment']").val();
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
    //        url: "/api/Ajustment/AddAjustment",
    //        dataType: "json",
    //        data: compa
    //        , success: function (msg) {
    //            console.log(msg.value);
    //            if (msg.value == "ok") {
    //                alert("thêm mới thành công");
    //            }
    //            Refresh();
    //            GetAllAjustment();
    //        }
    //        , complete: function () {
    //        }
    //    });
    //});




}

/**
 * Kiểm tra nhập liệu thông tin điều chỉnh
 * @param {any} item Ajustment
 * @returns {any} true/false
 */
function validateInputAjustment(item) {
    if (item.AjustmentCode && item.AjustmentCode.length !== 5) {
        $.alert({
            title: 'Cảnh báo!',
            type: 'red',
            icon: 'fa fa-warning',
            content: '<code>Mã định danh điều chỉnh yêu cầu 5 ký tự.</code>'
        });
        return false;
    }
    if (!item.AjustmentName || !item.DBServer || !item.AjustmentCode ||
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
 * Lấy các thông tin điều chỉnh nhập vào
 * @param {any} $control item
 * @returns {any} item Ajustment
 */
function getAjustmentInput($control) {
    var compa = new Object();
    compa.AjustmentName = $control.$content.find('#txtNameAjustment').val();
    compa.AjustmentEmail = $control.$content.find('#txtContactEmail').val();
    compa.ContactName = $control.$content.find('#txtContactName').val();
    compa.ContactPhone = $control.$content.find('#txtContactPhone').val();
    compa.DBServer = $control.$content.find('#txtIPServerName').val();
    compa.AjustmentCode = $control.$content.find('#txtAjustmentCode').val().toUpperCase();
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