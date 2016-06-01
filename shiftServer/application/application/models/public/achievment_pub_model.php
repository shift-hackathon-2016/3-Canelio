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
    
    public function getAchivementPage($achivementId){
        try{
            $where = array(
                'id' => $achivementId
            );
            $this->db->select('shared,dog_user_id, trick_id');
            $this->db->from('achievments');
            $this->db->where($where);
            $result = $this->db->get()->row_array();
            if($result['shared']){
                $achivementData = new stdClass();
                $achivementData->achivmentId = $achivementId;
                $achivementResult = $this->achievment_model->singleAchivement($result['dog_user_id'],$achivementData);
                $this->db->select('name');
                $this->db->from('trick');
                $this->db->where('id',$result['trick_id']);
                $trickResult = $this->db->get()->row_array();
                
                $dogResult = $this->user_pub_model->getDog($result['dog_user_id']);
                $dogResult['data']['trickName'] = $trickResult['name'];
                
                $returnData = array_merge ($dogResult['data'], $achivementResult['data']);
                
                return array("success" => 1, "data" => $returnData);
                
            }else{
                return array("success" => 0, "message" => "achivement not shared", "errorCode" => 2);
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function getAchivmenetForSocial($achivementId){
        try{
            $where = array(
                'achievments.id' => $achivementId
            );
            $this->db->select('achievments.shared as shared ,trick.name as trickName , dogs.dogName as dogName,achievments.image_dog_id as imageId');
            $this->db->from('achievments');
            $this->db->where($where);
            $this->db->join('usersDogs', 'usersDogs.id =achievments.dog_user_id');
            $this->db->join('dogs', 'dogs.id=usersDogs.dog_id ');
            $this->db->join('trick' ,'trick.id = achievments.trick_id');
            $result = $this->db->get()->row_array();
            if($result['shared']){
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
            }else{
                return array("success" => 0, "message" => "achivement not shared", "errorCode" => 2);
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }

}

?>
