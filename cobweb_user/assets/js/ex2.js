// var $tp = tickers[i].trade_price;
// var $change_rate = ((tickers[i].signed_change_rate*100).toFixed(2))
// var $high_price = tickers[i].high_price;
// var $low_price = tickers[i].low_price
// var $volume = ((tickers[i].acc_trade_price_24h>1000000 ? ( tickers[i].acc_trade_price_24h / 1000000 ) : tickers[i].acc_trade_price_24h ).toFixed(0)) + (tickers[i].acc_trade_price_24h>1000000 ? "백만" : "");

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }
  
  function setUpbitData(){
  $.ajax({
    url: "https://api.upbit.com/v1/market/all",
    dataType: "json"
  }).done(function(markets){
    //$("#tmp").html( JSON.stringify(markets) );
    var arr_krw_markets = "";
    var arr_english_name = [];
    var b = "KRW-BTC";
    var e = "KRW-ETH";
    var o = "KRW-EOS";
    var x = "KRW-XRP";

    for(var i = 0; i < markets.length; i++){
      if( markets[i].market.indexOf(b) > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));             
      }
      if( markets[i].market.indexOf(e) > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
      if( markets[i].market.indexOf(o) > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
      if( markets[i].market.indexOf(x) > -1 ){
        arr_krw_markets += markets[i].market+(",");
        arr_english_name.push(markets[i].english_name.replace("",""));      
      }
    }
    arr_krw_markets = arr_krw_markets.substring(0, arr_krw_markets.length-1);
    //$("#tmp").html( arr_krw_markets );
    $.ajax({
      url: "https://api.upbit.com/v1/ticker?markets=" + arr_krw_markets,
      dataType: "json"
    }).done(function(tickers){
      $('.col').remove();
      //alert($("#table_ticker > tbody > tr").length);       
    for(var i = 0; i < tickers.length; i++){
        var $tp = tickers[i].trade_price;
        var $change_rate = ((tickers[i].signed_change_rate*100).toFixed(2))
        var $high_price = tickers[i].high_price;
        var $low_price = tickers[i].low_price
        var $volume = ((tickers[i].acc_trade_price_24h>1000000 ? ( tickers[i].acc_trade_price_24h / 1000000 ) : tickers[i].acc_trade_price_24h ).toFixed(0)) + (tickers[i].acc_trade_price_24h>1000000 ? "백만" : "");
        
        var rowHtml = arr_english_name[i] 
        //rowHtml += "<td>" + arr_korean_name[i] +"</td>"

        // rowHtml += "<td>" + comma($tp) + " KRW</td>"
        // rowHtml += "<td>" + $change_rate + "%</td>"
        // rowHtml += "<td>" + comma($high_price) + " KRW</td>"
        // rowHtml += "<td>" + comma($low_price) + " KRW</td>"
        // rowHtml += "<td>" + comma($volume) + "</td>"
        // rowHtml += "</tr>";
        // $("#table_ticker > tbody:last").append(rowHtml); 

        //markets[i].korean_name
        $("#myTabContent").append(`<div class="col">
        <div class="tab-pane fade" id="market" role="tabpanel" aria-labelledby="market-tab">
        <div class="row">
            <div class="col-md-6 col-sm-6 col-xs-12">
                <h6 class="title"><strong>Buy KRW</strong><span class="pull-right">BTC: 3.87062</span></h6>
                <div class="form-group">
                    <label for="">Price</label>
                    <input type="text" class="form-control" id="" placeholder="${$tp}">
                </div>
                <div class="form-group">
                    <label for="">Amount</label>
                    <input type="text" class="form-control" id="" placeholder="KRW">
                </div>
                <div class="form-group percent-btns">
                    <a href="#">25%</a>
                    <a href="#">50%</a>
                    <a href="#">75%</a>
                    <a href="#">100%</a>
                </div>
                <div class="form-group">
                    <a class="btn btn-primary">BUY</a>
                </div>
            </div>
            <div class="col-md-6 col-sm-6 col-xs-12">
                <h6 class="title"><strong>Sell KRW</strong><span class="pull-right">BTC: 3.87062</span></h6>
                <div class="form-group">
                    <label for="">Price</label>
                    <input type="text" class="form-control" id="" placeholder="BTC">
                </div>
                <div class="form-group">
                    <label for="">Amount</label>
                    <input type="text" class="form-control" id="" placeholder="KRW">
                </div>
                <div class="form-group percent-btns">
                    <a href="#">25%</a>
                    <a href="#">50%</a>
                    <a href="#">75%</a>
                    <a href="#">100%</a>
                </div>
                <div class="form-group">
                    <a class="btn btn-primary">SELL</a>
                </div>
            </div>
        </div>
    </div> `); 

       } // end for...
    

    })  //done(function(tickers){
        

  }) // end done(function(markets){
      
  .fail(function(){
    //alert("업비트 API 접근 중 에러.")}
    $("#tmp").text( "API 접근 중 에러." );
  })
  setTimeout(setUpbitData, 13000);
  }
  $(function() {
  var color = localStorage.getItem("test_upbit_color");
  if( color ) $("#wrapper").css("color", color);
  setUpbitData();
  });