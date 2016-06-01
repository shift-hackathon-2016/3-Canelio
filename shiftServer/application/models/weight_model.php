<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Weight_model extends CI_Model {
    
    public function __construct() {
        
        parent::__construct();
        $this->load->database();
        $this->load->model('user_model');
        $this->load->helper('canelio_date');
    }
    
    public function getWeightByDate ($dogUserId , $data){
        try{
            $ids = $this->user_model->getRealIds($dogUserId);
            $dogId = $ids['dog_id'];
            $data = array(
                'dog_id' => $dogId,
                'dateTime >=' => addTimeToDate($data->from, true),
                'dateTime <=' => addTimeToDate($data->to, false),
            );
            $this->db->select('weight,DATE(dateTime) as date');
            $this->db->where($data);
            $this->db->from('weight');
            $result = $this->db->get()->result_array();
            if (!$result) {
                return array("success" => 1, "data" => array());
            }
            return array("success" => 1, "data" => $result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    

    
    
    public function saveWeight($dogUserId,$data){
        try{
            $ids = $this->user_model->getRealIds($dogUserId);
            $dogId = $ids['dog_id'];
//            $weight = number_format((float)$data->weight, 5, '.', '');;
            $weight = $data->weight;
            $dbData= array(
                'dog_id' => $dogId,
                'weight' => $weight,
                'dateTime' => $data->dateTime
            );
            $this->db->set($dbData);
            if (!$this->db->insert('weight')) {
                return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
            }else{
                return array("success" => 1,"data"=>array());
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }

    public function getWeighCount ($dogUserId , $data){
        try{
            $ids = $this->user_model->getRealIds($dogUserId);
            $dogId = $ids['dog_id'];
            $data = array(
                'dog_id' => $dogId
            );
            $this->db->select('count(id) as count');
            $this->db->where($data);
            $this->db->from('weight');
            $result = $this->db->get()->row_array();
            if($result){
                return array('success'=>1, 'data'=> $result['count']);
            }else{
                return array('success'=>0 ,'data'=>array());
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function getWeightPaged ($dogUserId , $data){
        try{
            $ids = $this->user_model->getRealIds($dogUserId);
            $dogId = $ids['dog_id'];
            $whereData = array(
                'dog_id' => $dogId
            );
            $this->db->select('weight,DATE(dateTime) as date,id');
            $this->db->where($whereData);
            $this->db->from('weight');
            $this->db->limit($data->pageSize, $data->skip);
            $this->db->order_by('dateTime','desc');
            $result = $this->db->get()->result_array();
            if (!$result) {
                return array("success" => 1, "data" => array());
            }
            return array("success" => 1, "data" => $result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function deleteWeight ($dogUserId , $data){
        try{
            $ids = $this->user_model->getRealIds($dogUserId);
            $dogId = $ids['dog_id'];
            $whereData = array(
                'dog_id' => $dogId,
                'id' => $data->id
            );
            $this->db->where($whereData);
            if ($this->db->delete('weight')) {
                return array("success" => 1, "data" => array());
            }
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
}

?>
