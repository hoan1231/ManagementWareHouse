function myMpLoop(ctrItem, textStart, textStop, itemDisabled) {
    this.ctrItem = ctrItem;
    this.textStart = textStart;
    this.textStop = textStop;
    this.itemDisabled = itemDisabled;
    this.stopProgress = false;
    var counterProgress = 1;
    this.timeoutobj;
    this.progress = function () {
        if (this.stopProgress) {
            var evet = this;
            ctrItem.html('<i class="fa fa-spin fa-spinner"></i>  ' + textStart);
        }
    };

    this.start = function () {
        this.stopProgress = true;
        this.progress();
        for (var i = 0; i < this.itemDisabled.length; i++) {
            this.itemDisabled[i].attr('Disabled', 'Disabled');
        }
    };
    this.stop = function () {
        this.stopProgress = false;
        clearTimeout(this.timeoutobj);
        this.ctrItem.html(this.textStop);
        for (var i = 0; i < this.itemDisabled.length; i++) {
            this.itemDisabled[i].removeAttr('Disabled');
        }
    };
}


document.addEventListener("DOMContentLoaded", function (event) {
    var tokenChk = localStorage.getItem('accessTokenKTStore');
    if (tokenChk) location.href = "/MNG/Menu";
});


function ViewModel() {
    var self = this;
    var tokenKey = 'accessTokenKTStore';

    self.result = ko.observable();
    self.user = ko.observable();

    self.registerEmail = ko.observable();
    self.registerPassword = ko.observable();
    self.registerPassword2 = ko.observable();

    self.loginEmail = ko.observable();
    self.loginPassword = ko.observable();
    self.errors = ko.observableArray([]);

    function showError(jqXHR) {

        self.result(jqXHR.status + ': ' + jqXHR.statusText);

        var response = jqXHR.responseJSON;
        if (response) {
            if (response.Message) self.errors.push(response.Message);
            if (response.ModelState) {
                var modelState = response.ModelState;
                for (var prop in modelState) {
                    if (modelState.hasOwnProperty(prop)) {
                        var msgArr = modelState[prop]; // expect array here
                        if (msgArr.length) {
                            for (var i = 0; i < msgArr.length; ++i) self.errors.push(msgArr[i]);
                        }
                    }
                }
            }
            if (response.error) self.errors.push(response.error);
            if (response.error_description) self.errors.push(response.error_description);
        }
    }

    self.register = function () {
        self.result('');
        self.errors.removeAll();

        var data = {
            Email: self.registerEmail(),
            Password: self.registerPassword(),
            ConfirmPassword: self.registerPassword2()
        };

        $.ajax({
            type: 'POST',
            url: '/api/Account/Register',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            beforeSend: function (xhr) {
                //xhr.setRequestHeader('AuthorizeLocation', "MNG");
            }
        }).done(function (data) {
            self.result("Done!");
        }).fail(showError);
    };

    self.login = function (e) {
        self.result('');
        self.errors.removeAll();

        var loginData = {
            grant_type: 'password',
            username: self.loginEmail(),
            password: self.loginPassword()
        };

        var itemHandler = $('button[data-bind="click: login"]');
        var itemDisableds = [itemHandler];
        var mylop = new myMpLoop(itemHandler, 'Đang xử lý..', itemHandler.html(), itemDisableds);
        mylop.start();

        $.ajax({
            type: 'POST',
            url: '/Token',
            data: loginData
        }).done(function (data) {

            // Cache the access token in session storage.
            localStorage.setItem(tokenKey, data.access_token);

            var token = localStorage.getItem(tokenKey);
            var headers = {};
            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const myParam = urlParams.get('ReturnUrl');

            $.ajax({
                type: 'GET',
                url: 'api/Account/UserInfoCustom',
                headers: headers,
                beforeSend: function (xhr) {
                    //xhr.setRequestHeader('AuthorizeLocation', "MNG");
                },
                success: function (msg) {
                    // Cache the access token in session storage.
                    localStorage.setItem('Email', msg.Email);
                    localStorage.setItem('FullName', msg.FullName);
                    localStorage.setItem('PhoneNumber', msg.PhoneNumber);
                    localStorage.setItem('UserName', msg.UserName);
                    localStorage.setItem('UserID', msg.UserID);
                    localStorage.setItem('Roles', msg.Roles);
                    localStorage.setItem('menuTokenKTStore', JSON.stringify(msg.Menus));
                    localStorage.setItem('VOCRolesKTStore', JSON.stringify(msg.VOCRoles));
                    if (!myParam) location.href = "/MNG/Menu";
                    else location.href = myParam;
                }
            }).fail(function (jqXHR) {
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
                                    location.href = '/?ReturnUrl=' + window.location.pathname;
                                }
                            }
                        }
                    });
                } else if (jqXHR.status === 403) {
                    localStorage.removeItem(tokenKey);
                    location.href = '/err/forbidden/?ReturnUrl=' + window.location.pathname;
                }
            });
        }).fail(function (jqXHR) {
            mylop.stop();
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
                                location.href = '/?ReturnUrl=' + window.location.pathname;
                            }
                        }
                    }
                });
            } else if (jqXHR.status === 403) {
                localStorage.removeItem(tokenKey);
                location.href = '/err/forbidden/?ReturnUrl=' + window.location.pathname;
            } else if (jqXHR.status === 400) {
                localStorage.removeItem(tokenKey);
                $('span#lblError').html('<code>' + jqXHR.responseJSON.error_description + '</code>');
            }
        },
            showError);
    };

    self.logout = function () {
        // Log out from the cookie based logon.
        var token = localStorage.getItem(tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        $.ajax({
            type: 'POST',
            url: '/api/Account/Logout',
            headers: headers,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('AuthorizeLocation', "MNG");
            }
        }).done(function (data) {
            // Successfully logged out. Delete the token.
            self.user('');
            localStorage.removeItem(tokenKey);
        }).fail(showError);
    };
}

var app = new ViewModel();
ko.applyBindings(app);