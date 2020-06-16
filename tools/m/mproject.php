<?php

class mproject extends model
{
	public function create($customer, $name, $host='',$fileHead='',$interfaceExtra='')
	{
		if(trim($name)=='')
			return false;
		
		$sql = sprintf("select * from t_projects where name = '%s'", $name);

		$ret = $this->_db->fetch_all_assoc($sql);

		if($ret && count($ret)>0)
			return true;

		$sql = sprintf("insert into t_projects(`customer`,`name`,`host`,`fileHead`,`interfaceExtra`,`createTime`) values('%s','%s','%s','%s','%s','%s')",$customer,$name,$host,$fileHead,$interfaceExtra, date('Y-m-d H:i:s'));

		$ret = $this->_db->query($sql);

		return $ret;
	}

	public function update()
	{

	}

	public function init()
	{
		// create table
	}

	public function getProjectList()
	{
		$sql = "select * from t_projects ";

		$ret = $this->_db->fetch_all_assoc($sql);

		return $ret;
	}

	public function getProejctInfo($name)
	{
		$sql = sprintf("select * from t_project where name='%s'", $name);
		$project = $this->_db->fetch_one_assoc($sql);

		print_r($project);

		$sql = sprintf("select * from t_models where projectId='%d'", $project['id']);
		$models = $this->_db->fetch_all_assoc($sql);

		$sql = sprintf("select * from t_apis where projectId='%d'", $project['id']);
		$apis = $this->_db->fetch_all_assoc($sql);

		return ['project'=>$project, 'models'=>$models, 'apis'=>$apis];
	}
}
