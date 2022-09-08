function getParams(req){
    console.log(req.body);
    console.log(req.params);
    console.log(req.query);
}

module.exports =  getParams;