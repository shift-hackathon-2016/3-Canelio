<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

    function getDateFromDateTime ($date){
        return substr($date,0,10);
    }

    function addTimeToDate($date, $dayStart) {
        if ($dayStart) {
            return $date . " 00:00:00";
        }
        return $date . " 23:59:59";
    }
    
    function startDateTime($onlyDate){
        $date ='2000-01-01';
        if(!$onlyDate){
            $date = addTimeToDate($date,true);
        }
        return $date;
    }
    


?>
