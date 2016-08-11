import React, {Component} from 'react';
import {AppRegistry, NativeModules} from 'react-native';
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
  addNavigatorButtons(screen);
  addNavigationStyleParams(screen);
  screen.passProps = params.passProps;

  //const drawer = setupDrawer(params.drawer);

  /*
   * adapt to new API
   */
  adaptTopTabs(screen);
  screen.screenId = screen.screen;
  params.screen = adaptNavigationStyleToScreenStyle(screen);
  params.screen = adaptNavigationParams(screen);
  params.appStyle = convertStyleParams(params.appStyle);

  newPlatformSpecific.startApp(params);
}

function adaptTopTabs(screen) {
  _.forEach(_.get(screen, 'topTabs'), (tab) => {
    addNavigatorParams(tab);
    adaptNavigationParams(tab);
  });
}

function navigatorPush(navigator, params) {
  addNavigatorParams(params, navigator);
  addNavigatorButtons(params);
  addTitleBarBackButtonIfNeeded(params);
  addNavigationStyleParams(params);

  adaptTopTabs(params);

  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);

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

  adaptTopTabs(params);

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

  return {
    statusBarColor: originalStyleObject.statusBarColor,
    topBarColor: originalStyleObject.navBarBackgroundColor,
    titleBarHidden: originalStyleObject.navBarHidden,
    titleBarTitleColor: originalStyleObject.navBarTextColor,
    titleBarButtonColor: originalStyleObject.navBarButtonColor,
    backButtonHidden: originalStyleObject.backButtonHidden,
    topTabsHidden: originalStyleObject.topTabsHidden,

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

    navigationBarColor: originalStyleObject.navigationBarColor
  }
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
    addNavigatorButtons(tab);
    addNavigationStyleParams(tab);
    addTabIcon(tab);
    tab.passProps = params.passProps;

    adaptTopTabs(tab);

    tab.screenId = tab.screen;

    let newtab = adaptNavigationStyleToScreenStyle(tab);
    newtab = adaptNavigationParams(tab);
    newTabs.push(newtab);
  });
  params.tabs = newTabs;

  params.appStyle = convertStyleParams(params.appStyle);
  // TODO: add drawer params

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
  if (params.leftButton) {
    if (params.leftButton.icon) {
      const icon = resolveAssetSource(params.leftButton.icon);
      if (icon) {
        params.leftButton.icon = icon.uri;
      }
    }
  }
  newPlatformSpecific.setScreenTitleBarButtons(navigator.screenInstanceID, navigatorEventID, params.rightButtons, params.leftButton);
}

function navigatorSetTabBadge(navigator, params) {
  //RctActivity.setTabBadge({
  //  tabIndex: params.tabIndex,
  //  badge: params.badge
  //});
}

function navigatorSetTitle(navigator, params) {
  newPlatformSpecific.setScreenTitleBarTitle(navigator.screenInstanceID, params.title);
}

function navigatorSwitchToTab(navigator, params) {
  //RctActivity.switchToTab({
  //  navigatorID: navigator.navigatorID,
  //  tabIndex: params.tabIndex
  //});
}

function navigatorToggleDrawer(navigator, params) {
  //RctActivity.toggleDrawer({
  //  side: params.side,
  //  animated: !(params.animated === false),
  //  to: params.to || ''
  //});
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
  addNavigationStyleParams(params);

  /*
   * adapt to new API
   */
  adaptTopTabs(params);
  params.screenId = params.screen;
  let adapted = adaptNavigationStyleToScreenStyle(params);
  adapted = adaptNavigationParams(adapted);

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

function addNavigatorButtons(screen) {
  const Screen = Navigation.getRegisteredScreen(screen.screen);
  Object.assign(screen, Screen.navigatorButtons);

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

  const leftButton = getLeftButton(screen);
  if (leftButton) {
    if (leftButton.icon) {
      const icon = resolveAssetSource(leftButton.icon);
      if (icon) {
        leftButton.icon = icon.uri;
      }
    }
  }

  if (rightButtons) {
    screen.rightButtons = rightButtons;
  }
  if (leftButton) {
    screen.leftButton = leftButton;
  }
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

function setupDrawer(drawerParams) {
  const drawer = Object.assign({}, drawerParams);
  [drawer.left, drawer.right].forEach(side => {
    if (!side) {
      return;
    }
    const icon = resolveAssetSource(side.icon);
    if (icon) {
      side.icon = icon.uri;
    }
  });
  if (drawer.disableOpenGesture === undefined) {
    drawer.disableOpenGesture = false;
  }

  return drawer;
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
  navigatorSwitchToTab,
  navigatorToggleDrawer,
  navigatorToggleTabs,
  navigatorToggleNavBar
};
