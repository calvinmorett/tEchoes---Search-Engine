<?php
header('Access-Control-Allow-Origin: *');
$max = 20;

$page = $_POST["page"];
$query = (string)$_POST["query"];
$array = array();

for ($i = 0; $i <= 3; $i++) {
	$db = new SQLite3('db' . $i . '.db');
		
	$results = $db->query("SELECT title, url FROM WEB WHERE title LIKE '%" . $query . "%' LIMIT " . $max . " OFFSET " . ($page - 1) * $max);
	$temp_array = array();
	while ($row = $results->fetchArray(SQLITE3_ASSOC)) {
		$temp_array[] = $row;
	}

	$db->close();
	$array[] = $temp_array;
}

$json = json_encode($array);
echo $json;
?>