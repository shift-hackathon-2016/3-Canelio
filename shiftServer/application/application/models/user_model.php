<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class User_model extends CI_Model {

    private $tokenSplitter;

    public function __construct() {

        $this->tokenSplitter = ";;;;;;;;;;";
        parent::__construct();
        $this->load->database();
        $this->load->model('dog_images_model');
    }

    public function register($data) {
        try {
            //insert user
            $this->load->helper('email');
            $data->email = trim(strtolower($data->email));
            if(!valid_email($data->email)){
                return array("success" => 0, "message" => "Invalid email", "errorCode" => 3);
            };
            $emailCheckData = array('email'=> $data->email);
            $this->db->select('id');
            $this->db->where($emailCheckData);
            $this->db->from('users');
            if ($this->db->count_all_results() > 0) {
                return array("success" => 0, "message" => "That email already exists", "errorCode" => 2);
            }
            $md5Password = md5($data->password);
            $email = trim($data->email);
            
            $dataUser = array(
                'password' => $md5Password,
                'email' => $email,
            );
            $this->db->set($dataUser);
            if (!$this->db->insert('users')) {
                return array("success" => 0, "message" => "something went wrong", "errorCode" => 1);
            }
            $userId = $this->db->insert_id();
            //insert dog

            $dataDog = array(
                'dogName' => $data->dogName,
            );
            $this->db->set($dataDog);
            if (!$this->db->insert('dogs')) {
                return array("success" => 0, "message" => "something went wrong", "errorCode" => 1);
            }
            $dogId = $this->db->insert_id();

            //insert dog user
            $dataDogUser = array(
                'user_id' => $userId,
                'dog_id' => $dogId,
            );
            $this->db->set($dataDogUser);
            if (!$this->db->insert('usersDogs')) {
                return array("success" => 0, "message" => "something went wrong", "errorCode" => 2);
            }
            $dogUserId = $this->db->insert_id();
            
            //insert tricks into ordinal
            $this->db->select('id');
            $this->db->where(array('user_id' => 0)); 
            $this->db->from('trick');
            $this->db->order_by('created' , 'asc');
            $result = $this->db->get()->result_array();
            $trickUser = array();
            $i = 1;
            foreach ($result as $r){
                $trickUserSingle = array('user_id' => $userId,
                                        'trick_id' => $r['id'],
                                        'deleted'=> 0,
                                        'ordinal' => $i);
                $trickUser[] = $trickUserSingle;
                $i++;
            }
            $this->db->insert_batch('trickUser',$trickUser);

            $loginData = new stdClass();
            $loginData->email = $email;
            $loginData->password = $data->password;
            $loginData->dog_id = $dogId;
            $loginData->fetchData = true;
            
            //insert level
            $this->load->model('level_model');
            $this->level_model->insertLevelForDogUser($dogUserId, null);
            
            $loginReturn = $this->login($loginData);
            return $loginReturn;
            
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
  

    public function login($data) {
        
        if(isset($data->relog) && $data->relog){
            $md5Password = ($data->password);
        }else{
            $md5Password = md5(trim($data->password));
        }
        $data->email = trim(strtolower($data->email));
        
        
        $dataUser = array(
            'email' => trim($data->email),
            'password' => $md5Password
        );

        $this->db->select('id');
        $this->db->where($dataUser);
        $this->db->from('users');
        if ($this->db->count_all_results() > 0) {
            $dataUsersDogs = array(
                'users.email'=>$data->email,
                'users.password' => $md5Password
            );
            $this->db->select('usersDogs.id as id , dogs.dogName as dogName , dogs.image_dog_id as imageDogId, usersDogs.user_id as userId');
            $this->db->where($dataUsersDogs);
            $this->db->from('users');
            $this->db->join('usersDogs', 'usersDogs.user_id = users.id');
            $this->db->join('dogs', 'dogs.id = usersDogs.dog_id');
            $idArray = $this->db->get()->row_array();
            $token = $this->generateToken($idArray['id']);
            
            if(isset($data->fetchData) && $data->fetchData){
                $imageData  = new stdClass;
                $imageData->id  = $idArray['imageDogId'];
                $imageReturn  = $this->dog_images_model->getImageSmallAndBig($idArray['id'] , $imageData);
                
//                $tricksData = new stdClass;
//                $tricksData->user_id = $idArray['userId'];
//                $this->load->model('trick_model');
//                $tricks = $this->trick_model->getAllTricks( 1, $tricksData);
                
                $returnData = array('token'=> $token,
                                                        'password' => $md5Password,
                                                        'email' =>$data->email,
                                                        'dogName'=> $idArray['dogName'],
                                                        'imageSmall' => $imageReturn['data']['small'],
                                                        'imageLarge' => $imageReturn['data']['large'],
//                                                        'tricks' => $tricks['data']
                        );
                
                $this->load->model('goal_model');
                $goalData = $this->goal_model->getGoals($idArray['id'],$data);
                $returnData = array_merge($returnData,$goalData['data']);
                
                $this->load->model('level_model');
                $levelPoints = $this->level_model->getLevelPoints($idArray['id'],null);
                $returnData = array_merge($returnData,$levelPoints['data']);
//               
                return array("success" => 1, "data" =>$returnData );
            }else{
                return array("success" => 1, "data" => array('token'=> $token, 'password' => $md5Password, 'email' =>$data->email, 'dogName'=> $idArray['dogName'] ));
            }
        } else {
            return array("success" => 0, "message" => "invalid login", "errorCode" => 1);
        }
    }
    
//default expire is for 30 days
    private function generateToken($id, $expire = 2592000) {
        $this->load->library('encrypt');
        $token = bin2hex(mcrypt_create_iv(20, MCRYPT_DEV_URANDOM));
        $data = array(
            'user_id' => $id,
            'token' => $token,
            
            'expire' => time() + $expire,
//            'expire' => time() + 5,

        );
        $this->db->set($data);
        $this->db->insert('tokens');


        $this->db->select('id');
        $this->db->where($data);
        $this->db->from('tokens');
        $tokenId = $this->db->get()->row_array();

        $msg = $id . $this->tokenSplitter . $token . $this->tokenSplitter . $tokenId['id'];
        return base64_encode($this->encrypt->encode($msg));
    }
    


    function checkToken($token) {
        $this->load->library('encrypt');
        $msg = $this->encrypt->decode(base64_decode($token));
        $msg = explode($this->tokenSplitter, $msg);
        $tokenData = array(
            "user_id" => $msg[0],
            "token" => $msg[1],
            "id" => $msg[2]
        );
        $this->db->select('expire');
        $this->db->where($tokenData);
        $this->db->from('tokens');

        if ($this->db->count_all_results() > 0) {
            $this->db->select('expire');
            $this->db->where($tokenData);
            $this->db->from('tokens');
            $expire = $this->db->get()->row_array();
            if ($expire['expire'] > time()) {
                return $msg[0];
            }
        }

        return false;
    }
    
    public function getRealIds($userId){
        $whereData= array(
            'id'=> $userId
        );
        $this->db->select('user_id,dog_id');
        $this->db->where($whereData);
        $this->db->from('usersDogs');
        return $this->db->get()->row_array();
    }

    //pass retrival code valid for 1 day
    public function passRetrivalByEmail($data){
        try {
            $data->email = trim(strtolower($data->email));
            $email = $data->email;
            $this->load->helper('email');
            if(!valid_email($email)){
                return array("success" => 0, "message" => "Invalid email", "errorCode" => 3);
            }
            $this->db->select('id,email');
            $this->db->from('users');
            $this->db->where(array('email' => $email));
            $result = $this->db->get()->row_array();
            if($result && $result['email'] != null){

                $this->load->library('encrypt');
                $token = bin2hex(mcrypt_create_iv(20, MCRYPT_DEV_URANDOM));

                
                $insertData = 
                        array('user_id' => $result['id'],
                            'code' => $token,
                            'expires' => time() +86400,
                            'email' => $result['email'],
                            );
                $this->db->set($insertData);
                $this->db->insert('pRetrival');
                $this->load->helper('canelio_server');
                
                $token = $result['email'].$this->tokenSplitter.$token;
                $token = base64_encode($this->encrypt->encode($token));
//
                $retrivalUrl = getPassRetrivalUrl($token);
                $this->load->helper('email');
                $html  = '<html><p>Canelio Password Reset</p>'.
                        '<p>To reset your password please visit <a href="'.$retrivalUrl.'">this link</a></p>'.
                        "<p>If it doesn't work copy paste this into your browser url: <br/>".$retrivalUrl."</p></html>";

                $this->load->library('email');
                $config = array();
                $config['smtp_user'] = "contactcanelio@gmail.com"; 
                $config['smtp_pass'] = "66586658C";
                $config['useragent'] = 'CodeIgniter';
                $config['protocol'] = 'smtp';
                //$config['mailpath'] = '/usr/sbin/sendmail';
                $config['smtp_host'] = 'ssl://smtp.googlemail.com';
                $config['smtp_port'] = 465; 
                $config['smtp_timeout'] = 5;
                $config['wordwrap'] = TRUE;
                $config['wrapchars'] = 76;
                $config['mailtype'] = 'html';
                $config['charset'] = 'utf-8';
                $config['validate'] = FALSE;
                $config['priority'] = 3;
                $config['crlf'] = "\r\n";
                $config['newline'] = "\r\n";
                $config['bcc_batch_mode'] = FALSE;
                $config['bcc_batch_size'] = 200;

                $this->email->initialize($config);
                
                $this->email->from('contact.canelio@gmail.com', 'Canelio - password retrival');
                $this->email->to($result['email']);
                $this->email->message($html);
                $this->email->subject('Canelio - reset your password');

                if($this->email->send()){
                    return array("success" => 1, "data"=> true);
                }else{
                    $this->email->print_debugger();
                    return array("success" => 0, "message" => "failed to send email", "errorCode" => 1);
                }
            }
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    
}

?>
