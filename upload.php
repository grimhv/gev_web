<?php
if ($_POST["label"]) {
    $label = $_POST["label"];
}

// set the name of the new file with format "MMDDYYhhmmss_#####.evtx"
$newFileName = date("mdYHis") . "_" . rand(10000,99999) . ".evtx";

// may update this to include .evt eventually
$allowedExts = array("evtx");

// DEBUGGING INFORMATION
/*
echo "Label: " . $label . "<br>";
echo "Upload: " . $_FILES["file"]["name"] . "<br>";
echo "Type: " . $_FILES["file"]["type"] . "<br>";
echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
*/

// get the extension of the file
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

// check if it's in the array
if (in_array($extension, $allowedExts)) {
// check for errors
    if ($_FILES["file"]["error"] > 0) {
        echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
    } else {
        $filename = $label . $_FILES["file"]["name"];

        // check if the file already exists, pretty much a 0% chance
        if (file_exists("uploads/" . $newFileName)) {
            echo $filename . " already exists. ";
        } else {
            // copy the file from the uploads/tmp folder to uploads/ with the randomly generated filename
            move_uploaded_file($_FILES["file"]["tmp_name"],
                "uploads/" . $newFileName);

            // see if it made it
            if (file_exists("uploads/" . $newFileName)) {
                echo "File uploaded successfully. Filename: '" . $newFileName . "'";
            } else {
                // something went wrong
                echo "Something went wrong";
            }
            // update the logPath input box to include the new, uploaded file
            echo "<script>document.getElementById(\"logPath\").value = \"" . $newFileName . "\"</script>";
        }
    }
} else {
  echo "Invalid file.  Needs to be a .evtx file.";
}