<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Dog_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->model('dog_images_model');
        $this->load->model('user_model');
        $this->load->helper('canelio_server');
        $this->load->helper('canelio_date');
    }
    
    
    public function uploadImage($dogUserId, $data){
        try{
            $dogImageReturn = $this->dog_images_model->uploadImage($dogUserId, $data);
            if($dogImageReturn['success'] == 1){
                return $dogImageReturn;
            }else{
                return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function cropImage($dogUserId, $data){
        try{
            $dogImageReturn = $this->dog_images_model->cropImage($dogUserId, $data);
            if($dogImageReturn['success'] == 1){
                //update achievment
                $realIds = $this->user_model->getRealIds($dogUserId);
                $updateData = array(
                       'image_dog_id' => $data->imageDogId
                );
                $this->db->where('id', $realIds['dog_id']);
                if(!$this->db->update('dogs', $updateData)){
                     return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
                }
                return $dogImageReturn;
            }else{
                return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function hasImage($dogUserId, $data){
        try{
            $realIds = $this->user_model->getRealIds($dogUserId);
            $where = array('dogs.id' => $realIds['dog_id']);
            $this->db->select('imageDog.large_id as id');
            $this->db->from('dogs');
            $this->db->join('imageDog' , 'imageDog.id = dogs.image_dog_id');
            $this->db->where($where);
            if($result = $this->db->get()->row_array()){
                if(!$result['id']){
                    return array("success" => 1, "data" => array('exists' => false));
                }
                return array("success" => 1, "data" => array('exists' => true, 'largeId'=>$result['id']));
            }else{
               return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1); 
            }

        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }

}

?>
