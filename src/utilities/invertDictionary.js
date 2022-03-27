export const invertDictionary = (dictionary) => {
  // Invert dictionary to make lookup dictionary (Easier to lookup by IDs vs country names, b/c capitalization)
  return Object.entries(dictionary).reduce((invertedDict, [key, value]) => {
    invertedDict[value] = key;
    return invertedDict;
  }, Object.create(null));
};
