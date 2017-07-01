export function capitalize_first(a_string) {
    return a_string.charAt(0).toUpperCase() + a_string.slice(1);
};


export function capitalize_words(text)  {
    return text.replace(/\w\S*/g, (word) => {
        let [first_letter, rest] = [word.charAt(0), word.substr(1)];
        return first_letter.toUpperCase() + rest.toLowerCase();
    });
}

export function slugify(text){
    return text.replace(/[^\w\s]+/ig, '').replace(/\s+/gi, "-").toLowerCase();
}

export const is_alphanumeric = text => /^[a-z0-9]+$/i.test(text);