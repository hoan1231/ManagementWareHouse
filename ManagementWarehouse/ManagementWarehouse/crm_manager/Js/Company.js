$(document).ready(function () {
    /**
     * Sự kiện mở popup thêm mới công ty
     * */
    bindEventOpenAddCompany();
    /**
     * Lấy tất cả danh sách công ty
     * */
    GetAllCompany();

    $("#chkStatus").prop("checked", true);
    var compaId = "";
    Refresh();

    $("#btnSearch").click(function (e) {
        e.preventDefault();
        GetAllCompany();
    });

    $('tbody').on('click', 'span.editCompany', function (e) {
        e.preventDefault();
        $("#btnUpdate").show();
        $("#AddCompany").hide();
        var $this = $(this);
        compaId = $this.attr('CompanyId');
        $.ajax({
            type: "POST",
            url: "/api/Company/GetCompanyById?CompaId=" + compaId + "",
            dataType: "json",
            success: function (msg) {
                var html = "";
                var item = msg.value[0];
                $("#txtNameCompany").val(item.NameCompany);
                $("#txtIPServerName").val(item.IPServerDB);
                $("#txtNameLoginDB").val(item.UserNameDB);
                $("#txtPassLoginDB").val(item.PassDB);
                $("#txtNumberAgent").val(item.NumberAgent);
                $("#txtNote").val(item.Note);
                var status = item.Status;
                $("#chkStatus").prop("checked", status);
                $("#txtIcon").val(item.Icon);
                $("#txtServerNameDB").val(item.ServerNameDB);
            }
        });
    });

    //Cập nhật công ty
    $("#btnUpdate").click(function (e) {
        e.preventDefault();
        var compa = new Object();
        compa.NameCompany = $("input[id$='txtNameCompany']").val();
        compa.IPServerDB = $("input[id$='txtIPServerName']").val();
        compa.ServerNameDB = $("input[id$='txtServerNameDB']").val();
        compa.UserNameDB = $("input[id$='txtNameLoginDB']").val();
        compa.PassDB = $("input[id$='txtPassLoginDB']").val();
        compa.NumberAgent = $("input[id$='txtNumberAgent']").val();
        compa.Status = $("#chkStatus").is(":checked");
        compa.Note = $("input[id$='txtNote']").val();
        compa.Icon = $("input[id$='txtIcon']").val();
        compa.CompanyId = compaId;
        $.ajax({
            type: "POST",
            url: "/api/Company/UpdateCompany",
            dataType: "json",
            data: compa,
            complete: function (data) {
                console.log(data.responseJSON.value.status);
                if (data.responseJSON.value.status === "ok") {
                    alert("Cập nhật thành công");
                    Refresh();
                    GetAllCompany();
                }

            }
        });
    });

    //Xóa công ty
    $('tbody').on('click', 'span.deleteCompany', function (e) {
        e.preventDefault();
        var r = confirm("Xác nhận xóa công ty");
        if (r) {
            var $this = $(this);
            compaId = $this.attr('CompanyId');
            $.ajax({
                type: "POST",
                url: "/api/Company/DeleteCompany?CompaId=" + compaId + "",
                dataType: "json",
                success: function (msg) {
                    console.log(msg);
                    $("#btnUpdate").hide();
                    $("#AddCompany").show();
                    if (msg.value.status === "ok") {
                        alert("Xóa công ty thành công");
                        Refresh();
                        GetAllCompany();
                    }
                    else alert("Tiến trình bị lỗi. Vui lòng thử lại");
                },
                complete: function (data) {
                }
            });
        }
    });

    function Refresh() {
        $("#btnUpdate").hide();
        $("#AddCompany").show();
        $("input[id$='txtNameCompany']").val('');
        $("input[id$='txtIPServerName']").val('');
        $("input[id$='txtServerNameDB']").val('');
        $("input[id$='txtNameLoginDB']").val('');
        $("input[id$='txtPassLoginDB']").val('');
        $("input[id$='txtNumberAgent']").val('');
        $("input[id$='txtNote']").val('');
        $("input[id$='txtIcon']").val('');
    }
});

/**
 * Lấy tất cả danh sách công ty
 * */
