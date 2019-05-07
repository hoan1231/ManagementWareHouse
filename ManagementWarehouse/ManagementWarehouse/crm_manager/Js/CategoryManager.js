$(function () {
    //Sự kiện thêm mới Cattype
    bindEventAddNewCatType();
    $('table.tblCatType').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "pageLength": 15
    });
});

//Sự kiện thêm mới Cattype
function bindEventAddNewCatType() {
    $('#btnAddNewCatType').click(function (e) {
        e.preventDefault();

        var catType = new Object();
        catType.CatTypeName = $('input[id$="txtName"]').val().trim();
        catType.CatTypeCode = $('select[id$="ddlPhanNhom"]').val();
        if (catType.CatTypeName === '') {
            toastr.warning('Yêu câu nhập loại danh mục.', "Thông báo!");
            return;
        }
        var $this = $(this);
        $.confirm({
            type: 'blue',
            title: 'Xác nhận.',
            autoClose: 'alphabet|8000',
            content: '<code>Đồng ý thêm danh mục: ' + catType.CatTypeName + ' ?</code>',
            buttons: {
                alphabet: {
                    text: 'Hủy',
                    keys: ['esc'],
                    action: function () {
                    }
                },
                somethingElse: {
                    text: 'Đồng ý',
                    btnClass: 'btn-blue',
                    keys: ['enter', 'shift'],
                    action: function () {
                        var itemDisableds = [$this];
                        var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                        mylop.start();
                        var ajaxData = "{catType:" + JSON.stringify(catType) + "}";
                        $.ajax({
                            type: "POST",
                            url: "/crm_manager/Services/CategoryManagerService.asmx/AddNewCatType",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: ajaxData,
                            success: function (msg) {
                                if (msg.d.status === 'err-login') {
                                    $.confirm({
                                        type: 'red',
                                        title: 'Thông báo',
                                        content: 'Phiên đăng nhập kết thúc!',
                                        buttons: {
                                            somethingElse: {
                                                text: 'Đăng nhập lại',
                                                btnClass: 'btn-blue',
                                                keys: ['enter', 'shift'],
                                                action: function () {
                                                    location.reload();
                                                }
                                            }
                                        }
                                    });
                                } else {
                                    location.reload();
                                }
                            },
                            complete: function () {
                                mylop.stop();
                            }
                        });
                    }
                }
            }
        });
    });
}
