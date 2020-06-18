<?php 
include_once('commoncontroller.php');

class project extends CommonController
{
	public function index()
	{
		$params = $_SERVER['argv'];
		if(isset($params[1]))
			echo "Don't Know Command:${params[1]}\n\n";

		$commands = array_diff(get_class_methods($this), get_class_methods('CommonController'));

		echo "\nUsable Command:\n\t",implode("\n\t", $commands), "\n\n";
	}

	public function create()
	{
		$core = Core::getInstance();
		parent::initDb($core->getConfig('database'));
		$params = $_SERVER['argv'];

		if(!isset($params[1]))
		{
			echo "\nUsage: project create PROJECTNAME \n\n";
			return ;
		}

		$customer = $this->getModel('mcustomer')->getCustomer();

		$ret = $this->getModel('mproject')->create($customer['customerName'],$params[1]);

		if($ret)
		{
			echo "\n'",$params[1],"' Project created\n\n";
		}
		else
		{
			echo "\n'",$params[1],"' Project create failed\n\n";	
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

	public function remove()
	{
		$params = $_SERVER['argv'];

		if(!isset($params[1]))
		{
			echo "\nUsage: project remvoe PROJECTNAME \n\n";
			return ;
		}

		echo "移除操作不可逆,您确认要移除项目", $params[1] ,"吗?(Y/n)";
		$s = fgets(STDIN);
		if(trim($s)!='Y')
		{
			return ;
		}

		$core = Core::getInstance();
		parent::initDb($core->getConfig('database'));

		$project = $params[1];
		$detail = $this->getModel('mproject')->getProjectDetail($project);
		if(!$detail)
		{
			echo "Project '$project' Does Not Exists\n";
			return ;
		}

		$ret = $this->getModel('mproject')->cleanProject($detail);

		$ret = $this->getModel('mproject')->removeProject($detail);

		if($ret)
			echo "Project '$project' Removed\n";
		else
			echo "Project '$project' Remove Failed\n";

		return ;
	}
}

