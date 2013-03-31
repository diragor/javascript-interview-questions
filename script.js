// #1

// Given structure in attrStructure:
//  {
//    tag: "",
//    value: "",
//    attr: [
//      {"tag": "", value:""},{"tag":"", "value":""}
//    ]
//  }

// convert into structure that looks like: 
//  {
//    "tag": "value",
//    "attr": {
//      "tag": "value"
//    }
//  }
//  eg. 
//  {
//    "(0008,002A)": "20130318124132"
//  }
var attrStructure = {"tag":"(0008,0018)","value":"1.3.51.0.7.1193286233.9961.33088.48048.47436.15671.21980","attr":[{"tag":"(0008,002A)","value":"20130318124132"},{"tag":"(0008,0020)","value":"20130318"},{"tag":"(0008,0030)","value":"123650"},{"tag":"(0008,0018)","value":"1.3.51.0.7.1193286233.9961.33088.48048.47436.15671.21980"},{"tag":"(0008,0060)","value":"CR"},{"tag":"(0008,103E)","value":"SUNRISE VIEW"},{"tag":"(0018,0015)","value":"KNEE"},{"tag":"(0018,1164)","value":"0.1\\0.1"},{"tag":"(0018,5101)","value":"AP"},{"tag":"(0020,0013)","value":"2"},{"tag":"(0020,0020)","value":"L\\F"},{"tag":"(0028,0030)","value":"0.10000000149011\\0.10000000149011"},{"tag":"(0028,1052)","value":"0"},{"tag":"(0028,1053)","value":"1"},{"tag":"(0028,1054)","value":"LOG_E REL"},{"tag":"(0028,0101)","value":"12"},{"tag":"(0028,0010)","value":"2328"},{"tag":"(0028,0011)","value":"2928"},{"tag":"(0008,1030)","value":"Femur Knee Leg"},{"tag":"(0010,0010)","value":"BEAN^ELENA"},{"tag":"(0010,0020)","value":"690100"},{"tag":"(0010,0030)","value":"19400826"},{"tag":"(0010,0040)","value":"F"},{"tag":"(0010,4000)","value":"L KNEE"}]};

// test that your structure is correct - use qUnit or any other test framework in an external file

// loop through the above data structure and create a tree-like output on the screen. 
// You can use jQuery to attach event handlers for hiding/showing nodes in the tree.

// RME: my intention in this solution was to use recursion with convertTagArray calling convertTag, but due to the "attr" result being specified as a single object with many key/value pairs rather than an array of objects, multiple "attr" elements under the top level one wouldn't work
converter = {
  convertTag: function(tag) {
    var result = {}
    result[tag["tag"]] = tag["value"];
    result["attr"] = this.convertTagArray(tag["attr"]);
    return result;
  },
  convertTagArray: function(tag_array) {
    var result = {}
    $.each(tag_array, function(index, tag) {
      result[tag["tag"]] = tag["value"];
    });
    return result; 
  }
};

// RME: since there's only one level below the root, I'll make the "tag" part visible and you expand to see the "value" part

function makeNode(dom_parent, tag_name, value_element) {
  dom_parent.append($(document.createElement('div')).addClass('node')
    .append($(document.createElement('div')).addClass('tag_name closed').html(tag_name))
    .append(value_element)
  );
}

function makeNodes(obj) {
  var subtree = $(document.createElement('div')).addClass('subtree').css('display', 'none');
  var value_element;
  $.each(obj, function(key, value) {
    if (key == "attr") {
      value_element = makeNodes(value);
    } else {
      value_element = $(document.createElement('div')).addClass('tag_value').html(value).css('display', 'none')
    }
    makeNode(subtree, key, value_element);
  });
  return subtree;
}

function toggleNode(node) {
  var newclass = (node.hasClass('closed')) ? 'open' : 'closed'
  node.removeClass('open closed').addClass(newclass);
  node.siblings().toggle();
}

// #2

// given the text in the variable "corpus", write the following:
var corpus = "The ship drew on and had safely passed the strait, which some volcanic shock has made between the Calasareigne and Jaros islands; had doubled Pomegue, and approached the harbor under topsails, jib, and spanker, but so slowly and sedately that the idlers, with that instinct which is the forerunner of evil, asked one another what misfortune could have happened on board. However, those experienced in navigation saw plainly that if any accident had occurred, it was not to the vessel herself, for she bore down with all the evidence of being skilfully handled, the anchor a-cockbill, the jib-boom guys already eased off, and standing by the side of the pilot, who was steering the Pharaon towards the narrow entrance of the inner port, was a young man, who, with activity and vigilant eye, watched every motion of the ship, and repeated each direction of the pilot.";

// 1. calculate word frequency in the input text collection. Separators include [ ,-.?!]
// 2. show word frequency in descending order and ascending order, based on a radio button in index.html
// 3. show words in alphabetical order and reverse alphabetical order, with word frequency, based on a radio button in index.html
// 4. ensure that browser does not block when calculating these frequencies

var word_freqs = [];

function calc_word_freqs(text) {
  var words = text.split(/[\W\s]+/);
  var freqs = {};
  word_freqs = [];
  $.each(words, function(i, word) {
    freqs[word.toLowerCase()] = (freqs[word.toLowerCase()] || 0) + 1;
  });
  delete freqs['']; // blanks from delimiters at ends
  $.each(freqs, function(key, value) {
    word_freqs.push({'word': key, 'count': value});
  });
}

function display_word_freqs() {
  $.each(word_freqs, function(i, obj) {
    $('#freqs').append( $(document.createElement('li')).attr('id', obj['word']).html(
      "<span class='freq_word'>" + obj['word'] + "</span> <span class='freq_count'>" + obj['count'] + "</span>"
    ));
  });
}

function sort_word_freqs(sort_method, sort_dir) {
  var sort_mult = (sort_dir == 'asc') ? 1 : -1;
  var sorted_freqs;
  if (sort_method == 'alpha') {
    sorted_freqs = word_freqs.sort(function(a,b){ return a['word'].localeCompare(b['word']) * sort_mult; });
  } else {
    sorted_freqs = word_freqs.sort(function(a,b){ return (a['count'] - b['count']) * sort_mult; });
  }
  var list = $('#freqs');
  $.each(sorted_freqs, function(i, obj) {
    list.append($('#' + obj['word']));
  });
}


$(function() {
  var convertedAttrs = converter.convertTag(attrStructure);
  $('#tree').append(makeNodes(convertedAttrs).show());

  $('.tag_name').on('click', function() {
    toggleNode($(this));
  });

  calc_word_freqs(corpus);
  display_word_freqs();
  sort_word_freqs('count', 'desc');

  $('input').on('change', function() {
    var meth = $('input[name="sort_method"]:checked').val();
    var dir = $('input[name="sort_dir"]:checked').val();
    sort_word_freqs(meth, dir);
  });
})

