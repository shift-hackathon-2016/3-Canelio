<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Images_model extends CI_Model {


    public function __construct() {
        
        parent::__construct();
        $this->load->database();
        $this->load->helper('canelio_server');
        $this->load->database();
    }

    public function uploadOriginal($userId, $data) {
        try {
            $img = $data->img;
            $img = base64_decode($img);
            $uid = uniqid ();
            $fileName = $uid.'.jpg';
            $fullImgPath = 'uploads/images/large/'.$fileName;
            file_put_contents($fullImgPath,$img);
            $targetHeight = $data->targetHeight *2;
            $targetWidth = $data->targetWidth *2;
            //check if its image
            if(!$size = getimagesize($fullImgPath)){
                unlink($fullImgPath);
                return array("success" => 0, "message" => "Something went wrong","errorCode"=>1);
            }
            //resize if needed
            if($size[0] > $targetWidth || $size[1]> $targetHeight ){
                $config['image_library'] = 'gd2';
                $config['source_image']	= $fullImgPath;
                $config['maintain_ratio'] = TRUE;
                $config['width']	= $targetWidth;
                $config['height']	= $targetHeight;
//                $config['new_image'] = 'uploads/images/large/'.$fileName;
                $this->load->library('image_lib', $config); 
                if(!$this->image_lib->resize()){
                    return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
                }
                $size = getimagesize($fullImgPath);
            }
            //save large image to db
            $data = array(
                'user_id' => $userId,
                'width' => $size[0],
                'height' => $size[1],
                'name' => $uid,
            );
            $this->db->set($data);
            if (!$this->db->insert('imageLarge')) {
                unlink($fullImgPath);
                return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
            }
            $largeId = $this->db->insert_id();
            return array("success" => 1, "data"=> array('src' => serverUrl().$fullImgPath,
                                                     'uid' => $uid,
                                                     'largeId'=>$largeId));
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }
    }
    
    public function cropOriginal ($userId, $data){
        try {
            $uid = uniqid ();
            $fileName = $uid.'.jpg';
            $fullImgPath = 'uploads/images/small/'.$fileName;
            $originalImgPath = 'uploads/images/large/'.$data->uid.'.jpg';
            
                        //check if image exists and belongs to user
            if(!$this->hasPrivlegesForImage($userId,$data->uid)){
                return array("success" => 0, "message" => "something went wrong","errorCode"=>1);
            }
            
            //crop original image
            $config['image_library'] = 'gd2';
            $config['source_image']	= $originalImgPath;
            $config['new_image'] = $fullImgPath;
            $config['maintain_ratio'] = FALSE;
            $config['quality'] = '100%';
            $config['width']	= floor($data->width);
            $config['height']	= floor($data->height);
            $config['x_axis'] = floor($data->x);
            $config['y_axis'] = floor($data->y);
            $this->load->library('image_lib', $config); 
            if ( ! $this->image_lib->crop())
            {
                return array("success" => 0, "message" => "something went wrong","errorCode"=>1);
            }
            //check image size and resize it if needed
            $size = getimagesize($fullImgPath);
            if($size[0]> 100 || $size[1] > 100){
                $this->image_lib->clear();
                $config['source_image']	= $fullImgPath;
                $config['maintain_ratio'] = TRUE;
                $config['quality'] = '100%';
                $config['width']	= 100;
                $config['height']	= 100;
                $this->image_lib->initialize($config); 
                if(!$this->image_lib->resize()){
                    unlink($fullImgPath);
                    return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
                }
            }
            //insert into db
            $data = array(
                'user_id' => $userId,
                'width' => $size[0],
                'height' => $size[1],
                'name' => $uid,
            );
            $this->db->set($data);
            if (!$this->db->insert('imageSmall')) {
                unlink($fullImgPath);
                return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
            }
            
            $smallId = $this->db->insert_id();
            return array("success" => 1, "data"=> array('src' => serverUrl().$fullImgPath,
                                         'uid' => $uid,
                                         'smallId' => $smallId));
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        } 
    }
    
    private function hasPrivlegesForImage($userId,$uid){
        $data = array(
            'user_id' => $userId,
            'name' => $uid
        );
        $this->db->select('id');
        $this->db->where($data);
        $this->db->from('imageLarge');
        if ($this->db->count_all_results() > 0) {
            return true;
        } else {
            return false;
        }
    }


}

?>
