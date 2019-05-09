var listItemNotifi; var listItemNotifiService;
$(function () {
    var vocRoles = JSON.parse(JSON.parse(localStorage.getItem('VOCRolesKTStore')));
    console.log(vocRoles);
    //$.support.cors = true;
    //var iurl = 'https://dfis.mpcrm.vn/';
    //var iurl = 'http://192.168.1.148/';
    var iurl = 'https://localhost:44303/';
    $.connection.hub.url = iurl + 'signalr/hubs';
    var notifications = $.connection.notificationHub;
    if (token && vocRoles) {
        //Lần đầu kết nối, lấy thông tin tất cả ticket được cảnh báo đến theo quyền
        notifications.client.SendNotificationsVOCTicketsFirstTime = function (value) {
            try {
                console.log(value);
                if (value && value.length > 0) {
                    //listItemNotifi = RemoveDupTicketNotifies(value);
                    bindNotifi(value);
                }
            } catch (e) {
                console.log(e);
            }
        };

        //Lần đầu kết nối, lấy cảnh báo deadline
        notifications.client.SendOnDeadlineNotificationsVOCTicketsFirstTime = function (value) {
            try {
                if (value && value.length > 0) {
                    bindOnDeadLineNotifiToControl(value);
                }
            } catch (e) {
                console.log(e);
            }
        };

        //Lần đầu kết nối, lấy cảnh báo sắp đến hạn
        notifications.client.SendCommingDeadlineNotificationsVOCTicketsFirstTime = function (value) {
            try {
                if (value && value.length > 0) {
                    bindCommingDeadLineNotifiToControl(value);
                }
            } catch (e) {
                console.log(e);
            }
        };

        //Lấy cảnh báo có ticket mới
        notifications.client.SendNotificationVOCTicket = function (value) {
            try {
                console.log("Có ticket mới");
                console.log(value);
                bindNotifi([value]);
            } catch (e) {
                console.log(e);
            }
        };

        //Lấy cảnh báo sắp đến hạn
        notifications.client.SendCommingDeadlineVOCTicket = function (value) {
            try {
                console.log("sắp đến hạn");
                bindCommingDeadLineNotifiToControl([value]);
            } catch (e) {
                console.log(e);
            }
        };

        //Lấy cảnh báo quá hạn
        notifications.client.SendOnDeadlineVOCTicket = function (value) {
            try {
                console.log("quá hạn");
                console.log(value);
                bindOnDeadLineNotifiToControl([value]);
            } catch (e) {
                console.log(e);
            }
        };



        //nhận thông tin các lần sau
        notifications.client.SendNotificationsVOCTicketsSecondTime = function (value) {
            try {
                listItemNotifi.push(value);
                listItemNotifi = RemoveDupTicketNotifies(listItemNotifi);
                bindOneNotifyRinging(value);
            } catch (e) {
                console.log(e);
            }
        };

        //xóa thông tin notify cho trường hợp cập nhật ticket
        notifications.client.removeNotifyTicketChangeDepartment = function (value) {
            try {
                listItemNotifi = listItemNotifi.filter(function (el) {
                    return el.TicketID !== value;
                });
                removeOneNotifyRinging(value);
            } catch (e) {
                console.log(e);
            }
        };

        //Nhận thông tin notify cho trường hợp cập nhật ticket
        notifications.client.addWhichNotifyremovedNotifyTicketChangeDepartment = function (value) {
            console.log(value);
            try {
                listItemNotifi.push(value);
                listItemNotifi = RemoveDupTicketNotifies(listItemNotifi);
                bindOneNotifyRinging(value);
            } catch (e) {
                console.log(e);
            }
        };

        $.connection.hub.qs = {
            'IsReceive': vocRoles.IsReceive, 'IsHandler': vocRoles.IsHandler,
            'IsConfirm': vocRoles.IsConfirm, 'IsAdmin': vocRoles.IsAdmin,
            'UserName': vocRoles.UserName
        };

        $.connection.hub.start().done(function (e) {
        }).fail(function (e) {
            alert(e);
        });

    }
});



