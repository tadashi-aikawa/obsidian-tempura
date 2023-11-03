import {
  insert,
  getActiveLine,
  attachTextToListItem,
  use,
  getSelectionLines,
  setTextToSelection,
  sortSelectionLines,
  focusPropertyValue,
  updateProperty,
  removeProperty,
  addProperty,
  getActiveLineTags,
  readTagsFromProperty,
  readAliasesFromProperty,
  deleteActiveLine,
  stripDecorationFromSelection,
  stripLinksFromSelection,
  notify,
  addProperties,
  getBacklinkPaths,
  getCreationDate,
  getUpdateDate,
  now,
} from "./functions";

module.exports = () => ({
  use,
  insert,
  addProperty,
  addProperties,
  removeProperty,
  updateProperty,
  focusPropertyValue,
  getActiveLine,
  getActiveLineTags,
  getBacklinkPaths,
  getCreationDate,
  getUpdateDate,
  getSelectionLines,
  setTextToSelection,
  attachTextToListItem,
  sortSelectionLines,
  readTagsFromProperty,
  readAliasesFromProperty,
  deleteActiveLine,
  stripDecorationFromSelection,
  stripLinksFromSelection,
  notify,
  now,
});