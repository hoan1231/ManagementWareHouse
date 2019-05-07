$(function () {
    init();
    onEventBinding();
    onLoadEmailConfig();
    onEventSaveEmail();
    onEventChecbox();
});
function init() {
    //    $('.thuSelect').hide();
}
function onEventChecbox() {
    $(".lang-checkbox").on('change', function () { // on change of state
        var id = $(this).attr("data-id");
        if (this.checked) // if changed state is "CHECKED"
        {
            $('#chkStatus'+id).prop('checked', false);
        }
        if (!this.checked) // if changed state is "CHECKED"
        {
            $(this).prop('checked', true);
        }
    });
}
function onLoadEmailConfig() {
    $.ajax({
        type: "POST",
        url: "/crm_voc/Webservices/VOCEmailManagerService.asmx/GetEmailReportAuto",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{}",
        success: function (msg) {
            if (msg.d.status === 'err-login') {
                alert("Vui lòng đăng nhập lại.");
                location.reload();
            } else if (msg.d.status === 'ok') {
                var item = msg.d.value;
                $('#txtHost').val(item.Host);
                $('#txtPost').val(item.Post);
                $('#txtEmail').val(item.IUsername);
                $('#txtPw').val(item.IPassword);
                $('#chkSSL').prop('checked', item.IsSSL);
                $('#compose_textarea').html(item.Content).wysihtml5();
                $('#compose_textarea-en').html(item.ContentEn).wysihtml5();
                $('#txtSub').val(item.SubjectEmail);
                $('#txtSubEn').val(item.SubjectEmailEn);
            } else {
                toastr.error("Lỗi load mail !");
            }
        },
        err: function () {
            toastr.error("Lỗi lấy dữ liệu !");
        }
    });
}
function onEventBinding() {
    $("#btnSubmit").click(function (e) {
        e.preventDefault();
        var listReport = $(".title-report");
        var listObject = [];
        for (var i = 0; i < listReport.length; i++) {
            id = $(listReport[i]).attr("data-id");
            idReport = $(listReport[i]).attr("data-report");
            var model = new Object();
            model.Id = id;
            model.IDReport = idReport;
            model.Name = $(listReport[i]).text();
            model.ToAddress = $(".toEmail" + idReport).val();
            model.Bcc = $(".bccEmail" + idReport).val();
            model.Cc = $(".ccEmail" + idReport).val();
            model.TypeTime = $("#ddlType" + idReport).find(":selected").val();
            model.Day = $("#listThu" + idReport).val().join();
            model.Hour = $("#listHour" + idReport).val().join();
            var lang = "vi";
            if (!$("#chkStatus" + idReport + "-vi").is(":checked")) {
                lang = ($("#chkStatus" + idReport + "-en").is(":checked")) ? "en" : lang;
            }
            model.Language = lang;
            model.IsActive = $("#chkStatus" + idReport).is(":checked");
            console.log(model);
            listObject.push(model);
        }
        var sData = JSON.stringify(listObject);
        console.log(sData);
        $.ajax({
            type: "POST",
            url: "/crm_manager/Services/SendReportAuto.asmx/SaveAutoReportConfig",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{list: " + JSON.stringify(listObject) + "}",
            success: function (msg) {
                if (msg.d.status == "ok") {
                    toastr.success("Lưu thành công !");
                    setTimeout(function () { location.reload() }, 1000);
                } else {
                    toastr.error("Xảy ra lỗi dữ liệu");
                }
            },
            error: function (err) { toastr.error("Xảy ra lỗi"); }
        })
    });
}
function onChangeType(id) {
    var slt = $("#ddlType" + id).find(":selected").val();
    if (slt === "7") {
        $(".rptThu" + id).show();
		$(".rptThu" + id + " select").select2();
    } else {
        $(".rptThu" + id).hide();
		
		
    }
}
function onEventSaveEmail() {
    $('#btnSave').click(function (e) {
        e.preventDefault();
        $this = $(this);
        //lấy object email
        var email = new Object();
        email.Type = 'Plge003';
        email.Host = $('#txtHost').val().trim();
        email.Post = $('#txtPost').val().trim();
        email.UserEmail = $('#txtEmail').val().trim();
        email.Password = $('#txtPw').val().trim();
        email.SSL = $('#chkSSL').is(":checked");
        email.Content = $('#compose_textarea').val().trim();
        email.ContentEn = $('#compose_textarea-en').val().trim();
        email.SubjectEmail = $('#txtSub').val().trim();
        email.SubjectEmailEn = $('#txtSubEn').val().trim();
        //validate email        
        var chkInput = true;
        if (email.Host == '') {
            chkInput = false;
            $('.sp-host-email-helper').html('(*)').show();
        } else $('.sp-host-email-helper').html('').hide();
        if (email.Post == '') {
            chkInput = false;
            $('.sp-post-email-helper').html('(*)').show();
        } else $('.sp-post-email-helper').html('').hide();
        if (email.UserEmail == '') {
            chkInput = false;
            $('.sp-email-email-helper').html('(*)').show();
        } else $('.sp-email-email-helper').html('').hide();
        if (email.Password == '') {
            chkInput = false;
            $('.sp-pw-email-helper').html('(*)').show();
        } else $('.sp-pw-email-helper').html('').hide();
        if (email.Content == '') {
            chkInput = false;
            $('.nav-tabs a[href="#email-vi"]').tab('show');
            $('.sp-content-email-helper').html('(*)').show();
        } else $('.sp-content-email-helper').html('').hide();
        if (email.ContentEn == '') {
            chkInput = false;
            $('.nav-tabs a[href="#email-en"]').tab('show');
            $('.sp-content-en-email-helper').html('(*)').show();
        } else $('.sp-content-en-email-helper').html('').hide();
        if (email.SubjectEmail == '') {
            chkInput = false;
            $('.sp-sub-email-helper').html('(*)').show();
        } else $('.sp-sub-email-helper').html('').hide();
        if (email.SubjectEmailEn == '') {
            chkInput = false;
            $('.nav-tabs a[href="#email-en"]').tab('show');
            $('.sp-sub-en-email-helper').html('(*)').show();
        } else $('.sp-sub-en-email-helper').html('').hide();
        if (!chkInput) { toastr.warning("Kiểm tra lại dữ liệu !"); return;}
        //lưu thông tin
        var itemDisableds = [$this];
        var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
        mylop.start();
        $.ajax({
            type: "POST",
            url: "/crm_voc/Webservices/VOCEmailManagerService.asmx/SaveEmailReportAuto",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: "{email: " + JSON.stringify(email) + "}",
            success: function (msg) {
                if (msg.d.status == 'err-login') {
                    alert("Vui lòng đăng nhập lại.");
                    location.reload();
                } else if (msg.d.status == 'ok') {
                    toastr.success("Lưu thông tin thành công !");
                } else if (msg.d.status == 'err-format') {
                    toastr.warning("Nội dung email chưa đúng định dạng !");
                    $('.sp-content-email-helper').html('*Nội dung mail chưa đúng định dạng').show();
                } else if (msg.d.status == 'err-ErrFormatEmailContentEn') {
                    toastr.warning("Email content wrong format !");
                    $('.sp-content-en-email-helper').html('*Email content wrong format.').show();
                }
            },
            complete: function () {
                mylop.stop();
            }
        });
    });
}