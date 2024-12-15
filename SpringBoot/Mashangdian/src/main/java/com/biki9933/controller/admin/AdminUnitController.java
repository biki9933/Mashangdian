package com.biki9933.controller.admin;

import com.biki9933.entity.Unit;
import com.biki9933.entity.R;
import com.biki9933.service.IUnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/admin/unit")
public class AdminUnitController {

    @Autowired
    private IUnitService unitService;

    /**
     * 查询所有菜品单位
     * @return
     */
    @RequestMapping("/listAll")
    public R listAll(){
        List<Unit> list = unitService.list();
        Map<String,Object> resultMap=new HashMap<>();
        resultMap.put("unitList",list);
        return R.ok(resultMap);
    }

    /**
     * 添加
     * @param unit
     * @return
     */
    @PostMapping("/add")
    public R add(@RequestBody Unit unit){
        unit.setValue(unit.getLabel());
        unitService.save(unit);
        return R.ok();
    }


}
