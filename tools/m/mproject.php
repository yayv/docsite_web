<?php

class mproject extends model
{
	public function getProjectDetail($project)
	{
		$sql = "select * from t_projects where name='$project' ";

		$ret = $this->_db->fetch_one_assoc($sql);
		
		return $ret;
	}

	public function getFirstApi($project)
	{
		$sql = sprintf("select * from t_apis where projectId='%s' order by id asc limit 1", $project['id']);

		$ret = $this->_db->fetch_one_assoc($sql);

		return $ret;
	}

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

	public function update($project, $key, $value)
	{
		$keys = ['customer','host','fileHead','interfaceExtra'];
		if(!in_array($key, $keys))
		{
			return false;
		}

		$data = [$key=>$value];

        return $this->_db->update('t_projects', $data, sprintf(" name='%s' ", $project['name']));
	}

	public function saveModel($project, $model)
	{
		#print_r([$project,$model]);
		$date = trim($model['lastModify'])==''?date('Y-m-d H:i:s'):date('Y-m-d H:i:s', strtotime($model['lastModify']));

		$sql = sprintf("insert into t_models(`customer`,`projectId`,`code`,`name`,`extraInfo`,`lastModify`) 
			values (
				'%s','%s','%s','%s','%s','%s'
			)",
				$project['customer'],
				$project['id'],
				$model['code'],
				$model['name'],
				$model['extraInfo'],
				$date		
		);

		$ret = $this->_db->query($sql);

		return $ret;
	}

	public function saveAPI($project, $model, $api)
	{
		$date = trim($api['lastModify'])==''?date('Y-m-d H:i:s'):date('Y-m-d H:i:s', strtotime($api['lastModify']));

		$sql = sprintf("insert into t_apis(
				`customer`,`projectId`,`model`,`code`,`name`,`raw`,`lastModify`
			) values(
				'%s','%s','%s','%s','%s','%s','%s'
			)",
				$project['customer'],
				$project['id'],
				$model['code'],
				$api['code'],
				$api['name'],
				$api['raw'],
				date('Y-m-d H:i:s')
			);

		$ret = $this->_db->query($sql);
#echo $sql,"\n";
		return $ret;
	}

	public function cleanProject($project)
	{
		$projectId = $project['id'];

		// delete models & apis
		$sql = "delete from t_models where projectId='$projectId' ";
		$this->_db->query($sql);

		$sql = "delete from t_apis where projectId='$projectId'";
		$this->_db->query($sql);

		return ;
	}

	public function removeProject($project)
	{

		$sql = sprintf("delete from t_projects where name='%s'", $project['name']);

		$ret = $this->_db->query($sql);

		return $ret;
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
		$sql = sprintf("select * from t_projects where name='%s'", $name);
		$project = $this->_db->fetch_one_assoc($sql);

		$sql = sprintf("select * from t_models where projectId='%d'", $project['id']);
		$models = $this->_db->fetch_all_assoc($sql);

		$sql = sprintf("select * from t_apis where projectId='%d'", $project['id']);
		$apis = $this->_db->fetch_all_assoc($sql);

		return ['project'=>$project, 'models'=>$models, 'apis'=>$apis];
	}
}
