package com.example.dto;

public class GeocoderResult {

	private GeocoderAddressComponent addressComponent;
	private String sematic_description;
	
	public GeocoderAddressComponent getAddressComponent() {
		return addressComponent;
	}

	public void setAddressComponent(GeocoderAddressComponent addressComponent) {
		this.addressComponent = addressComponent;
	}

	public String getSematic_description() {
		return sematic_description;
	}

	public void setSematic_description(String sematic_description) {
		this.sematic_description = sematic_description;
	}
	
}
