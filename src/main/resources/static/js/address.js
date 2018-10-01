var poiList = [];
var libraryList = [];
var aroundPoiList = [];
var aroundLibraryList = [];
var formerAddress;
var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});// 左上角，添加比例尺
var top_left_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT});  //左上角，添加默认缩放平移控件
var map = new BMap.Map("container",{minZoom:11,maxZoom:19});          // 创建地图实例  
map.centerAndZoom("汕头",11);  
map.addControl(top_left_control);        
map.addControl(top_left_navigation);
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
var bdary = new BMap.Boundary();
bdary.get("汕头市", function(rs){       //获取行政区域
	//map.clearOverlays();        //清除地图覆盖物       
	var count = rs.boundaries.length; //行政区域的点有多少个
	if (count === 0) {
		alert('未能获取当前输入行政区域');
		return ;
	}
  	var pointArray = [];
	for (var i = 0; i < count; i++) {
		var ply = new BMap.Polygon(rs.boundaries[i], { strokeColor: "#ff0000",fillColor:""}); //建立多边形覆盖物
		ply.disableMassClear();
		map.addOverlay(ply);  //添加覆盖物
		pointArray = pointArray.concat(ply.getPath());
	}    
	map.setViewport(pointArray);    //调整视野  
});

//查找地址
$("#search").click(function(){
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
        if(allOverlay[i] == "[object Marker]" ){
        	 map.removeOverlay(allOverlay[i]);
        }
    }
	setEmpty();
	$("#lat").val("");
	$("#lng").val("");
	var address = $("#address").val();
	if(address!=null && address!=""){
		var xval=getBusyOverlay('viewport',{color:'gray', opacity:0.75, text:'viewport: loading...', style:'text-shadow: 0 0 3px black;font-weight:bold;font-size:16px;color:white'},{color:'#ff0', size:256, type:'o'});
		xval.settext("数据获取中，请稍后......");
		$.post("/AddressController/searchAddress",{
			"address":address
		},function(data){
			xval.remove();
			if(data.status==0){
				poiList = data.poi;
				libraryList = data.library;
				//添加poi列表
				$("#poi").show();
				$("#poiPlace").empty();
				var points = [];
				var length = poiList.length>=5 ? 5 : poiList.length;
				for(var i=0;i<length;i++){
					var a = i+1;
					var li = "<li><a onclick='clickAddress(" + JSON.stringify(poiList[i]) + ")' style='color:#4CAF50' href='#'>" + a + "、" + poiList[i].address + "</a></li>";
					$("#poiPlace").append(li);
					var point = new BMap.Point(poiList[i].location.lng,poiList[i].location.lat);
					var marker = new BMap.Marker(point);  // 创建标注
					marker.disableMassClear();
					if(i+1>=10){
						var label = new BMap.Label(i+1, {
			                offset : new BMap.Size(1, 4)
			            }); 
					}else{
						var label = new BMap.Label(i+1, {
			                offset : new BMap.Size(5, 4)
			            }); 
					}
					label.setStyle({
			           background:'none',color:'#fff',border:'none'//只要对label样式进行设置就可达到在标注图标上显示数字的效果
			        });
					marker.setLabel(label);//显示地理名称 a
			       	map.addOverlay(marker);              // 将标注添加到地图中
			       	points.push(poiList[i].location);
				}
				//$("#poi").append("<div style='margin-left:150px;float:left;'><a><上一页</a></div>");
				//$("#poi").append("<div style='margin-left:20px;float:left;'><a>下一页></a></div>");
				var view = map.getViewport(eval(points));
				var mapZoom = view.zoom; 
				var centerPoint = view.center; 
				map.centerAndZoom(centerPoint,mapZoom);
				
				//添加地址库列表
				$("#library").show();
				$("#libraryPlace").empty();
				var length = libraryList.length>=5 ? 5 : libraryList.length;
				for(var i=0;i<length;i++){
					var a = i + 1;
					var li = "<li><a onclick='clickAddress(" + JSON.stringify(libraryList[i]) + ")' style='color:#4CAF50' href='#'>" + a + "、" + libraryList[i].address + "</a></li>";
					$("#libraryPlace").append(li);
					var point = new BMap.Point(libraryList[i].location.lng,libraryList[i].location.lat);
					var marker = new BMap.Marker(point);  // 创建标注
					marker.disableMassClear();
					if(i+1>=10){
						var label = new BMap.Label(i+1, {
			                offset : new BMap.Size(1, 4)
			            }); 
					}else{
						var label = new BMap.Label(i+1, {
			                offset : new BMap.Size(5, 4)
			            }); 
					}
					label.setStyle({
			           background:'none',color:'#fff',border:'none'//只要对label样式进行设置就可达到在标注图标上显示数字的效果
			        });
					marker.setLabel(label);//显示地理名称 a
			       	map.addOverlay(marker);              // 将标注添加到地图中
			       	points.push(libraryList[i].location);
				}
				//$("#library").append("<div style='margin-left:150px;float:left;'><a><上一页</a></div>");
				//$("#library").append("<div style='margin-left:20px;float:left;'><a>下一页></a></div>");
			}
		},"json");
	}
})

