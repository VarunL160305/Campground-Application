const mongoose=require('mongoose');
const campground=require('../models/campground.js')
const cities=require('./cities.js')
const {places,descriptors}=require('./seedHelpers.js')

//DB Connection Part
mongoose.connect('mongodb://localhost:27017/YelpCamp')
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
        const rand100=Math.floor(Math.random()*1000)
        const randprice=Math.floor(Math.random()*1000)
        const camps=new campground({
            location:`${cities[rand100].city},${cities[rand100].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:`https://picsum.photos/400?random=${Math.random()}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero asperiores, ea consequatur voluptate facilis quo saepe labore, quod possimus reiciendis corporis maiores dicta minus vel numquam dolorem animi a eaque!',
            price:`${randprice}`
        })
        await camps.save()
    }
}

seedDB().then(()=>mongoose.connection.close())