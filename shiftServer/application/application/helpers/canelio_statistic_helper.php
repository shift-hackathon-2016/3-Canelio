<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

    
    function date_range_filler($from, $to,$addLast = false,$addFrist = false, $step = '-1 day', $output_format = 'Y-m-d' ) {
        
        
        $dates = array();
        if(!$addFrist){
            $from = strtotime($from);
            $current = strtotime($step, $from);
        }else{
           $current = strtotime($from); 
        }
        
        $to = strtotime($to);
        
        if(!$addLast){
            while( $to < $current ) {
                $filler = array('nan'=> true , 'date'=> date($output_format, $current));
                $dates[] = $filler;
                $current = strtotime($step, $current);
            }
        }else{
           while( $to <=  $current) {
                $filler = array('nan'=> true , 'date'=> date($output_format, $current));
                $dates[] = $filler;
                $current = strtotime($step, $current);
            } 
        }
        return $dates;
    }

?>
