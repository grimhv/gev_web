<!DOCTYPE html>
<html lang="en">
    <head>
        <link rel="stylesheet" href="/css/gev_web.css">
		<meta charset="UTF-8" http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"> 
        <title>Event Viewer Parser</title>

        <!-- include jquery -->
        <script src="http://code.jquery.com/jquery-latest.js"></script>

        <!-- this script sends the POST for filterForm to submit.php -->
        <script type="text/javascript" src="/js/gev_web.js"></script>

    </head>
    <body>
        <h2><pre>Gev Web - Written by Anthony Grimaldi</pre></h2>
        <pre>This application was created in order to allow filtering event logs online (primarily to allow viewing .evtx files from a non-windows workstation).</pre><br>
        <pre>The event log parser was written in C# and uses LINQ and XPATH, and outputs an HTML table that is injected into the browser by jQuery.</pre><br>
        <br>
        <pre>Also check out <a href="/realty/index.html">my realty project!</a></pre>
        <br><br>
        <pre>Instructions:</pre><br>
        <pre>    1. Select a log and click upload.</pre><br>
        <pre>    2. It will auto-populate the "Log name:" field with the uploaded file's name.</pre><br>
        <pre>    3. Input IDs or Sources in the appropriate text boxes.</pre><br>
        <pre>       -You can input more than one of each, separate them with commas. Each field has a max of five.</pre><br>
        <pre>       -I.E. IDs: "42, 8443, 55, 16783, 12345" or Sources: "VSS, chkdsk, wininit".</pre><br>
        <pre>       -You can also input both IDs and sources if you feel so inclined.</pre><br>
        <pre>    4. Choose between selecting all events or just warning/error/critical events.</pre><br>
        <pre>    5. Submit.</pre><br><br>
		<pre>    If you want to demo the application, you can put either "app_demo.evtx" or "sys_demo.evtx" into the "Log name:" field without uploading</pre><br>
		<pre>      anything.  Or, simply click the "demo" button.</pre><br>
        <br>

        <!-- file upload form -->
        <form method="post" id="fileUpload" name="fileUpload" onsubmit="return uploadFile();">
            <label>Select a file:</label><br>
            <input type="file" name="file" required>
            <input type="submit" value="Upload">
        </form>
        <br>
        <div id="uploadResults"></div>
        <br>

        <!-- form to get filters -->
        <form id="filterForm" method="post">
            <pre>    Log name: </pre><input name="logPath" id="logPath" type="text" size="25"><pre>*required</pre><br>
            <pre>         IDs: </pre><input name="idFilter" id="idFilter" type="text" size="25"><br>
            <pre>     Sources: </pre><input name="sourceFilter" id="sourceFilter" type="text" size="25"><br>
            <pre>Event Levels: </pre><input name="levelFilter" type="radio" value="levelAll" checked><pre>All</pre>
            <input name="levelFilter" type="radio" value="levelError"><pre>Warning/Error/Critical</pre><br>
            <br>
            <input type="button" id="submitFormData" onclick="submitForm();" value="Submit">
            <input type="button" id="demoButton" onclick="demo();" value="Demo">
        </form>

        <br>
        <pre id="runningAlert" style="visibility:hidden;color:#CF6060;font-size:17px;">Running query...</pre>

        <h3 id="resultsHeader" style="visibility:hidden;">Results:</h3>
        <!-- pagination container -->
        <div class="paginationContainer">
            <div style="display:inline;visibility:hidden" id="paginationBottom">

                <!-- previous button -->
                <input type="button" value="&laquo; Prev" class="buttonPrevious" onclick="displayPrevious();">

                <!-- next button -->
                <input type="button" value="Next &raquo;" class="buttonNext" onclick="displayNext();">
            </div>
        </div>
        <br>
        <!-- where we update the filter results -->
        <div id="filterResults"></div>


        <div class="paginationContainer">
            <div style="display:inline;visibility:hidden" id="paginationTop">

                <!-- previous button -->
                <input type="button" value="&laquo; Prev" class="buttonPrevious" onclick="displayPrevious();">

                <!-- next button -->
                <input type="button" value="Next &raquo;" class="buttonNext" onclick="displayNext();">
            </div>
        </div>
    </body>
</html>