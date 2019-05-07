$(function () {
    /**
     * Thiết lập cây danh mục
     * */
    bindDataToTree();
    /**
     * bind lại event cho các nút trên lưới cattype
     * 
     * */
    bindEvent4toolsInCatypeGrid();
    /**
     * bind lại event cho các nút trên lưới category
     * 
     * */
    bindEvent4toolsInCategoryGrid();
    /**
     * Sự kiện hủy cập nhật, quay lại màn hình thêm mới danh mục
     * */
    bindEventCancelUpdateCatType();
    /**
    * Sự kiện cập nhật CatTypeName
    * */
    bindEventUpdateCatTypeName();
    /**
     * Sự kiện nhập tên danh mục
     * */
    bindEventtxtName();
    /**
     * Sự kiện thêm mới CatType
     * */
    bindEventAddNewCatType();
    /**
     * Sự kiện thêm mới Category
     * */
    bindEventAddNewCategory();
    /**
     * Sự kiện cập nhật category
     * */
    bindEventUpdateCategory();
    /**
     * Sự kiện ấn Enter thêm danh mục
     * */
    bindEventEnterCreateCategory();
});


/**
 * Sự kiện ấn Enter thêm danh mục
 * */
function bindEventEnterCreateCategory() {
    $('.category-panel').keypress(function (event) {
        var keycode = event.keyCode ? event.keyCode : event.which;
        if (keycode === 13) {
            if ($('#btnAddCategory').is(":visible")) $('#btnAddCategory').trigger('click');
            else if ($('#btnUpdateCategory').is(":visible")) $('#btnUpdateCategory').trigger('click');
        }
    });
}


/**
 * Thiết lập cây danh mục
 * */
var tblCatType; var tblCategory;
function bindDataToTree() {
    $('#ajax').jstree({
        'core': {
            'themes': {
                'name': 'proton',
                'responsive': true
            },
            'data': {
                "type": "GET",
                "url": "/api/Category/GetAllCatType4Tree",
                "dataType": "json"
            }
        }
    });
    /**
     * Sự kiện load tree
     * */
    bindEventLoadTree();
    /**
     * Sự kiện click vào cattype trên trê
     * */
    bindEventSlectNode();
}

/**
 * Sự kiện load tree
 * */
function bindEventLoadTree() {
    $('#ajax').bind('loaded.jstree', function (node, ref) {
        var allNode = $('#ajax').jstree(true).get_json('#', { flat: true });
        var dataineed = [];
        $.each(allNode, function (idx, val) {
            if (val.data.CatTypeCode) dataineed.push(val.data);
        });
        if (tblCatType) {
            tblCatType.destroy();
            tblCatType = undefined;
            $('#tbdCatType').empty();
        }
        bindDataTotblCatType(dataineed);

    }).jstree();
}

/**
 * Sự kiện click vào cattype trên trê
 * */
function bindEventSlectNode() {
    $("#ajax").bind("select_node.jstree", function (evt, val) {
        console.log(val);
        /**
         * Hàm xóa nội dung nhập category
         * */
        clearInputCategory();
        var item = val.node.data;
        if (item && item.CatTypeCode) {
            $('.category-panel').show();
            $('.cattype-panel').hide();
            $('code#lblTitle').html(item.CatTypeName + ' (' + item.CatTypeCode + ')');
            $('#txtCatCode').val(item.CatTypeCode);

            changeStatus(val.node.id, 'disable');
            /**
             * Lấy danh sách category theo cattype
             */
            GetCategoryByCatTypeCode(item.CatTypeCode, val.node.id);
        } else {
            $('.category-panel').hide();
            $('.cattype-panel').show();
        }
    });
}

/**
 * Hàm xóa nội dung nhập category
 * */
function clearInputCategory() {
    $('#txtCatCode').val('');
    $('#txtCatName').val('');
    $('#txtDes').val('');
}


/**
 * Lấy danh sách category theo cattype
 * @param {any} cattypecode item
 * @param {any} nodeid item
 */
