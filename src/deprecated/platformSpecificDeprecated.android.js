/*eslint-disable*/
import React, {Component} from 'react';
import {AppRegistry, NativeModules, processColor} from 'react-native';
import _ from 'lodash';

import Navigation from './../Navigation';

const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');

import * as newPlatformSpecific from './../platformSpecific';

function startSingleScreenApp(params) {
  const screen = params.screen;
  if (!screen.screen) {
    console.error('startSingleScreenApp(params): screen must include a screen property');
    return;
  }
  addNavigatorParams(screen);
  addNavigatorButtons(screen, params.drawer);
  addNavigationStyleParams(screen);
  screen.passProps = params.passProps;

  /*
   * adapt to new API
   */
  adaptTopTabs(screen, screen.navigatorID);
  screen.screenId = screen.screen;
  params.screen = adaptNavigationStyleToScreenStyle(screen);
  params.screen = adaptNavigationParams(screen);
  params.appStyle = convertStyleParams(params.appStyle);
  params.sideMenu = convertDrawerParamsToSideMenuParams(params.drawer);
  params.overrideBackPress = screen.overrideBackPress;
  params.animateShow = convertAnimationType(params.animationType);

  newPlatformSpecific.startApp(params);
}

function adaptTopTabs(screen, navigatorID) {
  _.forEach(_.get(screen, 'topTabs'), (tab) => {
    addNavigatorParams(tab);
    if (navigatorID) {
      tab.navigatorID = navigatorID;
    }
    tab.screen = tab.screenId;
    addNavigatorButtons(tab);
    adaptNavigationParams(tab);
  });
}

function navigatorPush(navigator, params) {
  addNavigatorParams(params, navigator);
  addNavigatorButtons(params);
  addTitleBarBackButtonIfNeeded(params);
  addNavigationStyleParams(params);

  adaptTopTabs(params, params.navigatorID);

  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);
  adapted.overrideBackPress = params.overrideBackPress;

  newPlatformSpecific.push(adapted);
}

function navigatorPop(navigator, params) {
  addNavigatorParams(params, navigator);

  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);

  newPlatformSpecific.pop(adapted);
}

function navigatorPopToRoot(navigator, params) {
  addNavigatorParams(params, navigator);

  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);

  newPlatformSpecific.popToRoot(adapted);
}

function navigatorResetTo(navigator, params) {
  addNavigatorParams(params, navigator);
  addNavigatorButtons(params);
  addNavigationStyleParams(params);

  adaptTopTabs(params, params.navigatorID);

  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);

  newPlatformSpecific.newStack(adapted);
}

function adaptNavigationStyleToScreenStyle(screen) {
  const navigatorStyle = screen.navigatorStyle;
  if (!navigatorStyle) {
    return screen;
  }

  screen.styleParams = convertStyleParams(navigatorStyle);

  return _.omit(screen, ['navigatorStyle']);
}

