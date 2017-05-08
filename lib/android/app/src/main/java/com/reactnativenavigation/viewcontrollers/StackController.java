package com.reactnativenavigation.viewcontrollers;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.view.ViewGroup;
import android.widget.FrameLayout;

public class StackController extends ViewController {
	private final IndexedStack<ViewController> stack = new IndexedStack<>();

	public StackController(final Activity activity, String id) {
		super(activity, id);
	}

	public void push(final ViewController child) {
		final ViewController previousTop = peek();

		child.setStackController(this);
		stack.push(child.getId(), child);

		getView().addView(child.getView());
		if (previousTop != null) {
			getView().removeView(previousTop.getView());
		}
	}

	public boolean canPop() {
		return stack.size() > 1;
	}

	public void pop() {
		if (!canPop()) {
			return;
		}
		ViewController poppedController = stack.pop();
		getView().removeView(poppedController.getView());

		ViewController previousTop = peek();
		getView().addView(previousTop.getView());
	}

	public void pop(final ViewController childController) {
		if (stack.isTop(childController.getId())) {
			pop();
		} else {
			stack.remove(childController.getId());
		}
	}

	public ViewController peek() {
		return stack.peek();
	}

	public int size() {
		return stack.size();
	}

	public boolean isEmpty() {
		return stack.isEmpty();
	}

	@Override
	public boolean handleBack() {
		if (canPop()) {
			pop();
			return true;
		} else {
			return false;
		}
	}

	@NonNull
	@Override
	public ViewGroup getView() {
		return (ViewGroup) super.getView();
	}

	@NonNull
	@Override
	protected ViewGroup createView() {
		return new FrameLayout(getActivity());
	}

	@Nullable
	@Override
	public StackController getStackController() {
		return this;
	}

	public void popTo(final ViewController viewController) {
		if (!stack.containsId(viewController.getId())) {
			return;
		}
		while (!stack.isTop(viewController.getId())) {
			pop();
		}
	}

	public void popToRoot() {
		while (canPop()) {
			pop();
		}
	}

	public ViewController getChildById(final String id) {
		return stack.get(id);
	}

	boolean containsId(String id) {
		return stack.containsId(id);
	}
}
