<?php 
include_once('commoncontroller.php');

class import extends CommonController
{
	public function __construct()
	{
		$this->inFile = false;
		$this->inInterface = false;
		$this->inModel = false;
		$this->inApi = false;
	}

	public function index()
	{
		echo "倒入功能会覆盖项目现有的所有信息，是否依然继续?(Y/n)";
		$s = fgets(STDIN);
		if(trim($s)!="Y")
			return ;

		$core = Core::getInstance();
		parent::initDb($core->getConfig('database'));

		$project = isset($_SERVER['argv'][0])?$_SERVER['argv'][0]:false;
		$file    = isset($_SERVER['argv'][1])?$_SERVER['argv'][1]:false;

		$filepath = realpath($core->console['pwd'].DIRECTORY_SEPARATOR.$file);

		if(is_file($filepath))
			$arrFile = file($filepath);
		else
		{
			echo 'file not exist',"\n";
			return ;
		}

		$detail = $this->getModel('mproject')->getProjectDetail($project);
		if(!$detail)
		{
			echo "Project '$project' Does Not Exists\n";
			return ;
		}

		$ret = $this->fileImport($detail, $filepath);
		if($ret)
			echo "File Check Succeed\n";
		else
			echo "File Check Error\n";

		return ;
	}

	private function fileImport($project, $filepath)
	{
        $this->getModel('mfile')->setFile($filepath);
		
		$i = 0 ;

		$status = 'in_head'; // in_head,in_body,in_model,in_api
		$fileHead = '';
		$interfaceExtra = '';
		$model = '';
		$extraChanged = false;
		$tmpsec = '';
		$ret = true ;
        while(!$this->getModel('mfile')->isEof())
        {
	        list($section,$stat) = $this->getModel('mfile')->getNextSection();
			
			// Interface 段开始前，都是fileHead
			/*
	        {
					// todo: update project info
					
					$interfaceExtra .= implode('',$section);
					$status = 'in_body';
	        }

	        {
	        		// 存 interfaceExtra
	        		$interfaceExtra .= implode('',$section);
	        }

	        {
	        		// 存 fileHead
	        		$fileHead .= implode('',$section);
	        }

	        {
	        		// 存 model
	        		$this->getModel('mproject')->saveModel($project, $model, $section);
	        }

	        {
	        		// 存 api
	        		$api = $this->getModel('mfile')->parseApi($section);
	        		$this->getModel('mproject')->saveAPI($project, $api, $section);
	        }
	        */

			if($stat[0]=='startLine')
			{
				#$fileHead .= $section;
				if($status=='in_head')
				{
					$fileHead .= implode('',$section);
					$this->getModel('mproject')->update($project, 'fileHead',$fileHead);
					$status = 'in_body';
				} 
				else if($status=='in_body' || $status=='in_model' || $status=='in_api')
				{
					$interfaceExtra .= implode('',$section);
					echo "格式错误:\n",$section[0],"\n\n";
				} 
				else
				{
					echo "未知错误\n";
					#return false;
				}
			}
			else if($stat[0]=='menu')
			{
				// todo: skip this section
			}
			else if($stat[0]=='modelTitleLine')
			{
				if($status=='in_head')
				{
					$fileHead .= implode('',$section);

				}
				else // in_body in_model in_api else...
				{
					$model = $this->getModel('mfile')->parseModel($section);
					$this->getModel('mproject')->saveModel($project, $model);
					$status = 'in_model';
				}
			}
			else if($stat[0]=='apiTitleLine')
			{
				if($status=='in_head')
				{
					$fileHead .= implode('',$section);
				}
				else
				{
					$api = $this->getModel('mfile')->parseAPI($section);
					$api['raw'] = implode('',$section);
					$this->getModel('mproject')->saveAPI($project, $model, $api);
				}
			}
			else if($stat[0]=='noMatch')
			{
				if($status=='in_head')
				{
					$fileHead .= implode('',$section);	
				}
				else
				{
					$interfaceExtra .= implode('',$section);
				}
				
			}
			else
			{
				echo "发生未知错误";
				return ;
			}
	    }

	    $this->getModel('mproject')->update($project, 'interfaceExtra',$interfaceExtra);

	    return $ret;
	}

	private function modelCheck()
	{

	}

	private function parseApi()
	{

	}
}

