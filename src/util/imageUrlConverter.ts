imageUrlConverter = s => {
    if (s) {
      subString = s.substring(s.lastIndexOf('/') + 1, s.length);
      console.log(subString);
      finalString = 'pic/' + subString;
      return finalString;
    } else return '';
}

export { imageUrlConverter };