package com.example.dto;

import java.util.List;

/*
 * 用于坐标转换的实体
 */
public class ChangeLocation {

	private Integer status;
	private List<Location> result;
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public List<Location> getResult() {
		return result;
	}
	public void setResult(List<Location> result) {
		this.result = result;
	}
	
	
}
