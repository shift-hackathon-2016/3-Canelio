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
    
    
    private function insertAchivment($dogUserId,$data){
         try{
            if($data->achivmentLevel == 1){
                $insertData = array(
                   'dog_user_id' => $dogUserId,
                   'trick_id' => $data->trickId,
                   'image_dog_id' => null,
                   'shared'=> 0,
                   'finished'=> 0
                );  
                $this->db->set($insertData);
                if (!$this->db->insert('achievments')) {
                    exit();
                }else{
                   $achivmentId = $this->db->insert_id();
                }
            }else{
                $achivmentId = $data->achivmentId;
            }
            $insertData = array(
               'date' => $data->date,
               'level' => $data->achivmentLevel,
               'achivementId' => $achivmentId,
            );  
            $this->db->set($insertData);
            if (!$this->db->insert('achivmentsLevels')) {
                exit();
            }
            if($data->achivmentLevel == 4){
                $updateData = array(
                       'finished' => 1
                );
                $this->db->where('id', $achivmentId);
                $this->db->where('trick_id', $data->trickId);
                if(!$this->db->update('achievments', $updateData)){
                     exit();
                }
            }
            return $achivmentId;
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }       
    }
    
    
    private function updateAchivments($dogUserId , $data){
        try{
            $checking = true;
            $currentAchivmentLvl = $data->achivmentLevel;
            if(isset($data->lastDate) && $data->lastDate){
                $lastDate = $data->lastDate;               
            }else{
                $lastDate = 0;
            }
            $achivmentId = $data->achivmentId;
            $trickId = $data->trick_id;
            $achivmentsWon = array();
            while($checking){
                if($currentAchivmentLvl != 4){
                    $where = array(
                        'dateTimeTrained >' => $lastDate,
                        'trick_id' => $data->trick_id
                     );
                     $this->db->select('timesTrained,timesSuccess,dateTimeTrained');
                     $this->db->from('training');
                     $this->db->where($where);
                     $result = $this->db->get()->result_array();
                    if($currentAchivmentLvl == 0){ 
                        $pointsNeeded = 150;
                        $hoursNeeded = 4;
                    }else if($currentAchivmentLvl == 1){
                        $pointsNeeded = 300;
                        $hoursNeeded = 8;
                    }else if($currentAchivmentLvl == 2){
                        $pointsNeeded = 750;
                        $hoursNeeded = 15;
                    }else if($currentAchivmentLvl == 3){
                        $pointsNeeded = 2000;
                        $hoursNeeded = 40;
                    }
                    $total = 0;
                    $sucess= 0;
                    $hours = 0;
                    $won = false;
                    foreach ($result as $r){
                        $hours++;
                        $total = $total + intval($r['timesTrained']);
                        $sucess = $sucess + intval($r['timesSuccess']);
                        $totalPoints = intval($sucess)*2+intval($total)-intval($sucess);
                        if($totalPoints > $pointsNeeded && $hours >= $hoursNeeded){
                            $won = true;
                            $lastDate = $r['dateTimeTrained'];
                            break;
                        }
                    }
                    if($won){
                        $currentAchivmentLvl++ ;
                        $insertData = new stdClass;
                        $insertData->date = $lastDate;
                        $insertData->achivmentId = $achivmentId;
                        $insertData->achivmentLevel = $currentAchivmentLvl;
                        $insertData->trickId = $trickId;
                        $achivmentId = $this->insertAchivment($dogUserId,$insertData); 
                        array_push($achivmentsWon, $currentAchivmentLvl);
                   }else{
                       $checking = false;
                   }
                }else{
                    $checking = false;
                }
            }
            if(sizeof($achivmentsWon)== 0){
                return array('success'=>1, 'data'=> false);
            }else{
                return array('success'=>1, 'data'=> array('achivmentId'=>$achivmentId, 'achivmentLevels'=> $achivmentsWon));
            }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        } 
    }
    
    
    public function checkAchivementWon($dogUserId , $data){
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
                //check if finished
                $this->db->select('id,finished');
                $this->db->from('achievments');
                $this->db->where($where); 
                $result = $this->db->get()->row_array();
                if($result['finished'] == 1){
                    return array('success'=>1, 'data'=> false);
                }
                $achivmentId = $result['id'];
            }else{
                $achivmentId = 0;
            }
            
            if(!$achivmentId){
                $data->achivmentLevel =0;
                $data->achivmentId = 0;
                $data->lastDate = 0;
            }else{
                $where = array(
                    'achivementId' => $achivmentId
                );
                $this->db->select('level as lvl,date');
                $this->db->from('achivmentsLevels');
                $this->db->where($where); 
                $this->db->order_by('level','desc');
                $result = $this->db->get()->row_array();
                $data->achivmentLevel = $result['lvl'];
                $data->achivmentId = $achivmentId;
                $data->lastDate = $result['date'];
            }
            
            $resultFromLoop = $this->updateAchivments($dogUserId,$data);
            
            if($resultFromLoop['data']){
                $achivmentId = $this->db->insert_id();
                $this->db->select("trick.name as name, trick.id  as trickId");
                $this->db->from('trick');
                $this->db->where('id',$data->trick_id);
                $result = $this->db->get()->row_array();
                
                return array("success" => 1, "data"=>array('achivmentId' => $resultFromLoop['data']['achivmentId'] ,
                                                            'achivmentLevelsWon'=> $resultFromLoop['data']['achivmentLevels'],
                                                            'prevAchivmentLevel' => $data->achivmentLevel,
                                                            'trickName'=> $result['name'],
                                                            'trickId' => $result['trickId'])); 

                return array('success'=>1, 'data'=> array('achivmentId'=>$achivmentId, 'achivmentLevels'=> $achivmentsWon));
            }else{
                return array('success'=>1 , 'data'=> false);
            }
            //if got resultFromLoop retrun as old returns
            return $resultFromLoop;
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        } 
    }
    
    
   
    
    public function achivmentLevel($dogUserId, $data){
          try {
            
              $where = array('achievments.dog_user_id' => $dogUserId,
                            'achievments.trick_id' => $data->trickId);
              $this->db->select('dog_user_id');
              $this->db->from('achievments');
              $this->db->where($where);
              $result = $this->db->count_all_results();
              if($result){
                 $where = array('achievments.dog_user_id' => $dogUserId,
                     'achievments.trick_id' => $data->trickId);
                 $this->db->select('achivmentsLevels.level as level');
                 $this->db->from('achievments');
                 $this->db->where($where);
                 $this->db->join('achivmentsLevels', 'achivmentsLevels.achivementId = achievments.id');
                 $this->db->order_by('achivmentsLevels.level','desc');
                 $result = $this->db->get()->row_array();
                 return array("success" => 1, "data"=> $result);
              }else{
                 return array("success" => 1, "data"=> array('level'=> 0)); 
              }
//            $where = array('achievments.dog_user_id' => $dogUserId,
//                            'achievments.trick_id' => $data->trick_id);
//            $this->db->select('imageLarge.name as imageSrc, achievments.trick_id as trick');
//            $this->db->from('achievments');
//            $this->db->join('imageDog' , ' achievments.image_dog_id = imageDog.id' , 'left outer');
//            $this->db->join('imageSmall' , ' imageLarge.id = imageDog.small_id' , 'left outer');
//            $this->db->where($where);
//            $result = $this->db->get()->row_array();
//            if($result['imageSrc']){
//                $result['imageSrc'] = constructImageSmallUrl($result['imageSrc']) ;
//                $result['hasImage'] = true;
//            }else{
//                $result['hasImage'] = false;
//            }
//            $where = array(
//                'achivementId' => $result['id']
//            );
//            $this->db->select('level as lvl,date');
//            $this->db->from('achivmentsLevels');
//            $this->db->where($where); 
//            $this->db->order_by('level','desc');
//            $resultLevel = $this->db->get()->row_array();
            
            
            return array("success" => 1, "data"=> $result);
        } catch (Exception $ex) {
            return array("success" => 0, "message" => $ex,"errorCode"=>1);
        }
    }
    
    public function getAchivmentId($dogUserId,$data){
         try{  
             $this->db->select('id');
             $this->db->from('achievments');
             $where = array('dog_user_id'=>$dogUserId,
                            'trick_id' => $data->trickId,
                 );
             $this->db->where($where);
             if($this->db->count_all_results()){
                $this->db->select('id');
                $this->db->from('achievments');
                $where = array('dog_user_id'=>$dogUserId,
                            'trick_id' => $data->trickId,
                 );
                $this->db->where($where);
                $result = $this->db->get()->row_array();
                return array("success" => 1 ,"data"=>$result['id']);
             }else{
                 return array("success" => 1 ,"data"=> 1);
             }
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data", "errorCode" => 1);
        }         
    }
    
    public function shareAchievment($dogUserId,$data){
        try{
            $return = array(
                'url' => getAchivmentSharableUrl($dogUserId,$data->id)
            );
            return array("success" => 1, "data" => $return);      
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
    
    
    

}

?>
