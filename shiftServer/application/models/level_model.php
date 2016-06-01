<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Level_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function insertLevelForDogUser($dogUserId,$data){
        try{
            $data = array('dog_user_id'=>$dogUserId, 'level'=>'1','points'=>'0');
            $this->db->set($data);
            $this->db->insert('userLevels');
            return array("success" => 1, "data" => null);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }
    
    public function getLevelPoints($dogUserId,$data){
        try{
            $where = array('dog_user_id'=>$dogUserId);
            $this->db->select('userLevels.level as userLevel,userLevels.points as userPoints,levelsPoints.points as levelPoints');
            $this->db->from('userLevels');
            $this->db->join('levelsPoints','levelsPoints.level = userLevels.level');
            $this->db->where($where);
            $result = $this->db->get()->row_array();
            $result['pointsNeeded'] = $result['levelPoints'] -  $result['userPoints'];
            
            //get current title
            $this->db->select('title');
            $this->db->from('levelsTitles');
            $whereCurrent = array(
                'lvl <=' =>$result['userLevel']
            );
            $this->db->where($whereCurrent);
            $this->db->order_by('lvl','desc');
            $this->db->limit('1');
            $resultTitle = $this->db->get()->row_array();
            $result['title'] = $resultTitle['title'];
            return array("success" => 1, "data" => $result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }
    
    public function updatePoints($dogUserId,$data){
        try{
            $pointsToAdd = $data->points;
            $levelsWon = 0;
            $startingLevel = 1;
            $startingLevelSelected = false;
            while($pointsToAdd != 0){
                $where = array('dog_user_id'=>$dogUserId);
                $this->db->select('userLevels.level as userLevel,userLevels.points as userPoints,levelsPoints.points as levelPoints');
                $this->db->from('userLevels');
                $this->db->join('levelsPoints','levelsPoints.level = userLevels.level');
                $this->db->where($where);
                $result = $this->db->get()->row_array();
                //startingLevel needed for figuring if new title iswon
                if(!$startingLevelSelected){
                    $startingLevelSelected = true;
                    $startingLevel = $result['userLevel'];
                }
                if($result['userLevel'] < 1000){
                    if($pointsToAdd + $result['userPoints'] >= $result['levelPoints']){
                        //upgradeLevel
                        $difference = abs($result['levelPoints'] -$result['userPoints']);
                        $pointsToAdd = $pointsToAdd - $difference;
                        $this->db->set('points','0',false);
                        $this->db->set('level','level +1',false);
                        $this->db->where($where);
                        $this->db->update('userLevels'); 
                        $levelsWon++;
                    }else{
                        $points = $pointsToAdd + $result['userPoints'];
                        $updateData  =array(
                            'points' => $points,
                        );
                        $this->db->set($updateData);
                        $this->db->where($where);
                        $this->db->update('userLevels');
                        $pointsToAdd = 0;
                    }               
                }else{
                    $pointsToAdd = 0;
                }
            }
            
            if($levelsWon >0){
                $result = $this->getLevelPoints($dogUserId,$data);
                $result['data']['levelsWon'] = $levelsWon;
                //check titles won
                $data = new stdClass;
                $data->prevLevel = $startingLevel;
                $data->currentLvl =$result['data']['userLevel'];
                $titlesResult = $this->checkTitleWon($dogUserId, $data);
                $result['data']['titleWon'] = $titlesResult['data'];
                return array("success" => 1, "data" => $result['data']);
            }else{
                return array("success" => 1, "data" => null);
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }
    
    
    private function checkTitleWon($dogUserId,$data){
        try{
            $prevLvl = $data->prevLevel ;
            $currentLvl = $data->currentLvl;
            $wherePrev = array(
                'lvl <=' =>$prevLvl
            );
            $this->db->select('id,title');
            $this->db->from('levelsTitles');
            $this->db->where($wherePrev);
            $this->db->order_by('lvl','desc');
            $this->db->limit('1');
            $resultPrev = $this->db->get()->row_array();
            
            $whereNext = array(
                'lvl <=' =>$currentLvl
            );
            $this->db->select('id as position,title');
            $this->db->from('levelsTitles');
            $this->db->where($whereNext);
            $this->db->order_by('lvl','desc');
            $this->db->limit('1');
            $resultCurrent = $this->db->get()->row_array();
            if($resultPrev['id'] != $resultCurrent['position']){
                return array("success" => 1, "data" => $resultCurrent);
            }
            return array("success" => 1, "data" => null);
         } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }       
    }

}

?>
