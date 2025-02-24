//just like apiError file this file is used to give our api resposes a structure
// so that all the responses looks same and are consistant with out api

// this makes our code more manageble and more easy to develop around

class ApiResponse {
  constructor(statusCode, data, message = "Successful Response") {
    (this.statusCode = statusCode),
      (this.data = data),
      (this.message = message),
      // here success if true only if status code is below 400 that means everything went well
      (this.success = statusCode < 400);
  }
}
export { ApiResponse };

// STATUS CODES
// informational responses= 100-199
// successfull responses= 200-299
// redirectional message = 300-399
// client error responses = 400-499
// server side error responses = 500-599
