<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Files_model extends CI_Model {

      private  $filesData = array(
        "files"=> array(
            "tricks" => array(
                array("url" => "http://users.canelio.com/files/tricks/41.json", "id"=>41),
                array("url" => "http://users.canelio.com/files/tricks/42.json", "id"=>42),
                array("url" => "http://users.canelio.com/files/tricks/43.json", "id"=>43),
                array("url" => "http://users.canelio.com/files/tricks/44.json", "id"=>44),
                array("url" => "http://users.canelio.com/files/tricks/46.json", "id"=>46),
                array("url" => "http://users.canelio.com/files/tricks/47.json", "id"=>47)
            )
        ),
        "total" => 6,
        "version" => 1,
    );

    public function __construct() {
        
        parent::__construct();
        $this->load->database();
        
    }

    public function getFullList($userId, $previousFileVersion) {
        try {

            return array("success" => 1, "data"=> $this->filesData);
            
        } catch (Exception $ex) {
            return array("success" => 0, "message" => "inputed wrong data","errorCode"=>1);
        }
    }
    
    public function getFilesVersion(){
        return array("success" => 1, "data"=> $this->filesData["version"]);
    }


}

?>
