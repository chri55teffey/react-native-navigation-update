package com.reactnativenavigation.viewcontrollers;

import android.app.*;
import android.support.annotation.*;

import com.reactnativenavigation.*;
import com.reactnativenavigation.mocks.*;
import com.reactnativenavigation.parse.*;
import com.reactnativenavigation.utils.*;

import org.junit.*;

import java.util.*;

import javax.annotation.Nullable;

import static org.assertj.core.api.Java6Assertions.*;
import static org.mockito.Mockito.*;

public class NavigatorTest extends BaseTest {
    private Activity activity;
    private Navigator uut;
    private ParentController parentController;
    private SimpleViewController child1;
    private ViewController child2;
    private ViewController child3;
    private ViewController child4;
    private ViewController child5;


    @Override
    public void beforeEach() {
        super.beforeEach();
        activity = newActivity();
        uut = new Navigator(activity);
        parentController = new StackController(activity, "stack");
        parentController.ensureViewIsCreated();
        child1 = new SimpleViewController(activity, "child1");
        child2 = new SimpleViewController(activity, "child2");
        child3 = new SimpleViewController(activity, "child3");
        child4 = new SimpleViewController(activity, "child4");
        child5 = new SimpleViewController(activity, "child5");
    }

    @Test
    public void setRoot_AddsChildControllerView() throws Exception {
        assertThat(uut.getView().getChildCount()).isZero();
        uut.setRoot(child1, new MockPromise());
        assertIsChildById(uut.getView(), child1.getView());
    }

    @Test
    public void setRoot_ReplacesExistingChildControllerViews() throws Exception {
        uut.setRoot(child1, new MockPromise());
        uut.setRoot(child2, new MockPromise());
        assertIsChildById(uut.getView(), child2.getView());
    }

    @Test
    public void hasUniqueId() throws Exception {
        assertThat(uut.getId()).startsWith("navigator");
        assertThat(new Navigator(activity).getId()).isNotEqualTo(uut.getId());
    }

    @Test
    public void push() throws Exception {
        StackController stackController = newStack();
        stackController.animatePush(child1, new MockPromise());
        uut.setRoot(stackController, new MockPromise());

        assertIsChildById(uut.getView(), stackController.getView());
        assertIsChildById(stackController.getView(), child1.getView());

        uut.push(child1.getId(), child2, new MockPromise());

        assertIsChildById(uut.getView(), stackController.getView());
        assertIsChildById(stackController.getView(), child2.getView());
    }

    @Test
    public void push_InvalidPushWithoutAStack_DoesNothing() throws Exception {
        uut.setRoot(child1, new MockPromise());
        uut.push(child1.getId(), child2, new MockPromise());
        assertIsChildById(uut.getView(), child1.getView());
    }

    @Test
    public void push_OnCorrectStackByFindingChildId() throws Exception {
        BottomTabsController bottomTabsController = newTabs();
        StackController stack1 = newStack();
        StackController stack2 = newStack();
        stack1.animatePush(child1, new MockPromise());
        stack2.animatePush(child2, new MockPromise());
        bottomTabsController.setTabs(Arrays.asList(stack1, stack2));
        uut.setRoot(bottomTabsController, new MockPromise());

        SimpleViewController newChild = new SimpleViewController(activity, "new child");
        uut.push(child2.getId(), newChild, new MockPromise());

        assertThat(stack1.getChildControllers()).doesNotContain(newChild);
        assertThat(stack2.getChildControllers()).contains(newChild);
    }

    @Test
    public void pop_InvalidDoesNothing() throws Exception {
        uut.pop("123", new MockPromise());
        uut.setRoot(child1, new MockPromise());
        uut.pop(child1.getId(), new MockPromise());
        assertThat(uut.getChildControllers()).hasSize(1);
    }

    @Test
    public void pop_FromCorrectStackByFindingChildId() throws Exception {
        BottomTabsController bottomTabsController = newTabs();
        StackController stack1 = newStack();
        StackController stack2 = newStack();
        bottomTabsController.setTabs(Arrays.asList(stack1, stack2));
        uut.setRoot(bottomTabsController, new MockPromise());
        stack1.animatePush(child1, new MockPromise());
        stack2.animatePush(child2, new MockPromise());
        stack2.animatePush(child3, new MockPromise() {
            @Override
            public void resolve(@Nullable Object value) {
                stack2.animatePush(child4, new MockPromise() {
                    @Override
                    public void resolve(@Nullable Object value) {
                        uut.pop("child4", new MockPromise());
                        assertThat(stack2.getChildControllers()).containsOnly(child2, child3);
                    }
                });
            }
        });
    }

    @Test
    public void popSpecific() throws Exception {
        BottomTabsController bottomTabsController = newTabs();
        StackController stack1 = newStack();
        StackController stack2 = newStack();
        stack1.animatePush(child1, new MockPromise());
        stack2.animatePush(child2, new MockPromise());
        stack2.animatePush(child3, new MockPromise());
        stack2.animatePush(child4, new MockPromise());
        bottomTabsController.setTabs(Arrays.asList(stack1, stack2));
        uut.setRoot(bottomTabsController, new MockPromise());

        uut.popSpecific(child2.getId(), new MockPromise());

        assertThat(stack2.getChildControllers()).containsOnly(child4, child3);
    }

