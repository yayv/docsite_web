<?php 
include_once('commoncontroller.php');

class check extends CommonController
{
	public function index()
	{
		$core = Core::getInstance();
		parent::initDb($core->getConfig('database'));

		$file    = isset($_SERVER['argv'][0])?$_SERVER['argv'][0]:false;

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

		$status = '';
        while(!$this->getModel('mfile')->isEof())
        {
	        list($section,$stat) = $this->getModel('mfile')->getNextSection();
			
			// Interface 段开始前，都是fileHead

			if($stat[0]=='startLine')
			{
				// todo: update project info
			}
			else if($stat[0]=='menu')
			{
				// todo: skip this section
			}
			else if($stat[0]=='model')
			{
				// todo: 
			}
			else if($stat[0]=='noMatch')
			{
				#echo implode('|',$stat),"\n";	
				echo '不能识别:';
				echo $section[0],"\n";
			}

	        $i+=1;
	        #break;

	        #$this->getModel('mproject')->update();
	        #$this->getModel('mapi')->updateModel();
	        #$this->getModel('mapi')->updateApi();

	        #if($i>4)
	        # 	break;
	    }

		return ;
	}
}