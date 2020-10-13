<?php
// grab variables from POST
$logPath = $_POST['logPath'];
$idFilter = preg_replace("/\s/", "", $_POST['idFilter']);
$sourceFilter = preg_replace("/\s/", "", $_POST['sourceFilter']);
$eventLevel = $_POST['eventLevel'];
$gevCommand = ".\gev\gev.exe ";

// append path to gev
if ($logPath != "") {
    $gevCommand .= ("--path .\uploads\\" . $logPath . " ");
} else {
    // they didn't give a path, very bad user
    $data['status'] = "Error: A path is required.";
}

// append IDs to gev
if ($idFilter != "") {
    $gevCommand .= ("--id " . $idFilter . " ");
}

// append sources to gev
if ($sourceFilter != "") {
    $gevCommand .= ("--source " . $sourceFilter . " ");
}

// append eventLevel to gev
if ($eventLevel == "levelError") {
    $gevCommand .= ("--level 1,2 ");
} elseif ($eventLevel == "levelAll") {
    $gevCommand .= ("--level 1,2,3,4,5 ");
}

// reverse direction
$gevCommand .= "--direction 2";

// echo the command for debugging purposes
$data['command'] = $gevCommand;

// run the command and get the output
$data['output'] = shell_exec($gevCommand);
$data['status'] = "ok";

echo json_encode($data);