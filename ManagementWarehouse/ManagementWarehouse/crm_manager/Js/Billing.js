$(function () {

});


function GetAllCompany() {
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