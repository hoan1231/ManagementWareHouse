$(document).ready(function () {
    $("#chkStatus").prop("checked", true);
    var itemId = "";
    GetAllTypeCampaign();
    Refresh();
    $("#btnAdd").click(function () {
        var item = new Object();
        item.Name = $("input[id$='txtName']").val();
        item.LinkImage = $("input[id$='txtLinkImage']").val();
        item.IsActive = $("#chkStatus").is(":checked");
        item.Note = $("input[id$='txtNote']").val();
        console.log(item);
        $.ajax({
            type: "POST",
            url: "/api/TypeCampaign/AddTypeCampaign",
            dataType: "json",
            data: item
            , success: function (msg) {
                console.log(msg.value);
                if (msg.value.status == "ok") {
                    toastr.success("Thêm mới thành công","Thông báo");
                }
                Refresh();
                GetAllTypeCampaign();
            }
            , complete: function () {
            }
        });
    });
    var tblTypeCampaign;
    function cleanObject(obj) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                obj[propName] = '';
            }
        }
        return obj;
    }
    function GetAllTypeCampaign() {
        var item = new Object();
        if (tblTypeCampaign) {
            tblTypeCampaign.destroy();
            $('#tbdTypeCampaign').empty();
        }
        $.ajax({
            type: "GET",
            url: "/api/TypeCampaign/GetAllTypeCampaign",
            dataType: "json"
            , success: function (msg) {      
                var html = "";
                var item = msg.value.value;
            
                for (var i = 0; i < item.length; i++) {
                    item[i] = cleanObject(item[i]);
                    html += "<tr><td>"+(i+1)+"</td>";
                    html += "<td>" + item[i].Name + "</td>";
                    html += "<td>" + item[i].LinkImage + "</td>";
                    html += "<td>" + item[i].Note + "</td>"; 
                    html += "<td>" + item[i].CreatedBy+ "</td>";
                    html += "<td>" + item[i].CreatedDate+ "</td>";
                    html += "<td>" + item[i].UpdatedBy+ "</td>";
                    html += "<td>" + item[i].UpdatedDate + "</td>";
                    if (item[i].IsActive == true) html += "<td>Đang chạy</td>";
                    else html += "<td>Dừng</td>"; 
                    html += "<td><span class='editTypeCampaign'  TypeCampaignId=" + item[i].ID + "><img src='/Content/dist/Images/Edit.png' alt='edit' title='Chỉnh sửa'></span><span class='deleteTypeCampaign'  TypeCampaignId=" + item[i].ID + "> <img src='/Content/dist/Images/delete.png' alt='delete' title='Xóa'></span></td></tr>";  
                }
                $("#tbdTypeCampaign").append(html);

                tblTypeCampaign= $('table#tblTypeCampaign').DataTable({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    "pageLength": 15
                });
            }
            ,complete: function (data) {
            }
        });
    }

    $('tbody').on('click', 'span.editTypeCampaign', function (e) {
        $("#btnUpdate").show();
        $("#btnAdd").hide();
        var $this = $(this);
         itemId = $this.attr('TypeCampaignId');
        $.ajax({
            type: "POST",
            url: "/api/TypeCampaign/GetTypeCampaignById?typeId=" + itemId + "",
            dataType: "json"
            , success: function (msg) {
                var html = "";
                var item = msg.value.value;
                $("#txtName").val(item.Name);
                $("#txtLinkImage").val(item.LinkImage);
                $("#txtNote").val(item.Note);
                var status = item.IsActive;
                $("#chkStatus").prop("checked", status);
            }
            , complete: function (data) {
            }
        });
        
    });
    //Cập nhật lĩnh vực
    $("#btnUpdate").click(function () {
        var item = new Object();
        item.Name = $("input[id$='txtName']").val();
        item.LinkImage = $("input[id$='txtLinkImage']").val();
        item.IsActive = $("#chkStatus").is(":checked");
        item.Note = $("input[id$='txtNote']").val();
        item.ID = itemId;
        $.ajax({
            type: "POST",
            url: "/api/TypeCampaign/UpdateTypeCampaign",
            dataType: "json",
            data: item
            , complete: function (data) {
                if (data.responseJSON.value.status == "ok") {
                    toastr.success("Cập nhật thành công","Thông báo");
                    Refresh();
                    GetAllTypeCampaign();
                }
               
            }
        });
    });
    //Xóa lĩnh vực
    $('tbody').on('click', 'span.deleteTypeCampaign', function (e) {
        var r = confirm("Xác nhận xóa lĩnh vực");
        if (r == true) {
            var $this = $(this);
            itemId = $this.attr('TypeCampaignId');
            $.ajax({
                type: "POST",
                url: "/api/TypeCampaign/DeleteTypeCampaign?typeId=" + itemId + "",
                dataType: "json"
                , success: function (msg) {
                    console.log(msg);
                    $("#btnUpdate").hide();
                    $("#AddTypeCampaign").show();
                    if (msg.value.status == "ok") {
                        toastr.success("Xóa lĩnh vực thành công", "Thông báo");
                        Refresh();
                        GetAllTypeCampaign();
                    }
                    else toastr.warning("Tiến trình bị lỗi. Vui lòng thử lại","Thông báo");
                }
                , complete: function (data) {
                }
            });
        }
    });
    function Refresh() {
        $("#btnUpdate").hide();
        $("#btnAdd").show();
        $("input[id$='txtName']").val('');
        $("input[id$='txtLinkImage']").val('');
        $("input[id$='txtNote']").val('');
    }
});
