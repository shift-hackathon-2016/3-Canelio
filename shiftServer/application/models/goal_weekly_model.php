<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Goal_weekly_model extends CI_Model {
    
    public function __construct() {
        
        parent::__construct();
    }
    
    public function getGoalsInMonth($dogUserId,$data){
        try{
            $weeks = $data->weeks;
            $goal = $data->goal;
            $returned = array();
            foreach ($weeks as $w){
                $whereData = array(
                    'user_id' => $dogUserId,
                    'dateTimeTrained >=' => $w->from,
                    'dateTimeTrained <=' => $w->to
                );
                $this->db->select('SUM(timesTrained) as trained');
                $this->db->from('training');
                $this->db->where($whereData);
                $trained = $this->db->get()->row_array();
                if($trained['trained'] >= $goal){
                    $goalAchieved = true;
                }else{
                    $goalAchieved = false;
                }
                $newWeek = array('from'=>$w->from, 'to'=> $w->to ,'trained' => $trained['trained'], 'goalAchieved' => $goalAchieved);
                array_push($returned, $newWeek);
            }
            return array("success" => 1, "data" => $returned);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }

}

?>
