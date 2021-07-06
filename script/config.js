(function(){
    var isValidNumber = function(rule, value, callback){
        if (rule == '' || rule <= 0) {
          callback(new Error(' '));
        }else {
          callback();
        }
    };

	// 配置表单的验证规则
    window.Validators = {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
        ],
        date: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        email: [
            { type: 'email', required: true, message: '请选择日期', trigger: 'change' }
        ],
        number: [
            { required: true, message: ' ', trigger: 'blur' },
            { type: 'number', validator: isValidNumber, message: ' ', trigger: 'change' }
        ],
        require: [
            { required: true, message: ' ', trigger: 'blur' },
        ]
    }
})();
