describe("Hello", function() {
  it("should pass", function() {
    expect(1).toBeTruthy();
  });
});

describe("convertTag", function() {
  var in_tag, out_tag;

  beforeEach(function() {
    in_tag = {"tag":"a","value":"b","attr":[{"tag":"c","value":"d"}]};
    spyOn(converter, 'convertTag').andCallThrough();
    spyOn(converter, 'convertTagArray').andCallThrough();
    out_tag = converter.convertTag(in_tag);
  });

  it("converts the tag and value", function() {
    expect(out_tag["a"]).toEqual("b");
  });
  
  it("calls convertTagArray for attr", function() {
    expect(converter.convertTagArray).toHaveBeenCalledWith([{"tag":"c","value":"d"}]);
  });

  it("converts attr", function() {
    expect(out_tag["attr"]).toEqual({"c":"d"});
  });
});
