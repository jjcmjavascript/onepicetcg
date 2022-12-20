class ParamsFormatter {
  constructor() {
    this.params = {};
    this.request = {};
    this.except = [];
    this.allowed = [];
  }

  iterate(object = {}) {
    Object.keys(object).forEach((key) => {
      if (
        this.except.includes(key) ||
        (this.allowed.length > 0 && !this.allowed.includes(key))
      )
        return;

      if (object[key] != undefined && object[key] !== null) {
        this.params[key] = object[key];
      }
    });

    return this;
  }

  setAllowed(allowed = []) {
    if (!Array.isArray(allowed)) {
      throw Error("Allowed must be an array");
    }

    this.allowed = allowed;

    return this;
  }

  setDenied(except = []) {
    if (!Array.isArray(except)) {
      throw Error("Allowed must be an array");
    }

    this.except = except;

    return this;
  }

  fromBody() {
    this.iterate(this.request.body);

    return this;
  }

  fromParams() {
    this.iterate(this.request.params);

    return this;
  }

  fromQuery() {
    this.iterate(this.request.query);

    return this;
  }

  validateRequest(request) {
    if (typeof request != "object") throw Error("Invalid request");

    return this;
  }

  setRequest(request) {
    this.request = request;

    return this;
  }

  validateAndSetRequest(request) {
    this.validateRequest(request).setRequest(request);

    return this;
  }

  fromAll(options = {}) {
    return this.setDenied(options.denied)
      .setAllowed(options.allowed)
      .fromBody()
      .fromParams()
      .fromQuery()
      .getRenamedParams(options.newNames)
      .get();
  }

  getRenamedParams(newNames = {}) {
    const currentNames = Object.keys(this.params);
    const params = {}; 

    currentNames.forEach((currentName) => {
      if (Boolean(newNames[currentName])) {
        params[newNames[currentName]] = this.params[currentName];
      }
      else {
        params[currentName] = this.params[currentName];
      }
    });
    
    this.params = params;

    return this;
  }

  get() {
    return this.params;
  }
}

module.exports = ParamsFormatter;
