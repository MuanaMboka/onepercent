export const UI_ACTIONS = {
  SET_SCREEN: "ui/SET_SCREEN",
  SET_USP_SLIDE: "ui/SET_USP_SLIDE",
  SET_FIRST_TIME: "ui/SET_FIRST_TIME",
  SET_EXPANDED_ACTION: "ui/SET_EXPANDED_ACTION",
};

export function createUiInitialState(saved, initScreen) {
  return {
    screen: initScreen,
    uspSlide: saved?.uspSlide || 0,
    firstTime: !saved,
    expandedAction: null,
  };
}

export function uiReducer(state, action) {
  switch (action.type) {
    case UI_ACTIONS.SET_SCREEN:
      return { ...state, screen: action.payload };
    case UI_ACTIONS.SET_USP_SLIDE:
      return { ...state, uspSlide: action.payload };
    case UI_ACTIONS.SET_FIRST_TIME:
      return { ...state, firstTime: action.payload };
    case UI_ACTIONS.SET_EXPANDED_ACTION:
      return { ...state, expandedAction: action.payload };
    default:
      return state;
  }
}
