const mongoose=require('mongoose');
const campground=require('../models/campground.js')
const cities=require('./cities.js')
const {places,descriptors}=require('./seedHelpers.js')

//DB Connection Part
mongoose.connect('mongodb://localhost:27017/YelpCamp-maptiler')
.then(()=>{
    console.log("Connection Successful to DB");
})
.catch(()=>{
    console.log("Connection Error");
})

const sample=(array)=>array[Math.floor(Math.random()*array.length)]

const seedDB=async()=>{
    await campground.deleteMany({});
    for(let i=0;i<50;i++){
        const rand100=Math.floor(Math.random()*100)
        const randprice=Math.floor(Math.random()*100)
        const camps=await new campground({
            owner:"69dba5f9693fcbae71646a31",
            location:`${cities[rand100].city},${cities[rand100].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[rand100].longitude,
                    cities[rand100].latitude,
                ]
            },
            title:`${sample(descriptors)} ${sample(places)}`,
            images:[
                {
                    url: 'https://res.cloudinary.com/dfsbfkagj/image/upload/v1772994951/YelpCamp/pij52i8guwpyffg74s4c.png',
                    filename: 'YelpCamp/pij52i8guwpyffg74s4c',
                },
                {
                    url: 'https://res.cloudinary.com/dfsbfkagj/image/upload/v1772994959/YelpCamp/n1p8y1hmimcrr2wtisph.png',
                    filename: 'YelpCamp/n1p8y1hmimcrr2wtisph',
                }
            ],
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero asperiores, ea consequatur voluptate facilis quo saepe labore, quod possimus reiciendis corporis maiores dicta minus vel numquam dolorem animi a eaque!',
            price:`${randprice}`
        })
        await camps.save()
    }
}

seedDB().then(()=>mongoose.connection.close())