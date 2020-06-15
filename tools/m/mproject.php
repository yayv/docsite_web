<?php

class mproject extends model
{
	public function create($name, $host='',$fileHead='',$interfaceExtra='')
	{
		$sql = "insert into ";

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
}