//点击地址列表选择地址
function clickAddress(place){
	console.log(place);
	$("#street").val(place.street);
	$("#lat").val(place.location.lat);
	$("#lng").val(place.location.lng);
	$("#province").empty();
	$("#province").append('<option value="' + place.province + '">' + place.province + '</option>');
	$("#city").empty();
	$("#city").append('<option value="' + place.city + '">' + place.city + '</option>');
	$("#area").empty();
	$("#area").append('<option value="' + place.area + '">' + place.area + '</option>');
	$("#town").empty();
	$("#town").append('<option value="' + place.town + '">' + place.town + '</option>');
	$("#confidence").html("");
	formerAddress = place.name;
	var address = $("#address").val();
	getAroundAddress(place.location.lat,place.location.lng);
}

//点击逆向查找
$("#reverseSearch").click(function(){
	setEmpty();
	var lng = $("#lng").val();
	var lat = $("#lat").val();
	getLocation(lat,lng)
})

//单击获取点击的经纬度
map.addEventListener("click",function(e){
	setEmpty();
    $("#lng").val(e.point.lng);
	$("#lat").val(e.point.lat);
    getLocation(e.point.lat,e.point.lng);
});

//清空相关信息
function setEmpty(){
	$("#confidence").html("");
	$("#street").val("");
	$("#province").empty();
	$("#province").append('<option value="">-省-</option>');
	$("#city").empty();
	$("#city").append('<option value="">-市-</option>');
	$("#area").empty();
	$("#area").append('<option value="">-区-</option>');
	$("#town").empty();
	$("#town").append('<option value="">-街道-</option>');
}

//点击清空按钮
$("#empty").click(function(){
	setEmpty();
	$("#address").val("");
	$("#lat").val("");
	$("#lng").val("");
})

$("#copy").click(function(){
	var province = $("#province").val();
	var city = $("#city").val();
	var area = $("#area").val();
	var town = $("#town").val();
	var street = $("#street").val();
	var address = $("#address").val();
	var seven = $("#seven").val();
	var copy = province + city + area + town + street + address + seven;
	var oInput = document.createElement('input');
	oInput.value = copy;
	document.body.appendChild(oInput);
	oInput.select(); // 选择对象
	document.execCommand("Copy"); // 执行浏览器复制命令
	oInput.className = 'oInput';
	oInput.style.display='none';
	alert('复制成功');
})

//根据经纬度逆向查找对应的地址信息，并回填
function getLocation(lat,lng){
	$.post("/AddressController/getLocation",{
		"lng":lng,
		"lat":lat
	},function(data){
		$("#province").empty();
		$("#province").append('<option value="' + data.geocoderDto.result.addressComponent.province + '">' + data.geocoderDto.result.addressComponent.province + '</option>');
		$("#city").empty();
		$("#city").append('<option value="' + data.geocoderDto.result.addressComponent.city + '">' + data.geocoderDto.result.addressComponent.city + '</option>');
		$("#area").empty();
		$("#area").append('<option value="' + data.geocoderDto.result.addressComponent.district + '">' + data.geocoderDto.result.addressComponent.district + '</option>');
		$("#town").empty();
		$("#town").append('<option value="' + data.geocoderDto.result.addressComponent.town + '">' + data.geocoderDto.result.addressComponent.town + '</option>');
		$("#street").val(data.geocoderDto.result.addressComponent.street);
		if($("#address").val()==""){
			$("#address").val(data.geocoderDto.result.sematic_description);
		}
		formerAddress = data.geocoderDto.result.sematic_description;
		//回填成功时候调用
		getAroundAddress(lat,lng);
	},"json");
}

