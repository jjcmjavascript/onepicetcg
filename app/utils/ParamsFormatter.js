class ParamsFormatter {
    constructor() {
        this.params = {};
        this.except = [];
        this.allowed = [];
        this.request = null
        this.regExp = []; 
    }   
    
    validateRequest(request) {
        if (typeof request != 'object')
            throw Error("Invalid request")

        return this;
    }

    validateValue(value){
        return value !== undefined 
            && this.regExp.every(reg => reg.test(value));
    }
    
    iterate(object = {}) {
        this.params = {};
        
        Object.keys(object).forEach((key) => {
            if (this.except.includes(key) || this.allowed.length > 0 && !this.allowed.includes(key)) return;

            const value = object[key];
            this.validateValue(value) && (this.params[key] = object[key]);  
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

    setRequest(request) {
        this.request = request;

        return this;
    }

    setAndValidateRequest(request){
        this.validateRequest(request)
            .setRequest(request);

        return this;
    }

    setRegExp(regExp) {
        this.regExp = Array.isArray(regExp) ? regExp: [regExp];
        return this;
    }

    fromAll(request, options = {}) {
        return this.setAndValidateRequest(request)
            .setDenied(options.denied)
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