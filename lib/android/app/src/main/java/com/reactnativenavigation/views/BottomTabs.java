package com.reactnativenavigation.views;

import android.annotation.SuppressLint;
import android.content.Context;

import com.aurelhubert.ahbottomnavigation.AHBottomNavigation;
import com.reactnativenavigation.parse.BottomTabsOptions;
import com.reactnativenavigation.parse.Text;
import com.reactnativenavigation.utils.CompatUtils;

@SuppressLint("ViewConstructor")
public class BottomTabs extends AHBottomNavigation {
    public BottomTabs(Context context, BottomTabsOptions bottomTabsOptions) {
        super(context);
        setId(CompatUtils.generateViewId());
        setTestId(bottomTabsOptions.testId);
    }

    private void setTestId(Text testId) {
        if (testId.hasValue()) setTag(testId.get());
    }
}
