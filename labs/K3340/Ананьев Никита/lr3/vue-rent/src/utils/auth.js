function processAuthError(formData, cleaner, errRef, errText) {
    Object.assign(formData, cleaner())
    errRef.value = errText
}

export { processAuthError }