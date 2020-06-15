<?php 
include_once('commoncontroller.php');

class create extends CommonController
{
	public function index()
	{
		// create a project

		$params = $_SERVER['argv'];

		print_r($params);
	}
}