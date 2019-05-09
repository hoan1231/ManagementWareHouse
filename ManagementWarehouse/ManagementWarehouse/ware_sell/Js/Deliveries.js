$(document).ready(function () {
    GetAllDeliveries();
});

/**
 * Lấy tất cả danh sách giao hàng
 * */
var tblDeliveries;
function GetAllDeliveries() {
    if (tblDeliveries) {
        tblDeliveries.destroy();
        $('#tbdDeliveries').empty();
    }
    tblDeliveries = $('table#tblDeliveries').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "pageLength": 10
    });
}
