// Function to send API response
function ApiResponse(res: any, statusCode: number, message: string, data: any = null) {

    // sending the response
    return res.status(statusCode).json({
        success: true,
        status: statusCode,
        message: message,
        data: data
    });

}

export default ApiResponse;
