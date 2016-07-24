package com.reactnativenavigation.views;

import android.content.Context;
import android.os.Bundle;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.params.ScreenParams;
import com.reactnativenavigation.react.ReactViewHacks;

public class ContentView extends ReactRootView {

    private final String screenId;
    private final Bundle passProps;
    private Bundle navigationParams;
    private final ScrollDirectionListener.OnScrollChanged scrollListener;

    public ContentView(Context context, ScreenParams screenParams, ScrollDirectionListener.OnScrollChanged scrollListener) {
        super(context);
        this.screenId = screenParams.screenId;
        this.passProps = screenParams.passProps;
        this.navigationParams = screenParams.navigationParams;
        this.scrollListener = scrollListener;
    }

    public void init() {
        ReactInstanceManager react = NavigationApplication.instance.getNavigationReactInstance().getReactInstanceManager();
        startReactApplication(react, screenId, mergePropsAndNavigationParams());
        new ScrollViewAttacher(this, scrollListener).attach();
    }

    private Bundle mergePropsAndNavigationParams() {
        if (passProps != null) {
            navigationParams.putAll(passProps);
        }
        return navigationParams;
    }

    public void preventUnmountOnDetachedFromWindow() {
        ReactViewHacks.preventUnmountOnDetachedFromWindow(this);
    }

    public void ensureUnmountOnDetachedFromWindow() {
        ReactViewHacks.ensureUnmountOnDetachedFromWindow(this);
    }
}
