package com.biki9933.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.biki9933.entity.Table;
import com.biki9933.mapper.TableMapper;
import com.biki9933.service.ITableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


/**
* 桌号Service实现类
*/
@Service("tableService")
public class ITableServiceImpl extends ServiceImpl<TableMapper,Table> implements ITableService {

   @Autowired
   private TableMapper tableMapper;


   @Override
   public List<Table> list(Map<String, Object> map) {
      return tableMapper.list(map);
   }

   @Override
   public Long getTotal(Map<String, Object> map) {
      return tableMapper.getTotal(map);
   }

   @Override
   public Table getByNumber(String number) {
      return this.getOne(new QueryWrapper<Table>().eq("number", number));
   }
}
