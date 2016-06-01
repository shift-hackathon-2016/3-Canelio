<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Achievment_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->model('dog_images_model');
        $this->load->model('statistics_model');
        $this->load->helper('canelio_server');
        $this->load->helper('canelio_date');
    }
    
    private function achivementWon($dogUserId, $data){
        try{
            $originalData = $data;
            $data = array(
                   'dog_user_id' => $dogUserId,
                   'trick_id' => $data->trick_id,
                   'date' => $data->dateTimeTrained,
                   'image_dog_id' => null,
                    'shared'=> 0
               );  
           $this->db->set($data);
           if (!$this->db->insert('achievments')) {
               return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
           }else{
              $achivmentId =  $this->db->insert_id();
              $this->db->select("trick.name as name, trick.id  as trickId");
              $this->db->from('trick');
              $this->db->where('id',$originalData->trick_id);
              $result = $this->db->get()->row_array();
              return array("success" => 1, "data"=>array('achivmentId' => $achivmentId , 'trickName'=> $result['name'], 'trickId' => $result['trickId'])); 
           }
         
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function checkAchivementWon($dogUserId, $data){
        try{
            $where = array('dog_user_id'=> $dogUserId,
                            'trick_id' => $data->trick_id
                );
            $this->db->select('id');
            $this->db->from('achievments');
            $this->db->where($where); 
            $result = $this->db->count_all_results();
            //check if achivement exists
            if($result){
                return array('success'=>1, 'data'=> false);
            }else{
                //check if in last 30 trainings hours where points > 120
                $where = array('user_id' => $dogUserId,
                                'trick_id' => $data->trick_id
                    );
                $this->db->select('timesTrained,timesSuccess,dateTimeTrained');
                $this->db->from('training');
                $this->db->where($where);
                $this->db->order_by("dateTimeTrained", "desc");
                $this->db->limit(30);
                $results = $this->db->get()->result_array();
                $total = 0;
                $sucess = 0;
                
                $won = false;
                //do calculation
                foreach ($results as $r){
                    $total = $total + intval($r['timesTrained']);
                    $sucess = $sucess + intval($r['timesSuccess']);
                    if((intval($sucess)*2+(intval($total)-intval($sucess)) > 120) && intval($total)>=5){
                        $won = true;
                        $dateTimeTrained = date("Y-m-d H:i:s",$r['dateTimeTrained']);
                        break;
                    }
                }
                if($won){
                    $data->dateTimeTrained = $dateTimeTrained;
                    $return = $this->achivementWon($dogUserId,$data);
                    //check if insert sucessfoul
                    if($return['success']){
                        return $return;
                    }
                }
            }
            return array('success'=>1, 'data'=> false);
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }
    }
    
    public function singleAchivement($dogUserId, $data){
          try {
            $where = array('achievments.dog_user_id' => $dogUserId,
                            'achievments.id' => $data->achivmentId);
            $this->db->select('achievments.id as id, achievments.date as date, imageLarge.name as imageSrc, achievments.trick_id as trick');
            $this->db->from('achievments');
            $this->db->join('imageDog' , ' achievments.image_dog_id = imageDog.id' , 'left outer');
            $this->db->join('imageLarge' , ' imageLarge.id = imageDog.large_id' , 'left outer');
            $this->db->where($where);
            $result = $this->db->get()->row_array();
            $data = new stdClass;
            $data->trick_id = $result['trick'];
            $data->to = getDateFromDateTime($result['date']);
            //kod achivment delete from se mjenja
            $data->from = startDateTime(true);
            $result['statistic'] = $this->statistics_model->getTrickData($dogUserId, $data);
            if($result['imageSrc']){
                $result['imageSrc'] = constructImageLargeUrl($result['imageSrc']) ;
                $result['hasImage'] = true;
            }else{
                $result['hasImage'] = false;
            }
            //ako nema froma definiranog dohvati minimalni date
            $this->db->select('DATE(FROM_UNIXTIME(min(dateTimeTrained))) as date');
            $this->db->from('training');
            $where = array('user_id' => $dogUserId,
                            'trick_id' => $result['trick']);
            $this->db->where($where);
            $minDate = $this->db->get()->row_array();
            $result['startDate'] = $minDate['date'];
            return array("success" => 1, "data"=> $result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }
    }
    
    public function shareAchievment($dogUserId,$data){
        try{
            $where = array(
                'dog_user_id' => $dogUserId,
                'id' => $data->id
            );
            $updateData = array(
                'shared' => 1
            );
            $this->db->where($where);
            if($this->db->update('achievments', $updateData)){
                $this->db->select("shared");
                $this->db->from('achievments');
                $this->db->where($where);
                $shared = $this->db->get()->row_array();
                if($shared['shared']){
                    $return = array(
                        'url' => getAchivmentSharableUrl($data->id)
                    );
                    return array("success" => 1, "data" => $return);                    
                }
                 return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);

            }
            return array("success" => 0, "message" => "something went wrong" , "errorCode"=>1);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }        
    }
    
    public function numberOfAchivements($dogUserId, $data){
        try{
            $this->db->select('COUNT( id ) as c');
            $this->db->from('achievments');
            $this->db->where(array('dog_user_id' => $dogUserId)); 
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
    
     public function getAchivements($dogUserId,$data){
        try {
            $where = array('achievments.dog_user_id' => $dogUserId);
            $this->db->select('achievments.id as id, achievments.date as date,'
                    . ' trick.name as trickName,trick.user_id as trickUserId,'
                    . ' imageSmall.name as imageSrc,achievments.trick_id as trickId');
            $this->db->from('achievments');
            $this->db->join('trick' , 'trick.id = achievments.trick_id');
            $this->db->join('imageDog' , ' achievments.image_dog_id = imageDog.id' , 'left outer');
            $this->db->join('imageSmall' , ' imageSmall.id = imageDog.small_id' , 'left outer');
            $this->db->where($where);
            $this->db->order_by('achievments.date','desc');
            $this->db->limit($data->pageSize, $data->skip);
            $result = $this->db->get()->result_array();
            $newResult = array();
            foreach ($result as $r){
                $line  = $r;
                $date = new DateTime($line['date']);
                $line['date'] = $date->format('d.m.Y');
                $line['onlyTrickName'] = true; 
                if($line['trickUserId'] == 0){
                    $line['canelioTrick'] = true;                   
                }else{
                    $line['canelioTrick'] = false;
                }
                if($line['imageSrc']){
                    $line['imageSrc'] = constructImageSmallUrl($line['imageSrc']) ;
                }
                array_push($newResult,$line);
            }
            return array("success" => 1, "data"=> $newResult);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }
    }
    
    public function getLastestTraining($userId,$data){
        try{
            $this->db->select('timesTrained,timesSuccess,DATE(dateTimeTrained) as date');
            $this->db->from('training');
            $this->db->order_by('dateTimeTrained','desc');
            $this->db->where(array('user_id' => $userId, 'trick_id' => $data)); 
            $this->db->limit(1);
            if($query = $this->db->get()){
                return array('success'=>1, 'data'=> $query->row_array());
            }else{
                return array('success'=>0 ,'data'=>array());
            }
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
                $updateData = array(
                       'image_dog_id' => $data->imageDogId
                );
                $this->db->where('dog_user_id', $dogUserId);
                $this->db->where('trick_id', $data->trickId);
                if(!$this->db->update('achievments', $updateData)){
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
            $where = array('achievments.dog_user_id' => $dogUserId,
                            'trick_id' => $data->trickId);
            $this->db->select('imageDog.large_id as id');
            $this->db->from('achievments');
            $this->db->join('imageDog' , 'imageDog.id = achievments.image_dog_id');
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
