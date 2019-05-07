/* xay dưng menu chuc nang, hien thi popup */
jQuery.fn.fmenu = function(tables, ischeck)
{
    var obj = this;
    var idx = -1;
    if (tables != undefined && tables != "" && (ischeck == undefined || ischeck == true))
    {
        var tbls = tables.split(";");
        for (i=0; i<tbls.length; i++)
        {
            grid_checkbox("table." + tbls[i] + " input[type='checkbox']");
        }
    }
    
    $("span", obj).each(function(index){
        $(this).attr("idx", index);
        
        if ($("." + $(this).attr("box")) != undefined)
        {
            $("div." + $(this).attr("box")).addClass("fmenu-box");
        }
        
        if ($.cookie("fbox") != null && $.cookie("fbox") == $(this).attr("box"))
        {
            $(this).addClass("active");
        }
    });
    
    //alert($.cookie('the_cookie'));
    if ($.cookie("fbox") != null)
    {
        $("div." + $.cookie("fbox")).show();
    }
    
    obj.addClass('fmenu');
    $("<div style='clear:both'></div>").insertAfter(".fmenu ul");
    
    //alert(obj.html());
    obj.find("span").bind('click', function(){
        if ($(this).hasClass("lock") == true)
        {
            return false;
        }
    
        //if ($(this).attr("table") != undefined && $(this).attr("box") != undefined && $("." + $(this).attr("box")).is(':hidden'))
        if ($(this).attr("table") != undefined && $(this).attr("box") != undefined && $(this).hasClass("active") == false)
        {
            var id = "";
            $("table." + $(this).attr("table") + " input[type='checkbox']:not(:first):checked").each(function(){
                id += $(this).attr("id") + ";";
            });
            
            $("input[id$='hid" + $(this).attr("box") + "']").val(id);
            if (id == "")
            {
                alert("Chọn dữ liệu");
                return;
            }
        }
        
        $("span", obj).removeClass("active");
        $(".fmenu-box").hide();
        $("table." + $(this).attr("table") + " input[type='checkbox']").removeClass("lock");
        if (parseInt($(this).attr("idx")) != idx)
        {
            $(this).addClass("active");
            idx = parseInt($(this).attr("idx"));
            $("div." + $(this).attr("box")).show();
            
            $("div." + $(this).attr("box") + " p.title").text($(this).attr("title"));
            //alert($(this).attr("tag"));
            $("input[id$='hidColumn']").val($(this).attr("tag"));
            
            $("table." + $(this).attr("table") + " input[type='checkbox']").addClass("lock");
        }
        else
        {
            idx = -1;
        }
    })
    return this;
}

jQuery.fn.swapWith = function(to) {
    return this.each(function() {
        var copy_to = $(to).clone(true);
        var copy_from = $(this).clone(true);
        $(to).replaceWith(copy_from);
        $(this).replaceWith(copy_to);
    });
};

$(function(){
    // -------------
    layout_table_grid();
    layout_table_freeze();
    
    loadDatepicker(".date");
    loadDateTimepicker(".datetime");
    loadDateTimepickerFull(".datetimefull");
    //loadTimepicker(".time");
    //$(".numeric-int").numeric();
    
    
    t();
    
    function t()
    {
        $("div.button").each(function(i){
            var t = $("input", $(this)).length;
            if (t == 0)
                $(this).hide();
        });
        
        $("span.button").each(function(i){
            var t = $("input", $(this)).length;
            if (t == 0)
                $(this).hide();
        });
    }
    $("table.grid tr:not(:first)").hover(
        function(){
            if ($(this).attr("hover") != "false")
            {
                $(this).addClass("highlight");
            }
        },
        function(){
            if ($(this).attr("hover") != "false")
            {
                $(this).removeClass("highlight");
            }
        }

    );
    /*
    $("table.grid-freeze tbody tr:not(:first)").hover(
        function(){
            //$(this).addClass("highlight");
            $(".idx" + $(this).attr("idx")).addClass("highlight");
        },
        function(){
            //$(this).removeClass("highlight");
            $(".idx" + $(this).attr("idx")).removeClass("highlight");
        }
    );
    */
    $("table.hover tr:not(:first)").hover(
        function(){
            $(this).addClass("highlight");
            
        },
        function(){
            $(this).removeClass("highlight");
        }

    );
    
    $("table.alter tr:not(:first) tr:odd").addClass("odd");
    $("table.alter tr:even").addClass("even");
    
    $("div.freeze-col table.grid-freeze tbody tr:not(:first) tr:odd").addClass("odd");
    $("div.freeze-col table.grid-freeze tbody tr:even").addClass("even");
    
    $("div.freeze table.grid-freeze tbody tr:not(:first) tr:odd").addClass("odd");
    $("div.freeze table.grid-freeze tbody tr:even").addClass("even");
     
    function layout_table_grid()
    {
        var mheight = 0;
        $("table.grid th").each(function(i){
            var tt = $(this).html();
            tt = $.trim(tt);
            $(this).html("<div><div><h2>" + tt + "</h2></div></div>").width($(this).width());
            
            //alert($(this).width());
            if (mheight == 0)
                mheight = $(this).height();
            else
            {
                if ($(this).height()>mheight)
                    mheight = $(this).height();
            }
        });
        //alert($("table.grid th").height());
        //alert($("table.grid th").height());
        //$("table.grid th h2").height(mheight - 5);
        //$("table.grid th h2").height($("table.grid th").height() - 19);
        $("table.grid th h2").height(mheight);
    }
    
    function layout_table_freeze()
    {
        if ($("div[id$='freeze']").length > 0)
        {
            var w = 0;
            if ($("#content-1col").length > 0)
                w = $("#content-1col").width();
            else
                w = $("td.container").width();
            var fw = $(".freeze-col").width();
            var gwidth = 0;
            
            $("div.freeze table.grid-freeze tr:first th").each(function(){
                //alert($(this).attr("width"));
                if (isNaN(parseInt($(this).attr("width"))))
                {
                    gwidth += $(this).width();
                    //alert($(this).width());
                }
                else
                {
                    gwidth += parseInt($(this).attr("width"));
                    //alert(parseInt($(this).attr("width")));
                }
                //alert($(this).attr("width"));
                //gwidth += $(this).width();
                
            });
            
            var h1 = $("div.freeze-col .grid-freeze thead tr").height();
            var h2 = $("div.freeze .grid-freeze thead tr").height();
            
            if (h1 > h2)
            {
                $("div.freeze-col .grid-freeze thead tr").height(h1);
                $("div.freeze .grid-freeze thead tr").height(h1);
            }
            else
            {
                $("div.freeze-col .grid-freeze thead tr").height(h2);
                $("div.freeze .grid-freeze thead tr").height(h2);
            }
            
            if (gwidth > (w - fw - 29))
                $("div.freeze table.grid-freeze").width(gwidth);
            
            $(".freeze").width(w - fw - 29);
            
            var r1 = 0;
            var r2 = 0;
            
            $("div.freeze table.grid-freeze tbody tr").each(function(i){
                h1 = $("div.freeze-col table.grid-freeze tbody tr.idx" + i).height();
                h2 = $("div.freeze table.grid-freeze tbody tr.idx" + i).height();
                
                if (h1 > h2)
                {
                    $("div.freeze-col table.grid-freeze tbody tr.idx" + i).height(h1);
                    $("div.freeze table.grid-freeze tbody tr.idx" + i).height(h1);
                }
                else
                {
                    $("div.freeze-col table.grid-freeze tbody tr.idx" + i).height(h2);
                    $("div.freeze table.grid-freeze tbody tr.idx" + i).height(h2);
                }
            });
            
            if ($.browser.msie) {
                var h = $("#freeze div.freeze").height();
                $("#freeze div.freeze").height(h + 20);
            }
            
            /* --- fix chieu cao cua body --- */
            //alert($("#freeze").position().top);
            //alert($(window).height());
            /*
            if ($("#freeze").height() + $("#freeze").position().top > $(window).height())
            {
                h = $(window).height() - $("#freeze").position().top - 20;
                //alert(h);
                $("table.grid-freeze tbody").height(h);
                $("table.grid-freeze tbody").css("overflow", "hidden");
                
                $(".freeze").width(w - fw - 29 - $(".freeze-slider").width() - 5);
                
                $(".freeze-slider").height(h);
                $(".freeze-slider").show();
                $(".freeze-slider").css("margin-top", h1);
                
                var row = $("div.freeze table.grid-freeze tbody tr").length;
                
                row = row - Math.round(h / $("table.grid-freeze tbody tr").height()) + 2;
                
                $(".freeze-slider").slider({
			        orientation: "vertical",
			        range: "min",
			        max: row,
			        min: 0,
			        value: row,
			        slide: function(event, ui) {
			            //$("#sd").text(ui.value);
			            if (ui.value >= 0)
			            {
			                var val = row - ui.value;
				            $("#sd").text(ui.value);
    				        /*
				            $("div.freeze table.grid-freeze tbody tr").show();
				            $("div.freeze table.grid-freeze tbody tr").each(function(i){
				                if (i < val)
				                {
				                    $(this).hide();
    				                
				                }
				            });
    				        
    				        $("div.freeze table.grid-freeze tbody tr").show();
				            $("div.freeze-col table.grid-freeze tbody tr").show();
				            
				            if (val > 1)
				            {
				                $("div.freeze-col table.grid-freeze tbody tr:lt(" + (val - 1) + ")").hide();
				                $("div.freeze table.grid-freeze tbody tr:lt(" + (val - 1) + ")").hide();
				            }
				            
				            /*
				            $("div.freeze-col table.grid-freeze tbody tr").each(function(i){
				                if (i < val)
				                {
				                
				                    //$(this).hide();
    				                //$("table.grid-freeze tbody tr.idx" + i).hide();
				                }
				            });
				            
				        }
			        }
		        });
            }
            */
            //alert($("div.freeze table.grid-freeze tr:not(:first)").length);
        }
    }
    
    /* --- Xu ly menu --- */
    loadMenu();
    
    function loadMenu()
    {
        var f = false;
        //if ($.cookie("slidemenu") != null)
        //{
        //    $("#menupanel .sidebar-slide").each(function(i){
                
        //        if ($(this).attr("id") == $.cookie("slidemenu"))
        //        {
        //            $(".sidebar-slide:first").swapWith(this);
        //            loadMenu2($("#menupanel ." + $(this).attr("id") + " .title"));
        //            f = true;
        //            return;
        //        }
        //    });
        //}
        
        if (f == false)
        {
            loadMenu2($("#menupanel ." + $(".sidebar-slide:first").attr("id") + " .title"));
        }
    }
    
    function loadMenu2(obj)
    {
        if (obj.next("div.sidebar-content").is(":visible") == true)
        {
            obj.next("div.sidebar-content").slideToggle(300);
        }
        else
        {
        
            $("#menupanel .sidebar-slide div.sidebar-content").hide(300);
            $("#menupanel .sidebar-slide .title h2").css({ backgroundImage: "url(/images/icons/left.png)"});
            $("h2", obj).css({ backgroundImage: "url(/images/icons/down.png)"});
            obj.next("div.sidebar-content").slideToggle(300).siblings("div.sidebar-content").slideUp("slow");
        }
    }
    
    $("#menupanel .sidebar-slide .title").click(function()
    {   
        loadMenu2($(this));
	});
});

