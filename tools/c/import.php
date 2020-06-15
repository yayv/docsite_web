<?php 
include_once('commoncontroller.php');

class import extends CommonController
{
	public function index()
	{
		$core = Core::getInstance();
		parent::initDb($core->getConfig('database'));

		$project = isset($_SERVER['argv'][0])?$_SERVER['argv'][0]:false;
		$file    = isset($_SERVER['argv'][1])?$_SERVER['argv'][1]:false;

		$filepath = realpath($core->console['pwd'].DIRECTORY_SEPARATOR.$file);

		if(is_file($filepath))
			$arrFile = file($filepath);
		else
		{
			echo 'file not exist',"\n";
			return ;
		}

        $this->getModel('mfile')->setFile($filepath);
		
		$i = 0 ;
        while(!$this->getModel('mfile')->isEof())
        {
	        list($section,$stat) = $this->getModel('mfile')->getNextSection();
	        echo implode('|',$stat),"\n";
	        #echo implode("",$section),"\n\n\n";
	        echo $section[0],"\n\n\n";

	        $i+=1;

	        #$this->getModel('mproject')->update();
	        #$this->getModel('mapi')->updateModel();
	        #$this->getModel('mapi')->updateApi();

	        #if($i>4)
	        # 	break;
	    }

		return ;
	}

	
}

