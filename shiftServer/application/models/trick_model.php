<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Trick_model extends CI_Model {


    public function __construct() {

        $this->tokenSplitter = ";;;;;;;;;;";
        parent::__construct();
        $this->load->database();
        
    }

    public function createTrick($dogUserId,$data) {
        try {
            $this->load->model('user_model');
            $realIds = $this->user_model->getRealIds($dogUserId);
            $trickData = array(
                'user_id' => $realIds['user_id'],
                'name' => $data->name,
                'created' => $data->created,
            );
            $this->db->set($trickData);
            if (!$this->db->insert('trick')) {
                return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
            }
            $trickId = $this->db->insert_id();
            //update ordinals
            $updateOrdinal = array('ordinal' => 'ordinal + 1'); 
            $this->db->where('user_id', $realIds['user_id']);
            $this->db->where('ordinal > 5');
            $this->db->set('ordinal','ordinal +1',false);
            $this->db->update('trickUser'); 
            //insert trick user
            
            $trickUserData = array(
                'trick_id' => $trickId,
                'user_id' => $realIds['user_id'],
                'deleted' => 0,
                'ordinal' => 6
                
            );
            $this->db->set($trickUserData);
            if (!$this->db->insert('trickUser')) {
                return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
            }
            $tricksData= new stdClass();
            $tricksData->user_id = $realIds['user_id'];
            $tricks = $this->getAllTricks($dogUserId, $tricksData);
            return array("success" => 1,"data"=>array("trickId" =>$trickId, "tricks"=>$tricks['data']));

        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }
    
    
    
    public function numberOfTricks($dogUserId, $data){

        try{
            $this->load->model('user_model');
            $realIds = $this->user_model->getRealIds($dogUserId);
            $this->db->select('COUNT( id ) as c');
            $this->db->from('trick');

            $this->db->where(array('user_id' => $realIds['user_id'], 'deleted' => 0)); 

            $this->db->order_by('created','desc');
            $result = $this->db->get()->row_array();

            if($result){
                return array('success'=>1, 'data'=> $result['c']);
            }else{
                return array('success'=>0 ,'data'=>array());
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function getTricks($dogUserId, $data){
        try{
            $this->load->model('user_model');
            $realIds = $this->user_model->getRealIds($dogUserId);
            $this->db->select('name,id');
            $this->db->where(array('user_id' => $realIds['user_id'], 'deleted' => 0)); 
            $this->db->from('trick');
            $this->db->order_by('created','desc');
            $this->db->limit($data->pageSize, $data->skip);
            $result = $this->db->get()->result_array();
            if($result){
                return array('success'=>1, 'data'=> $result);
            }else{
                return array('success'=>0 ,'data'=>array());
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function getAllTricks($dogUserId, $data){
        try{
            if(isset($data->user_id)){
                $user_id = $data->user_id;
            }else{
                $this->load->model('user_model');
                $realIds = $this->user_model->getRealIds($dogUserId);
                $user_id = $realIds['user_id'];
            }
            $this->db->select('trick.name as name,trick.id as id, trickUser.ordinal as ordinal');
            $this->db->where(array('trickUser.user_id' => $user_id, 'trickUser.deleted' => 0)); 
            $this->db->from('trick');
            $this->db->join('trickUser', 'trickUser.trick_id = trick.id');
            $this->db->order_by('trickUser.ordinal','asc');
            $result = $this->db->get()->result_array();
            if($result){
                return array('success'=>1, 'data'=> $result);
            }else{
                return array('success'=>1 ,'data'=>array());
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    
    public function reoderTricks($dogUserId,$data){
        try{
            $this->load->model('user_model');
            $realIds = $this->user_model->getRealIds($dogUserId);
            $this->db->where('user_id',$realIds['user_id']);
            $this->db->update_batch('trickUser', $data, 'trick_id');
            return array('success'=>1, 'data'=> '');
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function deleteTrick ($dogUserId , $data){
        try{
            $this->load->model('user_model');
            $updateData = array('deleted'=> 1);
            $ids = $this->user_model->getRealIds($dogUserId);
            $userId = $ids['user_id'];
            $whereData = array(
                'user_id' => $userId,
                'trick_id' => $data->trick_id
            );
            $this->db->where($whereData);
            if ($this->db->update('trickUser', $updateData)) {
                $tricksData= new stdClass();
                $tricksData->user_id = $userId;
                $tricks = $this->getAllTricks($dogUserId, $tricksData);
                return array("success" => 1, "data" => array("tricks" => $tricks['data']));
            }
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function getImageSmall($dogUserId, $data){
         try{
             
            $this->load->model('user_model');
            $ids = $this->user_model->getRealIds($dogUserId);
            $where = array('trickUser.trick_id'=> $data->trickId,
                            'trickUser.user_id' => $ids['user_id'],
                );
            
            $this->db->select('imageSmall.name as imageSrc');
            $this->db->from('trickUser');
            $this->db->join('imageDog' , ' trickUser.image_dog_id = imageDog.id' , 'left outer');
            $this->db->join('imageSmall' , ' imageSmall.id = imageDog.small_id' , 'left outer');
            $this->db->where($where);
            $result = $this->db->get()->row_array();
            if($result['imageSrc']){
                $result['imageSrc'] = constructImageSmallUrl($result['imageSrc']) ;
                $result['hasImage'] = true;
            }else{
                $result['hasImage'] = false;
            }
            
            return array("success" => 1, "data" => $result);
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }       
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
                $this->load->model('user_model');
                $ids = $this->user_model->getRealIds($dogUserId);

                $where = array('trickUser.trick_id'=> $data->trickId,
                            'trickUser.user_id' => $ids['user_id'],
                );
                $this->db->where($where);
                $updateData = array(
                       'image_dog_id' => $data->imageDogId
                );
                if(!$this->db->update('trickUser', $updateData)){
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
            $this->load->model('user_model');
            $ids = $this->user_model->getRealIds($dogUserId);

            
            $where = array('trickUser.trick_id'=> $data->trickId,
                            'trickUser.user_id' => $ids['user_id'],
                );
            $this->db->select('imageDog.large_id as id');
            $this->db->from('trickUser');
            $this->db->join('imageDog' , 'imageDog.id = trickUser.image_dog_id');
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