function loadDatepicker(element)
{
    $(element).datepicker({
        showOn: 'both'
        , buttonImage: '/Content/dist/images/button/calendar-up.gif'
        , buttonImageOnly: true
        , dateFormat: 'dd/mm/yy'
        , clearText: ''
        , firstDay: 1
    });
}

function loadDateTimepicker(element) {
    $(element).datepicker({
        duration: '',
        showTime: true,
        constrainInput: false,
        stepMinutes: 1,
        stepHours: 1,
        altTimeField: '',
        time24h: false,
        showOn: 'both'
	        , buttonImage: '/Content/dist/images/button/calendar-up.gif'
	        , buttonImageOnly: true
	        , dateFormat: 'dd/mm/yy'
    });
}

function loadDateTimepickerFull(element) {

    $(element).datepicker({
        duration: '',
        showTime: true,
        constrainInput: false,
        stepMinutes: 1,
        stepHours: 1,
        altTimeField: '',
        time24h: true,
        timeFormat: 'hh:mm:ss',
        showOn: 'both'
	        , buttonImage: '/Content/dist/images/button/calendar-up.gif'
	        , buttonImageOnly: true
	        , dateFormat: 'dd/mm/yy'
    });
}

//function loadTimepicker(element) {
//    $(element).timeEntry({show24Hours: true, showSeconds: true});
//}

function grid_checkbox(element)
{
    $(element).bind("click", function(){
        if ($(this).hasClass("lock"))
            return false;
            
        var id = $(this).attr("id");
        var checked;
        
        if (id == "")
        {
            checked = $(this).is(':checked');
            $(element).attr('checked', checked);
        }
        else
        {
            
        }
    });
}
