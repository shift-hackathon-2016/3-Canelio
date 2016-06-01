<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Statistics_model extends CI_Model {

    public function __construct() {

        parent::__construct();
        $this->load->database();
        $this->load->helper('canelio_date');
        $this->load->helper('canelio_statistic');
    }

    public function getTrickData($userId, $data) {
        try {
            $data = array(
                'user_id' => $userId,
                'dateTimeTrained >=' => strtotime(addTimeToDate($data->from, true)),
                'dateTimeTrained <=' => strtotime(addTimeToDate($data->to, false)),
                'trick_id' => $data->trick_id
            );
            $this->db->select('SUM(timesTrained) as total,SUM(timesSuccess) as success,DATE(FROM_UNIXTIME(dateTimeTrained)) as date');
            $this->db->where($data);
            $this->db->group_by('DATE(FROM_UNIXTIME(dateTimeTrained))');
            $this->db->from('training');
            $result = $this->db->get()->result_array();
            if (!$result) {
                return array("success" => 1, "data" => array());
            }
            return array("success" => 1, "data" => $result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }

    public function getSubGroupData($userId, $data) {
        try {
            $data = array(
                'training.user_id' => $userId,
                'training.dateTimeTrained >=' => addTimeToDate($data->from, true),
                'training.dateTimeTrained <=' => addTimeToDate($data->to, false),
                'groupTrickJoin.group_id' => $data->group_id
            );
            $this->db->select('SUM(training.timesTrained) as total,'
                    . 'SUM(training.timesSuccess) as success,'
                    . 'DATE(training.dateTimeTrained) as date,'
                    . 'groupTrickJoin.trick_id');
            $this->db->where($data);
            $this->db->group_by(array('DATE(dateTimeTrained)','groupTrickJoin.trick_id'));
            $this->db->from('groupTrickJoin');
            $this->db->join('training', 'training.trick_id = groupTrickJoin.trick_id','LEFT');
            $result = $this->db->get()->result_array();
            if (!$result) {
                return array("success" => 1, "data" => array());
            }
            return array("success" => 1, "data" => $result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function getGroupData($userId, $data) {
        try {
            $formatedData = array(
                'training.user_id' => $userId,
                'training.dateTimeTrained >=' => addTimeToDate($data->from, true),
                'training.dateTimeTrained <=' => addTimeToDate($data->to, false),
                'groupGroupJoin.group_parent' => $data->group_id
            );
            $this->db->select('SUM(training.timesTrained) as total,'
                    . 'SUM(training.timesSuccess) as success,'
                    . 'DATE(training.dateTimeTrained) as date,'
                    . 'groupGroupJoin.group_child as trick_id,');
            $this->db->where($formatedData);
            $this->db->group_by(array('DATE(dateTimeTrained)','groupGroupJoin.group_child'));
            $this->db->from('groupGroupJoin');
            $this->db->join('groupTrickJoin', 'groupTrickJoin.group_id = groupGroupJoin.group_child','LEFT');
            $this->db->join('training', 'training.trick_id = groupTrickJoin.trick_id','LEFT');
            $resultGroups = $this->db->get()->result_array();
            //get tricks joined on that group
            $resultTricks = $this->getSubGroupData($userId,$data);
            $resultTricks = $resultTricks["data"];
            //sort array by dates
            $result = array_merge($resultGroups,$resultTricks) ;
            usort($result, function($a, $b) {
                $ad = new DateTime($a['date']);
                $bd = new DateTime($b['date']);
                if ($ad == $bd) {
                  return 0;
                }
                return $ad < $bd ? -1 :  1;
              });
            if (!$result) {
                return array("success" => 1, "data" => array());
            }
            return array("success" => 1, "data" => $result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
   
    public function getTodayTrainingData($userId,$data){
        try {
            $date = getDateFromDateTime($data->dateTime);
//             $this->db->select('SUM(timesTrained) as timesTrained,SUM(timesSuccess) as timesSuccess,DATE(dateTimeTrained) as date, COUNT(timesTrained) as counted');
//          DATE_FORMAT(dateTimeTrained,"%Y-%m-%d")
            $this->db->select('SUM(timesTrained) as timesTrained,SUM(timesSuccess) as timesSuccess, COUNT(timesTrained) as counted');
            $this->db->from('training');
            $this->db->where(array('user_id' => $userId,
                'trick_id' => $data->trick_id,
                'dateTimeTrained >=' => strtotime(addTimeToDate($date, true)),
                'dateTimeTrained <=' => strtotime(addTimeToDate($date, false)))); 
    //        $this->db->limit(1);
            $query = $this->db->get();
            $returned =  $query->row_array();
            if($returned['counted']>0){
                return array('success'=>1,'data'=>$returned );
            }else{
                return array('success'=>1 ,'data'=>array());
            }
        }catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
     
    
    //za test2
//    public function getDates($dogUserId,$data){
//        $whereData = array(
//            'user_id' => $dogUserId,
//            'dateTimeTrained >=' => addTimeToDate($data->from, true),
//            'dateTimeTrained <=' => addTimeToDate($data->to, false),
//            'trick_id' => $data->trick_id
//        );
//        $this->db->select('SUM(timesTrained) as total,SUM(timesSuccess) as success,DATE(dateTimeTrained) as date');
//        $this->db->where($whereData);
//        $this->db->group_by('DATE(dateTimeTrained)');
//        $this->db->order_by('DATE(dateTimeTrained)','desc');
//        $this->db->from('training');
//        $result = $this->db->get()->result_array();
//        $arrayLength =count($result);
//        //if there is no training in period insert filler
//        if($arrayLength == 0){
//            $from  = $data->to;
//            $to = $data->from;
//            $range = date_range_filler($from ,$to,true, true);
//            return array('success'=>1 ,'data'=>$range);
//        }
//        
//        //make filler between from and first date trained
//        $i = 0;
//        if($result[$i]['date'] != $data->to){
//            $from  =  $data->to;
//            $to = $result[$i]['date'];
//            $range = date_range_filler($from ,$to, false, true);
//            array_splice( $result, $i, 0, $range );
//            $i += count($range);
//        }
//
//        for(;$i < count($result) ;$i++){
//            if($i+1 != count($result) ){
//                $from  =  $result[$i]['date'];
//
//                $to = $result[$i+1]['date'];
//
//                $range = date_range_filler($from ,$to, false,false, '-1 day');
//                array_splice( $result, $i+1, 0, $range );
//  
//                $i = $i+ count($range);
//            }
//        }
//
//        //fill from last trained to requested
//        $i = $i-1;
//        if($result[$i]['date'] != $data->from){
//            $from  = $result[$i]['date'];
//            $to = $data->from;
//            $range = date_range_filler($from ,$to, true);
//            array_splice( $result, $i+1, 0, $range );
//            
//        }
//        
//        
//        //add weekly sum
//        $sumFail = 0;
//        $sumSuccess = 0;
//        for($i=0; $i< count($result);$i++){
//            $time =  strtotime($result[$i]['date']);
//            $dw = date( "w", $time);
//        }
//        
//        
//        return array('success'=>1 ,'data'=>$result);;
//    }
    
    
}

?>
