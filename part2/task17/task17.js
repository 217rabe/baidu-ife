/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: "上海",
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    chartData.dataAll = [];
    chartData.data = [];
    chartData.time = [];
    for(var e in aqiSourceData[pageState.nowSelectCity]){
      chartData.dataAll.push(aqiSourceData[pageState.nowSelectCity][e]);
    }
    var dataLength = chartData.dataAll.length;
    var num = 0;
    switch(pageState.nowGraTime){
      case "day":
          chartData.data = chartData.dataAll;
          for(var e in aqiSourceData[pageState.nowSelectCity]){
            chartData.time.push(e);
          }
          //console.log(chartData.time);
          break;
      case "week":
          var week_flage = 0;
          for(var i = 0;i < dataLength;i++){
            num += chartData.dataAll[i];
            if(i%7 == 6){
              chartData.data.push(Math.round(num/7));
              num = 0;
              week_flage++;
            }
          }
          for(var i = 0;i < week_flage;i++){
              chartData.time[i] = "第"+(i+1)+"周"; 
            }//console.log(chartData.time);
          break;
      case "month":
          var month_flage = 0;
          var result = 0;
          var flag = 0;
          var sum = 0;
          for(e in aqiSourceData[pageState.nowSelectCity]){
            if(e.indexOf("-01-") != -1){
              flag++;
              sum += aqiSourceData[pageState.nowSelectCity][e];
              month_flage++;
            }
          }
          chartData.data.push(Math.round(sum/flag));
          flag = 0;
          sum = 0;
          for(e in aqiSourceData[pageState.nowSelectCity]){
            if(e.indexOf("-02-") != -1){
              flag++;
              sum += aqiSourceData[pageState.nowSelectCity][e];
              month_flage++;
            }
          }
          chartData.data.push(Math.round(sum/flag));
          //console.log(chartData.data);
          flag = 0;
          sum = 0;
          for(e in aqiSourceData[pageState.nowSelectCity]){
            if(e.indexOf("-03-") != -1){
              flag++;
              sum += aqiSourceData[pageState.nowSelectCity][e];
              month_flage++;
            }
          }
          chartData.data.push(Math.round(sum/flag));
          for(var j = 0;j < month_flage;j++){
            chartData.time[j] = "第"+(j+1)+"个月";
          }
          break;
    }
   var colorArr = ["#02c44b","#176e38","#7c8489", "#4fb3a4", "#ff7073", "#f5b977", "#fdfc7f"]
   var html = "";
   var contenthtml = '<div class="zhu '+pageState.nowGraTime+'" style="height:{height};background:{color}" title="{title}"></div>';
   for(var i = 0;i<chartData["data"].length;i++){
       var timer = Math.round(Math.random()*(colorArr.length-1));
       html += contenthtml.replace("{height}",parseInt(chartData["data"][i])+"px").replace("{color}",colorArr[timer]).replace("{title}","空气质量："+chartData["data"][i]+" 时间："+chartData["time"][i]);    
   }   
  var apicontent = document.getElementById("aqi-chart-wrap");
  apicontent.innerHTML = html;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(data) {
  // 确定是否选项发生了变化 
  if (pageState.nowGraTime == data) {return false;}
  pageState.nowGraTime = data;
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(city) {
  // 确定是否选项发生了变化 
  if (pageState.nowSelectCity == city){return false;}
  // 设置对应数据
  pageState.nowSelectCity = city;
  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var formTime = document.getElementById("form-gra-time");
  var inputRadio = formTime.getElementsByTagName("input");
  for(var i = 0;i<inputRadio.length;i++){
    inputRadio[i].addEventListener("click",function(){
      graTimeChange(this.value);
    })
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.getElementById("city-select");
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  for (var e in aqiSourceData) {
            var option = document.createElement("option");
            option.innerHTML = option.value = e;
            citySelect.appendChild(option);
        }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
        citySelect.onchange = function(){
          citySelectChange(this.value)
        }        
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var formTime = document.getElementById("form-gra-time");
  var inputRadio = formTime.getElementsByTagName("input");
  var len = inputRadio.length;
  for(var i = 0;i < len;i++){
    if(inputRadio[i].value == pageState.nowGraTime){
      inputRadio[i].checked = true;
    }
  }
  var citySelect = document.getElementById("city-select");
  citySelect.value = pageState.nowSelectCity;
  renderChart();
}


/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();