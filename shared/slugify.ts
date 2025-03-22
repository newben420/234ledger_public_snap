export const Slugify = (str: String, maxLength: number = 100): string => {
    return str
        .toLowerCase() // make lower case
        .trim().replace(/[\s\n\t]{2,}/g, " ") // trim unwanted whitespaces
        .replace(/[^a-z0-9\-_\s]/g, "") // remove all symbols
        .replace(/[^a-z0-9]/g, "-") // replace non alphanumeric chars with dashes
        .replace(/(\-){2,}/g, "-").slice(0, maxLength).replace(/[^a-z0-9]+$/g, ""); // trim dashes
};