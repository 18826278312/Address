package com.example.dto;

public class PlaceResult {

	private String name;		//实体名
	private String address;		//完整地址(不包含省)
	private String province;	//省
	private String city;		//市
	private String area;		//区
	private String town;		//街道
	private String street;		//道路（有可能为空）
	private Double similar;		//相似度（范围：0~1，越接近1相似度越高）
	private Double reliable;	//可信度（范围：0~1，越接近1可信度越高）
	private String dataSources;	//数据来源：百度地图、高德地图、腾讯地图
	private AddressLocation location;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getProvince() {
		return province;
	}
	public void setProvince(String province) {
		this.province = province;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getArea() {
		return area;
	}
	public void setArea(String area) {
		this.area = area;
	}
	public AddressLocation getLocation() {
		return location;
	}
	public void setLocation(AddressLocation location) {
		this.location = location;
	}
	public String getTown() {
		return town;
	}
	public void setTown(String town) {
		this.town = town;
	}
	public String getStreet() {
		return street;
	}
	public void setStreet(String street) {
		this.street = street;
	}
	public Double getSimilar() {
		return similar;
	}
	public void setSimilar(Double similar) {
		this.similar = similar;
	}
	public Double getReliable() {
		return reliable;
	}
	public void setReliable(Double reliable) {
		this.reliable = reliable;
	}
	public String getDataSources() {
		return dataSources;
	}
	public void setDataSources(String dataSources) {
		this.dataSources = dataSources;
	}
}
