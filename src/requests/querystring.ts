export function encode(obj){
    if (obj instanceof URLSearchParams){
        return obj.toString();
    }

    let p = new URLSearchParams();
    for(let name in obj){
        if (obj.hasOwnProperty(name)){
            p.append(name,  obj[name]);
        }
    }
    return p.toString();
}

export function decode(string) {
    return new URLSearchParams(string);
}