function bindNotifi(item) {
    $('.notify-ringing-number').html(item.length);
    $('.notify-ringing-number-member').html('<code>Bạn có ' + item.length + ' thông báo!</code>');

    var itemHasClosedNotifi = [];
    $('li.li-notifi-inside').filter(function () {
        var ticketIdExit = $(this).attr('ticket-id');
        var ticketStatusexit = $(this).attr('ticket-status');
        var ticketBy = $(this).attr('ticket-by');
        var itemNotSame = item.filter(function (p) {
            return p.TicketID === ticketIdExit;
        });
        //Xóa bỏ dòng trên thông báo nếu không tồn tại ở list nhận được
        //trường hợp đóng sự vụ sẽ xóa đi trên server
        if (itemNotSame.length === 0) {
            $(this).remove();
            var obje = new Object();
            obje.ticketBy = ticketBy;
            obje.ticketId = $(this).attr('ticket-id');
            var itemClosedNoti = itemHasClosedNotifi.filter(function (p) {
                return p.ticketId === obje.ticketId;
            });
            if (itemClosedNoti.length === 0) itemHasClosedNotifi.push(obje);
        }
        else {//nếu có tồn tại ở list nhận được, vì ticketid chỉ có 1 nên lấy phần từ đầu tiên
            //Kiểm tra trạng thái nếu có thay đổi thì chỉ cần thay đổi hình ảnh hiển thị trên thông báo.
            if (itemNotSame[0].TicketStatus !== ticketStatusexit) {
                var alink = $(this).children('a');
                var divChildren = $(alink).children('div');
                var imageSource = $(divChildren).children('img');
                if (itemNotSame[0].TicketStatus === 'TTSV-01') {
                    $(imageSource).attr('src', '/Content/dist/images/new-icon.png');
                    $(imageSource).attr('alt', itemNotSame[0].TicketStatus);
                } else if (itemNotSame[0].TicketStatus === 'TTSV-03') {
                    $(imageSource).attr('src', '/Content/dist/images/hanlder-icon.png');
                    $(imageSource).attr('alt', itemNotSame[0].TicketStatus);
                } else if (itemNotSame[0].TicketStatus === 'TTSV-06') {
                    $(imageSource).attr('src', '/Content/dist/images/complete-icon.png');
                    $(imageSource).attr('alt', itemNotSame[0].TicketStatus);
                }
            }
            //xóa bỏ trong list nhận được vì đã xử lý trên giao diện
            item = item.filter(function (p) {
                return p.TicketID !== itemNotSame[0].TicketID;
            });
        }
    });

    for (var i = 0; i < itemHasClosedNotifi.length; i++) {
        //createNotification(itemHasClosedNotifi[i].ticketBy, itemHasClosedNotifi[i].ticketId);
    }

    for (var j = 0; j <= item.length; j++) {
        if (typeof item[j] !== 'undefined') {
            var html = "<li class='li-notifi-inside' ticket-id='" + item[j].TicketID + "' ticket-by='" + item[j].TicketBy + "' ticket-status='" + item[j].TicketStatus + "'>";
            html += "<a target='_blank' href='/VOC/Create?ticketid=" + item[j].TicketID + "'>";
            html += "<div class='pull-left'>";
            if (item[j].TicketStatus === 'TTSV-01') {
                html += "<img src='/Content/dist/images/new-icon.png' class='img-circle' alt='" + item[j].TicketStatusStr + "'";
                html += "data-toggle='tooltip' data-placement='right' title='Tiếp nhận mới'>";
            } else if (item[j].TicketStatus === 'TTSV-03') {
                html += "<img src='/Content/dist/images/hanlder-icon.png' class='img-circle' alt='" + item[j].TicketStatusStr + "'";
                html += "data-toggle='tooltip' data-placement='right' title='Hoàn thành xử lý'>";
            } else if (item[j].TicketStatus === 'TTSV-06') {
                html += "<img src='/Content/dist/images/complete-icon.png' class='img-circle' alt='" + item[j].TicketStatusStr + "'";
                html += "data-toggle='tooltip' data-placement='right' title='Hoàn thành xác nhận khách hàng'>";
            }
            html += "</div><h4>" + item[j].TicketBy;
            var ticketDate = formatDate(new Date(item[j].TicketTime), 'dd/MM/yyyy hh:mm');
            html += "<small><i class='fa fa-clock-o'></i> " + ticketDate + "</small>";
            html += "</h4><p>Mã sự vụ: " + item[j].TicketID + "</p><p>" + item[j].TicketTitle + "</p></a></li>";
            $('#ul-notify-ticket').prepend(html);
        }
    }
}

