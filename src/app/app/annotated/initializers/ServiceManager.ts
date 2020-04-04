const initializeServices = function()  {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = function() {
       const provider = originalMethod.apply(
          this,
          arguments
        );
        provider.initializeSM();
      };
      return descriptor;
    };
  };

  export = {
    initialize: initializeServices
  };
