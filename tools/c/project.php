<?php 
include_once('commoncontroller.php');

class project extends CommonController
{
	public function index()
	{
		$params = $_SERVER['argv'];
		if(isset($params[1]))
			echo "Don't Know Command:${params[1]}\n\n";

		echo implode("\n",['create','list']), "\n";
	}

	public function create()
	{
		$core = Core::getInstance();
		parent::initDb($core->getConfig('database'));
		$params = $_SERVER['argv'];

		if(!isset($params[1]))
		{
			echo "usage: project create PROJECTNAME \n";
			return ;
		}

		$customer = $this->getModel('mcustomer')->getCustomer();

		$ret = $this->getModel('mproject')->create($customer['customerName'],$params[1]);

		if($ret)
		{
			echo "'",$params[1],"' Project created\n";
		}
		else
		{
			echo "'",$params[1],"' Project create failed\n";	
		}
	}

	public function list()
	{
		$core = Core::getInstance();
		parent::initDb($core->getConfig('database'));

		$ret = $this->getModel('mproject')->getProjectList();

		if($ret)
			foreach($ret as $k=>$v)
			{
				echo $v['name'],"\n";
			}
		else
			echo "No Project Exist\n";
	}
}

