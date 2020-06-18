<?php 
include_once('commoncontroller.php');

class create extends CommonController
{
	public function index()
	{
		$core = Core::getInstance();
		parent::initDb($core->getConfig('database'));

		$params = $_SERVER['argv'];

		$user = $_SERVER['USER'];

		// create a project
		$ret = $this->getModel('mproject')->create($user, $params[0]);

		if($ret)
		{
			echo $params[0],' Project created',"\n";
		}
	}
}