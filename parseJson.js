var gr = new GlideRecord('em_event');
gr.addQuery('sys_id','__sys_id___');
gr.query();
if(gr.next()){
	var ci = extractConfigurationItem(gr.description);
	gs.info(ci);
}

/**
 * Extracts the first configurationItems value from a mixed-text description
 *
 * @param {String} input Raw description text
 * @return {String} configurationItems value or empty string
 */
function extractConfigurationItem(input) {
  if (!input) return "";

  // Remove line breaks for safety
  input = input.replace(/[\r\n]/g, "");

  function findMatchingBrace(str, openIndex) {
    var depth = 0;
    var inString = false;
    var escaped = false;

    for (var i = openIndex; i < str.length; i++) {
      var ch = str.charAt(i);

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (ch === "\\") {
          escaped = true;
        } else if (ch === "\"") {
          inString = false;
        }
        continue;
      }

      if (ch === "\"") {
        inString = true;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  // Locate essentials block
  var idx = input.indexOf("essentials");
  if (idx === -1) return "";

  var open = input.indexOf("{", idx);
  if (open === -1) return "";

  var close = findMatchingBrace(input, open);
  if (close === -1) return "";

  try {
    var essentials = JSON.parse(input.substring(open, close + 1));

    if (
      essentials.configurationItems &&
      essentials.configurationItems.length
    ) {
      return essentials.configurationItems[0];
    }
  } catch (e) {
    return "";
  }

  return "";
}
