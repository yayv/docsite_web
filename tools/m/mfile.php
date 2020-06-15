<?php

class mfile extends model
{
   
    function __construct($filename=false)
    {
        $this->eof = false;

        $this->status = [
            'not_start', // no file opened
            'in_head', // in file , not in api section
            'in_menu', // in menu section
            'in_body',  // in api section
            'in_model', // in api model section
            'in_api', // in api define section
            'end_file'
        ];

        $this->pregs = [
            "menu"=>"/\#[ \t]*MENU.*/",
            "model"=>"/\#\#[ \t]*MODEL.*/",
            "api"=>"/\#\#\#[ \t]*(.*)/",
            "body"=>"/```/",
            "body_end"=>"/```/",
        ];

        $this->INFOKEYS = ["No","URL","NAME","METHOD","FORMAT","REQUEST","RESPONSE","TEST","NOTE","TODO","STATUS"];
        
        $this->arrDatas = array(
            "NO"=>'',
            "NAME"=>'',
            "URL"=>'',
            "REQUEST"=>"",
            "FORMAT"=>"", // JSON/FORM
            "RESPONSE"=>"",
            "NOTE"=>"",
            "STATUS"=>"",
            "TODO"=>"",
        );

        $this->statusStack = [];
        $this->status = 'not_start';

        if($filename)
            $this->setFile($filename);
    }

    function parseBody($methodNo, $methodName, $lines)
    {
        $arrExtra = array();
        $iskey = false;
        $key = false;   

        if($methodNo=='') {print_r(array($methodNo,$methodName,$lines));die('kii');}
        echo "API:",$methodNo,"[",$methodName,"]\n";
        #print_r($lines);
        #echo "[------------]\n";

        foreach($lines as $k=>$v)
        {
            # echo $v,"\n";
            # continue;
            if($ret = preg_match("/```/",$v, $matches))
            {
                continue ;
            }

            $ret = preg_match("/(^[ a-zA-Z]*):(.*)/",$v, $matches);
            if($ret)
            {
                $key = strtoupper($matches[1]);

                // end last key, or start new key
                if( array_key_exists($key, $arrDatas) )
                {
                    $iskey = true;
                    $arrDatas[$key] = $matches[2];
                }
                else
                {
                    $iskey = false;
                    $arrExtra[$key] = $matches[2];
                }
            }
            else
            {
                if(!$key) continue ; // 尚未进入API

                if($iskey)
                    $arrDatas[$key] .= $v;
                else
                    $arrExtra[$key] .= $v;  
            }
        }

        #if($methodNo=='U18')
        {
            checkKeyValue($methodName, $arrDatas, $arrExtra);
        }

        if(count($arrDatas)==0)
            return false;
        else
            return $arrDatas;
    }

    function checkKeyValue($api, $arrDatas, $arrExtra)
    {
        $MUSTKEYS = ["URL","REQUEST","RESPONSE"];
        foreach($MUSTKEYS as $v)
        {
            if(!isset($arrDatas[$v]) || ""==$arrDatas[$v])
            {
                // TODO: wrong
                echo "\tKEY:",$v, " 必须设置\n";
                #debug_print_backtrace();
                return false;
            }
        }

        if(''!=trim($arrDatas['REQUEST']))
        {
            $req = json_decode($arrDatas['REQUEST']);
            $msg = json_last_error_msg();
            if($msg!='No error') 
            {
                echo "  REQUEST: \t",$msg, "\n";
                print_r($req);
            }
        }
        else
        {
            // DO NOTHING
        }

        $res = json_decode($arrDatas['RESPONSE']);
        $msg = json_last_error_msg();
        if($msg!='No error') 
        {
            echo "  RESPONSE: \t",$msg, "\n";
            print_r($res);
        }

        if(isset($arrDatas['TODO']) && ''!=$arrDatas['TODO'])
        {
            echo '  待完成:',$arrDatas['TODO'],"\n";
        }
    }

    function scanInterfaceFile($filename)
    {
        // ---------------
        $startLine = "# Interface Start";
        $modelTitleLine = "/##[ \t]*MODEL:[ ]*(.*)/";
        $apiTitleLine = "/###[ \t]*([a-zA-Z]*[0-9]*):[ ]*(.*)/";
        $apiBodyBorder = "/```/";
        // ---------------

        $lines = file($filename);

        $start  = false;
        $status = 'in_file';// not_start in_file in_menu in_model in_interface in_body end_file
        $currentAPI = '';
        $currentNo  = '';
        $data = array();
        $apis = array();

        $pregs = ['menu'=>"/#[ \t]*MENU/","menu_end"=>"/#/"];
        $menu  = [];

        foreach($lines as $k=>$v)
        {
            $ret = false;
            foreach($this->pregs as $kk=>$vv)
            {
                $ret = preg_match($vv, $v, $matches);
                if($ret)
                {
                    echo $vv,":\n";
                    echo "\t",$kk,"\n";
                }
            }
            if($ret)
                echo "\n\n";
        }

        return $apis;
    }

    public function getSectionType($line)
    {
        $t = [];
        $sectypes = [
            'startLine' => "/\#[ \t]*Interface Start/",
            'modelTitleLine' => "/##[ \t]*MODEL:[ ]*(.*)/",
            'apiTitleLine' => "/###[ \t]*([a-zA-Z]*[0-9]*):[ ]*(.*)/",
            'apiBodyBorder' => "/```/",
            'menu' =>"/##[ \t]*MENU/"
        ];

        $nomatch = true;
        foreach($sectypes as $k=>$v)
        {
            $ret = preg_match($v, $line, $matches);
            if($ret)
            {
                $nomatch = false;
                $t[] = $k;
            }
        }

        if($nomatch)
            return ['noMatch'];

        return $t;
    }

    public function setFile($file)
    {
        $this->filename = $file; 
        $this->lines = file($file);
        $this->idx = 0 ;
        $this->eof = false;
        $this->status = 'in_file';
    }

    public function getNextSection()
    {
        $result = [$this->lines[$this->idx]];
        
        $t = $this->getSectionType($this->lines[$this->idx]);

        for( $i=$this->idx+1; $i<count($this->lines); $i++ )
        {
            $ret = preg_match("/^[ ]*\#+/", $this->lines[$i], $matches);
            if(!$ret)
            {
                #preg_match("/^[ ]*\#+/", $this->lines[$i], $matches);
                $result[] = $this->lines[$i];
            }
            else
            {

                #print_r([$i,$this->idx,count($this->lines), $this->lines[$i], $matches]);
                $this->idx = $i;
                return [$result, $t];
            }
        }

        $this->eof = true;
        return [$result,$t];
    }

    public function isEof()
    {
        return $this->eof;
    }

}


