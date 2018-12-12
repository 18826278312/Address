package com.example.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.dto.AddressDto;
import com.example.dto.AddressLocation;
import com.example.dto.BaiduPlaceDto;
import com.example.dto.GeocoderDto;
import com.example.dto.PlaceResult;
import com.example.service.AddressService;

@Controller
@RequestMapping("/AddressController")
public class AddressController {

	@Resource
	private AddressService addressService;
	
	@RequestMapping(value="/address")
	public String address(){
		System.out.println("address");
		return "address";
	}
	
	@RequestMapping(value="getAreaAndStreet")
	@ResponseBody
	public Map<String, Object> getAreaAndStreet(){
		Map<String, Object> map = new HashMap<String, Object>();
		try{
			Map<String, Object> areaMap = addressService.getAreaAndStreet();
			System.out.println(JSONArray.toJSON(areaMap.get("areaList")));
			System.out.println(JSONObject.toJSON(areaMap.get("townMap")));
			map.put("areaList", areaMap.get("areaList"));
			map.put("townMap", areaMap.get("townMap"));
		} catch (Exception e) {
			e.printStackTrace();
			map.put("status", 5);
			map.put("info", "系统异常：" + e.toString());
		}
		return map;
	}
	
	/**
	 * 功能：搜索地址，返回poi列表和地址库列表
	 * @param address
	 * @return
	 */
	@RequestMapping(value="searchAddress")
	@ResponseBody
	public Map<String, Object> searchAddress(String address){
		System.out.println("searchAddress");
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			//参数1:用户输入的地址对象
			PlaceResult currentAddress = new PlaceResult();
			currentAddress.setName(address);
			//获取百度poi点数据
			BaiduPlaceDto baiduPlaceDto = addressService.getPlaceByBaidu(address);
			//TencentPlaceDto tencentPlaceDto = addressService.getPlaceByTencent(address);
			//AlibabaPlaceDto alibabaPlaceDto = addressService.getPlaceByAlibaba(address);
			//将百度poi点的前四级补全
			List<PlaceResult> poiList = addressService.listPlaceResult(baiduPlaceDto);
			System.out.println(poiList.size());
			System.out.println(JSONArray.toJSON(poiList));
			/*
			 * 后台接口调用1：将前面两个变量作为调用的参数（currentAddress、poiList），并返回一个poiList和一个libraryList，将这两个list添加到map中返回到前端
			 */
			List<PlaceResult> list1 = new ArrayList<PlaceResult>();
			List<PlaceResult> list2 = new ArrayList<PlaceResult>();
			for(int i=0;i<poiList.size();i++){
				if (i%2==0) {
					list1.add(poiList.get(i));
				}else {
					list2.add(poiList.get(i));
				}
			}
			
			map.put("status", 0);
			map.put("poi", poiList);
			map.put("library", list2);
		} catch (Exception e) {
			e.printStackTrace();
			map.put("status", 5);
			map.put("info", "系统异常：" + e.toString());
		}
		return map;
	}
	
	/**
	 * 功能1：搜索周边一百米的地址，返回周边100米的poi列表和地址库列表
	 * 功能2：计算出当前选中地址的可信度和相似度
	 * @param name			实体名（即用户输入框中填写的地址名）
	 * @param formerName	poi列表点或者地址库列表返回的地址名
	 * @param lng			
	 * @param lat
	 * @param province
	 * @param city
	 * @param area
	 * @param town
	 * @param street
	 * @return
	 */
	@RequestMapping(value="getAroundAddress")
	@ResponseBody
	public Map<String, Object> getAroundAddress(String name,String formerName,Double lng,Double lat,String province,String city,
			String area,String town,String street){
		System.out.println("getAroundAddress");
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			//当前页面显示的地址
			PlaceResult currentAddress = new PlaceResult();
			currentAddress.setProvince(province);
			currentAddress.setCity(city);
			currentAddress.setArea(area);
			currentAddress.setTown(town);
			currentAddress.setStreet(street);
			currentAddress.setAddress(province + city + area + town + street + name);
			currentAddress.setName(name);
			AddressDto addressDto = addressService.getLocation(name);
			currentAddress.setLocation(addressDto.getResult().getLocation());
			//poi列表点或者地址库列表返回的地址名
			PlaceResult formerAddress = new PlaceResult();
			formerAddress.setProvince(province);
			formerAddress.setCity(city);
			formerAddress.setArea(area);
			formerAddress.setTown(town);
			formerAddress.setStreet(street);
			formerAddress.setAddress(province + city + area + town + street + formerName);
			formerAddress.setName(formerName);
			AddressLocation location = new AddressLocation();
			location.setLat(lat);
			location.setLng(lng);
			formerAddress.setLocation(location);
			/*
			 * 后台接口调用3：前面两个变量(currentAddress、formerAddress)用来计算可信度和相似度，并将可信度追加到map的info变量中返回到页面显示（后面地址录入时也做同样的操作，方法为：importAddress()）
			 */
			
			
			//获取百度周边100米相关poi点数据
			BaiduPlaceDto baiduPlaceDto = addressService.getBaiduAround(lng, lat);
			//将百度poi点前四级补全
			List<PlaceResult> poiList = addressService.listPlaceResult(baiduPlaceDto);
			//将list中与地图定位的地址重复的地址删除
			for (int i=0;i<poiList.size();i++) {
				if (poiList.get(i).getLocation().getLat().equals(lat) && poiList.get(i).getLocation().getLng().equals(lng)) {
					poiList.remove(i);
					break;
				}
			}
			System.out.println(poiList.size());
			System.out.println(JSONArray.toJSON(poiList));
			/*
			 * 后台接口调用2：将前面两个变量作为调用的参数（currentAddress、poiList），并返回周边100米一个poiList和一个libraryList，将这两个list添加到map中返回到前端
			 */
			
			List<PlaceResult> list1 = new ArrayList<PlaceResult>();
			List<PlaceResult> list2 = new ArrayList<PlaceResult>();
			for(int i=0;i<poiList.size();i++){
				if (i%2==0) {
					list1.add(poiList.get(i));
				}else {
					list2.add(poiList.get(i));
				}
			}
			map.put("status", 0);
			map.put("poi", poiList);
			map.put("library", list2);
			map.put("info", "该地址可信度为80%");
		} catch (Exception e) {
			e.printStackTrace();
			map.put("status", 5);
			map.put("info", "系统异常：" + e.toString());
		}
		return map;
	}
	
	/**
	 * 功能呢：根据经纬度逆向查找地址
	 * @param lat
	 * @param lng
	 * @return
	 */
	@RequestMapping(value="getLocation")
	@ResponseBody
	public Map<String, Object> getLocation(Double lat,Double lng){
		System.out.println("getLocation");
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			GeocoderDto geocoderDto = addressService.getLocation(lat, lng);
			if (geocoderDto.getStatus()==0) {
				map.put("status", 0);
				map.put("geocoderDto", geocoderDto);
			}else{
				map.put("status", 2);
				map.put("info", "百度地图api调用异常");
			}
		} catch (Exception e) {
			e.printStackTrace();
			map.put("status", 5);
			map.put("info", "系统异常：" + e.toString());
		}
		return map;
	}
	
	/**
	 * 地址录入
	 * @param name
	 * @param formerName
	 * @param lng
	 * @param lat
	 * @param province
	 * @param city
	 * @param area
	 * @param town
	 * @param street
	 * @param address
	 * @return
	 */
	@RequestMapping(value="importAddress")
	@ResponseBody
	public Map<String, Object> importAddress(String name,String formerName,Double lng,Double lat,String province,String city,
			String area,String town,String street,String address){
		System.out.println(address);
		Map<String, Object> map = new HashMap<String, Object>();
		try {
			//当前页面显示的地址
			PlaceResult currentAddress = new PlaceResult();
			currentAddress.setProvince(province);
			currentAddress.setCity(city);
			currentAddress.setArea(area);
			currentAddress.setTown(town);
			currentAddress.setStreet(street);
			currentAddress.setAddress(province + city + area + town + street + name);
			currentAddress.setName(name);
			AddressDto addressDto = addressService.getLocation(name);
			currentAddress.setLocation(addressDto.getResult().getLocation());
			//poi列表点或者地址库列表返回的地址名
			PlaceResult formerAddress = new PlaceResult();
			formerAddress.setProvince(province);
			formerAddress.setCity(city);
			formerAddress.setArea(area);
			formerAddress.setTown(town);
			formerAddress.setStreet(street);
			formerAddress.setAddress(province + city + area + town + street + formerName);
			formerAddress.setName(formerName);
			AddressLocation location = new AddressLocation();
			location.setLat(lat);
			location.setLng(lng);
			formerAddress.setLocation(location);
			/*
			 * 后台接口调用3：前面两个变量(currentAddress、formerAddress)用来计算可信度和相似度，并将可信度追加到map中的info变量中返回到页面显示
			 */
			//将地址录入
			map.put("info", "录入成功，地址的可信度为100%");
			map.put("status", 0);
		} catch (Exception e) {
			e.printStackTrace();
			map.put("status", 5);
			map.put("info", "系统异常：" + e.toString());
		}
		return map;
	}
}