function convertStyleParams(originalStyleObject) {
  if (!originalStyleObject) {
    return null;
  }

  let ret = {
    statusBarColor: originalStyleObject.statusBarColor,
    topBarColor: originalStyleObject.navBarBackgroundColor,
    topBarTransparent: originalStyleObject.navBarTransparent,
    topBarTranslucent: originalStyleObject.navBarTranslucent,
    collapsingToolBarImage: originalStyleObject.collapsingToolBarImage,
    collapsingToolBarCollapsedColor: originalStyleObject.collapsingToolBarCollapsedColor,
    titleBarHidden: originalStyleObject.navBarHidden,
    titleBarHideOnScroll: originalStyleObject.navBarHideOnScroll,
    titleBarTitleColor: originalStyleObject.navBarTextColor,
    titleBarSubtitleColor: originalStyleObject.navBarTextSubtitleColor,
    titleBarButtonColor: originalStyleObject.navBarButtonColor,
    titleBarDisabledButtonColor: originalStyleObject.titleBarDisabledButtonColor,
    backButtonHidden: originalStyleObject.backButtonHidden,
    topTabsHidden: originalStyleObject.topTabsHidden,
    contextualMenuStatusBarColor: originalStyleObject.contextualMenuStatusBarColor,
    contextualMenuBackgroundColor: originalStyleObject.contextualMenuBackgroundColor,
    contextualMenuButtonsColor: originalStyleObject.contextualMenuButtonsColor,

    drawBelowTopBar: !originalStyleObject.drawUnderNavBar,

    topTabTextColor: originalStyleObject.topTabTextColor,
    selectedTopTabTextColor: originalStyleObject.selectedTopTabTextColor,
    selectedTopTabIndicatorHeight: originalStyleObject.selectedTopTabIndicatorHeight,
    selectedTopTabIndicatorColor: originalStyleObject.selectedTopTabIndicatorColor,

    drawScreenAboveBottomTabs: !originalStyleObject.drawUnderTabBar,

    bottomTabsColor: originalStyleObject.tabBarBackgroundColor,
    bottomTabsButtonColor: originalStyleObject.tabBarButtonColor,
    bottomTabsSelectedButtonColor: originalStyleObject.tabBarSelectedButtonColor,
    bottomTabsHidden: originalStyleObject.tabBarHidden,
    bottomTabsHiddenOnScroll: originalStyleObject.bottomTabsHiddenOnScroll,
    forceTitlesDisplay: originalStyleObject.forceTitlesDisplay,
    bottomTabBadgeTextColor: originalStyleObject.bottomTabBadgeTextColor,
    bottomTabBadgeBackgroundColor: originalStyleObject.bottomTabBadgeBackgroundColor,

    navigationBarColor: originalStyleObject.navigationBarColor
  }

  if (originalStyleObject.collapsingToolBarImage) {
    if (_.isString(originalStyleObject.collapsingToolBarImage)) {
      ret.collapsingToolBarImage = originalStyleObject.collapsingToolBarImage;
    }

    const collapsingToolBarImage = resolveAssetSource(originalStyleObject.collapsingToolBarImage)
    if (collapsingToolBarImage) {
      ret.collapsingToolBarImage = collapsingToolBarImage.uri;
    }
  }
  return ret;
}

function convertDrawerParamsToSideMenuParams(drawerParams) {
  const drawer = Object.assign({}, drawerParams);
  if (!drawer.left || !drawer.left.screen) {
    return null;
  }

  let result = {};
  result.disableOpenGesture = drawer.disableOpenGesture !== undefined;
  result.screenId = drawer.left.screen;
  addNavigatorParams(result);
  result = adaptNavigationParams(result);
  result.passProps = drawer.passProps;
  return result;
}

function adaptNavigationParams(screen) {
  screen.navigationParams = {
    screenInstanceID: screen.screenInstanceID,
    navigatorID: screen.navigatorID,
    navigatorEventID: screen.navigatorEventID
  };
  return screen;
}

function startTabBasedApp(params) {
  if (!params.tabs) {
    console.error('startTabBasedApp(params): params.tabs is required');
    return;
  }

  const newTabs = [];

  params.tabs.forEach(function(tab, idx) {
    addNavigatorParams(tab, null, idx);
    addNavigatorButtons(tab, params.drawer);
    addNavigationStyleParams(tab);
    addTabIcon(tab);
    if (!tab.passProps) {
      tab.passProps = params.passProps;
    }

    adaptTopTabs(tab, tab.navigatorID);

    tab.screenId = tab.screen;

    let newtab = adaptNavigationStyleToScreenStyle(tab);
    newtab = adaptNavigationParams(tab);
    newtab.overrideBackPress = tab.overrideBackPress;
    newTabs.push(newtab);
  });
  params.tabs = newTabs;

  params.appStyle = convertStyleParams(params.appStyle);
  params.sideMenu = convertDrawerParamsToSideMenuParams(params.drawer);
  params.animateShow = convertAnimationType(params.animationType);

  newPlatformSpecific.startApp(params);
}

function addTabIcon(tab) {
  if (tab.icon) {
    const icon = resolveAssetSource(tab.icon);
    if (icon) {
      tab.icon = icon.uri;
    }
  }

  if (!tab.icon) {
    throw new Error("No icon defined for tab " + tab.screen);
  }
}

