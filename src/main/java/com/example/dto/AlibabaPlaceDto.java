package com.example.dto;

import java.util.List;

/**
 * 高德地图获取poi点返回数据对应的实体
 */
public class AlibabaPlaceDto {

	private String status;
	private String info;
	private String count;
	private List<AlibabaPoi> pois;

	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getInfo() {
		return info;
	}
	public void setInfo(String info) {
		this.info = info;
	}
	public String getCount() {
		return count;
	}
	public void setCount(String count) {
		this.count = count;
	}
	public List<AlibabaPoi> getPois() {
		return pois;
	}
	public void setPois(List<AlibabaPoi> pois) {
		this.pois = pois;
	}
	
	
}
