/*jshint esversion: 6 */

// function to populate the robots dropdown menu
function populateSelect() {
    $('#robotoptions').empty();
    $.ajax({
        data: "queryAction=populate",
        type: "GET",
        success: function(data) {
            // var robots = JSON.parse(data);
            var robots = data;
            var options = $("#robotoptions");
            options.append($("<option option selected disabled>Select One</option>"));
            // options.append($("<option value='21'>Robot</option>"));
            $.each(robots, function() {
                options.append($("<option />").val(this.robotID).text(this.robotName));
            });
        },
        error: function(e) {
            alert("datafile not implemented " + e.status + ": " + e.statusText + "");
        }
    });
}

// populate the dropdown menu when the document has loaded
$(populateSelect);


//script for switching status of buttons table-->
$(document).on('change', "#robotoptions", function() {
    $("#search").prop('disabled', false);
});

// useless i think
$(document).on('input', "#resultTable", function() {
    $("#edit").hide();
    $("#delete").hide();
    $("#save").removeClass("hidden");
    $("#cancel").removeClass("hidden");
});

// script for handling submit case-->
$(function() {
    $("form").submit(function(f) {
        // hide or show buttons as necessary
        $("#edit").show();
        $("#delete").show();
        $("#save").addClass("hidden");
        $("#cancel").addClass("hidden");

        f.preventDefault();
        $.ajax({
            data: "queryAction=search" + "&robot=" + $('#robotoptions').val(),
            type: "GET",
            success: function(data) {
                // var results = JSON.parse(data);
                var results = data;
                $("#name").html(results[0].robotName);
                $("#ip").html(results[0].IPaddress);
                $("#mac").html(results[0].MACaddress);
                $("#location").html(results[0].location);
                $("#battery").html(results[0].batteryAddedDate);
                $("#usage").html(results[0].usageStats);
                $("#photo").html("<img class='img-responsive' src='./images/" + results[0].photo + ".jpg' alt='" + results[0].robotName + "' style = 'width:256; height:512px;' />");
                $("#resultTable").show();
            },
            error: function(e) {
                alert("datafile not implemented: " + e.status + ": " + e.statusText + "\n\nIf you are looking at the file posted a part of the assignment description, the AJAX response is not provided, it is your task to implement it. If you served the file from your own server, it did not respond correctly to the AJAX request for \"./datafile\"");
            }
        });
    });
});

// script for deleting robot record
$(function() {
    $("#delete").click(function() {
        if (confirm('Are you sure you want to delete this record?')) {
            $.ajax({
                data: "queryAction=delete" + "&robot=" + $("#robotoptions").val(),
                type: "GET",
                success: function() {
                    $("#resultTable").hide();
                    $(populateSelect);
                    $("#search").prop('disabled', true);
                }
            });
        }
    });
});

// script for saving table input
$(function() {
    var targetEditablefields = $("#battery, #ip");
    $("#save").click(function() {
        // hide or show buttons as necessary
        $("#edit").show();
        $("#delete").show();
        $("#save").addClass("hidden");
        $("#cancel").addClass("hidden");

        // save the content in the editable fields
        var newip = $("#b1").val() + '.' + $("#b2").val() + '.' + $("#b3").val() + '.' + $("#b4").val();
        $("#ip").text(newip);
        var newbattery = $("#a1").val() + '-' + $("#a2").val() + '-' + $("#a3").val() + ' ' + $("#a4").val() + ':' + $("#a5").val() + ':' + $("#a6").val();
        $("#battery").text(newbattery);

        $.ajax({
            data: "queryAction=update" + "&robotid=" + $('#robotoptions').val() + "&ip=" + $("#ip").text() +
                "&battery=" + $('#battery').text(),
            type: "GET",
            error: function(e) {
                alert("update not implemented: " + e.status + ": " + e.statusText + "\n\nIf you are looking at the file posted a part of the assignment description, the AJAX response is not provided, it is your task to implement it. If you served the file from your own server, it did not respond correctly to the AJAX request for \"./datafile\"");
            }
        });
    });
});

