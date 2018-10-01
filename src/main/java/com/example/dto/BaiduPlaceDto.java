package com.example.dto;

import java.util.List;

/*
 * 百度地图获取poi点返回数据对应的实体
 */
public class BaiduPlaceDto {
	private Integer status;
	private String message;
	private Integer total;
	private List<BaiduResult> results;
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Integer getTotal() {
		return total;
	}
	public void setTotal(Integer total) {
		this.total = total;
	}
	public List<BaiduResult> getResults() {
		return results;
	}
	public void setResults(List<BaiduResult> results) {
		this.results = results;
	}
	
	
}
