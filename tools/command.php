<?php
error_reporting(E_ALL);

function cmdParse()
{
	$console = [];

	$console['pwd'] = $_SERVER['PWD'];

	$path = pathinfo(realpath($_SERVER['SCRIPT_FILENAME']));

	chdir($path['dirname']);

	$onsole['script'] = $_SERVER['argv'][0];

	$console['controller'] = isset($_SERVER['argv'][1])?$_SERVER['argv'][1]:'defaultcontroller';

	$console['action']     = isset($_SERVER['argv'][2])?$_SERVER['argv'][2]:'index';

	$console['method']     = isset($_SERVER['argv'][3])?$_SERVER['argv'][3]:'do';

	array_shift($_SERVER['argv']);
	array_shift($_SERVER['argv']);
	$_SERVER['argc'] = count($_SERVER['argv']);

	return $console;
}

$cmd = cmdParse();

$DS = PATH_SEPARATOR;
set_include_path(
	"./".$DS.
	 "./libraries/".$DS.
	 "../../tinycake/cake/develop".$DS.
	 "../../tinycake/cake/libraries"
);

include_once('core.php');
include_once('controller.php');
include_once('model.php');

$core = Core::getInstance();
$core->console = $cmd;

// TODO： 1. 自动生成配置文件
$core->loadConfig('console');

$core->pushLog('URL:'.$cmd['controller'].'/'.$cmd['action']."\n");
$core->pushLog('METHOD:'.'console'."\n");

$core->pushLog('start(url):'.microtime()."\n");

// NOTE: 需要先调用Session, 或许 controller 的初始化需要 session变量
// TODO: 可以根据配置文件，确认是否需要session
// TODO： 还是让具体的action自己来决定呢？ 根据配置文件，决定是否需要全局session开启
// 		对于不需要全局session开启的状态，让action自己去决定就好了，谁用谁知道
if(isset($core->_config['manualsession']) && $core->_config['manualsession'])
{
	// 进入系统后再手动启动session，这里就什么都不做了
}
else
{
	$core->loadSession();
}
    
$sitebase = parse_url($core->_config['sitebase']);

list($controller, $action) = $core->ControllerMap(
								$core->console['controller'], 
								$core->console['action']
							);
$c = $core->loadController($controller);

// 构造自定义日志
// TODO: 点入日志的记录路径应该在配置文件中写明
// TODO: 还需要考虑 控制器效率日志和模型的效率日志
if($core->getConfig('clicklog'))
		$core->clickLog($core->getConfig['clicklog'].'/clicklog.'.date('Y-m-d'));
// 结束写入自定义日志
	
$core->pushLog('start_controller('.$controller.'->'.$action.'):'.microtime()."\n");

if(method_exists($c, $action))
{
	$core->RegisterShutdown("$controller"."->"."$action");
	$c->$action();
	$core->UnregisterShutdown("$controller"."->"."$action");
}
else
{
	$core->RegisterShutdown("$controller"."->index");
	$c->index();
	$core->UnregisterShutdown("$controller"."->index");
}

$core->pushLog('end_controller('.$controller.'->'.$action."):".microtime()."\n");
$core->pushLog('end(url):'.microtime()."\n");
$core->writelog();

