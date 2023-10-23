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
} from "./functions";

module.exports = () => ({
  use,
  insert,
  addProperty,
  removeProperty,
  updateProperty,
  focusPropertyValue,
  getActiveLine,
  getActiveLineTags,
  getSelectionLines,
  setTextToSelection,
  attachTextToListItem,
  sortSelectionLines,
});
