async function paginator(model, options = null){
    if(model === null || model === undefined){
        throw new Error('Please provide a valid model');
    }

    //set defualt values
    method  = options && options.method ? options.method : 'findAll';
    where = options && options.where ? options.where : {};
    page = options &&  options.page ? parseInt(options.page) : 1;
    limit = options &&  options.size ? parseInt(options.size) : 15;
    include = options &&  options.include ? options.include : null;

    //calculate
    const total = await model.count();
    const pages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    //format datas;
    const result = await model[method]({
        where,
        offset,
        limit,
        include
    });

    return {
        total,
        pages,
        currentPage : page,
        nextPage: page < pages ? page + 1 : null,
        rows : result,
    }
}

module.exports = paginator;