// script for editing table cells
$(function() {
    $("#edit").click(function() {
        // hide or show buttons as necessary
        $("#edit").hide();
        $("#delete").hide();
        $("#save").removeClass("hidden");
        $("#cancel").removeClass("hidden");

        // distill the original values of the editable fields
        var ip = $("#ip").text();
        var battery = $("#battery").text();

        // check if user has clicked cancel
        $("#cancel").click(function() {
            // hide or show buttons as necessary
            $("#edit").show();
            $("#delete").show();
            $("#save").addClass("hidden");
            $("#cancel").addClass("hidden");

            // restore the original values
            $("#ip").text(ip);
            $("#battery").text(battery);
        });

        // format the ip address field
        var iparray = ip.split('.');
        var ipinput = '<div class="controls">' +
            '<input type="number" class="span1" id="b1" min="0" max="255" value="' + parseInt(iparray[0]) + '"> .' +
            '<input type="number" class="span1" id="b2" min="0" max="255" value="' + parseInt(iparray[1]) + '"> .' +
            '<input type="number" class="span1" id="b3" min="0" max="255" value="' + parseInt(iparray[2]) + '"> .' +
            '<input type="number" class="span1" id="b4" min="0" max="255" value="' + parseInt(iparray[3]) + '">' +
            // '<p class="help-block">Enter values between 0 and 255 for the bytes of the IP address.</p>' +
            '</div>';
        $("#ip").html(ipinput);

        //format the battery field to display current time
        var currenttime = new Date();
        var time = currenttime.getFullYear() + "-" + currenttime.getMonth() + "-" + currenttime.getDate() + " " +
            currenttime.getHours() + ":" + currenttime.getMinutes() + ":" + currenttime.getSeconds();
        var batteryinput = '<div class="controls">' +
            '<input type="number" class="span1" id="a1" min="' + (currenttime.getFullYear() - 5) + '" max="' + currenttime.getFullYear() + '" value="' + parseInt(currenttime.getFullYear()) + '">-' +
            '<input type="number" class="span1" id="a2" min="0" max="' + currenttime.getMonth() + '" value="' + parseInt(currenttime.getMonth()) + '">-' +
            '<input type="number" class="span1" id="a3" min="0" max="' + currenttime.getDate() + '" value="' + parseInt(currenttime.getDate()) + '"> ' +
            '<input type="number" class="span1" id="a4" min="0" max="' + currenttime.getHours() + '" value="' + parseInt(currenttime.getHours()) + '">:' +
            '<input type="number" class="span1" id="a5" min="0" max="' + currenttime.getMinutes() + '" value="' + parseInt(currenttime.getMinutes()) + '">:' +
            '<input type="number" class="span1" id="a6" min="0" max="' + currenttime.getSeconds() + '" value="' + parseInt(currenttime.getSeconds()) + '">' +
            '<p class="help-block">Enter time in the form "YYYY-MM-DD HH:MM:SS".</p>' +
            '</div>';
        $("#battery").html(batteryinput);

        // focus on the ip field first
        $("#ip").children().first().focus();

    });
});

/*
// refresh case
$(function() {
    $(window).on('beforeunload', function() {
        var currentrobot = $("#robotoptions").text();
        sessionStorage.setItem("#robotoptions", currentrobot.val);
        // return "Are you sure you want to navigate away?";
        return 'Are you sure you want to leave?';
    });

    // window.onload 
    $(window).on('unload', function() {
        alert("");
        alert("reloading");
        var currentrobot = sessionStorage.getItem(currentrobot);
        if (currentrobot !== null) {
            $("#robotoptions").val = currentrobot;
            // document.getElemenyById("name").value = name;
        }
    });
});

$(window).on('beforeunload', function() {
    var e = $.Event('webapp:page:closing');
    $(window).trigger(e); // let other modules determine whether to prevent closing
    if (e.isDefaultPrevented()) {
        // e.message is optional
        return e.message || 'You have unsaved stuff. Are you sure to leave?';
    }
});

*/

// convert mysql timestamp to js time
Date.createFromMysql = function(mysql_string) {
    var t, result = null;

    if (typeof mysql_string === 'string') {
        t = mysql_string.split(/[- :]/);

        //when t[3], t[4] and t[5] are missing they defaults to zero
        result = new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
    }

    return result;
};