$(function () {
    /**
     * Sự kiện tìm kiếm lịch sử
     * */
    bindEventSearchAndExport();
    GetDataHis($('#txtFromDate').val(), $('#txtToDate').val(), $('#btnSearch'), false);

});

var tblHis;
/**
 * Sự kiện tìm kiếm lịch sử
 * */
function bindEventSearchAndExport() {
    $('#btnSearch').click(function (e) {
        e.preventDefault();
        var from = $('#txtFromDate').val();
        var to = $('#txtToDate').val();
        if (from === '' || to === '') {
            toastr.warning("Yêu cầu nhập thời gian tìm kiếm.", "Cảnh báo");
            return;
        }
        GetDataHis(from, to, $(this), false);
    });

    $('#btnExport').click(function (e) {
        e.preventDefault();
        var from = $('#txtFromDate').val();
        var to = $('#txtToDate').val();
        if (from === '' || to === '') {
            toastr.warning("Yêu cầu nhập thời gian tìm kiếm.", "Cảnh báo");
            return;
        }
        GetDataHis(from, to, $(this), true);
    });
}

function GetDataHis(from, to, $item, $excel) {
    var $this = $item;
    if (tblHis) {
        tblHis.destroy();
        tblHis = undefined;
        $('#tbdHis').empty();
    }

    var itemDisableds = [$this];
    var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
    mylop.start();
    $.ajax({
        type: 'POST',
        url: '/api/LoginHis/GetHistory?from=' + from + '&to=' + to + '&isExport=' + $excel,
        dataType: 'json',
        success: function (msg) {
            if (msg.status === 'err-date-format') {
                toastr.warning("Sai định dạng thời gian tìm kiếm.", "Cảnh báo");
            } else if (msg.status === 'ok') {
                if (msg.value) {
                    if (!$excel) bindHis(msg.value);
                    else location.href = '/export/' + msg.value;
                }
            } else console.log(msg);

            tblHis = $('table').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "pageLength": 10
            });
        }, complete: function () {
            mylop.stop();
        }
    });
}

function bindHis(item) {
    for (var i = 0; i < item.length; i++) {
        var htm = "<tr><td>" + (i + 1) + "</td><td>" + item[i].UserName + "</td><td>" + item[i].DateLogin + "</td><td>" + item[i].Status + "</td><td>" + item[i].IP + "</td></tr>";
        $('#tbdHis').append(htm);
    }
}