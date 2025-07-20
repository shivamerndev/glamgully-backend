import joi from "joi"

export const productValidator = (productdata) => {
    const productschema = joi.object({
        title: joi.string().required(),
        price: joi.string().required(),
        quantity: joi.string().required(),
        discount: joi.string(),
        description: joi.string().required(),
        category: joi.string().required(),
    })
    return productschema.validate(productdata)
}