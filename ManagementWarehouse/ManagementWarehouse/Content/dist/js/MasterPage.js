var tokenKey = 'accessTokenCRM_Finance';
var token = localStorage.getItem(tokenKey);
//var headers = new Headers();

var itemConfirmExit;
jQuery.ajaxSetup({
    //headers: headers,
    beforeSend: function (xhr) {
        if (token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        if (jqXHR.status === 404) {
            alert("Element not found.");
        } else if (jqXHR.status === 401) {
            localStorage.removeItem(tokenKey);
            if (!itemConfirmExit) itemConfirmExit = $.confirm({
                type: 'red',
                title: '<i class="fa fa-warning fa-lg text-red"> Thông báo',
                content: 'Phiên đăng nhập kết thúc!',
                buttons: {
                    somethingElse: {
                        text: 'Đăng nhập lại',
                        btnClass: 'btn-blue',
                        keys: ['enter', 'shift'],
                        action: function () {
                            location.href = '/?ReturnUrl=' + window.location.pathname + window.location.search;
                        }
                    }
                }
            });
        } else if (jqXHR.status === 403) {
            localStorage.removeItem(tokenKey);
            location.href = '/err/forbidden/?ReturnUrl=' + window.location.pathname + window.location.search;
        } else if (jqXHR.status === 500) {
            alert(textStatus);
        } else {
            toastr.warning(jqXHR.responseJSON, 'Cảnh báo');
        }
    }
});


function formatState(state) {
    if (!state.id) { return state.text; }
    var $state = $(
        '<span><i class="fa fa-caret-right" /> ' + state.text + '</span>'
    );
    return $state;
}

function formatState_Style1(state) {
    if (!state.id) { return state.text; }
    var $state = $(
        '<span><i class="fa fa-black-tie" /> ' + state.text + '</span>'
    );
    return $state;
}

$(function () {
    //Lấy thông tin menu
    GetChildMenus();

    $('.user-panel div.info > p, li.user-menu > a > span, li.user-menu > a > span').html(localStorage.getItem("FullName"));
    $('li.user-menu > ul > li > p.name').html('*** ' + localStorage.getItem("FullName") + ' - ' + localStorage.getItem("UserName") + ' ***');
    $('li.user-menu > ul > li > p.department > small').html(localStorage.getItem("Department"));

    var ihref = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
    $('[data-toggle="tooltip"]').tooltip();
    //iCheck for checkbox and radio inputs
    $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
        checkboxClass: 'icheckbox_minimal-blue',
        radioClass: 'iradio_minimal-blue'
    });
    //Red color scheme for iCheck
    $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass: 'iradio_minimal-red'
    });
    //Flat red color scheme for iCheck
    $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });

    $(".select2").select2({
        templateResult: formatState,
        language: {
            noResults: function (params) {
                return "Không có kết quả!";
            }
        }
    });

    $(".select2-style1").select2({
        templateResult: formatState_Style1,
        language: {
            noResults: function (params) {
                return "Không có kết quả!";
            }
        }
    });

    $.datepicker.setDefaults($.datepicker.regional['vi']);

    $('.input-datepicker-19302018').datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: '1930:2018',
        dateFormat: 'dd/mm/yy',
        lang: 'vn'
    });
    $('.input-datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
        dateFormat: 'dd/mm/yy',
        lang: 'vn'
    });

    $('.input-date-noyear').datepicker({ changeYear: false, dateFormat: 'dd/mm' });

    $('.input-datetimepicker').datetimepicker({
        format: 'd/m/Y H:i:s'
    });
    $('.input-datetimepicker-ddMMyyhhmm').datetimepicker({
        format: 'd/m/Y H:i'
    });
});

function GetChildMenus() {
    var records = localStorage.getItem('menuTokenCRM_Finance');
    if (!records) {
        $.ajax({
            type: "GET",
            url: "/api/Account/GetMenuByUserId",
            datatype: "json",
            success: function (msg) {
                localStorage.setItem('menuTokenCRM_Finance', JSON.stringify(msg.value));
                bindDataMenu(msg.value);
            }
        });
    } else {
        bindDataMenu(JSON.parse(records));
    }
}

function bindDataMenu(records) {
    if (records) {
        debugger;
        for (var i = 0; i < records.length; i++) {
            records[i] = cleanObject(records[i]);
            $('.menu-item').each(function (idx, val) {
                if (records[i].ParentId === $(val).attr('id')) {
                    var isactive = "";
                    if (records[i].MenuUrl.trim().toLowerCase() === window.location.pathname.trim().toLowerCase()) {

                        isactive = "active";
                        $('#' + records[i].ParentId).parent().addClass("active");
                        $('#' + records[i].ParentId).addClass('active menu-open');

                        //Xử lý menu
                        $('.content-header > h1').html("<i class='fa fa-folder-open-o'></i>  " + records[i].MenuName + "<small>" + records[i].Note + "</small>");
                        var bec = $('.content-header > ol.breadcrumb');
                        bec.html('');
                        bec.append('<li><a href="#"><i class="fa fa-dashboard"></i>' + records[i].MenuNameParent + '</a></li>');
                        bec.append('<li><a href="#">' + records[i].MenuName + '</a></li>');
                    }
                    var html = '<li class="' + isactive + '"><a href="' + records[i].MenuUrl + '"><i class="fa fa-circle-o"></i>' + records[i].MenuName + '</a></li>';
                    $(val).append(html);
                }
            });
        }
    }
    var itemUl = $('ul.treeview-menu.menu-item');
    for (var i = 0; i < itemUl.length; i++) {
        var number = $(itemUl[i]).children('li').length;
        var itemParent = $(itemUl[i]).parent();
        var itemA = itemParent.children('a')[0];
        var itemSpan = $(itemA).children('span.pull-right-container');
        var itemSmall = $(itemSpan).children('small');
        $(itemSmall).html(number);
    }
}

/**
 * set những trường null  = ''
 * @param {any} obj item
 * @returns {any} item item
 */
function cleanObject(obj) {
    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            obj[propName] = '';
        }
    }
    return obj;
}

// sự kiện logout
function logOutMaster() {
    $.ajax({
        type: 'POST',
        url: '/api/Account/Logout'
    }).done(function (data) {
        localStorage.removeItem(tokenKey);
        location.href = '/';
    });
}