var tblCompany;
function GetAllCompany() {
    if (tblCompany) {
        tblCompany.destroy();
        $('#tbdCompany').empty();
    }
    $("#tbdCompany").html('');
    $.ajax({
        type: "POST",
        url: "/api/Company/GetAllCompany",
        dataType: "json",
        success: function (msg) {
            var html = "";
            var item = msg.value;
            for (var i = 0; i < item.length; i++) {
                item[i] = cleanObject(item[i]);
                html += "<tr><td>" + (i + 1) + "</td><td>" + item[i].NameCompany + "</td>";
                html += "<td><span class='badge bg-blue mp-pointer-st'>" + item[i].CompanyCode + "</span></td>";
                html += "<td><span class='badge bg-yellow mp-pointer-st'>" + item[i].NumberAgent + "</span></td>";
                html += "<td>" + item[i].Note + "</td>";
                html += "<td>" + item[i].CreatedBy + "</td>";
                html += "<td>" + item[i].CreatedDateStr + "</td>";
                if (item[i].Status) html += "<td><span class='badge bg-green'>Hoạt động</span></td>";
                else html += "<td><span class='badge'>Tạm dừng</span></td></tr>";
            }
            $("#tbdCompany").append(html);
            tblCompany = $('table#tblCompany').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "pageLength": 10
            });
        }
    });
}

/**
 * Sự kiện mở popup thêm mới công ty
 * */
