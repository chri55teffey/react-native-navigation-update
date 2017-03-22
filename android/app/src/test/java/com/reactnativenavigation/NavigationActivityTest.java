package com.reactnativenavigation;

import android.view.View;

import org.junit.Test;
import org.robolectric.Robolectric;

import static org.assertj.core.api.Java6Assertions.assertThat;

public class NavigationActivityTest extends BaseTest {
	@Test
	public void holdsContentView() throws Exception {
		NavigationActivity activity = Robolectric.setupActivity(NavigationActivity.class);
		assertThat(activity.getContentView()).isNull();
		View view = new View(activity);
		activity.setContentView(view);
		assertThat(activity.getContentView()).isSameAs(view);
	}

	@Test
	public void reportsLifecycleEventsToDelegate() throws Exception {
	}
}