function GetCategoryByCatTypeCode(cattypecode, nodeid) {
    $.ajax({
        type: "GET",
        url: "/api/Category/GetCategoryByCatTypeCode?catTypeCode=" + cattypecode,
        dataType: "json",
        success: function (msg) {
            if (msg.value) {
                bindDataTotblCategory(msg.value);
                $('#btnAddCategory').attr('typeCode', cattypecode).show();
                $('#btnUpdateCategory').attr('typeCode', cattypecode);
                $('#btnUpdateCategory, #btnCancelUpdate').hide();
            }
        }, complete: function () {
            if (nodeid) changeStatus(nodeid, 'enable');
        }
    });
}

/**
 * Sự kiện cập nhật category
 * */
function bindEventUpdateCategory() {
    $('#btnUpdateCategory').click(function (e) {
        e.preventDefault;
        var $this = $(this);
        var objs = new Object();
        objs.CatID = $this.attr('uuid');
        objs.CatTypeCode = $this.attr('typecode');
        objs.CatName = $('#txtCatName').val().trim();
        objs.CatCode = $('#txtCatCode').val().trim();
        objs.ExpandProperties = $('#txtDes').val().trim();

        if (!objs.CatID || objs.CatID === '' ||
            !objs.CatTypeCode || objs.CatTypeCode === '' ||
            !objs.CatName || objs.CatName === '') return;

        $.confirm({
            title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
            content: 'Đồng ý cập nhật danh mục: <code>' + objs.CatName + '</code>?',
            type: 'red',
            buttons: {
                confirm:
                {
                    text: "Xác nhận",
                    btnClass: "btn-blue",
                    keys: ['enter'],
                    action: function () {
                        var itemDisableds = [$this];
                        var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                        mylop.start();
                        $.ajax({
                            type: "POST",
                            url: "/api/Category/UpdateCategory",
                            data: objs,
                            dataType: "json",
                            success: function (msg) {
                                if (msg.value === 'exits')
                                    $('code.lbCategoryHelper').removeClass('text-red').html('Mã danh mục đã tồn tại.').show();
                                else if (msg.value === 'ok') {
                                    clearInputCategory();
                                    GetCategoryByCatTypeCode(objs.CatTypeCode);
                                    $('code.lbCategoryHelper').addClass('text-green').html('Cập nhật thành công.').show();
                                    setTimeout(function () {
                                        $('#txtCatCode').focus();
                                    }, 1000);
                                } else if (msg.value === 'notfound') {
                                    $('code.lbCategoryHelper').addClass('text-red').html('Không tìm thấy thông tin.').show();
                                }
                                else console.log(msg);
                            }, complete: function () {
                                mylop.stop();
                            }
                        });
                    }
                },
                cancel: {
                    text: "Hủy bỏ",
                    btnClass: "btn-default",
                    keys: ['esc'],
                    action: function (e) {
                    }
                }
            }
        });


    });
}


/**
 * Sự kiện thêm mới Category
 * */
function bindEventAddNewCategory() {
    $('#btnAddCategory').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var catTypeCode = $this.attr('typeCode');
        var name = $('#txtCatName').val();
        var code = $('#txtCatCode').val();
        if (catTypeCode === '' || code === '' || name === '') {
            $('code.lbCategoryHelper').html('Yêu cầu nhập đầy đủ thông tin.');
            return;
        }
        var objs = new Object();
        objs.CatTypeCode = catTypeCode;
        objs.CatName = name.trim();
        objs.CatCode = code.trim();
        objs.ExpandProperties = $('#txtDes').val().trim();

        $.confirm({
            title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
            content: 'Đồng ý thêm danh mục: <code>' + name + '</code>?',
            type: 'red',
            buttons: {
                confirm:
                {
                    text: "Xác nhận",
                    btnClass: "btn-blue",
                    keys: ['enter'],
                    action: function () {
                        var itemDisableds = [$this];
                        var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                        mylop.start();
                        $.ajax({
                            type: "POST",
                            url: "/api/Category/AddNewCategory",
                            data: objs,
                            dataType: "json",
                            success: function (msg) {
                                if (msg.value === 'exits')
                                    $('code.lbCategoryHelper').removeClass('text-green').html('Mã danh mục đã tồn tại.').show();
                                else if (msg.value === 'ok') {
                                    clearInputCategory();
                                    GetCategoryByCatTypeCode(objs.CatTypeCode);
                                    $('code.lbCategoryHelper').addClass('text-green').html('Thêm mới danh mục thành công.').show();
                                    setTimeout(function () {
                                        $('#txtCatCode').focus();
                                    }, 1000);
                                }
                                else console.log(msg);
                            }, complete: function () {
                                mylop.stop();
                            }
                        });
                    }
                },
                cancel: {
                    text: "Hủy bỏ",
                    btnClass: "btn-default",
                    keys: ['esc'],
                    action: function (e) {
                    }
                }
            }
        });


    });
}

