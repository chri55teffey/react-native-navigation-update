package com.reactnativenavigation.layouts;

import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.RelativeLayout;

import com.aurelhubert.ahbottomnavigation.AHBottomNavigation;
import com.reactnativenavigation.params.ActivityParams;
import com.reactnativenavigation.params.ScreenParams;
import com.reactnativenavigation.params.TitleBarButtonParams;
import com.reactnativenavigation.params.TitleBarLeftButtonParams;
import com.reactnativenavigation.screens.ScreenStack;
import com.reactnativenavigation.views.BottomTabs;

import java.util.List;

import static android.view.ViewGroup.LayoutParams.MATCH_PARENT;
import static android.view.ViewGroup.LayoutParams.WRAP_CONTENT;

public class BottomTabsLayout extends RelativeLayout implements Layout, AHBottomNavigation.OnTabSelectedListener {

    private final AppCompatActivity activity;
    private ActivityParams params;
    private BottomTabs bottomTabs;
    private ScreenStack[] screenStacks;
    private int currentStackIndex = 0;

    public BottomTabsLayout(AppCompatActivity activity, ActivityParams params) {
        super(activity);
        this.activity = activity;
        this.params = params;
        screenStacks = new ScreenStack[params.tabParams.size()];
        createLayout();
    }

    private void createLayout() {
        createBottomTabs();
        addBottomTabsToScreen();
        addScreenStacks();
        showInitialScreenStack();
    }

    private void addScreenStacks() {
        for (int i = 0; i < screenStacks.length; i++) {
            createAndAddScreens(i);
        }
    }

    private void createAndAddScreens(int position) {
        ScreenStack newStack = new ScreenStack(activity, this, this);
        ScreenParams screenParams = params.tabParams.get(position);
        newStack.pushInitialScreen(screenParams, createScreenLayoutParams(screenParams));
        screenStacks[position] = newStack;
    }

    @NonNull
    private LayoutParams createScreenLayoutParams(ScreenParams params) {
        LayoutParams lp = new LayoutParams(MATCH_PARENT, MATCH_PARENT);
        if (params.styleParams.drawScreenAboveBottomTabs) {
            lp.addRule(RelativeLayout.ABOVE, bottomTabs.getId());
        }
        return lp;
    }

    private void createBottomTabs() {
        bottomTabs = new BottomTabs(getContext());
        bottomTabs.addTabs(params.tabParams, this);
    }

    private void addBottomTabsToScreen() {
        LayoutParams lp = new LayoutParams(MATCH_PARENT, WRAP_CONTENT);
        lp.addRule(ALIGN_PARENT_BOTTOM);
        addView(bottomTabs, lp);
    }

    private void showInitialScreenStack() {
        showStackAndUpdateStyle(screenStacks[0]);
    }

    @Override
    public View asView() {
        return this;
    }

    @Override
    public boolean onBackPressed() {
        if (getCurrentScreenStack().canPop()) {
            getCurrentScreenStack().pop(true);
            setBottomTabsStyleFromCurrentScreen();
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void setTopBarVisible(String screenInstanceId, boolean hidden, boolean animated) {
        for (int i = 0; i < bottomTabs.getItemsCount(); i++) {
            screenStacks[i].setScreenTopBarVisible(screenInstanceId, hidden, animated);
        }
    }

    public void setBottomTabsVisible(boolean hidden, boolean animated) {
        bottomTabs.setVisibility(hidden, animated);
    }

    @Override
    public void setTitleBarTitle(String screenInstanceId, String title) {
        for (int i = 0; i < bottomTabs.getItemsCount(); i++) {
            screenStacks[i].setScreenTitleBarTitle(screenInstanceId, title);
        }
    }

    @Override
    public void setTitleBarRightButtons(String screenInstanceId, String navigatorEventId, List<TitleBarButtonParams> titleBarButtons) {
        for (int i = 0; i < bottomTabs.getItemsCount(); i++) {
            screenStacks[i].setScreenTitleBarRightButtons(screenInstanceId, navigatorEventId, titleBarButtons);
        }
    }

    @Override
    public void setTitleBarLeftButton(String screenInstanceId, String navigatorEventId, TitleBarLeftButtonParams titleBarLeftButtonParams) {
        for (int i = 0; i < bottomTabs.getItemsCount(); i++) {
            screenStacks[i].setScreenTitleBarLeftButton(screenInstanceId, navigatorEventId, titleBarLeftButtonParams);
        }
    }

    @Override
    public void push(ScreenParams screenParams) {
        getCurrentScreenStack().push(screenParams, createScreenLayoutParams(screenParams));
        bottomTabs.setStyleFromScreen(screenParams.styleParams);
    }

    @Override
    public void pop(ScreenParams screenParams) {
        getCurrentScreenStack().pop(screenParams.animateScreenTransitions, new ScreenStack.OnScreenPop() {
            @Override
            public void onScreenPopAnimationEnd() {
                setBottomTabsStyleFromCurrentScreen();
            }
        });
    }

    @Override
    public void popToRoot(ScreenParams params) {
        getCurrentScreenStack().popToRoot(params.animateScreenTransitions);
        setBottomTabsStyleFromCurrentScreen();
    }

    @Override
    public void newStack(ScreenParams params) {
        ScreenStack currentScreenStack = getCurrentScreenStack();
        currentScreenStack.destroy();
        removeView(currentScreenStack.peek());

        ScreenStack newStack = new ScreenStack(activity, this, this);
        LayoutParams lp = createScreenLayoutParams(params);
        newStack.pushInitialScreen(params, lp);
        screenStacks[currentStackIndex] = newStack;

        bottomTabs.setStyleFromScreen(params.styleParams);
    }

    @Override
    public void destroy() {
        for (ScreenStack screenStack : screenStacks) {
            screenStack.destroy();
        }
    }

    @Override
    public boolean onTabSelected(int position, boolean wasSelected) {
        hideCurrentStack();

        ScreenStack newStack = screenStacks[position];
        showStackAndUpdateStyle(newStack);
        currentStackIndex = position;

        return true;
    }

    private void showStackAndUpdateStyle(ScreenStack newStack) {
        newStack.showFirstScreen();
        bottomTabs.setStyleFromScreen(newStack.getCurrentScreenStyleParams());
    }

    private void hideCurrentStack() {
        ScreenStack currentScreenStack = getCurrentScreenStack();
        currentScreenStack.hideScreen();
    }

    private ScreenStack getCurrentScreenStack() {
        return screenStacks[currentStackIndex];
    }

    private void setBottomTabsStyleFromCurrentScreen() {
        bottomTabs.setStyleFromScreen(getCurrentScreenStack().getCurrentScreenStyleParams());
    }

    @Override
    public boolean onTitleBarBackButtonClick() {
        if (getCurrentScreenStack().canPop()) {
            getCurrentScreenStack().pop(true, new ScreenStack.OnScreenPop() {
                @Override
                public void onScreenPopAnimationEnd() {
                    setBottomTabsStyleFromCurrentScreen();
                }
            });
            return true;
        }

        return false;
    }

    @Override
    public void onSideMenuButtonClick() {

    }
}
