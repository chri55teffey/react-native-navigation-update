#import "RNNNavigationStackManager.h"

@implementation RNNNavigationStackManager {
	RNNStore *_store;
}

-(instancetype)initWithStore:(RNNStore*)store {
	self = [super init];
	_store = store;
	return self;
}

-(void)push:(UIViewController *)newTop onTop:(NSString *)containerId {
	UIViewController *vc = [_store findContainerForId:containerId];
	[[vc navigationController] pushViewController:newTop animated:YES];
}

-(void)pop:(NSString *)containerId {
	UIViewController* vc = [_store findContainerForId:containerId];
	UINavigationController* nvc = [vc navigationController];
	if ([nvc topViewController] == vc) {
		[nvc popViewControllerAnimated:YES];
	} else {
		NSMutableArray * vcs = nvc.viewControllers.mutableCopy;
		[vcs removeObject:vc];
		[nvc setViewControllers:vcs animated:YES];
	}
	[_store removeContainer:containerId];
}

-(void) popTo:(NSString*)containerId toContainerId:(NSString*)toContainerId {
	UIViewController *vc = [_store findContainerForId:containerId];
	UINavigationController *nvc = [vc navigationController];
	
	UIViewController *toVC = [_store findContainerForId:toContainerId];
	
	if (vc && toVC) {
		[nvc popToViewController:toVC animated:YES];
		// TODO - remove the poped vcs from store
	}
}

@end
