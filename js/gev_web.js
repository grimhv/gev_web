function submitForm() {
    let problem = false;
    let error;
    let inputData = {
        logPath: $("#logPath").val(),
        idFilter: $("#idFilter").val(),
        sourceFilter: $("#sourceFilter").val(),
        eventLevel: $("input[type=radio]:checked").val()
    }

    // logPath is required
    if (inputData['logPath'] === "") {
        // inform user that a log is required
        problem = true;
        error = "Please insert a log name.";
    } else {
        document.getElementById("resultsHeader").innerHTML = "Results";
        document.getElementById("resultsHeader").style.visibility = "hidden";
    }

    if (problem) {
        abort(error);
    }

    // can only have a max of 5 ids, between 1 and 65535
    let idArray = inputData['idFilter'].replace(/\s/g, '').split(',');
    idArray.forEach(x => {
        let y;

        // first, ensure it's an int
        try {
            y = parseInt(x);
        } catch (e) {
            problem = true;
            error = e;
            return;
        }

        // then see if it's between 1-65535
        if (y > 65535 || y < 1) {
            problem = true;
            error = "'" + y + "' is not between 1 and 65535.";
            return;
        }
    });

    // if we had an error, we'll inform the user
    if (problem) {
        abort(error);
    }

    // clear filterResults and hide pagination buttons
    document.getElementById("filterResults").innerHTML = "";
    $("#paginationTop").css("visibility", "hidden");
    $("#paginationBottom").css("visibility", "hidden");

    //reset page
    window.currentPage = 1;

    // alert user that gev is running, since it can take a hot minute depending on how many records the log has, and
    // how vague their search is
    $("#runningAlert").css("visibility", "visible");

    // send data to php using jQuery POST
    $.post("submit.php", inputData,
        function(returned) {

        // parse returned data as JSON
        let data = JSON.parse(returned);
            console.log(data['command']);
            // ensure status was OK, otherwise write it to the console
            if (data.status === 'ok') {
                if (data['output'] === "No records found matching search criteria.") {
                    $("#runningAlert").css("visibility", "hidden");
                    $("#resultsHeader").css("visibility", "visible");
                    $("#resultsHeader").val("No results.");
                } else {
                    // toggle visibility on the alert, results, and pagination
                    $("#runningAlert").css("visibility", "hidden");
                    $("#resultsHeader").css("visibility", "visible");
                    $("#paginationTop").css("visibility", "visible");
                    $("#paginationBottom").css("visibility", "visible");

                    // create the able
                    window.dataContents = JSON.parse(data['output']);
                    window.totalPages = Math.floor(window.dataContents.length / 10);

                    // if there is a remainder, we will add another page
                    if ((window.dataContents.length % 10) > 0) {
                        window.totalPages++;
                    }

                    // draw table
                    drawTable();
                }
            } else {

                // something went wrong, display it in the console
                abort(data.status);
            }
    });
}

function abort(error) {
    document.getElementById("resultsHeader").innerHTML = error;
    document.getElementById("resultsHeader").style.visibility = "visible";
}

function drawTable() {
    // clear filterResults
    document.getElementById("filterResults").innerHTML = "";

    // iterate through the json contents
    window.dataContents.forEach(x => {
        let pageIndex = x['Index'];

        // if the indices being iterated through are on the current page, we'll display them
        if (((window.currentPage - 1) * 10 <= pageIndex) && ((window.currentPage * 10) - 1 >= pageIndex)){

            // if this is the first index that qualifies, it's the header
            if (pageIndex === (window.currentPage - 1) * 10) {
                drawHeader(x);
            } else {
                drawBody(x);
            }
        }
    });

    updateResultsHeader();
}

// converts level to level display name
function parseLevel(level) {
    switch (level) {
        case "1":
            return "Critical";
        case "2":
            return "Error";
        case "3":
            return "Warning";
        case "4":
            return "Information";
        case "5":
            return "Verbose";
        default:
            return "Other";
    }
}

// formulates and displays the table body
function drawBody(contents) {
    let level = parseLevel(contents['Level']);

    document.getElementById("filterResults").innerHTML +=  '<table class="tg" style="width:100%">\n' +
        '    <colgroup>\n' +
        '        <col style="width:15%">\n' +
        '        <col style="width:15%">\n' +
        '        <col style="width:30%">\n' +
        '        <col style="width:10%">\n' +
        '    </colgroup>\n' +
        '    <tr>\n' +
        '        <td class="tg-1">' + level + '</td>\n' +
        '        <td class="tg-1">' + contents['Date'] + '</td>\n' +
        '        <td class="tg-1">' + contents['Source'] + '</td>\n' +
        '        <td class="tg-1">' + contents['ID'] + '</td>\n' +
        '    </tr>\n' +
        '    <tr>\n' +
        '        <td  class="tg-2" colspan="4"><pre>' + contents['Description'] + '</pre></td>\n' +
        '    </tr>\n' +
        '</table>\n' +
        '<br>\n';
}

// formulates and displays the table header
function drawHeader(contents) {
    let level = parseLevel(contents['Level']);

    document.getElementById("filterResults").innerHTML = '<table class="tg" style="width:100%">\n' +
        '    <colgroup>\n' +
        '        <col style="width:15%">\n' +
        '        <col style="width:15%">\n' +
        '        <col style="width:30%">\n' +
        '        <col style="width:10%">\n' +
        '    </colgroup>\n' +
        '    <tr>\n' +
        '        <th class="tg-h">Level</th>\n' +
        '        <th class="tg-h">Date</th>\n' +
        '        <th class="tg-h">Source</th>\n' +
        '        <th class="tg-h">EventID</th>\n' +
        '    </tr>\n' +
        '    <tr>\n' +
        '        <td class="tg-1">' + level + '</td>\n' +
        '        <td class="tg-1">' + contents['Date'] + '</td>\n' +
        '        <td class="tg-1">' + contents['Source'] + '</td>\n' +
        '        <td class="tg-1">' + contents['ID'] + '</td>\n' +
        '    </tr>\n' +
        '    <tr>\n' +
        '        <td  class="tg-2" colspan="4"><pre>' + contents['Description'] + '</pre></td>\n' +
        '    </tr>\n' +
        '</table>\n' +
        '<br>\n';
}

// increment page global and redraw table
function displayNext() {
    if (window.currentPage < window.totalPages) {
        window.currentPage++;
        drawTable();
    }

}

// decrement page global and redraw table
function displayPrevious() {
    if (window.currentPage > 1) {
        window.currentPage--;
        drawTable();
    }
}

function updateResultsHeader() {
    let results = document.getElementById("resultsHeader");
    results.style.visibility = "visible";
    let lower = (window.currentPage - 1) * 10 + 1;
    let upper = window.currentPage * 10;
    let total = window.dataContents.length;
    if (upper > total) {
        upper = total;
    }
    results.innerHTML = `Displaying results ${lower} - ${upper} of ${total}.`;
}
// handles uploading the .evtx file via ajax
function uploadFile() {
    var formData = new FormData(document.getElementById("fileUpload"));
    $("#uploadResults").html("Uploading...");
    $.ajax({
        url: 'upload.php',
        type: 'POST',
        data: formData,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        success: function(data) {
            $("#uploadResults").html(data);
        }
    });
    return false;
}

// changes form input to demo the application
function demo() {
    $("#logPath").val("sys_demo.evtx");
    $("#idFilter").val("");
    $("#sourceFilter").val("");
    $("input[name='levelFilter'][value='levelError']").prop("checked", true);

    submitForm();
}