    @Test
    public void popTo_FromCorrectStackUpToChild() throws Exception {
        BottomTabsController bottomTabsController = newTabs();
        StackController stack1 = newStack();
        StackController stack2 = newStack();
        bottomTabsController.setTabs(Arrays.asList(stack1, stack2));
        uut.setRoot(bottomTabsController, new MockPromise());

        stack1.animatePush(child1, new MockPromise());
        stack2.animatePush(child2, new MockPromise());
        stack2.animatePush(child3, new MockPromise());
        stack2.animatePush(child4, new MockPromise());
        stack2.animatePush(child5, new MockPromise() {
            @Override
            public void resolve(@Nullable Object value) {
                uut.popTo(child2.getId(), new MockPromise());
                assertThat(stack2.getChildControllers()).containsOnly(child2);
            }
        });
    }

    @Test
    public void popToRoot() throws Exception {
        BottomTabsController bottomTabsController = newTabs();
        StackController stack1 = newStack();
        StackController stack2 = newStack();
        bottomTabsController.setTabs(Arrays.asList(stack1, stack2));
        uut.setRoot(bottomTabsController, new MockPromise());

        stack1.animatePush(child1, new MockPromise());
        stack2.animatePush(child2, new MockPromise());
        stack2.animatePush(child3, new MockPromise());
        stack2.animatePush(child4, new MockPromise());
        stack2.animatePush(child5, new MockPromise() {
            @Override
            public void resolve(@Nullable Object value) {
                uut.popToRoot(child3.getId(), new MockPromise());

                assertThat(stack2.getChildControllers()).containsOnly(child2);
            }
        });
    }

    @Test
    public void handleBack_DelegatesToRoot() throws Exception {
        assertThat(uut.handleBack()).isFalse();
        ViewController spy = spy(child1);
        uut.setRoot(spy, new MockPromise());
        when(spy.handleBack()).thenReturn(true);
        assertThat(uut.handleBack()).isTrue();
        verify(spy, times(1)).handleBack();
    }

    @Test
    public void setOptions_CallsApplyNavigationOptions() {
        ComponentViewController componentVc = new SimpleComponentViewController(activity, "theId");
        componentVc.setParentController(parentController);
        assertThat(componentVc.getOptions().topBarOptions.title.get("")).isEmpty();
        uut.setRoot(componentVc, new MockPromise());

        Options options = new Options();
        options.topBarOptions.title = new Text("new title");

        uut.setOptions("theId", options);
        assertThat(componentVc.getOptions().topBarOptions.title.get()).isEqualTo("new title");
    }

    @Test
    public void setOptions_AffectsOnlyComponentViewControllers() {
        uut.setOptions("some unknown child id", new Options());
    }

    @NonNull
    private BottomTabsController newTabs() {
        return new BottomTabsController(activity, "tabsController");
    }

    @NonNull
    private StackController newStack() {
        return new StackController(activity, "stack" + CompatUtils.generateViewId());
    }

    @Test
    public void push_Promise() throws Exception {
        final StackController stackController = newStack();
        stackController.animatePush(child1, new MockPromise());
        uut.setRoot(stackController, new MockPromise());

        assertIsChildById(uut.getView(), stackController.getView());
        assertIsChildById(stackController.getView(), child1.getView());

        uut.push(child1.getId(), child2, new MockPromise() {
            @Override
            public void resolve(@Nullable Object value) {
                assertIsChildById(uut.getView(), stackController.getView());
                assertIsChildById(stackController.getView(), child2.getView());
            }
        });
    }

    @Test
    public void push_InvalidPushWithoutAStack_DoesNothing_Promise() throws Exception {
        uut.setRoot(child1, new MockPromise());
        uut.push(child1.getId(), child2, new MockPromise() {
            @Override
            public void reject(String code, Throwable e) {
                assertIsChildById(uut.getView(), child1.getView());
            }
        });

    }

    @Test
    public void pop_InvalidDoesNothing_Promise() throws Exception {
        uut.pop("123", new MockPromise());
        uut.setRoot(child1, new MockPromise());
        uut.pop(child1.getId(), new MockPromise() {
            @Override
            public void reject(Throwable reason) {
                assertThat(uut.getChildControllers()).hasSize(1);
            }
        });
    }

    @Test
    public void pop_FromCorrectStackByFindingChildId_Promise() throws Exception {
        BottomTabsController bottomTabsController = newTabs();
        StackController stack1 = newStack();
        final StackController stack2 = newStack();
        bottomTabsController.setTabs(Arrays.asList(stack1, stack2));
        uut.setRoot(bottomTabsController, new MockPromise());

        stack1.animatePush(child1, new MockPromise());
        stack2.animatePush(child2, new MockPromise());
        stack2.animatePush(child3, new MockPromise());
        stack2.animatePush(child4, new MockPromise() {
            @Override
            public void resolve(@Nullable Object value) {
                uut.pop("child4", new MockPromise());
                assertThat(stack2.getChildControllers()).containsOnly(child2, child3);
            }
        });
    }

    @Test
    public void pushIntoModal() throws Exception {
        StackController stackController = newStack();
        stackController.animatePush(child1, new MockPromise());
        uut.showModal(stackController, new MockPromise());
        uut.push(stackController.getId(), child2, new MockPromise());
        assertIsChildById(stackController.getView(), child2.getView());
    }
}
