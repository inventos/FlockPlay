$(function() {
  var user_agent = navigator.userAgent.toLowerCase(),
    fl_no_support = true,
    ua_tokens = [
      {browser: 'chrome', min_version: 26, version_prefix: 'chrome/'},
      {browser: 'firefox', min_version: 23, version_prefix: 'firefox/'},
      {browser: 'opera', min_version: 18, version_prefix: 'version/'},
    ];

  $(ua_tokens).each(function(ind, element){
    if (element) {
      var reg = new RegExp(element.browser);
      if (reg.test(user_agent) &&
        parseInt(user_agent.substr(user_agent.indexOf(element.version_prefix) + element.version_prefix.length)) >= element.min_version) {
        fl_no_support = false;
      }
    }
  });

  if (fl_no_support) {
    $('.no-support-band').show();
    return;
  }

  var chunks_count = 0,
    blockCount = 0,
    http_count = 0,
    http_speed = 0,
    p2p_count = 0,
    p2p_speed = 0,
    local_ip,
    current_url,
    current_el;

  function bytesToSize(bytes) {
    var sizes = ['b', 'Kb', 'Mb', 'Gb', 'Tb'];
    if (bytes == 0) return '0 bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  function kbsToMbits(speed) {
    return Math.round(speed / 1000 * 8) + ' Mbit/s';
  }


  function updateCount() {
    chunks_count++;
    if (chunks_count > 39) {
      $('.chunks').find('div').first().remove();
      chunks_count--;
    }
  }

  if ($('.container-demo').length) {
    var
      player = new MegacdnPlayer('playerObject', {
      key: 'demo',
      tag: 'github',
      http_failback_factor: 0.3,
      http_failback_fill_factor: 0.3,
      cors: true,
      onStateChange: function(state, stats) {
        if (stats.url != current_url) {
          current_url = stats.url;
          current_el = $('<tr><td class="tst-type tst-type-find">?</td><td class="tst-src"></td><td class="tst-size"></td><td class="tst-speed"></td></tr>');
          $('.ts-table tbody').prepend(current_el);
          $('.ts-table').show();
          blockCount++;
          if (blockCount > 12) {
            $('.ts-table tbody').find('tr').last().remove();
            if (!$('.ts-table tbody tr').length) $('.ts-table').hide();
            blockCount--;
          }
        }
        switch (state) {
          case 'find_peer':
            current_el.children('.tst-src').text('Searching...');
            break;
          case 'http_download':
            current_el.children('.tst-type').attr('class', 'tst-type tst-type-http').text('HTTP');
            current_el.children('.tst-src').text('webcaster.pro');
            current_el.children('.tst-size').text('Downloading...');
            break;
          case 'peer_download':
            current_el.children('.tst-type').attr('class', 'tst-type tst-type-p2p').text('P2P');
            current_el.children('.tst-src').text(stats.ip);
            current_el.children('.tst-size').text('Downloading...');
            break;
          case 'complete':
            if (stats.type != 'abort') updateCount();
            if (stats.type == 'cache') {
              $('.chunks').append('<div class="chunk chunk-cache"></div>');

              current_el.children('.tst-type').attr('class', 'tst-type tst-type-cache').text('HTTP');
              current_el.children('.tst-src').text('Cache');
              current_el.children('.tst-size, .tst-speed').empty();
            } else if (stats.type == 'abort') {
              if (! current_el.children('.tst-src').html().match(/cache/)) {
                blockCount--;
                current_el.remove();
                if (!$('.ts-table tbody tr').length) $('.ts-table').hide();
              }
            } else if (stats.type == 'http') {
              $('.chunks').append('<div class="chunk chunk-http"></div>');
              http_count++;
              http_speed += stats.speed;
              $('.http-count').text(http_count);
              $('.http-speed').text(kbsToMbits(http_speed / http_count));

              current_el.children('.tst-type').attr('class', 'tst-type tst-type-http').text('HTTP');
              current_el.children('.tst-src').text('webcaster.pro');
              current_el.children('.tst-size').text(bytesToSize(stats.size));
              current_el.children('.tst-speed').text(kbsToMbits(stats.speed));
            } else {
              $('.chunks').append('<div class="chunk chunk-p2p"></div>');
              p2p_count++;
              p2p_speed += stats.speed;
              $('.p2p-count').text(p2p_count);
              $('.p2p-speed').text(kbsToMbits(p2p_speed / p2p_count));

              current_el.children('.tst-type').attr('class', 'tst-type tst-type-p2p').text('P2P');
              current_el.children('.tst-src').text(stats.ip);
              current_el.children('.tst-size').text(bytesToSize(stats.size));
              current_el.children('.tst-speed').text(kbsToMbits(stats.speed));
            }
            break;
        }
      }
    });

    var updateInterval = setInterval(updateConnections, 500);
  }

  function updateConnections() {
    if (! MegacdnPlayer.players.playerObject) return;

    var channels = MegacdnPlayer.players.playerObject.peer.channels;
    $('.upload').empty();
    $('.download').empty();

    if (! local_ip && player.peer.local_ip) {
      local_ip = player.peer.local_ip;
      $('.local-ip').append(local_ip + '<br>');
      $('.local-ip-capt').show();
    }

    for (var c in channels) {
      var ip = channels[c].local_ip;
      if (channels[c].is_src) {
        $('.upload').append(ip + '<br>');
      } else {
        $('.download').append(ip + '<br>');
      }
    }
  }
});
