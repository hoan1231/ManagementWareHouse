$(document).ready(function () {
    $("#chkStatus").prop("checked", true);
    var compaId = "";
    GetCompany();
  //  Refresh();
    $("#btnAdd").click(function () {
  
        var userCompa = new Object();
        userCompa.NameCompany = $("input[id$='txt_FullName']").val();
        userCompa.IPServerDB = $("input[id$='txt_UserLogin']").val();
        userCompa.ServerNameDB = $("input[id$='txt_Pass']").val();
        userCompa.UserNameDB = $("input[id$='txt_RePass']").val();
        userCompa.PassDB = $("input[id$='txt_Email']").val();
        userCompa.NumberAgent = $("input[id$='txt_AgentNumber']").val();
        userCompa.Note = $("input[id$='txt_CCHost']").val();
        userCompa.Icon = $("input[id$='txt_CCQueue']").val();
        userCompa.Icon = $("input[id$='txt_CCTrunk']").val();
        userCompa.Icon = $("input[id$='txt_CCAgent']").val();
        userCompa.Icon = $("input[id$='txt_CCPass']").val();
        $.ajax({
            type: "POST",
            url: "/api/UserCompany/AddUserCompany",
            dataType: "json",
            data: userCompa
            , success: function (msg) {
                console.log(msg.value);
                if (msg.value == "ok") {
                    alert("thêm mới thành công");
                }
                Refresh();
                GetAllCompany();
            }
            , complete: function () {
            }
        });
    });
    $("#btnSearch").click(function () {
        GetAllCompany();
    });
    var tblCompany;
    function cleanObject(obj) {
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                obj[propName] = '';
            }
        }
        return obj;
    }
    function GetAllCompany() {
        var compa = new Object();
        if (tblCompany) {
            tblCompany.destroy();
            $('#tbdCompany').empty();
        }
        compa.NameCompany = $("input[id$='txtNameCompany']").val();
        compa.IPServerDB = $("input[id$='txtIPServerName']").val();
        compa.ServerNameDB = $("input[id$='txtServerNameDB']").val();
        compa.UserNameDB = $("input[id$='txtNameLoginDB']").val();
        compa.PassDB = $("input[id$='txtPassLoginDB']").val();
        compa.NumberAgent = $("input[id$='txtNumberAgent']").val();
        compa.Status = $("#chkStatus").is(":checked");
        compa.Note = $("input[id$='txtNote']").val();
        compa.Icon = $("input[id$='txtIcon']").val();
        $("#tbdCompany").html('');
        compa = cleanObject(compa);
        $.ajax({
            type: "POST",
            url: "/api/Company/GetAllCompany",
            dataType: "json",
            data: compa
            , success: function (msg) {      
                var html = "";
                var item = msg.value;
            
                for (var i = 0; i < item.length; i++) {
                    item[i] = cleanObject(item[i]);
                    html += "<tr><td>"+(i+1)+"</td><td>" + item[i].NameCompany+ "</td>";
                    html += "<td>" + item[i].IPServerDB + "</td>";
                    html += "<td>" + item[i].ServerNameDB + "</td>";
                    html += "<td>" + item[i].UserNameDB+ "</td>"; 
                    html += "<td>" + item[i].NumberAgent+ "</td>";
                    html += "<td>" + item[i].Icon+ "</td>";
                    html += "<td>" + item[i].Note+ "</td>";
                    html += "<td>" + item[i].CreatedBy+ "</td>";
                    html += "<td>" + item[i].CreatedDate+ "</td>";
                    html += "<td>" + item[i].UpdatedBy+ "</td>";
                    html += "<td>" + item[i].UpdatedDate + "</td>";
                    if (item[i].Status == true) html += "<td>Đang chạy</td>";
                    else html += "<td>Dừng</td>";
    
                    html += "<td><span class='editCompany'  CompanyId=" + item[i].CompanyId + "><img src='/Content/dist/Images/Edit.png' alt='edit' title='Chỉnh sửa'></span><span class='deleteCompany'  CompanyId=" + item[i].CompanyId + "> <img src='/Content/dist/Images/delete.png' alt='delete' title='Xóa'></span></td></tr>";
                  
                }
                $("#tbdCompany").append(html);

                tblCompany= $('table#tblCompany').DataTable({
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

    $('tbody').on('click', 'span.editCompany', function (e) {
        $("#btnUpdate").show();
        $("#AddCompany").hide();
        var $this = $(this);
         compaId = $this.attr('CompanyId');
        $.ajax({
            type: "POST",
            url: "/api/Company/GetCompanyById?CompaId=" + compaId + "",
            dataType: "json"
            , success: function (msg) {
                var html = "";
                var item = msg.value[0];
                $("#txtNameCompany").val(item.NameCompany);
                $("#txtIPServerName").val(item.IPServerDB);
                $("#txtNameLoginDB").val(item.UserNameDB);
                $("#txtPassLoginDB").val(item.PassDB);
                $("#txtNumberAgent").val(item.NumberAgent);
                $("#txtNote").val(item.Note);
                var status = item.Status;
                $("#chkStatus").prop("checked", status);
                $("#txtIcon").val(item.Icon); 
                $("#txtServerNameDB").val(item.ServerNameDB); 
            }
            , complete: function (data) {
            }
        });
        
    });
    //Cập nhật công ty
    $("#btnUpdate").click(function () {
        var compa = new Object();
        compa.NameCompany = $("input[id$='txtNameCompany']").val();
        compa.IPServerDB = $("input[id$='txtIPServerName']").val();
        compa.ServerNameDB = $("input[id$='txtServerNameDB']").val();
        compa.UserNameDB = $("input[id$='txtNameLoginDB']").val();
        compa.PassDB = $("input[id$='txtPassLoginDB']").val();
        compa.NumberAgent = $("input[id$='txtNumberAgent']").val();
        compa.Status = $("#chkStatus").is(":checked");
        compa.Note = $("input[id$='txtNote']").val();
        compa.Icon = $("input[id$='txtIcon']").val();
        compa.CompanyId = compaId;
        $.ajax({
            type: "POST",
            url: "/api/Company/UpdateCompany",
            dataType: "json",
            data: compa
            , complete: function (data) {
                console.log(data.responseJSON.value.status);
                if (data.responseJSON.value.status == "ok") {
                    alert("Cập nhật thành công");
                    Refresh();
                    GetAllCompany();
                }
               
            }
        });
    });
    //Xóa công ty
    $('tbody').on('click', 'span.deleteCompany', function (e) {
        var r = confirm("Xác nhận xóa công ty");
        if (r == true) {
            var $this = $(this);
            compaId = $this.attr('CompanyId');
            $.ajax({
                type: "POST",
                url: "/api/Company/DeleteCompany?CompaId=" + compaId + "",
                dataType: "json"
                , success: function (msg) {
                    console.log(msg);
                    $("#btnUpdate").hide();
                    $("#AddCompany").show();
                    if (msg.value.status == "ok") {
                        alert("Xóa công ty thành công");
                        Refresh();
                        GetAllCompany();
                    }
                    else alert("Tiến trình bị lỗi. Vui lòng thử lại");
                }
                , complete: function (data) {
                }
            });
        }
    });
    function Refresh() {
        $("#btnUpdate").hide();
        $("#AddCompany").show();
       
        $("input[id$='txtNameLogin']").val('');
        $("input[id$='txtEmail']").val('');
        $("#ddlCompany").val('');
    }

    //Load danh sách công ty
    function GetCompany() {
        $.ajax({
            type: "GET",
            url: "/api/UserCompany/GetAllCompany",
            dataType: "json"
            , success: function (msg) {
                if (msg.value.status == "ok") {
                    var item = msg.value.value;
                    var html = "";
                    for (var i = 0; i < item.length; i++) {
                        html += "<option value=" + item[i].CompanyId + ">" + item[i].NameCompany + "</option>";
                    }
                    $("#ddlCompany").append(html);
                    $("#ddlCompa").append(html);
                }
            }
            , complete: function (data) {
            }
        });
    }
});
