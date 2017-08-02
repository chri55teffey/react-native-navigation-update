#import "RNNNavigationOptions.h"
#import <React/RCTConvert.h>

@implementation RNNNavigationOptions


-(instancetype)initWithDict:(NSDictionary *)navigationOptions {
	self = [super init];
	self.topBarBackgroundColor = [navigationOptions objectForKey:@"topBarBackgroundColor"];
	self.statusBarHidden = [navigationOptions objectForKey:@"statusBarHidden"];
	self.title = [navigationOptions objectForKey:@"title"];
	self.topBarTextColor = [navigationOptions objectForKey:@"topBarTextColor"];
	return self;
}

-(void)setOptionsDynamically:(NSDictionary *)dynamicOptions {
	for(id key in dynamicOptions) {
		[self setValue:[dynamicOptions objectForKey:key] forKey:key];
	}
}

-(void)apply:(UIViewController*)viewController{
	if (self.topBarBackgroundColor) {
		UIColor* backgroundColor = [RCTConvert UIColor:self.topBarBackgroundColor];
		viewController.navigationController.navigationBar.barTintColor = backgroundColor;
	}
	if (self.title) {
		viewController.navigationItem.title = self.title;
	}
	if (self.topBarTextColor) {
		UIColor* textColor = [RCTConvert UIColor:self.topBarTextColor];
		viewController.navigationController.navigationBar.titleTextAttributes = @{NSForegroundColorAttributeName:textColor};
	}
}




@end
