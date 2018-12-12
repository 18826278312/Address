var poiList = [];
var libraryList = [];
var aroundPoiList = [];
var aroundLibraryList = [];
var poiPage = 0;
var libraryPage = 0;
var aroundPoiPage = 0;
var aroundLibraryPage = 0;
var clickLat = 0;
var clickLnt = 0;
var areaList = [];
var townMap = {};
var reliability = '';
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

$.post("./getAreaAndStreet.json",function(data){
	areaList = data.areaList,
	townMap = data.townMap
	for(var i=0;i<areaList.length;i++){
		$("#area").append('<option value="'+ areaList[i] +'">'+ areaList[i] +'</option>');
	}	
},"json")

//查找地址
$("#search").click(function(){
	$("#aroundPoi").hide();
	$("#aroundLibrary").hide();
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
        if(allOverlay[i] == "[object Marker]" ){
        	 map.removeOverlay(allOverlay[i]);
        }
    }
	$("#lat").val("");
	$("#lng").val("");
	$("#confidence").html("");
	var area = $("#area").val();
	var address = $("#address").val();
	if(address==""){
		$("#confidence").html("请填写地址实体");
//	}else if(area==""){
//		$("#confidence").html("请选择区");
	}else{
		var xval=getBusyOverlay('viewport',{color:'gray', opacity:0.75, text:'viewport: loading...', style:'text-shadow: 0 0 3px black;font-weight:bold;font-size:16px;color:white'},{color:'#ff0', size:256, type:'o'});
		xval.settext("数据获取中，请稍后......");
		$.post("./searchAddress.json",{
			"address":area+address  //只采用实体信息进行地图信息
		},function(data){
			xval.remove();
			if(data.status==0){
				poiList = data.poi;
				libraryList = data.library;
				//添加poi列表
				$("#poi").show();
				$("#poiPlace").empty();
				$("#poi #poiPage").empty();
				var points = [];
				var length = poiList.length>5 ? 5 : poiList.length;
				for(var i=0;i<length;i++){
					var a = i+1;
					var li = "<li><a onclick='clickAddress(" + JSON.stringify(poiList[i]) + ")' style='color:#2B80FA' href='#'>" + a + "、" + poiList[i].address + "</a></li>";
					$("#poiPlace").append(li);
					var myIcon = new BMap.Icon("../image/blue_30.png", {
					    offset: new BMap.Size(10, 25)
					});
					var point = new BMap.Point(poiList[i].location.lng,poiList[i].location.lat);
					var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
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
				poiPage = 1;
				if(poiList.length>5){
					$("#poi #poiPage").append("<div style='float:right;'><a style='color:#2B80FA' href='#' onclick='changePage(2,1)'>下一页》</a></div>");
				}
				
				//添加地址库列表
				$("#library").show();
				$("#libraryPlace").empty();
				$("#library #libraryPage").empty();
				var length = libraryList.length>5 ? 5 : libraryList.length;
				for(var i=0;i<length;i++){
					var a = i + 1;
					var li = "<li><a onclick='clickAddress(" + JSON.stringify(libraryList[i]) + ")' style='color:#ED4634' href='#'>" + a + "、" + libraryList[i].address + "</a></li>";
					$("#libraryPlace").append(li);
					var myIcon = new BMap.Icon("../image/red_30.png", {
					    offset: new BMap.Size(10, 25)
					});
					var point = new BMap.Point(libraryList[i].location.lng,libraryList[i].location.lat);
					var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
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
				libraryPage = 1;
				if(libraryList.length>5){
					$("#library #libraryPage").append("<div style='float:right;'><a style='color:#ED4634' href='#' onclick='changePage(2,2)'>下一页》</a></div>");
				}
				
				var view = map.getViewport(eval(points));
				var mapZoom = view.zoom; 
				var centerPoint = view.center; 
				map.centerAndZoom(centerPoint,mapZoom);
			}else{
				$("#confidence").html(data.info);
			}
		},"json");
	}
})

//点击地址列表选择地址
function clickAddress(place){
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
	changeSelect(place.area,place.town);
	formerAddress = place.name;
	var address = $("#address").val();
	getAroundAddress(place.location.lat,place.location.lng);
}

//点击逆向查找
$("#reverseSearch").click(function(){
	var lng = $("#lng").val();
	var lat = $("#lat").val();
	$("#confidence").html("");
	if(lng!="" && lat!=""){
		getLocation(lat,lng)
	}else{
		$("#confidence").html("请输入经纬度");
	}
})

//单击获取点击的经纬度
map.addEventListener("click",function(e){
    $("#lng").val(e.point.lng);
	$("#lat").val(e.point.lat);
    getLocation(e.point.lat,e.point.lng);
});

//清空相关信息
function setEmpty(){
	$("#confidence").html("");
	$("#street").val("");
	$("#province").empty();
	$("#province").append('<option value="广东省">广东省</option>');
	$("#city").empty();
	$("#city").append('<option value="汕头市">汕头市</option>');
	$("#area").empty();
	$("#area").append('<option value="">-区-</option>');
	$("#town").empty();
	$("#town").append('<option value="">-街道-</option>');
}

//点击清空按钮
$("#empty").click(function(){
	setEmpty();
	$("#address").val("");
	$("#seven").val("");
	$("#lat").val("");
	$("#lng").val("");
	$("#poi").hide();
	$("#library").hide();
	$("#aroundPoi").hide();
	$("#aroundLibrary").hide();
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
        if(allOverlay[i] == "[object Marker]" ){
        	 map.removeOverlay(allOverlay[i]);
        }
    }
	for(var i=0;i<areaList.length;i++){
		$("#area").append('<option value="'+ areaList[i] +'">'+ areaList[i] +'</option>');
	}	
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
	if(copy!=""){
		var oInput = document.createElement('input');
		oInput.value = copy;
		document.body.appendChild(oInput);
		oInput.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
		oInput.className = 'oInput';
		oInput.style.display='none';
		alert('复制成功');
	}else{
		alert('地址为空，复制失败');
	}
})

