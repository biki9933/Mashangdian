package com.biki9933.entity;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

/**
 * 自定义返回JSON 数据格式中日期格式化处理
 */
public class CustomDateTimeSerializer extends JsonSerializer<Date> {

	@Override
	public void serialize(Date value, JsonGenerator gen, SerializerProvider serializers)
				throws IOException {
		if (value != null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			sdf.setTimeZone(TimeZone.getTimeZone("Asia/Shanghai"));
			String formattedDate = sdf.format(value);
			System.out.println("Serializing date: " + value + " to: " + formattedDate);
			gen.writeString(formattedDate);
		} else {
			System.out.println("Warning: Attempting to serialize null date");
			gen.writeNull();
		}
	}
}
