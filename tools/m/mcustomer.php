<?php

class mcustomer extends model
{
	public function getCustomer()
	{
		return ['customerId'=>uniqid(), 'customerName'=>$_SERVER['USERNAME'] ];
	}
}
