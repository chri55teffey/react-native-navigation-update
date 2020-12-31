#import "BottomTabsBasePresenter.h"
#import "RNNBottomTabsController.h"

@implementation BottomTabsBasePresenter

- (void)applyOptionsOnInit:(RNNNavigationOptions *)options {
    [super applyOptionsOnInit:options];
    UITabBarController *bottomTabs = self.tabBarController;
    RNNNavigationOptions *withDefault = [options withDefault:[self defaultOptions]];
    [bottomTabs setCurrentTabIndex:[withDefault.bottomTabs.currentTabIndex withDefault:0]];
    if (withDefault.bottomTabs.currentTabId.hasValue) {
        [bottomTabs setCurrentTabID:withDefault.bottomTabs.currentTabId.get];
    }
    if ([[withDefault.bottomTabs.titleDisplayMode withDefault:@"alwaysShow"]
            isEqualToString:@"alwaysHide"]) {
        [bottomTabs centerTabItems];
    }
}

- (void)applyOptions:(RNNNavigationOptions *)options {
    RNNBottomTabsController *bottomTabs = self.tabBarController;
    RNNNavigationOptions *withDefault = [options withDefault:[self defaultOptions]];

    [bottomTabs setTabBarTestID:[withDefault.bottomTabs.testID withDefault:nil]];
    [bottomTabs setTabBarVisible:[withDefault.bottomTabs.visible withDefault:YES]];

    [bottomTabs.view setBackgroundColor:[withDefault.layout.backgroundColor withDefault:nil]];
    [self applyBackgroundColor:[withDefault.bottomTabs.backgroundColor withDefault:nil]
                   translucent:[withDefault.bottomTabs.translucent withDefault:NO]];
    [bottomTabs setTabBarHideShadow:[withDefault.bottomTabs.hideShadow withDefault:NO]];
    [bottomTabs setTabBarStyle:[RCTConvert UIBarStyle:[withDefault.bottomTabs.barStyle
                                                          withDefault:@"default"]]];
}

- (void)mergeOptions:(RNNNavigationOptions *)mergeOptions
     resolvedOptions:(RNNNavigationOptions *)currentOptions {
    [super mergeOptions:mergeOptions resolvedOptions:currentOptions];
    RNNBottomTabsController *bottomTabs = self.tabBarController;

    if (mergeOptions.bottomTabs.currentTabIndex.hasValue) {
        [bottomTabs setCurrentTabIndex:mergeOptions.bottomTabs.currentTabIndex.get];
        [mergeOptions.bottomTabs.currentTabIndex consume];
    }

    if (mergeOptions.bottomTabs.currentTabId.hasValue) {
        [bottomTabs setCurrentTabID:mergeOptions.bottomTabs.currentTabId.get];
        [mergeOptions.bottomTabs.currentTabId consume];
    }

    if (mergeOptions.bottomTabs.testID.hasValue) {
        [bottomTabs setTabBarTestID:mergeOptions.bottomTabs.testID.get];
    }

    if (mergeOptions.bottomTabs.backgroundColor.hasValue) {
        [self setTabBarBackgroundColor:mergeOptions.bottomTabs.backgroundColor.get];
    }

    if (mergeOptions.bottomTabs.barStyle.hasValue) {
        [bottomTabs setTabBarStyle:[RCTConvert UIBarStyle:mergeOptions.bottomTabs.barStyle.get]];
    }

    if (mergeOptions.bottomTabs.translucent.hasValue) {
        [bottomTabs setTabBarTranslucent:mergeOptions.bottomTabs.translucent.get];
    }

    if (mergeOptions.bottomTabs.hideShadow.hasValue) {
        [bottomTabs setTabBarHideShadow:mergeOptions.bottomTabs.hideShadow.get];
    }

    if (mergeOptions.bottomTabs.visible.hasValue) {
        if (mergeOptions.bottomTabs.animate.hasValue) {
            [bottomTabs setTabBarVisible:mergeOptions.bottomTabs.visible.get
                                animated:[mergeOptions.bottomTabs.animate withDefault:NO]];
        } else {
            [bottomTabs setTabBarVisible:mergeOptions.bottomTabs.visible.get animated:NO];
        }
    }

    if (mergeOptions.layout.backgroundColor.hasValue) {
        [bottomTabs.view setBackgroundColor:mergeOptions.layout.backgroundColor.get];
    }
}

- (RNNBottomTabsController *)tabBarController {
    return (RNNBottomTabsController *)self.boundViewController;
}

- (UITabBar *)tabBar {
    return self.tabBarController.tabBar;
}

- (void)applyBackgroundColor:(UIColor *)backgroundColor translucent:(BOOL)translucent {
}

- (void)setTabBarBackgroundColor:(UIColor *)backgroundColor {
}

- (void)setTabBarTranslucent:(BOOL)translucent {
}

@end
