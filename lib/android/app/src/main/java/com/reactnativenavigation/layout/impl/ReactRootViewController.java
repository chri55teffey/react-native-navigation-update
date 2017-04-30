package com.reactnativenavigation.layout.impl;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.reactnativenavigation.react.NavigationEvent;
import com.reactnativenavigation.viewcontrollers.ViewController;

public class ReactRootViewController extends ViewController implements View.OnAttachStateChangeListener {

	private final String id;
	private final String name;
	private final ReactInstanceManager reactInstanceManager;

	public ReactRootViewController(final Activity activity, final String id, final String name, final ReactInstanceManager reactInstanceManager) {
		super(activity);
		this.id = id;
		this.name = name;
		this.reactInstanceManager = reactInstanceManager;
	}

//	@Override
//	public void destroy() {
//		reactRootView.unmountReactApplication();
//	}

	@Override
	public void onViewAttachedToWindow(final View v) {
		//
	}

	@Override
	public void onViewDetachedFromWindow(final View v) {
		onStop();
	}

	private void onStart() {
		new NavigationEvent(reactInstanceManager.getCurrentReactContext()).containerStart(id);
	}

	private void onStop() {
		new NavigationEvent(reactInstanceManager.getCurrentReactContext()).containerStop(id);
	}

	@Override
	protected View createView() {
		ReactRootView reactRootView = new ReactRootView(getActivity());
		reactRootView.addOnAttachStateChangeListener(this);
		Bundle opts = new Bundle();
		opts.putString("id", this.id);
		reactRootView.startReactApplication(this.reactInstanceManager, this.name, opts);
		reactRootView.setEventListener(new ReactRootView.ReactRootViewEventListener() {
			@Override
			public void onAttachedToReactInstance(final ReactRootView reactRootView) {
				reactRootView.setEventListener(null);
				onStart();
			}
		});
		return reactRootView;
	}
}
