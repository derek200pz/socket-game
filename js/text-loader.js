$(document).ready(
    function() {
        var json = null;
        $.ajax({
            'global': false,
            'url': 'json/latest-update.json',
            'dataType': "json",
            'success': function(data) {
                $("#latest-update").html(data.latestUpdate);
            }
        });
    });