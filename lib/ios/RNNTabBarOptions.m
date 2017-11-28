#import "RNNTabBarOptions.h"

@implementation RNNTabBarOptions

-(instancetype)init {
	return [self initWithDict:@{}];
}

-(instancetype)initWithDict:(NSDictionary *)tabBarOptions {
	self = [super init];
	
	self.hidden = [tabBarOptions valueForKey:@"hidden"];
	self.animateHide = [tabBarOptions valueForKey:@"animateHide"];
	self.tabBadge = [tabBarOptions valueForKey:@"tabBadge"];
	self.currentTabIndex = [tabBarOptions valueForKey:@"currentTabIndex"];
	
	return self;
}

-(void)mergeWith:(NSDictionary *)otherOptions {
	for (id key in otherOptions) {
		[self setValue:[otherOptions objectForKey:key] forKey:key];
	}
}
@end
