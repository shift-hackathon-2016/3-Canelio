<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Achievment_pub_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->model('achievment_model');
        $this->load->model('public/user_pub_model');
    }
    
    public function getAchivementPage($dogUserId,$trickId){
        try{
            $this->db->select('name');
            $this->db->from('trick');
            $this->db->where('id',$trickId);
            $trickResult = $this->db->get()->row_array();
            
            $dogResult = $this->user_pub_model->getDog($dogUserId);
            $dogResult['data']['trickName'] = $trickResult['name'];
            
            $achivementData = new stdClass();
            $achivementData->trickId = $trickId;
            $achivementResult = $this->achievment_model->achivmentLevel($dogUserId,$achivementData);
            
            
            $dogResult['data']['achivmentLevel'] = $achivementResult['data']['level'];
            
    
            $trickUserWhere = array(
                'trickUser.user_id' => $dogUserId,
                'trickUser.trick_id' => $trickId
            );
            $this->db->select('trickUser.image_dog_id as imageId');
            $this->db->from('trickUser');
            $this->db->where($trickUserWhere);
            $resultTrickUser = $this->db->get()->row_array();
            

            $this->db->select('level');
            $this->db->from('userLevels');
            $this->db->where('dog_user_id' , $dogUserId);
            $level = $this->db->get()->row_array();
            $dogResult['data']['level'] = $level['level'];
            
            $imageData = new stdClass();
            $imageData->id = $resultTrickUser['imageId'];
            $this->load->model('dog_images_model');
            $imageResult = $this->dog_images_model->getImageBig(null,$imageData);
            
            
            if($imageResult['success'] && $imageResult['data']['large']){
                $dogResult['data']['picTaken'] = true;
                $dogResult['data']['trickPic'] = $imageResult['data']['large'];
            }else{
                $dogResult['data']['picTaken'] = false;
            }
            
            $whereTrickId = array('trick_id' => $trickId);
            $this->db->select('sum(timesTrained) as total, sum(timesSuccess) as success');
            $this->db->from('training');
            $this->db->where($whereTrickId);
            $resultPoints = $this->db->get()->row_array();
            
            $dogResult['data']['total'] = $resultPoints['total'];
            $dogResult['data']['success'] = $resultPoints['success'];

            return array("success" => 1, "data" => $dogResult['data']);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function getAchivmenetForSocial($dogUserId,$trickId){
        try{
            $where= array('id' => $trickId);
            $this->db->select('trick.name as trickName');
            $this->db->from('trick');
            $this->db->where($where);
            $resultTrick = $this->db->get()->row_array();
            
            $dogWhere = array(
                'usersDogs.id' =>$dogUserId
            );
            $this->db->select('dogs.dogName as dogName ');
            $this->db->from('usersDogs');
            $this->db->join('dogs','dogs.id = usersDogs.dog_id');
            $this->db->where($dogWhere);
            $resultDog = $this->db->get()->row_array();
            
            $trickUserWhere = array(
                'trickUser.user_id' => $dogUserId,
                'trickUser.trick_id' => $trickId
                );
            $this->db->select('trickUser.image_dog_id as imageId');
            $this->db->from('trickUser');
            $this->db->where($trickUserWhere);
            $resultTrickUser = $this->db->get()->row_array();
            
            $result = array_merge($resultDog,$resultTrick,$resultTrickUser);
            
            $imageData = new stdClass();
            $imageData->id = $result['imageId'];
            $this->load->model('dog_images_model');
            $imageResult = $this->dog_images_model->getImageBig(null,$imageData);
            
            
            if($imageResult['success'] && $imageResult['data']['large']){
                if($imageResult['data']['width'] < $imageResult['data']['height']){
                    $result['imageUrl'] = $imageResult['data']['large'];                
                }else{
                    $this->load->helper('canelio_server');
                    $result['imageUrl'] = getAchivmentPicFacebookUrl();             
                } 
            }else{
                $this->load->helper('canelio_server');
                $result['imageUrl'] = getAchivmentPicFacebookUrl();
            }
            
            
            return array("success" => 1, "data" => $result);
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }

}

?>
