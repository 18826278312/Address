package com.example.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.example.dto.AddressDto;
import com.example.dto.AddressLocation;
import com.example.dto.AlibabaPlaceDto;
import com.example.dto.AlibabaPoi;
import com.example.dto.BaiduPlaceDto;
import com.example.dto.ChangeLocation;
import com.example.dto.GeocoderDto;
import com.example.dto.Location;
import com.example.dto.PlaceDto;
import com.example.dto.PlaceResult;
import com.example.dto.TencentData;
import com.example.dto.TencentPlaceDto;
import com.example.service.AddressService;
import com.example.util.HttpUtil;
import com.example.vo.AddressVo;

@Service
public class AddressServiceImpl implements AddressService{

	@Value("${baidu.ak}")
	private String ak;
	@Value("${alibaba.key}")
	private String alibabaKey;
	@Value("${tencent.key}")
	private String tencentKey;
	private String[] pois = {"医院","银行","商场","小区","广场","学校","体育馆","市场"};
	
	@Value("${range}")
	private Integer range;
	
	private static double rad(double d) { 
        return d * Math.PI / 180.0; 
    }
	
	@Override
	public void getCompleteAddress(PlaceResult placeResult) throws Exception{
		String url = "http://api.map.baidu.com/geocoder/v2/";
		String param = "location=" + placeResult.getLocation().getLat() + "," + 
				placeResult.getLocation().getLng() + "&output=json&extensions_town=true&ak=" + ak;
		String json = HttpUtil.sendGet(url, param);
		GeocoderDto geocoderDto = JSONObject.parseObject(json, GeocoderDto.class);
		if (geocoderDto.getStatus()==0) {
			placeResult.setAddress(geocoderDto.getResult().getAddressComponent().getCity() + geocoderDto.getResult().getAddressComponent().getDistrict() + 
					geocoderDto.getResult().getAddressComponent().getTown() + geocoderDto.getResult().getAddressComponent().getStreet() + 
					placeResult.getName());
			placeResult.setProvince(geocoderDto.getResult().getAddressComponent().getProvince());
			placeResult.setCity(geocoderDto.getResult().getAddressComponent().getCity());
			placeResult.setArea(geocoderDto.getResult().getAddressComponent().getDistrict());
			placeResult.setTown(geocoderDto.getResult().getAddressComponent().getTown());
			placeResult.setStreet(geocoderDto.getResult().getAddressComponent().getStreet());
		}
	}

	@Override
	public GeocoderDto getLocation(Double lat, Double lng) throws Exception{
		String url = "http://api.map.baidu.com/geocoder/v2/";
		String param = "location=" + lat + "," + lng + "&output=json&extensions_town=true&ak=" + ak;
		String json = HttpUtil.sendGet(url, param);
		GeocoderDto geocoderDto = JSONObject.parseObject(json, GeocoderDto.class);
		return geocoderDto;
	}

	@Override
	public AlibabaPlaceDto getPlaceByAlibaba(String address) throws Exception {
		String url = "https://restapi.amap.com/v3/place/text";
		String param = "keywords=" + address + "&city=汕头市&offset=10&page=1&key=" + alibabaKey;
		AlibabaPlaceDto placeDto = null;
		placeDto = JSONObject.parseObject(HttpUtil.sendGet(url, param), AlibabaPlaceDto.class);
		return placeDto;
	}

	@Override
	public TencentPlaceDto getPlaceByTencent(String address) throws Exception {
		String url = "https://apis.map.qq.com/ws/place/v1/search";
		String param = "keyword=" + address + "&page_size=10&page_index=1&boundary=region(汕头市)&key=" + tencentKey;
		TencentPlaceDto placeDto = null;
		placeDto = JSONObject.parseObject(HttpUtil.sendGet(url, param), TencentPlaceDto.class);
		return placeDto;
	}

	@Override
	public BaiduPlaceDto getPlaceByBaidu(String address) throws Exception {
		String url = "http://api.map.baidu.com/place/v2/search";
		String param = "query=" + address + "&page_size=20&region=汕头市&output=json&ak=" + ak + "&page_num=0";
		BaiduPlaceDto placeDto = null;
		placeDto = JSONObject.parseObject(HttpUtil.sendGet(url, param), BaiduPlaceDto.class);
		return placeDto;
	}

	@Override
	public ChangeLocation changeLocation(String coords) throws Exception {
		String url = "http://api.map.baidu.com/geoconv/v1/";
		String param = "coords=" + coords + "&from=1&to=5&ak=" + ak;
		ChangeLocation location = JSONObject.parseObject(HttpUtil.sendGet(url, param), ChangeLocation.class);
		return location;
	}

	@Override
	public BaiduPlaceDto getBaiduAround(Double lng, Double lat) throws Exception {
		String url = "http://api.map.baidu.com/place/v2/search";
		String param = "query=" + pois[0] + "&location=" + lat + "," + lng + "&radius=" + range + "&output=json&ak=" + ak + "&page_size=10";
		BaiduPlaceDto placeDto = null;
		placeDto = JSONObject.parseObject(HttpUtil.sendGet(url, param), BaiduPlaceDto.class);
		for(int i=1;i<pois.length;i++){
			param = "query=" + pois[i] + "&location=" + lat + "," + lng + "&radius=" + range + "&output=json&ak=" + ak + "&page_size=10";
			BaiduPlaceDto temp = JSONObject.parseObject(HttpUtil.sendGet(url, param), BaiduPlaceDto.class);
			placeDto.getResults().addAll(temp.getResults());
		}
		return placeDto;
	}

