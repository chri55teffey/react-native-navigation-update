package com.reactnativenavigation.core.objects;

import android.support.annotation.ColorInt;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by guyc on 02/04/16.
 */
public class Screen extends JsonObject implements Serializable {
    private static final long serialVersionUID = -1033475305421107791L;

    private static final String KEY_TITLE = "title";
    private static final String KEY_SCREEN = "screen";
    public static final String KEY_SCREEN_INSTANCE_ID = "screenInstanceID";
    public static final String KEY_NAVIGATOR_ID = "navigatorID";
    public static final String KEY_NAVIGATOR_EVENT_ID = "navigatorEventID";
    private static final String KEY_ICON = "icon";
    private static final String KEY_RIGHT_BUTTONS = "rightButtons";
    private static final String KEY_TOOL_BAR_STYLE = "navigatorStyle";
    private static final String KEY_STATUS_BAR_COLOR = "statusBarColor";
    private static final String KEY_TOOL_BAR_COLOR = "toolBarColor";
    private static final String KEY_NAVIGATION_BAR_COLOR = "navigationBarColor";
    private static final String KEY_BUTTONS_TINT_COLOR = "buttonsTint";
    private static final String KEY_TITLE_COLOR = "titleColor";
    private static final String KEY_TAB_NORMAL_TEXT_COLOR = "tabNormalTextColor";
    private static final String KEY_TAB_SELECTED_TEXT_COLOR = "tabSelectedTextColor";
    private static final String KEY_TAB_INDICATOR_COLOR = "tabIndicatorColor";

    public String title;
    public String screenId;
    public String screenInstanceId;
    public String navigatorId;
    public String navigatorEventId;
    public int icon;
    public ArrayList<Button> buttons;

    // Navigation styling
    @Nullable @ColorInt public Integer toolBarColor;
    @Nullable @ColorInt public Integer statusBarColor;
    @Nullable @ColorInt public Integer navigationBarColor;
    @Nullable @ColorInt public Integer buttonsTintColor;
    @Nullable @ColorInt public Integer titleColor;
    @Nullable @ColorInt public Integer tabNormalTextColor;
    @Nullable @ColorInt public Integer tabSelectedTextColor;
    @Nullable @ColorInt public Integer tabIndicatorColor;

    @NonNull
    public List<Button> getButtons() {
        return buttons == null ? Collections.EMPTY_LIST : buttons;
    }

    public Screen(ReadableMap screen) {
        title = getString(screen, KEY_TITLE);
        screenId = getString(screen, KEY_SCREEN);
        screenInstanceId = getString(screen, KEY_SCREEN_INSTANCE_ID);
        navigatorId = getString(screen, KEY_NAVIGATOR_ID);
        navigatorEventId = getString(screen, KEY_NAVIGATOR_EVENT_ID);
        icon = getInt(screen, KEY_ICON);

        setButtons(screen);
        setToolbarStyle(screen);
    }

    private void setButtons(ReadableMap screen) {
        if (screen.hasKey(KEY_RIGHT_BUTTONS)) {
            buttons = new ArrayList<>();
            ReadableArray rightButtons = screen.getArray(KEY_RIGHT_BUTTONS);
            for (int i = 0; i < rightButtons.size(); i++) {
                buttons.add(new Button(rightButtons.getMap(i)));
            }
        }
    }

    public void setToolbarStyle(ReadableMap screen) {
        ReadableMap style = getMap(screen, KEY_TOOL_BAR_STYLE);
        if (style != null) {
            toolBarColor = getColor(style, KEY_TOOL_BAR_COLOR);
            statusBarColor = getColor(style, KEY_STATUS_BAR_COLOR);
            navigationBarColor = getColor(style, KEY_NAVIGATION_BAR_COLOR);
            buttonsTintColor = getColor(style, KEY_BUTTONS_TINT_COLOR);
            titleColor = getColor(style, KEY_TITLE_COLOR);
            tabNormalTextColor = getColor(style, KEY_TAB_NORMAL_TEXT_COLOR);
            tabSelectedTextColor = getColor(style, KEY_TAB_SELECTED_TEXT_COLOR);
            tabIndicatorColor = getColor(style, KEY_TAB_INDICATOR_COLOR);
        }
    }
}