function RemoveDupTicketNotifies(names) {
    var uniqueNames = [];
    $.each(names, function (i, el) {
        if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });
    return uniqueNames;
}

function createNotification(ticketBy, ticketID) {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        var i = 0;
        var interval = window.setInterval(function () {
            var notification = new Notification(ticketBy, {
                icon: '/MPTemplate/dist/images/notification-icon-voc.jpg',
                body: 'Vừa đóng sự vụ: ' + ticketID,
                tag: ticketID
            });
            notification.onclick = function (event) {
                notification.onclick = function () {
                    parent.focus();
                    window.focus();
                    this.close();
                };
            };
            if (i++ === 9) {
                window.clearInterval(interval);
            }
        }, 200);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                var i = 0;
                var interval = window.setInterval(function () {
                    var notification = new Notification(ticketBy, {
                        icon: '/content/dist/images/notification-icon-voc.jpg',
                        body: 'Vừa đóng sự vụ: ' + ticketID,
                        tag: ticketID
                    });
                    notification.onclick = function (event) {
                        notification.onclick = function () {
                            parent.focus();
                            window.focus();
                            this.close();
                        };
                    };
                    if (i++ === 9) {
                        window.clearInterval(interval);
                    }
                }, 200);
            }
        });
    }
}

function bindOneNotifyRinging(item) {
    var num = $('.notify-ringing-number').html();
    $('.notify-ringing-number').html(Number(num) + 1);
    $('.notify-ringing-number-member').html('<code>Bạn có ' + Number(num) + 1 + ' thông báo!</code>');

    var html = "<li class='li-notifi-inside' ticket-id='" + item.TicketID + "' ticket-by='" + item.TicketBy + "' ticket-status='" + item.TicketStatus + "'>";
    html += "<a target='_blank' href='/VOC/Create?ticketid=" + item.TicketID + "'>";
    html += "<div class='pull-left'>";
    if (item.TicketStatus === 'TTSV-01') {
        html += "<img src='/MPTemplate/dist/images/new-icon.png' class='img-circle' alt='" + item.TicketStatusStr + "'";
        html += "data-toggle='tooltip' data-placement='right' title='Tiếp nhận mới'>";
    } else if (item.TicketStatus === 'TTSV-03') {
        html += "<img src='/MPTemplate/dist/images/hanlder-icon.png' class='img-circle' alt='" + item.TicketStatusStr + "'";
        html += "data-toggle='tooltip' data-placement='right' title='Hoàn thành xử lý'>";
    } else if (item.TicketStatus === 'TTSV-06') {
        html += "<img src='/MPTemplate/dist/images/complete-icon.png' class='img-circle' alt='" + item.TicketStatusStr + "'";
        html += "data-toggle='tooltip' data-placement='right' title='Hoàn thành xác nhận khách hàng'>";
    }
    html += "</div><h4>" + item.TicketBy;
    var ticketDate = formatDate(new Date(item.TicketTime), 'dd/MM/yyyy hh:mm');
    html += "<small><i class='fa fa-clock-o'></i> " + ticketDate + "</small>";
    html += "</h4><p>Mã sự vụ: " + item.TicketID + "</p><p>" + item.TicketTitle + "</p></a></li>";
    $('#ul-notify-ticket').prepend(html);
}

function removeOneNotifyRinging(item) {
    $('li[ticket-id$="' + item + '"]').remove();
    var num = $('.notify-ringing-number').html();
    $('.notify-ringing-number').html(Number(num) - 1);
    $('.notify-ringing-number-member').html('<code>Bạn có ' + Number(num) - 1 + ' thông báo!</code>');
}

