<?php 
include_once('commoncontroller.php');

class export extends CommonController
{
	public function index()
	{
		$core = Core::getInstance();
		parent::initDb($core->getConfig('database'));

		if(!isset($_SERVER['argv'][0]))
		{
			echo 'Project Name Must Set',"\n";
			return ;
		}

		$name = $_SERVER['argv'][0];

		echo "# Project: $name\n";
		#$file    = isset($_SERVER['argv'][1])?$_SERVER['argv'][1]:false;

		#$filepath = realpath($core->console['pwd'].DIRECTORY_SEPARATOR.$file);

		$ret = $this->getModel('mproject')->getProejctInfo($name);

		echo $ret['project']['fileHead'];

		$menu = $this->getModel('mfile')->buildMenu($ret['models'], $ret['apis']);
		echo "## MENU\n";
		foreach($menu  as $k=>$v)
		{
			echo '- [ ]',"\n";
		}
		echo "\n";

		echo "# Interface Start\n";

	}
}
