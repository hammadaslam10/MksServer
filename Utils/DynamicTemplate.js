exports.Template = (template, keyword) => {
  try {
    let dynamictemplate = template;
    const keys = Object.keys(keyword);
    console.log(keys);
    console.log(keyword);
    for (const i of keys) {
      dynamictemplate = dynamictemplate.replaceAll(`[user]`, keyword);
    }
    return dynamictemplate;
  } catch (err) {
    throw new Error("Invalid Format!");
  }
};