function convertAnimationType(animationType) {
  return animationType !== 'none';
}

function navigatorSetButtons(navigator, navigatorEventID, params) {
  if (params.rightButtons) {
    params.rightButtons.forEach(function(button) {
      button.enabled = !button.disabled;
      if (button.icon) {
        const icon = resolveAssetSource(button.icon);
        if (icon) {
          button.icon = icon.uri;
        }
      }
    });
  }
  const leftButton = getLeftButton(params);
  if (leftButton) {
    if (leftButton.icon) {
      const icon = resolveAssetSource(leftButton.icon);
      if (icon) {
        leftButton.icon = icon.uri;
      }
    }
  }
  newPlatformSpecific.setScreenTitleBarButtons(navigator.screenInstanceID, navigatorEventID, params.rightButtons, leftButton);
}

function navigatorSetTabBadge(navigator, params) {
  const badge = params.badge.toString();
  if (params.tabIndex >= 0) {
    newPlatformSpecific.setBottomTabBadgeByIndex(params.tabIndex, badge);
  } else {
    newPlatformSpecific.setBottomTabBadgeByNavigatorId(navigator.navigatorID, badge);
  }
}

function navigatorSetTitle(navigator, params) {
  newPlatformSpecific.setScreenTitleBarTitle(navigator.screenInstanceID, params.title);
}

function navigatorSetSubtitle(navigator, params) {
  newPlatformSpecific.setScreenTitleBarSubtitle(navigator.screenInstanceID, params.subtitle);
}

function navigatorSwitchToTab(navigator, params) {
  if (params.tabIndex >= 0) {
    newPlatformSpecific.selectBottomTabByTabIndex(params.tabIndex);
  } else {
    newPlatformSpecific.selectBottomTabByNavigatorId(navigator.navigatorID);
  }
}

function navigatorToggleDrawer(navigator, params) {
  const animated = !(params.animated === false);
  if (params.to) {
    const visible = params.to === 'open';
    newPlatformSpecific.setSideMenuVisible(animated, visible);
  } else {
    newPlatformSpecific.toggleSideMenuVisible(animated);
  }
}

function navigatorToggleNavBar(navigator, params) {
  const screenInstanceID = navigator.screenInstanceID;
  const visible = params.to === 'shown';
  const animated = !(params.animated === false);

  newPlatformSpecific.toggleTopBarVisible(
    screenInstanceID,
    visible,
    animated
  );
}

function navigatorToggleTabs(navigator, params) {
  const visibility = params.to === 'hidden';
  const animated = !(params.animated === false);
  newPlatformSpecific.toggleBottomTabsVisible(visibility, animated);
}

function showModal(params) {
  addNavigatorParams(params);
  addNavigatorButtons(params);
  addTitleBarBackButtonIfNeeded(params);
  addNavigationStyleParams(params);

  /*
   * adapt to new API
   */
  adaptTopTabs(params, params.navigatorID);
  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);
  adapted.overrideBackPress = params.overrideBackPress;

  newPlatformSpecific.showModal(adapted);
}

function dismissModal() {
  newPlatformSpecific.dismissTopModal();
}

function dismissAllModals(params) {
  newPlatformSpecific.dismissAllModals();
}

function addNavigatorParams(screen, navigator = null, idx = '') {
  screen.navigatorID = navigator ? navigator.navigatorID : _.uniqueId('navigatorID') + '_nav' + idx;
  screen.screenInstanceID = _.uniqueId('screenInstanceID');
  screen.navigatorEventID = screen.screenInstanceID + '_events';
}

