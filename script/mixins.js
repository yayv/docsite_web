(function(){
    window.CRS = window.CRS || {};

    var System = window.Services.System;
    var Cache = window.CRS.cache;

    var enterprise = Cache.get('enterprise') || {};
    var userInfo = Cache.get('userInfo') || {};
    var enterpriseId = enterprise.id;
    var userId = userInfo.id;

    /*
    if(!enterpriseId || !userId){
        Cache.remove('enterprise');
        //Cache.remove('userInfo');
        var link = location.href;
            link = link.split('#')[0];
            link = link.replace("/main.html", "/index.html");
        location.href = link;
    }
    */

    var page = location.href.split('#')[0];
    // console.log(page)

    window.CRS.ListMixin = {
        data: function(){
            return {
                page: page,
                g: {
                    entCarTypes: [],
                    retails: [],
                    employees: [],
                    cars: [],
                    csList: [],
                    channels: [],
                    contracts: []
                },

                keyword: '',
                listType: '',
                timeRange: '',
                pickerOptions: {
                },
                newContract:{
                    model:{
                        customer:{
                            customerName:'',
                            uniqSocialNo:'',
                            bank:'',
                            branch:'',
                            account:'',
                        }
                    }
                }
            }
        },
        mounted: {},
        methods: {},
        watch: {}
    };

    window.CRS.payMixin = {
        template: './mixins/pay.htm',
        data: {},
        watch: {},
        methods: {}
    };

    var Insu = window.Services.Insu;
    window.CRS.insuMixin = {
        data: {},
        methods: {}
    };
})();
