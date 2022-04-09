export const asyncWrapper = (fn) => async (...args) => {
    try {
            return await fn(...args);
    } catch(e) {
            args[args.length - 1](e)
    }
}
