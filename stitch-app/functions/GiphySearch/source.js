exports = function(search){
  const giphyService = context.services.get("GiphyAPI");
  return giphyService.get({
    scheme: "http",
    host: "api.giphy.com",
    path: "/v1/gifs/search",
    query: {
      "api_key": ["dc6zaTOxFJmzC"],
      "q": [search],
      "rating": ["pg"],
      "limit": ["5"]
    },
    headers: {
      "Content-Type": [
        "application/json"
      ]
    }
  }).then(payload => {
    const body = EJSON.parse(payload.body.text());
    const data = body.data;
    let gifs = data.map(gif => {
      return {
        src: gif.images.fixed_height_small.url,
        url: gif.url,
        id: gif.id,
        title: gif.title
      };
    });
    return gifs;
  });
};