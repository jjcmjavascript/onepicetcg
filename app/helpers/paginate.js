async function paginator(model, {method, where, page, size }){
    //set defualt values
    method  = method || 'findAll'; 
    where = where || {}; 
    page = parseInt(page || 1); 
    limit = parseInt(size || 15); 

    //calculate
    const total = await model.count(); 
    const pages = Math.ceil(total / limit); 
    const offset = (page - 1) * limit; 
    
    //format datas; 
    const result = await model[method]({
        where,
        offset,
        limit,
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