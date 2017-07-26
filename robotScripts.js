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
            options.append($("<option selected disabled>Select One</option>"));
            // options.append($("<option value='22'>Robot</option>"));
            // options.append($("<option value='20'>Robot2</option>"));
            $.each(robots, function() {
                options.append($("<option />").val(this.robotID).text(this.robotName));
            });
        },
    });
}

// refresh case
$(function refresh() {
    window.onbeforeunload = function() {
        var currentrobot = $("#robotoptions").val();
        var robotname = $("#robotoptions").text();
        localStorage.setItem("currentrobot", currentrobot);
        localStorage.setItem("robotname", robotname);
        // return 'Are you sure you want to leave?';
    };
});

// restore previous robots details
function restorePreviousRobot() {

    var currentrobot = localStorage.getItem("currentrobot");
    var robotname = localStorage.getItem("robotname");

    if (currentrobot !== 'null') {
        alert("restoring " + currentrobot);
        $("#robotoptions").val(currentrobot);
        localStorage.removeItem("currentrobot");
        localStorage.removeItem("robotname");
        searchRobot();
    }

}

// script for searching for a robot
function searchRobot() {
    // hide or show buttons as necessary
    $("#edit").show();
    $("#delete").show();
    $("#save").addClass("hidden");
    $("#cancel").addClass("hidden");
    $("#search").prop('disabled', true);
    $("#locationTable").hide();
    $("#showlocation").show();
    $("#hideLocationGroup").hide();

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
            $("#photo").html("<img class='img-responsive center-block' src='/images/" + results[0].photo + ".jpg' alt='" + results[0].robotName + "' style = 'width:256; height:512px;' />");
            $("#resultTable").show();
        },
    });
}

// script for deleting robot record
$(function deleteRobot() {
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
$(function saveTableInput() {
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

// script to handle location history
$(function showLocationHistory() {
    // show location
    $("#showlocation").click(function() {
        $("#locationTable tbody>tr").remove();
        $("#locationTable").show();
        $("#showlocation").hide();
        $("#hideLocationGroup").show();
        $("#locationTable").append($("<tr><td>1</td><td>5.2257</td><td>5.2257</td><td>2.71775</td><td>2017-07-12 13:25:26</td></tr>"));
        $.ajax({
            data: "queryAction=showLocation" + "&robotid=" + $('#robotoptions').val(),
            type: "GET",
            success: function(data) {
                var locations = data;
                var locationTable = $("#locationTable");
                $.each(locations, function() {
                    locationTable.append($("<tr><td>" + this.RLocID + "</td><td>" +
                        this.x + "</td><td>" + this.y + "</td><td>" + this.t + "</td><td>" + this.time + "</td></tr>"));
                });
            },
            error: function() {
                alert("error occured while getting location");
            }
        });
    });
});

// hide location
$(function hideLocationTable() {
    $("#hidelocation").click(function() {
        $("#locationTable").hide();
        $("#showlocation").show();
        $("#hideLocationGroup").hide();
    });
});

// delete location history
$(function deleteLocations() {
    $("#deletelocations").click(function() {
        if (confirm('Are you sure you want to delete the location history?')) {
            $.ajax({
                data: "queryAction=deletelocations" + "&robotid=" + $("#robotoptions").val(),
                type: "GET",
                success: function() {
                    $("#locationTable").hide();
                    $("#showlocation").show();
                    $("#hideLocationGroup").hide();
                }
            });
        }
    });
});

// script for editing table cells
$(function editDetails() {
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
$(function() {
    $("#B1").click(function(f) {
        f.preventDefault();
        $("#picture").show();
        interval = setInterval(function() {
            $.ajax({
                url: "/update",
                type: "GET",
                success: function(data) {
                    if (data == "diff") {
                        $("#picture").attr('src', './result.png?' + new Date().getTime());
                    }
                },
                error: function(e) {
                    alert("There is an error: " + e.status + ": " + e.statusText + "\n\nIf you are looking at the file posted a part of the assignment description, the AJAX response is not provided, it is your task to implement it. If you served the file from your own server, it did not respond correctly to the AJAX request for \"/update\"");
                }
            });
        }, 2000);
    });
});

$(function() {
    $("#B2").click(function(f) {
        f.preventDefault();
        clearInterval(interval);
    });
});

$(function() {
    $("#left").click(function(f) {
        f.preventDefault();
        $.ajax({
            url: "/move",
            data: "c=a",
            type: "GET",
            success: function(data) {;
            },
            error: function(e) {
                alert("Turn left not implemented: " + e.status + ": " + e.statusText + "\n\nIf you are looking at the file posted a part of the assignment description, the AJAX response is not provided, it is your task to implement it. If you served the file from your own server, it did not respond correctly to the AJAX request for \"/move\"");
            }
        });
    });
});

$(function() {
    $("#right").click(function(f) {
        f.preventDefault();
        $.ajax({
            url: "/move",
            data: "c=d",
            type: "GET",
            success: function(data) {;
            },
            error: function(e) {
                alert("Turn right not implemented: " + e.status + ": " + e.statusText + "\n\nIf you are looking at the file posted a part of the assignment description, the AJAX response is not provided, it is your task to implement it. If you served the file from your own server, it did not respond correctly to the AJAX request for \"/move\"");
            }
        });
    });
});

$(function() {
    $("#forward").click(function(f) {
        f.preventDefault();
        $.ajax({
            url: "/move",
            data: "c=w",
            type: "GET",
            success: function(data) {;
            },
            error: function(e) {
                alert("Forward not implemented: " + e.status + ": " + e.statusText + "\n\nIf you are looking at the file posted a part of the assignment description, the AJAX response is not provided, it is your task to implement it. If you served the file from your own server, it did not respond correctly to the AJAX request for \"/move\"");
            }
        });
    });
});

$(function() {
    $("#backward").click(function(f) {
        f.preventDefault();
        $.ajax({
            url: "/move",
            data: "c=s",
            type: "GET",
            success: function(data) {;
            },
            error: function(e) {
                alert("Backward not implemented: " + e.status + ": " + e.statusText + "\n\nIf you are looking at the file posted a part of the assignment description, the AJAX response is not provided, it is your task to implement it. If you served the file from your own server, it did not respond correctly to the AJAX request for \"/move\"");
            }
        });
    });
});

$(function() {
    $("#stop").click(function(f) {
        f.preventDefault();
        $.ajax({
            url: "/move",
            data: "c=x",
            type: "GET",
            success: function(data) {;
            },
            error: function(e) {
                alert("Stop not implemented: " + e.status + ": " + e.statusText + "\n\nIf you are looking at the file posted a part of the assignment description, the AJAX response is not provided, it is your task to implement it. If you served the file from your own server, it did not respond correctly to the AJAX request for \"/move\"");
            }
        });
    });
});
// populate the dropdown menu when the document has loaded
// $(populateSelect);
// $(restorePreviousRobot);
$(function() {
    populateSelect();
    restorePreviousRobot();
});

//script for switching status of buttons table-->
$(document).on('change', "#robotoptions", function() {
    $("#search").prop('disabled', false);
});

// useless
$(document).on('input', "#resultTable", function() {
    $("#edit").hide();
    $("#delete").hide();
    $("#save").removeClass("hidden");
    $("#cancel").removeClass("hidden");
});

// handling submit case
$(function() {
    $("form").submit(function(e) {
        e.preventDefault();
        searchRobot();
    });
});