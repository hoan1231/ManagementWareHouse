$(document).ready(function () {
    GetAllOrderSell();
});

/**
 * Lấy tất cả danh sách đơn hàng
 * */
var tblOrderSell;
function GetAllOrderSell() {
    if (tblOrderSell) {
        tblOrderSell.destroy();
        $('#tbdOrderSell').empty();
    }
    tblOrderSell = $('table#tblOrderSell').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "pageLength": 10
    });
}
