<?php 
include_once('commoncontroller.php');

class defaultcontroller extends CommonController
{
	public function index()
	{
		$core = Core::getInstance();
		#print_r($core->session);
	
		echo "没找到命令:".$core->console['controller']."/".$core->console['action'],"\n\n";

		$this->usage();

		return ;
	}

	public function usage()
	{
		$pwd = getcwd();
		echo "可用命令如下:","\n";
		$f = dir($pwd.'/c');
		while (false !== ($entry = $f->read())) {
			if($entry=='..' || $entry=='.' || $entry=='defaultcontroller.php' || $entry=='commoncontroller.php')
				continue;
			$p = pathinfo($entry);
   			echo "\t",$p['filename'],"\n";
		}
		$f->close();

		echo "\n";
	}

}

