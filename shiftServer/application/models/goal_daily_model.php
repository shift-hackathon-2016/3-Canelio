<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Goal_daily_model extends CI_Model {
    
    public function __construct() {
        
        parent::__construct();
        $this->load->helper('canelio_statistic');

    }
    
    public function getGoalsInMonth($dogUserId,$data){
        try{
            $whereData = array(
                'user_id' => $dogUserId,
                'dateTimeTrained >=' => $data->from,
                'dateTimeTrained <=' => $data->to
            );
            $this->db->select('DATE(dateTimeTrained) as date, SUM(timesTrained) as trained');
            $this->db->from('training');
            $this->db->where($whereData);
            $this->db->group_by('DATE(dateTimeTrained)');
            $this->db->order_by('DATE(dateTimeTrained)','desc');
            $result = $this->db->get()->result_array();
            $arrayLength =count($result);
            $fromInputDate = substr($data->from,0,10);
            $toInputDate = substr($data->to,0,10);
            //if there is no training in period insert filler
            $dontSkipRest = true;
            if($arrayLength == 0){
                $from  = substr($data->to,0,10);
                $to = substr($data->from,0,10);
                $result = date_range_filler($from ,$to,true, true,'-1 day');
                $dontSkipRest = false;
            }

            //make filler between from and first date trained
            if($dontSkipRest){
                $i = 0;
                if($result[$i]['date'] != $toInputDate){
                    $from  =  $toInputDate;
                    $to = $result[$i]['date'];
                    $range = date_range_filler($from ,$to,  false, true,'-1 day');
                    array_splice( $result, $i, 0, $range );
                    $i += count($range);
                }
                
                for(;$i < count($result) ;$i++){
                    if($i+1 != count($result) ){
                        $from  =  $result[$i]['date'];

                        $to = $result[$i+1]['date'];

                        $range = date_range_filler($from ,$to, false,false,'-1 day');
                        array_splice( $result, $i+1, 0, $range );

                        $i = $i+ count($range);
                    }
                }
                
    //
    //            //fill from last trained to requested
                $i = $i-1;
                
                if($result[$i]['date'] != $fromInputDate){
                    $from  = $result[$i]['date'];
                    $to = $fromInputDate;
                    $range = date_range_filler($from ,$to, true,false,'-1 day');
                    array_splice( $result, $i+1, 0, $range );

                }
            }
            
            //reoder results and add goalAchieved
            $newRresult = array();
            for($j=count($result) -1;$j>=0;$j--){
                if(isset($result[$j]['trained']) && $result[$j]['trained'] >= $data->goal){
                    $result[$j]['goalAchieved'] = true;
                }else{
                    $result[$j]['goalAchieved'] = false;
                }
                $result[$j]['day'] = date("j",strtotime($result[$j]['date'])) ;
                $newRresult[] =$result[$j];
            }
            return array('success'=>1 ,'data'=>$newRresult);;
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }

}

?>
