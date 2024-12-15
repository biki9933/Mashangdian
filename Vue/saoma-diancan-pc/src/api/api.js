const url = 'http://localhost'  // 修改为正确的基础URL

export const Urls = {
    admin: {
        // 商户接口
        merchantList: `${url}/merchant/list`,
        login: `${url}/admin/login`,
        updatePassword: `${url}/admin/modifyPassword`,
        
        // 订单相关
        orderList: `${url}/admin/order/list`,
        viewOrder: `${url}/admin/orderDetail/list`,
        updateStatus: `${url}/admin/order/updateStatus`,
        receiving: `${url}/admin/order/receiving`,
        checkout: `${url}/admin/order/checkout`,
        
        // 类目管理
        categoryList: `${url}/admin/category/list`,
        categoryListAll: `${url}/admin/category/listAll`,
        categoryAdd: `${url}/admin/category/add`,
        categoryDelete: (id) => `${url}/admin/category/delete/${id}`,
        categoryUpdate: `${url}/admin/category/update`,
        
        // 菜品管理
        dishList: `${url}/admin/dish/list`,
        dishUpload: `${url}/admin/dish/uploadImage`,
        dishSave: `${url}/admin/dish/save`,
        dishDelete: (id) => `${url}/admin/dish/delete?id=${id}`,
        dishUpdateSale: `${url}/admin/dish/updateOnSale`,
        dishSales: `${url}/admin/dish/sales`,
        
        // 单位管理
        unitListAll: `${url}/admin/unit/listAll`,
        unitAdd: `${url}/admin/unit/add`,
        
        // 桌号管理
        tableAdd: `${url}/admin/table/add`,
        tableList: `${url}/admin/table/list`,
        tableDelete: (id) => `${url}/admin/table/delete/${id}`,
        tableUpdate: `${url}/admin/table/update`,
        tableQrcode: `${url}/admin/table/qrcode`,
        
        // 数据分析
        statistics: `${url}/admin/order/salesvolume`,
        dishSales: `${url}/admin/dish/sales`
    }
}