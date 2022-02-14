
export function counterCodigo(value) {
    if(value.length > 0){
    value.length <= 10 || "Max 10 carácteres"
    }
}

export function counterDescripcion(value) {
    if(value.length > 0){
    value.length <= 50 || "Max 50 carácteres"
    }
}

export function counterReferentes(value) {
    if(!!value || (value && value.length > 0)){
    value.length <= 100 || "Max 100 carácteres"
    }
}

export function counterCodigoClienteFiscal(value) {
    if(value.length > 0){
    value.length <= 50 || "Max 50 caracteres"
    }
}

export function counterDescripcionClienteFiscal(value) {
    if(value.length > 0){
    value.length <= 100 || "Max 100 caracteres"
    }
}

export function counterDireccion(value) {
    if(value.length > 0){
    value.length <= 100 || "Max 100 caracteres"
    }
}

export function counterTelefono(value) {
    if(value.length > 0){
    value.length <= 100 || "Max 50 caracteres"
    }
}

export function counterIdFiscal(value) {
    if(value.length > 0){
    value.length <= 30 || "Max 30 caracteres"
    }
}

export function counterEmail(value) {
    if(value.length > 0){
    value.length <= 100 || "Max 100 caracteres"
    }
}

export function counterIIBB(value) {
    if(value.length > 0){
    value.length <= 30 || "Max 30 caracteres"
    }
}

export function checkCode(value){
    const pattern = /^$|^([A-Za-z0-9-,&!.–/áéíóú\u00f1\u00d1 ])*$/
    return !!value && pattern.test(value) || "Solo se permiten números, letras y -"
}

export function checkNumbers(value){
    const pattern = /^[0-9-]*$/
    return !!value && pattern.test(value) || "Solo se permiten números y -"
}

export function checkPhoneNumber(value){
    const pattern = /^([0-9() /,.;-])*$/;
    return !!value && pattern.test(value) || "Caracter ingresado no permitido";
}

export function checkDirection(value){
    const pattern = /^[A-Za-z-0-9 ]*$/
    return !!value && pattern.test(value) || "Sólo se permiten letras, números y -"
}

export function checkEmail(value){
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!value && pattern.test(value) || "E-mail Invalido";
}