//获取当前选中地址周边100米的标志性建筑物；计算当前选中地址的可信度
function getAroundAddress(lat,lng){
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
        if(allOverlay[i] == "[object Marker]" ){
        	 map.removeOverlay(allOverlay[i]);
        }
    }
	var points = [];
	var point = new BMap.Point(lng,lat);
    var marker = new BMap.Marker(point);  // 创建标注
	marker.disableMassClear();
	map.addOverlay(marker);// 将标注添加到地图中
	var json ='{"lat":' + lat + ',"lng":' + lng+ '}';
	points.push(JSON.parse(json));
	var province = $("#province").val();
	var city = $("#city").val();
	var area = $("#area").val();
	var town = $("#town").val();
	var street = $("#street").val();
	var address = $("#address").val();
	var lng = $("#lng").val();
	var lat = $("#lat").val();
	var xval=getBusyOverlay('viewport',{color:'gray', opacity:0.75, text:'viewport: loading...', style:'text-shadow: 0 0 3px black;font-weight:bold;font-size:16px;color:white'},{color:'#ff0', size:256, type:'o'});
	xval.settext("数据获取中，请稍后......");
	$.post("/AddressController/getAroundAddress",{
		"lng":lng,
		"lat":lat,
		"name":address,
		"formerName":formerAddress,
		"province":province,
		"city":city,
		"area":area,
		"town":town,
		"street":street
	},function(data){
		xval.remove();
		if(data.status==0){
			$("#confidence").html(data.info);
			aroundPoiList = data.poi;
			aroundLibraryList = data.library;
			//添加arountPoi列表
			$("#aroundPoi").show();
			$("#aroundPoiPlace").empty();
			var length = aroundPoiList.length>=5 ? 5 : aroundPoiList.length;
			for(var i=0;i<length;i++){
				var a = i+1;
				var li = "<li style='color:#4CAF50'>" + a + "、" + aroundPoiList[i].address + "</li>";
				$("#aroundPoiPlace").append(li);
				var point = new BMap.Point(aroundPoiList[i].location.lng,aroundPoiList[i].location.lat);
				var marker = new BMap.Marker(point);  // 创建标注
				marker.disableMassClear();
				if(i+1>=10){
					var label = new BMap.Label(i+1, {
		                offset : new BMap.Size(1, 4)
		            }); 
				}else{
					var label = new BMap.Label(i+1, {
		                offset : new BMap.Size(5, 4)
		            }); 
				}
				label.setStyle({
		           background:'none',color:'#fff',border:'none'//只要对label样式进行设置就可达到在标注图标上显示数字的效果
		        });
				marker.setLabel(label);//显示地理名称 a
		       	map.addOverlay(marker);              // 将标注添加到地图中
		       	points.push(aroundPoiList[i].location);
			}
			//$("#aroundPoi").append("<div style='margin-left:150px;float:left;'><a><上一页</a></div>");
			//$("#aroundPoi").append("<div style='margin-left:20px;float:left;'><a>下一页></a></div>");
			var view = map.getViewport(eval(points));
			var mapZoom = view.zoom; 
			var centerPoint = view.center; 
			map.centerAndZoom(centerPoint,mapZoom);
			
			//添加地址库列表
			$("#aroundLibrary").show();
			$("#aroundLibraryPlace").empty();
			var length = aroundLibraryList.length>=5 ? 5 : aroundLibraryList.length;
			for(var i=0;i<length;i++){
				var a = i+1;
				var li = "<li style='color:#4CAF50'>" + a + "、" + aroundLibraryList[i].address + "</li>";
				$("#aroundLibraryPlace").append(li);
				var point = new BMap.Point(aroundLibraryList[i].location.lng,aroundLibraryList[i].location.lat);
				var marker = new BMap.Marker(point);  // 创建标注
				marker.disableMassClear();
				if(i+1>=10){
					var label = new BMap.Label(i+1, {
		                offset : new BMap.Size(1, 4)
		            }); 
				}else{
					var label = new BMap.Label(i+1, {
		                offset : new BMap.Size(5, 4)
		            }); 
				}
				label.setStyle({
		           background:'none',color:'#fff',border:'none'//只要对label样式进行设置就可达到在标注图标上显示数字的效果
		        });
				marker.setLabel(label);//显示地理名称 a
		       	map.addOverlay(marker);              // 将标注添加到地图中
		       	points.push(aroundLibraryList[i].location);
			}
			//$("#aroundLibrary").append("<div style='margin-left:150px;float:left;'><a href='#'><上一页</a></div>");
			//$("#aroundLibrary").append("<div style='margin-left:20px;float:left;'><a>下一页></a></div>");
		}
	},"json")
}

function importAddress(type){
	var province = $("#province").val();
	var city = $("#city").val();
	var area = $("#area").val();
	var town = $("#town").val();
	var street = $("#street").val();
	var address = $("#address").val();
	var lng = $("#lng").val();
	var lat = $("#lat").val();
	console.log(address);
	console.log(formerAddress);
	if(province=="" || city=="" || area=="" || address=="" || lng=="" ||lat==""){
		$("#confidence").html("信息不完整，省、市、区、地址实体、经纬度不能为空");
	}else{
		$.post("/AddressController/importAddress",{
			"lng":lng,
			"lat":lat,
			"name":address,
			"formerName":formerAddress,
			"province":province,
			"city":city,
			"area":area,
			"town":town,
			"street":street
		},function(data){
			$("#confidence").html(data.info);
		},"json")
	}
}

function changePage(page,num,type){
	var list = [];
	if(num==1){
		list = poiList;
	}else if(num==2){
		list = libraryList;
	}else if(num==3){
		list = aroundPoiList;
	}else if(num==4){
		list = aroundLibraryList;
	}
}

