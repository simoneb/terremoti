/* Author: Simone Busoli
*/
(function ($) {
    $(document).ajaxStart(function () { $('#ajaxIndicator').fadeIn(); })
               .ajaxStop(function () { $('#ajaxIndicator').fadeOut(); });

    google.load("visualization", "1", { packages: ["corechart", "table"], language: 'it' });

    var chartTextStyle = { fontName: '"Trebuchet MS", Verdana, Arial, Helvetica, sans-serif' };

    var map, chart, table, dataTable, chartView, tableView,
        tooltips = [], allEvents = [], lastReceivedTimestamp = 0, newEvents = [], defaultTitle = 'T.ER';

    var mapOptions = {
        center: new google.maps.LatLng(44.880, 11.250),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        },
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    };

    var chartOptions = {
        vAxis: { title: 'Magnitude', minValue: 2, textPosition: 'in', textStyle: chartTextStyle, titleTextStyle: chartTextStyle },
        legend: 'none',
        colors: ['#7A2900'],
        tooltip: { showColorCode: false },
        chartArea: { width: '100%', height: '100%' },
        axisTitlesPosition: 'in',
        hAxis: { textPosition: 'in', textStyle: chartTextStyle }
    };

    var tableOptions = {
        showRowNumber: false,
        sortColumn: 0,
        sortAscending: false,
        cssClassNames: { tableCell: 'global-font', headerCell: 'global-font' }
    };

    $('#chart-resize').click(function () {
        var currClassSmall = $('#chart-resize-icon').attr('class').match('small');
        var height = currClassSmall ? 300 : 700;
        var cssClass = currClassSmall ? 'icon-resize-full' : 'icon-resize-small';
        var title = currClassSmall ? 'Ingrandisci' : 'Riduci';

        $('#chart_canvas').animate({ height: height }, 1000, function () {
            $('#chart-resize-icon').attr('class', cssClass);
            chart.draw(chartView, chartOptions);
        });

        $(this).attr('title', title);

        return false;
    });

    $('#map-resize').click(function () {
        var currClassSmall = $('#map-resize-icon').attr('class').match('small');
        var height = currClassSmall ? 400 : 700;
        var cssClass = currClassSmall ? 'icon-resize-full' : 'icon-resize-small';
        var showTable = currClassSmall;
        var mapContainerClass = currClassSmall ? 'span8' : 'span12';
        var title = currClassSmall ? 'Ingrandisci' : 'Riduci';

        $('#map_canvas').animate({ height: height }, 1000, function () {
            $('#map-resize-icon').attr('class', cssClass);

            if (showTable)
                $('#table-container').show();
            else
                $('#table-container').hide();

            $('#map-container').attr('class', mapContainerClass);

            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
            drawMapMarkers(allEvents);
        });

        $(this).attr('title', title);

        return false;
    });

    $(function () {
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        chart = new google.visualization.ScatterChart(document.getElementById('chart_canvas'));
        table = new google.visualization.Table(document.getElementById('table_canvas'));

        loadEvents(drawDataAndStartReceivingUpdates);
    });

    function loadEvents(callback, additionalArg) {
        $.get('ParsedExternalData.svc/events/' + lastReceivedTimestamp, function (data) {
            $.each(data, function (i, e) {
                e.localDate = new Date(e.dateUtc);
                lastReceivedTimestamp = e.dateUtc;
                allEvents.push(e);
            });

            if (data && data.length > 0)
                callback(data, additionalArg);
        });
    }

    function drawDataAndStartReceivingUpdates(events) {
        drawVisualizations(events);
        drawMapMarkers(events);

        setInterval(updateEvents, 20000);
    }

    function updateEvents() {
        loadEvents(updateData, allEvents.length);
    }

    function updateData(events, previousNumberOfEvents) {
        $.each(events, function (i, e) { newEvents.push(e); });
        updateAlert();
        updateTitle();

        addRowsToTable(events);
        chart.draw(chartView, chartOptions);
        table.draw(tableView, tableOptions);

        drawMapMarkers(events, previousNumberOfEvents);
    }

    function updateTitle() {
        document.title = defaultTitle + (newEvents.length > 0 ? (' (' + newEvents.length + ')') : '');
    }

    function updateAlert() {
        if (newEvents.length == 0)
            return;

        $('#alert').remove();

        var message = newEvents.length == 1 ? ('si &eacute; verificato un nuovo evento sismico di magnitudo <em>' + newEvents[0].magnitude + '</em> alle ore ' + newEvents[0].localDate.toLocaleTimeString()) :
                                              'si sono verificati ' + newEvents.length + ' nuovi eventi sismici';

        $('<div id="alert" class="alert alert-block fade in">' +
            '<strong>Attenzione:</strong> ' + message +
          '</div>').insertAfter('.page-header')
                   .alert()
                   .css('cursor', 'pointer')
                   .bind('closed', function () { newEvents = []; updateTitle(); })
                   .click(function () { $('#alert').alert('close'); });
    }

    function drawVisualizations(events) {
        dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', '', 'eventId');
        dataTable.addColumn('datetime', 'Date', 'localDate');
        dataTable.addColumn('number', 'Latitude', 'latitude');
        dataTable.addColumn('number', 'Longitude', 'longitude');
        dataTable.addColumn('number', 'Depth', 'depthKm');
        dataTable.addColumn('number', 'Magnitude', 'magnitude');
        dataTable.addColumn('string', 'Scale', 'magnitudeScale');
        dataTable.addColumn('string', 'District', 'district');
        dataTable.addColumn('string', 'Url', 'url');

        addRowsToTable(events);

        drawChart();
        drawTable();
    }

    function addRowsToTable(events) {
        $.each(events, function (i, e) {
            dataTable.addRow([e.eventId,
                { v: e.localDate },
                e.latitude,
                e.longitude,
                { v: e.depthKm, f: e.depthKm + ' km' },
                { v: e.magnitude, f: (e.magnitude.toString().match(/\./) ? e.magnitude : e.magnitude.toString() + '.0') + ' ' + e.magnitudeScale },
                e.magnitudeScale,
                e.district,
                e.url]);
        });
    }

    function drawChart() {
        chartView = new google.visualization.DataView(dataTable);
        chartView.setColumns([1, 5]);

        google.visualization.events.addListener(chart, 'select', chartSelectListener);

        chart.draw(chartView, chartOptions);
    }

    function chartSelectListener() {
        var selection = chart.getSelection();

        $.each(tooltips, function (i, t) { t.close(); });

        if (selection.length == 0) {
            table.setSelection(null);
            return;
        }

        tooltips[selection[0].row].open(map);
        table.setSelection([{ row: selection[0].row}]);
    }

    function drawTable() {
        tableView = new google.visualization.DataView(dataTable);
        tableView.setColumns([1, 4, 5]);

        google.visualization.events.addListener(table, 'select', tableSelectListener);

        table.draw(tableView, tableOptions);
    }

    function tableSelectListener() {
        var selection = table.getSelection();

        $.each(tooltips, function (i, t) { t.close(); });


        if (selection.length == 0) {
            chart.setSelection(null);
            return;
        }

        tooltips[selection[0].row].open(map);
        chart.setSelection(selection);
    }

    function drawMapMarkers(events, previousNumberOfEvents) {
        if (typeof previousNumberOfEvents == typeof undefined)
            tooltips = [];

        $.each(events, function (i, e) {
            var coords = new google.maps.LatLng(e.latitude, e.longitude);
            var weight = (e.localDate - allEvents[0].localDate) / (allEvents[allEvents.length - 1].localDate - allEvents[0].localDate + 1);

            var options = {
                strokeColor: "#7A2900",
                strokeOpacity: weight * 0.8 + 0.2,
                strokeWeight: 2,
                fillColor: "#7A2900",
                fillOpacity: weight * 0.4 + 0.3,
                map: map,
                center: coords,
                radius: e.magnitude * 120
            };

            var marker = new google.maps.Circle(options);

            var tooltip = new google.maps.InfoWindow({
                content: '<h4>Event data  <a class="btn btn-mini" target="_blank" href="' + e.url + '">More &raquo;</a></h4>' +
                    '<dl class="dl-horizontal">' +
                    '<dt>Date</dt>' +
                    '<dd>' + e.localDate + '</dd>' +
                    '<dt>Latitude</dt>' +
                    '<dd>' + e.latitude + '</dd>' +
                    '<dt>Longitude</dt>' +
                    '<dd>' + e.longitude + '</dd>' +
                    '<dt>Depth</dt>' +
                    '<dd>' + e.depthKm + ' km</dd>' +
                    '<dt>Magnitude</dt>' +
                    '<dd>' + e.magnitude + ' ' + e.magnitudeScale + '</dd>' +
                    '</dl>',
                maxWidth: 350,
                position: coords
            });

            tooltips.push(tooltip);

            google.maps.event.addListener(tooltip, 'closeclick', function () {
                table.setSelection(null);
                chart.setSelection(null);
            });

            google.maps.event.addListener(marker, 'click', function () {
                $.each(tooltips, function (_, t) { t.close(); });

                tooltip.open(map);
                chart.setSelection([{ row: i + (previousNumberOfEvents || 0)}]);
                table.setSelection([{ row: i + (previousNumberOfEvents || 0)}]);
            });
        });
    }
})(jQuery);