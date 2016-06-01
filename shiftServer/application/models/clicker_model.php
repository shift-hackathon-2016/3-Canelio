<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Clicker_model extends CI_Model {


    public function __construct() {
        
        parent::__construct();
        $this->load->database();
        $this->load->model('statistics_model');
        $this->load->model('achievment_model');
        $this->load->model('level_model');
    }

    public function getConnectVariables($dogUserId,$data) {
        try {
            $data->userInput = strtolower($data->userInput);
            $userInput = $data->userInput;
            $this->load->model('user_model');
            $realIds = $this->user_model->getRealIds($dogUserId);
            $where = array('s3' => $userInput);
            $this->db->select('user_id,s1,s2');
            $this->db->from('clickers');
            $this->db->where($where);
            $result = $this->db->get()->row_array();
            if($result && ($result['user_id'] == 0 || $result['user_id'] == $realIds['user_id'])){
                $result["connectable"] = true;
                $str =$result['s2'];
                $strlen = strlen($str);
                $ar = array();
                for($j=0; $j < $strlen; $j++){
                    array_push($ar,ord($str[$j]));
                }
                $result['s2'] = $ar;
                $result['user_id']= 0;
                return array("success" => 1, "data"=> $result);
            }else{
                return array("success" => 0, "message" => "inputed wrong code","errorCode"=>1);
            }
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong code","errorCode"=>1);
        }
    }
    
    public function claimClicker($dogUserId,$data) {
        try {
            $data->s3 = strtolower($data->s3);
            $userInput = $data->s3;
            $s1 = $data->s1;
            $s2 = $data->s2;
            $str = '';
            for($i =0; count($s2) > $i ;$i++){
                $str = $str.chr($s2[$i]);
            }
            $s2 = $str;
            $this->load->model('user_model');
            $realIds = $this->user_model->getRealIds($dogUserId);
            $where = array('s3' => $userInput , 's1'=> $s1, 's2'=> $s2);
            $this->db->select('user_id,s1,s2,s3');
            $this->db->from('clickers');
            $this->db->where($where);
            $result = $this->db->get()->row_array();
            if($result){
                if(($result['user_id'] == 0 || $result['user_id'] == $realIds['user_id'])){
                    $updateData = array('user_id'=> $realIds['user_id']);
                    $this->db->where($result);
                    $this->db->update('clickers',$updateData);
                    $result["connectable"] = true;
                    $result['user_id'] = 0;
                    return array("success" => 1, "data"=> $result);              
                }else{
                    return array("success" => 0 , "message"=> "Somebody claimed this clicker, ask them to disconnect from settigs");
                }
            }else{
                return array("success" => 0, "message"=> "Inputed wrong code");
            }
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong code","errorCode"=>1);
        }
    }

    public function disconnectClicker($dogUserId,$data) {
            try {
                $str = '';
                $s1 = $data->s1;
                $s2 = $data->s2;
                for($i =0; count($s2) > $i ;$i++){
                    $str = $str.chr($s2[$i]);
                }
                $s2 = $str;
                
                $this->load->model('user_model');
                $realIds = $this->user_model->getRealIds($dogUserId);
                $where = array('s1'=> $s1, 's2'=> $s2, 'user_id' => $realIds['user_id'] );
                $this->db->select('user_id');
                $this->db->from('clickers');
                $this->db->where($where);
                $result = $this->db->get()->row_array();
                if($result){
                    $updateData = array('user_id'=> 0);
                    $this->db->where($result);
                    $this->db->update('clickers',$updateData);
                    $result["connectable"] = true;
                    $result['user_id'] = 0;
                    return array("success" => 1, "data"=> $result);              
                }else{
                    return array("success" => 0, "message"=> "Inputed wrong code");
                }

            } catch (Exception $ex) {
                return array("success" => 0, "message" => "inputed wrong code","errorCode"=>1);
            }
        }

}

?>
