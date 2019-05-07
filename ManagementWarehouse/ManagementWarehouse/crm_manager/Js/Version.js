$(function () {
    GetAllVersion();
    bindEvent_btn_add();
});

//load lên lưới khi vào trang
function GetAllVersion() {
    $('#tbdVersion').html('');
    $.ajax({
        type: "POST",
        url: '/crm_manager/services/VersionService.asmx/GetAllVersion',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: '{}',
        success: function (msg) {
            if (msg.d.status === "ok")
                bindDataToTable(msg.d.value);
        }, error: function (msg) {
            alert('Có lỗi xảy ra.\nVui lòng thử lại');
            location.reload();
        }
    });
}
function bindDataToTable(item) {
    for (var i = 0; i < item.length; i++) {
        cleanObject(item[i]);
        var _CreatedDate = '';
        if (item[i].CreatedDate) {
            item[i].CreatedDate = new Date(parseInt(item[i].CreatedDate.substr(6)));
            _CreatedDate = formatDate(item[i].CreatedDate, 'dd/MM/yyyy');
        }
        var html = '<tr class="tr-version"><td>' + (i + 1) + '</td><td>' + item[i].Version + '</td><td>' + _CreatedDate + '</td>';
        html += '<td>' + item[i].VersionContent + '</td></tr>';
        $('#tbdVersion').append(html);
    }

    if (item && item.length > 0) {
        var pageSize = item.length / 5;
        if (pageSize < 1) pageSize = 1;
        if (item.length % 5 > 1) pageSize += 1;
        pagiWsTab = $('#pagi2').twbsPagination({
            totalPages: pageSize,
            visiblePages: 4,
            onPageClick: function (event, page) {
                $(".tr-version").hide();
                $(".tr-version").each(function (n) {
                    if (n >= 5 * (page - 1) && n < 5 * page)
                        $(this).show();
                });
            }
        });
    }
}

//khi click nút thêm mới
function bindEvent_btn_add() {
    $('.btn-add').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var itemCheck = validateAddNew();
        if (!itemCheck) return;

        var itemDisableds = [$this, $('.btn-export')];
        var mylop = new myMpLoop($this, 'Đang xử lý', 'Thêm mới', itemDisableds);
        mylop.start();

        $.ajax({
            type: "POST",
            url: '/crm_manager/services/VersionService.asmx/AddNewVersion',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: '{item:' + JSON.stringify(itemCheck) + '}',
            success: function (msg) {
                if (msg.d.status === "ok") {
                    alert('Thêm mới thành công');
                    location.reload();
                }
            }, error: function (msg) {
                alert('Có lỗi xảy ra.\nVui lòng thử lại');
                location.reload();
            }, complete: function () {
                mylop.stop();
            }
        });
    });
}
function validateAddNew() {
    var check = true;
    var obj = new Object();
    obj.Version = $('#txtVersion').val().trim();
    obj.CreatedDate = $('#txtDate').val().trim();
    obj.VersionContent = $('#txtContent').val().trim();
    if (obj.Version === '') {
        check = false;
        $('.sp-version-helper').html('*');
    } else {
        $('.sp-version-helper').html('');
    }
    if (obj.CreatedDate === '') {
        check = false;
        $('.sp-date-helper').html('*');
    } else {
        obj.CreatedDate = getDateFromFormat('21/07/2017', 'd/M/y');
        $('.sp-date-helper').html('');
    }
    if (obj.VersionContent === '') {
        check = false;
        $('.sp-content-helper').html('*');
    } else {
        $('.sp-content-helper').html('');
    }
    if (!check) return check;
    else return obj;
}


function cleanObject(obj) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            obj[propName] = '';
        }
    }
    return obj;
}
