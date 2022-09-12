class ParamsFormatter {
    constructor() {
        this.params = {};
        this.request = {};
        this.except = [];
        this.allowed = [];
    }

    iterate(object = {}) {
        Object.keys(object).forEach((key) => {
            if (this.except.includes(key) || this.allowed.length > 0 && !this.allowed.includes(key)) return;

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
        if (typeof request != 'object')
            throw Error("Invalid request")

        return this;
    }

    setRequest(request) {
        this.request = request;

        return this;
    }

    validateAndSetRequest(request) {
        this.validateRequest(request)
            .setRequest(request);

        return this;
    }

    fromAll(options = {}) {
        return this.setDenied(options.denied)
            .setAllowed(options.allowed)
            .fromBody()
            .fromParams()
            .fromQuery()
            .get()
    }

    getRenamedParams(newNames = {}) {
        const formatedParams = {};
        const currenNames = Object.keys(this.params);

        currenNames.forEach((keyName) => {
            let name = keyName; 
            if(Boolean(newNames[keyName])){
                name = newNames[keyName];
            }

            formatedParams[name] = this.params[keyName];;
        });

        return formatedParams; 
    }

    get() {
        return this.params;
    }
}

module.exports = ParamsFormatter;