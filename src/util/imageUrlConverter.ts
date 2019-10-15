export const imageUrlConverter = s => {
  if (s) {
    let subString = s.substring(s.lastIndexOf("/") + 1, s.length);
    return "pic/" + subString;
  } else return "";
};