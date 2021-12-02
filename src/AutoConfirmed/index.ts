exports.handler = (event: any, context: any, callback: any) => {
    event.response.autoConfirmUser = true;
    context.done(null, event);
  };  