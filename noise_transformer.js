// Transforms a raw input stream of noise sensor inputs from [0..1]
// and outputs a smoothed stream.
NoiseTransformer = {
  pipe: function(stream) {
    // Take the average of the sliding window, going back *n* data points.
    return stream.slidingWindow(3, 3)
      .map(function(values) {
        return values.reduce(0, function(sum, val) {
          return sum + (val / values.length)
        })
      })
      .debounce(10);
  }
};

module.exports = NoiseTransformer;
