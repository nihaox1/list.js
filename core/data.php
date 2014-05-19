<?php
$start = $_POST["start"];
$offset = $_POST["offset"];
//sleep( 3 );
$rtn = array();
for($i = 0; $i < $offset; $i++){
	array_push( $rtn , array( "name"=>"xxxxxx_" . ( $start + $i ) ) );
};
print_r( json_encode( $rtn ) );
?>