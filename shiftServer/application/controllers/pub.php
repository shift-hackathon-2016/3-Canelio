<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Pub extends CI_Controller {

    public function __construct()
    {
            parent::__construct();
    }
    
    public function index() {
        
    }
    
    public function call(){
        
         $input = json_decode(json_encode($_POST),false);
        
        $class = $input->class;
        $this->load->model('public/'.$class.'_pub_model');
        
        $class = $this->{$class.'_pub_model'};
        $method = $input->method;
        $data = $input->data ;
        $returnData = $class->{$method}($data);  
        
        echo json_encode($returnData);
    }

   
    public function achivement($dogUserId,$trickId){
        $this->load->model('public/achievment_pub_model');
        echo json_encode($this->achievment_pub_model->getAchivementPage($dogUserId,$trickId));
    }
    
    public function achivementSocial($dogUserId,$trickId){
        $this->load->model('public/achievment_pub_model');
        $data = $this->achievment_pub_model->getAchivmenetForSocial($dogUserId,$trickId);
        if($data['success']){
            $this->load->helper('canelio_server_helper');
            $data['data']['angUrl'] = getAngularUrl().'#/achivement/'.$dogUserId.'/'.$trickId;
            $this->load->view('social/achivement.php',$data['data']);
        }else{
             $this->load->view('404.php');
        }
    }
    
    public function passRetrivalEmail($email){
        $this->load->model('public/user_pub_model');
        echo json_encode($this->user_pub_model->passRetrivalByEmail($email));
    }

    public function canelioStatistics(){
        $this->load->model('public/user_statistics_pub_model');
        $this->user_statistics_pub_model->getLevels();
    }

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */