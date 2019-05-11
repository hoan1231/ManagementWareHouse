$(document).ready(function () {
    /**
     * Lấy tất cả danh sách điều chỉnh
     * */
    GetAllware();
});

/**
 * Lấy tất cả danh sách điều chỉnh
 * */
var tblware;
function GetAllware() {
    if (tblware) {
        tblware.destroy();
        $('#tbdware').empty();
    }
          tblware = $('table#tblware').DataTable({
                "paging": true,
                "lengthChange": false,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": false,
                "pageLength": 10
            });
}