function bindItemNotifiService(item) {
    var previousObject = null;
    $('li.li-notifi-service-inside').filter(function () {
        var IdExit = $(this).attr('notifi-id');
        var itemNotSame = item.filter(function (p) {
            return p.ID !== IdExit;
        });
    });
    for (var i = 0; i <= item.length; i++) {
        if (typeof item[i] !== 'undefined') {
            if (item[i].Type === 'Sent') {
                try {
                    var itemContentSent = JSON.parse('{"' + decodeURI(item[i].SentContent).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
                    var html = "<li class='li-notifi-service-inside' notifi-id='" + item[i].ID + "'>";
                    html += "<a href='#'>";
                    html += "<div class='pull-left'>";
                    html += "<img src='/Content/dist/images/sending-customer-to-webservice.png' class='img-circle' alt='" + item[i].TicketStatusStr + "'>";
                    html += "</div><h4>Yêu cầu tạo thẻ hội viên";
                    var ticketDate = formatDate(new Date(item[i].CreatedDate), 'hh:mm');
                    html += "<small><i class='fa fa-clock-o'></i> " + ticketDate + "</small>";
                    html += "</h4><p>Số điện thoại: " + itemContentSent.cellPhoneNumber + "</p>";
                    html += "<p>Email: " + itemContentSent.email + "</p></a></li>";
                    $('#ul-notify-service').prepend(html);
                    previousObject = itemContentSent;
                } catch (e) {
                    $('#ul-notify-service').prepend('Có lỗi hiện thị thông báo!\nVui lòng liên hệ Admin.');
                    previousObject = null;
                }
            } else if (item[i].Type === 'Response') {
                try {
                    var itemContentSent = '';
                    var html = '';
                    try {
                        itemContentSent = JSON.parse(item[i].Description.split('=')[1]);
                        html = "<li class='li-notifi-service-inside' notifi-id='" + item[i].ID + "'>";
                        html += "<a href='#'>";
                        html += "<div class='pull-left'>";
                        html += "<img src='/MPTemplate/dist/images/notification-services.jpg' class='img-circle' alt='" + item[i].TicketStatusStr + "'>";
                        html += "</div><h4>Kết quả tạo thẻ hội viên";
                        var ticketDate = formatDate(new Date(item[i].CreatedDate), 'hh:mm');
                        html += "<small><i class='fa fa-clock-o'></i> " + ticketDate + "</small>";
                        html += "</h4><p>Số điện thoại: " + previousObject.cellPhoneNumber + "</p>";
                        html += "<p data-toggle='tooltip' data-placement='top' title='responsCode=" + itemContentSent.responsCode + "; messageKey=" + itemContentSent.messageKey + "'>";
                        html += "KQ: Code=" + itemContentSent.responsCode + "; Key=" + itemContentSent.messageKey + "</p></a></li>";
                    } catch (e) {
                        html = "<li class='li-notifi-service-inside' notifi-id='" + item[i].ID + "'>";
                        html += "<a href='#'>";
                        html += "<div class='pull-left'>";
                        html += "<img src='/MPTemplate/dist/images/notification-services.jpg' class='img-circle' alt='" + item[i].TicketStatusStr + "'>";
                        html += "</div><h4>Kết quả tạo thẻ hội viên";
                        var ticketDate = formatDate(new Date(item[i].CreatedDate), 'hh:mm');
                        html += "<small><i class='fa fa-clock-o'></i> " + ticketDate + "</small>";
                        html += "</h4><p>Số điện thoại: " + previousObject.cellPhoneNumber + "</p>";
                        html += "<p data-toggle='tooltip' data-placement='top' title='" + item[i].Description + "'>";
                        html += "Kết quả: " + item[i].Description + "</p></a></li>";
                    }
                    $('#ul-notify-service').prepend(html);

                } catch (e) {
                    $('#ul-notify-service').prepend('Có lỗi hiện thị thông báo!\nVui lòng liên hệ Admin.');
                }
            }
        }
    }
}

/**
 * Hiển thị danh sách ticket sắp quá hạn
 * @param {any} itemsOutOfDeadLine item
 */
function bindCommingDeadLineNotifiToControl(itemsOutOfDeadLine) {
    $('.notify-deadline-number').html(itemsOutOfDeadLine.length);
    $('.notify-deadline-number-member').html('<code>Bạn có ' + itemsOutOfDeadLine.length + ' cảnh báo!</code>');
    for (var i = 0; i < itemsOutOfDeadLine.length; i++) {
        if (itemsOutOfDeadLine[i].TicketStatus !== 'TTSV-06') {//loại bỏ sự vụ đã hoàn thành
            var htmlDeadLine = ''; var titleNofi = '';
            var imageType = "/Content/dist/images/begin-of-date-deadline-voc.png";
            if (itemsOutOfDeadLine[i].TicketStatus === 'TTSV-01')
                titleNofi = 'Sắp hết hạn xử lý';
            else titleNofi = 'Sắp hết hạn xác nhận';
            htmlDeadLine += "<li class='li-deadline-service-inside' notifi-id='" + itemsOutOfDeadLine[i].TicketID + "'";
            htmlDeadLine += "data-toggle='tooltip' data-placement='top' title='" + itemsOutOfDeadLine[i].TicketID + "'>";
            htmlDeadLine += "<a target='_blank' href='/VOC/Create?ticketid=" + itemsOutOfDeadLine[i].TicketID + "'>";
            htmlDeadLine += "<div class='pull-left'>";
            htmlDeadLine += "<img src='" + imageType + "' class='img-circle' alt='" + itemsOutOfDeadLine[i].TicketID + "'>";
            htmlDeadLine += "</div><h4>" + titleNofi;
            var ticketDate = formatDate(new Date(itemsOutOfDeadLine[i].DeadLine), 'dd/MM/yyyy hh:mm');
            htmlDeadLine += "<small><i class='fa fa-clock-o'></i> " + ticketDate + "</small>";
            htmlDeadLine += "</h4><p>Mã sự vụ: " + itemsOutOfDeadLine[i].TicketID + "</p><p>" + itemsOutOfDeadLine[i].TicketTitle + "</p>";
            htmlDeadLine += "</a></li>";
            $('#ul-deadline-ticket').append(htmlDeadLine);
        }
    }
}
/**
 * Hiển thị danh sách ticket đã quá hạn
 * @param {any} itemsOutOfDeadLine item
 */
function bindOnDeadLineNotifiToControl(itemsOutOfDeadLine) {
    $('.notify-deadline-number').html(itemsOutOfDeadLine.length);
    $('.notify-deadline-number-member').html('<code>Bạn có ' + itemsOutOfDeadLine.length + ' cảnh báo!</code>');
    for (var i = 0; i < itemsOutOfDeadLine.length; i++) {
        if (itemsOutOfDeadLine[i].TicketStatus !== 'TTSV-06') {//loại bỏ sự vụ đã hoàn thành
            var htmlDeadLine = ''; var titleNofi = '';
            var imageType = '/Content/dist/images/out-of-date-deadline-voc.png';
            if (itemsOutOfDeadLine[i].TicketStatus === 'TTSV-01')
                titleNofi = 'Quá hạn xử lý';
            else titleNofi = 'Quá hạn xác nhận';

            htmlDeadLine += "<li class='li-deadline-service-inside' notifi-id='" + itemsOutOfDeadLine[i].TicketID + "'";
            htmlDeadLine += "data-toggle='tooltip' data-placement='top' title='" + itemsOutOfDeadLine[i].TicketID + "'>";
            htmlDeadLine += "<a target='_blank' href='/VOC/Create?ticketid=" + itemsOutOfDeadLine[i].TicketID + "'>";
            htmlDeadLine += "<div class='pull-left'>";
            htmlDeadLine += "<img src='" + imageType + "' class='img-circle' alt='" + itemsOutOfDeadLine[i].TicketID + "'>";
            htmlDeadLine += "</div><h4>" + titleNofi;
            var ticketDate = formatDate(new Date(itemsOutOfDeadLine[i].DeadLine), 'dd/MM/yyyy hh:mm');
            htmlDeadLine += "<small><i class='fa fa-clock-o'></i> " + ticketDate + "</small>";
            htmlDeadLine += "</h4><p>Mã sự vụ: " + itemsOutOfDeadLine[i].TicketID + "</p><p>" + itemsOutOfDeadLine[i].TicketTitle + "</p>";
            htmlDeadLine += "</a></li>";
            $('#ul-deadline-ticket').append(htmlDeadLine);
        }
    }
}