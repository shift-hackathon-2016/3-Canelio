<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class User_pub_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->tokenSplitter = ";;;;;;;;;;";
    }
    
    public function getDog($dogUserId){
        try{
            $where = array(
                'usersDogs.id' => $dogUserId
            );
            $this->db->select('dogs.dogName as dogName, dogs.image_dog_id as imageDogId');
            $this->db->from('dogs');
            $this->db->join('usersDogs','usersDogs.dog_id = dogs.id');
            $this->db->where($where);
            $result = $this->db->get()->row_array();
            
            if($result['imageDogId']){
                $imageData = new stdClass();
                $imageData->id  = $result['imageDogId'];
                $imageResult = $this->dog_images_model->getImageSmallAndBig($dogUserId , $imageData);

                $data = array('dogName' => $result['dogName'], 'dogLarge'=> $imageResult['data']['large'], 'dogSmall' => $imageResult['data']['small']);
            }else{
                 $data = array('dogName' => $result['dogName'], 'dogLarge'=> null, 'dogSmall' => null);
            }
            return array("success" => 1, "data" => $data);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    

    
    public function passRetrivalResetPassword($data){
        try {
            $token  = $data->token;
            $password = $data->p;
            
            $this->load->library('encrypt');
            $msg = $this->encrypt->decode(base64_decode($token));
            $msg = explode($this->tokenSplitter, $msg);            
            $where = array(
                'email' => $msg[0],
                'code'=>$msg[1],
                'expires >' => time()
            );
            

            $this->db->select('user_id,code,expires,email');
            $this->db->from('pRetrival');
            
            $this->db->where($where);
            $result =  $this->db->get()->row_array();
            if($result && $result['user_id'] != null){
                $newPass =  md5($password);
                $update = array(
                    'password' =>$newPass,
                );
                
                $whereUser = array(
                    'id' => $result['user_id']
                );

                $this->db->where($whereUser);
                $this->db->update('users', $update);
                
                
                
                $whereDelete = array(
                    'email' => $msg[0],
                    'code'=>$msg[1],
                );
                $this->db->where($whereDelete);
                $this->db->delete('pRetrival');

                return array("success" => 1, "data" => true); 
            }
             return array("success" => 0, "message" => "inputed wrong data 1", "errorCode" => 1);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }      
    }
    
    //pass retrival code valid for 1 day
    public function passRetrivalByEmail($data){
        $this->load->model('user_model');
        return $this->user_model->passRetrivalByEmail($data);
    }

}

?>