/**
 * bind dữ liệu vào lưới category
 * @param {any} item item
 */
function bindDataTotblCategory(item) {
    console.log(item);
    if (tblCategory) {
        tblCategory.destroy();
        tblCategory = undefined;
        $('#tbdCategory').empty();
    }
    for (var i = 0; i < item.length; i++) {
        var htm = '<tr><td>' + (i + 1) + '</td><td>' + item[i].CatName + '</td><td>' + item[i].CatCode + '</td>' +
            '<td><i class="fa fa-edit fa-lg text-green mp-pointer-st" des="' + item[i].ExpandProperties +
            '" name="' + item[i].CatName + '" code="' + item[i].CatCode + '" uuid="' + item[i].CatID + '" title="Edit"></i></td>' +
            '<td><i class="fa fa-trash-o fa-lg text-red mp-pointer-st" name="' + item[i].CatName +
            '" code="' + item[i].CatCode + '" title="Delete"></i></td></tr>';
        $('#tbdCategory').append(htm);
    }
    tblCategory = $('table.tblCategory').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "pageLength": 10
    });
}


/**
 * bind dữ liệu vào lưới cattype
 * @param {any} item item
 */
function bindDataTotblCatType(item) {
    if (tblCatType) {
        tblCatType.destroy();
        tblCatType = undefined;
        $('#tbdCatType').empty();
    }
    $('#ddlPhanNhom').select2('destroy').empty();
    for (var i = 0; i < item.length; i++) {
        var htm = '<tr><td>' + (i + 1) + '</td><td>' + item[i].CatTypeCode + '</td><td>' + item[i].CatTypeName + '</td>' +
            '<td><i class="fa fa-edit fa-lg text-green mp-pointer-st" name="' + item[i].CatTypeName + '" code="' + item[i].CatTypeCode + '" title="Edit"></i></td>' +
            '<td><i class="fa fa-trash-o fa-lg text-red mp-pointer-st" name="' + item[i].CatTypeName + '" code="' + item[i].CatTypeCode + '" title="Delete"></i></td></tr>';
        $('#tbdCatType').append(htm);
        //Comboxbox
        $('#ddlPhanNhom').append('<option value="' + item[i].CatTypeCode + '">' + item[i].CatTypeName + '</option>');

    }
    tblCatType = $('table.tblCatType').DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "pageLength": 10
    });
    $('#ddlPhanNhom').prepend('<option selected="selected" value = "" > -Chọn -</option > ');
    $('#ddlPhanNhom').select2();
}

/**
 * bind lại event cho các nút trên lưới cattype
 * 
 * */
function bindEvent4toolsInCatypeGrid() {
    $('table.tblCatType').on('draw.dt', function () {
        //Cập nhật CatTypeName
        $('table.tblCatType i.fa-edit').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var code = $this.attr('code');
            var name = $this.attr('name');
            if (code === '' || name === '') return;
            $('.PhanNhom-panel').hide();

            $('#txtName').val(name);
            $('div.cattype-panel .update').html('Cập nhật: <code>' + name + '</code>').show();
            $('div.cattype-panel .add').hide();
            $('button#btnAddNewCatType').hide();
            $('button#btnUpdateCatType').attr('code', code).show();
            $('button#btnCancelUpdateCatType').show();
        });
        //Xóa danh mục
        $('table.tblCatType i.fa-trash-o').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var code = $this.attr('code');
            var name = $this.attr('name');
            if (code === '' || name === '') return;
            var objs = new Object();
            objs.CatTypeCode = code;

            $.confirm({
                title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
                content: 'Đồng ý xóa danh mục: <code>' + name + '</code>',
                type: 'red',
                buttons: {
                    confirm:
                    {
                        text: "Xác nhận",
                        btnClass: "btn-blue",
                        action: function () {
                            $.ajax({
                                type: "POST",
                                url: "/api/Category/DeleteCateType",
                                data: objs,
                                dataType: "json",
                                success: function (msg) {
                                    if (msg.status === 'notfound') $('code.lbCatTypeHelper').removeClass('text-green').html('Không tìm thấy danh mục.').show();
                                    else if (msg.status === 'ok') {
                                        $('code.lbCatTypeHelper').addClass('text-green').html('Xóa danh mục thành công.').show();
                                        $('#ajax').jstree("destroy").empty();
                                        bindDataToTree();
                                    }
                                    else console.log(msg);
                                }
                            });
                        }
                    },
                    cancel: {
                        text: "Hủy bỏ",
                        btnClass: "btn-default",
                        action: function (e) {
                        }
                    }
                }
            });

        });
    });
}

