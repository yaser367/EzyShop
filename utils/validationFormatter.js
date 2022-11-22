const joiErrorFormatter = (rawErrors)=>{
    const errors = {}
    const details = rawErrors.details
    details.map(d => {
        errors[d.path] = [d.message]
    })
    return errors
}

module.exports = joiErrorFormatter