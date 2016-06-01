<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class User_statistics_pub_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }
    
    public function getLevels(){
        $this->db->select('userLevels.level, users.email,usersDogs.id as dogUserId, users.id as userId, clickers.s1 as s1');
        $this->db->from('userLevels');
        $this->db->join('usersDogs', 'usersDogs.id = userLevels.dog_user_id');
        $this->db->join('users','users.id = usersDogs.user_id');
        $this->db->join('clickers','clickers.user_id = users.id');
        $this->db->where(
                array('clickers.user_id !='=> 0)
                );
        $resultuseri = $this->db->get()->result_array();
        foreach ($resultuseri as $r){
            $this->db->select('count(*) as c');
            $this->db->from('achievments');
            $this->db->where('dog_user_id' , $r['dogUserId']);
            $this->db->where('shared', '1');
            $a1 = $this->db->get()->row_array();
            $a1  = $a1['c'];
            $this->db->select('count(*) as c');
            $this->db->from('achievments');
            $this->db->where('dog_user_id' , $r['dogUserId']);
            $this->db->where('shared', '0');
            $a2 = $this->db->get()->row_array();
            $a2  = $a2['c'];
            
            $this->db->select('sum(timesTrained) as total ,sum(timesSuccess) as success');
            $this->db->from('training');
            $this->db->where('user_id' , $r['dogUserId']);
            $t = $this->db->get()->row_array();
            
            echo 
            '<div>level '.$r['level'].'-'.$r['email'].'<br/> shared: '.$a1.'shared + '.$a2.'not shared,<br/> trained:('.($t['total']-$t['success']).'fail '.$t['success'].'sucess)</div>'.
            '<div>'.$r['userId'].'-'.$r['s1'].'</div><br/><br/>';
        }
    }
    

    
   

}

?>
