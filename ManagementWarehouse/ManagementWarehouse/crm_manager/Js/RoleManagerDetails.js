$(document).ready(function () {
    var RoleId = $("input[id$='hidRoleId']").val();
    LoadRole(RoleId);

});
function LoadRole(item) {
    $.ajax({
        type: 'POST',
        url: '/crm_manager/Services/MenuService.asmx/LoadDetailRole',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: '{RoleId:"' + item + '"}',
        success: function (msg) {
            var objdata = $.parseJSON(msg.d);

            if (objdata != null) {
                pageSearch = new Pager('tblDetailRole', 20, objdata, 1);
                pageSearch.init();
                pageSearch.showPageNav('pageSearch', 'pageSearch');
                pageSearch.showPage(1);
            }

            //=====================
        },
        error: function () {
            return false;
        },
        complete: function () {

        }
    });
}
function pagingRole(item, from, to) {
    $('#tbdDetailRole').html('');
    for (var i = 0; i < item.length; i++) {
        if (i >= from && i < to) {
            if (item[i] != null) {
                var html = "<tr><td>" + (i + 1) + "</td>";
                html += "<td>" + item[i].AgentNumber + "</td>";
                html += "<td>" + item[i].UserName + "</td>";
                html += "<td>" + item[i].FullName + "</td>";
                html += "<td>" + item[i].RoleName + "</td>";
                html += "</tr>";
                $('#tbdDetailRole').append(html);
            }
        }
    }
}
function Pager(tableName, itemsPerPage, lstItem, type) {
    this.tableName = tableName;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.pages = 0;
    this.inited = false;
    this.listItem = lstItem;
    this.typePage = Number(type);

    this.showRecords = function (from, to) {
        if (this.typePage == 1) pagingRole(this.listItem, from, to);
    }

    this.showPage = function (pageNumber) {
        if (!this.inited) {
            alert("not inited");
            return;
        }
        this.currentPage = pageNumber;
        var from = (pageNumber - 1) * itemsPerPage;
        var to = from + itemsPerPage;
        this.showRecords(from, to);
    }

    this.prev = function (item1) {
        if (this.currentPage > 1) {
            this.showPage(Number(this.currentPage - 1));
            item1.value = this.currentPage;
        }
    }

    this.next = function (item1) {
        if (this.currentPage < this.pages) {
            this.showPage(Number(this.currentPage) + 1);
            item1.value = this.currentPage;
        }
    }

    this.init = function () {
        var records = (this.listItem.length);
        this.pages = Math.ceil(records / itemsPerPage);
        this.inited = true;
    }

    this.showPageNav = function (pagerName, positionId) {
        if (!this.inited) {
            alert("not inited");
            return;
        }
        var element = document.getElementById(positionId);
        var uuid = 'select_' + positionId;
        var pagerHtml = '<button type="button" onclick="' + pagerName + '.prev(' + uuid.toString() + ');"';
        pagerHtml += 'class="btn btn-default">&#171 Prev</button>';
        pagerHtml += "<select id='select_" + positionId + "' class='btn input-sm pg-normal'";
        pagerHtml += " style='border: 1px solid #8F9394;' onchange='" + pagerName + ".selectChangePage(" + pagerName + ", this);'>";
        for (var page = 1; page <= this.pages; page++)
            pagerHtml += "<option value='" + page + "'>" + page + "</option>";
        pagerHtml += "</select><button type='button' onclick='" + pagerName + ".next(" + uuid.toString() + ");'";
        pagerHtml += "class='btn btn-default' >Next &#187</button>";
        element.innerHTML = pagerHtml;
    }

    this.selectChangePage = function (item1, item2) {
        item1.showPage($(item2).val());
    }
}