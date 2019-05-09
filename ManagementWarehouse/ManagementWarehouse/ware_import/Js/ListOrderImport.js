$(document).ready(function () {
    GetAllOrderImport();
});

/**
 * Lấy tất cả danh sách đơn hàng
 * */
var tblOrderImport;
function GetAllOrderImport() {
    if (tblOrderImport) {
        tblOrderImport.destroy();
        $('#tbdOrderImport').empty();
    }
    tblOrderImport = $('table#tblOrderImport').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "pageLength": 10
    });
}