function addNavigatorButtons(screen, sideMenuParams) {
  const Screen = Navigation.getRegisteredScreen(screen.screen);
  screen.navigatorButtons = _.cloneDeep(Screen.navigatorButtons);

  // Get image uri from image id
  const rightButtons = getRightButtons(screen);
  if (rightButtons) {
    rightButtons.forEach(function(button) {
      button.enabled = !button.disabled;
      if (button.icon) {
        const icon = resolveAssetSource(button.icon);
        if (icon) {
          button.icon = icon.uri;
        }
      }
    });
  }

  let leftButton = getLeftButton(screen);
  if (sideMenuParams && !leftButton) {
    leftButton = createSideMenuButton();
  }
  if (leftButton) {
    if (leftButton.icon) {
      const icon = resolveAssetSource(leftButton.icon);
      if (icon) {
        leftButton.icon = icon.uri;
      }
    }
  }

  const fab = getFab(screen);
  if (fab) {
    screen.fab = fab;
  }

  if (rightButtons) {
    screen.rightButtons = rightButtons;
  }
  if (leftButton) {
    screen.leftButton = leftButton;
  }
}

function getFab(screen) {
  if (screen.fab) {
    const fab = screen.fab;
    const collapsedIconUri = resolveAssetSource(fab.collapsedIcon);
    if (!collapsedIconUri) {
      return;
    }
    fab.collapsedIcon = collapsedIconUri.uri;
    if (fab.expendedIcon) {
      const expendedIconUri = resolveAssetSource(fab.expendedIcon);
      if (expendedIconUri) {
        fab.expendedIcon = expendedIconUri.uri;
      }
    }

    if (fab.actions) {
      _.forEach(fab.actions, (action) => {
        action.icon = resolveAssetSource(action.icon).uri;
        return action;
      });
    }

    return fab;
  }
}

function createSideMenuButton() {
  return {
    id: "sideMenu"
  };
}

function addTitleBarBackButtonIfNeeded(screen) {
  const leftButton = getLeftButton(screen);
  if (!leftButton) {
    screen.leftButton = {
      id: 'back'
    }
  }
}

function getLeftButton(screen) {
  const leftButton = getLeftButtonDeprecated(screen);
  if (leftButton) {
    return leftButton;
  }

  if (screen.navigatorButtons && screen.navigatorButtons.leftButtons) {
    return screen.navigatorButtons.leftButtons[0];
  }

  if (screen.leftButtons) {
    if (_.isArray(screen.leftButtons)) {
      return screen.leftButtons[0];
    } else {
      return screen.leftButtons;
    }
  }

  return null;
}

function getLeftButtonDeprecated(screen) {
  if (screen.navigatorButtons && screen.navigatorButtons.leftButton) {
    return screen.navigatorButtons.leftButton;
  }

  return screen.leftButton;
}

function getRightButtons(screen) {
  if (screen.navigatorButtons && screen.navigatorButtons.rightButtons) {
    return screen.navigatorButtons.rightButtons;
  }

  return screen.rightButtons;
}

function addNavigationStyleParams(screen) {
  const Screen = Navigation.getRegisteredScreen(screen.screen);
  screen.navigatorStyle = Object.assign({}, screen.navigatorStyle, Screen.navigatorStyle);
}

function showSnackbar(navigator, params) {
  return newPlatformSpecific.showSnackbar(params);
}

function showContextualMenu(navigator, params) {
  const contextualMenu = {
    buttons: [],
    backButton: {id: 'back'},
    navigationParams: {navigatorEventID: navigator.navigatorEventID}
  };

  params.rightButtons.forEach((button, index) => {
    const btn = {
      icon: resolveAssetSource(button.icon).uri,
      color: processColor(button.color),
      label: button.title,
      index
    };
    contextualMenu.buttons.push(btn);
  });

  newPlatformSpecific.showContextualMenu(navigator.screenInstanceID, contextualMenu, params.onButtonPressed);
}

function dismissContextualMenu() {
  newPlatformSpecific.dismissContextualMenu();
}

export default {
  startTabBasedApp,
  startSingleScreenApp,
  navigatorPush,
  navigatorPop,
  navigatorPopToRoot,
  navigatorResetTo,
  showModal,
  dismissModal,
  dismissAllModals,
  navigatorSetButtons,
  navigatorSetTabBadge,
  navigatorSetTitle,
  navigatorSetSubtitle,
  navigatorSwitchToTab,
  navigatorToggleDrawer,
  navigatorToggleTabs,
  navigatorToggleNavBar,
  showSnackbar,
  showContextualMenu,
  dismissContextualMenu
};
