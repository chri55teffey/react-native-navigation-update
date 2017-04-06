package com.reactnativenavigation;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.FrameLayout;

import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.reactnativenavigation.layout.Layout;
import com.reactnativenavigation.layout.impl.StackLayout;

public class NavigationActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler {
	private View contentView;
	private Layout layout;

	@Override
	protected void onCreate(@Nullable Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(new FrameLayout(this));
		app().activityLifecycle.onActivityCreated(this);
	}

	@Override
	protected void onResume() {
		super.onResume();
		app().activityLifecycle.onActivityResumed(this);
	}

	@Override
	protected void onPause() {
		super.onPause();
		app().activityLifecycle.onActivityPaused(this);
	}

	@Override
	protected void onDestroy() {
		super.onDestroy();
		app().activityLifecycle.onActivityDestroyed(this);
	}

	@Override
	public void setContentView(View contentView) {
		super.setContentView(contentView);
		this.contentView = contentView;
	}

	public void setLayout(Layout layout) {
		this.layout = layout;
	}

	public Layout getLayout() {
		return layout;
	}

	@Nullable
	public View getContentView() {
		return contentView;
	}

	@Override
	public void invokeDefaultOnBackPressed() {
		onBackPressed();
	}

	@Override
	public void onBackPressed() {
		if (layout instanceof StackLayout && ((StackLayout) layout).onBackPressed()) {
			// do nothing, layout pops
		} else {
			super.onBackPressed();
		}
	}

	private NavigationApplication app() {
		return ((NavigationApplication) getApplication());
	}
}
