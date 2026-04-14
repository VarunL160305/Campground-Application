const basejoi=require('joi');
const sanitizeHtml=require('sanitize-html')

const extension=(joi)=>({
    type:'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML':'{{#label}} must not include HTML'
    },
    rules:{
        escapeHTML:{
            validate(value,helper){
                const clean=sanitizeHtml(value,{
                    allowedTags:[],
                    allowedAttributes:{},
                })
                if(clean!==value) return helper.error('string.escapeHTML',{value})
                    return clean
            }
        }
    }
})

const joi=basejoi.extend(extension)

const campSchema=joi.object({
    title:joi.string().required().escapeHTML(),
    price:joi.number().required().min(0),
    description:joi.string().required().escapeHTML(),
    location:joi.string().required().escapeHTML(),
    deleteImages:joi.array()
}).required()

const reviewSchema=joi.object({
    rating:joi.number().required().min(0).max(5),
    body:joi.string().required().escapeHTML()
}).required()

module.exports={campSchema,reviewSchema};