// https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript
const splitByUnquotedCommas = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;

export default function csvToJSON(csv){
  const lines = csv.split("\n");
  if (lines.length < 2){
    throw 'No csv data found';
  }

  const headers = lines[0].match(splitByUnquotedCommas);
  const headersUnique = new Set(headers);
  if (headersUnique.size !== headers.length){
    throw 'Duplicate CSV headers';
  }

  let result = [];
  lines.shift();
  for(const [ i, line ] of lines.entries()){
    let obj = {};
    // split by unquoted commas
    // https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript
    const currentline = line.match(splitByUnquotedCommas);

    // final newline is ingored if its blank
    if (currentline === null && i === lines.length - 1) {
      continue;
    } else if (currentline === null){
      throw 'Invalid CSV format';
    }

    // final newline is ingored if its blank
    if (currentline.length === 1 && currentline[0] === '' && i === lines.length -1){
      continue;
    }

    if (currentline.length !== headers.length){
      throw 'Invalid CSV body';
    }

    for(const [ j, header ] of headers.entries()){
      obj[header] = currentline[j];
    }
    result.push(obj);
  }
  
  return result;
}
