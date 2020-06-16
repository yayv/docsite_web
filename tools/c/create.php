<?php 
include_once('commoncontroller.php');

class create extends CommonController
{
	public function index()
	{
		// create a project

		$params = $_SERVER['argv'];

		$ret = $this->getModel('mproject')->create($params[0]);

		if($ret)
		{
			echo $params[0],' Project created',"\n";
		}
	}
}