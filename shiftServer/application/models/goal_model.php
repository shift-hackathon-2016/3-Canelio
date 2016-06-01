<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Goal_model extends CI_Model {
    
    public function __construct() {
        
        parent::__construct();
        $this->load->database();
        $this->load->helper('canelio_date');
    }
     
    
    public function setGoal($dogUserId,$data){
        try{
            if($data->type == 'daily'){
                $tableName = 'goalDaily';
            }else if($data->type == 'weekly'){
                $tableName = 'goalWeekly';
            }
            $this->db->select('goal');
            $this->db->from($tableName);            
            $select = array(
                'dog_user_id' => $dogUserId
            );
            $this->db->where($select);
            $result = $this->db->get()->row_array();
            if(array_key_exists('goal',$result)){
                //exists update it
                $update = array('goal' => $data->goal);
                $this->db->where('dog_user_id' , $dogUserId);

                $this->db->update($tableName,$update);
                $goalsDone = $this->getGoals($dogUserId,$data);
                return array("success" => 1,"data"=>$goalsDone['data']);
            }else{
                //insert
                $dbData = array(
                    'dog_user_id' => $dogUserId,
                    'goal' => $data->goal
                );
                $this->db->set($dbData);
                $this->db->insert($tableName);
                $goalsDone = $this->getGoals($dogUserId,$data);
                return array("success" => 1,"data"=>$goalsDone['data']);
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }
    
    public function getTricksDoneForPeriod($dogUserId,$data){
        try{
        $whereData = array(
                'training.user_id' => $dogUserId,
                'training.dateTimeTrained >=' => $data->from,
                'training.dateTimeTrained <=' => $data->to
            );
            $this->db->select('SUM(training.timesTrained) as timesTrained , trick.name as trickName');
            $this->db->from('training');
            $this->db->where($whereData);
            $this->db->group_by('training.trick_id');
            $this->db->order_by('SUM(training.timesTrained)','desc');
            $this->db->join('trick','trick.id = training.trick_id');
            $result = $this->db->get()->result_array();
            return array('success'=>1,'data' =>$result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }      
    }
    
    public function getGoals($dogUserId,$data){
        try{
            $daily = $this->getGoalDaily($dogUserId,$data);
            $weekly = $this->getGoalWeekly($dogUserId,$data);
            $result = array_merge($daily['data'],$weekly['data']);
            return array('success'=>1,'data' =>$result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }     
    }
    
    private function getGoalDaily($dogUserId,$data){
        try{
            $this->db->select('goal');
            $this->db->from('goalDaily');            
            $select = array(
                'dog_user_id' => $dogUserId
            );
            $this->db->where($select);
            $result = $this->db->get()->row_array();
            $dailyGoal = null;
            $dailyGoalDone = 0;

            if(array_key_exists('goal',$result)){
                $dailyGoal= $result['goal'];
                $where = array('user_id' => $dogUserId,
                    'dateTimeTrained >=' => addTimeToDate($data->dailyToday, true),
                    'dateTimeTrained <=' => addTimeToDate($data->dailyToday, false),);
                $this->db->select('SUM(timesTrained) as timesTrained');
                $this->db->from('training');
                $this->db->where($where);
                $result = $this->db->get()->row_array();
                if(array_key_exists('timesTrained',$result) && $result['timesTrained']){
                    $dailyGoalDone = $result['timesTrained'];
                }
            }
            return array("success" => 1, "data"=> array('dailyGoal' =>$dailyGoal, 'dailyGoalDone' => $dailyGoalDone));
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }            
    }
    
    private function getGoalWeekly($dogUserId,$data){
        try{
            $this->db->select('goal');
            $this->db->from('goalWeekly');            
            $select = array(
                'dog_user_id' => $dogUserId
            );
            $this->db->where($select);
            $result = $this->db->get()->row_array();
            $weeklyGoal = null;
            $weeklyGoalDone = 0;

            if(array_key_exists('goal',$result)){
                $weeklyGoal = $result['goal'];
                $where = array('user_id' => $dogUserId,
                    'dateTimeTrained >=' => addTimeToDate($data->weeklyDayStart, true),
                    'dateTimeTrained <=' => addTimeToDate($data->weeklyDayEnd, false),);
                $this->db->select('SUM(timesTrained) as timesTrained');
                $this->db->from('training');
                $this->db->where($where);
                $result = $this->db->get()->row_array();
                if(array_key_exists('timesTrained',$result) && $result['timesTrained']){
                    $weeklyGoalDone = $result['timesTrained'];
                }
            }
            return array("success" => 1, "data"=> array('weeklyGoal' =>$weeklyGoal, 'weeklyGoalDone' => $weeklyGoalDone));
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }        
    }


    
}

?>
