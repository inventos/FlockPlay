FlockPlay
=========

Cloud service for saving on video traffic.
It’s possible with WebRTC technology, which allows direct communication between browsers.

Key features
------------

  - Greatly reduces your bandwidth use
  - Handles sudden bandwidth usage peaks
  - Works in browser without any extra plug-ins
  - Full support in Chrome, Firefox and Opera
  - Multibitrate (Adaptive Streaming)
  - Detailed statistics
  - SDKs for Flash, Android (iOS SDK coming soon)

How it works
------------

### Usual video delivery

![](http://flockplay.com/images/principle-gray.png)

In most common case of video delivery each new viewer connects to mediaserver and downloads video, occupying part of server capacity and bandwidth. The more viewers consume content, the higher server load and the greater payments for traffic.

### FlockPlay enhanced video delivery

![](http://flockplay.com/images/principle-color.png)

FlockPlay allows viewers not only to download and consume content but also to upload small chunks of content to other viewers of the very same content. Thus FlockPlay takes away sufficient part of load from mediaserver and saves your money on traffic payments.

Quick start
-----------

- Clone the repo: `git clone https://github.com/inventos/FlockPlay.git`
- Start simple HTTP server inside FlockPlay dir.
For example, if you have python or ruby, you can use one of the following one-liners: 

```
  python -m SimpleHTTPServer 8000
  python3 -m http.server 8000
  ruby -run -e httpd . -p 8000
```

- Open demo: [http://localhost:8000/samples/](http://localhost:8000/samples/)

Documentation
-------------

- [Flash-video](https://github.com/inventos/FlockPlay/wiki/flash-video)
- [Android-video](https://github.com/inventos/FlockPlay/wiki/android-video)
- [HTML-static](https://github.com/inventos/FlockPlay/wiki/html-static)

Feedback
--------

If you find a bug, have trouble following the documentation or have a question about the project – create an [issue](https://github.com/inventos/FlockPlay/issues).
