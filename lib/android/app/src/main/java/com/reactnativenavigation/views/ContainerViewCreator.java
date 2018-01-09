package com.reactnativenavigation.views;

import android.app.Activity;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.uimanager.UIManagerModule;
import com.reactnativenavigation.react.NavigationModule;
import com.reactnativenavigation.react.ReactContainerViewCreator;
import com.reactnativenavigation.viewcontrollers.ContainerViewController;

public class ContainerViewCreator implements ContainerViewController.ReactViewCreator {

    private ReactInstanceManager instanceManager;

    public ContainerViewCreator(ReactInstanceManager instanceManager) {
        this.instanceManager = instanceManager;
	}

	@Override
	public ContainerViewController.IReactView create(Activity activity, String containerId, String containerName) {
        ContainerViewController.IReactView reactView = new ReactContainerViewCreator(instanceManager).create(activity, containerId, containerName);
        return new ContainerLayout(activity, reactView, instanceManager.getCurrentReactContext().getNativeModule(UIManagerModule.class).getEventDispatcher());
	}
}
