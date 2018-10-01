package com.example.dto;

import java.util.List;

public class PlaceDto {
	
	private Integer status;
	private String message;
	private Integer total;
	private List<PlaceResult> results;
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
	public List<PlaceResult> getResults() {
		return results;
	}
	public void setResults(List<PlaceResult> results) {
		this.results = results;
	}
}
