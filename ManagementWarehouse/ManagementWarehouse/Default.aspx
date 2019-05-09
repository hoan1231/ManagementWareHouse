<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="KTStore._Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>KTStore</title>
    <%--<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />--%>
    <link href="/crm_manager/CSS/Login.css" rel="stylesheet" />
    <!-- Font Awesome -->
    <link rel="stylesheet" href="/Content/dist/font-awesome/4.5.0/css/font-awesome.min.css" />
    <!-- Ionicons -->
    <link rel="stylesheet" href="/Content/dist/ionicons/2.0.1/css/ionicons.min.css" />
    <!-- Theme style -->
    <link rel="stylesheet" href="/Content/dist/css/AdminLTE.min.css" />
    <!-- bootstrap -->
    <link rel="stylesheet" href="/Content/bootstrap/css/bootstrap.min.css" />
</head>
<body class="hold-transition login-page inner-bg" style="overflow: hidden;">
    <div class="lockscreen-wrapper" style="max-width: 400px; margin-top: 5%;">
        <form id="form2" runat="server">
            <div class="box box-warning" style="padding: 20px; padding-top: 2px; background: rgba(255, 255, 255, 255); margin-bottom: 0px; border-radius: 2px; -moz-border-radius: 0 0 4px 4px; -webkit-border-radius: 0 0 4px 4px; text-align: left;">
                <div class="box-header with-border" style="text-align: center;">
                    <%--<img src="/Content/dist/img/IMG_Logo_login_1807.png" style="height: 150px; width: 100%;" />--%>
                    <div class="box-tools pull-right">
                    </div>
                </div>
                <div class="box-body no-padding">
                    <div class="login-logo">
                        <a href="#" class="logo"><b>KTSTORE</b></a>
                    </div>
                    <div class="frmNewMain">
                        <div class="row">
                            <br />
                            <asp:PlaceHolder runat="server" ID="PlaceHolder2" Visible="false">
                                <p class="text-danger">
                                    <asp:Literal runat="server" ID="Literal2" />
                                </p>
                            </asp:PlaceHolder>
                            <div class="col-md-12">
                                <div class="form-group has-feedback">
                                    <asp:TextBox ID="UserName" runat="server" data-bind="value: loginEmail" CssClass="form-control"></asp:TextBox>
                                    <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
                                    <asp:RequiredFieldValidator runat="server" ControlToValidate="UserName"
                                        CssClass="text-danger" ErrorMessage="Yêu cầu nhập tài khoản." />
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-group has-feedback">
                                    <asp:TextBox ID="Password" runat="server" data-bind="value: loginPassword" CssClass="form-control" TextMode="Password"></asp:TextBox>
                                    <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                                    <asp:RequiredFieldValidator runat="server" ControlToValidate="Password" CssClass="text-danger"
                                        ErrorMessage="Yêu cầu nhập mật khẩu." />
                                </div>
                            </div>
                            <div class="col-md-12">
                                <span id="lblError"></span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12">
                                <button type="submit" style="float: left" data-bind="click: login" class="btn btn-primary btn-block btn-flat">Đăng nhập</button>
                            </div>
                        </div>
                        <br />
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <a href="/MNG/ForgotPassword">Quên mật khẩu</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <!-- jQuery 2.2.3 -->
    <script src="/Content/plugins/jQuery/jquery-2.2.3.min.js"></script>
    <!-- Bootstrap 3.3.6 -->
    <script src="/Content/bootstrap/js/bootstrap.min.js"></script>
    <%: Scripts.Render("~/bundles/app") %>
</body>
</html>
