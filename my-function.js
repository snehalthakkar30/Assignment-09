exports.handler = async (event) => {
    // TODO implement
   
    const response = {
        statusCode: 200,
        body: JSON.stringify('Snehal Manish Thakkar says '+ event.queryStringParameters.keyword),
    };

    return response;
};