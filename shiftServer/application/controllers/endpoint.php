<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Endpoint extends CI_Controller {

    public function __construct()
    {
            parent::__construct();
    }
    
    public function index() {
        
    }

    public function call() {
        //implement token check if not login
//        $input =json_decode(file_get_contents('php://input'));
        $input = json_decode(json_encode($_POST),false);
        
        $class = $input->class;
        $this->load->model($class.'_model');
        
        $class = $this->{$class.'_model'};
        $method = $input->method;
        $data = $input->data ;
        //za klase koje nisu user treba im userId i token
        if($input->class !== 'user'){
            $this->load->model('user_model');
            $userId = $this->user_model->checkToken($input->token);
            if($userId){
                $returnData = $class->{$method}($userId,$data);    
            }else{
                $returnData = array("sucess"=> 0, "token"=>0);
            }
        }else{
            $returnData = $class->{$method}($data);
        }
        echo json_encode($returnData);
    }
    
    
    
    
    public function image(){

        $str = __DIR__.'/../../uploads/images/small/56b24397d149a.jpg';

        echo  readfile ($str);
    }
    
    public function php(){
        phpinfo();
    }
    
    public function deleteClicker(){
        $data = new stdClass;
        $data->s1= "0000000000002";
        $data->s2 = array(98, 48, 98, 57, 57, 98, 52, 49, 57, 48, 102, 49, 53, 52, 100, 101);
        $this->load->model('clicker_model');
        $return = $this->clicker_model->disconnectClicker(33,$data);
        var_dump($return);
    }
    
    public function pad($num, $until){
        $str = '';
        $zerosToAdd = $until - strlen($num);
        for($i=0;$i <$zerosToAdd;$i++){
            $str = $str.'0';
        }
        $str = $str.$num;
        return $str;
    }
    
    public function crypto(){
        
         $ar = array();
         $char = 97;
         $charMax = 112;
         $length = 10000;
//        print_r(hash_algos());
         $i = 0;
         for($i=1; $i < $length;$i++){
                $s1  = $this->pad($i,13);;
                $token = bin2hex(mcrypt_create_iv(20, MCRYPT_DEV_URANDOM));
                $s2 = hash("crc32", $token, false).hash("crc32", $i *2 +11, false);
                $s3 = chr($char).$i.chr($char);
                $line = array("s1"=> $s1,
                    "s2"=> $s2,
                    "s3"=> $s3,
                    'id' => $i);
                array_push($ar,$line);
                $char++;
                if($char > $charMax){
                    $char = 97;
                }
         }
         echo '<pre>';
         print_r($ar);
         echo '</pre>';
        $this->load->database();
        $this->db->insert_batch('clickers', $ar); 
    }
    
    public function brlaeeproms1(){
        $from = 1;
        $to = 50;
        $where = array('id >='=> $from, 'id <='=>$to);
        $this->load->database();
        $this->db->select('*'); 
        $this->db->from('clickers');
        $this->db->where($where);
        $results = $this->db->get()->result_array();
        $returned = '';
        $resultsNum = count($results);
        for ($i = 0;$resultsNum > $i ; $i++){
            if($i != 0){
                $returned = $returned. ',';
            }
            $str = $results[$i]['s1'];
            $strlen = strlen($str);
            $returned = $returned.'{';
            for($j=0; $j < $strlen; $j++){
                if($j != 0){
                   $returned = $returned.','; 
                }
                $returned = $returned.ord($str[$j]);
                
            }
            $returned = $returned.'}';
        }
        echo $returned;
    }
    
    public function brlaeeproms2(){
        $from = 1;
        $to = 50;
        $where = array('id >='=> $from, 'id <='=>$to);
        $this->load->database();
        $this->db->select('*'); 
        $this->db->from('clickers');
        $this->db->where($where);
        $results = $this->db->get()->result_array();
        $returned = '';
        $resultsNum = count($results);
        for ($i = 0;$resultsNum > $i ; $i++){
            if($i != 0){
                $returned = $returned. ',';
            }
            $str = $results[$i]['s2'];
            $strlen = strlen($str);
            $returned = $returned.'{';
            for($j=0; $j < $strlen; $j++){
                if($j != 0){
                   $returned = $returned.','; 
                }
                $returned = $returned.ord($str[$j]);
                
            }
            $returned = $returned.'}';
        }
        echo $returned;
    }
    
    
    
    public function fillLevels(){
        $pointsNeeded = 20;
        
        for($i= 1; $i <1000;$i++){
            if($i==1){
                $pointsNeeded = 20;
            }else if($i==2){
                $pointsNeeded = 30;
            }else if($i==3){
                $pointsNeeded = 50;
            }else if($i==4){
                $pointsNeeded = 75;
            }else if($i==5){
                $pointsNeeded = 100;
            }else if($i > 5 && $i <14){
                $pointsNeeded = $pointsNeeded + 40;
            }
            $data = array('level'=>$i, 'points'=>$pointsNeeded);
            echo $pointsNeeded.' '.$i.'<br/> ';
            $this->db->set($data);
            $this->db->insert('levelsPoints');
        }

    }
    
    public function getTitle(){
        $data = new stdClass;
        $this->load->model('level_model');
        $result = $this->level_model->getLevelPoints(31,$data);
        var_dump($result);
    }
    
    public function trainmultiple(){
        
        $data->training = array();
        $time = 1453824000;
        for($i = 0; $i < 3200;$i++){
           $t1 = new stdClass;
           $t1->time = $time;
           $t1->timesTrained = 1;
           $t1->timesSuccess = 1;
           $t1->trick_id = 41;
           $time++;
           array_push($data->training, $t1);
        }
        

        

        
        
        
        

        

        
 
        

        $this->load->model('training_model');
        $return = $this->training_model->trainMultiple(31,$data);
        var_dump($return);
    }
    
    public function updateLevel(){

        $data = new stdClass;
        $data->points = 100;
        $this->load->model('level_model');
        $return = $this->level_model->updatePoints(37,$data);
        var_dump($return);
    }
    
    public function getLevel(){
        $this->load->model('level_model');
        $return =$this->level_model->getLevelPoints(34,null);
        var_dump($return);
    }
    
    public function fillUserLevels(){
        $this->db->select('id');
        $this->db->from('usersDogs');
        $result = $this->db->get()->result_array();
        foreach ($result as $r){
            $data = array('dog_user_id'=>$r['id'], 'level'=>'1','points'=>'0');
            $this->db->set($data);
            $this->db->insert('userLevels');
        }
    }
    
    public function dailyDetails(){
         $data = new stdClass;
        $data->from = "2015-12-01 00:00:00";
        $data->to = "2015-12-31 23:59:59";
        $data->goal = 30;
        $this->load->model('goal_model');
        $returnData = $this->goal_model->getTricksDoneForPeriod(44, $data);
        echo json_encode($returnData);         
    }
    
    public function daily(){
        $data = new stdClass;
        $data->from = "2015-12-01 00:00:00";
        $data->to = "2015-12-31 23:59:59";
        $data->goal = 30;
        $this->load->model('goal_daily_model');
        $returnData = $this->goal_daily_model->getGoalsInMonth(44, $data);
        echo json_encode($returnData);  
    }
    
    public function listit(){
//        normal
//        2015-04-19
//        2015-05-13
//        25 normal u ovom ispod vraca 26
        
        $data = new stdClass;
        $data->to = "2015-04-18";
        $data->from = "2015-03-24";
        $data->trick_id = 3;
        $this->load->model('statistics_model');
        $returnData = $this->statistics_model->getDates(1, $data);
        echo json_encode($returnData);
    }
    
    public function register(){
        $data = new stdClass;
        $data->dogBreed = 1;
        $data->dogName = "1";
        $data->email = "1";
        $data->password = "1";
        $data->promoCode = "1";
        $data->username = "1";
        $this->load->model('user_model');
        $returnData= $this->user_model->register($data);
        echo json_encode($returnData);
    }
    
    public function login(){
        $data = new stdClass;
        $data->email = "test@gmail.com";
        $data->password = "test";
        $this->load->model('user_model');
        $returnData= $this->user_model->login($data);
        echo json_encode($returnData);
    }
    
    public function stats(){
        $data = new stdClass;
        $data->to = "2015-02-12 00:00:00";
        $data->from = "2015-02-10 23:59:59";
        $data->	trick_id = "1";
        $this->load->model('statistics_model');
        $returnData = $this->statistics_model->getTrickData(44, $data);
        echo json_encode($returnData);
    }
    
    public function statsgroup(){
        $data = new stdClass;
        $data->to = "2015-03-07";
        $data->from = "2015-03-01";
        $data->	group_id = "1";
        $this->load->model('statistics_model');
        $returnData = $this->statistics_model->getGroupData(44, $data);
        echo json_encode($returnData);
    }
    
    
    public function train(){
        $data = new stdClass;
        $data->userId = 43;
        $data->timesTrained = 15;
        $data->timesSuccess = 15;
        $data->dateTimeTrained = "2015-03-07 16:56:46" ;
        $data->trick_id = 41;
        $this->load->model('training_model');
        $returnData = $this->training_model->train(44, $data);
        echo json_encode($returnData);
    }
    
    public function upload(){
        $this->load->model('achievment_model');
        $data = new stdClass;
        $data->targetWidth = 500;
        $data->targetHeight = 300;
        $data->img='/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgCcgJyAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A/VOkopaAEpaKKAEpaKKAEopaKAEpaKSgApaSigBaSiigBaSiigApaSigAFFFFAC0npRRQAetFFFABR60UUAFFFFAB3o9KKKACjvRRQAUetFFABRRRQAtFJRQAUUUUAFLSUtACUtJRQAUtJRQAUUUUALSUUUALRSUGgApaSigBaKSigApaQ0UALRSUUAHelpKKAFpKKKAFpKKKAClpKKAClpKKAFpKWkoAKWkooAWikooAWkoooAWikooAKWkpaAEoopaAEoopaAExRS0UAJRRRQAUUUUAFFFFABRRRQACigUUAFFFFABRRRQAUUfjRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRmgA7UUZooAKKM0UAB6UUZozQAUUUZoAKDRRQAUUZooAKO9FGaACiiigAoFGaKACiijNABRRmigAFAoFFABRRRmgAPSijNFABRRmigAoNFGaACijNFABRRmjNABRRRQAUUUZoAKKM0UAFFGaKAFopKWgBKWkooAWiikoAWikpaAEooooAKKKKACiiigApaSloASiiigBaKKKAEooooAKKKKAFpKKKAFopKKAFoopKAFpKKKACiiigBaSlpKACj1o6CigAooooADRRRQAUUUtACd6KKDQAtJRRQAUUUd6ACg9KKO1ABRRRQAUUUUAFFFFABRRRQAUUUUAHalpKKACiiigA9KDR6UGgBaSlpKACiiigApaSigApaSloASlpKKAFooooAQ0tJS0AIKWkooAWiiigApKKWgBKKKKACiiigBaSiigBaSijNAAKKBRQAUUZozQAUUUUALSUUUAFFFFAC0lHFH40AFFFGaAFpKKKAFpKKKACijNFABRRmigAooooADRRRQAUUUUAFBozRQAUUUcUAFFFFABQelFBoAKKKM0AFFFFABRRRQAUUZozQAd6KKKAA0UUUAFFFGeaACg0ZozQAUUZooAKKKKACiijNABRRRmgAooooAKKM0UAFLRSdqACiiigBaSiigAooooAKWkooAKM0UGgAzRmiigAooNFABmgmiigAzRmiigAzRmiigAzRmiigAozR3o5oAM0ZoooAM0ZoooAM0ZoooAM0ZooNABmjNFFAB0ooNFABmjNFFABRmiigA6UZoooAKOtBooAM0Zoo70AFFFFABQTxRRQAZooooAO9GaKKACjNFFABRRRQAZozRRQAUZoooAKM0UUAFFFBoAM0UUUAGaM0c0UAFGaKKADNGaKKADNGaO1FABmiiigAopaSgAooooAKKKKACiijtQAGig0UAFFFFABRRRQAYoxQTRmgAoNHpR1oAKMUUCgA7UUdqKACiiigAxRRRQAdqO9HajvQAYooooAKKKKACiiigAooooADRQTxUQcSdCRQBISB1IFAIPQimMGxgAN9aFJHZR9DQBJQKbnHNCNuGR0oAdRQaKACjtRRQAYoo5ooAMUUUUAFGKKKACjFFFABiiiigAxRRRzQAUYoooAKMUUUAFGKKKAA0UHmigAooFFABiiiigA7UUUUAGKMUZooADRRRQAdqMUdqKADFFHNFAC0lFFABRRRQAUUUUALSUUUABooNFABRRR3oAKKKKAA0UUUAFFFBoAKKKKACiiigA70Ud6KACiiigA7UUdqKACijiigAoooxQAUUEZpCaAFoqKYbYyxBbHYda81+NXxx8M/Avw7c674iv4I1jidktTcJHJIyozgAORkkKcUAenOQqkk4AGTXGeJfi54R8Hxs2s62log67oJG9P7qn+8K/Hz9pT/gpt4y+IuqalZ+EsadoIneOMzQIzsm9tpDox/hIr4z1vx34h8QzmS71S8Ye8z47e/sKAP6DZ/21vgxayGM+NYFcdvsV1/8arV8PftSfC3xTcCPTvEsNxIx4xbXAz09Yx61/OI+o3LsB9qmJ9fMNWotdv7d0P2+5UKAB5UzKR+tAH9QemavZarbiWxmE8Z6EAj+Y9jV1CWGWG0+lfzmfCL9rfx/8I9Uin0nUZJ7SPOY7lTMfuuB1b1c1+rv7Iv/AAUQ0D46Rw6Rr08Oma45CATyQw7iX2rhQ2aAPtg0VRtplu7YSFx5ZOYpAeHGOCD3Bq3GpCject3x0oAeaKKKACjvRRQAUUUUAFFFHFABRRiigAooooAKKKKACiiigAooooAKKKOKACig0UAAooo70AFFHFFABRRiigAooooAKKMUUAFHrR2o70AH50UcelFAC0lLSUAFFFFAB3opaSgAoooPSgAozQelFABQTQOlBoAM0dqKO1AATRQaKACg0UGgAooooAO1FHaigAooo9KADrRRRQADpRR2o70AFGaKWgBKKDTMknrQA5jijtmmyD92xJxgE59KgS43siofM45HTmgDM8W+LrLwfoN5q2oOIrS2UNI7YwAWA7kdyK/BD9sP9qnxD8ffHd9F9ulTRbNyEtRPKI32b0PyFyDkH8a/Q/8A4KxfGub4ffCe38L2t21rceJEnj2qM7vJktX/ALpH8fqPxr8V3laWQyMcuTkn3oAvbjPEXbEMQ42Q8ZPriqeHK53cfWmrKyNuBwemabmgB4XYAw5NP8suQRxxkhuKiV2UcHFOkmeUKHYttGB9KAJtwf8A1bGMnsOBWp4W8T6t4X1u21DRL6fTL5ZFKS2szQkEHI+ZSD1rCLEgAnpU8MgETK/OB8g9DQB+7f8AwT5/aqh+Onw0tdG1a4Mmv6OqWMjOzM0oht4A0hZ3YsSzn5u9fYUTDBXJOO571/PT+wt8Zbn4P/HLTLgTtHbX6iydexMssQ/usei1/QZpl9DeadbzxHbHIuV6+tAF3NFR7iTwcinBSOS2R6UAOo70UUAFFFFABRRRQAUUUtACUUUUAFFFFABmiiigAooo9aACiigUABooNFABRRRQAZopaSgAoo7Ud6ADNGaKWgBKKKDQAUZo7UUAGaKWigApKWkoAKMUUGgAooooAKKKKACig0d6ACj8KM0UAFFFGaACijNGaADpRRQTQAUUUZoAKKM8UZoAO9FGaKACijrRmgA7Ud6KM0AFH4VA9z+8eNFO9ccsPl/OlE5Y7QAXAzn+GgCXuKCQBVS41S2sYmlu54rWNPvSSuEXP1Jr56+NP7dXw0+EMMoudUGo3Cj7mnmKfsh7SDs/6GgD6KkkEhUBguDk571l6x4n0jQoZH1TU7WxjByGmkCcfjX5G/Gf/grt4r12Oax8GaXYWtqxKi6nhuIZwCGGQyXHUZUj3r5D8eftV/FLx/fSXF/4116BHJP2e31e6EQyScBTIemaAPfP+CpXxU0/4kfGb7FpN/DqOnaRI/lS28iun72C1J5Hup/KviWrWoate6rO897dz3c7/flnlZ3bsMknJ4AqrQAUUUUAFFFFABUiAKA5OfQVHShsAjAP1oA1/Dt6+la9pd6h2vDdxTA/Rwf6V/Q7+yf8RbDxp8C/Cd9/alrJqElpuuYt4LI298AjtwK/nMErBlIJyuMV6V4B/aI+Ifw8+XRfFmr21qvC2i6ncRwqMEYCrIB/ETQB/Sp+8dQQ6sD6CnRqobg/Pjnmvxc+FH/BWzx74XeG31+0sNRtw3zSSrczSYzk/euPSvun4Kf8FJ/hp8Tkt7W+lm0zV5FDNvhSGHomQC0pP3mP4CgD6/orG0PxdpPiayjudL1G1u45BkeXMrn/AMdJ9DWoZtu0EZZjgbeRQBLRTFkyccZFI8u3oMn2oAkoozRmgAoNGaKACiijNAB+FFGaM0AFFGaM0AFFGaM0AFFGaKAA0UUZoAKKKM5oAPwoozRQAUUZ4ozQAUUUZoAKPwoozQAUUZ4ooAPwoozRQAYooooAKKKDQAUtFFACUUUHpQAGjvQaO9AB1ooAo70AFFFHagAoooxQAUUUGgAAooFAFAB2ooxxRQAUelFIcAZPSgBaKiWcO2FUlf7w6U4SDHPy/WgB9HemCQFsY4x97tXOeM/iHongDSp9R129h021iIG+4kCBsnAwT70AdDOHKttXdj+HP3q+bf2j/wBtv4ffs7aVcw3+pg68yMIdMNtc4ZikhX94sTKMtHt5PHWvhn9rf/gqFfeLn1Lw/wCAFNnpzIq/a3EM6SZSNvlOM8MGFfnRquv3er3095dzNNdzSM7ux4JJJOB25NAH1h8fv+CjnxF+LV3Pa6Xf3Gh6MzHZZwzLIsi7sqctECMDivkrULm4vLlpLzL3D9ZCRk4A9PbFVZHy27+I9TTQwP3gSaAJJFljQb/uZ45qPOaQsT9KQHFADiOM02nFsjGKbQAUUUUAFFFFABRRRQAUoAIOTj8KSgYzz0oAkUhsAJk/WpopHtXV1PkOp3K4557VWLDdkcClEm1sjuMGgD3f4Pfth/EX4OSxvY+ILqW1QYFjlEUjawHzbD03Zr9OP2Zv+CpPg/4mmz0rxbCnhjVrh/LiVDcXZkYuwAykAA4APJ71+KgnEZBiG31zzRHMUI8rcrHuDzQB/UVouuWHiPTE1DS5Ptdu/R9rJngHowB6EfnV4AyRZj+R+4FfgN+zL+3P4x+AmqWtu90L3Q8qklusMZcAtECdzD+7Hj8a/YH9nP8Aa+8E/tC6RbtZahbwarsHmWbXCNIG2liML6AUAfQNFM8zGdylVHc03z1OSOV7t2oAlopFYOARgg9xS0AFFGKPWgAooxRxQAUYoxRQACiij1oAKKMUYoADRQaAKACjvRiigAooxRQAUd6O1FABRRijFAAaKCKDQAdqKO1GKADFFGKKAFpKMe1FABRRRQAtJRRQAtJRR2oADR3oNHegAo70Ud6ACiiigAo4o7UUAFBooNABxQMUUUAHGKKO1JQAtIwDKQehFJvA70vUUAQSRMIQkJUY7k80ryKhC7S/vjNMEot/OaQ7UDDB614v+07+0hon7N/gGXUdUuCl7Kkgt18uQ7mXacZRWxww60Aafx5/aG8MfATwjeaxr19GtyqOLe0hdCzP5cjplGdScmMjg1+KP7Uv7anjD4/eIb1oNTudN0ASt5NrbTzw7k3Bl3J5rLkY7Vw37RH7R3iL4++Lp77WNQmvNPWYtbwStlVUPIUx8oPCyEfjXkvnRicv5YZOyHoKAIy7qNpyPrTKklYPISWL5/iI60w4oAGOaSiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKdGSsileoPGabSqxVgR1FAEqsAxIG5j1BHFdT4D+JfiX4daoLvw9q13pU5JJMFzJCOhH8DKehNcqZgSCFCN3YUjSZYlv3nuaAP2s/Yv8A+CielfFu0g8PeL5Y7DXWO0SEeXG5aSQj5pZ2JwoXtX3MklvqFtFNBKTDxIDEw2uMZ7dc1/MFpmrz6HfW1/YXT2d5btviu4x8xP07Yr9Wf2AP+ChUXiiWz8DeObt11DaIrK4fzZmkYtBFEvyx4XJZjknjvQB+mcZUopUbRjgYxincVDbzrPCjqchhmnGdFhMpPyDvigCSk4oU7gCOQeaKAF4o4opKAFo4oooAKOKTtRQAtAxRRQAGgYoNIKAFo70Ud6ADiiiigBDil70lFACmjiiigANHFJS0AHaik7UvegA49qKKKAD8aKKKACj1oooAKWkooAWk7UUUABooNFABRQKKACiiigAooNFABQaKKACij8KPwoASg0vbpSNgCgBhXJpWI2HPTHNOGOlc/wCN/Fun+CPDGpa3qV1DbWtnbyTFpnVQxRGfaNxAJIU8ZoA4/wCOvxy8O/Ajwa+u6zcxRhAnlxPKELhnVMgkHoWr8Cv2h/2hNf8A2ifGN14g1iXyoCEMNu0aKciNEPKgZ+5XpP7b37Wl98fviBd21rdzR+HLSWSOKGJmVXUsrKcCVlOCvavmCXa6LNIQFb7scZ6Y9R2oAqHk0UHrxRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAEoQtGNpyV9KuafqlzY30N7bSiK5tyroxAPKkEfqKpZ2nehwPQ0M6kdwT6UAfrj/wAE6/28oPEOn6f4A8ZXcdtdQQiK1uJTHGGSOIk4Crk5I71+lA2owD8sv3T61/L3oGuXOhXUd9Y3NxZ6hAcRTQSFAF7gkEHmv2+/YB/bLsfjp4Ks9E1y5RfFFvu37yAZC88xUDdKznCKvb9KAPs2INt+Y5yadSIcjmgOrZwQccHB6UAOpKXg0fhQAUUfhRQAUlL2ooAOtFH4UfhQAUUGj8KAEpaBRQAUUfhRQAUUUd+lABRRRQAUUUUAJzS0UUAFFH4UUAFFH40UAFFFFAC0lLSUAFFHejtQAGig0d6ACiijvQAUUUUAFFFFABRRRQAUZoozQAZ4psmApyMj0paRjtBOM0AQuhVmPmEFxgD0r8qP+Con7XjTSn4ceH7uRCm2W7270zg3UMgOVwe3Q19r/tn/AB5sfgL8IdV1ETIusXNvKlmpYZMigEYDKQeD3r8AvHHim/8AGHifU9dv3zc39xLMRtUcO7P2AHVjQBztFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBPFEz7Ywx2uMkV6F8CvjBqvwR8dWHiPTJXjMMgdtrlc4DAdAT/Ea84fbtXHpzUw2rNgHMPegD+k/wCAPxgsvjN8M9L8QWchclEjnyGHziNC/wB4Anlq9IRVDbkUbH+Yn3r8Sf8AgmP+083ws+IyeE9RlVdH1VhbxK2xf301xbp12ljwDxmv2zs7iLUNPgnhOYZEDqRzxQBPA26MNnr2qTNMRt+SDlexp1AC5ozRmigAFGaSloAKKKKAA0ZoPNFABRRR3oAM0UUUAHaikpaACjNFFAAaM0hpaADtRSdqWgAzRRRQAUUUUAFHrRRQAtJS0lAC0naiigANFBooAOKKKKACiiigAxxRRRQAUUUUAFNfBGCcZ44p1IQCRnt0oAhkZg6qvKgZJpzyRoC7uFUdSSAKjic7JdxxlyBXz/8Atr/HFPgT8FNT1OKQpqRMBh27gSPtESNyOnD0Aflf/wAFHP2jh8Yvinc6ZYXcjaRpwilhCOPLdmgQMPlkZTyD2FfHErHyArZLk7h9MVZvrubVZp57mRpZh8xkY5LegqmxLJuJJb7oHtQBHRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFGaKKANDQdVuNA1ix1O2leKa1nSZHjYhgVYMCCCO49a/er9gH9oKH42/BLTLOW5Dapo8FvZSB2XzJCIgWY/OzH6nH0r8CFBKHB6dRX2P/AME0/j1J8KfjFBp15cvHpN6kzumWKl/L2rwKAP3ZQnzHXACjpgU+orSbz4FfOc55/GpuaACjFGaKAEHSlo7UUAFHFFFAAaMUUc0AFHeiigA4ooooATil4oooAKOKKKAEpeKQ0tACdqXvRRQAcUUc0UAHNFH4UUAFBoooAWiiigBKO1FB6UAB6Ud6KKAAUUUUAFHaijtQAGiiloASg0UGgApkig7WbovOafTJsMmw/wAXFAETjaN8jgxk5AxjHpX46f8ABXH41nxD4/svCFjcqYdP8+G7QBTlt8Lr/DkdOxr9a/iRrkPhbwJrGpTyLGtpaSyhmYDlY2YdSPSv5yv2ivHz/Ej4xeKddeQypeXZljOcgDao45Pp2NAHm284AzwOlK0jOck5OMfhTaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAHxuy5CHBb5T7irml3babqdpcp+7eCVGJ69CD/SqKkqQw7GphIocE87hkj3oA/o3/AGTPjFD8Zfgxomvidbi5lWYyuuB0uJUHAUDonpXsW5xcNk/uwmQMd6/Lr/gjx8YlNvr/AIHvZwPsq2y2oZgAxd7qRsZbnqOgr9SsblPvQAISwJJ69KdUeCJVA+6BUlAB2ooFFABRR2ooADRRRQAUUelFABRRRQAUd6O1HegAoopaAEooNFAB2oo7UUAFFLRQAn50UUUAFFHeg96AFpKKKAFpO1FHagANGaDR3oAKKKO9ABmiiigAozRRQAUUUGgAzTJeF3d15p9RXOfs8mOuOKAPmD/gof8AER/h/wDs8X80L/vr6b7HgsRhZIJx2+lfgDM+8lmYvI3LFutfq/8A8FkvHMkGi+H/AAtHJhnjtL9l4/vXaHt7ev4V+TjZJye9ACUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAKGxjjPOaXeNrDaMk5z6U2igD6Z/4J+/EefwJ+0N4eVCFgvLjEx3EZCwzYzjr96v6A9PuvtdnbyDpJCsmfqAa/mE+H+vSeFvF+m6tEdr2rlgeOMqR3B9fSv6UfhFrqeKPhzoOoIwbdZQqSPXy1z2HrQB2SZG7nPNPzTUGBTqAAUlA6UtABRmiigApKU0lAC0dTRR3oAM0UUUAJmjNBooAXNGaKKAEzS5pKWgAzxRmk7UvegAzRRRQAUUfjRQAUUUUALSUtJQAtJ2ooPSgANHeg0ZoAKKKKACiijtQAUUUUAFBo6UGgApjqWK4IxnnNPpkp2xn1xQB+I/8AwVn8VtrPx+s7AOSLfSkXGeMLd3Y9fevhb5Sjn6YzX03/AMFD9cbV/wBpXWWZi32dZ7bkk423lzx+tfMRHBI6UAJRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAORiMgHGe9f0K/sEeKR4p/Z70u43E+VK0OGIz8qRj1Nfz0Yr9xv+CUniFtX+AZgLFhHeXHBJ7eUKAPt9Gzk06kUYFLQAn40tFFABR+NFFAAaSlNFABRRRQAUUUUAJ+NL+NH4UUAFFFFABRRRQAnal79aTtS0AH40UfnRQAUUUUAFFFBoAWiikoAKDRR2oAD0o70GjvQACjvRR3oAKO1FFAAaWkooAPSg0UhoAUVDdMEhLk4VRkmpqraj/wAeE/8AuGgD+dL9sy/+3/tD+NiTkpq98i/QXc9eHljtxXsX7XP/ACcP43/7C99/6VzV463U0AJRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAKpwfav2Q/4I53vmfCDULfdmRbm6bb7boa/G71r9g/8AgjZ/yTvU/wDrpc/+hw0AfpEpOFyMHHNOpD1paAAUUlFAC0UUUABoFIaKAF9KD1pKO9ADqSij1oAO1HekooAWlpDRigANBpDRQAtFJS96AFoptFAC0UtJQAYoNFFABRRiigAooooAOlFBo70AGaM0UUAGaM0UUABNGaO1FABQTRQaADNVtSP+gT/7hqzVbUv+PCf/AHDQB/OH+1z/AMnD+N/+wvff+lc1ePN1New/tc/8nD+N/wDsL33/AKVzV483U0AJRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFfsH/wRs/5J3qf/XS5/wDQ4a/Hyv2C/wCCNn/JPdT/AOulz/6HDQB+knelzSDqaWgAzRmkpaADNGaKKAAmjNBpKAFzRmijvQAZooooAM0ZpO1LQAZozQaKADNGaSloAM0ZpO1LQAZooooAKKWkoAKDRRQAtJS0lABR2o70dqAA0UGigAAoxQKKACjtRR2oAOlFHWigA6UGj0oNABiq2oj/AECf/cNWaraif9An/wBw0Afziftc/wDJw/jf/sL33/pXNXjrdTXsX7XP/Jw/jf8A7C99/wClc1eOt1NACUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABX7Bf8EbP+Se6n/10uf8A0OGvx9r9gv8AgjZ/yT3U/wDrpc/+hw0AfpIOppcUg6mlzQAUYo7UetABijFFGaAAijFBooAKKBR3oAMUUZooAMUYoo70AGKMUUZoAKMUGjNABijHNHajNABiijNFABRS0UAJmiig0AGaKWkoAO9HajvR2oADzR3oNFABR3oo70AFFFHagAooooAKDRQaACq2pf8AHhP/ALhqziq2pf8AHhP/ALhoA/nD/a5/5OH8b/8AYXvv/SuavHm6mvYf2uf+Th/G/wD2F77/ANK5q8ebqaAEooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACv2C/4I2f8k91P/rpc/wDocNfj7X7Bf8EbP+Se6n/10uf/AEOGgD9JB1NLSDqaXFACUtJS0AFFFGKAA0lKaTFAC0dTSAUvegAooxRigBKWkoxQAtFGKMUAJS0mKXFACdqWkxxS4oAKKMUUAFFFHrQAUUUGgAoopaAE70dqKKAA8UUGigAozRR3oAKM0UdqACjNBooAKM0UGgAqtqR/0Cf/AHDVmq2pf8eE/wDuGgD+cT9rn/k4fxv/ANhe+/8ASuavHW6mvYv2uf8Ak4fxv/2F77/0rmrx1upoASiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK/YL/gjZ/wAk91P/AK6XP/ocNfj7X7Bf8Ea/+Se6n/10uf8A0OGgD9JB1NLmkHU0tACZpc0UUAGaKKKAA0ZoNFABRmj0ooAM0UUUAJmjNL2o70AGaM0UUAGaM0GigBM0tHaigAzRRiigAopaSgAoozRQAUUUUAHejtRR2oAKM0GigAooo70AFHaiigAooooAKM0UGgAqtqX/AB4T/wC4as1U1VxFptyx6KhJxQB/OL+1z/ycP43/AOwvff8ApXNXjzdTXsP7WzB/2hPGzjodXvv/AErmrx9l+97GgBtFFFABRRRQAUUUUAFFFFABRRRQAUUU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tHsdMhjyS1raRQtJk5w3lqueTXb27rMWcJhlOwlhz+HtUxAOM0dqAFzRmijHNABnijNFBoAM0UGj1oASlzRRQAUZooxQAZpM0uKKADNGaKO9ABmiiigAzRmiigAozQaBQAZo70elHegAzRmjFFABmjNJ2pe9ABmjNBoxQAZozSUtABnijNJjil70AGaKMUUALSUtJQAUUUUAFFGaKACjtRQelABRRRmgAooooAKKKO1ABRRRQAUHpRRQAUUUUAHajFHajmgBKWiigA7UUUc0AFFHNFABR+FFGaAA0Uc0c0AFFHeigBrnahNRyxLMASflHPFTEZGCMimLHgnknPbtQBErhRtRCQOM1Lu/2TR5YByOPYU+gBm7/ZNG7/ZNPooAZu/2TTN29im0jHepqQrnPY+tAEfEYwxFOQHkkgjtijyxjkbvrTgMdKAFxR2oooAMUUc0UAFFHSigAooo5oAKKOaM0AFFFFABRRRQAUUUUAFFHaigAooooAKKDRzQAYooo60AH4UUZooASlxzRRQAUYoooAKMUUUAFFHNFABj2FFHNFABRS0lABQaKKAFopKKACg9KKKAA0UUUAAooo70AHajtRRQAGlpKKAD0oNFFABRRRQAdqO9HaigA70elFFAAelHeiigA7Ud6KKACiiigANFFFABRRRQAtJRSUALRRRQACg0UUAFAoooADQKKKACjtRRQAd6O9FFAB2oNFFAAaPWiigAooooABR60UUAFFFH40AFFFFAAKPWj8aKACiiigANFBooAPSjvRRQAUUUUAHajvRRQAUtJRQAGg0H60UAHY0UUd6AFopPzooAWkoxRQAUGig0ALSUtFACd6KO9HagANHeg0d6ACjvQKO9ABRRR2oAKKKKACg0UGgAo4oooATtR+FL2pKADvS0neloAKSlooATtS0dqKACiiigBKKU0lAB60tFFABxSUtJQAtJSmigAooFB6UAJRS0CgBDS8UGigApKWjtQAnejvS96TvQAtBoFB6UAFH4UUetACUvFJ3paAEo9aX0pKAF4pKXmjtQAUUUUAIKKKX1oASl4oooADRQaKACjvRR3oAOKKOaKAE7UZ5o7UtABRxQaKAEpaKDQAlLR2ooAOKKOaKACilpKACiiigAopaKAEoooPSgANFBooAB0ooFBoAO1HajtR2oADRRRQAGjNFBoAKKKKADPFGaO1HegAooooADRQaO9ABniijtR3oAKKKWgBKKDRQAZooooAM0ZpaQUABozQelFABRQKDQAUCigUABozQaBQAUdqKO1ABmjvRRQAUUDpQaACiiigAooooAM0etFFABmgGjvRQAUUUUAGaPWiigAooooADRmg0UAFFAooAKKWkoAKM0dBR3oAKKKKACg0GigAzxRQOlFABmilooAKSiigAoo70HpQAUUtFACUUUHpQAGig0d6ACiijvQAUUUUAFFBooAKDR6UGgAzQDRRQAZ4pM0vajvQAmaWjvR6UAGaSlPSigBKXPNHajvQAZooooAKKDRQAUlLRQAZpKWkFACmkpTRQAZozQKD3oAKQUtAoADRmkNKKADNFFHagAzSZpe9HegAzRmig0AFFFHrQAmeaXNA60ZoAKKPSigAzSZpc80dqADNGaKKAE7UtFFABRmiigANGaDRQAUUUd6ADNFFFACUuaO1HegAJozRRQAUZoNBoASlzR2o70AGaKM0UALSUUUAFB70UUAFFFFABRRRQAHpRQaKAAUd6BRQAUdqM+9FABRQaKACg0UUAFHFFAoAO1JS9qKAE70tFFABxScUtHegBO1L3o7UUAHFFFFACcUUtHNACUtFFABSUtHNAARSUpooAQYpe1AoNACUUtAoAQ9aXiiigBKKWigBKKXvRQAUUUUAGBSUtFACUvFHeigA4pKWigA70lLRQAUUUUAJ2paKKACjiiigAOKSlNHNABijvRRQAUUUUAJRxS0UABoxRRQAlLgUGjmgBO1LRRQAcUUUUALSetFFAB3oPSiigBaKKKAE70HpRRQAHpR3oooAB0o70UUAHajsKKKAA9KWiigBPSg0UUAAoHSiigA7Ud6KKADvR6UUUAB6Ud6KKADsaO9FFAB60tFFACGiiigAPeiiigBabRRQApooooABQelFFABQKKKAA0CiigANHY0UUAHejvRRQADpQaKKAA0etFFAB3paKKAEHaj1oooAO9A6UUUALSd6KKAAdKD3oooAO1HrRRQAGgUUUAA7Ud6KKAFpKKKADsKO9FFAAaWiigBDQaKKADsaO9FFAC0UUUAf/Z ';
        echo json_encode($this->achievment_model->uploadImage(1, $data));
    }
    
    public function crop(){
        $this->load->model('achievment_model');
        $data = new stdClass;
        $data->achievmentId = 1;
        $data->imageDogId = 5;
        $data->uid = "556ccd89ce6b3";
        $data->height = 256;
        $data->width = 256;
        $data->x = 256;
        $data->y = 256;
        echo json_encode($this->achievment_model->cropImage(1, $data));
    }
    
    public function hasImage(){
        $this->load->model('achievment_model');
        $data = new stdClass;
        $data->trickId = 2;
        echo json_encode($this->achievment_model->hasImage(1, $data));
    }
    
    public function nmAchivements(){
        $this->load->model('achievment_model');
        $data = new stdClass;
        $data->trickId = 2;
        echo json_encode($this->achievment_model->numberOfAchivements(1, $data));
    }
    
    public function getAchivements(){
        $this->load->model('achievment_model');
        $data = new stdClass;
        $data->pageSize = 20;
        $data->skip = 0;
        echo json_encode($this->achievment_model->getAchivements(1, $data));
    }
    
    public function getAllTricks(){
        $this->load->model('trick_model');
        $data = new stdClass;
        $data->pageSize = 20;
        $data->skip = 0;
        echo json_encode($this->trick_model->getAllTricks(1, $data));
    }
    
    public function achivment(){
        $this->load->model('achievment_model');
        $data = new stdClass;
        $data->achivmentId = 26;
        echo json_encode($this->achievment_model->singleAchivement(1, $data));       
    }
    
    public function nmtricks(){
        $this->load->model('trick_model');
        $data = new stdClass;
        $data->achivmentId = 26;
        echo 1;
        echo json_encode($this->trick_model->numberOfTricks(1, $data));       
    }
    
    
    public function token(){
        $data = 'Ldvzkxn2K5AL+c8T5yUZv2ZunZsow4CO+EK3COGIQaOdExKANHjnN9i9LvbOp1mTT7JPIJ9UCN\/qx4bP0LnsuFtEg+PMEtFrsOiEseomc\/SqsM50\/w8WQS0QO9pQmi1R';
        $this->load->model('user_model');
        $returnData= $this->user_model->checkToken($data);
        echo json_encode($returnData);
    }
    
    public function getImages(){
        $this->load->model('dog_images_model');
        $data = new stdClass;
        echo json_encode($this->dog_images_model->getImages(1, $data));
    }
    
    public function sizeImages(){
        $this->load->model('dog_images_model');
        $data = new stdClass;
        echo json_encode($this->dog_images_model->numberOfImages(1, $data));
    }
    


}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */