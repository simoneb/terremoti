<%@ Page Title="" Language="C#" MasterPageFile="~/Default.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Terremoti.Default1" %>
<asp:Content runat="server" ID="unknown" ContentPlaceHolderID="content">
    <div class="page-header">
        <h3>Terremoto Emilia Romagna <small id="autoUpdate">auto refresh</small> <i id="ajaxIndicator" class="icon-refresh" style="display:none; vertical-align: baseline"></i>
        <a href="https://twitter.com/share" class="twitter-share-button pull-right" data-url="http://www.terremotoemiliaromagna.it" data-text="T. ER (terremoto Emilia Romagna)" data-via="simonebu" data-hashtags="terremoto">Tweet</a>
        <script type="text/javascript">!function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = "//platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); } } (document, "script", "twitter-wjs");</script>
        </h3>
    </div>
    <div class="row">
        <div class="span12">
            <h4>Magnitude chart <a href="#" title="Ingrandisci" id="chart-resize"><i id="chart-resize-icon" class="icon-resize-full"></i></a></h4>
            <div id="chart_canvas" style="height: 300px"></div>
            <div id="dashboard_div">
                <div id="filter_div"></div>
            </div>
        </div>
    </div>
        
    <div class="row">
        <div id="map-container" class="span8">
            <h4>Geomap <a href="#" title="Ingrandisci" id="map-resize"><i id="map-resize-icon" class="icon-resize-full"></i></a></h4>                
            <div id="map_canvas" style="height: 400px"></div>
        </div>
        <div id="table-container" class="span4">
            <h4>Event list</h4>   
            <div id="table_canvas" style="height: 400px; width: 100%"></div>
        </div>
    </div>
</asp:Content>
<asp:Content runat="server" ID="AdditionalScripts" ContentPlaceHolderID="additionalScripts">
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=AIzaSyBcULfTmuMCU4lFw04Mfxkq9FlWDNu_iMU&sensor=false"></script>
    <script type="text/javascript" src="js/script.js"></script>
</asp:Content>