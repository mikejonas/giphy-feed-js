<img style="width:100%;" src="/banner.png">

###[DEMO](http://mikejonas.com/giphy-feed)

* giphy-feed.js - A vinalla javascript implementation of an infinite scrolling masonry grid layout.
* pure-box.js - A vinalla javascript lightbox that works great on its own.

## Usage

###giphy-feed.js

```
var giphyFeed = new GiphyFeed({
  apiKey: 'dc6zaTOxFJmzC', //default: dc6zaTOxFJmzC
  minColumnWidth: 300, //default: 300
  photoMargin: 15, //default: 20
  infiniteScroll: true, //default: true
  giphyApiOptions: { // https://github.com/Giphy/GiphyAPI#search-endpoint
    q: 'working',
    limit: 25,
  }
}, document.getElementById('giphyFeed')); //replace this with desired container
```

###pure-box.js
```
var pureBox = new PureBox(document.getElementById('giphyFeed')); //replace this with desired container
```

Replace the contents of `README.md` with your project's:

## Support

Please [open an issue](https://github.com/mikejonas/giphy-feed-js/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and open a pull request