/**
 * bind lại event cho các nút trên lưới category
 * 
 * */
function bindEvent4toolsInCategoryGrid() {
    $('table.tblCategory').on('draw.dt', function () {
        //Cập nhật CatTypeName
        $('tbody#tbdCategory i.fa-edit').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var uuid = $this.attr('uuid');
            var code = $this.attr('code');
            var name = $this.attr('name');
            var des = $this.attr('des');
            if (uuid === '' || code === '' || name === '') return;

            $('#txtName').val(name);
            $('div#lblTitle').html('<code>' + name + '</code>').show();
            $('#btnAddCategory').hide();
            $('#btnUpdateCategory, #btnCancelUpdate').show();
            $('#btnUpdateCategory').attr('uuid', uuid);
            $('#txtCatCode').val(code);
            $('#txtCatName').val(name);
            $('#txtDes').val(des);


            $('div.cattype-panel .add').hide();
            $('button#btnAddNewCatType').hide();
            $('button#btnUpdateCatType').attr('uuid', uuid).show();
            $('button#btnCancelUpdateCatType').show();
        });
        //Xóa danh mục
        $('tbody#tbdCategory i.fa-trash-o').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var code = $this.attr('code');
            var name = $this.attr('name');
            if (code === '' || name === '') return;
            var objs = new Object();
            objs.CatCode = code;

            $.confirm({
                title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
                content: 'Đồng ý xóa danh mục: <code>' + name + '</code>',
                type: 'red',
                buttons: {
                    confirm:
                    {
                        text: "Xác nhận",
                        btnClass: "btn-blue",
                        action: function () {
                            $.ajax({
                                type: "POST",
                                url: "/api/Category/DeleteCategory",
                                data: objs,
                                dataType: "json",
                                success: function (msg) {
                                    if (msg.status === 'notfound')
                                        $('code.lbCategoryHelper').removeClass('text-green').html('Không tìm thấy danh mục.').show();
                                    else if (msg.status === 'ok') {
                                        $('code.lbCategoryHelper').addClass('text-green').html('Xóa danh mục thành công.').show();
                                        $('#ajax').jstree("destroy").empty();
                                    }
                                    else console.log(msg);
                                }
                            });
                        }
                    },
                    cancel: {
                        text: "Hủy bỏ",
                        btnClass: "btn-default",
                        action: function (e) {
                        }
                    }
                }
            });

        });
    });
}

/**
 * Sự kiện hủy cập nhật, quay lại màn hình thêm mới danh mục
 * */
function bindEventCancelUpdateCatType() {
    $('button#btnCancelUpdateCatType').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        $('#txtName').val('');
        $('div.cattype-panel .update').hide();
        $('div.cattype-panel .add').show();
        $('button#btnAddNewCatType').show();
        $('button#btnUpdateCatType').attr('code', '').hide();
        $('button#btnCancelUpdateCatType').hide();
        $('.PhanNhom-panel').show();
    });
}

function bindEventCancelUpdateCategory() {
    $('button#CancelUpdateCategory').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        $('#txtName').val('');
        $('div.cattype-panel .update').hide();
        $('div.cattype-panel .add').show();
        $('button#btnAddNewCatType').show();
        $('button#btnUpdateCatType').attr('code', '').hide();
        $('button#btnCancelUpdateCatType').hide();
        $('.PhanNhom-panel').show();
    });
}
/**
 * Sự kiện thêm mới CatType
 * */