function bindEventOpenAddCompany() {
    $("button.add-company").click(function (e) {
        e.preventDefault();
        var itemCfAddCompany = $.confirm({
            title: '<i class="fa fa-bank text-green"></i> Thêm mới công ty',
            type: 'blue',
            columnClass: 'x-large',
            content: '' +
                '<div class="row no-margin"><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Tên công ty</label>' +
                '<input type="text" id="txtNameCompany" placeholder="Nhập tên công ty" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Người liên hệ</label>' +
                '<input type="text" id="txtContactName" placeholder="Nhập tên người liên hệ" class="form-control input-sm" /></div>' +
                '</div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Số điện thoại liên hệ</label>' +
                '<input type="text" id="txtContactPhone" placeholder="Nhập số điện thoại" class="form-control input-sm" /></div>' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-12">' +
                '<div class="form-group"><label>Email</label>' +
                '<input type="text" id="txtContactEmail" placeholder="Nhập email" class="form-control input-sm" /></div>' +
                '</div></div><div class="row no-margin"><div class="col-lg-2 col-md-3 col-sm-4 col-xs-12"><div class="form-group">' +
                '<label>Mã định danh</label>' +
                '<input type="text" id="txtCompanyCode" placeholder="Với 3 ký tự. eg: MPT" class="form-control input-sm" />' +
                '</div></div><div class="col-md-3 col-sm-6 col-xs-12"><div class="form-group">' +
                '<label>Database server name</label>' +
                '<input type="text" id="txtIPServerName" placeholder="IP or Name" class="form-control input-sm" />' +
                '</div></div> <div class="col-lg-2 col-md-3 col-sm-6 col-xs-12">' +
                '<div class="form-group"><label>Số lượng Agent</label>' +
                '<input type="text" id="txtNumberAgent" placeholder="Nhập số lượng" class="form-control input-sm" />' +
                '</div></div><div class="col-lg-3 col-md-4 col-sm-6 col-xs-12"><div class="form-group">' +
                '<label>Voice server</label>' +
                '<input type="text" id="txtVoiceServer" placeholder="IP or Name" class="form-control input-sm" />' +
                '</div></div><div class="col-md-2"><div class="form-group">' +
                '<label>Trạng thái</label><span class="checkbox checkbox-success">' +
                '<input style="cursor: pointer" id="chkStatus" class="styled" type="checkbox"/>' +
                '<label for="chkStatus">Hoạt động</label>' +
                '</span></div></div></div></div><div class="col-md-12">' +
                '<div class="form-group"><label>Ghi chú</label>' +
                '<input type="text" id="txtNote" placeholder="Nội dung ghi chú" class="form-control input-sm" />' +
                '</div></div></div>',
            buttons: {
                formSubmit: {
                    text: 'Lưu thông tin',
                    btnClass: 'btn-blue btn-add-company',
                    action: function () {
                        /**
                         * Lấy các thông tin công ty nhập vào
                         * */
                        var compa = getCompanyInput(this);
                        /**
                         * Kiểm tra nhập liệu thông tin công ty
                         */
                        var checkInput = validateInputCompany(compa);
                        if (!checkInput) return false;

                        //Đăng nhập MPCC
                        var cfLoginMPCC = $.confirm({
                            title: 'Đăng nhập MPCC',
                            type: 'red',
                            content: '' +
                                '<div class="form-group">' +
                                '<label>Tài khoản</label>' +
                                '<input type="text" placeholder="Nhập tài khoản" class="userMPCC form-control" required />' +
                                '</div><div class="form-group">' +
                                '<label>Mật khẩu</label>' +
                                '<input type="text" placeholder="Nhập mật khẩu" class="passMPCC form-control" required />' +
                                '</div>',
                            buttons: {
                                formSubmit: {
                                    text: 'Đăng nhập',
                                    btnClass: 'btn-blue',
                                    action: function () {
                                        var user = this.$content.find('.userMPCC').val();
                                        var password = this.$content.find('.passMPCC').val();
                                        cfLoginMPCC.buttons.formSubmit.disable();
                                        cfLoginMPCC.buttons.cancel.disable();
                                        $.ajax({
                                            type: "POST",
                                            url: "/api/Company/LoginMPCC?user=" + user + "&password=" + password,
                                            dataType: "json",
                                            data: compa,
                                            success: function (msg) {
                                                console.log(msg.value);
                                                debugger;
                                                if (msg.value.Status === "ok") {
                                                    compa.MPCCToken = msg.value.ResponseText;
                                                    cfLoginMPCC.close();
                                                    $.confirm({
                                                        title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
                                                        content: 'Đồng ý thêm công ty: <code>' + compa.CompanyName + '</code>?',
                                                        type: 'red',
                                                        buttons: {
                                                            confirm:
                                                            {
                                                                text: "Xác nhận",
                                                                btnClass: "btn-blue",
                                                                action: function () {
                                                                    var itemDisableds = [$('button.btn-add-company')];
                                                                    var mylop = new myMpLoop($('button.btn-add-company'), 'Đang xử lý', $('button.btn-add-company').html(), itemDisableds);
                                                                    mylop.start();
                                                                    $.ajax({
                                                                        type: "POST",
                                                                        url: "/api/Company/AddCompany",
                                                                        dataType: "json",
                                                                        data: compa,
                                                                        success: function (msg) {
                                                                            console.log(msg.value);
                                                                            GetAllCompany();
                                                                            itemCfAddCompany.close();
                                                                        },
                                                                        complete: function () {
                                                                            mylop.stop();
                                                                        }
                                                                    });
                                                                }
                                                            },
                                                            cancel: {
                                                                text: "Hủy bỏ",
                                                                btnClass: "btn-default",
                                                                action: function () {
                                                                }
                                                            }
                                                        }
                                                    });

                                                }
                                                else if (msg.value.Status === 'err-login') {
                                                    $.alert(msg.value.ResponseText);
                                                } else if (msg.value.Status === 'err-system') {
                                                    $.alert(msg.value.ResponseText);
                                                }
                                            },
                                            complete: function () {
                                                cfLoginMPCC.buttons.formSubmit.enable();
                                                cfLoginMPCC.buttons.cancel.enable();
                                            }
                                        });

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



    //$("#AddCompany").click(function () {
    //    var compa = new Object();
    //    compa.Company = $("input[id$='txtNameCompany']").val();
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
    //        url: "/api/Company/AddCompany",
    //        dataType: "json",
    //        data: compa
    //        , success: function (msg) {
    //            console.log(msg.value);
    //            if (msg.value == "ok") {
    //                alert("thêm mới thành công");
    //            }
    //            Refresh();
    //            GetAllCompany();
    //        }
    //        , complete: function () {
    //        }
    //    });
    //});




}

/**
 * Kiểm tra nhập liệu thông tin công ty
 * @param {any} item company
 * @returns {any} true/false
 */
function validateInputCompany(item) {
    if (item.CompanyCode && item.CompanyCode.length !== 5) {
        $.alert({
            title: 'Cảnh báo!',
            type: 'red',
            icon: 'fa fa-warning',
            content: '<code>Mã định danh công ty yêu cầu 5 ký tự.</code>'
        });
        return false;
    }
    if (!item.CompanyName || !item.DBServer || !item.CompanyCode ||
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
 * Lấy các thông tin công ty nhập vào
 * @param {any} $control item
 * @returns {any} item company
 */
function getCompanyInput($control) {
    var compa = new Object();
    compa.CompanyName = $control.$content.find('#txtNameCompany').val();
    compa.CompanyEmail = $control.$content.find('#txtContactEmail').val();
    compa.ContactName = $control.$content.find('#txtContactName').val();
    compa.ContactPhone = $control.$content.find('#txtContactPhone').val();
    compa.DBServer = $control.$content.find('#txtIPServerName').val();
    compa.CompanyCode = $control.$content.find('#txtCompanyCode').val().toUpperCase();
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