import React, {Component} from 'react';
import {AppRegistry, NativeModules} from 'react-native';
import _ from 'lodash';

import Navigation from './Navigation';

const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');

function startApp(params) {
  let screen = params.screen;
  if (!screen.screenId) {
    console.error('startApp(params): screenId property must be supplied');
    return;
  }

  screen.screenInstanceId = _.uniqueId('screenInstanceId');
  params.screen = convertNavigationStyleToScreenStyle(screen);

  NativeModules.NavigationReactModule.startApp(params);
}

function convertNavigationStyleToScreenStyle(screen) {
  const navigatorStyle = screen.navigatorStyle;
  if (!navigatorStyle) {
    return screen;
  }

  screen.styleParams = {
    statusBarColor: navigatorStyle.statusBarColor,
    topBarColor: navigatorStyle.toolBarColor,
    navigationBarColor: navigatorStyle.navigationBarColor,
    titleBarHidden: navigatorStyle.navBarHidden,
    backButtonHidden: navigatorStyle.backButtonHidden,
    topTabsHidden: navigatorStyle.topTabsHidden,
    bottomTabsHidden: navigatorStyle.tabBarHidden,
    bottomTabsHiddenOnScroll: navigatorStyle.bottomTabsHiddenOnScroll
  };

  screen = _.omit(screen, ['navigatorStyle']);
  return screen;
}

module.exports = {
  startApp
};