function bindEventAddNewCatType() {
    $('button#btnAddNewCatType').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var name = $('#txtName').val();
        var code = $('#ddlPhanNhom').val();
        if (name === '') {
            $('code.lbCatTypeHelper').removeClass('text-green').html('Yêu cầu nhập đầy đủ thông tin.');
            return;
        }
        var objs = new Object();
        objs.CatTypeName = name;
        objs.CatTypeCode = code;

        $.confirm({
            title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
            content: 'Đồng ý thêm danh mục: <code>' + name + '</code>',
            type: 'red',
            buttons: {
                confirm:
                {
                    text: "Xác nhận",
                    btnClass: "btn-blue",
                    action: function () {
                        var itemDisableds = [$this];
                        var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                        mylop.start();
                        $.ajax({
                            type: "POST",
                            url: "/api/Category/AddNewCatType",
                            data: objs,
                            dataType: "json",
                            success: function (msg) {
                                if (msg.status === 'exits') $('code.lbCatTypeHelper').removeClass('text-green').html('Mã danh mục đã tồn tại.').show();
                                else if (msg.status === 'ok') {
                                    $('code.lbCatTypeHelper').addClass('text-green').html('Thêm mới danh mục thành công.').show();
                                    $('#ajax').jstree("destroy").empty();
                                    bindDataToTree();
                                }
                                else console.log(msg);
                                //changeStatus(val.node.id, 'enable');
                            }, complete: function () {
                                mylop.stop();
                            }
                        });
                    }
                },
                cancel: {
                    text: "Hủy bỏ",
                    btnClass: "btn-default",
                    action: function (e) {
                    }
                }
            }
        });

    });
}

/**
 * Sự kiện cập nhật CatTypeName
 * */
function bindEventUpdateCatTypeName() {
    $('button#btnUpdateCatType').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        var name = $('#txtName').val();
        if (name && name === '') {
            $('code.lbCatTypeHelper').removeClass('text-green').html('Yêu cầu nhập loại danh mục.');
            return;
        }
        var code = $this.attr('code');
        if (code === '' || name === '') return;

        var objs = new Object();
        objs.CatTypeName = name;
        objs.CatTypeCode = code;

        $.confirm({
            title: '<i class="fa fa-question-circle fa-lg text-red"></i> Yêu cầu xác nhận',
            content: 'Đồng ý thay đổi thông tin danh mục?',
            type: 'red',
            buttons: {
                confirm:
                {
                    text: "Xác nhận",
                    btnClass: "btn-blue",
                    action: function () {
                        var itemDisableds = [$this];
                        var mylop = new myMpLoop($this, 'Đang xử lý', $this.html(), itemDisableds);
                        mylop.start();
                        $.ajax({
                            type: "POST",
                            url: "/api/Category/UpdateCateTypeName",
                            data: objs,
                            dataType: "json",
                            success: function (msg) {
                                if (msg.status === 'exits') $('code.lbCatTypeHelper').removeClass('text-green').html('Trùng tên danh mục.').show();
                                else if (msg.status === 'notfound') $('code.lbCatTypeHelper').removeClass('text-green').html('Không tìm thấy loại danh mục.').show();
                                else if (msg.status === 'ok') {
                                    $('code.lbCatTypeHelper').addClass('text-green').html('Cập nhật thành công.').show();
                                    $('#ajax').jstree("destroy").empty();
                                    bindDataToTree();
                                }
                                else console.log(msg);
                                //changeStatus(val.node.id, 'enable');
                            }, complete: function () {
                                mylop.stop();
                            }
                        });
                    }
                },
                cancel: {
                    text: "Hủy bỏ",
                    btnClass: "btn-default",
                    action: function (e) {
                    }
                }
            }
        });
    });
}

/**
 * Sự kiện nhập tên danh mục
 * */
function bindEventtxtName() {
    $('#txtName').change(function (e) {
        e.preventDefault();
        $('code.lbCatTypeHelper').hide();
    });
}

/**
 * enable/disable node trên cây danh mục
 * @param {any} node_id item
 * @param {any} changeTo item
 */
function changeStatus(node_id, changeTo) {
    var node = $("#ajax").jstree().get_node(node_id);
    if (changeTo === 'enable') {
        $("#ajax").jstree().enable_node(node);
        node.children.forEach(function (child_id) {
            changeStatus(child_id, changeTo);
        });
    } else {
        $("#ajax").jstree().disable_node(node);
        node.children.forEach(function (child_id) {
            changeStatus(child_id, changeTo);
        });
    }
}



