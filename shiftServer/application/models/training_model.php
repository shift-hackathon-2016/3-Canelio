<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Training_model extends CI_Model {


    public function __construct() {
        
        parent::__construct();
        $this->load->database();
        $this->load->model('statistics_model');
        $this->load->model('achievment_model');
        $this->load->model('level_model');
    }

    public function train($userId,$data) {
        try {
            $originalData = $data;
            
            $this->db->select('timesTrained,timesSuccess');
            $this->db->from('training');
            $whereData = array(
                'user_id' => $userId,
                'dateTimeTrained' => strtotime($data->dateTimeTrained),
                'trick_id' => $data->trick_id,
            );
            $this->db->where($whereData);
            $existingTraining = $this->db->get()->row_array();
            if($existingTraining && $existingTraining['timesTrained'] > 0){
                $updateData = array(
                       'timesTrained' => $data->timesTrained + $existingTraining['timesTrained'],
                        'timesSuccess' => $data->timesSuccess + $existingTraining['timesSuccess']
                );
                $this->db->where('user_id', $userId);
                $this->db->where('trick_id', $data->trick_id);
                $this->db->where('dateTimeTrained',strtotime($data->dateTimeTrained));
                if(!$this->db->update('training', $updateData)){
                     return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
                }
            }else{
                $data = array(
                'user_id' => $userId,
                'timesTrained' => $data->timesTrained,
                'timesSuccess' => $data->timesSuccess,
                'dateTimeTrained' => strtotime($data->dateTimeTrained),
                'trick_id' => $data->trick_id,
                );
                $this->db->set($data);
                if (!$this->db->insert('training')) {
                    return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
                }        
            }

            //check if achivement won
            $originalData->custome_trick = 0;
            $return = $this->achievment_model->checkAchivementWon($userId, $originalData);
            $levelData = new stdClass;
            //check if levels won
            $levelData->points = $originalData->timesTrained - $originalData->timesSuccess + $originalData->timesSuccess *2;
            $levelReturn = $this->level_model->updatePoints($userId,$levelData);
            if($return['success'] && $return['data']){
                $returned = array(
                    'achivementWon' => true,
                    'achivementId'=> $return['data']['achivmentId'] ,
                    'trickName' => $return['data']['trickName']);
                if(is_array($levelReturn['data'])){
                    $returned = array_merge($returned,$levelReturn['data']);              
                }
                return array("success" => 1,"data"=> $returned);
            }
            //if simple return todays training
            $originalData->dateTime = $originalData->dateTimeTrained;
            if(isset($originalData->simple) && $originalData->simple){
                $returned = $this->statistics_model->getTodayTrainingData($userId, $originalData);
                if(is_array($levelReturn['data'])){
                    $returned['data'] = array_merge($returned['data'],$levelReturn['data']);             
                }
                return array("success" => 1,"data"=>$returned['data']);
            }
            return array("success" => 1,"data"=>array());
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }
    
    public function trainMultiple($dogUserId,$data){
//        return 123;
        try {
//            $lastTime = $data->timeToCheck;
            $training = $data->training;
            $trick_ids = array();
            $trainingToInsert = array();
            $trainingToCheck = array();
            $trainingLength = count($training);
            $totalPoints = 0;
//            sort and format trainings
            for($i=0;$i < $trainingLength;$i++ ){
                $tr = array("dateTimeTrained" => $training[$i]->time,
                            "timesTrained" => $training[$i]->timesTrained,
                            "timesSuccess" => $training[$i]->timesSuccess,
                            "trick_id"=> $training[$i]->trick_id,
                            "user_id" => $dogUserId,
                    );
//                if($training[$i]->time == $lastTime){
                    array_push($trainingToCheck, $tr);
//                }else{
//                    array_push($trainingToInsert, $tr);
//                }
                if(!in_array($training[$i]->trick_id, $trick_ids)){
                    array_push($trick_ids,$training[$i]->trick_id );
                }
                $totalPoints = $totalPoints
                        + intval($training[$i]->timesTrained) - intval($training[$i]->timesSuccess) 
                        + intval($training[$i]->timesSuccess*2);
            }
//            $deleteWhere = array('user_id'=> $dogUserId,
//                                'dateTimeTrained >=' =>$lastTime);
//            $this->db->where($deleteWhere);
//            $this->db->delete('training');
            
//            if(count($trainingToInsert)>0){
//                $this->db->insert_batch('training', $trainingToInsert);   
//            }

//            insert or update trainings with questionable times
            for($i= 0; $i < count($trainingToCheck);$i++){
                $whereData = array(
                    'dateTimeTrained' =>$trainingToCheck[$i]['dateTimeTrained'],
                    'trick_id' => $trainingToCheck[$i]['trick_id'],
                    "user_id" => $dogUserId
                );
                $this->db->select('timesTrained,timesSuccess');
                $this->db->from('training');
                $this->db->where($whereData);
                $result = $this->db->get()->row_array();
                if($result && $result['timesTrained']){
                    $updateData = array(
                        "timesTrained" => intval($result['timesTrained'])+ intval($trainingToCheck[$i]['timesTrained']),
                        "timesSuccess" => intval($result['timesSuccess'])+intval($trainingToCheck[$i]['timesSuccess'])
                    );
                    $this->db->where($whereData);
                    $this->db->update('training',$updateData);
                }else{
                    $this->db->set($trainingToCheck[$i]);
                    $this->db->insert('training');
                }
            }
            //check each trick_id achievment
            $achivements = array();
            for($i = 0 ; $i < count($trick_ids);$i++){
                $achivmentData = new stdClass;
                $achivmentData->trick_id = $trick_ids[$i];
                $result = $this->achievment_model->checkAchivementWon($dogUserId, $achivmentData);
                if($result['data']){
                    array_push($achivements, $result['data']);
                }
            }
            //update level and points
            $levelData = new stdClass;
            $levelData->points = $totalPoints;
            $levelReturn = $this->level_model->updatePoints($dogUserId,$levelData);
            return array("success" => 1, "data"=>array("level" =>$levelReturn['data'], "achivments"=> $achivements));
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }   
    }
    
    
    function getTrainingCount($dogUserId,$data){
        try {
            $this->db->select('COUNT(*) as count');
            $this->db->from('training');
            $this->db->where(array('user_id'=>$dogUserId));
            $result = $this->db->get()->row_array();
            return array("success" => 1, "data"=>array('count'=> $result['count']));
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }      
    }
    
    function getTrainingForLocal($dogUserId,$data){
        try {
            $this->db->select('timesTrained,timesSuccess,dateTimeTrained as time,trick_id');
            $this->db->from('training');
            $this->db->where(array('user_id'=>$dogUserId));
            $this->db->limit($data->bufferSize , $data->offset);
            $result = $this->db->get()->result_array();
            return array("success" => 1, "data"=>$result);
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }      
    }
    



}

?>
