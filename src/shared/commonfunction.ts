function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        const error: any = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

function parseJSON(response) {
    return response.json();
}

function writeLog(str) {
    if (process.env.NODE_ENV !== 'test') {
        console.log(str);
    }
}
export { checkStatus, parseJSON, writeLog };
