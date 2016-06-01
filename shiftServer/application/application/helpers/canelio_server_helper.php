<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

    function serverUrl (){
        return "http://users.canelio.com/";
    }
    
    function constructImageSmallUrl($name){
        return serverUrl().'uploads/images/small/'.$name.'.jpg';
    }

    function constructImageLargeUrl($name){
        return serverUrl().'uploads/images/large/'.$name.'.jpg';
    }
    
    function getAngularUrl(){
        return serverUrl().'uploads/test/';
    }
    
    function getAchivmentPicFacebookUrl(){
        return serverUrl().'uploads/images/res/achivmentWonNoImage.png';
    }
    
    function getAchivmentSharableUrl($id){
        return serverUrl().'pub/achivementSocial/'.$id;
    }
    
    function getPassRetrivalUrl($token){
        return getAngularUrl().'#/passRetrival/new/'.$token;
    }
    
?>