	@Override
	public AlibabaPlaceDto getAlibabaAround(Double lng, Double lat) throws Exception {
		String url = "https://restapi.amap.com/v3/place/around";
		String param = "key=" + alibabaKey + "&location=" + lat + "," + lng + "&offset=10&radius=" + range + "&types=" + pois[0];
		AlibabaPlaceDto placeDto = null;
		placeDto = JSONObject.parseObject(HttpUtil.sendGet(url, param), AlibabaPlaceDto.class);
		for(int i=1;i<pois.length;i++){
			param = "key=" + alibabaKey + "&location=" + lat + "," + lng + "&offset=10&radius=" + range + "&types=" + pois[i];
			AlibabaPlaceDto temp = JSONObject.parseObject(HttpUtil.sendGet(url, param), AlibabaPlaceDto.class);
			placeDto.getPois().addAll(temp.getPois());
		}
		return placeDto;
	}

	@Override
	public TencentPlaceDto getTencentAround(Double lng, Double lat) throws Exception {
		String url = "https://apis.map.qq.com/ws/place/v1/search";
		String param = "keyword=" + pois[0] + "&key=" + tencentKey + "&boundary=nearby(" + lat + "," + lng + "," + range + ",0)&page_size=10";
		TencentPlaceDto placeDto = null;
		placeDto = JSONObject.parseObject(HttpUtil.sendGet(url, param), TencentPlaceDto.class);
		for(int i=1;i<pois.length;i++){
			param = "keyword=" + pois[i] + "&key=" + tencentKey + "&boundary=nearby(" + lat + "," + lng + "," + range + ",0)&page_size=10";
			TencentPlaceDto temp = JSONObject.parseObject(HttpUtil.sendGet(url, param), TencentPlaceDto.class);
			placeDto.getData().addAll(temp.getData());
		}
		return placeDto;
	}

	@Override
	public AddressDto getLocation(String address) throws Exception{
		String url = "http://api.map.baidu.com/geocoder/v2/";
		String param = "address=汕头市" + address + "cit&output=json&ak=" + ak;
		String json = HttpUtil.sendGet(url, param);
		AddressDto addressDto = JSONObject.parseObject(json, AddressDto.class);
		return addressDto;
	}
	
	@Override
	public List<PlaceResult> listPlaceResult(AlibabaPlaceDto alibabaPlaceDto,BaiduPlaceDto baiduPlaceDto,TencentPlaceDto tencentPlaceDto) throws Exception{
		List<PlaceResult> list = new ArrayList<PlaceResult>();
		for(int i=0;i<baiduPlaceDto.getResults().size();i++){
			PlaceResult placeResult = new PlaceResult();
			placeResult.setName(baiduPlaceDto.getResults().get(i).getName());
			AddressLocation addressLocation = new AddressLocation();
			addressLocation.setLat(baiduPlaceDto.getResults().get(i).getLocation().getLat());
			addressLocation.setLng(baiduPlaceDto.getResults().get(i).getLocation().getLng());
			placeResult.setDataSources("百度地图");
			placeResult.setLocation(addressLocation);
			this.getCompleteAddress(placeResult);
			list.add(placeResult);
		}
		String coords = "";
		for(int i=0;i<tencentPlaceDto.getData().size();i++){
			TencentData data = tencentPlaceDto.getData().get(i);
			coords = coords + data.getLocation().getLng() + "," + data.getLocation().getLat();
			if (i<tencentPlaceDto.getData().size()-1) {
				coords = coords  + ";";
			}
		}
		//将火星坐标转化为百度坐标
		ChangeLocation location = this.changeLocation(coords);
		for(int i=0;i<tencentPlaceDto.getData().size();i++){
			PlaceResult placeResult = new PlaceResult();
			placeResult.setName(tencentPlaceDto.getData().get(i).getTitle());
			AddressLocation addressLocation = new AddressLocation();
			addressLocation.setLat(location.getResult().get(i).getY());
			addressLocation.setLng(location.getResult().get(i).getX());
			placeResult.setDataSources("腾讯地图");
			placeResult.setLocation(addressLocation);
			this.getCompleteAddress(placeResult);
			list.add(placeResult);
		}
		coords = "";
		for(int i=0;i<alibabaPlaceDto.getPois().size();i++){
			AlibabaPoi poi = alibabaPlaceDto.getPois().get(i);
			coords = coords + poi.getLocation();
			if (i<alibabaPlaceDto.getPois().size()-1) {
				coords = coords  + ";";
			}
		}
		//将火星地图转化为百度地图
		location = this.changeLocation(coords);
		for(int i=0;i<alibabaPlaceDto.getPois().size();i++){
			PlaceResult placeResult = new PlaceResult();
			placeResult.setName(alibabaPlaceDto.getPois().get(i).getName());
			AddressLocation addressLocation = new AddressLocation();
			addressLocation.setLat(location.getResult().get(i).getY());
			addressLocation.setLng(location.getResult().get(i).getX());
			placeResult.setDataSources("高德地图");
			placeResult.setLocation(addressLocation);
			this.getCompleteAddress(placeResult);
			list.add(placeResult);
		}
		return list;
	}

	@Override
	public List<PlaceResult> listPlaceResult(BaiduPlaceDto baiduPlaceDto) throws Exception{
		List<PlaceResult> list = new ArrayList<PlaceResult>();
		for(int i=0;i<baiduPlaceDto.getResults().size();i++){
			PlaceResult placeResult = new PlaceResult();
			placeResult.setName(baiduPlaceDto.getResults().get(i).getName());
			AddressLocation addressLocation = new AddressLocation();
			addressLocation.setLat(baiduPlaceDto.getResults().get(i).getLocation().getLat());
			addressLocation.setLng(baiduPlaceDto.getResults().get(i).getLocation().getLng());
			placeResult.setDataSources("百度地图");
			placeResult.setLocation(addressLocation);
			this.getCompleteAddress(placeResult);
			list.add(placeResult);
		}
		return list;
	}
}
