package com.example.dto;

import java.util.List;

/*
 * 腾讯地图获取poi点返回数据对应的实体
 */
public class TencentPlaceDto {

	private Integer status;
	private Integer count;
	private List<TencentData> data;
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}
	public List<TencentData> getData() {
		return data;
	}
	public void setData(List<TencentData> data) {
		this.data = data;
	}
	
}