//根据经纬度逆向查找对应的地址信息，并回填
function getLocation(lat,lng){
	$.post("./getLocation.json",{
		"lng":lng,
		"lat":lat
	},function(data){
		if(data.status==0){
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
			changeSelect(data.geocoderDto.result.addressComponent.district,data.geocoderDto.result.addressComponent.town);
			//回填成功时候调用
			getAroundAddress(lat,lng);
		}else{
			$("#confidence").html(data.info);
		}
	},"json");
}

//获取当前选中地址周边100米的标志性建筑物；计算当前选中地址的可信度
function getAroundAddress(lat,lng){
	$("#poiPlace li a").css("color","#4CAF50");
	$("#libraryPlace li a").css("color","#4CAF50");
	$("#poi #poiPage div a").css("color","#4CAF50");
	$("#library #libraryPage div a").css("color","#4CAF50");
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
        if(allOverlay[i] == "[object Marker]" ){
        	 map.removeOverlay(allOverlay[i]);
        }
    }
	clickLat = lat;
	clickLng = lng;
	var points = [];
	//当前选中的标注变大
	var myIcon = new BMap.Icon("../image/red_50.png", {
	    offset: new BMap.Size(10, 25)
	});
	var point = new BMap.Point(lng,lat);
    var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
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
	$.post("./getAroundAddress.json",{
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
			reliability=data.info;
			aroundPoiList = data.poi;
			aroundLibraryList = data.library;
			//添加arountPoi列表
			$("#aroundPoi").show();
			$("#aroundPoiPlace").empty();
			$("#aroundPoi #aroundPoiPage").empty();
			var length = aroundPoiList.length>5 ? 5 : aroundPoiList.length;
			for(var i=0;i<length;i++){
				var a = i+1;
				var li = "<li style='color:#2B80FA'>" + a + "、" + aroundPoiList[i].address + "</li>";
				$("#aroundPoiPlace").append(li);
				var myIcon = new BMap.Icon("../image/blue_30.png", {
				    offset: new BMap.Size(10, 25)
				});
				var point = new BMap.Point(aroundPoiList[i].location.lng,aroundPoiList[i].location.lat);
				var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
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
			aroundPoiPage = 1;
			if(aroundPoiList.length>5){
				$("#aroundPoi #aroundPoiPage").append("<div style='float:right;'><a style='color:#2B80FA' href='#' onclick='changeAroundPage(2,1)'>下一页》</a></div>");
			}
			
			//添加地址库列表
			$("#aroundLibrary").show();
			$("#aroundLibraryPlace").empty();
			$("#aroundLibrary #aroundLibraryPage").empty();
			var length = aroundLibraryList.length>5 ? 5 : aroundLibraryList.length;
			for(var i=0;i<length;i++){
				var a = i+1;
				var li = "<li style='color:#ED4634'>" + a + "、" + aroundLibraryList[i].address + "</li>";
				$("#aroundLibraryPlace").append(li);
				var myIcon = new BMap.Icon("../image/red_30.png", {
				    offset: new BMap.Size(10, 25)
				});
				var point = new BMap.Point(aroundLibraryList[i].location.lng,aroundLibraryList[i].location.lat);
				var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
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
			aroundLibraryPage = 1;
			if(aroundLibraryList.length>5){
				$("#aroundLibrary #aroundLibraryPage").append("<div style='float:right;'><a style='color:#ED4634' href='#' onclick='changeAroundPage(2,2)'>下一页》</a></div>");
			}
			
			var view = map.getViewport(eval(points));
			var mapZoom = view.zoom; 
			var centerPoint = view.center; 
			map.centerAndZoom(centerPoint,mapZoom);
		}else{
			$("#confidence").html(data.info);
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
	var seven = $("#seven").val();
	var lng = $("#lng").val();
	var lat = $("#lat").val();
	var completeAddress = province+","+city+","+area+","+town+","+street+","+address+","+seven;
	var similarAddress= province+","+city+","+area+","+town+","+street+","+formerAddress;
//	console.log(address);
//	console.log(formerAddress);
	if(province=="" || city=="" || area=="" || town=="" || street=="" || address=="" || lng=="" ||lat==""){
		$("#confidence").html("地址信息不完整，录入失败");
	}else{
		if(window.confirm('检索地址：'+completeAddress+'\n对应最相似地址：'+similarAddress+' \n'+reliability+'\n你确定要录入检索地址信息吗？\n')){ 
			$.post("./importAddress.json",{
				"lng":lng,
				"lat":lat,
				"name":address,
				"formerName":formerAddress,
				"province":province,
				"city":city,
				"area":area,
				"town":town,
				"street":street,
				"address" : completeAddress,
				"reliability": reliability
			},function(data){
				$("#confidence").html(data.info);
		
			},"json")
	
			return true; 
		}else{ 
			return false; 
		} 
	}
}

function changePage(page,type){
	$("#aroundPoi").hide();
	$("#aroundLibrary").hide();
	$("#poi #poiPage div a").css("color","#2B80FA");
	$("#library #libraryPage div a").css("color","#ED4634");
	if(type == 1){
		poiPage = page;
		$("#poi #poiPage").empty();
		var previous = page-1;
		var next = page+1;
		if(page==1){
			$("#poi #poiPage").append("<div style='float:right;'><a style='color:#2B80FA' href='#' onclick='changePage(" + next + ",1)'>下一页》</a></div>");
		}else if(poiList.length > page*5){
			$("#poi #poiPage").append("<div style='float:right;'><a style='color:#2B80FA' href='#' onclick='changePage(" + next + ",1)'>下一页》</a></div>");
			$("#poi #poiPage").append("<div style='float:right;margin-right:20px;'><a style='color:#2B80FA' href='#' onclick='changePage(" + previous + ",1)'>《上一页</a></div>");
		}else{
			$("#poi #poiPage").append("<div style='float:right;'><a style='color:#2B80FA' href='#' onclick='changePage(" + previous + ",1)'>《上一页</a></div>");
		}
	}else if(type == 2){
		libraryPage = page;
		$("#library #libraryPage").empty();
		var previous = page-1;
		var next = page+1;
		if(page==1){
			$("#library #libraryPage").append("<div style='float:right;'><a style='color:#ED4634' href='#' onclick='changePage(" + next + ",2)'>下一页》</a></div>");
		}else if(libraryList.length > page*5){
			$("#library #libraryPage").append("<div style='float:right;'><a style='color:#ED4634' href='#' onclick='changePage(" + next + ",2)'>下一页》</a></div>");
			$("#library #libraryPage").append("<div style='float:right;margin-right:20px;'><a style='color:#ED4634' href='#' onclick='changePage(" + previous + ",2)'>《上一页</a></div>");
		}else{
			$("#library #libraryPage").append("<div style='float:right;'><a style='color:#ED4634' href='#' onclick='changePage(" + previous + ",2)'>《上一页</a></div>");
		}
	}
	intoPage();
}

function intoPage(){
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
        if(allOverlay[i] == "[object Marker]" ){
        	 map.removeOverlay(allOverlay[i]);
        }
    }
	var length = poiList.length>=poiPage*5 ? poiPage*5 : poiList.length;
	var points = [];
	$("#poiPlace").empty();
	for(var i=poiPage*5-5;i<length;i++){
		var a = i+1;
		var li = "<li><a onclick='clickAddress(" + JSON.stringify(poiList[i]) + ")' style='color:#2B80FA' href='#'>" + a + "、" + poiList[i].address + "</a></li>";
		$("#poiPlace").append(li);
		var myIcon = new BMap.Icon("../image/blue_30.png", {
		    offset: new BMap.Size(10, 25)
		});
		var point = new BMap.Point(poiList[i].location.lng,poiList[i].location.lat);
		var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
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
	
	var length = libraryList.length>=libraryPage*5 ? libraryPage*5 : libraryList.length;
	$("#libraryPlace").empty();
	for(var i=libraryPage*5-5;i<length;i++){
		var a = i+1;
		var li = "<li><a onclick='clickAddress(" + JSON.stringify(libraryList[i]) + ")' style='color:#ED4634' href='#'>" + a + "、" + libraryList[i].address + "</a></li>";
		$("#libraryPlace").append(li);
		var myIcon = new BMap.Icon("../image/red_30.png", {
		    offset: new BMap.Size(10, 25)
		});
		var point = new BMap.Point(libraryList[i].location.lng,libraryList[i].location.lat);
		var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
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
	
	var view = map.getViewport(eval(points));
	var mapZoom = view.zoom; 
	var centerPoint = view.center; 
	map.centerAndZoom(centerPoint,mapZoom);
}

function changeAroundPage(page,type){
	if(type == 1){
		aroundPoiPage = page;
		$("#aroundPoi #aroundPoiPage").empty();
		var previous = page-1;
		var next = page+1;
		if(page==1){
			$("#aroundPoi #aroundPoiPage").append("<div style='float:right;'><a style='color:#2B80FA' href='#' onclick='changeAroundPage(" + next + ",1)'>下一页》</a></div>");
		}else if(aroundPoiList.length > page*5){
			$("#aroundPoi #aroundPoiPage").append("<div style='float:right;'><a style='color:#2B80FA' href='#' onclick='changeAroundPage(" + next + ",1)'>下一页》</a></div>");
			$("#aroundPoi #aroundPoiPage").append("<div style='float:right;margin-right:20px;'><a style='color:#2B80FA' href='#' onclick='changeAroundPage(" + previous + ",1)'>《上一页</a></div>");
		}else{
			$("#aroundPoi #aroundPoiPage").append("<div style='float:right;'><a style='color:#2B80FA' href='#' onclick='changeAroundPage(" + previous + ",1)'>《上一页</a></div>");
		}
	}else if(type == 2){
		aroundLibraryPage = page;
		$("#aroundLibrary #aroundLibraryPage").empty();
		var previous = page-1;
		var next = page+1;
		if(page==1){
			$("#aroundLibrary #aroundLibraryPage").append("<div style='float:right;'><a style='color:#ED4634' href='#' onclick='changeAroundPage(" + next + ",2)'>下一页》</a></div>");
		}else if(aroundLibraryList.length > page*5){
			$("#aroundLibrary #aroundLibraryPage").append("<div style='float:right;'><a style='color:#ED4634' href='#' onclick='changeAroundPage(" + next + ",2)'>下一页》</a></div>");
			$("#aroundLibrary #aroundLibraryPage").append("<div style='float:right;margin-right:20px;'><a style='color:#ED4634' href='#' onclick='changeAroundPage(" + previous + ",2)'>《上一页</a></div>");
		}else{
			$("#aroundLibrary #aroundLibraryPage").append("<div style='float:right;'><a style='color:#ED4634' href='#' onclick='changeAroundPage(" + previous + ",2)'>《上一页</a></div>");
		}
	}
	intoAroundPage();
}


function intoAroundPage(){
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
        if(allOverlay[i] == "[object Marker]" ){
        	 map.removeOverlay(allOverlay[i]);
        }
    }
	var points = [];
	//当前选中的标注变大
	var myIcon = new BMap.Icon("../image/red_50.png", {
	    offset: new BMap.Size(10, 25)
	});
	var point = new BMap.Point(clickLng,clickLat);
    var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
	marker.disableMassClear();
	map.addOverlay(marker);// 将标注添加到地图中
	var json ='{"lat":' + clickLat + ',"lng":' + clickLng+ '}';
	points.push(JSON.parse(json));
	
	var length = aroundPoiList.length>=aroundPoiPage*5 ? aroundPoiPage*5 : aroundPoiList.length;
	$("#aroundPoiPlace").empty();
	for(var i=aroundPoiPage*5-5;i<length;i++){
		var a = i+1;
		var li = "<li style='color:#2B80FA'>" + a + "、" + aroundPoiList[i].address + "</li>";
		$("#aroundPoiPlace").append(li);
		var myIcon = new BMap.Icon("../image/blue_30.png", {
		    offset: new BMap.Size(10, 25)
		});
		var point = new BMap.Point(aroundPoiList[i].location.lng,aroundPoiList[i].location.lat);
		var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
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
	
	var length = aroundLibraryList.length>=aroundLibraryPage*5 ? aroundLibraryPage*5 : aroundLibraryList.length;
	$("#aroundLibraryPlace").empty();
	for(var i=aroundLibraryPage*5-5;i<length;i++){
		var a = i+1;
		var li = "<li style='color:#ED4634'>" + a + "、" + aroundLibraryList[i].address + "</li>";
		$("#aroundLibraryPlace").append(li);
		var myIcon = new BMap.Icon("../image/red_30.png", {
		    offset: new BMap.Size(10, 25)
		});
		var point = new BMap.Point(aroundLibraryList[i].location.lng,aroundLibraryList[i].location.lat);
		var marker = new BMap.Marker(point,{icon: myIcon});  // 创建标注
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
	
	var view = map.getViewport(eval(points));
	var mapZoom = view.zoom; 
	var centerPoint = view.center; 
	map.centerAndZoom(centerPoint,mapZoom);
}

$('#address').bind('keypress',function(event){ 
    if(event.keyCode == "13"){
    	$('#search').click();
    }  

});

$("#area").change(function(){
	var area = $(this).val();
	$("#town").empty();
	$("#town").append('<option value="">-街道-</option>');
	for(var key in townMap){
		if(key==area){
			for(var i=0;i<townMap[key].length;i++){
				$("#town").append('<option value="'+ townMap[key][i] +'">'+ townMap[key][i] +'</option>');
			}
			break;
		}
	}
})

function changeSelect(area,town){
	for(var i=0;i<areaList.length;i++){
		if(area!=areaList[i]){
			$("#area").append('<option value="'+ areaList[i] +'">'+ areaList[i] +'</option>');
		}
	}
	for(var key in townMap){
		if(key==area){
			for(var i=0;i<townMap[key].length;i++){
				if(town!=townMap[key][i]){
					$("#town").append('<option value="'+ townMap[key][i] +'">'+ townMap[key][i] +'</option>');
				}
			}
			break;
		}
	}
}