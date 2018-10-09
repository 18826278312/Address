package com.example.service;

import java.util.List;

import com.example.dto.AddressDto;
import com.example.dto.AlibabaPlaceDto;
import com.example.dto.BaiduPlaceDto;
import com.example.dto.ChangeLocation;
import com.example.dto.GeocoderDto;
import com.example.dto.Location;
import com.example.dto.PlaceDto;
import com.example.dto.PlaceResult;
import com.example.dto.TencentPlaceDto;

public interface AddressService {
	
	/**
	 * 调用百度地图api获取地点的完整地址
	 * @param placeResult
	 */
	void getCompleteAddress(PlaceResult placeResult);
	
	/**
	 * 调用百度地图api获得经纬度对应的地址
	 * @param lat
	 * @param lng
	 */
	GeocoderDto getLocation(Double lat,Double lng);
	
	/**
	 * 调用百度地图api获取地址的经纬度信息
	 * @param address
	 * @return
	 */
	AddressDto getLocation(String address)  throws Exception;
	
	/**
	 * 调用百度地图检索地址
	 * @param address
	 * @return
	 * @throws Exception
	 */
	BaiduPlaceDto getPlaceByBaidu(String address) throws Exception;
	
	/**
	 * 调用高德地图检索地址
	 * @param address
	 * @return
	 * @throws Exception
	 */
	AlibabaPlaceDto getPlaceByAlibaba(String address) throws Exception;
	
	/**
	 * 调用腾讯地图检索地址
	 * @param address
	 * @return
	 * @throws Exception
	 */
	TencentPlaceDto getPlaceByTencent(String address) throws Exception;
	
	/**
	 * 将火星坐标转换成百度坐标
	 * @return
	 * @throws Exception
	 */
	ChangeLocation changeLocation(String coords) throws Exception;
	
	/**
	 * 调用百度地图获取周边新信息
	 * @param lng
	 * @param lat
	 * @return
	 * @throws Exception
	 */
	BaiduPlaceDto getBaiduAround(Double lng,Double lat)  throws Exception;
	
	/**
	 * 调用高德地图获取周边新信息
	 * @param lng
	 * @param lat
	 * @return
	 * @throws Exception
	 */
	AlibabaPlaceDto getAlibabaAround(Double lng,Double lat) throws Exception;
	
	/**
	 * 调用腾讯地图获取周边新信息
	 * @param lng
	 * @param lat
	 * @return
	 * @throws Exception
	 */
	TencentPlaceDto getTencentAround(Double lng,Double lat) throws Exception;
	
	/**
	 * 将百度、高德、腾讯的poi点的合并并将前四级补全
	 * @param alibabaPlaceDto
	 * @param baiduPlaceDto
	 * @param tencentPlaceDto
	 * @return
	 * @throws Exception
	 */
	List<PlaceResult> listPlaceResult(AlibabaPlaceDto alibabaPlaceDto,BaiduPlaceDto baiduPlaceDto,TencentPlaceDto tencentPlaceDto) throws Exception;
	
	/**
	 * 将百度的地址四级补全
	 * @param baiduPlaceDto
	 * @return
	 */
	List<PlaceResult> listPlaceResult(BaiduPlaceDto baiduPlaceDto);
}
