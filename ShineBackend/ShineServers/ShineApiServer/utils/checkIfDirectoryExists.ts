const checkIfDirectoryExists = (path:string) => {
    // if the directory exists, return true
    // if the directory doesn't exist, create it and return true, if it can't be created, return false
    if (Deno.statSync(path).isDirectory) {
        return true;
    }
    try {
        Deno.mkdirSync(path);

        return true;
    }
    catch (e) {
        return false;
    }
}

export default checkIfDirectoryExists;