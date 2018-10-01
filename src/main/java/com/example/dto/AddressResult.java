package com.example.dto;

public class AddressResult {

	private Integer confidence;
	private String level;
	private Integer precise;
	private AddressLocation location;
	public AddressLocation getLocation() {
		return location;
	}
	public void setLocation(AddressLocation location) {
		this.location = location;
	}
	public Integer getConfidence() {
		return confidence;
	}
	public void setConfidence(Integer confidence) {
		this.confidence = confidence;
	}
	public String getLevel() {
		return level;
	}
	public void setLevel(String level) {
		this.level = level;
	}
	public Integer getPrecise() {
		return precise;
	}
	public void setPrecise(Integer precise) {
		this.precise = precise;
	}
	
	
}
