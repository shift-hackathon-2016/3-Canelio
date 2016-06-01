<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Dog_images_model extends CI_Model {
    
    public function __construct() {
        
        parent::__construct();
        $this->load->database();
        $this->load->model('images_model');
        $this->load->helper('canelio_server');
    }
    
    public function uploadImage($dogUserId, $data){
        try {
            $this->load->model('user_model');
            $realIds = $this->user_model->getRealIds($dogUserId);
            $imageReturn = $this->images_model->uploadOriginal($realIds['user_id'],$data);
            if($imageReturn['success'] == 1){
                $imageDogData = array(
                    'dog_user_id' => $dogUserId,
                    'large_id' => $imageReturn['data']['largeId'],
                );
                $this->db->set($imageDogData);
                if (!$this->db->insert('imageDog')) {
                    return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
                }
                $imageDogId = $this->db->insert_id();
                $imageReturn['data']['imageDogId'] = $imageDogId;
                return $imageReturn;
            }else{
                 return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }
    }
    
    public function cropImage($dogUserId, $data){
        try {
            $this->load->model('user_model');
            $realIds = $this->user_model->getRealIds($dogUserId);
            $imageReturn = $this->images_model->cropOriginal($realIds['user_id'],$data);
            if($imageReturn['success'] == 1){
                $updateData = array(
                       'small_id' => $imageReturn['data']['smallId']
                    );
                $this->db->where('id', $data->imageDogId);
                $this->db->where('dog_user_id', $dogUserId);
                if (!$this->db->update('imageDog', $updateData)) {
                    return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
                }
                return $imageReturn;
            }else{
                 return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }
    }
    
    public function getImageSmallAndBig($dogUserId,$data){
        try{
                $where = array('imageDog.dog_user_id' => $dogUserId,
                                'imageDog.id' => $data->id
                    );
                
                $this->db->select('imageLarge.name as large, imageSmall.name as small');
                $this->db->from('imageDog');
                $this->db->where($where);
                $this->db->join('imageSmall' , 'imageDog.small_id = imageSmall.id');
                $this->db->join('imageLarge' , 'imageDog.large_id = imageLarge.id');
                $result  = $this->db->get()->row_array();

                if(array_key_exists('large',$result)){
                    $largeUrl = constructImageLargeUrl($result['large']);
                }else{
                    $largeUrl = null;
                }
                if(array_key_exists('small',$result)){
                    $smallUrl  = constructImageSmallUrl($result['small']);
                }else{
                    $smallUrl = null;
                }
                return array("success" => 1, "data"=> array('large'=> $largeUrl, 'small' => $smallUrl));
            } catch (Exception $ex) {
                return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }
    }
    
    
    public function getImageBig($dogUserId,$data){
        try{
                $where = array(
                                'imageDog.id' => $data->id
                    );
                
                $this->db->select('imageLarge.name as large ,imageLarge.width as width, imageLarge.height as height');
                $this->db->from('imageDog');
                $this->db->where($where);
                $this->db->join('imageLarge' , 'imageDog.large_id = imageLarge.id');
                $result  = $this->db->get()->row_array();

                if(array_key_exists('large',$result)){
                    $largeUrl = constructImageLargeUrl($result['large']);
                    $width = $result['width'];
                    $height = $result['height'];
                }else{
                    $largeUrl = null;
                    $width = 0;
                    $height = 0;
                }
                return array("success" => 1, "data"=> array('large'=> $largeUrl, 'width' =>$width, 'height' =>$height));
            } catch (Exception $ex) {
                return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }
    }
    
    public function getImages($dogUserId,$data){
        try {
            $where = array('dog_user_id' => $dogUserId);
            $this->db->select('imageDog.large_id as largeId, imageSmall.name as small');
            $this->db->from('imageDog');
            $this->db->join('imageSmall' , 'imageDog.small_id = imageSmall.id');
            $this->db->where($where);
            $this->db->where('imageDog.small_id IS NOT NULL');
            $this->db->group_by('imageDog.large_id');
            $this->db->order_by('imageSmall.inserted','desc');
            $this->db->limit($data->pageSize*3, $data->skip*3);
            $result = $this->db->get()->result_array();
            $returned = array();
            $line = new stdClass;
            $line->images = array();
            $i = 0;
            foreach ($result as $r){
                $r['small'] = constructImageSmallUrl($r['small']);
                array_push($line->images,$r);
                if (($i+ 1) % 3 == 0) {
                    array_push($returned,$line);
                    $line = new stdClass;
                    $line->images = array();
                }
                $i++;
            }
            if (count($line->images) != 0) {
                array_push($returned,$line);
            }
            return array("success" => 1, "data"=> $returned);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }
    }
    
    public function numberOfImages($dogUserId){
        try {
            $where = array('dog_user_id' => $dogUserId);
//            $this->db->select('imageDog.id as dogImageId, imageSmall.name as small');
            $this->db->select('COUNT( DISTINCT imageDog.large_id) as c');
            $this->db->from('imageDog');
            $this->db->join('imageSmall' , 'imageDog.small_id = imageSmall.id');
            $this->db->where($where);
            $this->db->where('imageDog.small_id IS NOT NULL');
//            $this->output->enable_profiler(TRUE);
            $result = $this->db->get()->row_array();
            $result = ceil($result['c']/3);
            return array("success" => 1, "data"=> $result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }   
    }
    
    public function createFromLarge($dogUserId,$data){
        try {
            $where = array('dog_user_id' => $dogUserId,
                            'large_id'=>$data->largeId);
            $this->db->select('id');
            $this->db->from('imageDog');
            $this->db->where($where);
            $result = $this->db->count_all_results();
            if($result > 0){
                $this->db->set($where);
                if (!$this->db->insert('imageDog')) {
                    return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
                }
                $imageDogId = $this->db->insert_id();
                $this->db->select('name as uid');
                $this->db->from('imageLarge');
                $this->db->where('id',$where['large_id']);
                $result  = $this->db->get()->row_array();
                $result['src'] = constructImageLargeUrl($result['uid']);
                $result['imageDogId'] = $imageDogId;
                return array("success" => 1, "data"=> $result);
            }
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        } 
    }

}

?>
